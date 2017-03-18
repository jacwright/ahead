function ExampleComponent() {

}


Component.extend(ExampleComponent, {
  created: function() {
    this.preferences = require("../data/preferences");
    this.team = require("../data/team");
  },

  onClick: function(player) {
    alert('You clicked ' + player.name);
  },

  template: function() {
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
}

