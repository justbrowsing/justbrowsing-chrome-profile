Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
var option=new QrOption();
option.generators=new Array();
tempdata="<li data-id='${ID}'><div class='btn-group row-fluid'><button class='btn span10 ${State}' style='text-align:left;'><i class='${iconName}'></i> ${Title}</button><button class='btn btn-edit' ><i class='icon-pencil'></i>&nbsp;</button><button class='btn btn-delete'><i class='icon-trash'></i>&nbsp;</button></div></li>";
function save(){
	var gen=new QrGen();
	var mustadd=false;
	if($("#genID").val()==-1){
		gen.ID=getMaxID();
		gen.GuidID=guidGenerator();
		option.generators[gen.ID]=gen;
		mustadd=true;
	}else{
		gen=option.generators[$("#genID").val()];
	}
	
	gen.Title=$("#genTitle").val();
	gen.SourceID=$("#cbSource option:selected").val();
	gen.SourceTagID=$("#cbTag option:selected").val();
	gen.regExp=$("#genReg").val();
	gen.repStr=$("#genRep").val();
	gen.iconName=$("#genIcon").val();
	gen.domainFilter=$("#domainFilter").val();
	gen.isDisabled=$("#isDisabled").is(':checked');
	
	
	if(mustadd){
		var temp=$.template(tempdata);
		$("#filterlist" ).prepend(temp,gen);	
		initCommand();
	}
	saveToData();
	clearInputs();
	window.location.reload();
	_gaq.push(['_trackEvent', 'Option', 'Save', seltext]);
	_gaq.push(['_trackEvent', 'Option', option.generators.length.toString(), seltext]);
}

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

function compare(a,b) {
  if (a.Title < b.Title)
     return -1;
  if (a.Title > b.Title)
    return 1;
  return 0;
}

function clearInputs(){
	$("#genID").val(0);
	$("#genTitle").val("");
	$("#cbSource").val(1);
	$("#cbTag").val(1);
	$("#cbTag").hide();
	$("#genReg").val("");
	$("#genRep").val("");
	$("#genIcon").val("");
	$("#domainFilter").val("");
	$("#isDisabled").removeAttr("checked");
}

$(function () {
    loadFromData();

    $("#btnAdd").click(function () {
        save();
        $('#myModal').modal('hide');
    });
    $("#cbSource").change(function () {
        $("#cbTag").parent().hide();
        $("#domainFilter").parent().hide();
        if ($("#cbSource option:selected").val() == 3) {
            $("#cbTag").parent().show();
        } else if ($("#cbSource option:selected").val() == 1) {
            $("#domainFilter").parent().show();
        }

    });
    $(".btnicon").click(function () {
        $("#genIcon").val($(this).text());
        $("#iconPreview").attr("class", $(this).text());
        $("#iconPicker").hide();
    });
    $("#iconThumb").click(function () {
        $("#iconPicker").show();
    });

    initCommand();

    $("#lblVersion").text(chrome.i18n.getMessage("lblEdit_version")+ ": " + chrome.app.getDetails().version);
    $("#lblTitle").text(chrome.i18n.getMessage("app_title"));
    $("#lblPleaseReview").text(chrome.i18n.getMessage("PleaseReview"));
    $("#lblEdit_PleaseReviewGoto").text(chrome.i18n.getMessage("PleaseReviewGoto"));
    $("#lblRules").text(chrome.i18n.getMessage("lblRules"));
    $("#lblAddRule").text(chrome.i18n.getMessage("lblAddRule"));
    $("#iconThumb").text(chrome.i18n.getMessage("lblEdit_iconThumb"));
    $("#lblEdit_Disabled").text(chrome.i18n.getMessage("lblEdit_isDisabled"));
    $("#btnAdd").text(chrome.i18n.getMessage("lblEdit_btnAdd"));
    $("#lblEdit_Close").text(chrome.i18n.getMessage("lblEdit_Close"));
    $("#lblAddOrEditGenerator").text(chrome.i18n.getMessage("lblAddOrEditGenerator"));
    $("#lblEdit_Title").text(chrome.i18n.getMessage("lblEdit_Title"));
    $("#lblEdit_Source").text(chrome.i18n.getMessage("lblEdit_Source"));
    $("#lblEdit_SiteUrl").text(chrome.i18n.getMessage("lblEdit_SiteUrl"));
    $("#lblEdit_SelectedText").text(chrome.i18n.getMessage("lblEdit_SelectedText"));
    $("#lblEdit_Domain").text(chrome.i18n.getMessage("lblEdit_Domain"));
    $("#lblEdit_Tag").text(chrome.i18n.getMessage("lblEdit_Tag"));
    $("#lblEdit_ImageSrc").text(chrome.i18n.getMessage("lblEdit_ImageSrc"));
    $("#lblEdit_RegularExp").text(chrome.i18n.getMessage("lblEdit_RegularExp"));
    $("#lblEdit_ReplaceString").text(chrome.i18n.getMessage("lblEdit_ReplaceString"));
    $("#lblEdit_icon").text(chrome.i18n.getMessage("lblEdit_icon"));
    $("#lblEdit_email").text(chrome.i18n.getMessage("lblEdit_email"));
    $("#lblEdit_Howtouse").text(chrome.i18n.getMessage("lblEdit_Howtouse"));
});
function initCommand(){
	$(".btn-edit").click(function(){
		var id=$(this).parent().parent().attr("data-id");
		var gen=option.generators[id];
		if(gen){
			$("#genID").val(id);
			$("#genTitle").val(gen.Title);
			$("#cbSource").val(gen.SourceID);
			if(gen.SourceID==3)
				$("#cbTag").parent().show();
			if(gen.SourceID==1)
				$("#domainFilter").parent().show();
			$("#domainFilter").val(gen.domainFilter);
			$("#cbTag").val(gen.SourceTagID);
			$("#genReg").val(gen.regExp);
			$("#genRep").val(gen.repStr);
			$("#genIcon").val(gen.iconName);	
			$("#iconPreview").attr("class",gen.iconName);			
			if(gen.isDisabled)
				$("#isDisabled").attr("checked","checked");
			else
				$("#isDisabled").removeAttr("checked");
			$('#myModal').modal('show');
		}
	});
	$(".btn-delete").click(function(){
		var id=$(this).parent().parent().attr("data-id");
		delete option.generators[id];
		$(this).parent().parent().remove();
		saveToData();
	});
}

function saveToData(){
	localStorage['data']=JSON.stringify(option);
}

function loadFromData(){
	if(localStorage['data']){
		option=JSON.parse(localStorage['data']);
		
		for(id in option.generators){
			if(id){
				var gen=option.generators[id];
				
				if(gen){
					if(gen.isDisabled)
						gen.State="disabled";
					else
						gen.State="";
					var temp=$.template(tempdata);
					$("#filterlist" ).prepend(temp,gen);	
				}
			}		
		}
		if(!option.generators)
			option.generators=new Array();
		initCommand();
	}
}




function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function QrOption(){
	var genCount=0;
	var version;
	var generators=new Array();
	
}

function QrGen(){
	var ID;
	var GuidID;
	var Title;
	var SourceID;
	var SourceTagID;
	var domainFilter;
	var regExp;
	var repStr;
	var iconName;
	var isDisabled;
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-6790599-24']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

_gaq.push(['_trackEvent', 'Option', 'Opened', seltext]);