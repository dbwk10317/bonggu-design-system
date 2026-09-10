import { useCallback } from "react";
import {
  Button,
  Panel,
  ToastProvider,
  useToast,
  type ButtonProps,
  type PanelProps,
  type ToastOptions,
} from "@dbwk10317/bonggu-design-system";
import "@dbwk10317/bonggu-design-system/styles.css";
import mascotUrl from "@dbwk10317/bonggu-design-system/assets/mascot-neutral.svg";

const buttonProps: ButtonProps = { variant: "primary", type: "button" };
const panelProps: PanelProps = { fit: "flex", padding: "md" };
const toastOptions: ToastOptions = { message: "저장 완료", tone: "ok", duration: 1000 };

function ToastButton() {
  const { toast, dismiss } = useToast();
  const notify = useCallback(() => {
    const id = toast(toastOptions);
    dismiss(id);
  }, [dismiss, toast]);
  return <Button {...buttonProps} onClick={notify}>저장</Button>;
}

export function ConsumerApp() {
  return (
    <ToastProvider max={2}>
      <Panel {...panelProps} caption="패키지 소비 fixture">
        <img src={mascotUrl} alt="봉구" />
        <ToastButton />
      </Panel>
    </ToastProvider>
  );
}
