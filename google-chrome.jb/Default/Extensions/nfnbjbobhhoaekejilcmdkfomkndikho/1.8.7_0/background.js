// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf("http") == 0) {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var seltext = "";

chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
	switch(request.message)
	{
		case 'setText':
			window.seltext = request.data;			
		break;
		case 'getClickedEl':
			sendResponse({activeName: this.activeName,activeAttr:this.activeAttr,seltext:this.seltext});
		break;
		default:
			sendResponse({data: 'Invalid arguments'});
		break;
	}
});

var activeName;
var activeAttr;
function GenerateSmartQrcode(info,tab){	
	chrome.tabs.sendRequest(tab.id, "getClickedEl", function(clickedEl) {
        activeName = clickedEl.typeName;
		activeAttr = clickedEl.value;
		if(activeName){			
			//var popupUrl=chrome.extension.getURL('popup.html');
			//chrome.tabs.create({url: popupUrl})
			chrome.tabs.sendRequest(tab.id, "showmodal", function() {
			});
		}
    });
}
chrome.contextMenus.create({"title":chrome.i18n.getMessage("generate_qrcode"),
"contexts":["all","frame", "selection", "link", "image","video", "audio"],
"onclick": GenerateSmartQrcode});

var isNew=false;
if (localStorage['currentVersion']) {
    if (localStorage['currentVersion'] != chrome.app.getDetails().version) {
        localStorage['currentVersion'] = chrome.app.getDetails().version;
        isNew = true;
    }
} else {
    localStorage['currentVersion'] = chrome.app.getDetails().version;
    isNew = true; }

if (isNew) {
    chrome.tabs.create({
        url: '/options.html'
    });
}