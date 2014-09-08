"use strict"

class __.Entity.GameItem extends Atoms.Class.Entity

  @fields "id", "name", "players", "status"

  parse: ->
    text        : @name
    description : @status
    info        : @players


  
