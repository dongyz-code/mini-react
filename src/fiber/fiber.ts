import { EFFECT_TAG, ELEMENT_TYPE } from '@/constant/index';
import { reconcileChildren } from '@/reconciler/reconciler';
import { createDom, updateDom } from '@/renderer/renderer';
import type { Fiber, ReactElement } from '@/types/fiber';

/** Global variables */
let nextUnitOfWork: Fiber | undefined;
/** 当前工作的 fiber 树  */
let workInProgressRoot: Fiber;
/** 上一次渲染的 fiber 树 */
let currentRoot: Fiber;
let currentFunctionFiber: Fiber | null = null;
/**  当前正在执行的函数组件对应 fiber */
let stateHookIndex = null;
/** 要执行删除 dom 的 fiber */
let deletions: Fiber[] = [];

/** 将某个 fiber 加入 deletions 数组 */
export function deleteFiber(fiber: Fiber) {
  deletions.push(fiber);
}

/** 获取 deletions 数组 */
export function getDeletions() {
  return deletions;
}

export function createRoot(element: ReactElement, container: HTMLElement) {
  workInProgressRoot = {
    stateNode: container,
    props: {
      children: [element], // 此时的element还只是React.createElement函数创建的virtual dom树
    },
    alternate: currentRoot,
    // element: element,
  };
  deletions = [];
  nextUnitOfWork = workInProgressRoot;
}

function commitWork(fiber?: Fiber) {
  if (!fiber) {
    return;
  }

  let parentDom = fiber?.return?.stateNode!;

  if (fiber.effectTag === EFFECT_TAG.DELETION) {
    if (fiber.type instanceof Function) {
      parentDom?.removeChild(fiber.stateNode!);
    }
    return;
  }

  /** 深度优先遍历，先遍历child， 后遍历 sibling */
  commitWork(fiber.child);

  if (fiber.effectTag === EFFECT_TAG.PLACEMENT) {
    // 如果有 index 则说明是插入到某个位置，否则是追加到最后
    const targetPositionDom = parentDom?.childNodes[fiber.index!]; // 要插入到那个 dom 之前

    if (targetPositionDom) {
      parentDom.insertBefore(fiber.stateNode!, targetPositionDom);
    } else {
      parentDom.appendChild(fiber.stateNode!);
    }
  } else if (fiber.effectTag === EFFECT_TAG.UPDATE) {
    // @ TODO:
    const { children, ...newAttributes } = fiber.element.props;
    const oldAttributes = Object.assign({}, fiber?.alternate?.element.props);
    updateDom(fiber.stateNode!, newAttributes, oldAttributes);
  }

  commitWork(fiber.sibling);
}

function commitRoot() {
  // deletions.forEach();
}

function updateFunctionComponent(fiber: Fiber) {
  currentFunctionFiber = fiber;
  stateHookIndex = 0;
  currentFunctionFiber.stateHooks = [];
  currentFunctionFiber.effectHooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.stateNode) {
    fiber.stateNode = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * 处理每个 fiber 节点之后，会按照 child、sibling、return 的顺序返回下一个要处理的 fiber 节点：
 */
function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    // 如果是函数组件，则需要调用该组件，并将其返回的 JSX 元素转换为 fiber 节点
    updateFunctionComponent(fiber);
  } else {
    // 如果是普通节点，则直接更新该节点
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber: Fiber | null | undefined = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;

    console.log('workInProgressRoot', workInProgressRoot);
    console.log('currentRoot', currentRoot);
  }

  if (!nextUnitOfWork && currentFunctionFiber) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
