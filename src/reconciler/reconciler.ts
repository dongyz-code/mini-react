import { EFFECT_TAG } from '@/constant/index';
import type { Fiber, ReactElement } from '@/types/fiber';

/**
 * reconcile 阶段是在 render 阶段之后进行
 * 主要负责比较新旧两棵树（即新旧虚拟 DOM），并计算出实际的 DOM 更新
 * 这个阶段会标记出哪些节点需要被添加、删除或更新。
 * React 会在这个阶段为每个需要更新的节点打上相应的 EFFECT_TAG，然后在提交阶段（Commit 阶段）统一处理这些更新。
 * @param workInProgress Work in progress fiber
 * @param elements Elements to be reconciled
 */
export function reconcileChildren(workInProgress: Fiber, elements: ReactElement[]) {
  let index = 0;
  let oldFiber = workInProgress.alternate?.child;
  let prevSibling: Fiber;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: Fiber;

    const sameType = element?.type === oldFiber?.type;

    if (sameType) {
      newFiber = {
        type: oldFiber?.type,
        props: element.props,
        stateNode: oldFiber?.stateNode,
        return: workInProgress,
        alternate: oldFiber!,
        effectTag: EFFECT_TAG.UPDATE,
        element,
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        stateNode: undefined,
        return: workInProgress,
        alternate: undefined,
        effectTag: EFFECT_TAG.PLACEMENT,
        element,
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = EFFECT_TAG.DELETION;

      // TODO: delete oldFiber from the tree
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      workInProgress.child = newFiber!;
    } else if (element) {
      prevSibling!.sibling = newFiber!;
    }

    prevSibling = newFiber!;
    index++;
  }
}
