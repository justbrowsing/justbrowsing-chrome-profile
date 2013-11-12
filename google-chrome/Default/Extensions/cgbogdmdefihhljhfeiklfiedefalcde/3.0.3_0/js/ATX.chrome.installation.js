
function detectNewVersion(){var current_version=null;if(!current_version){var xhr=new XMLHttpRequest();xhr.open("GET",chrome.extension.getURL('manifest.json'),false);xhr.onreadystatechange=function(){if(this.readyState==4){var manifest=JSON.parse(this.responseText);current_version=manifest.version;}};xhr.send();}
var last_used_version=localStorage['addthis_last_used_version'];if(!last_used_version){var url='https://www.addthis.com/pages/extension-welcome-chrome';chrome.tabs.create({url:url});}
localStorage['addthis_last_used_version']=current_version;}
detectNewVersion();