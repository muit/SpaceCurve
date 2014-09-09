class Atoms.Organism.Main extends Atoms.Organism.Article

  @scaffold "assets/scaffold/main.json"

  onGameList: (event, dispatcher, hierarchy...) ->
    if(network.logged)
      Atoms.Url.path "game_list/games"
    else
      console.log "You need to be logged to play!"

new Atoms.Organism.Main()
