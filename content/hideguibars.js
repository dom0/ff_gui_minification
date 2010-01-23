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

  last_state : Application.prefs.getValue("gui_minify.laststate",true), //1 = hidden, 0 = visible
  temp_show : false,


  init: function(){
    HGBExtension.tryhide(false);
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
    if (HGBExtension._isNBDisabled()=="false") 
      document.getElementById("nav-bar").setAttribute("collapsed",false);
    //MENUBAR
    document.getElementById("toolbar-menubar").setAttribute("collapsed",false);
    //BOOKMARKS
    if (HGBExtension._isPBDisabled()=="false") 
      document.getElementById("PersonalToolbar").setAttribute("collapsed",false);
    //STATUSBAR
    document.getElementById("status-bar").setAttribute("collapsed",false);
  },

  tryhide : function(ch_state){
    if (
      !Application.prefs.getValue("gui_minify.tabbar", true)&&
      !Application.prefs.getValue("gui_minify.addrbar", true)&&
      !Application.prefs.getValue("gui_minify.menubar", true)&&
      !Application.prefs.getValue("gui_minify.statusbar", true)&&
      !Application.prefs.getValue("gui_minify.bmarksbar", true)
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
    //BOOKMARKS
    if (Application.prefs.getValue("gui_minify.bmarksbar", true))//&&(!HGBExtension._isPBDisabled()=="false"))
      document.getElementById("PersonalToolbar").setAttribute("collapsed",true);

    HGBExtension.temp_show = false;
  },


  toggleBars : function(){
    if ((HGBExtension.last_state==1)||(HGBExtension.temp_show))
      HGBExtension.tryhide();
    else
      HGBExtension.tryshow();
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

  keydownHandler : function(event){
    if (KeyUtils.compareKeyevent(event, Application.prefs.getValue("gui_minify.allshortcut",true)))
      HGBExtension.toggleBars(); 
  },



  _isPBDisabled: function(){
    var _rdf = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Ci.nsIRDFService);
    var _dataSource = _rdf.GetDataSource("rdf:local-store");
    var currentsetResource = _rdf.GetResource("collapsed");
    var toolbar = _rdf.GetResource("chrome://browser/content/browser.xul#PersonalToolbar");
    var target = _dataSource.GetTarget(toolbar, currentsetResource, true);
    if (target instanceof Ci.nsIRDFLiteral)
      return target.Value;
    return "false";
  },


  _isNBDisabled: function(){//TODO: refactoring
    var _rdf = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Ci.nsIRDFService);
    var _dataSource = _rdf.GetDataSource("rdf:local-store");
    var currentsetResource = _rdf.GetResource("collapsed");
    var toolbar = _rdf.GetResource("chrome://browser/content/browser.xul#nav-bar");
    var target = _dataSource.GetTarget(toolbar, currentsetResource, true);
    if (target instanceof Ci.nsIRDFLiteral)
      return target.Value;
    return "false";
  },
}


var PrefsObserver = {
  prefs: null,
  all_shortcut: null,
  sb_color: null,
  sb_bgcolor: null,

  // Initialize the extension
  onLoad: function(){
    // Register to receive notifications of preference changes

    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("gui_minify.");

    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);

    this.all_shortcut = this.prefs.getCharPref("allshortcut");

    this.refreshColors();    
  },


  observe: function(subject, topic, data){

    if (topic != "nsPref:changed"){
      return;
    }

    switch(data){
      case "allshortcut":
        this.all_shortcut = this.prefs.getCharPref("allshortcut");
        //this.refreshKeybinding();
        break;
      case "sbcolor":
        this.a_color = this.prefs.getCharPref("sbcolor");
        this.refreshColors();
        break;
      case "sbbgcolor":
        this.a_bgcolor = this.prefs.getCharPref("sbbgcolor");
        this.refreshColors();
        break;
      case "menubar":
      case "addrbar":
      case "tabbar":
      case "statusbar":
      case "bmarksbar":
        this.refreshHideState();
        break;
    }
  },

  refreshHideState: function(){
    if (HGBExtension.last_state)
    return;
    //SYNC BAR'S VISIBILITY STATE
    HGBExtension.tryshow(false);
    HGBExtension.tryhide(false);
  },

  refreshColors: function(){
    //MODIFICA I COLORI DELLA STATUSBAR-REPLACER
    HGBStatusBar._changeSBColor();
  },

}
