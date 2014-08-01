var main_dom = chrome.extension.getBackgroundPage();
var proxy_sites = main_dom.proxy_sites;
var props_defs = main_dom.props_defs;

function getOptions() {
  var key, options = {};
  for (key in props_defs) {
    options[key] = (key in localStorage) ? localStorage[key] : props_defs[key];
  }
  return options;
}

// Saves options to localStorage.
function save_options() {
  var el, els, i, j, key;
  for (key in props_defs) {
    switch (key) {
      case 'proxy_site':
      case 'proxy_server':
        el = document.getElementById(key);
        localStorage[key] = el.value;
        break;
      case 'url_encrypt':
        els = document.getElementsByName(key);
        for (i = 0, j = els.length; i < j; i++) {
          if (els[i].checked) {
            localStorage[key] = els[i].value;
            break;
          }
        }
        break;
      default:
        el = document.getElementById(key);
        localStorage[key] = +el.checked;
    }
  }
  document.getElementById('status').style.display = '';
  main_dom.toggleContextMenuItem();
}

// Restores select box state to saved value from localStorage.
function restore_options(defaults) {
  var el,
      key,
      options = defaults ? props_defs : getOptions();
  for (key in options) {
    switch(key) {
      case 'proxy_site':
      case 'proxy_server':
        el = document.getElementById(key);
        el.value = options[key];
        break;
      case 'url_encrypt':
        el = document.getElementById(key + '_' + options[key]);
        el.checked = true;
        break;
      default:
        el = document.getElementById(key);
        el.checked = !!+options[key];
    }
  }
  checkSiteConfig();
}

function checkSiteConfig() {
  var i, j;
  var enable = (document.getElementById('proxy_site').value == 'hidemyass.com');
  var servers_el = document.getElementById('proxy_server');
  var ssl_el = document.getElementById('proxy_ssl');
  servers_el.disabled = !enable;
  ssl_el.disabled = !enable;
}

function fillProxySites() {
  var i, opts = [];
  for (i in proxy_sites) {
    opts.push('<option value="' + i + '">' + proxy_sites[i] + '</option>');
  }
  document.getElementById('proxy_site').innerHTML = opts.join('');
}

function init() {
  fillProxySites();
  restore_options();
  var status_el = document.getElementById('status');
  var inputs = document.getElementsByTagName('input');
  var el, i, j;
  for (i = 0, j = inputs.length; i < j; i++) {
    el = inputs[i];
    if (el.type != 'button') {
      el.addEventListener('change', function () {
        status_el.style.display = 'none';
      }, false);
    }
  }
  if ('omnibox' in chrome) {
    document.getElementById('keyword_hint').style.display = '';
  }
}