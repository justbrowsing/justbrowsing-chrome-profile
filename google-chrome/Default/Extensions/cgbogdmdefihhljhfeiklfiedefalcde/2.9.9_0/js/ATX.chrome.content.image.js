
var AddThisExtension=AddThisExtension||{};AddThisExtension.guessImage=function(){var i;var src=false;var doc;if(typeof top!=='undefined'){doc=top.document;}else{doc=document;}
if(typeof doc==='undefined'||!('getElementsByTagName'in doc)){return false;}
var metas=doc.getElementsByTagName('meta');for(i in metas){var meta=metas[i];if(typeof meta.getAttribute==='undefined'){continue;}
var property=meta.getAttribute('property');if(property&&property==='og:image'){src=meta.getAttribute('content');break;}}
if(!src){var imgs=doc.getElementsByTagName('img');for(i in imgs){var img=imgs[i];if(typeof img.getAttribute==='function'){var imageSrc=img.src;if(!!imageSrc&&imageSrc!==''){src=imageSrc;break;}}}}
if(!src){return false;}
return src;};chrome.extension.onRequest.addListener(function(request,sender,sendResponse){sendResponse({'src':AddThisExtension.guessImage(document)});});