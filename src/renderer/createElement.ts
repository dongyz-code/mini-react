import { ELEMENT_TYPE } from '@/constant';
import type { ReactElement } from '@/types/fiber';
/**
 * 文本节点是没有 type、children、props 的, 所以需要单独处理
 * @param text
 * @returns
 */
function createTextElement(text: string): ReactElement {
  return {
    type: ELEMENT_TYPE.TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type: ELEMENT_TYPE, props: object, ...childrens: ReactElement[]): ReactElement {
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
