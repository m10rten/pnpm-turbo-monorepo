import { isEmpty } from "@/utils/null";

export function square(num: number): number {
  if (isEmpty(num)) return -1;
  return num * num;
}
