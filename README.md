# Ahead
A JavaScript framework for building HTML applications with ahead-of-time compiling.

*Currently exploring how it could work, based off ideas from [Chip](https://github.com/chip-js/chip/tree/chip2.0).*


The example creates a subclass of component and uses an instance of that class as the controller for the component
element. Another approach we could take is to use functional components. This might look something like:

```
function component() {
  var preferences = require("../data/preferences");
  var team = require("../data/team");

  function onClick(player) {
    alert('You clicked ' + player.name);
  }

  return <section>
    <header class="header">Header</header>
    <article if="preferences.showArticles" class="article">
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
      <p>Paragraph 3</p>
      <p>Paragraph 4</p>
      <p>Paragraph 5</p>
    </article>
    <ul>
      <li for="player in team.players" on-click="onClick(player)">{player.name}</li>
    </ul>
    <footer class="footer">Footer</footer>
  </section>;
}
```

Since we are precompiling we can put the expression functions inside the component function closure so their scope is
the same. The expressions within the for-loop would be functions inside the expression that runs the for loop, allowing
them to inherit the scope from their outer function but still have the local `player` variable.
