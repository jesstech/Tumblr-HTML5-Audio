var parentWindow = (function(){
   var a;
   try {
      a = unsafeWindow == window ? false : unsafeWindow; // Chrome: window == unsafeWindow
   } catch(e) { }
   return a || (function(){
      var el = document.createElement('p');
      el.setAttribute('onclick', 'return window;');
      return el.onclick();
   }());
}());
function getURLParameter(name, given) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(given)||[,null])[1]
    );
};
function audioHTML(audioFile) {
   return '<audio src="'+audioFile+'" title="'+audioFile.replace(/.+\//g,'')+'" controls preload="none"></audio>';
};

/*
** Let us use tumblr's jQuery object as $
******************************************/
// var $ = parentWindow.jQuery;

if ( typeof(parentWindow.Tumblr.replaceIfFlash) === "function" ) {
   /*
   ** Save window.Tumblr's replaceIfFlash method so we can reuse it
   ******************************************/
   oldReplaceFunc = parentWindow.Tumblr.replaceIfFlash;
   /*
   ** Override window.Tumblr's replaceIfFlash method to have some fun
   ******************************************/
   parentWindow.Tumblr.replaceIfFlash = function (version, element_id, replacement_string) {
      audioFile  = decodeURIComponent( $(replacement_string).find('embed').attr('src') );
      audioFile  = getURLParameter('audio_file', audioFile);
      audioFile += "?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio";
      theNode = "#"+element_id;
      $(theNode).hide().after( audioHTML(audioFile) );
      oldReplaceFunc(version, element_id, replacement_string);
   };
}

/*
** Eval to execute replaceIfFlash for any items we haven't yet
******************************************/
$('[id^=audio_node_]+script, [id^=audio_player_]+script').each(function(){
   eval('parentWindow.'+this.text.replace(/(\r|\n)/g, '').replace(/  +/g, ''));
});