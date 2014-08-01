// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// TODOs:
// - deal with titles appropriately (trunk them if too long, replace with
//   URL if missing)
// - ensure payload size is less than 512 bytes, don't include URL if it is.
var backgroundPage = chrome.extension.getBackgroundPage();
var cloudPrintBaseUrl;
var helpUrl = 'https://support.google.com/chrome/?p=ib_chrome_to_mobile';
var searchingForDevices = false;

// The id of the tab we are associated with.
var tabId;

var realName;
var verifiedEmail;

// The id of the current snapshot, 0 if no snapshot was generated.
var snapshotId = 0;

var snapshotEnabled = false;
var sendSnapshot = false;
var sendSnapshotSelected = false;
var snapshotReceived = false;

/**
* This field is set to the device id if we can only find one device.
*/
var singleDeviceId;
/**
* When the user hits the send button, we set this field to the selected device id to use it for
* retries, and callbacks that do not have access to the device id in any other way.
*/
var selectedDeviceId;
/**
* When the user hits the send button, we set this field to the selected device name to use it for
* retries, and callbacks that do not have access to the device id in any other way.
*/
var selectedDeviceName;

var currentlySending = false;

var animatingEllipsis = false;

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(data) {
    dataReady(data);
  });
});

function initChrome2Device() {
  console.log("initChrome2Device: Initializing Chrome 2 Device");
  retrieveServerUrl();
  updateLoginStatus();
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT, active: true },
      function(tabs) {
    tabId = tabs[0].id;
    // The backgroud page may still have an old snapshot.
    backgroundPage.removeSnapshotForTab(tabId);
    // Let's only continue with the initialization once our tab id is set.
    isLoggedIn(
      function success() { requestAuthorization(); },
      function failure() { window.setTimeout(showSignIn, 0); }
    );
  });
  snapshotEnabled = chrome.pageCapture != undefined;
}

function addClickEventListener(elementId, fun) {
  var element = window.document.getElementById(elementId);
  element.addEventListener('click', fun, false);
}

function showSignIn() {
  var messageDiv = document.getElementById('messageDiv');
  messageDiv.classList.remove("hidden");
  messageDiv.innerHTML = chrome.i18n.getMessage("welcomeMessage");
  var html = '';
  html += '<button id="signInCancelButton">' +
      chrome.i18n.getMessage("cancelButton") + '</button>';
  html += '<button id="connectButton">' +
      chrome.i18n.getMessage("connectButton") + '</button>';
  var buttonsDiv = document.getElementById('buttonsDiv');
  buttonsDiv.classList.remove("hidden");
  buttonsDiv.innerHTML = html;

  addClickEventListener("signInCancelButton", function(evt) {
    window.close();
  });

  addClickEventListener("connectButton", function(evt) {
    requestAuthorization();
    window.close();
  });

  window.setTimeout(focusConnectButton, 0);
}

function requestAuthorization() {
  console.log("requestAuthorization: Trying to authorize. Clearing old data.");
  // TODO(fbeaufort): Add chrome.identity.onSignInChanged observer when API becomes available.
  clearStoredDeviceInformation();
  chrome.identity.getAuthToken({ 'interactive': true }, function() {
    if (!chrome.runtime.lastError) {
      console.log("requestAuthorization: Authorized");
      authorized();
    }
  });
}

function authorized() {
  console.log("authorized: Authorized");
  updateLoginStatus();
  requestEmailAndRealName();
  retrieveDevices();
  showDevices();
}

function retrieveServerUrl() {
  console.log("retrieveServerUrl: Loading...");
  cloudPrintBaseUrl = backgroundPage.retrieveServerUrl();
  console.log("retrieveServerUrl: Loaded " + cloudPrintBaseUrl);
}

function openDevChannelTab() {
  chrome.tabs.create({'url': 'http://www.chromium.org/getting-involved/dev-channel',
      'selected': true});
}

// disableEllipsisAnimation is an optional parameter.
function showMessage(msg, disableEllipsisAnimation) {
  console.log("showMessage: " + msg);
  if (typeof(disableEllipsisAnimation) == "undefined") {
    disableEllipsisAnimation = true;
  }
  if (disableEllipsisAnimation) {
    // Stop any currently animating ellipsis.
    animatingEllipsis = false;
  }
  var messageDiv = document.getElementById('messageDiv');
  messageDiv.classList.remove("hidden");
  messageDiv.innerHTML = msg;
}

function getTabId() {
  return tabId;
}

