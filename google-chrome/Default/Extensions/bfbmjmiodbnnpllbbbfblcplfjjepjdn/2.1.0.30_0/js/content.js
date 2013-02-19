//================================================
/*

Turn Off the Lights
The entire page will be fading to dark, so you can watch the video as if you were in the cinema.
Copyright (C) 2013 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

/* inject script for autoplay */
try {
var script = document.createElement("script");script.type = "text/javascript";script.src = chrome.extension.getURL("/js/injected.js");document.getElementsByTagName("head")[0].appendChild(script);
} catch(e) {}

function $(id) { return document.getElementById(id); }
// settings
var autoplay = null, eastereggs = null, shortcutlight = null, eyea = null, eyealist = null, contextmenus = null, excludedDomains = null, nighttime = null, begintime = null, endtime = null, ambilight = null, ambilightrangeblurradius = null, ambilightrangespreadradius = null, ambilightfixcolor = null, ambilightvarcolor = null, ambilightcolorhex = null, ambilight4color = null, ambilight1colorhex = null, ambilight2colorhex = null, ambilight3colorhex = null, ambilight4colorhex = null, ecosavertime = null, ecosavertime = null;

// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('turnoffthelights-chrome-install-button')) {
		$('turnoffthelights-chrome-install-button').style.display = 'none';
		$('turnoffthelights-chrome-thanks-button').style.display = '';
	}
}
/* -------------------------------------------------- */

