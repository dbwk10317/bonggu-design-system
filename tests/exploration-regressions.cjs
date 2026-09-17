const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { settle } = require('./visualization-regressions.cjs');

  const fields = [{key:'status',label:'서비스 상태',options:[{value:'ok',label:'정상'},{value:'warn',label:'응답 지연'}]}];
  const fixtures = [
    ['FilterBar',{fields,filters:[{id:'f',field:'status',operator:'equals',value:'warn'}],query:''}],
    ['SavedViews',{items:[{id:'long',name:'서울 서비스 지연을 확인하는 저장된 보기',value:{}}],value:{},selectedId:'long'}],
    ['TreeView',{nodes:[{id:'parent',label:'서울 지점의 아주 긴 서비스 이름',children:[{id:'child',label:'인증 API 워커의 상세 프로세스 정보'}]}],defaultExpandedIds:['parent']}],
    ['SplitPane',{first:'서비스 목록의 긴 항목 이름',second:'선택한 서비스의 상세 상태와 마지막 수집 정보'}],
    ['DataTable',{columnSettings:true,columns:[{key:'name',header:'서비스 이름'},{key:'value',header:'수치',align:'num'},{key:'status',header:'상태'}],rows:[{id:'a',name:'아주긴서비스식별자'.repeat(4),value:1234567890,status:'수집 지연'}],columnState:[{key:'name',width:300,pinned:true},{key:'value',width:180}]}],
    ['LogViewer',{searchable:true,lines:Array.from({length:40},(_,i)=>({id:String(i),level:i%2?'warn':'info',text:'긴서비스이름'.repeat(12)+i})),height:180}],
    ['Chart',{kind:'line',zoomable:true,xValues:[0,10,30,60,100],labels:['00:00','00:10','00:30','01:00','01:40'],series:[{label:'응답시간',values:[0,10,20,30,40]}],events:[{id:'deploy',value:30,label:'아주 긴 배포 이벤트 이름과 설명'.repeat(3)}],height:120,animate:false}],
  ];

function assertExplorationCoverage() {
  const root = path.resolve(__dirname, '../components');
  const registered = fs.readdirSync(root, {recursive:true}).filter(file => file.endsWith('.d.ts') && fs.readFileSync(path.join(root,file),'utf8').includes('@responsive')).map(file=>path.basename(file,'.d.ts')).sort();
  assert.deepEqual([...fixtures.map(([name])=>name),'StateTimeline','ImageViewer'].sort(),registered,'반응형 등록과 기능 검증 목록이 일치해야 합니다');
}

