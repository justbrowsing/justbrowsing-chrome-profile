/*jslint browser:true */
/*global DBG_LEVEL,DBGS,DBGR,DBGI,DBG1,DBG2,DBG3,chrome,HTMLElement*/

var removedElementsArr = [];
var placeHoldersArr = [];
var hasBlockedElements = false;
var started = false;
var blockFlash = true;
var blockFlashSw = 0;
var beforeLoadEvn = [];
var whiteListArr = [];
var placeHolderCfg = {};

var FLASH_MIME = ['application/x-shockwave-flash', 'application/futuresplash'];
var FLASH_EXT = ['.flv', 'swf', 'spl'];
var SILVERLIGHT_MIME = ['application/x-silverlight-2', 'application/x-silverlight'];
var SILVERLIGHT_EXT = ['.xaml'];
var showIcon = false;
var iconVisible = false;
DBG_LEVEL = 0;//DBG_ALL;
var forceBlock = false;
var whileBreaker = false;

function showHidePlaceHolders(show) {
  if (blockFlash === true) {
    var width = 0;
    var height = 0;
    var i = 0;
    for (i = placeHoldersArr.length - 1; i >= 0; i--) {
      DBG3('ChangeSize: ' + i);
      if (show === true) {
        width = placeHoldersArr[i].placeHolder.getAttribute('FFw');
        height = placeHoldersArr[i].placeHolder.getAttribute('FFh');
        placeHoldersArr[i].placeHolder.style.minWidth = placeHolderCfg.minWidth + 'px';
        placeHoldersArr[i].placeHolder.style.minHeight = placeHolderCfg.minHeight + 'px';
      }
      placeHoldersArr[i].placeHolder.style.minWidth = '0px';
      placeHoldersArr[i].placeHolder.style.minHeight = '0px';
      placeHoldersArr[i].placeHolder.style.width = width;
      placeHoldersArr[i].placeHolder.style.height = height;


    }

  }
  DBGR();
}

function isAllowed(url) {
  DBGS();
  var result = false;
  var i = 0;
  url = url.split(/\/+/g)[1];
  if (url) {
    for (i = whiteListArr.length - 1; i >= 0; i--) {
      if (whiteListArr[i].length && url.indexOf(whiteListArr[i]) >= 0) {
        DBG3('Found url on WhiteList: ' + url);  
        result = true;
        break;
      }
    }
  }

  if (forceBlock === true) {
    result = false;
  }
  DBGR();
  return result;
}

function flashFreeLoadElm(event, node) {
  DBGS('ID: ');
  var placeHolder = node;
  if (placeHolder) {
    //delete placeHoldersArr[ID];
    var parentNode = placeHolder.parentNode;
    if (event) {
      var orgNode = event.target;
      if (event.url) {
        //DBG3("PUSHING TO WHITE URL" + removedElementsArr[ID].url);
        whiteListArr.push(event.url.split(/\/+/g)[1]);
      }
      if (orgNode) {
        DBG3('NO target node found');
        orgNode.setAttribute('FF', 'true');
        parentNode.replaceChild(orgNode, placeHolder);
        //TODO ???? zakoentowalem jedna linie
//        createFlashBlocker(event);
        //beforeLoadHandler(event);
      }
    }
  } else {
    DBG3('PlaceHolder Not found! Probably unlocked manualy.');
  }
  DBGR();
}

