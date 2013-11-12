
var Util={isAddThis:function(){return window.addthis?(typeof(addthis)!="undefined"):false;},escapeHTMLEncode:function(str){if(str.indexOf("&#8209;")>-1)return str.replace("&#8209;","-");var divNode=document.createElement('div');divNode.innerHTML=str;return divNode.innerHTML;},randomString:function(stringLength){var chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";var randomString='';for(var i=0;i<stringLength;i++){var rnum=Math.floor(Math.random()*chars.length);randomString+=chars.substring(rnum,rnum+1);}
return randomString;}};var ATX=ATX||{};ATX.switch=function(key,val){if(typeof key!=='string'){return false;}
if(typeof ATX.constants==='undefined'){ATX.constants={};}
if(typeof ATX.constants.flags==='undefined'){ATX.constants.flags={};}
if(val){ATX.constants.flags[key]=val;return true;}else if(typeof ATX.constants.flags[key]!=='undefined'){return ATX.constants.flags[key];}
return false;}
ATX.dev=false;if(ATX.dev){ATX.log=function(text){console.log("ATX: "+text);}}else{ATX.log=function(text){return;}}
ATX.test=function(test,message){if(test){return true;}else{if(!message){message='unknown';}
ATX.log("Test failed: "+message);}}
ATX.util=ATX.util||{};ATX.util.day=function(){return Math.round(new Date().getTime()/(1000*60*60*24))*(1000*60*60*24);};ATX.util.png=function()
{if(typeof localStorage['last_png']==='undefined'||localStorage['last_png']!==''+ATX.util.day()){localStorage['last_png']=ATX.util.day();var u='http://o.addthis.com/pt/'+
ATX.constants.PCO+'/auc/'+
ATX.util.generateCuid()+'.gif?_uid='+
ATX.util.getCuid();$.ajax({url:u});}};ATX.util._pngBool=function(v)
{return(v===true)?'1':((v===false)?'0':'x');};ATX.util.getCuid=function(){if(typeof localStorage['cuid']==='undefined'){localStorage['cuid']=ATX.util.generateCuid();}
return localStorage['cuid'];};ATX.util.generateCuid=function(){var d=new Date(),z='00000000';var lo=Math.floor(Math.random()*(4294967295));var hi=Math.floor(d.getTime()/1000.0);lo=lo.toString(16);hi=hi.toString(16);lo=z.substring(0,8-lo.length)+lo;hi=z.substring(0,8-hi.length)+hi;return hi+lo;};if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports.ATX=ATX;}