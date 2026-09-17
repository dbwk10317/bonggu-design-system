import { useCallback, useRef, useState, type FormEvent, type Key } from "react";
import {
  Button,
  FilterBar, SavedViews, TreeView, SplitPane, StateTimeline, ImageViewer, LogViewer,
  type FilterToken, type SavedView, type TableColumnState,
  Chart,
  DataTable,
  Field,
  Modal,
  Panel,
  Select,
  SidebarNavItem,
  SidebarShell,
  TextField,
  ToastProvider,
  useToast,
  type ButtonProps,
  type ChartSeries,
  type ChartSegment,
  type DataTableColumn,
  type PanelProps,
  type ToastOptions,
} from "@dbwk10317/bonggu-design-system";
import "@dbwk10317/bonggu-design-system/styles.css";
import mascotUrl from "@dbwk10317/bonggu-design-system/assets/mascot-neutral.svg";

const buttonProps: ButtonProps = { variant: "primary", type: "button" };
const panelProps: PanelProps = { fit: "flex", padding: "md" };
const toastOptions: ToastOptions = { message: "저장 완료", tone: "ok", duration: 1000 };

type NodeRow = { id: string; name: string; cpu: number | null };
const columns: DataTableColumn<NodeRow>[] = [
  { key: "name", header: "이름" },
  { key: "cpu", header: "CPU", align: "num", hideBelow: "tablet" },
];
const rows: NodeRow[] = [{ id: "a", name: "edge-a", cpu: 12 }, { id: "b", name: "edge-b", cpu: null }];
const segments: ChartSegment[] = [{ label: "정상", value: 12 }, { label: "수집 지연", value: null }];
const series: ChartSeries[] = [{ label: "요청", tone: 1, values: [1, 2, null, 4] }];

function ToastButton() {
  const { toast, dismiss } = useToast();
  const notify = useCallback(() => {
    const id = toast(toastOptions);
    dismiss(id);
  }, [dismiss, toast]);
  return <Button {...buttonProps} onClick={notify}>저장</Button>;
}

/** What form libraries expect: input ref, native select, submit, confirm modal. */
function NodeForm() {
  const input = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) { input.current?.focus(); return; }
    setOpen(true);
  };
  return (
    <form onSubmit={onSubmit}>
      <Field label="노드 이름" required>
        <TextField ref={input} value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field label="지역">
        <Select options={[{ value: "seoul", label: "서울" }]} defaultValue="seoul" />
      </Field>
      <Button type="submit" variant="primary">등록</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="등록 확인" actions={<Button onClick={() => setOpen(false)}>닫기</Button>}>
        {name}
      </Modal>
    </form>
  );
}

export function ConsumerApp() {
  const [selected, setSelected] = useState<Key[]>([]);
  return (
    <ToastProvider max={2}>
      <SidebarShell brand={{ name: "fixture" }} nav={<SidebarNavItem label="개요" active />}>
        <Panel {...panelProps} caption="패키지 소비 fixture">
          <img src={mascotUrl} alt="봉구" />
          <ToastButton />
          <NodeForm />
          <DataTable fit="auto" aria-label="노드" columns={columns} rows={rows} rowKey={(row) => row.id} rowLabel={(row) => row.name}
            selectable selectedKeys={selected} onSelectionChange={setSelected} />
          <Chart fit="auto" kind="line" aria-label="요청" labels={["1", "2", "3", "4"]} series={series} />
          <Chart kind="pie" segments={segments} />
        </Panel>
        <ExplorationConsumer />
      </SidebarShell>
    </ToastProvider>
  );
}


export function ExplorationConsumer() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterToken[]>([]);
  const [columnState, setColumnState] = useState<TableColumnState[]>([]);
  const [views, setViews] = useState<SavedView<{ query: string; filters: FilterToken[]; columnState: TableColumnState[] }>[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  return <Panel><FilterBar fields={[{key:"name",label:"이름"}]} query={query} onQueryChange={setQuery} filters={filters} onFiltersChange={setFilters} />
    <SavedViews items={views} value={{query,filters,columnState}} onApply={view=>{setQuery(view.value.query);setFilters(view.value.filters);setColumnState(view.value.columnState);}} onSave={(name,value)=>setViews([...views,{id:name,name,value}])} />
    <SplitPane first={<TreeView nodes={[{id:"a",label:"인증 서비스"}]} selectedId={selected} onSelect={setSelected} />} second={<DataTable rows={rows} columns={columns} columnSettings columnState={columnState} onColumnStateChange={setColumnState} />} />
    <StateTimeline formatTime={v=>`${v}분`} rows={[{id:"a",label:"인증 서비스",intervals:[{id:"ok",start:0,end:60,status:"ok",label:"정상"}]}]} />
    <LogViewer searchable lines={[{id:"1",level:"info",text:"연결됐습니다."}]} />
    <ImageViewer open={false} images={[]} />
  </Panel>;
}
