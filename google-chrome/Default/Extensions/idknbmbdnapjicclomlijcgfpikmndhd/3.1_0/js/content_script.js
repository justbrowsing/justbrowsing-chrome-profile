var data = {
  'url': document.location.href,
  'originalUrl': document.location.href,
  'title': document.title
};

// Google Maps URL override
var link = document.getElementById('link');
if (link && link.href) {
  data.url = link.href;
}

chrome.extension.connect().postMessage(data);