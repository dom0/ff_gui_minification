// Loads a URL in the browser window
function fncLoadInBrowser(url)
{

	var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	
	var currentWindow = windowMediator.getMostRecentWindow("navigator:browser") || windowMediator.getMostRecentWindow("emusic:window");
	
	if (currentWindow) {
		try {
			currentWindow.delayedOpenTab(url);
		}
		catch(e) {
			currentWindow.loadURI(url);
		}
	}
	else {
		var protocolService = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
																		.getService(Components.interfaces.nsIExternalProtocolService);
		var uri = Components.classes["@mozilla.org/network/io-service;1"]
												.getService(Components.interfaces.nsIIOService)
												.newURI(url, null, null);
		protocolService.loadURI(uri, null);
	}

}