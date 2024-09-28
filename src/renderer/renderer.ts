import { createRoot } from '@/fiber/fiber';
import type { Fiber, ReactElement } from '@/types/fiber';

const isEvent = (key: string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children';
const isNew = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => prev[key] !== next[key];
const isGone = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => !(key in next);

/** 根据Fiber节点创建真实DOM */
export function createDom(fiber: Fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  if (fiber.type === 'TEXT_ELEMENT') {
    console.log('update dom', dom);
  }

  return dom;
}

export function updateDom(dom: HTMLElement, prevProps: Record<string, any>, nextProps: Record<string, any>) {
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
  });

  Object.keys(nextProps).forEach((key) => {
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
 * render函数主要逻辑：
 * 1. 根据root container容器创建root fiber节点
 * 2. 将nextUnitOfWork指向root fiber节点
 * @param element react element tree
 * @param container root container
 */
export function render(element: ReactElement, container: HTMLElement) {
  createRoot(element, container);
}
