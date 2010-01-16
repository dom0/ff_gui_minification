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


var HGBExtension = {

	last_state : 0, //1 = show, 0 = hide
	keypressed : false,
	temp_show : false,
	
  init: function(){
		HGBExtension.toggleBars();
		//document.getElementById("key-hide-all").setAttribute("key","2");
	},


	tryshow : function(ch_state){
		HGBStatusBar._closePopup("hgb-lu");
		HGBStatusBar._closePopup("hgb-pb");

	  if (ch_state == null)
	    HGBExtension.last_state = 1;
	
	  if (ch_state == false){
	    HGBExtension.temp_show = true;
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
	},
	  
	
	tryhide : function(ch_state){
	  if (
	    !Application.prefs.getValue("gui_minify.tabbar", true)&&
	    !Application.prefs.getValue("gui_minify.addrbar", true)&&
	    !Application.prefs.getValue("gui_minify.menubar", true)&&
	    !Application.prefs.getValue("gui_minify.statusbar", true)
	  ) return;
	

	  if ((ch_state==null)||(HGBExtension.temp_show))
	    HGBExtension.last_state = 0;
	
	  /*
	    Gestione del CTRL-L da GUI hidden (v.di overlay.xul)
	    Nota: (in overlay.xul)
	      al CTRL-L è agganciata la tryshow(false) e all'evento enterText la tryhide(false).
	      In questo modo se viene premuto CRTL-L da gui hidden l'interfaccia viene mostrata 
	      solo momentaneamente.
	  */
	  if (HGBExtension.last_state) return;
	
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
	
	  HGBExtension.temp_show = false;
	},


	tabOpenHandler : function(event){
    var extension = HGBExtension;
  	event.data.events.addListener('load', function(event){
			if (event.data.uri.spec!="about:blank")
				return;
			if (extension.last_state==0){ 
				extension.tryshow(false);
				document.getElementById("urlbar").focus();
    	}
  	},false);
	},


  tabCloseHandler : function(event){
		if (HGBExtension.last_state==0) 
			HGBExtension.tryhide(false);
	},

/*
	keyUpHandler : function(event){
	  var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
	  var gmAltKey = Application.prefs.getValue("gui_minify.altkey", true);
	  var gmCtrlKey = Application.prefs.getValue("gui_minify.ctrlkey", true);
	  var gmMetaKey = Application.prefs.getValue("gui_minify.metakey", true);
	
	  if ((!HGBExtension.keypressed)&&(event.keyCode == gmKeyCode) && 
			(event.altKey == gmAltKey) && 
			(event.ctrlKey == gmCtrlKey) && 
			(event.metaKey == gmMetaKey))
		{
	      HGBExtension.toggleBars();
	  }
	},


	keyDownHandler : function(event){
   	HGBExtension.keypressed = false;
   	//Alt not alone...
   	var gmKeyCode = Application.prefs.getValue("gui_minify.keycode", true);
   	if ((event.altKey)&&(gmKeyCode==18))
 			HGBExtension.keypressed = true;
   	if ((event.ctrlKey)&&(gmKeyCode==17))
 			HGBExtension.keypressed = true;
	},
*/
	toggleBars : function(){
	    if ((HGBExtension.last_state==1)||(HGBExtension.temp_show))
	      HGBExtension.tryhide();
	    else
	      HGBExtension.tryshow();
	}

}
