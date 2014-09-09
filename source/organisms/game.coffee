class Atoms.Organism.Game extends Atoms.Organism.Article

  @scaffold "assets/scaffold/game.json"


  # -- Children bubble events --------------------------------------------------

  show: (@entity) ->
    network.joinGame(@entity.id)
    Atoms.Url.path "game/canvas"

new Atoms.Organism.Game()
