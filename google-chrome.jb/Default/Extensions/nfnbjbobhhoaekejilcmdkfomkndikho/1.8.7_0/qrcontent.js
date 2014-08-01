document.addEventListener('mouseup',function(event)
{
	var sel = window.getSelection().toString();
	
	if(sel.length)
		chrome.extension.sendRequest({'message':'setText','data': sel},function(response){})
	else
		chrome.extension.sendRequest({'message':'setText','data': ''},function(response){})
})

var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
	var myTags=["a","img","iframe","A","IMG","IFRAME"];
    if(event.button == 2) {
		
		var obj = event.target;
		if(myTags.indexOf(obj.tagName)==-1){
			var parent1=$(obj).parent().get(0);
			if(parent1){
				if(myTags.indexOf(parent1.tagName)==-1){
					var parent2=$(obj).parent().parent().get(0);
					if(parent2){
						if(myTags.indexOf(parent2.tagName)==-1){							
						}else{
							clickedEl=parent2;
							return;
						}
					}
				}else{
					clickedEl=parent1;
					return;
				}
			}
		}else {
			clickedEl=obj;
			return;
		}
		if(!clickedEl){
			while($(obj).find("iframe").length==0){				
				if($(obj).is('body')) break;
				if($(obj).parent()){
					obj=$(obj).parent();
				}else{
					break;
				}				
			}
			
			if(obj){
				if($(obj).find("iframe").length>0){
						clickedEl=$(obj).find("iframe")[0];
					return;
				}
			}
			
		}
		
		clickedEl=null;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
		if(clickedEl){
		    if ($(clickedEl).is('a')) {		        
		        sendResponse({ typeName: 'a', value: clickedEl.href });		         
			}else if($(clickedEl).is('img')){
				sendResponse({typeName:'img',value:clickedEl.src});
			}else if($(clickedEl).is('iframe')){
				sendResponse({typeName:'iframe',value:clickedEl.src});
			}
		}else if(window.getSelection().toString().length>0){
			sendResponse({typeName:'sel',value:window.getSelection().toString()});
		}
		else{
			alert('no any element selected');
		}
		clickedEl=null;
		
    }else if(request =='showmodal'){
		if($("#qrFrame").get(0)==null){			
			$("body").append("<iframe id='qrFrame' src='"+chrome.extension.getURL('popup.html')+"' style='width:340px;height:340px;'></iframe>");
		}
		$('#qrFrame').modal();
		$(".modalCloseImg").attr('style',"background:url("+chrome.extension.getURL('img/basic/x.png')+");");
		sendResponse();
	}
});


