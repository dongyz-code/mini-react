export interface VNode {
  type: string | Function;
  props: any;
  key: string | number;
}
