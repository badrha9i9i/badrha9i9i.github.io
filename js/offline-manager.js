(function(w){
 'use strict';
 w.BadrOffline=function(ac,session,view){
  var failed=false;
  function emit(){
   var n=ac?ac.status:-1;
   if(n===1){failed=false;try{session.removeItem('badr_update_reload');}catch(e){}view('ready','OFFLINE READY');}
   else if(n===4)view('update','Update downloaded — reload required');
   else if(n===2||n===3){failed=false;view('busy',n===2?'Verifying offline cache…':'Downloading offline assets…');}
   else {failed=true;view('error',n===5?'Cache obsolete. Reconnect to the original URL.':n===-1?'AppCache unavailable in this browser. CACHE NOT READY.':'CACHE NOT READY. Connect to the internet and retry installation.');}
  }
  if(ac){var names=['checking','downloading','cached','noupdate','updateready','obsolete'];for(var i=0;i<names.length;i++)ac.addEventListener(names[i],emit,false);
   ac.addEventListener('error',function(){if(ac.status===1)emit();else{failed=true;view('error','Cache installation/update failed. CACHE NOT READY. Reconnect and retry.');}},false);
   ac.addEventListener('progress',function(e){if(e&&e.lengthComputable&&e.total>0)view('progress','Downloading '+Math.min(100,Math.floor(e.loaded/e.total*100))+'%',Math.min(100,Math.floor(e.loaded/e.total*100)));else view('busy','Downloading offline assets… (total unknown)');},false);
  }
  return {inspect:emit,ready:function(){return !!ac&&ac.status===1&&!failed;},status:function(){return ac?ac.status:-1;},retry:function(){if(!ac){emit();return;}try{ac.update();emit();}catch(e){emit();}},apply:function(version,before,reload){
   if(!ac||ac.status!==4)return;
   try{
    if(session.getItem('badr_update_reload')===version)throw new Error('Repeated cache update. Automatic reload stopped; close browser and verify hosting.');
    before();ac.swapCache();session.setItem('badr_update_reload',version);reload();
   }catch(e){failed=true;view('error',e.message||'Cache update could not be applied.');}
  }};
 };
}(window));
