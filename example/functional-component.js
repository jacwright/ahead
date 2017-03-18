module.exports = exampleComponent;

function exampleComponent() {
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
