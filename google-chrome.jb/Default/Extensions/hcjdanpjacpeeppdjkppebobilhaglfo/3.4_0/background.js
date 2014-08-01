var GPCache = function (maxEntries) {
	this.insert = 0;
	this.cache = new Array();
	this.max = maxEntries,

	this.hit = function(key) {
		var i;
		for(i=0; i < this.cache.length; i++) {
			if (this.cache[i]["key"] == key) {
				return this.cache[i]["value"];
			}
		}
		return null;
	},
  
	this.put = function(key, value) {
		var o = new Object();
		o["key"] = key;
		o["value"] = value;
		this.cache[this.insert] = o;
		this.insert++;
		if (this.insert == this.max) {
			this.insert = 0;
		}
	}
}
var AD_CACHE = new GPCache(5);
var INSERT_PREVIEWS = true;
var TIMEZONE_OFFSET = new Date().getTimezoneOffset();

function adFeed(location, q, googleInstant, sendResponse) {
	if (q && q.length > 1) {	
		if (location.indexOf("start=") > 0 && location.indexOf("start=0") == -1) {
			return;
        }
				
		var qParam = encodeURIComponent(q);
		var cacheHitText = AD_CACHE.hit(qParam);
		if (cacheHitText != null) {
			sendResponse({xml: cacheHitText, rms: 0});
			return;
		}						
		
        var http = new XMLHttpRequest();
		var isSSL = false;
		var gtld = "";
		var m = location.match(/.*www\.google\.(.*)\//);
		if (m && m[1]) {
			gtld = m[1];
		}
		
		var ref = location;
		var refi = ref.indexOf("#");
		if (refi > 0) {
			ref = location.substring(0, refi);
		}	
		ref = encodeURIComponent(ref);
		var subd = "adsint"
		if (gtld == "de") {
			subd = "adsde";
		}
		else if (TIMEZONE_OFFSET >= 120) {
			subd = "ads";
		}
		var serviceURL = "http://"+subd+".searchpreview.de/GPAdFeed/"+subd+"?q=" +qParam + "&locale=gc&s=0&tls=" + isSSL + "&gtld=" + gtld + "&gi=" + googleInstant + "&ref=" + ref;
		
		http.open("GET", serviceURL, true);
		var startTime = new Date().getTime();
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				AD_CACHE.put(qParam, http.responseText);
				var rms = new Date().getTime() - startTime;
				sendResponse({xml: http.responseText, rms: rms});
			}
		}
		http.send(null);		
	}
}

function init() {	
	if (localStorage["sp_ads"] == undefined) {
		localStorage["sp_ads"] = "true";
	}
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		//console.log(request + "\n");
		if (request.command == "spads") {
			if (localStorage["sp_ads"]=="false") {
				//no ads wanted
				return;
			}
			adFeed(request.location, request.qgi, true, sendResponse);		
			return true;
		}
		else
			sendResponse({}); // send back empty
	});
	
	
	chrome.contextMenus.create({"onclick" : contextMenuClick, "title": chrome.i18n.getMessage("ex_requestupdate"), "contexts": ["image"], "targetUrlPatterns" : ["http://*.searchpreview.de/preview*", "https://*.searchpreview.de/preview*"]}, function() {
		if (chrome.extension.lastError) {
			console.log("Error during context menu init: " + chrome.extension.lastError.message);
		}
	});
}

function contextMenuClick(info, tab) {
	chrome.tabs.sendMessage(tab.id, {method: "updatePreview", sourceUrl: info.srcUrl}, function(response) {});
}

function informTabs() {
	//inform all of the tabs to reload if needed
	chrome.windows.getAll(null, function(windowArray) {
		for(var w=0; w < windowArray.length; w++) {
			chrome.tabs.getAllInWindow(windowArray[w].id, function(tabArray) {
				for(var i=0; i < tabArray.length; i++) {
					chrome.tabs.get(tabArray[i].id, function(tab) {
					});			
				}
			});		
		}
	});	
}

document.addEventListener('DOMContentLoaded', function () {
	init();
});
