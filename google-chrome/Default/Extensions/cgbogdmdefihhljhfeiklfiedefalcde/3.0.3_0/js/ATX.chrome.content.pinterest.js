
var s=document.createElement("script");s.textContent='\
       function AtxPinterestScript() { \
   if (typeof window._ate === "undefined") {\
           var script = document.createElement("script");\
               script.type = "text/javascript";\
               script.src = "https://s7.addthis.com/js/300/addthis_widget.js";\
           script.onload = atx_pinterest;\
               document.getElementsByTagName("head")[0].appendChild(script);\
   }else {\
           window._ate.share.img("pinterest");\
   }\
       }\
       function atx_pinterest() { \
               addthis.addEventListener("addthis.ready", function() {\
                       window._ate.share.img("pinterest");\
               });\
       }\
AtxPinterestScript()';document.head.appendChild(s);