function setSnapshotCheckboxEnabled(enabled) {
  var includeSnapshotLabel = document.getElementById('includeSnapshotLabel');
  var snapshotCheckbox = document.getElementById('snapshotCheckbox');
  if (enabled) {
    includeSnapshotLabel.classList.remove('disabledText');
    snapshotCheckbox.disabled = false;
  } else {
    includeSnapshotLabel.classList.add('disabledText');
    snapshotCheckbox.disabled = true;
  }
}

// Called by the background page when a snapshot has been generated.
function snapshotGenerated(snapshotSize) {
  trackEvent(['Snapshot', 'Generation', 'Success']);
  snapshotReceived = true;
  var sizeString = "";
  var kbSize = snapshotSize / 1024;
  if (kbSize < 1) {
    sizeString = "1 KB";
  } else if (kbSize < 1024) {
    sizeString = Math.round(kbSize) + " KB";
  } else {
    var mbSize = (kbSize / 1024).toFixed(1);
    var dotZeroIndex = mbSize.indexOf(".0");
    if (dotZeroIndex != -1)
      mbSize = mbSize.slice(0, dotZeroIndex);
    sizeString =  mbSize + " MB";
  }
  document.getElementById('includeSnapshotLabel').textContent =
      chrome.i18n.getMessage("includeSnapshotMessageWithSize", [ sizeString ]);
  setSnapshotCheckboxEnabled(true);
}

function updateLoginStatus() {
  var welcomeHeaderDiv = document.getElementById('welcomeHeaderDiv');
  var connectedHeaderDiv = document.getElementById('connectedHeaderDiv');
  isLoggedIn(
    function success() {
      console.log("updateLoginStatus: Logged in");
      welcomeHeaderDiv.classList.add("hidden");
      connectedHeaderDiv.classList.remove("hidden");
      updateRealNameDisplay();
      updateEmailDisplay();
    },
    function failure() {
      console.log("updateLoginStatus: Not logged in");
      welcomeHeaderDiv.classList.remove("hidden");
      connectedHeaderDiv.classList.add("hidden");
      welcomeHeaderDiv.innerHTML = chrome.i18n.getMessage("extensionName");
      connectedHeaderDiv.classList.add("hidden");
    }
  );
}

function updateRealNameDisplay() {
  if (realName) {
    var realNameDiv = document.getElementById('realNameDiv');
    realNameDiv.classList.remove("hidden");
    realNameDiv.textContent = realName;
  } else {
    document.getElementById('accountNameDiv').classList.add("hidden");
  }
}

function updateEmailDisplay() {
  var accountNameDiv = document.getElementById('accountNameDiv');
  if (verifiedEmail) {
    accountNameDiv.classList.remove("hidden");
    accountNameDiv.textContent = verifiedEmail;
  } else {
    accountNameDiv.classList.add("hidden");
  }
}

function focusConnectButton() {
  document.getElementById('connectButton').focus();
}

function isLoggedIn(successCallback, failureCallback) {
  chrome.identity.getAuthToken(function() {
    if (chrome.runtime.lastError)
      failureCallback();
    else
      successCallback();
  });
}

