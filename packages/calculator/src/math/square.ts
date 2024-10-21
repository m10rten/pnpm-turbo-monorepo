import { isEmpty } from "@/utils/null.ts";

export function square(num: number): number {
  if (isEmpty(num)) return -1;
  return num * num;
}
