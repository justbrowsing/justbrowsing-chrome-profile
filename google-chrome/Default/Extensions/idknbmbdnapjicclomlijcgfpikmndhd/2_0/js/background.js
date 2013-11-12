// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var defaultCloudPrintBaseUrl = "https://www.google.com/cloudprint/";

// Called when the url of a tab changes.
function checkForValidUrl(tabIdParam, changeInfo, tab) {
   // For now everything will do.
   chrome.pageAction.show(tabIdParam);
};

var devices = new Array();

// A map from a tab to the snapshot that was generated for that page.
var tabIdToSnapshot = new Object();

var cloudPrintBaseUrl;

// This flag is used so we do not always track a pageview when the background
// page is opened, but instead only track it just before the first event is
// tracked.
var isPageviewTracked = false;

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.tabs.onRemoved.addListener(function(tab) {
  // When a tab goes away, we can release the snapshot.
  removeSnapshotForTab(tab.id);
});

function removeSnapshotForTab(tabId) {
  console.log("removeSnapshotForTab: removing snapshot for tab " + tabId);
  delete tabIdToSnapshot[tabId];
}

// Stores the list of device to the local storage.
// Returns true if the list has changed from the previously stored one.
function storeDevices(deviceList) {
  var jsonList = JSON.stringify(deviceList);
  if (jsonList == window.localStorage['devices']) {
    return false;
  }
  devices = deviceList;
  window.localStorage['devices'] = jsonList;
  return true;
}

function retrieveDevices() {
  var deviceListString = window.localStorage['devices'];
  if (deviceListString) {
    try {
      devices = JSON.parse(deviceListString);
      return devices;
    } catch (e) {
      console.log("retrieveDevices: Failed to parse JSON string: " + deviceListString);
      // Clearing stored data since it is wrong
      storeDevices(new Array());
    }
  }
}

function storeLastSelectedId(deviceId) {
  window.localStorage['lastSelected'] = deviceId;
}

function retrieveLastSelectedId() {
  return window.localStorage['lastSelected'];
}

function retrieveServerUrl() {
  storedServerUrl = window.localStorage['cloudPrintBaseUrl'];
  cloudPrintBaseUrl = storedServerUrl ?
      storedServerUrl : defaultCloudPrintBaseUrl;
  return cloudPrintBaseUrl;
}

function getPopupView() {
  var views = chrome.extension.getViews({'type': 'popup'});
  if (views == null || views.length != 1)
    return null;
  return views[0];
}

function generateSnapshot(tabId) {
  var popupView = getPopupView();
  if (popupView == null) {
    console.log('generateSnapshot: failed to retrieve the popup window from ' +
        'the background page while generating snapshot.');
    return;
  }
  if (tabIdToSnapshot[tabId] != null) {
    console.log('generateSnapshot: snapshot already available.');
    if (!popupView.closed) {
      popupView.snapshotGenerated(tabIdToSnapshot[tabId].size);
    }
    return;
  }

  chrome.pageCapture.saveAsMHTML({ "tabId": tabId } , function(mhtmlData) {
    if (chrome.extension.lastError) {
      console.log("generateSnapshot: failed to generate snapshot: " +
          chrome.extension.lastError);
      if (!popupView.closed) {
        popupView.failedToGenerateSnapshot();
      }
      return;
    }
    if (popupView.closed) {
      console.log("generateSnapshot: popup was closed while snapshot was " +
          "generated.");
      return;
    }
    tabIdToSnapshot[tabId] = mhtmlData;
    popupView.snapshotGenerated(mhtmlData.size);
  });
}

function getPrinterType(printerId) {
  for (key in devices) {
    if (devices[key]['id'] == printerId) {
      return devices[key]['type'];
    }
  }
  console.log('getPrinterType: Unknown type for device with printerid ' + printerId);
}

function createJSONData(printerType, url, snapID, type) {
  var jsonObject = {};
  if (isAndroidPrinter(printerType)) {
    if (type == URL_JOB_TYPE) {
      jsonObject = {
        "url": url,
        "type": type
      };
    } else {
      jsonObject = {
        "url": url,
        "snapID": snapID,
        "type": type
      };
    }
  } else if (isIOSPrinter(printerType)) {
    // TODO(chenyu): Currently only an alert is sent; url will also be sent
    // if it fits in.
    jsonObject = {
      "aps" : {
        "alert" : {
          "body" : "A print job is available",
          "loc-key" : "IDS_CHROME_TO_DEVICE_SNAPSHOTS_IOS"
        }
      }
    };
  }
  return JSON.stringify(jsonObject);
}