function showDevices() {
  console.log("showDevices: Showing devices");
  if (searchingForDevices && backgroundPage.devices.length == 0) {
    console.log("showDevices: Searching for devices");
    showMessageWithAnimation("searchingForDevices");
    hideButtonsAndDevices();
  } else {
    if (backgroundPage.devices.length == 0) {
      console.log("showDevices: No devices found");
      var learnMoreHtml =
          '<a href="javascript:void(0);" id="learnMoreHtml">' +
          chrome.i18n.getMessage("learnMore") + '</a>';
      showMessage(
          chrome.i18n.getMessage("noMobileDevicesFound", [learnMoreHtml]));
      addClickEventListener("learnMoreHtml", function(evt) {
        openHelpTab('NoDevicesFound');
        window.close();
      });
      hideButtonsAndDevices();
      return;
    }
    if (snapshotEnabled) {
      backgroundPage.generateSnapshot(tabId);
    }

    lastSelected = retrieveLastSelectedId();
    var html = "";
    var singleDeviceName;
    // Need to clear the singleDeviceId field to make sure we do the correct choice in sendData()
    singleDeviceId = null;
    for (var i = 0, device; device = backgroundPage.devices[i]; ++i) {
      html += '<input type="radio" name="device" value="' +
          device.id + '" id="' + device.id + '" ';
      if (backgroundPage.devices.length == 1) {
        // Only one device, so we should autoselect and store
        storeLastSelectedId(device.id);
        singleDeviceId = device.id;
        singleDeviceName = escapeHTML(device.name);
        break;
      } else if (device.id == lastSelected) {
        // Previously selected device so we autoselect it
        html += 'checked="checked"';
      }
      html += '/><label for="' + device.id + '"';
      if (device.id == lastSelected) {
        html += ' class="selectedDevice"';
      }
      html += '>' + escapeHTML(device.name) + '</label><br/>';
    }
    var snapshotHtml;
    if (snapshotEnabled) {
      snapshotHtml = '<input type="checkbox" name="includeSnapshot" id="snapshotCheckbox"';
      if (sendSnapshotSelected) {
        snapshotHtml += 'checked ';
      }
      snapshotHtml += '/>' +
          '<label id="includeSnapshotLabel" for="snapshotCheckbox">' +
              chrome.i18n.getMessage("includeSnapshotMessage") + '</label>';
    } else {
      snapshotHtml = '<p id="snapDisabled" class="disabledText">' +
          chrome.i18n.getMessage("snapshotDisabledMessage") + '</p>';
    }
    if (singleDeviceName) {
      showMessage(chrome.i18n.getMessage("sendThisPageTo",
          ['<span class="selectedDevice">' + singleDeviceName + '</span>']));
    } else {
      showMessage(chrome.i18n.getMessage("sendThisPageToList"));
      var deviceListDiv = document.getElementById('deviceListDiv');
      deviceListDiv.classList.remove("hidden");
      deviceListDiv.innerHTML = html;
      for (var i = 0, device; device = backgroundPage.devices[i]; ++i) {
        addClickEventListener(device.id, function(evt) {
          updateSelectedDevice(this);
        });
      }
    }
    var includeSnapshotDiv = document.getElementById('includeSnapshotDiv');
    includeSnapshotDiv.classList.remove("hidden");
    includeSnapshotDiv.innerHTML = snapshotHtml;
    if (snapshotEnabled) {
      addClickEventListener("snapshotCheckbox", function(evt) {
        sendSnapshotCheckboxClicked();
      });
    }
    if (!snapshotReceived) {
      setSnapshotCheckboxEnabled(false);
    }
    showButtons();
  }
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function sendSnapshotCheckboxClicked() {
  var snapshotCheckbox = document.getElementById('snapshotCheckbox');
  sendSnapshotSelected = snapshotCheckbox.checked;
}

function storeLastSelectedId(deviceId) {
  console.log("storeLastSelectedId: Storing " + deviceId);
  backgroundPage.storeLastSelectedId(deviceId);
}

function retrieveLastSelectedId() {
  console.log("retrieveLastSelectedId: Loading...");
  last = backgroundPage.retrieveLastSelectedId();
  console.log("retrieveLastSelectedId: Loaded " + last);
  return last;
}

function storeDevices(devices) {
  console.log("storeDevices: Storing devices.");
  return backgroundPage.storeDevices(devices);
}

function clearStoredDeviceInformation() {
  console.log("clearStoredDevices: Clearing stored device information.");
  storeDevices([]);
  storeLastSelectedId('');
}

function hideButtonsAndDevices() {
  document.getElementById('deviceListDiv').classList.add("hidden");
  document.getElementById('includeSnapshotDiv').classList.add("hidden");
  document.getElementById('helpDiv').classList.add("hidden");
  document.getElementById('buttonsDiv').classList.add("hidden");
}

function showButtons() {
  var helpHtml = '<a href="javascript:void(0);" id="helpHtml">' +
      chrome.i18n.getMessage("help") + '</a>';
  var html = '';
  html += '<button id="cancelButton">' +
      chrome.i18n.getMessage("cancelButton") + '</button>';
  html += '<button id="sendButton">' +
      chrome.i18n.getMessage("sendButton") + '</button>';
  var helpDiv = document.getElementById('helpDiv');
  helpDiv.classList.remove("hidden");
  helpDiv.innerHTML = helpHtml;
  var buttonsDiv = document.getElementById('buttonsDiv');
  buttonsDiv.classList.remove("hidden");
  buttonsDiv.innerHTML = html;

  addClickEventListener("helpHtml", function(evt) {
    openHelpTab('Menu');
    window.close();
  });
  addClickEventListener("cancelButton", function(evt) {
    window.close();
  });
  addClickEventListener("sendButton", function(evt) {
    sendData();
  });

  window.setTimeout(focusSendButton, 0);
}

function focusSendButton() {
  document.getElementById('sendButton').focus();
}

function openHelpTab(linkId) {
  trackEvent(['Help', 'Opened', linkId]);
  chrome.tabs.create({'url': helpUrl, 'selected': true});
}

function updateSelectedDevice(inputObject) {
  var lastSelectedDevice = "label[for='" + retrieveLastSelectedId() + "']";
  var newSelectedDevice = "label[for='" + inputObject.id + "']";
  if (document.querySelector(lastSelectedDevice))
    document.querySelector(lastSelectedDevice).classList.remove("selectedDevice");
  document.querySelector(newSelectedDevice).classList.add("selectedDevice");
  storeLastSelectedId(inputObject.id);
}

function updateSelectedDeviceName() {
  lastSelected = retrieveLastSelectedId();
  for (var i = 0, device; device = backgroundPage.devices[i]; ++i) {
    if (device.id == lastSelected) {
      selectedDeviceName = escapeHTML(device.name);
      break;
    }
  }
}

function retrieveDevices() {
  console.log("retrieveDevices: Retrieving devices");
  trackEvent(['Devices', 'List', 'Requested']);
  backgroundPage.retrieveDevices();
  searchingForDevices = true;
  chrome.identity.getAuthToken(function(token) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          onPrinterListReceived(xhr.responseText, xhr);
        } else {
          console.log("retrieveDevices-inner: Did not get status code 200");
          if (xhr.status === 401)
            chrome.identity.removeCachedAuthToken({ 'token': token }, function() {});
          var tryAgainLink = '<a href="javascript:void(0)" id="tryRetrieveAgainLink">' +
              chrome.i18n.getMessage("tryAgain") + '</a>';
          showMessage(chrome.i18n.getMessage("errorRetrieving", [tryAgainLink]));
          addClickEventListener("tryRetrieveAgainLink", function(evt) {
            retrieveDevices();
          });
        }
      }
    };
    url = cloudPrintBaseUrl + "search";
    console.log("retrieveDevices: Retrieving from: " + url);
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-CloudPrint-Proxy', 'Chrome_Desktop');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);
    xhr.send(null);
  });
}

