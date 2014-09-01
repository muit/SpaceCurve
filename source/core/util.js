String.prototype.startsWith = function(str){
    return this.slice(0, str.length) == str;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(str){
    return this.indexOf(str) != -1;
};

//*******************************
// Get Keys from a hash
//*******************************
Object.prototype.keys = function(){
    var ret=[],p;
    for(p in this) if(Object.prototype.hasOwnProperty.call(this,p)) ret.push(p);
    return ret;
}

//*******************************
// Hash helpers
//*******************************
Object.prototype.keys = function(){
    var ret=[],p;
    for(p in this) if(Object.prototype.hasOwnProperty.call(this,p)) ret.push(p);
    return ret;
}

Object.prototype.key = function(o){
    var ret=[],p;
    for(p in this) if(this[p] == o) ret.push(p);
    return ret;
}

//*******************************
// Array Helpers
//*******************************
Array.prototype.first = function(){ return this[0]; }
Array.prototype.last = function(){ return this[this.length-1]; }
Array.prototype.remove = function(o){ 
    var i = this.indexOf(o);
    return (i >= 0)? this.splice(i, 1)[0] : undefined;
}
Array.prototype.removeByIndex = function(i){
    return (i >= 0)? this.splice(i, 1)[0] : undefined;
}

//*******************************
// Player Array Helpers
//*******************************
Array.prototype.getByName = function(n){ 
    return this.filter(function(p){ return p.name == n; }).first;
}


//*******************************
// Trigger Class
//*******************************
Trigger = function(){}
Trigger.prototype.get = function(){
    return (!this.s)?this.s = true:false;
}

//*******************************
// Vector2 Class
//*******************************
Vector2 = function(x, y){this.x = x; this.y = y;}
Vector2.prototype.x = null;
Vector2.prototype.y = null;
Vector2.prototype.distance = function(v2){ return Vector2.distance(this, v2); };

Vector2.distance = function(v1, v2){ 
    return Math.sqrt(Math.pow(v1.x + v2.x, 2) + Math.pow(v1.y + v2.y, 2)); 
}
Vector2.dot = function(v1, v2){ return v1.x * v2.x + v1.y * v2.y; }


//*******************************
// EventMap Class
//*******************************
EventMap = function(){}
EventMap.prototype.events = [];
EventMap.prototype.callbacks = [];

EventMap.prototype.createEvent = function(callback, delay){
    var self = this;
    var guid = setTimeout(function(){
        self.removeEvent(guid);
        callback();
    }, delay);

    this.events.push(guid);
    this.callbacks.push(callback);
    return this.events.length-1;
}

EventMap.prototype.restartEvent = function(event, delay){
    var index = this.events.indexOf(event);
    if (index >= 0){
        clearTimeout(this.events[index]);
        var self = this;
        
        this.events[index] = setTimeout(function(){
            self.removeEvent(guid);
            self.callbacks[index]();
        }, delay);
    }
}

EventMap.prototype.removeEvent = function(event){
    var index = this.events.indexOf(event);
    if (index >= 0) clearTimeout(this.events[index]);
    this.events.removeByIndex(index);
    this.callbacks.removeByIndex(index);
}

EventMap.prototype.removeAllEvents = function(){
    this.events.forEach(function(guid, index, array) {
        clearTimeout(guid);
    });
    this.events = [];
    this.callbacks = [];
}