function createPlaceHolder(event, base, width, height) {
  DBGS();
  var placeHolder = window.document.createElement('div');


  placeHolder.setAttribute('FFh', height);
  placeHolder.setAttribute('FFw', width);
  if (placeHolderCfg.show === false) {
    width = 0;
    height = 0;
  } else {
    placeHolder.style.minWidth = placeHolderCfg.minWidth + 'px';
    placeHolder.style.minHeight = placeHolderCfg.minHeight + 'px';
  }

  placeHolder.style.width = width;
  placeHolder.style.height = height;
  placeHolder.style.backgroundColor = '#' + placeHolderCfg.placeHolderColor;
  placeHolder.style.opacity = placeHolderCfg.placeHolderOpacity;
  placeHolder.style.backgroundRepeat = 'no-repeat';
  placeHolder.onmouseover = function () {
    placeHolder.style.backgroundColor = '#' + placeHolderCfg.placeHolderColorHover;
    placeHolder.style.opacity = placeHolderCfg.placeHolderOpacityHover;
    placeHolder.style.backgroundRepeat = 'no-repeat';
  };
  placeHolder.onmouseout = function () {
    placeHolder.style.backgroundColor = '#' + placeHolderCfg.placeHolderColor;
    placeHolder.style.opacity = placeHolderCfg.placeHolderOpacity;
    placeHolder.style.backgroundRepeat = 'no-repeat';
  };

  placeHolder.className = 'PlaceHolderFF';
  if (placeHolderCfg.placeHolderIcon === true) {
    var FLASH_IND = '';
    if (placeHolderCfg.placeHolderIconUrl) {
      FLASH_IND = 'url(' + placeHolderCfg.placeHolderIconUrl + ')';
    } else {
      FLASH_IND = 'url(' + chrome.extension.getURL('icon48.png') + ')';
    }
    placeHolder.style.backgroundImage = FLASH_IND;
  }

  var eventD = event;
  //placeHolder.className = "PlaceHolderFF";
  placeHolder.onclick = function () {
    flashFreeLoadElm(eventD, placeHolder);
  };
  event.target.parentNode.replaceChild(placeHolder, base);
  var ble = {};
  ble.placeHolder = placeHolder;
  ble.event = eventD;
  placeHoldersArr.push(ble);
  DBGR();
}

function blockElement(event) {


  DBGS();
  var result = true;
  var handleEvent = false;
  var element = event.target;
  do {


    if (started === false) {
      beforeLoadEvn.push(event);
      result = false;
      return result;
    }
    /*
    if (!event.url)
    {

   FiX for youtube on Wykop

    if (event.cancelable) {
       event.stopPropagation();
       event.preventDefault();
       removedElementsArr.push(event);
       if (hasBlockedElements == false)
       {
         chrome.extension.sendRequest({message: "showIcon"}, function(response) {});
         hasBlockedElements = true;
       }
     }

      break;
    }

    */
    var type = element.type;
    var elemSrc = element.src || '';
    var evntSrc = event.url || '';
    var i = 0;
    if (type) {
      type = type.toLowerCase();
      if ((FLASH_MIME.indexOf(type) >= 0) || (SILVERLIGHT_MIME.indexOf(type) >= 0)) {
        DBG3('HandleEvent type FLASH|SILVERLIGHT');
        handleEvent = true;
        break;
      }
    }

    for (i = FLASH_EXT.length - 1; i >= 0; i--) {
      if ((elemSrc.indexOf(FLASH_EXT[i]) >= 0) || (evntSrc.indexOf(FLASH_EXT[i]) >= 0)) {
        DBG3('HandleEvent FLASH_EXT');
        handleEvent = true;
        break;
      }
    }

    for (i = SILVERLIGHT_EXT.length - 1; i >= 0; i--) {
      if ((elemSrc.indexOf(SILVERLIGHT_EXT[i]) >= 0) || (evntSrc.indexOf(SILVERLIGHT_EXT[i]) >= 0)) {
        DBG3('HandleEvent SILVERLIGHT_EXT');
        handleEvent = true;
        break;
      }
    }

  } while (whileBreaker);


  if (!handleEvent) {
    result = true;
    return result;
  }
  do {
    try {
      if (element.getAttribute('FF') === 'true') {
        if (event.url) {
          DBG3('Pushing  to Whitelist url: ' + event.url);
          whiteListArr.push(event.url.split(/\/+/g)[1]);
        }
        result = true;
        break;
      }
    } catch (e) {}

    if (hasBlockedElements === false) {
      if (showIcon === true && iconVisible === false) {
        chrome.extension.sendRequest({
          message: 'showIcon'
        }, function (response) {});
        iconVisible = true;
      }
      hasBlockedElements = true;
    }

    var w = element.getAttribute('FFw');
    var h = element.getAttribute('FFh');
    var parentNode = element.parentNode;

    if (!w || !h) {
      var style = window.getComputedStyle(element);
      w = style.width;
      h = style.height;
      element.setAttribute('FFh', h);
      element.setAttribute('FFw', w);
    }

    DBGI('widht ' + w + ' height ' + h);
    if (blockFlash === false) {
      if (event.url && event.target && event.target.parentNode) {
        removedElementsArr.push(event);
      }
      result = true;
      break;
    }

    if (!parentNode) {

      parentNode = document.createElement('div');
      parentNode.appendChild(element);
      DBGI('NO PARRENT NOT FOUND creating');
    } else if (parentNode.getAttribute('FF') === 'true') {
      if (event.url) {

        DBGI('PUSNHIGN TO WHITE LIST ');
        whiteListArr.push(event.url.split(/\/+/g)[1]);
      }
      result = true;
      break;
    }

    if (event.target) {
      createPlaceHolder(event, element, w, h);
      removedElementsArr.push(event);
    }

    if (event.cancelable) {
      DBGI('Canceling event blockflash url' + event.url);
      event.stopPropagation();
      event.preventDefault();
    }
    result = false;
  } while (whileBreaker);
  DBGR();
  return result;
}

