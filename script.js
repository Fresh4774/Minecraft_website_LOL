var Quotes = [
	  "It's not official!?", 
    "fortnite is better!?", 
    "Freshy loves you", 
    "SUBSCRIBE", 
    "this took me 7 days or you can see 1 week", 
    "Minecraft!", 
    "i'm so cool", 
    "i know you can beat the game",
   "meow",
   "yee",
   "blow up my mind",
   "you are a snow man",
   "what moth is it!!!????",
   "Hi.",
   "woah what are you!?",
   "Rickrolled!"
];

function displayQuote(){

    var num = Math.floor(Math.random() * 16);

    document.getElementById("quote").innerHTML = Quotes[num];

}