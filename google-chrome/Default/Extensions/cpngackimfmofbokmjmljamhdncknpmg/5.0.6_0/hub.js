// Copyright (c) 2009 The Chromium Authors. All rights reserved.  Use of this
// source code is governed by a BSD-style license that can be found in the
// LICENSE file.

document.addEventListener('DOMContentLoaded', function() {
  var href = window.location.href;
  chrome.extension.sendRequest({
      msg: 'url_for_access_token',
      siteId: 'sina',
      url: href
  });
});