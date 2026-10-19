(function(w,d){
 'use strict';var scripts=d.getElementsByTagName('script'),tag=scripts[scripts.length-1],host=tag.getAttribute('data-host'),engine=tag.getAttribute('data-engine'),started=false,safetyBlocked=false,storage,session,offline;
 function el(id){return d.getElementById(id);}function home(){started=true;location.replace('../index.html');}
 function stop(text){el('result').textContent='Stopped';el('notice').textContent=text;el('retry').className='';el('retry').textContent='RETURN TO SETUP';el('retry').onclick=home;}
 try{storage=w.localStorage;session=w.sessionStorage;}catch(e){stop('Local storage unavailable.');return;}
 function start(){
  if(started)return;
  var a=BadrActivation.read(storage),det=BadrDetect(navigator.userAgent);
  if(!a){stop('Activation required. Open the main bookmark.');return;}
  var verification=BadrSafety.verify(a,navigator.userAgent);
  if(!verification.ok){safetyBlocked=true;stop(verification.message+' Auto launch stopped; previous activation retained.');el('retry').textContent='RE-VERIFY FIRMWARE';return;}
  var check=BadrRouter.check(a.firmware,det);
  if(a.host!==host){stop('Saved host does not match this page.');return;}
  var r=check.item;el('fw').textContent=a.firmware;el('payload').textContent=r.payloadType+' / '+r.payloadFile;
  if(offline.status()===4){home();return;}
  if(!offline.ready())return;
  if(a.cacheVersion!==BadrVersion){home();return;}
  if(engine==='entry'){started=true;location.replace(host==='flash'?'run_'+r.chain+'.html':'jb.html?retry=0');return;}
  if(engine!==r.chain){stop('Engine does not match the confirmed firmware.');return;}
  if(location.search && !(host==='flash2'&&location.search==='?retry=0')){stop('Unexpected engine parameters. Use the main bookmark.');return;}
  started=true;BadrNav.stop();el('result').textContent='Running original exploit';el('notice').textContent='Only original engine events can report completion.';el('retry').className='hidden';
  if(storage.getItem('badr_debug')!=='true')el('out').className='hidden';
  function status(){
   var text=el('state').textContent,msg=el('msg').textContent;
   if(text==='ALL DONE'||(host==='flash2'&&d.body.className==='done'&&msg==='DONE')){el('result').textContent='Completed — engine reports payload started';el('notice').textContent='Verify the payload on the console. This is not an independent payload health check.';el('retry').className='hidden';}
   else if((/REBOOT/.test(text)&&!/NO REBOOT/.test(text))||msg==='Restart your console'){el('result').textContent='Failed — restart console';el('retry').className='hidden';}
   else if(msg==='Refresh the page and run again'||/^(REPAIRED|ROOT).*NO REBOOT/.test(text)){el('result').textContent='Not completed — original engine permits retry';el('retry').className='';el('retry').textContent='RETRY';el('retry').onclick=home;}
   else if(el('state').className==='bad'){el('result').textContent='Failed — see original engine status';el('notice').textContent='Restart the console before retrying when kernel state is uncertain.';}
  }
  if(w.MutationObserver){var observer=new MutationObserver(status);observer.observe(el('state'),{childList:true,characterData:true,subtree:true});observer.observe(el('msg'),{childList:true,characterData:true,subtree:true});observer.observe(d.body,{attributes:true,attributeFilter:['class']});}
  var module=d.createElement('script');module.type='module';module.src=host==='flash'?'chain_'+engine+'.js':'jb.js?v=19';module.onerror=function(){stop('Engine module could not load. Close browser, reconnect and verify the cache before retrying.');};d.body.appendChild(module);
 }
 offline=BadrOffline(w.applicationCache,session,function(kind,text){el('cache-status').textContent=text;if(safetyBlocked)return;if(kind==='ready'||kind==='update')start();else if(kind==='error')stop(text);});
 start();if(!started&&!safetyBlocked)offline.inspect();
}(window,document));
