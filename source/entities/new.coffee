"use strict"

class __.Entity.New extends Atoms.Class.Entity

  @fields "id", "name", "text", "date"

  parse: ->
    text        : @name
    description : @text
    info        : @date


  