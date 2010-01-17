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

var primary_win = null;

window.addEventListener("load", function() {
	primary_win = window.opener.opener;
	document.getElementById("grab_key").addEventListener("click", function(ev){grabKey(ev)},false);
},false);



var changeKey = function(event){
	
	//ONLY KEYSTROKES ARE ACCEPTED!
	if (((event.keyCode==16)||(event.keyCode==17)||(event.keyCode==18)||(event.keyCode==224)||(event.keyCode==0))||
		 (!event.metaKey)&&(!event.ctrlKey)&&(!event.altKey))
		return;

  var comb = Array();
	if (event.metaKey)
  	comb.push("META");
  if (event.ctrlKey)
  	comb.push("CTRL");
  if (event.altKey)
  	comb.push("ALT");
	Application.prefs.setValue("gui_minify.modifiers", comb.join(" "));
	
  for (var i in event){
	  if ((i!="keyCode")&&(i!="which")&&(event[i]==event.keyCode)){ //FOUND!
      var key = i.split("_");
			comb.push(key[key.length-1]); 

  		document.getElementById("txt_keycode").value=comb.join("-");
      Application.prefs.setValue("gui_minify.txtkey", comb.join("-"));

      Application.prefs.setValue("gui_minify.keycode", event.keyCode);
			break;
    }
  }

  window.removeEventListener("keyup",changeKey, true);
  document.getElementById("grab_key").label="Select Key";

	event.stopPropagation();
  return false;
}


var grabKey = function(){
  document.getElementById("txt_keycode").value="";
  document.getElementById("grab_key").label="Press a Key..";
  window.addEventListener("keyup", changeKey, true);
}


var changePrefs = function(){
	primary_win.HGBStatusBar._changeSBColor();
	primary_win.getElementById("key-hide-all").setAttribute("keycode",Application.prefs.getValue("gui_minify.keycode", true));
	primary_win.getElementById("key-hide-all").setAttribute("modifiers",Application.prefs.getValue("gui_minify.modifiers", true));
}
