"use strict"

Atoms.$ ->
  console.log "------------------------------------------------------------"
  console.log "SpaceCurve core v#{SC.version}"
  console.log "Utyl v#{Utyl.version}"
  console.log "------------------------------------------------------------"
  console.log "Atoms v#{Atoms.version} (Atoms.App v#{Atoms.App.version})"
  console.log "------------------------------------------------------------"
  
  #Add ids to labels
  Atoms.Atom.Label.template = '<label {{#if.style}}class="{{style}}"{{/if.style}} {{#if.id}}id="{{id}}"{{/if.id}}>{{#if.icon}}<span class="icon {{icon}}"></span>{{/if.icon}}{{value}}{{#if.count}}<strong>{{count}}</strong>{{/if.count}}</label>'


  Atoms.Url.path "main/news"
  Appnima?.key = "null"
