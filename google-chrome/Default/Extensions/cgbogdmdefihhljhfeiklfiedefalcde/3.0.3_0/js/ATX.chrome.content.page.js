
function removeDiv(){var successDiv=document.getElementById("successDiv");successDiv.parentNode.removeChild(successDiv);}
function appendSuccessDiv(){var successDiv=document.createElement("div");successDiv.setAttribute("id","successDiv");successDiv.style.width="200px";successDiv.style.height="75px";successDiv.style.left=(window.innerWidth-250)+"px";successDiv.style.top="6px";successDiv.style.color="black";successDiv.style.position="absolute";successDiv.style.padding="3px";successDiv.style.borderRadius="6px";successDiv.style.boxShadow="1px 1px 1px #ccc";successDiv.style.backgroundImage="-webkit-linear-gradient(#ffffff, #f1f1f1)";successDiv.style.zIndex="1000000";successDiv.innerHTML='Successfully authenticated. You can now start using the quick share feature from the share menu';document.body.appendChild(successDiv);window.setTimeout("removeDiv()",5000);}
appendSuccessDiv();