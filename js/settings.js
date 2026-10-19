(function(w,d){
 'use strict';var storage,session,offline;
 function el(id){return d.getElementById(id);}function say(t){el('message').textContent=t;}
 try{storage=w.localStorage;session=w.sessionStorage;}catch(e){say('Local storage unavailable.');return;}
 function refresh(){
  var a=BadrActivation.read(storage),det=BadrDetect(navigator.userAgent),rows=[['Detected firmware',det.detectedFirmware||'Unknown'],['Confirmed firmware',a?a.firmware:'None'],['Selected host',a?a.host:'None'],['Activation',a?'Complete':'Not activated'],['Cache status',w.applicationCache?String(w.applicationCache.status)+' (0 missing, 1 ready, 2 checking, 3 downloading, 4 update, 5 obsolete)':'AppCache unavailable'],['Current build',BadrVersion],['Saved cache version',a?a.cacheVersion:'None'],['Debug mode',storage.getItem('badr_debug')==='true'?'On':'Off']];
  el('details').textContent='';for(var i=0;i<rows.length;i++){var tr=d.createElement('tr');for(var j=0;j<2;j++){var td=d.createElement(j?'td':'th');td.textContent=rows[i][j];tr.appendChild(td);}el('details').appendChild(tr);}
 }
 function permitted(){if(!BadrActivation.pin(el('owner-pin').value)||!el('owner-confirm').checked){say('Enter the correct shop code and tick confirmation.');return false;}return true;}
 function reset(go){if(!permitted())return;try{BadrActivation.reset(storage);session.removeItem('badr_pending_setup');session.removeItem('badr_update_reload');session.removeItem('badr_reverify_requested');refresh();say('Activation reset. Cache retained. PIN and firmware confirmation required next time.');if(go)location.replace('index.html');}catch(e){say(e.message);}}
 el('change').onclick=function(){if(!permitted())return;try{session.setItem('badr_reverify_requested','true');session.removeItem('badr_pending_setup');location.replace('index.html');}catch(e){say(e.message);}};el('reset').onclick=function(){reset(false);};
 el('debug').onclick=function(){if(!permitted())return;try{storage.setItem('badr_debug',storage.getItem('badr_debug')==='true'?'false':'true');refresh();say('Debug preference saved. It never bypasses firmware or cache checks.');}catch(e){say(e.message);}};
 offline=BadrOffline(w.applicationCache,session,function(kind,t){say(t);refresh();if(kind==='update')offline.apply(BadrVersion,function(){},function(){location.reload();});});
 el('reinstall').onclick=function(){if(!permitted())return;offline.retry();say('Requested cache update/verification. AppCache has no selective delete/reinstall API. For a damaged cache, clear website data in PS4 browser settings, reconnect, and activate again.');};
 el('owner-form').onsubmit=function(e){e.preventDefault();};refresh();
}(window,document));