async function assertExploration(page, url) {
  assertExplorationCoverage();
  await page.goto(url);
  await page.waitForFunction(() => window.mount && window.Ds_d3ea90.ImageViewer);
  const setWidth = width => page.evaluate(width => { document.getElementById('app').style.width = `${width}px`; }, width);
  const mount = (name, props) => page.evaluate(({name,props}) => ReactDOM.flushSync(() => window.mount(name, props)), {name,props});
  let combinations = 0;
  for (const [name, props] of fixtures) for (const dark of [false,true]) for (const compact of [false,true]) for (const width of [180,320,640,1080,240]) {
    await page.evaluate(({dark,compact})=>{document.documentElement.classList.toggle('dark',dark); document.documentElement.dataset.density=compact?'compact':'default';},{dark,compact});
    await setWidth(width); await mount(name,props);
    if (name==='DataTable' && await page.getByRole('button',{name:'열 설정',exact:true}).getAttribute('aria-expanded') !== 'true') await page.getByRole('button',{name:'열 설정',exact:true}).click();
    await settle(page);
    const issues = await page.evaluate(()=>{
      const host=document.getElementById('app'),out=[];
      if(host.scrollWidth>host.clientWidth+1)out.push(`외부 넘침 ${host.scrollWidth}/${host.clientWidth}`);
      const controls=[...host.querySelectorAll('button,input,select,[role="separator"],[role="treeitem"]')];
      for(const el of controls){const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(!r.width||!r.height||cs.visibility==='hidden'||el.closest('[aria-hidden="true"]'))continue;
        if(r.height+1<(parseFloat(cs.minHeight)||0)||r.width+1<(parseFloat(cs.minWidth)||0))out.push(`조작 영역 축소 ${el.getAttribute('aria-label')||el.textContent}`);
        if((el.tagName==='BUTTON'||el.tagName==='INPUT'||el.tagName==='SELECT')&&r.height<23.5&&!el.closest('.bds-check,.bds-ctl,.bds-search'))out.push(`작은 조작 영역 ${el.outerHTML.slice(0,100)}`);
      }return out;
    });
    assert.deepEqual(issues,[],`${name} ${width} ${dark}/${compact}: ${issues.join(', ')}`);combinations++;
  }
  await page.evaluate(()=>{delete document.documentElement.dataset.density;document.documentElement.classList.remove('dark');});
  await setWidth(960);

  // Saving a view must restore filters and column configuration, not just its label.
  await page.evaluate(()=>{
    const D=window.Ds_d3ea90,h=React.createElement;
    D.__ViewsHarness=function(){const [filters,setFilters]=React.useState([]),[query,setQuery]=React.useState(''),[columns,setColumns]=React.useState([]),[views,setViews]=React.useState([]),[selected,setSelected]=React.useState(null);window.exploreState={filters,query,columns,views};return h(React.Fragment,null,
      h(D.FilterBar,{fields:[{key:'status',label:'서비스 상태',options:[{value:'ok',label:'정상'},{value:'warn',label:'응답 지연'}]}],filters,onFiltersChange:setFilters,query,onQueryChange:setQuery}),
      h(D.SavedViews,{items:views,value:{filters,query,columns},selectedId:selected,onSave:(name,value)=>{setViews([...views,{id:name,name,value:structuredClone(value)}]);setSelected(name);},onApply:v=>{setSelected(v.id);setFilters(v.value.filters);setQuery(v.value.query);setColumns(v.value.columns);},onRename:(id,name)=>setViews(views.map(v=>v.id===id?{...v,name}:v)),onDelete:id=>{setViews(views.filter(v=>v.id!==id));setSelected(null);}}),
      h(D.DataTable,{columnSettings:true,columnState:columns,onColumnStateChange:setColumns,columns:[{key:'name',header:'이름'},{key:'cpu',header:'CPU'},{key:'status',header:'상태'}],rows:[{id:1,name:'api',cpu:62,status:'정상'}]}));};ReactDOM.flushSync(()=>mount('__ViewsHarness',{}));
  });
  await page.getByRole('combobox',{name:'필터 값'}).selectOption('warn');await page.getByRole('button',{name:'추가',exact:true}).click();
  assert.equal(await page.locator('.bds-filter__tokens li').count(),1);
  await page.getByRole('searchbox',{name:'검색',exact:true}).fill('서울');
  await page.getByRole('button',{name:'열 설정',exact:true}).click();
  await page.getByRole('button',{name:'cpu 열 앞으로'}).click();
  await page.getByRole('spinbutton',{name:'cpu 열 너비'}).fill('220');
  await page.getByRole('textbox',{name:'보기 이름'}).fill('서울 지연');await page.getByRole('button',{name:'저장',exact:true}).click();
  await page.locator('.bds-filter').getByRole('button',{name:'초기화',exact:true}).click();
  await page.locator('.bds-table__settings').getByRole('button',{name:'초기화',exact:true}).click();
  await page.getByRole('combobox',{name:'저장된 보기'}).selectOption('서울 지연');
  assert.equal(await page.getByRole('searchbox',{name:'검색',exact:true}).inputValue(),'서울');
  assert.equal(await page.locator('th[data-column]').first().getAttribute('data-column'),'cpu');
  assert.equal(await page.getByRole('spinbutton',{name:'cpu 열 너비'}).inputValue(),'220');
  await page.getByRole('textbox',{name:'보기 이름'}).fill('새 이름');await page.getByRole('button',{name:'이름 변경'}).click();
  assert.equal(await page.getByRole('combobox',{name:'저장된 보기'}).locator('option:checked').textContent(),'새 이름');
  await page.getByRole('button',{name:'삭제',exact:true}).click();assert.equal(await page.evaluate(()=>exploreState.views.length),0);

  await mount('TreeView',{nodes:[{id:'p',label:'서버',children:[{id:'a',label:'인증'},{id:'b',label:'워커'}]}]});await settle(page);
  await page.getByRole('treeitem',{name:'서버',exact:false}).focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.node),'a');
  await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.dataset.node),'b');
  await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');assert.equal(await page.getByRole('treeitem').count(),1);
  await mount('TreeView',{nodes:[{id:'new',label:'교체된 서버'}]});await settle(page);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.node),'new');

  await mount('SplitPane',{first:'목록',second:'상세'});await settle(page);await page.getByRole('separator').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('separator').getAttribute('aria-valuenow'),'40');await settle(page);
  const divider=await page.getByRole('separator').boundingBox();await page.mouse.move(divider.x+divider.width/2,divider.y+divider.height/2);await page.mouse.down();await page.mouse.move(divider.x+140,divider.y+divider.height/2);await page.mouse.up();
  assert(Number(await page.getByRole('separator').getAttribute('aria-valuenow'))>40);
  await setWidth(320);await settle(page);assert.equal(await page.getByRole('separator').isVisible(),false);
  assert(await page.evaluate(()=>{const a=document.querySelector('.bds-split__first').getBoundingClientRect(),b=document.querySelector('.bds-split__second').getBoundingClientRect();return b.top>=a.bottom;}));

  await setWidth(640);
  await page.evaluate(()=>{const D=Ds_d3ea90;D.__LogsHarness=function(){const [lines,setLines]=React.useState(Array.from({length:80},(_,i)=>({id:String(i),level:i%2?'warn':'info',text:`로그 ${i} service ${i%2?'timeout':'ok'}`})));window.addLogs=()=>setLines(old=>[...old,...Array.from({length:3},(_,i)=>({id:`new${i}`,level:'info',text:'new line'}))].slice(-80));return React.createElement(D.LogViewer,{lines,searchable:true,height:260});};ReactDOM.flushSync(()=>mount('__LogsHarness',{}));});
  await settle(page);await page.getByRole('button',{name:'일시 정지'}).click();await page.locator('.bds-log').evaluate(el=>{el.scrollTop=0;});
  const oldTop=await page.locator('.bds-log').evaluate(el=>el.scrollTop);await page.evaluate(()=>addLogs());await settle(page);
  assert.equal(await page.locator('.bds-log').evaluate(el=>el.scrollTop),oldTop);
  assert.equal(await page.getByRole('button',{name:'따라가기 · 3건'}).count(),1);
  await page.getByRole('searchbox',{name:'로그 검색'}).fill('timeout');await settle(page);assert(await page.locator('.bds-log mark').count()>0);
  const firstMatch=await page.locator('.bds-log__line--match').getAttribute('data-log-index');await page.getByRole('button',{name:'다음 검색 결과'}).click();await settle(page);
  assert.notEqual(await page.locator('.bds-log__line--match').getAttribute('data-log-index'),firstMatch);
  await page.getByRole('combobox',{name:'로그 레벨'}).selectOption('warn');assert.equal(await page.locator('.bds-log__lv--info').count(),0);
  await page.getByRole('button',{name:/따라가기/}).click();await settle(page);
  assert(await page.locator('.bds-log').evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop<2));

  // Different sampling intervals share the data coordinate, not the array index.
  await page.evaluate(()=>{const D=Ds_d3ea90,h=React.createElement;D.__ChartsHarness=function(){const [cursor,setCursor]=React.useState(null),[range,setRange]=React.useState(null);window.chartRange=range;return h(React.Fragment,null,
    h(D.Chart,{kind:'line','aria-label':'첫 차트',zoomable:true,xValues:[0,10,30,60,100],labels:['T0','T10','T30','T60','T100'],series:[{label:'첫 값',values:[0,10,20,30,40]}],hoverValue:cursor,onHoverValueChange:setCursor,range,onRangeChange:setRange,height:180,animate:false,events:[{id:'deploy',value:30,label:'배포 시작'}]}),
    h(D.Chart,{kind:'line','aria-label':'둘째 차트',xValues:[0,30,100],labels:['T0','T30','T100'],series:[{label:'둘째 값',values:[100,200,300]}],hoverValue:cursor,onHoverValueChange:setCursor,range,onRangeChange:setRange,height:180,animate:false}));};ReactDOM.flushSync(()=>mount('__ChartsHarness',{}));});
  await settle(page);await page.getByRole('application',{name:'첫 차트 탐색'}).focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await settle(page);
  assert.equal(await page.locator('.bds-chart__tip-t').nth(1).textContent(),'T30');
  await page.getByRole('combobox',{name:'확대 시작'}).selectOption('10');await page.getByRole('combobox',{name:'확대 종료'}).selectOption('60');await page.getByRole('button',{name:'확대',exact:true}).click();await settle(page);
  assert.deepEqual(await page.evaluate(()=>chartRange),[10,60]);assert.equal(await page.locator('.bds-chart__event').count(),1);
  await page.getByRole('button',{name:'초기화',exact:true}).click();await settle(page);assert.equal(await page.evaluate(()=>chartRange),null);
  const plot=await page.locator('.bds-chart__svg').first().evaluate(el=>{const b=el.getBoundingClientRect(),clip=el.querySelector('clipPath rect');return{x:b.x+Number(clip.getAttribute('x')),y:b.y+50,w:Number(clip.getAttribute('width'))};});
  await page.mouse.move(plot.x+plot.w*.1,plot.y);await page.mouse.down();await page.mouse.move(plot.x+plot.w*.6,plot.y,{steps:6});await page.mouse.up();await settle(page);
  assert.deepEqual(await page.evaluate(()=>chartRange),[10,60]);

  await page.evaluate(()=>{const D=Ds_d3ea90,h=React.createElement;D.__ImageHarness=function(){const [open,setOpen]=React.useState(false),[index,setIndex]=React.useState(0);return h(React.Fragment,null,h(D.Button,{onClick:()=>{setIndex(0);setOpen(true);}},'사진 열기'),h(D.ImageViewer,{open,index,onIndexChange:setIndex,onClose:()=>setOpen(false),images:[{id:'a',src:'/assets/mascot-neutral.svg',alt:'봉구 안내 이미지',metadata:[{label:'파일명',value:'아주긴이미지이름'.repeat(20)}]},{id:'b',src:'/assets/favicon.svg',alt:'서비스 마크'}]}));};ReactDOM.flushSync(()=>mount('__ImageHarness',{}));});
  for(const viewport of [{width:1280,height:800},{width:390,height:640},{width:640,height:320}]){
    await page.setViewportSize(viewport);await setWidth(Math.min(640,viewport.width));await page.getByRole('button',{name:'사진 열기',exact:true}).click();await page.getByRole('img',{name:'봉구 안내 이미지'}).waitFor();await settle(page);
    assert(await page.getByRole('dialog').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1&&el.scrollWidth<=el.clientWidth+1;}),'이미지 뷰어 경계');
    await page.getByRole('button',{name:'확대',exact:true}).click();await settle(page);
    assert(await page.getByRole('region',{name:'이미지 확대 영역'}).evaluate(el=>el.scrollWidth>el.clientWidth),'확대는 내부 스크롤');
    await page.getByRole('button',{name:'다음 이미지'}).click();await page.getByRole('img',{name:'서비스 마크'}).waitFor();await settle(page);
    assert(await page.getByRole('region',{name:'이미지 확대 영역'}).evaluate(el=>el.scrollWidth<=el.clientWidth+1),'사진 변경 뒤 화면 맞춤');
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert(await page.getByRole('button',{name:'사진 열기',exact:true}).evaluate(el=>el===document.activeElement),'뷰어 닫힘 포커스 복원');
  }
  await page.setViewportSize({width:1280,height:900});
  console.log(`PASS exploration regressions: ${combinations} 폭·테마·밀도 조합, 저장·열 설정·트리·분할·로그·연동 확대·이미지 모달`);
}
module.exports={assertExploration,assertExplorationCoverage};
