class Atoms.Organism.Login extends Atoms.Organism.Aside

  @scaffold "assets/scaffold/login.json"

  constructor: ->
    super
    @bind "hide", (data) ->
      errorElem = document.querySelector("#login > [data-atom-button], #error")
      errorElem.style.display = "none"

  onLogin: (event, dispatcher, hierarchy...) ->
    name = document.querySelector("#login > [data-atom-input], [name = 'username']").value
    password = document.querySelector("#login > [data-atom-input], [name = 'password']").value
    network.login(name, password, @success, @error)
    
  success: (msg)->
    __.Url.current().aside("login")
    console.log(msg)

  error: (msg)->
    errorElem = document.querySelector("#login > [data-atom-button], #error")
    errorElem.innerHTML = msg
    errorElem.style.display = "block"

new Atoms.Organism.Login()
