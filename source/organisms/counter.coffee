class Atoms.Organism.Counter extends Atoms.Organism.Dialog

  @scaffold "assets/scaffold/counter.json"

  setTime: (time) ->
    counter = __.Dialog.Counter
    counter.show()

    counter.time = time
    if counter.timer then counter.timer.close

    counter.timer = new Timer counter.showTime, 100

  showTime: ->
    value = __.Dialog.Counter.prepareString __.Dialog.Counter.time

    heading = __.Dialog.Counter.children[0].children[0]
    heading.attributes.value = [value.slice(0, 1), '.', value.slice(1)].join ''
    heading.refresh()
    __.Dialog.Counter.time -= 10

    if(__.Dialog.Counter.time < 0)
      __.Dialog.Counter.hide()
      return true 

  prepareString: (time) ->
    time = time+""
    while time.length < 4
      time = "0"+time
    return time


new Atoms.Organism.Counter()