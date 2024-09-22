import { reconcileChildren } from '@/reconciler/reconciler';
import type { Fiber } from '@/types/fiber';

/** Global variables */
let nextUnitOfWork: Fiber | undefined;
let wipRoot: Fiber;
let currentRoot: Fiber;
let wipFiber = null;
let stateHookIndex = null;

function updateFunctionComponent(fiber: Fiber) {
  wipFiber = fiber;
  stateHookIndex = 0;
  wipFiber.stateHooks = [];
  wipFiber.effectHooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = document.createElement(fiber.type);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function createElement(type: string, props: object, ...childrens: any[]) {
  return {
    type,
    props: {
      ...props,
      children: childrens.map((child) => {
        if (typeof child === 'object' && child !== null) {
          return child;
        }
        return createTextElement(child);
      }),
    },
  };
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const isEvent = (key: string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children';
const isNew = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => prev[key] !== next[key];
const isGone = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => !(key in next);

function createDom(fiber: Fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

function updateDom(dom: HTMLElement, prevProps: Record<string, any>, nextProps: Record<string, any>) {
  Object.keys(prevProps).forEach((key) => {
    /** remove old events */
    if (isEvent(key) && (!(key in nextProps) || isNew(prevProps, nextProps)(key))) {
      const eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[key]);
    }

    /** remove old properties */
    if (isProperty(key) && isGone(prevProps, nextProps)(key)) {
      // @ts-ignore
      dom[key] = '';
    }

    /** update new events */
    if (isEvent(key) && isNew(prevProps, nextProps)(key)) {
      const eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[key]);
    }

    /** update new properties */
    if (isProperty(key) && isNew(prevProps, nextProps)(key)) {
      // @ts-ignore
      dom[key] = nextProps[key];
    }
  });
}

/**
 * 处理每个 fiber 节点之后，会按照 child、sibling、return 的顺序返回下一个要处理的 fiber 节点：
 */
function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
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
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// export function render(element: Fiber, container: HTMLElement) {
//   const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);

//   const isProperty = (key: string) => key !== 'children';

//   Object.keys(element.props).forEach((key) => {
//     if (isProperty(key)) {
//       dom[key] = element.props[key];
//     }
//   });

//   container.appendChild(dom);
// }

export function render(element: Fiber, container: HTMLElement) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}