function beforeLoadHandler(event) {

//  DBGS();
  var result = true;

  //Workaround for Jabols bugs
  if (event.url === undefined) {
    return true;
  }

  do {
    var element = event.target;
    if (element && element.nodeName) {
      switch (element.nodeName.toUpperCase()) {
      case 'OBJECT':
      case 'EMBED':
        if (blockFlash === true && started === true && event.url) {
          if (isAllowed(event.url)) {
            removedElementsArr.push(event);
            if (showIcon === true && iconVisible === false) {
              chrome.extension.sendRequest({
                message: 'showIcon'
              }, function (response) {});
              iconVisible = true;
            }
            result = true;
            break;
          }
        }
        result = blockElement(event);
//        if ((result === true) && event.url && event.target && event.target.parentNode) {
          //createFlashBlocker(event);
  //      }
        break;
      default:

        break;
      }
    }
  } while (whileBreaker);

 // DBGR();
  return result;
}

function blockAll() {
  DBGS();
  if (blockFlashSw !== -1) {
    blockFlashSw = -1;
    blockFlash = true;
    var i = 0;
    var tmpArr = removedElementsArr.slice();
    removedElementsArr = [];
    for (i = tmpArr.length - 1; i >= 0; i--) {
      DBG3('Blocking ID: ' + i);
      try {
        if (tmpArr[i].target) {
          tmpArr[i].target.setAttribute('FF', 'false');
          if (tmpArr[i].target.parentNode) {
            tmpArr[i].target.parentNode.setAttribute('FF', 'false');
          }
        }
      } catch (e) {

      }
      beforeLoadHandler(tmpArr[i]);
    }
  }
  DBGR();
}

function flashFreeBlockElm(event, node) {
  DBGS();
  node.parentNode.removeChild(node);
  blockFlash = true;
  DBG3('Blocking ');
  try {
    if (event.target) {
      event.target.setAttribute('FF', 'false');
      if (event.target.parentNode) {
        event.target.parentNode.setAttribute('FF', 'false');
      }
    }
  } catch (e) {}


  var idx = whiteListArr.indexOf(event.url.split(/\/+/g)[1]);
  if (idx !== -1) {
    whiteListArr.splice(idx, 1);
  }
  forceBlock = true;
  beforeLoadHandler(event);
  forceBlock = false;
  DBGR();
}

