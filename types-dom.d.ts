// Token values are passed as inline custom properties (`style={{ "--bar": ... }}`); React's CSSProperties
// doesn't know `--*` keys, so it is widened once here. Type-check only: not in package.json files, so not shipped.
import "react";
declare module "react" {
  /** popover is standard HTML but missing from React 18 types; DropdownMenu uses the native popover. */
  interface HTMLAttributes<T> {
    popover?: "auto" | "manual";
  }
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
