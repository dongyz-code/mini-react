import { EFFECT_TAG, ELEMENT_TYPE } from '@/constant/index';

export type ReactElement = {
  type: ELEMENT_TYPE;
  props: {
    children: ReactElement[];
    [propName: string]: any;
  };
};

export interface Fiber {
  /**  用于连接其他Fiber节点形成Fiber树 */
  return?: Fiber;
  child?: Fiber;
  sibling?: Fiber;

  /** 指向该fiber在另一次更新时对应的fiber */
  alternate?: Fiber;

  /** 节点索引 */
  index?: number;

  /** 节点类型 */
  tag?: string;
  key?: string;
  element: ReactElement;
  /** 真实DOM节点 */
  stateNode?: HTMLElement;
  type?: any;
  props?: any;

  /** 节点状态 */
  state?: any;

  /** 节点深度 */
  depth?: number;

  /** 节点更新标识 */
  effectTag?: EFFECT_TAG;
  firstEffect?: Fiber;
  lastEffect?: Fiber;

  stateHooks?: (() => void)[];
  effectHooks?: (() => void)[];
}
