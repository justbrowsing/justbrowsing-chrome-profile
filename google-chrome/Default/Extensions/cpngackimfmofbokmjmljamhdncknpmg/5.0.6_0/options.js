// Copyright (c) 2009 The Chromium Authors. All rights reserved.  Use of this
// source code is governed by a BSD-style license that can be found in the
// LICENSE file.

var bg = chrome.extension.getBackgroundPage();

function $(id) {
  return document.getElementById(id);
}

function isHighVersion() {
  var version = navigator.userAgent.match(/Chrome\/(\d+)/)[1];
  return version > 9;
}

function init() {
  i18nReplace('optionTitle', 'options');
  i18nReplace('saveAndClose', 'save_and_close');
  i18nReplace('screenshootQualitySetting', 'quality_setting');
  i18nReplace('lossyScreenShot', 'lossy');
  i18nReplace('losslessScreenShot', 'lossless');
  i18nReplace('autosaveSetting', 'save_setting');
  i18nReplace('shorcutSetting', 'shortcut_setting');
  i18nReplace('settingShortcutText', 'shortcutsetting_text');
  i18nReplace('defaultPath', 'save_tip');
  i18nReplace('autosaveText', 'autosave');
  i18nReplace('setSavePath', 'set_save_path');
  i18nReplace('openSavePath', 'open_save_path');
  if (isHighVersion()) {
    $('lossyScreenShot').innerText += ' (JPEG)';
    $('losslessScreenShot').innerText += ' (PNG)';
  }
  $('autosave').checked = eval(localStorage.autoSave);
  $('filePath').value = localStorage.savePath =
      localStorage.savePath ?
          localStorage.savePath : bg.plugin.getDefaultSavePath();
  $('setSavePath').addEventListener('click', function() {
    // Here we use the plugin object in options.html instead of the plugin
    // object in background page, so that the SetSavePath dialog will be a
    // modal dialog.
    var pluginobj = $('pluginobj');
    pluginobj.SetSavePath(localStorage.savePath, function(savePath) {
      $('filePath').value = localStorage.savePath = savePath;
    }, chrome.i18n.getMessage('set_save_path_title'));
  });
  $('openSavePath').addEventListener('click', function() {
    bg.plugin.openSavePath(localStorage.savePath);
  });
  $('saveAndClose').addEventListener('click', saveAndClose);
  initScreenCaptureQuality();
  HotKeySetting.setup();
}

function save() {
  localStorage.screenshootQuality =
      $('lossy').checked ? 'jpeg' : '' ||
      $('lossless').checked ? 'png' : '';
  localStorage.autoSave = $('autosave').checked;

  return HotKeySetting.save();
}

function saveAndClose() {
  if (save())
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.remove(tab.id);
    });
}

function initScreenCaptureQuality() {
  $('lossy').checked = localStorage.screenshootQuality == 'jpeg';
  $('lossless').checked = localStorage.screenshootQuality == 'png';
}

function i18nReplace(id, name) {
  return $(id).innerText = chrome.i18n.getMessage(name);
}

const CURRENT_LOCALE = chrome.i18n.getMessage('@@ui_locale');
if (CURRENT_LOCALE != 'zh_CN') {
  UI.addStyleSheet('./i18n_styles/en_options.css');
}

function isWindowsOrLinuxPlatform() {
  return navigator.userAgent.toLowerCase().indexOf('windows') > -1 ||
      navigator.userAgent.toLowerCase().indexOf('linux') > -1;
}

