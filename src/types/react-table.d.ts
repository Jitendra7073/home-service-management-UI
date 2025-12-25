import "@tanstack/react-table";
import type { QueryClient } from "@tanstack/react-query";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    queryClient?: QueryClient;
  }
}
