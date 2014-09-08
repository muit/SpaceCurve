"use strict"

class __.Entity.Player extends Atoms.Class.Entity

  @fields "id", "name", "score", "color"

  parse: ->
    image       : @color
    text        : @name
    info        : @score


  