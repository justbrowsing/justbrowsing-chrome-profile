var k=this,l=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},m=function(a){return"string"==typeof a},aa=function(a,b,c){return a.call.apply(a.bind,arguments)},ba=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},n=function(a,b,c){n=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?
aa:ba;return n.apply(null,arguments)},p=function(a,b){function c(){}c.prototype=b.prototype;a.h=b.prototype;a.prototype=new c;a.l=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};Function.prototype.bind=Function.prototype.bind||function(a,b){if(1<arguments.length){var c=Array.prototype.slice.call(arguments,1);c.unshift(this,a);return n.apply(null,c)}return n(this,a)};var q=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,q);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};p(q,Error);var ca=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},r=function(a,b){return a<b?-1:a>b?1:0};var s=function(a,b){b.unshift(a);q.call(this,ca.apply(null,b));b.shift()};p(s,q);var t=function(a,b,c){if(!a){var d="Assertion failed";if(b)var d=d+(": "+b),e=Array.prototype.slice.call(arguments,2);throw new s(""+d,e||[]);}};var u=Array.prototype,v=u.indexOf?function(a,b,c){t(null!=a.length);return u.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(m(a))return m(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},da=u.filter?function(a,b,c){t(null!=a.length);return u.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,h=m(a)?a.split(""):a,g=0;g<d;g++)if(g in h){var C=h[g];b.call(c,C,g,a)&&(e[f++]=C)}return e},w=function(a,b){var c=v(a,
b),d;if(d=0<=c)t(null!=a.length),u.splice.call(a,c,1);return d};var ea=function(a){return da(a,function(a){return!(0<=v("disabled",a))})};var z;t:{var A=k.navigator;if(A){var B=A.userAgent;if(B){z=B;break t}}z=""};var D=-1!=z.indexOf("Opera")||-1!=z.indexOf("OPR"),E=-1!=z.indexOf("Trident")||-1!=z.indexOf("MSIE"),F=-1!=z.indexOf("Gecko")&&-1==z.toLowerCase().indexOf("webkit")&&!(-1!=z.indexOf("Trident")||-1!=z.indexOf("MSIE")),G=-1!=z.toLowerCase().indexOf("webkit"),H=function(){var a=k.document;return a?a.documentMode:void 0},I=function(){var a="",b;if(D&&k.opera)return a=k.opera.version,"function"==l(a)?a():a;F?b=/rv\:([^\);]+)(\)|;)/:E?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:G&&(b=/WebKit\/(\S+)/);b&&(a=(a=
b.exec(z))?a[1]:"");return E&&(b=H(),b>parseFloat(a))?String(b):a}(),J={},K=function(a){var b;if(!(b=J[a])){b=0;for(var c=String(I).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var h=c[f]||"",g=d[f]||"",C=RegExp("(\\d*)(\\D*)","g"),na=RegExp("(\\d*)(\\D*)","g");do{var x=C.exec(h)||["","",""],y=na.exec(g)||["","",""];if(0==x[0].length&&0==y[0].length)break;b=r(0==x[1].length?0:parseInt(x[1],
10),0==y[1].length?0:parseInt(y[1],10))||r(0==x[2].length,0==y[2].length)||r(x[2],y[2])}while(0==b)}b=J[a]=0<=b}return b},L=k.document,M=L&&E?H()||("CSS1Compat"==L.compatMode?parseInt(I,10):5):void 0;!F&&!E||E&&E&&9<=M||F&&K("1.9.1");E&&K("9");var N=function(a){var b=document;return m(a)?b.getElementById(a):a};var O=function(a,b){if("FORM"==a.tagName)for(var c=a.elements,d=0;a=c[d];d++)O(a,b);else!0==b&&a.blur(),a.disabled=b},fa=function(){var a=N("timeout"),b=a.type;if(void 0===b)return null;switch(b.toLowerCase()){case "checkbox":case "radio":return a.checked?a.value:null;case "select-one":return b=a.selectedIndex,0<=b?a.options[b].value:null;case "select-multiple":for(var b=[],c,d=0;c=a.options[d];d++)c.selected&&b.push(c.value);return b.length?b:null;default:return void 0!==a.value?a.value:null}};var P=function(a){P[" "](a);return a};P[" "]=function(){};var Q=!E||E&&9<=M,ga=E&&!K("9");!G||K("528");F&&K("1.9b")||E&&K("8")||D&&K("9.5")||G&&K("528");F&&!K("8")||E&&K("9");var R=function(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.g=!1};R.prototype.preventDefault=function(){this.defaultPrevented=!0};var S=function(a,b){R.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.f=this.state=null;if(a){var c=this.type=a.type;this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(F){var e;t:{try{P(d.nodeName);e=!0;break t}catch(f){}e=!1}e||(d=null)}}else"mouseover"==
c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=G||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=G||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=
a.metaKey;this.state=a.state;this.f=a;a.defaultPrevented&&this.preventDefault()}};p(S,R);S.prototype.preventDefault=function(){S.h.preventDefault.call(this);var a=this.f;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,ga)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var ha="closure_listenable_"+(1E6*Math.random()|0),T=function(a){try{return!(!a||!a[ha])}catch(b){return!1}},ia=0;var ja=function(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.b=!!d;this.d=e;this.key=++ia;this.removed=this.c=!1},U=function(a){a.removed=!0;a.listener=null;a.proxy=null;a.src=null;a.d=null};var V=function(a){this.src=a;this.a={};this.e=0};V.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.a[f];a||(a=this.a[f]=[],this.e++);var h;t:{for(h=0;h<a.length;++h){var g=a[h];if(!g.removed&&g.listener==b&&g.b==!!d&&g.d==e)break t}h=-1}-1<h?(b=a[h],c||(b.c=!1)):(b=new ja(b,this.src,f,!!d,e),b.c=c,a.push(b));return b};var ka=function(a,b){var c=b.type;c in a.a&&w(a.a[c],b)&&(U(b),0==a.a[c].length&&(delete a.a[c],a.e--))};var W="closure_lm_"+(1E6*Math.random()|0),X={},la=0,Y=function(a,b,c,d,e){if("array"==l(b))for(var f=0;f<b.length;f++)Y(a,b[f],c,d,e);else if(c=ma(c),T(a))a.listen(b,c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,h=Z(a);h||(a[W]=h=new V(a));c=h.add(b,c,!1,d,e);c.proxy||(d=oa(),c.proxy=d,d.src=a,d.listener=c,a.addEventListener?a.addEventListener(b.toString(),d,f):a.attachEvent(pa(b.toString()),d),la++)}},oa=function(){var a=qa,b=Q?function(c){return a.call(b.src,b.listener,c)}:function(c){c=
a.call(b.src,b.listener,c);if(!c)return c};return b},pa=function(a){return a in X?X[a]:X[a]="on"+a},sa=function(a,b,c,d){var e=1;if(a=Z(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.b==c&&!f.removed&&(e&=!1!==ra(f,d))}return Boolean(e)},ra=function(a,b){var c=a.listener,d=a.d||a.src;if(a.c&&"number"!=typeof a&&a&&!a.removed){var e=a.src;if(T(e))ka(e.k,a);else{var f=a.type,h=a.proxy;e.removeEventListener?e.removeEventListener(f,h,a.b):e.detachEvent&&e.detachEvent(pa(f),
h);la--;(f=Z(e))?(ka(f,a),0==f.e&&(f.src=null,e[W]=null)):U(a)}}return c.call(d,b)},qa=function(a,b){if(a.removed)return!0;if(!Q){var c;if(!(c=b))t:{c=["window","event"];for(var d=k,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break t}c=d}e=c;c=new S(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){t:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break t}catch(h){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-
1;!c.g&&0<=g;g--)c.currentTarget=e[g],d&=sa(e[g],f,!0,c);for(g=0;!c.g&&g<e.length;g++)c.currentTarget=e[g],d&=sa(e[g],f,!1,c)}return d}return ra(a,new S(b,this))},Z=function(a){a=a[W];return a instanceof V?a:null},ta="__closure_events_fn_"+(1E9*Math.random()>>>0),ma=function(a){t(a,"Listener can not be null.");if("function"==l(a))return a;t(a.handleEvent,"An object listener must have handleEvent method.");return a[ta]||(a[ta]=function(b){return a.handleEvent(b)})};var $=function(){};$.prototype.j=function(){var a="on"==fa();window.localStorage.setItem("timeout",a?"300":"0");ua()};
var ua=function(){window.localStorage.getItem("timeout")||window.localStorage.setItem("timeout","300");window.localStorage.getItem("opened")||window.localStorage.setItem("opened","opened");var a="300"==window.localStorage.getItem("timeout");O(N("timeout"),!1);var b=N("wrapper"),c;c=b.className;c=m(c)&&c.match(/\S+/g)||[];m("disabled")?w(c,"disabled"):"array"==l("disabled")&&(c=ea(c));if(m("enabled")&&!(0<=v(c,"enabled")))c.push("enabled");else if("array"==l("enabled"))for(var d=c,e=0;7>e;e++)0<=v(d,
"enabled"[e])||d.push("enabled"[e]);b.className=c.join(" ");b=N("timeout");c=b.type;if(void 0!==c)switch(c.toLowerCase()){case "checkbox":case "radio":b.checked=a?"checked":null;break;case "select-one":b.selectedIndex=-1;if(m(a))for(d=0;c=b.options[d];d++)if(c.value==a){c.selected=!0;break}break;case "select-multiple":m(a)&&(a=[a]);for(d=0;c=b.options[d];d++)if(c.selected=!1,a)for(var f=0;e=a[f];f++)c.value==e&&(c.selected=!0);break;default:b.value=null!=a?a:""}};
$.prototype.i=function(){N("help-link").href="https://support.google.com/chrome/?p=ui_hotword_search";Y(N("timeout"),"click",n(this.j,this));window.localStorage.getItem("opened")&&(N("intro").style.display="none",N("settings-buttons").style.display="block");ua()};if(chrome&&chrome.runtime){var va=new $;Y(document,"DOMContentLoaded",n(va.i,va))};