class Atoms.Organism.Game extends Atoms.Organism.Article

  @scaffold "assets/scaffold/game.json"


  # -- Children bubble events --------------------------------------------------

  join: (@entity) ->
    network.joinGame @entity.id, (data) ->
      if data.error != true 
        Atoms.Url.path "game/canvas"
      else
        #error message data.msg

  create: (@entity) ->
    network.createGame @entity.name, (data) ->
      if data.error != true 
        Atoms.Url.path "game/canvas"
      else
        #error message data.msg

new Atoms.Organism.Game()
