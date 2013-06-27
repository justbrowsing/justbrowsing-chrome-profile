
function getButtonFunction() {

    var sideBar = document.getElementById("side");
    var searchField = document.getElementById("search_form_input");

    // Return undefined if there is no search field or side bar
    if (undefined == searchField || undefined == sideBar) {
        return undefined;
    }

    var searchQuery = encodeURI(searchField.value);

    return function(link, message) {
        var label = chrome.i18n.getMessage(message);
        var searchURL = link + searchQuery;

        var text = document.createTextNode(label);

        // Create link
        var link = document.createElement("a");
        link.className = "button-link";
        link.setAttribute("href", searchURL); 
        link.appendChild(text);

        // Create div
        var element = document.createElement("div");
        element.className = "button fallback_button";
        element.appendChild(link);

        // Prepend div before default DuckDuckGo buttons
        sideBar.insertBefore(element, sideBar.childNodes[0]);

    }
}

var addButton = getButtonFunction();

if(undefined != addButton) {
    addButton('https://encrypted.google.com/search?q=', 'google');
}

