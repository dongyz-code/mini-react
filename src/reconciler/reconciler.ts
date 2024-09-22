import { Fiber } from '@/types/fiber';
import { EFFECT_TAG } from '@/constant/index';

/**
 * Reconciles the children of a fiber with the given elements.
 * @param workInProgress Work in progress fiber
 * @param elements Elements to be reconciled
 */
export function reconcileChildren(workInProgress: Fiber, elements: Fiber[]) {
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
        props: element?.props,
        dom: oldFiber?.dom,
        return: workInProgress,
        alternate: oldFiber!,
        effectTag: EFFECT_TAG.UPDATE,
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        return: workInProgress,
        alternate: undefined,
        effectTag: EFFECT_TAG.PLACEMENT,
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