function onPrinterListReceived(text, xhr) {
  console.log("onPrinterListReceived: printers received.");
  searchingForDevices = false;
  var data = JSON.parse(text);
  if (!data['success']) {
    console.log("onPrinterListReceived: Request failed: Printer list: " + text);
    return false;
  }
  var newDevices = new Array();
  for (var i = 0, entry; entry = data.printers[i]; i++) {
    if (isAndroidPrinter(entry['type']) || isIOSPrinter(entry['type'])) {
      // Use displayName if available, else fall back to the default device name.
      var name = entry['displayName'] ? entry['displayName'] : entry['name'];
      var printer = {
        'name' : name,
        'id' : entry['id'],
        'type' : entry['type'],
        'createtime': parseInt(entry['createtime'])
      };
      // Sort the devices by their time of registration so the order stays
      // consistent, as Cloud Print does not guarantee any kind of order.
      var insertionIndex = 0;
      for (insertionIndex = 0; insertionIndex < newDevices.length;
           insertionIndex++) {
        if (printer.createtime > newDevices[insertionIndex].createtime) {
          break;
        }
      }
      newDevices.splice(insertionIndex, 0, printer);
    }
  }
  // Remove the createtime attribute, we only needed it for sorting.
  for (var i = 0, printer; printer = newDevices[i]; i++) {
    delete printer['createtime'];
  }

  trackEvent(['Devices', 'List', 'Length', newDevices.length])
  var deviceListChanged = storeDevices(newDevices);
  if (newDevices.length == 0 || deviceListChanged && !currentlySending) {
    showDevices();
  }
}

function sendData() {
  console.log("sendData: Trying to send data");
  if (singleDeviceId) {
    selectedDeviceId = singleDeviceId;
    console.log("sendData: Found single selected device id = " + selectedDeviceId);
  } else {
    var queryResult = document.querySelectorAll("input[name=device][type=radio]:checked");
    if (queryResult.length == 0) {
        console.log('sendData: User has not selected a device. Ignoring');
        return;
    }
    selectedDeviceId = queryResult[0].value;
    console.log("sendData: Found selected device id = " + selectedDeviceId);
  }
  // We need to store the sendSnapshot state for try again functionality to work with snapshots.
  sendSnapshot = snapshotEnabled && sendSnapshotSelected;
  console.log("sendData: Stored state sendSnapshot = " + sendSnapshot);
  updateSelectedDeviceName();
  sendDataWithCurrentlySelectedDeviceId();
}

