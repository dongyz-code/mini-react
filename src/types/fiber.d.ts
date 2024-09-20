export interface Fiber {
  /**  用于连接其他Fiber节点形成Fiber树 */
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;

  /** 指向该fiber在另一次更新时对应的fiber */
  alternate: Fiber | null;

  /** 节点索引 */
  index: number;

  /** 节点类型 */
  tag: string;
  key: string | null;
  elementType: any;
  stateNode: any;
  type: any;
  props: any;

  /** 节点状态 */
  state: any;

  /** 节点深度 */
  depth: number;

  /** 节点更新标识 */
  effectTag: number;
  firstEffect: Fiber | null;
  lastEffect: Fiber | null;

  /** 节点对应的真实 DOM 节点 */
  dom: any;
}
