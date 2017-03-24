import { createObserver } from './observer';


export function createTemplateBinding(binder, nodePath, getter, callbacks = {}) {
  return {
    binder: binder,
    nodePath: nodePath,
    getter: getter,
    created: callbacks.created || noop,
    attached: callbacks.attached || noop,
    detached: callbacks.detached || noop,
    disposed: callbacks.disposed || noop,
  };
}


export function createViewBinding(templateBinding, view, args) {
  if (templateBinding.getter) {
    let observer = createObserver(args, templateBinding.getter, templateBinding.update);
  }

  return {
    binder: templateBinding.binder,
    node: templateBinding.nodePath.reduce(findElement, view),
    observer: observer
  };
}





function findElement(node, index) {
  return node.childNodes[index];
}

function noop() {}