function createFlashBlocker(event) {
  var width = 32;
  var height = 32;
  DBGS();
  var placeHolder = window.document.createElement('div');

  placeHolder.style.width = width + 'px';
  placeHolder.style.height = height + 'px';
  placeHolder.style.position = 'absolute';
  placeHolder.style.display = 'block';
  placeHolder.style.zIndex = 9999;
  var top = parseInt(event.target.getAttribute('FFh'), 10);
  var left = (parseInt(event.target.getAttribute('FFw'), 10) - width) / 2;
  placeHolder.style.top = '-' + top + 'px';
  //placeHolder.style.left = left + "px";
  //placeHolder.style.backgroundColor = "#" + placeHolderCfg.placeHolderColor;
  //placeHolder.style.opacity= placeHolderCfg.placeHolderOpacity;
  placeHolder.style.backgroundRepeat = 'no-repeat';
  /*
    placeHolder.onmouseover =function() {
          //placeHolder.style.backgroundColor = "#" + placeHolderCfg.placeHolderColorHover;
      placeHolder.style.opacity= placeHolderCfg.placeHolderOpacityHover;
      placeHolder.style.backgroundRepeat = "no-repeat";
        };
        placeHolder.onmouseout =function() {
          //placeHolder.style.backgroundColor = "#" + placeHolderCfg.placeHolderColor;
      placeHolder.style.opacity= placeHolderCfg.placeHolderOpacity;
      placeHolder.style.backgroundRepeat = "no-repeat";
        };
        */
  //placeHolder.className = "PlaceHolderFF";
  var FLASH_IND = 'url(' + chrome.extension.getURL('close32.png') + ')';
  placeHolder.style.backgroundImage = FLASH_IND;
  var eventD = event;
  placeHolder.onclick = function () {
    flashFreeBlockElm(eventD, placeHolder);
  };
  //event.target.appendChild(placeHolder);
  DBGR();
}

function unblockAll() {
  DBGS();
  if (blockFlashSw !== 1) {
    blockFlashSw = 1;
    blockFlash = false;
    var i = 0;
    for (i = placeHoldersArr.length - 1; i >= 0; i--) {
      DBG3('UnBlocking ID: ' + i);
      flashFreeLoadElm(placeHoldersArr[i].event, placeHoldersArr[i].placeHolder);
    }
    placeHoldersArr = [];
  }
  DBGR();
}

function onloadFN() {
  var index = 0;
  var objs = document.getElementsByTagName('object');
  for (index = 0; index < objs.length; index++) {
    beforeLoadHandler(objs[index]);
  }
  var embeds = document.getElementsByTagName('embed');
  for (index = 0; index < objs.length; index++) {
    beforeLoadHandler(objs[index]);
  }
}

window.document.addEventListener('beforeload', beforeLoadHandler, true);


//window.document.addEventListener("DOMNodeInsertedIntoDocument", beforeLoadHandler, true);
//window.document.addEventListener("load", beforeLoadHandler, true);
//window.document.addEventListener("DOMContentLoaded", onloadFN, true);
//window.document.addEventListener("DOMNodeInserted", beforeLoadHandler, true);

//window.document.addEventListener("DOMSubtreeModified", beforeLoadHandler, true);
//window.document.addEventListener("DOMCharacterDataModified", beforeLoadHandler, true);
//document.addEventListener("DOMContentLoaded", beforeLoadHandler, true);

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.message === 'unblock') {
    DBGI('');
    sendResponse({});
    if (request.cookie) {
      document.cookie = 'allowFlash=' + request.cookie;
    }
    setTimeout(unblockAll(), 10);

  } else if (request.message === 'block') {
    DBGI('');
    if (request.cookie) {
      document.cookie = 'allowFlash=' + request.cookie;
    }
    sendResponse({});
    setTimeout(blockAll(), 10);
  } else if (request.message === 'showPlaceHolders') {
    showHidePlaceHolders(true);
    sendResponse({});
  } else if (request.message === 'hidePlaceHolders') {
    showHidePlaceHolders(false);
    sendResponse({});
  }
});

if (window.document.documentElement instanceof HTMLElement) {
  if (window.document.location !== 'about:blank') {
    chrome.extension.sendRequest({
      message: 'getConfig'
    }, function (response) {
      DBGS();

      blockFlash = response.block;
      var enabled = response.enabled;
      var i = 0;
      placeHolderCfg = response.placeholderCfg;
      showIcon = response.showIcon;
      whiteListArr = response.whiteList;
      if (!enabled) {
        blockFlash = false;
        document.removeEventListener('beforeload', beforeLoadHandler, true);
        if (showIcon === true && iconVisible === false) {
          chrome.extension.sendRequest({
            message: 'showIcon'
          }, function (response) {});
        }
        iconVisible = true;
      }
      started = true;
      if (beforeLoadEvn) {
        for (i = beforeLoadEvn.length - 1; i >= 0; i--) {
          beforeLoadHandler(beforeLoadEvn[i]);
        }
        beforeLoadEvn = [];
      }
      DBGR();
    });
  }
}