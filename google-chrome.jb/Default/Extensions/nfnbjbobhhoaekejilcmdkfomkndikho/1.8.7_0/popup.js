var googleQrcode="http://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=";
var accordData=   "<div class='accordion-group'><div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion2' data-target='#collapse${ID}'><i class='${iconName}'></i> <span>${Title}</span></a></div><div id='collapse${ID}' class='accordion-body ${in} collapse'><div class='accordion-inner' style='text-align:center;'><img src='http://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=${url}' style='width:300px;' /></div></div></div>";
var accordSelData="<div class='accordion-group'><div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion2' data-target='#collapse${ID}'><i class='${iconName}'></i> <span>${Title}</span></a></div><div id='collapse${ID}' class='accordion-body ${in} collapse'><div class='accordion-inner' style='text-align:center;'><span>${seltext}</span><img src='http://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=${url}' /></div></div></div>";
$(function(){
    $("#accordion2").children().remove();
    
    var back=null;
    try{
        back=chrome.extension.getBackgroundPage();
    } catch(error){
    }
    if (back) {
    
    //===> TAB URL
    chrome.tabs.getSelected(null,function(tab){		
        var temp=$.template(accordData);
        $("#accordion2" ).prepend(temp,{"Title":chrome.i18n.getMessage("popup_URL"),"iconName":"icon-globe","url":escape(tab.url),"ID":"100","in":"in"});
        _gaq.push(['_trackEvent', 'Page action', 'Url', tab.url]);
        for(id in option.generators){
            var gen=option.generators[id];
            if(gen){
                if(gen.SourceID==1 && !gen.isDisabled && gen.regExp.length>0){
                    if(tab.url.indexOf(gen.domainFilter)>-1){
                        var param=new Object();
                        param.Title=gen.Title;
                        param.iconName=gen.iconName;
                        param.ID=gen.ID;
                        var reg=new RegExp(gen.regExp,"m");
                        var match=reg.exec(tab.url);
                        if(gen.repStr.length!=0){
                            repstr=gen.repStr;
                            for(id1 in match){
                                if(match[id1]){
                                    repstr=repstr.replace("$"+id1,match[id1]);
                                }
                            }
                            param.url=escape(repstr);
                        }else{
                            param.url=escape( match[0]);
                        }
                        var temp=$.template(accordData);
                        $("#accordion2" ).prepend(temp,param);						
                    }
                }
            }
        }
        //===> SELECTED TEXT
            var seltext=back.seltext;    
            if(seltext){	
                if(seltext.length>0)
                {
                    var inText="";					
                    var temp=$.template(accordSelData);
                    $("#accordion2").prepend(temp, { "Title": chrome.i18n.getMessage("popup_selectedText"), "iconName": "icon-align-left", "url": escape(seltext), "ID": "200", "seltext": seltext, "in": "" });
                    for(id in option.generators){
                        var gen=option.generators[id];
                        if(gen){
                            if(gen.SourceID==2 && !gen.isDisabled && gen.regExp.length>0){
                                var param=new Object();
                                param.Title=gen.Title;
                                param.iconName=gen.iconName;
                                param.ID=gen.ID;
                                param.in="";
                                var reg=new RegExp(gen.regExp,"g");
                                var match=reg.exec(seltext);
                                if(match){
                                    if(match.length>0){
                                        if(gen.repStr.length!=0){
                                            repstr=gen.repStr;
                                            for(id in match){
                                                if(match[id]){
                                                    repstr=repstr.replace("$"+id,match[id]);
                                                }
                                            }
                                            param.seltext=repstr;
                                            param.url = escape(repstr);
                                        }else{
                                            param.url=escape( match[0]);
                                            param.seltext=match[0];
                                        }						
                                        var temp=$.template(accordSelData);
                                        $("#accordion2" ).prepend(temp,param);
                                    }
                                }
                            }
                        }
                    }				
                }
            }
    });
        
    }else{
    
        chrome.extension.sendRequest({message:"getClickedEl"}, function(back) {
            var sourceID=0;
            if(back.activeName=='a'){			
                sourceID=1;
                var temp=$.template(accordSelData);
                $("#accordion2").prepend(temp, { "Title": chrome.i18n.getMessage("popup_link"), "iconName": "icon-globe", "url": escape(back.activeAttr), "ID": "200", "seltext": back.activeAttr, "in": "in" });
                _gaq.push(['_trackEvent', 'Content', 'Url', back.activeAttr]);
            }else if(back.activeName=='img'){
                sourceID=1;
                var temp=$.template(accordSelData);
                $("#accordion2").prepend(temp, { "Title": chrome.i18n.getMessage("popup_image"), "iconName": "icon-picture", "url": escape(back.activeAttr), "ID": "200", "seltext": back.activeAttr, "in": "in" });
                _gaq.push(['_trackEvent', 'Content', 'Img url', back.activeAttr]);
            }else if(back.activeName=='iframe'){
                sourceID=1;
                var temp=$.template(accordSelData);
                $("#accordion2").prepend(temp, { "Title": "iFrame", "iconName": "icon-share", "url": escape(back.activeAttr), "ID": "200", "seltext": back.activeAttr, "in": "in" });
                _gaq.push(['_trackEvent', 'Content', 'iFrame url', back.activeAttr]);
            }else if(back.activeName=='sel'){
                //sourceID=2;
                seltext=back.activeAttr;
            }
            for(id in option.generators){
                    var gen=option.generators[id];
                    if(gen){
                        if(gen.SourceID==sourceID && !gen.isDisabled){
                            if((back.activeAttr.indexOf(gen.domainFilter)>-1)&&(sourceID==1) && (gen.regExp.length>0)){
                                var param=new Object();
                                param.Title=gen.Title;
                                param.iconName=gen.iconName;
                                param.ID=gen.ID;
                                var reg=new RegExp(gen.regExp,"m");
                                var match=reg.exec(back.activeAttr);
                                if(match){
                                    if(gen.repStr.length!=0){
                                        repstr=gen.repStr;
                                        for(id1 in match){
                                            if(match[id1]){
                                                repstr=repstr.replace("$"+id1,match[id1]);
                                            }
                                        }
                                        param.url=escape(repstr);
                                    }else{
                                        param.url=escape( match[0]);
                                    }
                                    var temp=$.template(accordData);
                                    $("#accordion2" ).prepend(temp,param);
                                }
                            }
                        }
                    }
            }			
            //===> SELECTED TEXT
            var seltext=back.seltext;    
            if(seltext){	
                if(seltext.length>0)
                {
                    var inText="";
                    if(back.activeName=='sel'){
                        inText="in";
                    }
                    var temp=$.template(accordSelData);
                    $("#accordion2").prepend(temp, { "Title": chrome.i18n.getMessage("popup_selectedText"), "iconName": "icon-align-left", "url": escape(seltext), "ID": "200", "seltext": seltext, "in": inText });
                    _gaq.push(['_trackEvent', 'Content', 'Sel text', seltext]);
                    for(id in option.generators){
                        var gen=option.generators[id];
                        if(gen){
                            if(gen.SourceID==2 && !gen.isDisabled && gen.regExp.length>0){
                                var param=new Object();
                                param.Title=gen.Title;
                                param.iconName=gen.iconName;
                                param.ID=gen.ID;
                                param.in="";
                                var reg=new RegExp(gen.regExp,"g");
                                var match=reg.exec(seltext);
                                if(match){
                                    if(match.length>0){
                                        if(gen.repStr.length!=0){
                                            repstr=gen.repStr;
                                            for(id in match){
                                                if(match[id]){
                                                    repstr=repstr.replace("$"+id,match[id]);
                                                }
                                            }
                                            param.seltext=repstr;
                                            param.url = escape(repstr);
                                        }else{
                                            param.url=escape( match[0]);
                                            param.seltext=match[0];
                                        }						
                                        var temp=$.template(accordSelData);
                                        $("#accordion2" ).prepend(temp,param);
                                    }
                                }
                            }
                        }
                    }				
                }
            }
            back.activeName="";
            back.activeAttr="";
        });		
    }	
});
var option;
if(localStorage['data']){
    option=JSON.parse(localStorage['data']);
    if(option.version){
        if(chrome.app.getDetails().version!=option.version){
            if(chrome.app.getDetails().version=="1.6"){
                option=new QrOption();
                option.generators=new Array();
            }
            versionChanged();
        }
    }
}else{
    option=new QrOption();    
    option.generators=new Array();
    versionChanged();
    
    //localStorage['data']=JSON.stringify(option);
}

