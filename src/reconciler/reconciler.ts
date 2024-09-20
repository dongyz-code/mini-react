import { Fiber } from '@/types/fiber';

/** Global variables */
let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;

/**
 * Reconciles the children of a fiber with the given elements.
 * @param wipFiber Work in progress fiber
 * @param elements Elements to be reconciled
 */
export function reconcileChildren(wipFiber: Fiber, elements: HTMLElement[]) {}
