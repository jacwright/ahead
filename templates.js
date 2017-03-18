
// Make an HTML element a template. Instances of this template are called views.
exports.make = function(element, bindings) {
  // A pool of reusable views for this template
  element.pool = [];
  element.bindings = bindings;
  element.create = create;
  return element;
};


// Create a view from this template, cloning the template and its bindings. If views exist in the template's pool reuse
// those.
function create() {
  if (this.pool.length) {
    return this.pool.pop();
  }

  // Clone the template
  var view = this.cloneNode(true);

  // Clone the bindings
  view.bindings = this.bindings.map(cloneBinding, view);

  // Add the view API
  view.context = undefined;
  view.template = template;
  view.bind = bind;
  view.dispose = dispose;
  view.attached = attached;
  view.detached = detached;
  return view;
}

function cloneBinding(original) {
  // Create an instance of the original binding
  var binding = Object.create(original);

  // Assign the binding's node using an array of indexes to it
  binding.node = binding._nodePath.reduce(findElement, this);
  bindingCreated(binding);
  return binding;
}

function findElement(node, index) {
  return node.childNodes[index];
}


// Bind a view to a given context (i.e. bind the bindings associated with this view)
function bind(context) {
  this.context = context;
  this.bindings.forEach(bindBinding, context);
}

function bindBinding(binding) {
  binding.bind(this);
}


// Dispose of a view, returning it to the template pool
function dispose() {
  if (this.parentNode) this.remove();
  if (this.context !== undefined) this.bind();
  this.bindings.forEach(bindingDisposed);
  this.template.pool.push(this);
}


// Alerts the view that it has been added to the DOM
function attached() {
  this.bindings.forEach(bindingAttached, context);
}


// Alerts the view that it has been removed from the DOM
function detached() {
  this.bindings.forEach(bindingDetached, context);
}

// Binding lifecycle calls
function bindingCreated(binding) {
  binding.created();
}

function bindingDisposed(binding) {
  binding.disposed();
}

function bindingAttached(binding) {
  binding.attached();
}

function bindingDetached(binding) {
  binding.detached();
}
