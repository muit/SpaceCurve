class Atoms.Organism.Login extends Atoms.Organism.Aside

  @scaffold "assets/scaffold/login.json"

  onLogin: (event, dispatcher, hierarchy...) ->
    

    name = document.querySelector("#login > [data-atom-input], [name = 'username']").value
    password = document.querySelector("#login > [data-atom-input], [name = 'password']").value
    network.login(name, password, @success, @error)

  success: (msg)->
    __.Article.Main.aside("login")
    console.log(msg)

  error: (msg)->
    errorElem = @error.el
    errorElem.innerHTML = msg
    errorElem.style.display = "block"

new Atoms.Organism.Login()
