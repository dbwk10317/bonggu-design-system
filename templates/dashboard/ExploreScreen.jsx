(() => {
const { PageStack, PageHeader, Panel, CardHead, Stack, Inline, Button, FilterBar, SavedViews, DataTable, SplitPane, TreeView, Chart, StateTimeline, LogViewer, JustifiedGallery, ImageViewer, StatusPill } = window.DS;
/** @type {{id:string,name:string,status:"ok"|"warn",cpu:number,region:string}[]} */
const services = [{id:"api",name:"인증 API",status:"warn",cpu:68,region:"서울"},{id:"storage",name:"저장소 서비스",status:"ok",cpu:34,region:"서울"},{id:"worker",name:"추론 워커",status:"ok",cpu:82,region:"부산"}];
const times = [0,10,20,40,60,90].map(minutes => Date.UTC(2026,8,17,9,minutes));
const labels = times.map(time => new Date(time).toISOString().slice(11,16));
const fields = [{key:"status",label:"상태",options:[{value:"ok",label:"정상"},{value:"warn",label:"지연"}]},{key:"region",label:"지역",options:[{value:"서울",label:"서울"},{value:"부산",label:"부산"}]}];
const photos = [{id:"front",src:"../../assets/mascot-neutral.svg",alt:"봉구 안내 이미지",width:400,height:400},{id:"mark",src:"../../assets/favicon.svg",alt:"봉구 서비스 마크",width:128,height:128}];
function ExploreScreen() {
  const [filters,setFilters] = React.useState(/** @type {import("../../components/input/FilterBar.d.ts").FilterToken[]} */ ([]));
  const [query,setQuery] = React.useState("");
  const [columns,setColumns] = React.useState(/** @type {import("../../components/data/DataTable.d.ts").TableColumnState[]} */ ([]));
  const [sort,setSort] = React.useState(/** @type {import("../../components/data/DataTable.d.ts").DataTableSort} */ ({key:"name",dir:"asc"}));
  const [views,setViews] = React.useState(/** @type {import("../../components/navigation/SavedViews.d.ts").SavedView<any>[]} */ ([]));
  const nextView = React.useRef(1), nextLog = React.useRef(4);
  const [viewId,setViewId] = React.useState(/** @type {string | null} */ (null));
  const [node,setNode] = React.useState("all");
  const [cursor,setCursor] = React.useState(/** @type {number | null} */ (null));
  const [range,setRange] = React.useState(/** @type {[number,number] | null} */ (null));
  const [image,setImage] = React.useState(/** @type {number | null} */ (null));
  const [logs,setLogs] = React.useState(/** @type {import("../../components/data/LogViewer.d.ts").LogLine[]} */ ([{id:"1",level:"info",time:"09:00",text:"서비스 점검을 시작했습니다."},{id:"2",level:"warn",time:"09:20",text:"인증 API 응답이 지연됩니다."},{id:"3",level:"ok",time:"09:40",text:"연결을 복구했습니다."}]));
  const rows = services.filter(row => (node === "all" || node === row.id) && row.name.toLowerCase().includes(query.toLowerCase()) && filters.every(filter => filter.operator === "notEquals" ? String(row[filter.field]) !== filter.value : filter.operator === "contains" ? String(row[filter.field]).includes(filter.value) : String(row[filter.field]) === filter.value)).sort((a,b) => String(a[sort.key]).localeCompare(String(b[sort.key]),"ko",{numeric:true}) * (sort.dir === "asc" ? 1 : -1));
  return <PageStack aria-label="서비스 탐색">
    <PageHeader title="탐색" description="조건을 저장하고, 같은 시간의 지표와 상태 구간을 비교합니다." />
    <Panel><Stack gap={4}><CardHead title="서비스 찾기" />
      <SavedViews items={views} selectedId={viewId} value={{filters,query,columns,sort,node}} onApply={view=>{setViewId(view.id);setFilters(view.value.filters);setQuery(view.value.query);setColumns(view.value.columns);setSort(view.value.sort);setNode(view.value.node);}} onSave={(name,value)=>{const id=String(nextView.current++);setViews([...views,{id,name,value:structuredClone(value)}]);setViewId(id);}} onRename={(id,name)=>setViews(views.map(view=>view.id===id?{...view,name}:view))} onDelete={id=>{setViews(views.filter(view=>view.id!==id));if(viewId===id)setViewId(null);}} />
      <FilterBar fields={fields} filters={filters} onFiltersChange={setFilters} query={query} onQueryChange={setQuery} />
      <SplitPane firstLabel="서비스 계층" secondLabel="서비스 목록" first={<TreeView aria-label="서비스 계층" nodes={[{id:"all",label:"전체 서비스",children:services.map(row=>({id:row.id,label:row.name}))}]} selectedId={node} onSelect={setNode} defaultExpandedIds={["all"]} />} second={<DataTable aria-label="서비스 목록" rows={rows} rowKey={row=>row.id} sort={sort} onSortChange={setSort} columnSettings columnState={columns} onColumnStateChange={setColumns} columns={[{key:"name",header:"서비스",sortable:true},{key:"status",header:"상태",render:row=><StatusPill tone={row.status}>{row.status==="ok"?"정상":"지연"}</StatusPill>},{key:"cpu",header:"CPU %",align:"num",sortable:true},{key:"region",header:"지역"}]} />} />
    </Stack></Panel>
    <Panel><Stack gap={4}><CardHead title="같은 시간 비교" meta="커서와 확대 구간 공유" />
      <Chart kind="line" aria-label="CPU 사용률" height={180} labels={labels} xValues={times} hoverValue={cursor} onHoverValueChange={setCursor} range={range} onRangeChange={setRange} zoomable valueFormatter={v=>`${v}%`} series={[{label:"CPU",values:[22,34,68,49,32,28]}]} events={[{id:"deploy",value:times[2],label:"09:20 인증 서비스 배포"}]} />
      <Chart kind="area" aria-label="응답시간" height={180} labels={labels} xValues={times} hoverValue={cursor} onHoverValueChange={setCursor} range={range} onRangeChange={setRange} valueFormatter={v=>`${v} ms`} series={[{label:"응답",values:[34,42,260,120,44,35]}]} />
      <StateTimeline aria-label="서비스 상태 구간" from={times[0]} to={times.at(-1)} formatTime={time=>new Date(time).toISOString().slice(11,16)} rows={services.map(row=>({id:row.id,label:row.name,intervals:[{id:"first",start:times[0],end:times[2],status:"ok",label:"정상"},{id:"middle",start:times[2],end:times[3],status:row.status,label:row.status==="warn"?"응답 지연":"정상"},{id:"last",start:times[3],end:times[5],status:"ok",label:"정상"}]}))} />
    </Stack></Panel>
    <Panel><Stack gap={3}><CardHead title="서비스 로그" meta={<Button variant="secondary" onClick={()=>{const id=String(nextLog.current++);setLogs([...logs,{id,level:"info",time:"10:30",text:`서비스 상태를 확인했습니다. 이벤트 ${id}`}]);}}>로그 추가</Button>} /><LogViewer searchable lines={logs} aria-label="탐색 로그" height={320} /></Stack></Panel>
    <Panel><Stack gap={3}><CardHead title="참고 이미지" /><JustifiedGallery items={photos} onOpen={(_,index)=>setImage(index)} /></Stack></Panel>
    <ImageViewer open={image!=null} onClose={()=>setImage(null)} index={image??0} onIndexChange={setImage} images={photos.map(photo=>({...photo,title:photo.alt,metadata:[{label:"서비스",value:"봉구 엣지 콘솔"}]}))} />
  </PageStack>;
}
window.ExploreScreen = ExploreScreen;
})();
