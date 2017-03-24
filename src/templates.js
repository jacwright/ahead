import { createChain, insertChain, removeChain } from './observers';
import { createViewBinding } from './bindings';


/**
 * Creates a template from an element and optionally a set of template bindings.
 * @param  {Element}  element  An element that is being used as a template
 * @param  {Array}    bindings [description]
 * @return {Template}          [description]
 */
export function createTemplate(element, bindings) {
  return element.template = {
    element: element,
    bindings: bindings,
    pool: pool
  };
}


/**
 * Creates a view from a template.
 * @param  {Template} template  [description]
 * @return {[type]}             [description]
 */
export function createView(template) {
  if (template.pool.length) {
    return template.pool.pop();
  }

  let observers = [];
  let element = template.element.cloneNode(true);
  let contexts = [ undefined ];
  let bindings = template.bindings.map(templateBinding => {
    let binding = createViewBinding(templateBinding, element, contexts);
    if (binding.observer) observers.push(binding.observer);
    return binding;
  });

  return element.view = {
    element: element,
    template: template,
    contexts: contexts,
    bindings: bindings,
    observers: createChain(observers)
  };
}


/**
 * Removes a view from the DOM, pulling it out of the observers chain, and returning it to the template pool.
 * @param  {View} view A view to be removed
 * @return {[type]}      [description]
 */
export function removeView(view) {
  view.element.remove();
  removeChain(view.observers);
  view.template.pool.push(view);
}
