
var Services={serviceMap:function(serviceName,serviceTitle){serviceName=serviceName.toLowerCase();this.oexchangeUrl="https://api.addthis.com/oexchange/0.8/forward/"+serviceName+"/offer";this.name=serviceName;this.icon16Url=Constants.ICON16_PATH+serviceName+Constants.ICON16_EXTENSION;this.icon32Url=Constants.ICON32_PATH+serviceName+Constants.ICON32_EXTENSION;if(serviceTitle)
this.prompt=serviceTitle;else
if(serviceName=="facebook_like")
this.prompt="Facebook Like";else if(serviceName=="google_plusone")
this.prompt="Google +1";else
this.prompt=Constants.SERVICE_PROMPT+serviceName;this.buildShareUrl=Services.buildShareUrlForService;},buildShareUrlForService:function(urlToShare,titleToShare,pub){var shareUrl=this.oexchangeUrl+"?url="+urlToShare;if(titleToShare)
shareUrl+="&title="+titleToShare;if(pub!=""&&pub!=null)
shareUrl+="&pubid="+pub;shareUrl+="&pco="+(!Preferences.isSocialServices()?Constants.CHROME_PCO:Constants.CHROME_PCO_WITH_SOCIAL);return shareUrl;}};var ATX=ATX||{};ATX.preferences={initialize:function(){if(typeof localStorage['new_install']==='undefined'){this.firstRun();}},firstRun:function(){localStorage['new_install']="false";localStorage["context_menu"]="true";localStorage["context_menu_search"]="false";}};var ATX=ATX||{};ATX.services={blacklist:['google_plusone','google_plusone_badge','menu']}