chrome.extension.sendMessage({comando:'totlrequest'}, function(response){
autoplay = response.autoplay;
eastereggs = response.eastereggs;
shortcutlight = response.shortcutlight;
eyea = response.eyea;
eyealist = response.eyealist;
contextmenus = response.contextmenus;
excludedDomains = response.excludedDomains;
nighttime = response.nighttime;
begintime = response.begintime;
endtime = response.endtime;
ambilight = response.ambilight;
ambilightrangeblurradius = response.ambilightrangeblurradius;
ambilightrangespreadradius = response.ambilightrangespreadradius;
ambilightfixcolor = response.ambilightfixcolor;
ambilightvarcolor = response.ambilightvarcolor;
ambilightcolorhex = response.ambilightcolorhex;if(!ambilightcolorhex)ambilightcolorhex = '#47C2FF';
ambilight4color = response.ambilight4color;
ambilight1colorhex = response.ambilight1colorhex;if(!ambilight1colorhex)ambilight1colorhex = '#FF0000';
ambilight2colorhex = response.ambilight2colorhex;if(!ambilight2colorhex)ambilight2colorhex = '#FFEE00';
ambilight3colorhex = response.ambilight3colorhex;if(!ambilight3colorhex)ambilight3colorhex = '#00FF00';
ambilight4colorhex = response.ambilight4colorhex;if(!ambilight4colorhex)ambilight4colorhex = '#0000FF';
ecosaver = response.ecosaver;
ecosavertime = response.ecosavertime;

// Shortcutlight
window.addEventListener('keydown', function(e) {
		if (e.which == 76 && e.ctrlKey && e.shiftKey && !e.altKey) {
		// Run code for CTRL+SHIFT+L
			// Shortcutlight
			if(shortcutlight == 'true'){
				chrome.extension.sendMessage({name: 'automatic'});
			}
		}
}, false);
window.addEventListener('keypress', function(e) {
		if (e.which == 116) {
		gogotheater();
		}	
}, false);

if(autoplay == 'true'){
var gracePeriod = 250, lastEvent = null, timeout = null;

			function trigger (data) {
				var that = this;
				if (gracePeriod > 0 && (lastEvent === null || String(lastEvent).split(":")[0] === String(data).split(":")[0])) {
					clearTimeout(timeout);
					timeout = setTimeout(function () {dispatch(data);}, gracePeriod);
				} else {
					dispatch(data);
				}
			}
			
			function dispatch (data) {
				if (data !== lastEvent) {
					lastEvent = data;
					data = String(data).split(":");
					switch (data[0]) {
						case "playerStateChange":
							//console.log("received playerStateChange", data[1]);
							if (data[1] === "2" || data[1] === "0" || data[1] === "-1") {
								shadesOff(this.player);
								if (data[1] === "0") {
									try {
									//playerReset(this.player);
									//playerStop(this.player);
									playerPause(this.player);
									} catch(e){};
								}
							} else {
								shadesOn(this.player);
							}
							break;
						default:
							console.log("unknown event", data);
							break;
					}
				}
			}

	function playerPause(player) {
		if (player !== null) {
			if (typeof(player.pauseVideo) === "function") {
				player.pauseVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function playerReady(player) {
		this.player = player;
		//this.playerPause(player);
		//this.playerReset(player);
	}
	function playerReset(player) {
		if (player !== null) {
			if (typeof(player.seekTo) === "function") {
				player.seekTo(0, false);
			} else if (typeof(player.currentTime) !== "undefined") {
				player.currentTime = 0;
			}
		}
	}
	function playerStop(player) {
		if (player !== null) {
			if (typeof(player.stopVideo) === "function") {
				player.stopVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function shadesOff(player) {
		if (player !== null) {
		var blackon = $('stefanvdlightareoff1');
			if (blackon) {chrome.extension.sendMessage({name: 'automatic'});}
			else {} // do nothing
		}
	}
	function shadesOn(player) {
		if (player !== null) {
		var blackon = $('stefanvdlightareoff1');
			if (blackon) {} // do nothing
			else {chrome.extension.sendMessage({name: 'automatic'});}			
		}
	}

		// player ready check
		var startautoplay = setInterval(function () {
		try {
			var youtubeplayer = $("movie_player") || null
			var htmlplayer = document.getElementsByTagName("video") || null;
			if (youtubeplayer !== null) { // youtube video element
	   				if (youtubeplayer.pauseVideo) {playerReady(youtubeplayer);}
			} else if (htmlplayer !== null) { // html5 video elements
				for(var j=0; j<htmlplayer.length; j++) {
	   				if (htmlplayer[j].pause) {playerReady(htmlplayer[j]);}
				}
			}
		}
		catch(err) {} // i see nothing, that is good
		},1000); // 1000 refreshing it

		// injected code messaging
		var bodytag = document.getElementsByTagName("body")[0], message = document.createElement("div");
		message.setAttribute("id", "ytCinemaMessage");
		message.style.display = "none";
		bodytag.appendChild(message);
		$(message.id).addEventListener(message.id, function () {
			var eventData = $(message.id).innerText;
			trigger(eventData);
  		});

} // option autoplay on end

// easter eggs
function gogotheater(){
if(eastereggs == 'true'){
// here the easter egg => movie theater
	var lightareoff = $('stefanvdlightareoff1');
	if (lightareoff != null) {
		// shortcut key T
		if ($('stefanvdtheater')){}
		else {
		alert(chrome.i18n.getMessage("eastereggsquestion"));
		var newimg = document.createElement('img');
		newimg.setAttribute('id','stefanvdtheater');
		newimg.src = chrome.extension.getURL('/images/theater.jpg');
		newimg.onclick = function() { document.body.removeChild(newimg); };
		document.body.appendChild(newimg);
		}
	}
} // end easter eggs
}

// eye protection
function eyedojob(){

if(ecosaver == 'true'){

document.onmousemove = (function() {
  var onmousestop = function() {
	var blackon = $('stefanvdlightareoff1');
	if(blackon){}else{eyeprotection();}
  }, thread;

  return function() {
    clearTimeout(thread);
    thread = setTimeout(onmousestop, ecosavertime * 1000);
  };
})();

} else {
eyeprotection();
///////
function eyeprotection(){
if(eyea == 'true'){chrome.extension.sendMessage({name: 'automatic'});}
else if(eyealist == 'true'){
var currenturl = location.protocol + '//' + location.host;
if(typeof excludedDomains == "string") {
	excludedDomains = JSON.parse(excludedDomains);
	var buf = [];
	for(var domain in excludedDomains)
		buf.push(domain);
        buf.sort();
	for(var i = 0; i < buf.length; i++)
		if(currenturl == buf[i]){chrome.extension.sendMessage({name: 'automatic'});}
    }
}
}
///////
}

}

// night time
if(nighttime == 'true'){ // yes night time
var now = new Date();var hours = now.getHours();var minutes = now.getMinutes();var gettime = hours + ":" + minutes;
var gettimesecond = gettime.split(":")[0] * 3600 + gettime.split(":")[1] * 60;

var time1 = begintime;var time2 = endtime;
var seconds1 = time1.split(":")[0] * 3600 + time1.split(":")[1] * 60;
var seconds2 = time2.split(":")[0] * 3600 + time2.split(":")[1] * 60;

// example
// if begintime set 10:00 but endtime is 18:00
// then do this
if(seconds1 <= seconds2){ // default for user
if((seconds1 <= gettimesecond) && (gettimesecond <= seconds2)){eyedojob();}
}
// example
else if (seconds1 > seconds2){
var getotherdaypart = 86400; // ... to 24:00 end
var getothernightpart = 0; // start from 0:00 to seconds2 (example 11:00) 

if((seconds1 <= gettimesecond) && (gettimesecond <= getotherdaypart)){ // 13 -> 24
eyedojob();
} else if((getothernightpart <= gettimesecond) && (gettimesecond <= seconds2)){ // 0 -> 11
eyedojob();
}
}


}
else{eyedojob();} // no night time

// context menu
if(contextmenus == 'true'){chrome.extension.sendMessage({name: 'contextmenuon'});}
else {chrome.extension.sendMessage({name: 'contextmenuoff'});}

// ambilight time
if(ambilight == 'true'){ // yes show time
		var startambilight = setInterval(function () {
		try {
		var htmlplayer = document.getElementsByTagName("video") || null;
		var playerid = null, item = null;
		for(var j=0; j<htmlplayer.length; j++) {
			if (htmlplayer[j].play){playerid = htmlplayer[j]; item = j + 1; drawImage(playerid, item);}
		}
		
		// YouTube flash detect play
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		var yttest = $("movie_player"); item = 1;
		var youtubewindow = $("watch-player") || $("watch7-player");
		
		/* temp fix watch7-video */
		var watch7video = $('watch7-video');
		if(watch7video)$('watch7-video').style.zIndex = 'auto';

		if(yttest){
		if ($("movie_player").getPlayerState() == 1) {drawImage(youtubewindow, item);}
		else { youtubewindow.style.webkitBoxShadow = ""; }
		}
		}
		
		}
		catch(err) {} // i see nothing, that is good
		},20); // 20 refreshing it

// animation browser engine
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

// ambilight draw code		
function drawImage(playerid, item){
try {
	if(playerid.paused || playerid.ended){
	playerid.style.webkitBoxShadow = "";
	
	if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
	var youtubewindow = $("watch-player");
	youtubewindow.style.webkitBoxShadow = "";
	}
	
	return false;}
}catch(err) {}

try {
	var k = item;
	if(typeof k == "undefined") {
	return
	}
}catch(err) {}

    var totlshowtime = playerid;
	var getblur = ambilightrangeblurradius + "px";
	var getspread = ambilightrangespreadradius + "px";
	var fixhex = ambilightcolorhex;
	
	if(ambilightvarcolor == 'true'){
	// Cross detection
	// if url is the same as the video source
	// then posible to play real ambilight
	var cross = null;
	
	// check for the current page URL
	var pageurl = location.protocol + '//' + location.host; // http://www.stefanvd.net
	var pageurllengt = pageurl.length; // lengte url

	function subDomain(url) {
	// IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
	url = url.replace(new RegExp(/^\s+/),""); // START
	url = url.replace(new RegExp(/\s+$/),""); // END
	// IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
	url = url.replace(new RegExp(/\\/g),"/");
	// IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
	url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");
	// IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
	url = url.replace(new RegExp(/^www\./i),"");
	// REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
	url = url.replace(new RegExp(/\/(.*)/),"");
	// REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
	if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
		url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i),"");
	// REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
	} else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
		url = url.replace(new RegExp(/\.[a-z]{2,4}$/i),"");
	} 
	// CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
	var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

	return(subDomain);
	}
	var yesornosubdomain = subDomain(pageurl);

	if (totlshowtime != typeof HTMLVideoElement !== "undefined" && totlshowtime instanceof HTMLVideoElement) {
		var insideitem = totlshowtime.src;
		var insideitemlengt = 0;
		if(insideitem){	var insideitemlengt = insideitem.length; } // lengte url
	} else { var insideitemlengt = "undefined"; }

	// mission controll
	if((insideitemlengt == 0) && (yesornosubdomain == false)){
		// check for video -> source URL
		var items = totlshowtime.getElementsByTagName("source");
		for(var i= 0; i < 1; i++){ // 1 source needed
			cross = items[i].getAttribute('src');
		}
		if(cross.substring(0, pageurllengt) == pageurl) {runreal();}
		else if(cross.substring(0, 2) == './') {runreal();}
		else if(cross.substring(0, 3) == '../') {runreal();}
		else if((cross.substring(0, 4) != 'http') && (cross.substring(0, 5) != 'https') && (cross.substring(0, 3) != 'ftp')) {runreal();}
		else {rundefault();}
	} else if ((insideitemlengt > 0) && (yesornosubdomain == false)) {
		if(insideitem.substring(0, pageurllengt) == pageurl) {runreal();}
		else if(insideitem.substring(0, 2) == './') {runreal();}
		else if(insideitem.substring(0, 3) == '../') {runreal();}
		else if((insideitem.substring(0, 4) != 'http') && (insideitem.substring(0, 5) != 'https') && (insideitem.substring(0, 3) != 'ftp')) {runreal();}
		else {rundefault();}
	} else {rundefault();}

function runreal(){
    var sourceWidth = totlshowtime.videoWidth;
    var sourceHeight = totlshowtime.videoHeight;
	
	var totlcheckcanvas = $("totlCanvas" + k + "");
	if(totlcheckcanvas){} else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','totlCanvas' + k + '');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}
	
var canvas = $("totlCanvas" + k + "");
var context = canvas.getContext('2d');

var colorlamp1X = (sourceWidth * 50) /100; // up midden
var colorlamp1Y = (sourceHeight * 95) /100;
var colorlamp2X = (sourceWidth * 95) /100; // right midden
var colorlamp2Y = (sourceHeight * 50) /100;
var colorlamp3X = (sourceWidth * 50) /100; // down midden
var colorlamp3Y = (sourceHeight * 5) /100;
var colorlamp4X = (sourceWidth * 5) /100; // left midden
var colorlamp4Y = (sourceHeight * 50) /100;

	context.drawImage(totlshowtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);

try{
	var imageData = context.getImageData(0, 0, 1, 1);
	var data = imageData.data;

	function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
	}

	var p1 = context.getImageData(0 , 0, 1, 1).data;
	var p2 = context.getImageData(1 , 0, 1, 1).data;
	var p3 = context.getImageData(2 , 0, 1, 1).data;
	var p4 = context.getImageData(3 , 0, 1, 1).data;
	var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
	var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
	var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
	var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

	totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
}catch(e) {rundefault();}
}

		// if catch error in URL
		function rundefault(){
		var fixhex = ambilightcolorhex;
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		var youtubewatchplayershadow = $("watch-player"); // YouTube video page
		if(youtubewatchplayershadow){ youtubewatchplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubevideoplayershadow = $("video-player"); // YouTube video page
		if(youtubevideoplayershadow){ youtubevideoplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubewatchvideoshadow = $("watch-video"); // YouTube video page
		if(youtubewatchvideoshadow){ youtubewatchvideoshadow.style.overflow = "visible"; } // show the overflow out the video element	
		var youtubewindow = $("watch-player") || $("watch7-player");
		youtubewindow.style.zIndex = 1000;
		youtubewindow.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + "";
		} else { totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + ""; }
		}
	} else if(ambilightfixcolor == 'true'){
		var fixhex = ambilightcolorhex;
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		var youtubewatchplayershadow = $("watch-player"); // YouTube video page
		if(youtubewatchplayershadow){ youtubewatchplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubevideoplayershadow = $("video-player"); // YouTube video page
		if(youtubevideoplayershadow){ youtubevideoplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubewatchvideoshadow = $("watch-video"); // YouTube video page
		if(youtubewatchvideoshadow){ youtubewatchvideoshadow.style.overflow = "visible"; } // show the overflow out the video element	
		var youtubewindow = $("watch-player") || $("watch7-player");
		youtubewindow.style.zIndex = 1000;
		youtubewindow.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + "";
		} else { totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + ""; }
	} else if (ambilight4color == 'true'){
		var fix1hex = ambilight1colorhex;
		var fix2hex = ambilight2colorhex;
		var fix3hex = ambilight3colorhex;
		var fix4hex = ambilight4colorhex;
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		var youtubewatchplayershadow = $("watch-player"); // YouTube video page
		if(youtubewatchplayershadow){ youtubewatchplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubevideoplayershadow = $("video-player"); // YouTube video page
		if(youtubevideoplayershadow){ youtubevideoplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubewatchvideoshadow = $("watch-video"); // YouTube video page
		if(youtubewatchvideoshadow){ youtubewatchvideoshadow.style.overflow = "visible"; } // show the overflow out the video element	
		var youtubewindow = $("watch-player") || $("watch7-player");
		youtubewindow.style.zIndex = 1000;
		youtubewindow.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fix1hex + ", 0px 20px " + getblur + " " + getspread + " " + fix2hex + ", 20px 0px " + getblur + " " + getspread + " " + fix3hex + ", -20px 0px " + getblur + " " + getspread + " " + fix4hex + "";
		} else { totlshowtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fix1hex + ", 0px 20px " + getblur + " " + getspread + " " + fix2hex + ", 20px 0px " + getblur + " " + getspread + " " + fix3hex + ", -20px 0px " + getblur + " " + getspread + " " + fix4hex + ""; }
	}
	
	window.requestAnimFrame(drawImage);	
}

}
});