function versionChanged(){
    option.version=chrome.app.getDetails().version;
    checkAndAdd("iTunes direct download",1,0,"id(\\d*)","http://itunes.apple.com/app/id$1","icon-download","itunes.apple.com",false);
    checkAndAdd("Google Play direct download",1,0,"id=([a-zA-Z0-9.]*)","market://id=$1","icon-download","play.google.com",false);
    checkAndAdd("Windows Phone direct download",1,0,"(([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12})","zune://navigate/?phoneappID=$1","icon-download","windowsphone.com",false);
    checkAndAdd("Youtube",1,0,"embed\/([a-zA-Z0-9]+)","http://www.youtube.com/watch?v=$1","icon-film","youtube.com",false);
    checkAndAdd("Email",2,0,"(\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\\b)","mailto:$1","icon-envelope","",false);
    checkAndAdd("Flickr - Actual Size",1,0,"http://([a-z0-9A-Z]+).staticflickr.com/([a-z0-9/]+)_([a-z0-9/]+)(?:_\\w)?(.[a-z]{3})","http://$1.staticflickr.com/$2_$3$4","icon-picture","staticflickr.com",false);
    checkAndAdd("Flickr - Middle Size",1,0,"http://([a-z0-9A-Z]+).staticflickr.com/([a-z0-9/]+)_([a-z0-9/]+)(?:_\\w)?(.[a-z]{3})","http://$1.staticflickr.com/$2_$3_m$4","icon-picture","staticflickr.com",false);    

    localStorage['data']=JSON.stringify(option);
}

