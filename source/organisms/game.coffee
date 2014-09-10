class Atoms.Organism.Game extends Atoms.Organism.Article

  @scaffold "assets/scaffold/game.json"

  render: ->
    super
    if(typeof gameAPI == "undefined")
      gameAPI = SC.require("game");
    window.game = new gameAPI({debug: true})
    window.game.start

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
  onExitGame:  (atom, dispatcher, hierarchy...) ->
    network.exitGame (data) ->
      console.log(data.msg)
      Atoms.Url.path "game_list/games"
    
new Atoms.Organism.Game()
