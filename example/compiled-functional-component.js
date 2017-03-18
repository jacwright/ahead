// ======================================= Component Module ====================================================== //
// Export a function that creates new versions of this component
module.exports = exampleComponent;

// Create the initial template for each template/subtemplate of this component. These will be cloned to create new ones.
const template0 = template0();
const template1 = template1();
const template2 = template2();
const templates = require("templates-4-functional");
const Component = require("component");
const textBinding = require("bindings/text");
const ifBinding = require("bindings/if");
const repeatBinding = require("bindings/repeat");
const eventBinding = require("bindings/event");

// The exported function to create a new element which is a component. This doesn't quite work since the element can be
// bound to any context. We need to allow the "outside" to be bound to one context, and the "inside" to be bound to the
// component instance. This is done in chip-js so we can use something similar, but for this example I went simpler to
// show the basic idea of the compiled element file.
function exampleComponent() {
  // This is the inner scope for the component. The element can still be bound on the outside.
  var preferences = require("../data/preferences");
  var team = require("../data/team");

  function onClick(player) {
    alert('You clicked ' + player.name);
  }

  // Expressions used in the templates
  function expression0(__formatters__, __globals__) {
    var _ref1;
    return ((_ref1 = preferences) == null ? void 0 : _ref1.showArticles);
  }
  function expression1(__formatters__, __globals__) {
    var _ref1;
    return ((_ref1 = team) == null ? void 0 : _ref1.players);
  }

  function getView0() {
    var view = template1.create();
    return view;
  }

  function getView1(player) {

    function expression0(__formatters__, __globals__) {
      return (typeof onClick !== 'function' ? void 0 : onClick(player));
    }
    function expression1(__formatters__, __globals__) {
      var _ref1;
      return ((_ref1 = player) == null ? void 0 : _ref1.name);
    }

    var view = template2.create();

    // Create a binding that will handle a click event
    var bd0 = Object.create(eventBinding);
    bd0.node = view;
    bd0.expression = expression0;

    // Create a binding that will update the text of the LI with the name of the given context
    var bd1 = Object.create(textBinding);
    bd1.node = view.childNodes[0];
    bd1.expression = expression1;

    // TODO if this view happens to also be a component, we are adding additional bindings to it that will mess with
    // things if it is reused in other places. Also, this push method of adding bindings will keep adding duplicate
    // bindings for each recycled view. Figure out a better way.
    view.bindings.push(b0, b1);

    return view;
  }

  var view = template0.create();

  // Create the bindings that will show/hide the article and repeat player names
  var bd0 = Object.create(ifBinding);
  bd0.node = view.childNodes[1];
  bd0.expression = expression0;
  bd0.getView = getView0;

  var bd1 = Object.create(repeatBinding);
  bd1.node = view.childNodes[2].childNodes[0];
  bd1.expression = expression1;
  bd1.getView = getView1;

  view.bindings.push(b0, b1);

  return view;
}


// The templates used in this component
function template0() {
  // Create all the HTML for this template
  var el0 = document.createElement("section");
  el0.setAttribute("class", "section");
  var el1 = document.createElement("header");
  el1.setAttribute("class", "header");
  el1.textContent = "Header";
  el0.appendChild(el1);

  // Create the empty text node placeholder for the if binding
  var el2 = document.createTextNode("");
  el0.appendChild(el2);

  var el3 = document.createElement("ul");
  el3.setAttribute("class", "list");

  // Create the empty text node placeholder for the repeat binding
  var el4 = document.createTextNode("");
  el3.appendChild(el4);
  el4.appendChild(el3);
  el0.appendChild(el4);
  var el30 = document.createElement("footer");
  el30.setAttribute("class", "footer");
  el30.textContent = "Footer";
  el0.appendChild(el30);

  // Make this element a template
  return templates.make(el0);
}


function template1() {
  // Create all the HTML for this template
  var el0 = document.createElement("article");
  el0.setAttribute("class", "article");
  var el1 = document.createElement("p");
  el1.textContent = "Paragraph 1";
  el0.appendChild(el1);
  var el2 = document.createElement("p");
  el2.textContent = "Paragraph 2";
  el0.appendChild(el2);
  var el3 = document.createElement("p");
  el3.textContent = "Paragraph 3";
  el0.appendChild(el3);
  var el4 = document.createElement("p");
  el4.textContent = "Paragraph 4";
  el0.appendChild(el4);
  var el5 = document.createElement("p");
  el5.textContent = "Paragraph 5";
  el0.appendChild(el5);

  // This template has no bindings, but it still adhears to the same API
  return templates.make(el0);
}


function template2() {
  // Create all the HTML for this template
  var el0 = document.createElement("li");
  var el1 = document.createTextNode("");
  el0.appendChild(el1);

  // Make this element a template
  return templates.make(el0);
}
