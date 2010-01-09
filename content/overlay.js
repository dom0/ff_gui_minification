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

var last_state = 1; //1 = show, 0 = hide
var keypressed = false;
var temp_show = false;
var origOverLink = null;

var tryshow = function(ch_state){
  if (ch_state == null)
    last_state = 1;

  if (ch_state == false){
    temp_show = true;
  };

  //TABBAR
  if (gBrowser.mTabs.length>1)
    gBrowser.setStripVisibilityTo(true);
  //NAVBAR
  document.getElementById("nav-bar").setAttribute("collapsed",false);
  //MENUBAR
  document.getElementById("toolbar-menubar").setAttribute("collapsed",false);
  //STATUSBAR
  document.getElementById("status-bar").setAttribute("collapsed",false);
};
  

var tryhide = function(ch_state){
  if (
    !Application.prefs.getValue("gui_minify.tabbar", true)&&
    !Application.prefs.getValue("gui_minify.addrbar", true)&&
    !Application.prefs.getValue("gui_minify.menubar", true)&&
    !Application.prefs.getValue("gui_minify.statusbar", true)
  ) return;

  if ((ch_state==null)||(temp_show))
    last_state = 0;

  /*
    Gestione del CTRL-L da GUI hidden (v.di overlay.xul)
    Nota: (in overlay.xul)
      al CTRL-L è agganciata la tryshow(false) e all'evento enterText la tryhide(false).
      In questo modo se viene premuto CRTL-L da gui hidden l'interfaccia viene mostrata 
      solo momentaneamente.
  */
  if (last_state) return;


  //TABBAR
  if (Application.prefs.getValue("gui_minify.tabbar", true))
    gBrowser.setStripVisibilityTo(false);
  //NAVBAR
  if (Application.prefs.getValue("gui_minify.addrbar", true))
    document.getElementById("nav-bar").setAttribute("collapsed",true);
  //MENUBAR
  if (Application.prefs.getValue("gui_minify.menubar", true))
    document.getElementById("toolbar-menubar").setAttribute("collapsed",true);
  //STATUSBAR
  if (Application.prefs.getValue("gui_minify.statusbar", true))
    document.getElementById("status-bar").setAttribute("collapsed",true);

  temp_show = false;

};

      
window.addEventListener("load",
  function(event){
    tryhide(false);

    window.addEventListener("keydown",function(event){
      keypressed = false;

      //Alt not alone...
      var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
      if ((event.altKey)&&(gmKeyCode==18))
				keypressed = true;
      if ((event.ctrlKey)&&(gmKeyCode==17))
				keypressed = true;
    },false);


    window.addEventListener("keyup",
      function(event) {
        var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
        var gmAltKey = Application.prefs.getValue("gui_minify.altkey", true);
        var gmCtrlKey = Application.prefs.getValue("gui_minify.ctrlkey", true);
        var gmMetaKey = Application.prefs.getValue("gui_minify.metakey", true);
			
				//if (keypressed) return;

        if ((!keypressed)&&(event.keyCode == gmKeyCode) && 
					(event.altKey == gmAltKey) && 
					(event.ctrlKey == gmCtrlKey) && 
					(event.metaKey == gmMetaKey))
				{
          if ((last_state==1)||(temp_show))
            tryhide();
          else
            tryshow();
        }
      }
    , true);
    
    //OpenURL event handler...  
    var container = gBrowser.tabContainer;
    
    //Apertura di un Tab
    Application.activeWindow.events.addListener("TabOpen", function(event){
      event.data.events.addListener('load', function(event){
				if (event.data.uri.spec!="about:blank")
					return;

				if (last_state==0){ 
	  			tryshow(false);
					document.getElementById("urlbar").focus();
        }
      }, false);
    }, false);
    
		//Chiusura di chiusura di un tab
    container.addEventListener("TabClose", function(){ if (last_state==0) tryhide(false); }, false);

    //CUSTOM PROGRESS BAR
	  gBrowser.addProgressListener(myListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);

	  //CUSTOM LINK URL
		origOverLink = XULBrowserWindow.setOverLink;
		XULBrowserWindow.setOverLink = function (link, b){
			document.getElementById("mylinkurl").value = link;
      if ((link == "")||(!link)||(link == undefined))
				_closePopup();
			else
	      _openPopup();
			origOverLink.call(this, link, b);
		}
  }
, false);




const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
var myListener = {
  QueryInterface: function(aIID) {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
   	// If you use myListener for more than one tab/window, use
   	// aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
  	if(aFlag & STATE_START) {
			document.getElementById("myprogressbar").collapsed=false;
    	document.getElementById("myprogressbar").value = 0;
    	_openPopup();
  	}
  	if(aFlag & STATE_STOP) {
			document.getElementById("myprogressbar").collapsed=true;
    	_closePopup();
  	}
	},

  onLocationChange: function(aProgress, aRequest, aURI) {
   // This fires when the location bar changes; i.e load event is confirmed
   // or when the user switches tabs. If you use myListener for more than one tab/window,
   // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
  },

  // For definitions of the remaining functions see related documentation
  onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) { 
    document.getElementById("myprogressbar").value = (curTot/maxTot*100);
  },

  onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) { },
  onSecurityChange: function(aWebProgress, aRequest, aState) { }
}

  var _openPopup = function(){
	  var popup = document.getElementById("alca-hidegb-msg-panel");
	  var anchor = document.getElementById("content").selectedBrowser;
	  popup.openPopup(anchor, "overlap", 5, anchor.clientHeight -30 , false, false);
	}
  
	var _closePopup = function(){
	  var popup = document.getElementById("alca-hidegb-msg-panel");
		popup.hidePopup();
	}