/**
* This method is used directly by the try again functionality.
*/
function sendDataWithCurrentlySelectedDeviceId() {
  console.log("sendDataWithCurrentlySelectedDeviceId: Using printerid = " + selectedDeviceId);
  currentlySending = true;
  showMessageWithAnimation("sending");
  hideButtonsAndDevices();
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT, active: true },
      function(tabs) {
    var tab = tabs[0];
    if (tab.url.match(/^http[s]?:\/\/maps\.google\./) ||
        tab.url.match(/^http[s]?:\/\/www\.google\.[a-z]{2,3}(\.[a-z]{2})?\/maps/)) {
        console.log('sendDataWithCurrentlySelectedDeviceId-inner: Loading content script for Google Maps');
        chrome.tabs.executeScript(tab.id, {file: "js/content_script.js"});
      } else {
        var data = {
            'url': tab.url,
            'title': tab.title
        };
        dataReady(data);
      }
    });
}

function showMessageWithAnimation(messageResource) {
  animatingEllipsis = true;
  animateEllipsis(0, messageResource);
}

function animateEllipsis(count, messageResource) {
  if(!animatingEllipsis) {
    return;
  }

  var message = chrome.i18n.getMessage(messageResource);
  count = count % 4;
  if (count > 0) {
    message = chrome.i18n.getMessage("progress" + count, message);
  }
  showMessage(message, false);
  window.setTimeout(function() {
    animateEllipsis(++count, messageResource);
  }, 700);
}

function dataReady(data) {
  console.log('dataReady: Preparing snapshot data for sending');
  trackEvent(['Sending', 'Type', 'URL']);
  var snapshotId = Math.uuid();
  chrome.identity.getAuthToken(function(token) {
    backgroundPage.sendDataWithUrl(selectedDeviceId, data.url, data.title, tabId,
        snapshotId,
        sendSnapshot ? URL_WITH_DELAYED_SNAPSHOT_JOB_TYPE : URL_JOB_TYPE,
        token);
    if (sendSnapshot) {
      trackEvent(['Sending', 'Type', 'Snapshot']);
      backgroundPage.sendDataWithUrl(selectedDeviceId, data.url, data.title,
          tabId, snapshotId, SNAPSHOT_JOB_TYPE, token);
    }
  });
}

function requestEmailAndRealName() {
  console.log("requestEmailAndRealName: Sending request for user profile data");
  chrome.identity.getAuthToken(function(token) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          handleGotEmailAndRealName(xhr.responseText);
        } else {
          console.log("requestEmailAndRealName-inner: Did not get status code 200");
        }
      }
    };
    xhr.open('GET', "https://www.googleapis.com/oauth2/v1/userinfo", true);
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);
    xhr.send();
  });
}

function handleGotEmailAndRealName(text) {
  console.log("handleGotEmailAndRealName: Parsing JSON from: " + text);
  var jsonObject = JSON.parse(text);
  if (jsonObject) {
    if (jsonObject['email']) {
      console.log("handleGotEmailAndRealName: Got e-mail address: " + jsonObject['email']);
      verifiedEmail = jsonObject['email'];
    }
    if (jsonObject['name']) {
      console.log("handleGotEmailAndRealName: Got name: " + jsonObject['name']);
      realName = jsonObject['name'];
    }
  }
  updateEmailDisplay();
  updateRealNameDisplay();
}

function showSubmitErrorMessage() {
  var deviceNameString =
      '<span class="selectedDevice">' + selectedDeviceName + '</span>';
  var tryAgainLink =
      '<a href="javascript:void(0)" id = "trySubmitAgainLink">' +
      chrome.i18n.getMessage("tryAgain") + '</a>';
  showMessage(chrome.i18n.getMessage("error",
      [deviceNameString, tryAgainLink]));
  addClickEventListener("trySugmitAgainLink", function(evt) {
    sendDataWithCurrentlySelectedDeviceId();
  });
}

function failedToGenerateSnapshot() {
  trackEvent(['Snapshot', 'Generation', 'Error']);
  sendSnapshotSelected = false;
  document.querySelector('includeSnapshotDiv').innerHTML =
      '<p class="disabledText">' +
      chrome.i18n.getMessage("errorGeneratingSnapshot") + '</p>';
}
