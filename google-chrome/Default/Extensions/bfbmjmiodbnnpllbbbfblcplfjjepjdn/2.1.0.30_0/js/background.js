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

settings = {
    get icon_id() { // browser button id check
      return 'jfmfcimcjckbdhbbbbdemfaaphhgljgo';
    }
}

function handleRequest(request, response) {
    switch (request.method) {
      case 'browserbutton':
		browserbuttonaction();
        response({alive: 'true'});
        break;
      default:
        console.log('ERROR: Invalid Request - ' + request.method); 
    }
}

function currentWindow(win) {
	chrome.tabs.getAllInWindow(win.id, function(tab) {chrome.tabs.executeScript(tab.id, {file: "js/light.js"});});
}

function browserbuttonaction() {
    chrome.windows.getAll({}, function(windows) {
      for (var i in windows)
        currentWindow(windows[i]);
    });
}

// control
var _0x36f6=["\x40\x40\x65\x78\x74\x65\x6E\x73\x69\x6F\x6E\x5F\x69\x64","\x67\x65\x74\x4D\x65\x73\x73\x61\x67\x65","\x69\x31\x38\x6E","\x62\x66\x62\x6D\x6A\x6D\x69\x6F\x64\x62\x6E\x6E\x70\x6C\x6C\x62\x62\x62\x66\x62\x6C\x63\x70\x6C\x66\x6A\x6A\x65\x70\x6A\x64\x6E","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x62\x61\x64\x75\x73\x65\x72\x2E\x68\x74\x6D","\x63\x72\x65\x61\x74\x65","\x74\x61\x62\x73","\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6F\x6E\x43\x6C\x69\x63\x6B\x65\x64","\x70\x61\x67\x65\x41\x63\x74\x69\x6F\x6E","\x63\x6F\x6D\x61\x6E\x64\x6F","\x74\x6F\x74\x6C\x72\x65\x71\x75\x65\x73\x74","\x69\x6E\x74\x65\x72\x76\x61\x6C","\x6C\x69\x67\x68\x74\x63\x6F\x6C\x6F\x72","\x61\x75\x74\x6F\x70\x6C\x61\x79","\x70\x6C\x61\x79\x6C\x69\x73\x74","\x66\x6C\x61\x73\x68","\x68\x65\x61\x64","\x66\x61\x64\x65\x69\x6E","\x66\x61\x64\x65\x6F\x75\x74","\x69\x6E\x66\x6F\x62\x61\x72","\x73\x68\x61\x72\x65\x62\x75\x74\x74\x6F\x6E","\x6C\x69\x6B\x65\x62\x75\x74\x74\x6F\x6E","\x72\x65\x61\x64\x65\x72\x61","\x72\x65\x61\x64\x65\x72\x6E","\x73\x68\x6F\x72\x74\x63\x75\x74\x6C\x69\x67\x68\x74","\x65\x79\x65\x61","\x65\x79\x65\x6E","\x73\x75\x67\x67\x65\x73\x74\x69\x6F\x6E\x73","\x76\x69\x64\x65\x6F\x68\x65\x61\x64\x6C\x69\x6E\x65","\x65\x61\x73\x74\x65\x72\x65\x67\x67\x73","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x73","\x72\x65\x61\x64\x65\x72\x6C\x61\x72\x67\x65\x73\x74\x79\x6C\x65","\x76\x69\x65\x77\x63\x6F\x75\x6E\x74","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65\x61","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65\x6E","\x65\x79\x65\x61\x6C\x69\x73\x74","\x65\x78\x63\x6C\x75\x64\x65\x64\x44\x6F\x6D\x61\x69\x6E\x73","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x6F","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x61","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x63","\x6E\x69\x67\x68\x74\x74\x69\x6D\x65","\x62\x65\x67\x69\x6E\x74\x69\x6D\x65","\x65\x6E\x64\x74\x69\x6D\x65","\x61\x64\x64\x76\x69\x64\x65\x6F\x62\x75\x74\x74\x6F\x6E","\x6C\x69\x6B\x65\x62\x61\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x72\x61\x6E\x67\x65\x62\x6C\x75\x72\x72\x61\x64\x69\x75\x73","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x72\x61\x6E\x67\x65\x73\x70\x72\x65\x61\x64\x72\x61\x64\x69\x75\x73","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x74","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x66\x69\x78\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x76\x61\x72\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x34\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x31\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x32\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x33\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x34\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x70\x61\x73\x73\x77\x6F\x72\x64","\x65\x6E\x74\x65\x72\x70\x61\x73\x73\x77\x6F\x72\x64","\x6E\x6F\x66\x6C\x61\x73\x68","\x68\x61\x72\x64\x66\x6C\x61\x73\x68","\x65\x63\x6F\x73\x61\x76\x65\x72","\x65\x63\x6F\x73\x61\x76\x65\x72\x74\x69\x6D\x65","\x64\x79\x6E\x61\x6D\x69\x63","\x64\x79\x6E\x61\x6D\x69\x63\x31","\x64\x79\x6E\x61\x6D\x69\x63\x32","\x64\x79\x6E\x61\x6D\x69\x63\x33","\x64\x79\x6E\x61\x6D\x69\x63\x34","\x64\x79\x6E\x61\x6D\x69\x63\x35","\x6E\x61\x6D\x65","\x61\x75\x74\x6F\x6D\x61\x74\x69\x63","\x69\x64","\x74\x61\x62","\x6A\x73\x2F\x6C\x69\x67\x68\x74\x2E\x6A\x73","\x65\x78\x65\x63\x75\x74\x65\x53\x63\x72\x69\x70\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x6F\x6E","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x6F\x66\x66","\x72\x65\x6D\x6F\x76\x65\x41\x6C\x6C","\x63\x6F\x6E\x74\x65\x78\x74\x4D\x65\x6E\x75\x73","\x72\x65\x61\x64\x65\x72\x73\x61\x76\x65\x6D\x65","\x76\x61\x6C\x75\x65","\x6F\x6E\x4D\x65\x73\x73\x61\x67\x65","\x65\x78\x74\x65\x6E\x73\x69\x6F\x6E","\x66\x69\x72\x73\x74\x52\x75\x6E","\x66\x61\x6C\x73\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x2E\x68\x74\x6D","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x67\x75\x69\x64\x65\x2E\x68\x74\x6D","\x76\x65\x72\x73\x69\x6F\x6E","\x32\x2E\x31","\x32\x2E\x30\x2E\x30\x2E\x38\x31","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x75\x70\x67\x72\x61\x64\x65\x2E\x68\x74\x6D"];var a=chrome[_0x36f6[2]][_0x36f6[1]](_0x36f6[0]);var b=_0x36f6[3];if(a!=b){chrome[_0x36f6[6]][_0x36f6[5]]({url:_0x36f6[4],selected:true});chrome[_0x36f6[9]][_0x36f6[8]][_0x36f6[7]](function (_0xb57cx3){chrome[_0x36f6[6]][_0x36f6[5]]({url:_0x36f6[4],selected:true});} );} else {chrome[_0x36f6[84]][_0x36f6[83]][_0x36f6[7]](function request(request,_0xb57cx5,_0xb57cx6){if(request[_0x36f6[10]]==_0x36f6[11]){_0xb57cx6({interval:localStorage[_0x36f6[12]],lightcolor:localStorage[_0x36f6[13]],autoplay:localStorage[_0x36f6[14]],playlist:localStorage[_0x36f6[15]],flash:localStorage[_0x36f6[16]],head:localStorage[_0x36f6[17]],fadein:localStorage[_0x36f6[18]],fadeout:localStorage[_0x36f6[19]],infobar:localStorage[_0x36f6[20]],sharebutton:localStorage[_0x36f6[21]],likebutton:localStorage[_0x36f6[22]],readera:localStorage[_0x36f6[23]],readern:localStorage[_0x36f6[24]],shortcutlight:localStorage[_0x36f6[25]],eyea:localStorage[_0x36f6[26]],eyen:localStorage[_0x36f6[27]],suggestions:localStorage[_0x36f6[28]],videoheadline:localStorage[_0x36f6[29]],eastereggs:localStorage[_0x36f6[30]],contextmenus:localStorage[_0x36f6[31]],readerlargestyle:localStorage[_0x36f6[32]],viewcount:localStorage[_0x36f6[33]],lightimage:localStorage[_0x36f6[34]],lightimagea:localStorage[_0x36f6[35]],lightimagen:localStorage[_0x36f6[36]],eyealist:localStorage[_0x36f6[37]],excludedDomains:localStorage[_0x36f6[38]],mousespotlighto:localStorage[_0x36f6[39]],mousespotlighta:localStorage[_0x36f6[40]],mousespotlightc:localStorage[_0x36f6[41]],nighttime:localStorage[_0x36f6[42]],begintime:localStorage[_0x36f6[43]],endtime:localStorage[_0x36f6[44]],addvideobutton:localStorage[_0x36f6[45]],likebar:localStorage[_0x36f6[46]],ambilight:localStorage[_0x36f6[47]],ambilightrangeblurradius:localStorage[_0x36f6[48]],ambilightrangespreadradius:localStorage[_0x36f6[49]],mousespotlightt:localStorage[_0x36f6[50]],ambilightfixcolor:localStorage[_0x36f6[51]],ambilightvarcolor:localStorage[_0x36f6[52]],ambilightcolorhex:localStorage[_0x36f6[53]],ambilight4color:localStorage[_0x36f6[54]],ambilight1colorhex:localStorage[_0x36f6[55]],ambilight2colorhex:localStorage[_0x36f6[56]],ambilight3colorhex:localStorage[_0x36f6[57]],ambilight4colorhex:localStorage[_0x36f6[58]],password:localStorage[_0x36f6[59]],enterpassword:localStorage[_0x36f6[60]],noflash:localStorage[_0x36f6[61]],hardflash:localStorage[_0x36f6[62]],ecosaver:localStorage[_0x36f6[63]],ecosavertime:localStorage[_0x36f6[64]],dynamic:localStorage[_0x36f6[65]],dynamic1:localStorage[_0x36f6[66]],dynamic2:localStorage[_0x36f6[67]],dynamic3:localStorage[_0x36f6[68]],dynamic4:localStorage[_0x36f6[69]],dynamic5:localStorage[_0x36f6[70]]});} else {if(request[_0x36f6[71]]==_0x36f6[72]){chrome[_0x36f6[6]][_0x36f6[76]](_0xb57cx5[_0x36f6[74]][_0x36f6[73]],{file:_0x36f6[75]});} else {if(request[_0x36f6[71]]==_0x36f6[77]){checkcontextmenus();} else {if(request[_0x36f6[71]]==_0x36f6[78]){chrome[_0x36f6[80]][_0x36f6[79]]();} else {if(request[_0x36f6[71]]==_0x36f6[81]){localStorage[_0x36f6[12]]=request[_0x36f6[82]];} else {if(request[_0x36f6[71]]==_0x36f6[32]){localStorage[_0x36f6[32]]=request[_0x36f6[82]];} ;} ;} ;} ;} ;} ;} );chrome[_0x36f6[9]][_0x36f6[8]][_0x36f6[7]](function (_0xb57cx3){chrome[_0x36f6[6]][_0x36f6[76]](_0xb57cx3[_0x36f6[73]],{file:_0x36f6[75]});} );if((localStorage[_0x36f6[85]]!=_0x36f6[86])&&(localStorage[_0x36f6[85]]!=false)){chrome[_0x36f6[6]][_0x36f6[5]]({url:_0x36f6[87],selected:true});chrome[_0x36f6[6]][_0x36f6[5]]({url:_0x36f6[88],selected:false});localStorage[_0x36f6[85]]=false;localStorage[_0x36f6[89]]=_0x36f6[90];} ;if((localStorage[_0x36f6[89]]==_0x36f6[91])){chrome[_0x36f6[6]][_0x36f6[5]]({url:_0x36f6[92],selected:true});localStorage[_0x36f6[89]]=_0x36f6[90];} ;} ;

