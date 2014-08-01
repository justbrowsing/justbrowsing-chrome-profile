function save_options() {
  var checked = document.getElementById("showads").checked;
  localStorage["sp_ads"] = checked;
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = chrome.i18n.getMessage("ex_saved");
  setTimeout(function() {
    status.innerHTML = "";
  }, 1000);
}

function restore_options() {
  //Texts
  document.getElementById("title").innerHTML = "SearchPreview " + chrome.i18n.getMessage("ex_options")
  document.getElementById("save").innerHTML = chrome.i18n.getMessage("ex_save");
  document.getElementById("options").innerHTML = chrome.i18n.getMessage("ex_options");
  document.getElementById("checklabel").innerHTML = chrome.i18n.getMessage("ex_insert_ads");

  var sads = localStorage["sp_ads"];
  document.getElementById("showads").checked = (sads!="false");
}

restore_options();
document.querySelector('#save').addEventListener('click', save_options);