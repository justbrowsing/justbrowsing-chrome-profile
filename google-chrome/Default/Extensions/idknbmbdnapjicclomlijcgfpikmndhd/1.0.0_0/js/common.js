// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var URL_JOB_TYPE = "url";
var URL_WITH_DELAYED_SNAPSHOT_JOB_TYPE = "url_with_delayed_snapshot";
var SNAPSHOT_JOB_TYPE = "snapshot";

function isAndroidPrinter(type) {
  return type == 2 || type == 'ANDROID_CHROME_SNAPSHOT';
}

function isIOSPrinter(type) {
  return type == 4 || type == 'IOS_CHROME_SNAPSHOT';
}

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-23999655-3']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

function trackPageview() {
  _gaq.push(['_trackPageview']);
}

function trackEvent(data) {
  _gaq.push(['_trackEvent'].concat(data));
}
