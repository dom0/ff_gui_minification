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

var tryshow = function(ch_state){
  if (ch_state==null)
    last_state = 1;

  //TABBAR
  if (gBrowser.mTabs.length>1)
    gBrowser.setStripVisibilityTo(true);
  //NAVBAR
  document.getElementById("nav-bar").setAttribute("collapsed",false);
  //MENUBAR
  document.getElementById("toolbar-menubar").setAttribute("collapsed",false);
};
  

var tryhide = function(ch_state){
  if (
    !Application.prefs.getValue("gui_minify.tabbar", true)&&
    !Application.prefs.getValue("gui_minify.addrbar", true)&&
    !Application.prefs.getValue("gui_minify.menubar", true)
  ) return;

  if (ch_state==null)
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
};

      
window.addEventListener("load",
  function(event){
    tryhide(false);

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
          if (last_state==0)
            tryshow();
          else
            tryhide();
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


  }
, false);
