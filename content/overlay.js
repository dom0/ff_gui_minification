var tryshow = function(){
	if (gBrowser.mTabs.length>1)
		gBrowser.setStripVisibilityTo(true);
	gNavToolbox.setAttribute("collapsed", false);
	//Save state
};
	

var tryhide = function(){
	gBrowser.setStripVisibilityTo(false);
	gNavToolbox.setAttribute("collapsed", true);
	//Save state
};

			
window.addEventListener("load",
	function(event){
		var gmEnabled = Application.prefs.getValue("gui_minify.enabled", true);
	
		window.addEventListener("keyup",
			function(event) {
				var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
				//alert(gNavToolbox.getAttribute("collapsed"));
				if ((event.keyCode == gmKeyCode) && !event.ctrlKey && !event.shiftKey && !event.metaKey){
					if (gNavToolbox.getAttribute("collapsed")=="true") {
						tryshow();
					} else {
						tryhide();
					}
				}
			}
		, true);
		
	        //OpenURL and TabClose event handlers...	
		var container = gBrowser.tabContainer;
		container.addEventListener("TabOpen", tryshow, false);
		container.addEventListener("TabClose", tryhide, false);
	}
, false);