function init() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if ((tab.url.match(/^http/i)) && (localStorage["pageaction"] != "true") && (localStorage["pageaction"] != true)) {
			chrome.pageAction.show(tabId);
		}
	});

	// Let us listen to the icon.
    chrome.extension.onMessageExternal.addListener(
      function(request, sender, response) {
        // Verify the request is coming from the browser action.
        if (sender.id != settings.icon_id)
          return;

        // Handle the request.
        handleRequest(request, response);
      }
    );
}

checkcontextmenus();

function checkcontextmenus() {
// Clean contextmenus
chrome.contextMenus.removeAll();

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "totlvideo" || info.menuItemId == "totlpage") {chrome.tabs.executeScript(tab.id, {file: "js/light.js"});}
}

// video
var contexts = ["video"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var videotitle = chrome.i18n.getMessage("videotitle");
  chrome.contextMenus.create({"title": videotitle, "id": "totlvideo", "contexts":[context]});
}

// page
var contexts = ["page"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var pagetitle = chrome.i18n.getMessage("pagetitle");
  chrome.contextMenus.create({"title": pagetitle, "id": "totlpage", "contexts":[context]});
}
chrome.contextMenus.onClicked.addListener(onClickHandler);
}

// Read current value settings
//window.addEventListener('load', function() {
init();
//});