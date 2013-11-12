var googleQrcode="http://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=";
function geturl() {
	var back=chrome.extension.getBackgroundPage();
    var mainurl = back.mainurl;
	var seltext=back.seltext;
    $("#imgQr").attr("src",googleQrcode+ convertUrl(mainurl));
	if(seltext.length)
	{
		$("#divSel").show();		
		$("#spanSel").text(seltext);
		$("#imgQr2").attr("src",googleQrcode+ encodeURI(seltext));
	}else{
		$("#divSel").hide();		
	}
}

function convertUrl(url) {
    if (url.indexOf("windowsphone.com") > -1) {
		$("#qrTitle").text("Windows Market app link");
        var patt1 = /apps\/([a-z0-9-]*)/g;
        return "zune://navigate/?phoneappID=" + patt1.exec(url)[1];
    } else if (url.indexOf("play.google.com") > -1) {
		$("#qrTitle").text("Google Play app link");
        var reg = /id=([a-zA-Z0-9.]*)/g;
        return "market://id=" + reg.exec(url)[1];
    } else if (url.indexOf("itunes.apple.com") > -1) {
		$("#qrTitle").text("iTunes app link");
        var reg2 = /id(\d*)/g;
        return "itms://itunes.apple.com/app/id" + reg2.exec(url)[1];
    }
	$("#qrTitle").text("Site URL");
    return url;
}
window.onload = geturl;