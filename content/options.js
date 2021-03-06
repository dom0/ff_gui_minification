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

window.addEventListener("load", function(ev){
  document.getElementById("title").value = "" + "Hide GUI Bars v"+
  Application.extensions.get("gui_minify@alcacoop.it").version;
}, false);

var changeKey = function(ev){

  ev.preventDefault();
  ev.stopPropagation();

  var strbundle = document.getElementById("strings");
  var btnstr1=strbundle.getString("btnstr1");
  var valstr2=strbundle.getString("valstr2");
  var valstr3=strbundle.getString("valstr3");

  switch (KeyUtils.isAllowed(ev)){
    case -3: //NO MODIFIERS
      return;
    case -2: //NO MODIFIERS
      document.getElementById("hgb-all-validate").value=valstr2;
      return;
    case -1: //ONLY ALPHANUMERIC
      document.getElementById("hgb-all-validate").value=valstr3;
      return;
  }

  var sc = KeyUtils.keyev2string(ev);
  Application.prefs.setValue("gui_minify.allshortcut", sc);

  document.getElementById("grab_key").label=btnstr1;
  document.getElementById("hgb-all-validate").value="";
  document.getElementById("txt_keycode").value=sc;
  window.removeEventListener("keyup", changeKey, true);
}


var grabKey = function(){
  var strbundle = document.getElementById("strings");
  var btnstr2=strbundle.getString("btnstr2");
  var valstr1=strbundle.getString("valstr1");


  document.getElementById("txt_keycode").value="";
  document.getElementById("hgb-all-validate").value=valstr1;
  document.getElementById("grab_key").label=btnstr2;
  document.getElementById("grab_key").blur();
  document.getElementById("txt_keycode").focus();
  window.addEventListener("keyup", changeKey, true);
}

