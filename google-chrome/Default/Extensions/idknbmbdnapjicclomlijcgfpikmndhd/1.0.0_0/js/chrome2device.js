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

var googleAuth;
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
  createOAuth2Client();
  updateLoginStatus();
  chrome.tabs.getSelected(null, function(tab) {
    tabId = tab.id;
    // The backgroud page may still have an old snapshot.
    backgroundPage.removeSnapshotForTab(tabId);
    // Let's only continue with the initialization once our tab id is set.
    if (!isLoggedIn()) {
      window.setTimeout(showSignIn, 0);
    } else {
      requestAuthorization();
    }
  });
  snapshotEnabled = chrome.pageCapture != undefined;
}

function createOAuth2Client() {
  console.log("createOAuth2Client: Creating OAuth2 client");
  googleAuth = new OAuth2('google', {
    client_id: '648230873233.apps.googleusercontent.com',
    client_secret: 'M5yYVtNmPGr3lEedtWJ7-w4F',
    api_scope: 'https://www.googleapis.com/auth/cloudprint https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  });
}

function showSignIn() {
  $("#messageDiv").removeClass("hidden");
  $("#messageDiv").html(chrome.i18n.getMessage("welcomeMessage"));
  var html = '';
  html += '<button onclick="window.close()">' +
      chrome.i18n.getMessage("cancelButton") + '</button>';
  html += '<button id="connectButton" onclick="requestAuthorization(); window.close();">' +
      chrome.i18n.getMessage("connectButton") + '</button>';
  $("#buttonsDiv").removeClass("hidden");
  $("#buttonsDiv").html(html);
  window.setTimeout(focusConnectButton, 0);
}

function requestAuthorization() {
  console.log("requestAuthorization: Trying to authorize");
  googleAuth.authorize(function() {
    console.log("requestAuthorization: Authorized");
    authorized();
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
  $("#messageDiv").removeClass('hidden');
  $("#messageDiv").html(msg);
}

function getTabId() {
  return tabId;
}

function setSnapshotCheckboxEnabled(enabled) {
  if (enabled) {
    $('#includeSnapshotLabel').removeClass('disabledText');
    $('#snapshotCheckbox').prop('disabled', false);
  } else {
    $('#includeSnapshotLabel').addClass('disabledText');
    $('#snapshotCheckbox').prop('disabled', true);
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
  $('#includeSnapshotLabel').text(
      chrome.i18n.getMessage("includeSnapshotMessageWithSize", [ sizeString ]));
  setSnapshotCheckboxEnabled(true);
}

function updateLoginStatus() {
  if (isLoggedIn()) {
    console.log("updateLoginStatus: Logged in");
    var disconnect = chrome.i18n.getMessage("disconnect");
    $("#welcomeHeaderDiv").addClass("hidden");
    $("#connectedHeaderDiv").removeClass("hidden");
    $("#disconnectDiv").removeClass("hidden");
    $("#disconnectDiv").html(
        '<a href="javascript:void(0)" onclick="logout()">' + disconnect + '</a>');
    updateRealNameDisplay();
    updateEmailDisplay();
  } else {
    console.log("updateLoginStatus: Not logged in");
    $("#connectedHeaderDiv").addClass("hidden");
    $("#welcomeHeaderDiv").removeClass("hidden");
    $("#welcomeHeaderDiv").html(chrome.i18n.getMessage("extensionName"));
    $("#connectedHeaderDiv").addClass("hidden");
  }
}

function updateRealNameDisplay() {
  if (realName) {
    $("#realNameDiv").removeClass("hidden");
    $("#realNameDiv").text(realName);
  } else {
    $("#accountNameDiv").addClass("hidden");
  }
}

function updateEmailDisplay() {
  if (verifiedEmail) {
    $("#accountNameDiv").removeClass("hidden");
    $("#accountNameDiv").text(verifiedEmail);
  } else {
    $("#accountNameDiv").addClass("hidden");
  }
}

function focusConnectButton() {
  $("#connectButton").focus();
}

function isLoggedIn() {
  return googleAuth.getAccessToken();
}

function logout() {
  console.log("logout: Logging out");
  googleAuth.clearAccessToken();
  backgroundPage.storeDevices(new Array());
  backgroundPage.storeLastSelectedId('');
  updateLoginStatus();
  window.close();
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
          '<a href="javascript:void(0);" onClick="openHelpTab(\'NoDevicesFound\'); ' +
          'window.close();">' + chrome.i18n.getMessage("learnMore") + '</a>';
      showMessage(
          chrome.i18n.getMessage("noMobileDevicesFound", [learnMoreHtml]));
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
      html += '<input type="radio" name="device" onClick="updateSelectedDevice(this);" value="' +
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
      snapshotHtml = '<input type="checkbox" name="includeSnapshot" id="snapshotCheckbox" ' +
          'onClick="sendSnapshotCheckboxClicked();" ';
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
      $("#deviceListDiv").removeClass("hidden");
      $("#deviceListDiv").html(html);
    }
    $("#includeSnapshotDiv").removeClass("hidden");
    $("#includeSnapshotDiv").html(snapshotHtml);
    if (!snapshotReceived) {
      setSnapshotCheckboxEnabled(false);
    }
    showButtons();
  }
}

function escapeHTML(str) {
  return $('<div/>').text(str).html();
}

function sendSnapshotCheckboxClicked() {
  sendSnapshotSelected = $("#snapshotCheckbox").attr('checked') == 'checked';
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

function hideButtonsAndDevices() {
  $("#deviceListDiv").addClass("hidden");
  $("#includeSnapshotDiv").addClass("hidden");
  $("#helpDiv").addClass("hidden");
  $("#buttonsDiv").addClass("hidden");
}

function showButtons() {
  var helpHtml = '<a href="javascript:void(0);" onClick="openHelpTab(\'Menu\'); window.close();">' +
      chrome.i18n.getMessage("help") + '</a>';
  var html = '';
  html += '<button onclick="window.close()">' +
      chrome.i18n.getMessage("cancelButton") + '</button>';
  html += '<button id="sendButton" onclick="sendData()">' +
      chrome.i18n.getMessage("sendButton") + '</button>';
  $("#helpDiv").removeClass("hidden");
  $("#helpDiv").html(helpHtml);
  $("#buttonsDiv").removeClass("hidden");
  $("#buttonsDiv").html(html);
  window.setTimeout(focusSendButton, 0);
}

function focusSendButton() {
  $("#sendButton").focus();
}

function openHelpTab(linkId) {
  trackEvent(['Help', 'Opened', linkId]);
  chrome.tabs.create({'url': helpUrl, 'selected': true});
}

function updateSelectedDevice(inputObject) {
  $("label[for='" + retrieveLastSelectedId() + "']").
      removeClass("selectedDevice");
  $("label[for='" + inputObject.id + "']").addClass("selectedDevice");
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
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        onPrinterListReceived(xhr.responseText, xhr);
      } else {
        console.log("retrieveDevices-inner: Did not get status code 200");
        var tryAgainLink = '<a href="javascript:void(0)" onclick="retrieveDevices()">' +
            chrome.i18n.getMessage("tryAgain") + '</a>';
        showMessage(chrome.i18n.getMessage("errorRetrieving", [tryAgainLink]));
      }
    }
  };
  url = cloudPrintBaseUrl + "search";
  console.log("retrieveDevices: Retrieving from: " + url);
  xhr.open('GET', url, true);
  xhr.setRequestHeader('X-CloudPrint-Proxy', 'Chrome_Desktop');
  xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());
  xhr.send(null);
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
  var deviceListChanged = backgroundPage.storeDevices(newDevices);
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
    var queryResult = $("input[name=device]:radio:checked");
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
  chrome.tabs.getSelected(null, function(tab) {
    if (tab.url.match(/^http[s]?:\/\/maps\.google\./) ||
        tab.url.match(/^http[s]?:\/\/www\.google\.[a-z]{2,3}(\.[a-z]{2})\/maps/)) {
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
  backgroundPage.sendDataWithUrl(selectedDeviceId, data.url, data.title, tabId,
      snapshotId,
      sendSnapshot ? URL_WITH_DELAYED_SNAPSHOT_JOB_TYPE : URL_JOB_TYPE,
      googleAuth.getAccessToken());
  if (sendSnapshot) {
    trackEvent(['Sending', 'Type', 'Snapshot']);
    backgroundPage.sendDataWithUrl(selectedDeviceId, data.url, data.title,
        tabId, snapshotId, SNAPSHOT_JOB_TYPE, googleAuth.getAccessToken());
  }
}

function requestEmailAndRealName() {
  console.log("requestEmailAndRealName: Sending request for user profile data");
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
  xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());
  xhr.send();
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
      '<a href="javascript:void(0)" onclick="sendDataWithCurrentlySelectedDeviceId()">' +
      chrome.i18n.getMessage("tryAgain") + '</a>';
  showMessage(chrome.i18n.getMessage("error",
      [deviceNameString, tryAgainLink]));
}

function failedToGenerateSnapshot() {
  trackEvent(['Snapshot', 'Generation', 'Error']);
  sendSnapshotSelected = false;
  $('#includeSnapshotDiv').html('<p class="disabledText">' +
      chrome.i18n.getMessage("errorGeneratingSnapshot") + '</p>');
}
