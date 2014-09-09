class Atoms.Organism.Game_list extends Atoms.Organism.Article

  @scaffold "assets/scaffold/game_list.json"

  constructor: ->
    super
    @bind "show", @load

  
  load: ->
    __.Entity.GameItem.destroyAll()
    network.getGames (data) ->
      if data.error == false
        for game in data.games
          __.Entity.GameItem.create({
            id: game.id,
            name: game.name,
            players: game.playerAmount,
            status: (game.playing)? "Playing" : "Waiting",
          })
      else
        console.log data.msg

  
  # -- Children bubble events --------------------------------------------------
  onButtonTouch: (event, dispatcher, hierarchy...) ->
    # Your code...

  onGameItem: (atom, dispatcher, hierarchy...) ->
    atom.el.css "opacity", "0.5"
    __.Article.Game.show atom.entity

  onRandomGame: (atom, dispatcher, hierarchy...) ->
    if (length = __.Entity.GameItem.all().length) > 0
      random = Math.floor(Math.random()*(length-1))
      __.Article.Game.show __.Entity.GameItem.findBy("id", random)

new Atoms.Organism.Game_list()
