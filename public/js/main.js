function load(){
    gameAPI = SC.require("game");
    networkAPI = SC.require("network");
    network = new networkAPI(14494);
}

if(window.addEventListener)
    window.addEventListener('load', load, false); //W3C
else 
    window.attachEvent('onload',load); //IE