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