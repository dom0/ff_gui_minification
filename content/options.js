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
	  if ((i!="keyCode")&&(i!="which")&&(event[i]==event.keyCode)){
      var key = i.split("_");
      key = key[key.length-1];
      var comb = Array();
      if (event.metaKey)
      	comb.push("META");
      if (event.ctrlKey)
      	comb.push("CTRL");
      if (event.altKey)
      	comb.push("ALT");
      comb.push(key);
			
  		document.getElementById("txt_keycode").value=comb.join("-");
    }
  }
  window.removeEventListener("keyup",changeKey, false);
  document.getElementById("grab_key").label="Select Key";

  event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
}

var grabKey = function(){
  document.getElementById("txt_keycode").value="";
  document.getElementById("grab_key").label="Press a Key..";
  window.addEventListener("keyup", changeKey,false);
}
