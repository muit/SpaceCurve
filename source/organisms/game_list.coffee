class Atoms.Organism.Game_list extends Atoms.Organism.Article

  @scaffold "assets/scaffold/game_list.json"

  constructor: ->
    super
    @bind "show", @load

  
  load: ->
    __.Entity.GameItem.destroyAll()
    network.getGames (data) ->
      if data.error == false
        console.log(data.games.length)
        for game in data.games
          status = if game.playing then "Playing" else "Waiting"
          __.Entity.GameItem.create({
            id: game.id,
            name: game.name,
            players: game.playerAmount,
            status: status,
          })
      else
        console.log data.msg

  
  # -- Children bubble events --------------------------------------------------
  onButtonTouch: (event, dispatcher, hierarchy...) ->
    # Your code...

  onGameItem: (atom, dispatcher, hierarchy...) ->
    __.Article.Game.join atom.entity

  onRandomGame: (atom, dispatcher, hierarchy...) ->
    if (length = __.Entity.GameItem.all().length) > 0
      random = Math.floor(Math.random()*(length-1))
      __.Article.Game.join __.Entity.GameItem.findBy("id", random)

  onCreateGame: (atom, dispatcher, hierarchy...) ->
    id = __.Entity.GameItem.count()
    __.Article.Game.create __.Entity.GameItem.create({id: id, name: "Name!", players: "0/6", status: "Waiting"})

new Atoms.Organism.Game_list()
