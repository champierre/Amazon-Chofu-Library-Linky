// ==UserScript==
// @name          Amazon Chofu Library Linky
// @namespace     http://blog.champierre.com
// @description	  Chofu Library Lookup from Amazon book listings.
// @include       http://*.amazon.*
// ==/UserScript==

// Version 20090617

function libraryLinky(){
  var href　=　document.location.href;
  var matched = href.match(/\/dp\/(\d+)\/ref/);
  var s_index = href.indexOf('amazon.co.jp/s/')
  if (matched && matched[1]) {
    var isbn = matched[1];
    var div = document.getElementById('btAsinTitle').parentNode.parentNode;
    var url = 'http://www.lib.city.chofu.tokyo.jp/cgi-bin/search?ISBN=' + isbn;
    checkLibrary(div, url);
  } else if (s_index != -1){
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
      var div = divs[i];
      if (div.className.indexOf("productTitle") != -1) {
        var link = div.getElementsByTagName('a')[0];
        var matched = link.href.match(/\/dp\/(\d+)\/ref/);
        if (matched && matched[1]) {
          var isbn = matched[1];
          var url = 'http://www.lib.city.chofu.tokyo.jp/cgi-bin/search?ISBN=' + isbn;
          checkLibrary(div, url);
        }
      }
    }
  }
}

function checkLibrary(div, url){
  GM_xmlhttpRequest({
    method:"GET",
    url: url,
    onload:function(response){
      if (response.responseText.match(/TABLE/)){
        addLink(div, url);
      } else {
        addNAMessage(div);
      }
    }
  });
}

function addLink(div, url) {
  var library_link = document.createElement('div');
  library_link.innerHTML = '<span style=\"font-size:90%; background-color:#ffffcc;\"><a href="' + url + '">&raquo; 調布市立図書館で予約</span></span>';
  div.appendChild(library_link); 
}

function addNAMessage(div) {
  var message = document.createElement('div');
  message.innerHTML = '<span style=\"font-size:90%; background-color:#ffffcc;\">調布市立図書館には見つかりません</span>';
  div.appendChild(message);
}

libraryLinky();