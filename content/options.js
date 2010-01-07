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


var changeKey = function(event){
  for (var i in event){
	  if ((i!="keyCode")&&(i!="which")&&(event[i]==event.keyCode)){ //FOUND!
      var key = i.split("_");
      key = key[key.length-1];
      var comb = Array();
      if (event.metaKey)
      	comb.push("META");
     	Application.prefs.setValue("gui_minify.metakey", event.metaKey);
			
      if (event.ctrlKey)
      	comb.push("CTRL");
      Application.prefs.setValue("gui_minify.ctrlkey", event.ctrlKey);
			
      if (event.altKey)
      	comb.push("ALT");
      Application.prefs.setValue("gui_minify.altkey", event.altKey);
			
			if ((event.keyCode!=17)&&(event.keyCode!=18)&&(event.keyCode!=224))
	      comb.push(key);
			
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
  //document.getElementById("grab_key").blur();
  window.addEventListener("keyup", changeKey,true);
}



var setPrefs = function(){}
