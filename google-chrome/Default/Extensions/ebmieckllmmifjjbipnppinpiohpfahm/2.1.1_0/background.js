/*jslint browser:true */
/*global Store,chrome*/

var settings = new Store('settings');
//setDefault Values
function setDefault(settings) {
  //First Run - no value stored
  if (settings.get('enable') === undefined) {
    settings.set('enable', true);
  }
  if (settings.get('showPlaceHolders') === undefined) {
    settings.set('showPlaceHolders', true);
  }
  if (settings.get('placeHolderColor') === undefined) {
    settings.set('placeHolderColor', '999999');
  }
  if (settings.get('placeHolderOpacity') === undefined) {
    settings.set('placeHolderOpacity', 0.9);
  }
  if (settings.get('placeHolderColorHover') === undefined) {
    settings.set('placeHolderColorHover', '444444');
  }
  if (settings.get('placeHolderOpacityHover') === undefined) {
    settings.set('placeHolderOpacityHover', 0.9);
  }
  if (settings.get('placeHolderIcon') === undefined) {
    settings.set('placeHolderIcon', true);
  }
  if (settings.get('showIcon') === undefined) {
    settings.set('showIcon', true);
  }
  if (settings.get('placeHolderminWidth') === undefined) {
    settings.set('placeHolderminWidth', 48);
  }
  if (settings.get('placeHolderminHeight') === undefined) {
    settings.set('placeHolderminHeight', 48);
  }
  if (settings.get('placeHolderIconUrl') === undefined) {
    settings.set('placeHolderIconUrl', '');
  }
}

function isOnWhiteList(url) {
  var result = false;
  var whiteList = [];
  var i = 0;
  if (url.substring(0, 4) === 'www.') {
    url = url.slice(4);
  }
  try {
    whiteList = settings.get('whiteListBox').split('|@|');
  } catch (e) {
    result = false;
  }
  if (whiteList) {
    for (i = whiteList.length - 1; i >= 0; i--) {
      if (whiteList[i].length < 1) {
        continue;
      }

      var pattern = '(^';
      pattern += whiteList[i].replace(/\*/g, '(.)*?');
      pattern += ')';
      var regExp = new RegExp(pattern, 'g');
      var found = regExp.test(url);
//            var found = whiteList[i].search(url);
      if (found === true) {
        result = true;
        break;
      }
    }
  }
  return result;
}

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
  if (request.message === 'showIcon') {
    chrome.pageAction.show(sender.tab.id);
    sendResponse({});
  } else if (request.message === 'getConfig') {
    var whiteList = [];
    var block = !isOnWhiteList(sender.tab.url.split(/\/+/g)[1]);
    var placeholder = {};
    try {
      whiteList = settings.get('whiteListBox').split('|@|');
    } catch (e) {
      whiteList = [];
    }
    placeholder.show = settings.get('showPlaceHolders');
    placeholder.placeHolderColor = settings.get('placeHolderColor');
    placeholder.placeHolderOpacity = settings.get('placeHolderOpacity');
    placeholder.placeHolderColorHover = settings.get('placeHolderColorHover');
    placeholder.placeHolderOpacityHover = settings.get('placeHolderOpacityHover');
    placeholder.placeHolderIcon = settings.get('placeHolderIcon');
    placeholder.minWidth = settings.get('placeHolderminWidth');
    placeholder.minHeight = settings.get('placeHolderminHeight');
    placeholder.placeHolderIconUrl = settings.get('placeHolderIconUrl');
    sendResponse({
      block: block,
      whiteList: whiteList,
      enabled: settings.get('enable'),
      placeholderCfg: placeholder,
      showIcon: settings.get('showIcon')
    });
  }
  // Return nothing to let the connection be cleaned up.
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

setDefault(settings);
