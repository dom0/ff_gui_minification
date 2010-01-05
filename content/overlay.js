/* 
        #################################################################
        #   Firefox GUI Minify                                          #
        #################################################################
        #   Author:     Domenico Martella                               #
        #   E-mail:     domenico.martella@alcacoop.it                   #
        #   Date:       2010-01-04                                      #
        #################################################################
        #                                                               #
        #       Copyright (C) 2010  - Alca Soc. Coop. (Lecce, IT)       #
        #       http://www.alcacoop.it                                  #
        #                                                               #
        # This program is free software; you can redistribute           #
        # it and/or modify it under the terms of the GNU General        #
        # Public License as published by the Free Software              #
        # Foundation; either version 3 of the License, or (at your      #
        # option) any later version.                                    #
        #                                                               #
        # This program is distributed in the hope that it will be       #
        # useful, but WITHOUT ANY WARRANTY; without even the            #
        # implied warranty of MERCHANTABILITY or FITNESS FOR A          #
        # PARTICULAR PURPOSE.  See the GNU General Public License       #
        # for more details.                                             #
        #                                                               #
        # You should have received a copy of the GNU General            #
        # Public License along with this program; if not, write to      #
        # the Free Software Foundation, Inc., 59 Temple Place -         #
        # Suite 330, Boston, MA  02111-1307, USA.                       #
        #################################################################
*/ 

var last_state = 1; //1 = show, -1 = hide
var keypressed = false;

var tryshow = function(){
	if (gBrowser.mTabs.length>1)
		gBrowser.setStripVisibilityTo(true);
	gNavToolbox.setAttribute("collapsed", false);
	//Save state
};
	

var tryhide = function(){
	if (last_state>0) return;
	gBrowser.setStripVisibilityTo(false);
	gNavToolbox.setAttribute("collapsed", true);
	//Save state
};

			
window.addEventListener("load",
	function(event){
		var gmEnabled = Application.prefs.getValue("gui_minify.enabled", true);
	
		window.addEventListener("keydown",function(event){
  			keypressed = false;
			//Alt not alone...
			if (event.altKey) keypressed = true;
		},false);

		window.addEventListener("keyup",
			function(event) {
		
				var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
		
				if (keypressed) return;
		
				if ((event.keyCode == gmKeyCode) && !event.ctrlKey && !event.shiftKey && !event.metaKey){
					if (gNavToolbox.getAttribute("collapsed")=="true") {
						last_state = -last_state;
						tryshow();
					} else {
						last_state = -last_state;
						tryhide();
					}
				}
			}
		, true);
		
	        //OpenURL and TabClose event handlers...	
		var container = gBrowser.tabContainer;
		container.addEventListener("TabOpen", tryshow, false);
		//gNavToolbox.addEventListener("click", function(){alert("pippo")},false);
		gNavToolbox.addEventListener("blur", function(){alert("pippo")},false);
		//container.addEventListener("TabClose", tryhide, false);
	}
, false);
