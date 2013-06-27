
document.documentElement.addEventListener("notify",function(){var pubid=document.getElementById("addthis-extension-script").textContent;chrome.extension.sendRequest({message:"pubID",pubId:pubid});},false);var s=document.createElement("script");s.textContent='\
function notifyScript() { \
    var evt = document.createEvent("Event"); \
    evt.initEvent("notify", false, false); \
    if (document.getElementById("addthis-extension-script") == null) {\
        var d=document.createElement("div"); d.setAttribute("style", "display:none"); d.setAttribute("id", "addthis-extension-script"); \
        if (window._ate) \
            d.textContent=_ate.pub(); \
        else if(window.addthis_config && addthis_config.pubid) \
   d.textContent= addthis_config.pubid;\
        else if(window.addthis_config && addthis_config.username) \
   d.textContent= addthis_config.username;\
        else if(window.addthis_pub) \
   d.textContent= addthis_pub;\
        else \
            d.textContent=""; \
        document.body.appendChild(d); \
    }\
    document.documentElement.dispatchEvent(evt); \
}\
notifyScript()';document.head.appendChild(s);