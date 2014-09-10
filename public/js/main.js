function load(){
    if(typeof gameAPI == "undefined")
        gameAPI = SC.require("game");
    networkAPI = SC.require("network");
    network = new networkAPI(8000);
}

if(window.addEventListener)
    window.addEventListener('load', load, false); //W3C
else 
    window.attachEvent('onload',load); //IE