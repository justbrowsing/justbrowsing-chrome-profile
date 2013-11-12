/*jslint browser:true */
/*global Store,chrome*/

var settings = new Store('settings');
var domainURL = '';
var curTab;
function doNotBlockDomain() {
  var bcgPage = chrome.extension.getBackgroundPage();
  var whiteList = [];
  try {
    whiteList = settings.get('whiteListBox').split('|@|');
  } catch (e) {
    console.log('Empty localstorage');
  }
  if (whiteList.indexOf(domainURL) === -1) {
    whiteList.push(domainURL);
    settings.set('whiteListBox', whiteList.join('|@|'));
  }
  window.close();
  chrome.tabs.sendRequest(curTab.id, {message: 'unblock'}, function (response) {});
}

function BlockDomain() {
  var bcgPage = chrome.extension.getBackgroundPage();
  var whiteList = [];
  try {
    whiteList = settings.get('whiteListBox').split('|@|');
  } catch (e) {
    console.log('Empty localstorage');
  }
  var idx = whiteList.indexOf(domainURL);
  if (idx !== -1) {
    whiteList.splice(idx, 1);
    settings.set('whiteListBox', whiteList.join('|@|'));
  }
  window.close();
  chrome.tabs.sendRequest(curTab.id, {message: 'block'}, function (response) {});
}

function toggleOnOff(change) {
  var onOffNode = document.getElementById('toggleOnOff');
  var bcgPage = chrome.extension.getBackgroundPage();
  if (bcgPage.settings.get('enable')) {
    onOffNode.checked = true;
    if (change) {
      chrome.tabs.sendRequest(curTab.id, {message: 'unblock'}, function (response) {});
      bcgPage.settings.set('enable', false);
    }
  } else {
    onOffNode.checked = false;
    if (change) {
      chrome.tabs.sendRequest(curTab.id, {message: 'block'}, function (response) {});
      bcgPage.settings.set('enable', true);
    }
  }
  if (change) {
    window.close();
  }
}

function usePlaceHolders(change) {
  var onOffNode = document.getElementById('usePlaceHolders');
  var bcgPage = chrome.extension.getBackgroundPage();

  if (bcgPage.settings.get('showPlaceHolders')) {
    onOffNode.checked = true;
    if (change) {
      bcgPage.settings.set('showPlaceHolders', false);
      chrome.tabs.sendRequest(curTab.id, {message: 'hidePlaceHolders'}, function (response) {});
    }
  } else {
    onOffNode.checked = false;
    if (change) {
      chrome.tabs.sendRequest(curTab.id, {message: 'showPlaceHolders'}, function (response) {});
      bcgPage.settings.set('showPlaceHolders', true);
    }
  }
  if (change) {
    window.close();
  }
}

function init() {
  chrome.tabs.getSelected(null, function (tab) {
    curTab = tab;
    var whiteList = [];
    var bcgPage = chrome.extension.getBackgroundPage();
    var urlNode = document.getElementById('tabURL');
    var curURL = tab.url.split(/\/+/g)[1];
    if (curURL.substring(0, 4) === 'www.') {
      curURL = curURL.slice(4);
    }
    domainURL = curURL;
    var idx;
    try {
      whiteList = bcgPage.settings.get('whiteListBox').split('|@|');
      idx = whiteList.indexOf(domainURL);
    } catch (e) {
      idx = -1;
    }
    if (idx === -1) {
      urlNode.innerText = 'Always allow flash on this site';
      urlNode.innerText = 'Whitelist this site';
      urlNode.onclick = doNotBlockDomain;
      urlNode.className = 'FFbox FFgreen';
    } else {
      urlNode.innerText = 'Always block flash on this site';
      urlNode.innerText = 'Remove from Whitelist';
      urlNode.onclick = BlockDomain;
      urlNode.className = 'FFbox FFred';
    }
    toggleOnOff(false);
    usePlaceHolders(false);
  });
}

function runOptions(change) {
  window.open(chrome.extension.getURL('options.html'));
}

init();
window.document.addEventListener('DOMContentLoaded', function () {
  window.document.getElementById('toggleOnOff').addEventListener('click', toggleOnOff);
  window.document.getElementById('usePlaceHolders').addEventListener('click', usePlaceHolders);
  window.document.getElementById('runOptions').addEventListener('click', runOptions);
});
