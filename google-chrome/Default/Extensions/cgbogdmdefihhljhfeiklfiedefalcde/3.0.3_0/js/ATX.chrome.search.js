
var ATX=ATX||{};ATX.search={doSearch:function(searchText,suffix){var urlString=this.formSearchURL(searchText,suffix);chrome.tabs.create({'url':urlString},function(tab){});},formSearchURL:function(searchText,pco_suffix){var urlString="http://api.addthis.com/search";var pco=ATX.constants.CHROME_PCO;if(localStorage["social_services"]==="true"){pco="crx-300";}else{pco='crx-200';}
urlString+="?pco="+pco;if(typeof suffix!=='undefined'){urlString+=","+pco_suffix;}
urlString+="&locale="+navigator.language;urlString+="&q="+encodeURIComponent(searchText);return urlString;}};