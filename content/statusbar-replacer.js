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
  
	last_timeout_id : null,

  init: function() {
		//CUSTOM PROGRESS BAR
		gBrowser.addProgressListener(this.listener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
	
		//CUSTOM LINK URL
		HGBStatusBar.origOverLink = XULBrowserWindow.setOverLink;

		XULBrowserWindow.setOverLink = function (link, b){
      if ((!Application.prefs.getValue("gui_minify.statusbar", false))||
          (!Application.prefs.getValue("gui_minify.sblink", false))||
					(HGBExtension.last_state)||
					(HGBExtension.temp_show)){
				HGBStatusBar.origOverLink.call(this, link, b);
				return;
			}
			var str = link;
			if (link.length > 120 ){
				str = link.substring(0,120);
				str += "...";
			}
		  if ((link == "")||(!link)||(link == undefined)){
        HGBStatusBar.last_timeout_id = setTimeout('HGBStatusBar._closePopup("hgb-lu")', 500);
			} else {
				document.getElementById("hgb-linkurl").value = str;
	      clearTimeout(HGBStatusBar.last_timeout_id);
	    	HGBStatusBar._openPopup("hgb-lu");
			}
			HGBStatusBar.origOverLink.call(this, link, b);
		};
  },


  _openPopup : function(what){
	  var anchor = document.getElementById("content").selectedBrowser;
		var x = 1;
		var y = anchor.clientHeight - 46;
    if (what=="hgb-pb"){
			var x = anchor.clientWidth - 169;
			var y = anchor.clientHeight - 50;
		}
			
	  var popup = document.getElementById(what);
	  popup.openPopup(anchor, "overlap", x, y, false, false);
	},
  
	_closePopup : function(what){
	  var popup = document.getElementById(what);
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
      if ((!Application.prefs.getValue("gui_minify.statusbar", false))||
          (!Application.prefs.getValue("gui_minify.sbprogressbar", false))||
					(HGBExtension.last_state)||
					(HGBExtension.temp_show))
				return;
  		if(aFlag & HGBStatusBar.STATE_START) {
  	  	document.getElementById("hgb-progressbar").value = 0;
    		HGBStatusBar._openPopup("hgb-pb");
  		}
  		if(aFlag & HGBStatusBar.STATE_STOP) {
    		HGBStatusBar._closePopup("hgb-pb");
  		}
		},


  	onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) { 
      if ((!Application.prefs.getValue("gui_minify.statusbar", false))||
          (!Application.prefs.getValue("gui_minify.sbprogressbar", false))||
					(HGBExtension.last_state)||
					(HGBExtension.temp_show))
				return;
    	document.getElementById("hgb-progressbar").value = (curTot/maxTot*100);
  	},

  	onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {},
  	onSecurityChange: function(aWebProgress, aRequest, aState) {},
  	onLocationChange: function(aProgress, aRequest, aURI) {},
	}
}
