
// Make an HTML element a template. Instances of this template are called views.
exports.make = function(element) {
  // A pool of reusable views for this template
  element.pool = [];
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

  // Add the view API
  view.template = template;
  view.bind = bind;
  view.unbind = unbind;
  view.dispose = dispose;
  view.created = created;
  view.attached = attached;
  view.detached = detached;
  view.bindings = [];
  return view;
}


// Bind a view to its context (i.e. bind the bindings associated with this view)
function bind() {
  this.bindings.forEach(bindBinding);
}

function bindBinding(binding) {
  binding.bind();
}

// Unbind a view from its context
function unbind() {
  this.bindings.forEach(unbindBinding);
}

function bindBinding(binding) {
  binding.unbind();
}


// Dispose of a view, returning it to the template pool
function dispose() {
  if (this.parentNode) this.remove();
  if (this.context !== undefined) this.bind();
  this.bindings.forEach(bindingDisposed);
  this.template.pool.push(this);
}


// Alerts the view that it has been added to the DOM
function created() {
  this.bindings.forEach(bindingCreated, context);
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
