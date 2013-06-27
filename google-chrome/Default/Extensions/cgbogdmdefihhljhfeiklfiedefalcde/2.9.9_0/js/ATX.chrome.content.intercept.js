
var uri=window.location.href;var params={};uri.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function($0,$1,$2,$3){params[$1]=$3;});var parameters={};if((window.location.href.indexOf("https://graph.facebook.com/oauth/access_token")>-1))
{var preCol=document.getElementsByTagName("pre");var textContent=preCol[0].innerHTML.split("=")[1].split("&")[0];parameters.accessToken=textContent;}else if(params.code&&(window.location.href.indexOf("https://www.facebook.com/connect/login_success.html")>-1))
{parameters.code=params.code;}else if(window.location.href.indexOf("http://www.addthis.com/pages/twitter-auth-callback?oauth_token")>-1)
{parameters.oauth_token=params.oauth_token;parameters.oauth_verifier=params.oauth_verifier;}
chrome.extension.sendRequest({message:"setAccessToken",requestParams:parameters});