var HotKeySetting = (function() {
  const CHAR_CODE_OF_AT = 64;
  const CHAR_CODE_OF_A = 65;
  const CHAR_CODE_OF_Z = 90;
  var hotKeySelection = null;
  var isWindowsOrLinux = isWindowsOrLinuxPlatform();

  var hotkey = {
    setup: function() {
      hotKeySelection = document.querySelectorAll('#hot-key-setting select');
      // i18n.
      $('area-capture-text').innerText =
        chrome.i18n.getMessage('capture_area');
      $('viewport-capture-text').innerText =
        chrome.i18n.getMessage('capture_window');
      $('full-page-capture-text').innerText =
        chrome.i18n.getMessage('capture_webpage');
      $('screen-capture-text').innerText =
        chrome.i18n.getMessage('capture_screen');

      for (var i = 0; i < hotKeySelection.length; i++) {
        hotKeySelection[i].add(new Option('--', '@'));
        for (var j = CHAR_CODE_OF_A; j <= CHAR_CODE_OF_Z; j++) {
          var value = String.fromCharCode(j);
          var option = new Option(value, value);
          hotKeySelection[i].add(option);
        }
      }

      $('area-capture-hot-key').selectedIndex =
        HotKey.getCharCode('area') - CHAR_CODE_OF_AT;
      $('viewport-capture-hot-key').selectedIndex =
        HotKey.getCharCode('viewport') - CHAR_CODE_OF_AT;
      $('full-page-capture-hot-key').selectedIndex =
        HotKey.getCharCode('fullpage') - CHAR_CODE_OF_AT;
      $('screen-capture-hot-key').selectedIndex =
        HotKey.getCharCode('screen') - CHAR_CODE_OF_AT;

      $('settingShortcut').addEventListener('click', function() {
        hotkey.setState(this.checked);
      }, false);

      hotkey.setState(HotKey.isEnabled());
      if (isWindowsOrLinux) {
        // Capture screen region is not support on Linux and Mac platform.
        $('screen-capture-hot-key-set-wrapper').style.display =
            'inline-block';
      }
    },

    validate: function() {
      var hotKeyLength =
        Array.prototype.filter.call(hotKeySelection,
            function (element) {
              return element.value != '@'
            }
        ).length;
      if (hotKeyLength != 0) {
        var validateMap = {};
        validateMap[hotKeySelection[0].value] = true;
        validateMap[hotKeySelection[1].value] = true;
        validateMap[hotKeySelection[2].value] = true;
        if (isWindowsOrLinux) {
          validateMap[hotKeySelection[3].value] = true;
        } else {
          if (hotKeySelection[3].value != '@')
            hotKeyLength -= 1;
        }

        if (Object.keys(validateMap).length < hotKeyLength) {
          ErrorInfo.show('hot_key_conflict');
          return false;
        }
      }
      ErrorInfo.hide();
      return true;
    },

    save: function() {
      var result = true;
      if ($('settingShortcut').checked) {
        if (this.validate()) {
          HotKey.enable();
          HotKey.set('area', $('area-capture-hot-key').value);
          HotKey.set('viewport', $('viewport-capture-hot-key').value);
          HotKey.set('fullpage', $('full-page-capture-hot-key').value);

          if (isWindowsOrLinux) {
            var screenCaptureHotKey = $('screen-capture-hot-key').value;
            if (bg.plugin.setHotKey(screenCaptureHotKey.charCodeAt(0))) {
              HotKey.set('screen', screenCaptureHotKey);
            } else {
              var i18nKey = 'failed_to_register_hot_key_for_screen_capture';
              ErrorInfo.show(i18nKey);
              this.focusScreenCapture();
              result = false;
            }
          }
        } else {
          result = false;
        }
      } else {
        HotKey.disable(bg);
      }
      return result;
    },

    setState: function(enabled) {
      $('settingShortcut').checked = enabled;
      UI.setStyle($('hot-key-setting'), 'color', enabled ? '' : '#6d6d6d');
      for (var i = 0; i < hotKeySelection.length; i++) {
        hotKeySelection[i].disabled = !enabled;
      }
      ErrorInfo.hide();
    },

    focusScreenCapture: function() {
      $('screen-capture-hot-key').focus();
    }
  };
  return hotkey;
})();

var ErrorInfo = (function() {
  return {
    show: function(msgKey) {
      var infoWrapper = $('error-info');
      var msg = chrome.i18n.getMessage(msgKey);
      infoWrapper.innerText = msg;
      UI.show(infoWrapper);
    },

    hide: function() {
      var infoWrapper = $('error-info');
      if (infoWrapper) {
        UI.hide(infoWrapper);
      }
    }
  };
})();

document.addEventListener('DOMContentLoaded', init);
