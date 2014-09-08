function load(){
    var gameAPI = SC.require("game");
    var networkAPI = SC.require("network");
    game = new gameAPI();
    network = new networkAPI(14494);
}

if(window.addEventListener)
    window.addEventListener('load', load, false); //W3C
else 
    window.attachEvent('onload',load); //IE