function sendDataWithUrl(printerId, url, title, tabId, snapId, jobType,
                         accessToken) {
  console.log("sendDataWithUrl: Trying to send data for: " + url);
  var formData = new FormData();
  var printerType = getPrinterType(printerId);
  console.log("sendDataWithUrl: Found printerType: " + printerType);
  formData.append("printerid", printerId)
  if (isAndroidPrinter(printerType)) {
    var jsonData = createJSONData(printerType, url, snapId, jobType);
    console.log("sendDataWithUrl: Using JSON data: " + jsonData);
    formData.append("tag", '__c2dm__job_data=' + jsonData);
  } else if (isIOSPrinter(printerType)) {
    formData.append("tag", '__snapshot_id=' + snapId);
    formData.append("tag", '__snapshot_type =' + jobType);
    if (jobType != SNAPSHOT_JOB_TYPE) {
      // Print job that contains url but no snapshot offline data; cloud print
      // server should be told to send notification with payload in |jsonData|.
      // The url that generated this snaphot is included in the job data in case
      // the url is too long to fit in the notification.
      var jsonData = createJSONData(printerType, url, snapId, jobType);
      console.log("sendDataWithUrl: Using JSON data: " + jsonData);
      formData.append("tag", '__apns__payload=' + jsonData);
      formData.append("tag", '__apns__original_url=' + url);
    } else {
      // Print job that contains snapshot offline data; cloud print server
      // should be told not to send notification to device for this job.
      formData.append("tag", '__apns__suppress_notification');
    }
  }
  formData.append("capabilities", '{capabilities=[]}');
  formData.append("title", title);

  if (jobType == SNAPSHOT_JOB_TYPE) {
    var snapshotData = tabIdToSnapshot[tabId];
    if (snapshotData == null) {
      console.log("sendDataWithUrl: failed to send snapshot, no snapshot for tab: " + tabId);
      return;
    }
    formData.append("contentType", 'multipart/related');
    formData.append("content", snapshotData);
  } else {
    formData.append("contentType", 'text/plain');
    // We need dummy content or the job will fail, not sure why.
    formData.append("content", 'dummy');
  }

  var popupView = getPopupView();
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (!isPageviewTracked) {
        trackPageview();
        isPageviewTracked = true;
      }
      if (xhr.status == 200) {
        trackEvent(['Sending', 'Status', 'Success'])
        handlePrintJobPosted(xhr, jobType, popupView);
      } else {
        console.log("sendDataWithUrl-inner: Did not get status code 200");
        trackEvent(['Sending', 'Status', 'Error'])
        if (!popupView.closed) {
          popupView.showSubmitErrorMessage();
        }
      }
    }
  };

  url = cloudPrintBaseUrl + "submit";
  console.log("sendDataWithUrl: Submitting to: " + url);
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-CloudPrint-Proxy', 'Chrome_Desktop');
  xhr.setRequestHeader('Authorization', 'OAuth ' + accessToken);
  xhr.send(formData);
}

function handlePrintJobPosted(xhr, jobType, popupView) {
  var data = JSON.parse(xhr.responseText);
  if (popupView == null) {
    console.log('handlePrintJobPosted: print job sent but failed to retrieve the popup window ' +
        'to display status.');
    return;
  }

  if (data['success']) {
    console.log("handlePrintJobPosted: success");
    if (jobType == SNAPSHOT_JOB_TYPE || jobType == URL_JOB_TYPE) {
      if (!popupView.closed) {
        popupView.showMessage(chrome.i18n.getMessage("sent"));
        popupView.setTimeout(window.close, 2500);
      }
      // We don't need to hold-on to the snapshot anymore.
      removeSnapshotForTab(popupView.getTabId());
    }
  } else {
    console.log("handlePrintJobPosted: error: " + data['message']);
    if (!popupView.closed) {
      popupView.showSubmitErrorMessage();
    }
    // Don't remove the snapshot, the user might try to send again (with the retry link).
  }
}
