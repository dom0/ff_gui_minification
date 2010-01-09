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


var HGBStatusBar = {

  origOverLink : null,
  STATE_START : Components.interfaces.nsIWebProgressListener.STATE_START,
  STATE_STOP : Components.interfaces.nsIWebProgressListener.STATE_STOP,
  
  

  init: function() {
		//CUSTOM PROGRESS BAR
		gBrowser.addProgressListener(this.listener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
	
		//CUSTOM LINK URL
		HGBStatusBar.origOverLink = XULBrowserWindow.setOverLink;

		XULBrowserWindow.setOverLink = function (link, b){
      if (Application.prefs.getValue("gui_minify.statusbar", true)){
				document.getElementById("hgb-linkurl").value = link;
		  	if ((link == "")||(!link)||(link == undefined))
					HGBStatusBar._closePopup();
				else
	    		HGBStatusBar._openPopup();
			}
			HGBStatusBar.origOverLink.call(this, link, b);
		};
  },


  _openPopup : function(){
	  var popup = document.getElementById("hgb-panel");
	  var anchor = document.getElementById("content").selectedBrowser;
	  popup.openPopup(anchor, "overlap", 5, anchor.clientHeight -30 , false, false);
	},
  
	_closePopup : function(){
	  var popup = document.getElementById("hgb-panel");
		popup.hidePopup();
	},


  listener : {

  	QueryInterface: function(aIID) {
   		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
      		aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
      		aIID.equals(Components.interfaces.nsISupports))
      	return this;
   		throw Components.results.NS_NOINTERFACE;
  	},

  	onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
      if (!Application.prefs.getValue("gui_minify.statusbar", true)) return;
  		if(aFlag & HGBStatusBar.STATE_START) {
				document.getElementById("hgb-progressbar").collapsed=false;
  	  	document.getElementById("hgb-progressbar").value = 0;
    		HGBStatusBar._openPopup();
  		}
  		if(aFlag & HGBStatusBar.STATE_STOP) {
				document.getElementById("hgb-progressbar").collapsed=true;
    		HGBStatusBar._closePopup();
  		}
		},


  	onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) { 
      if (!Application.prefs.getValue("gui_minify.statusbar", true)) return;
    	document.getElementById("hgb-progressbar").value = (curTot/maxTot*100);
  	},

  	onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {},
  	onSecurityChange: function(aWebProgress, aRequest, aState) {},
  	onLocationChange: function(aProgress, aRequest, aURI) {},
	}
}
