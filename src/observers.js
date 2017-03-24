import arrayDiff from './array-diff';

/**
 * Creates a new observer object that belong to a view to be chained with the other observers in that view.
 * @param  {Array}    args     The view's array of arguments to be passed to each observer. This array will contain one
 *                             data object to provide the data for the getter, but inside repeat loops it can contain
 *                             more arguments to handle the additional local variables.
 * @param  {Function} getter   A function which should return the value for this observer. Its arguments will be those
 *                             passed in from the `args` parameter.
 * @param  {Function} callback A function that gets called whenever the value of this observer changes. The value will
 *                             be checked periodically when calling `updateObserver`.
 * @return {Observer}          An observer object with the following properties:
 *                                @property {Observer} next      The next observer in the observer chain in which this
 *                                                               resides
 *                                @property {Observer} prev      The previous observer in the observer chain
 *                                @property {mixed}    lastValue The result of calling `getter` and what is passed to
 *                                                               callback as the old value when the value changes
 *                                @property {Function} getter    See above
 *                                @property {Function} callback  See above
 */
export function createObserver(args, getter, callback) {
  return {
    next: null,
    prev: null,
    lastValue: undefined,
    args: args,
    getter: getter,
    callback: callback
  };
}


/**
 * Executes the getter on an observer to get the current value given the current args.
 * @param  {Observer} observer The observer to get the current value from
 * @return {mixed}             The result of calling the getter with the current args
 */
export function getObserverValue(observer) {
  return observer.getter.apply(null, observer.args);
}


/**
 * Update the value of an observer using its getter. If the value has changed, call the callback. Otherwise do nothing.
 * @param  {Observer} observer An observer created with `createObserver`
 * @return {[type]}            [description]
 */
export function updateObserver(observer) {
  let lastValue = observer.lastValue;
  let value = getObserverValue(observer);
  let valueIsArray = Array.isArray(value);
  let changed = false;
  let splices;

  if (valueIsArray && Array.isArray(lastValue)) {
    splices = arrayDiff(value, lastValue);
  } else {
    changed = (value !== lastValue);
  }

  if (changed || splices) {
    observer.lastValue = valueIsArray ? value.splice() : value;
    observer.callback(value, lastValue, splices);
  }
}


/**
 * Creates a chain of observers with a start and an end observer. This chain can be part of a larger chain.
 * @return {ObserverChain} An object with the properties:
 *                            @property {Observer} head The first observer in this chain
 *                            @property {Observer} tail The last observer in this chain
 */
export function createChain(observers) {
  let chain = {
    parent: null,
    head: null,
    tail: null
  };

  observers.forEach(addObserver.bind(null, chain));
  return chain;
}


/**
 * Update the value of every observer in a chain.
 * @param  {Observer} observer    The first observer to update
 * @param  {Observer} endObserver The last observer to update, or undefined if updating all
 */
export function updateChain(chain) {
  let observer = chain.head;
  let last = chain.tail;
  while (observer) {
    updateObserver(observer);
    if (observer === last) break;
    observer = observer.next;
  }
}


/**
 * Insert a chain into a parent chain after the given observer.
 * @param  {ObserverChain} parent The parent chain this chain is being inserted into
 * @param  {ObserverChain} chain  The chain that is being inserted into a parent
 * @param  {Observer} prev        The observer which this chain is being inserted directly after
 */
export function insertChain(parent, chain, prev) {
  chain.parent = parent;
  let head = chain.head;
  let tail = chain.tail;
  let next = prev.next;
  head.prev = prev;
  tail.next = next;
  if (next) next.prev = tail;
  if (prev) prev.next = head;

  // Extend the tail of the parent chains if this chain was appended to the end
  if (prev === parent.tail) {
    while (parent) {
      parent.tail = tail;
      parent = parent.parent;
    }
  }
}


/**
 * Remove a chain from its parent.
 * @param  {ObserverChain} chain The chain being removed from its parent
 */
export function removeChain(chain) {
  let parent = chain.parent;
  let head = chain.head;
  let tail = chain.tail;
  let prev = head.prev;
  let next = tail.next;
  head.prev = null;
  tail.next = null;
  if (prev) prev.next = next;
  if (next) next.prev = prev;

  // Reduce the tail of the parent chains if the chain was removed from the end
  if (parent.tail === tail) {
    while (parent) {
      parent.tail = prev;
      parent = parent.parent;
    }
  }
}


// Add an observer to the observer chain, setting up the head/tail/next/prev properties correctly
function addObserver(chain, observer) {
  let tail = chain.tail;
  if (tail) {
    observer.prev = tail;
    tail.next = observer;
    chain.tail = observer;
  } else {
    chain.head = observer;
    chain.tail = observer;
  }
}
