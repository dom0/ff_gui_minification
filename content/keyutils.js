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

var KeyUtils = {

  _doKeymap : function(){
    var keymap = Array();
    for (var i=48;i<=57;i++)
      keymap.push(i);
    for (var i=65;i<=90;i++)
      keymap.push(i);
    return keymap;
  },


  isAllowed : function(ev){
    var keymap = this._doKeymap();
    if ([16,17,18,0,224].indexOf(ev.keyCode)!=-1)
      return -3;
    //ONLY SOME KEYSTROKES ARE ACCEPTED!
    if ((!ev.metaKey)&&(!ev.ctrlKey)&&(!ev.altKey)) //NOT KEYSTROKE
      return -2;
    if (keymap.indexOf(ev.keyCode) == -1) //KEY NOT ALLOWED
      return -1;
    return 1
  },


  keyev2string : function(ev){
    var comb = Array();

    if (ev.ctrlKey)	comb.push("CTRL");
    if (ev.altKey) 	comb.push("ALT");
    if (ev.shiftKey) 	comb.push("SHIFT");
    if (ev.metaKey)	comb.push("META");

    comb.push(String.fromCharCode(ev.keyCode));
    return comb.join("-");
  },


  compareKeyevent : function(ev, str){
    //alert(this.keyev2string(ev) + " - " + str);
    return (this.keyev2string(ev) == str);
  }

}
