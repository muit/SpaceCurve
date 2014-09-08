$(function(){
    var gameAPI = SC.require("game");
    var networkAPI = SC.require("network");
    game = new gameAPI();
    network = new networkAPI(14494);
});