function checkAndAdd(title,sourceID, sourceTagID,regExp,repStr,iconName,domainFilter,isDisabled){
    var found=false;
    for(var i=0;i<option.generators.length;i++){
        if(option.generators[i].title==title){
            option.generators[i].SourceID=sourceID;
            option.generators[i].SourceTagID=sourceTagID;
            option.generators[i].regExp=regExp;
            option.generators[i].repStr=repStr;
            option.generators[i].iconName=iconName;
            option.generators[i].domainFilter=domainFilter;
            option.generators[i].isDisabled=isDisabled;
            found=true;
            break;
        }
    }
    if(found==false){    
        option.generators[option.generators.length]=new QrGen(option.generators.length,guidGenerator(),title,sourceID,sourceTagID,regExp,repStr,iconName,domainFilter,isDisabled);}
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-6790599-24']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function getMaxID(){
    var max=-1;
    for(id in option.generators){
        if(option.generators[id]){
            if(option.generators[id].ID>max){
                max=option.generators[id].ID;
            }
        }else{
            return id;
        }
    }
    return max+1;
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


    function QrGen(_ID,_GuidID,_Title,_SourceID,_SourceTagID,_regExp,_repStr,_iconName,_domainFilter,_isDisabled){
        this.ID=_ID;
        this.GuidID=_GuidID;
        this.Title=_Title;
        this.SourceID=_SourceID;
        this.SourceTagID=_SourceTagID;
        this.domainFilter=_domainFilter;
        this.regExp=_regExp;
        this.repStr=_repStr;
        this.iconName=_iconName;
        this.isDisabled=_isDisabled;
    }


function QrOption(){
    var genCount=0;
    var version;
    var generators=new Array();
    
}
