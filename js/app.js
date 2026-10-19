(function(w,d){
 'use strict';
 if(window.BadrShopRedirect)return;
 var detection=BadrDetect(navigator.userAgent), record=null, selected=null, manualCandidate=null, authorized=false, launched=false, storage,session,offline;
 function el(id){return d.getElementById(id);}
 function message(t,bad){el('message').textContent=t;el('message').className=bad?'error':'';}
 function show(id){var ids=['login','confirm','manual','manual-confirm','safety','install'];for(var i=0;i<ids.length;i++)el(ids[i]).className=ids[i]===id?'':'hidden';}
 function safety(result){selected=null;show('safety');el('safety-detail').textContent=result.message;message('Auto launch stopped. Previous activation is retained until compatible setup and offline cache succeed.',true);BadrNav.focus('reverify');}
 function describe(fw){var r=BadrRouter.get(fw);return r?r.hostName+' · /'+r.route+' · '+r.compatibility+' — '+r.reason:'Unsupported firmware';}
 function manual(){show('manual');el('selection').textContent=describe(el('firmwares').value);BadrNav.focus('firmwares');}
 function detect(){
  d.documentElement.className='setup';
  if(!detection.detectedFirmware){manual();message('Firmware could not be detected automatically.',true);return;}
  show('confirm');el('detected').textContent=detection.detectedFirmware;el('recommendation').textContent=describe(detection.detectedFirmware);message('Confirm the firmware shown in PS4 system settings.');BadrNav.focus('yes');
 }
 function launch(){
  if(launched||!authorized||!selected)return;
  var check=BadrRouter.check(selected,BadrDetect(navigator.userAgent));
  if(!check.ok){message(check.reason,true);return;}
  if(offline.status()===4){offline.apply(BadrVersion,function(){session.setItem('badr_pending_setup',JSON.stringify({firmware:selected,previous:storage.getItem(BadrActivation.key)}));},function(){launched=true;location.reload();});return;}
  if(!offline.ready())return;
  try{BadrActivation.save(storage,selected,BadrVersion,true);session.removeItem('badr_pending_setup');}catch(e){message('Local storage error: '+e.message,true);return;}
  launched=true;message('OFFLINE READY — launching '+check.item.hostName);location.replace(check.item.route);
 }
 function choose(fw,manuallyConfirmed){
  if(!authorized){message('Complete activation or firmware re-verification first.',true);return;}
  detection=BadrDetect(navigator.userAgent);
  if(!detection.detectedFirmware&&!manuallyConfirmed){manualCandidate=fw;show('manual-confirm');el('manual-version').textContent=fw;el('manual-detail').textContent=describe(fw);message('Check the actual firmware in PS4 System Information. Manual confirmation does not override engine compatibility.');BadrNav.focus('manual-yes');return;}
  var check=BadrRouter.check(fw,detection);
  if(!check.ok){message(check.reason,true);return;}
  selected=fw;show('install');el('selected-summary').textContent=fw+' · '+check.item.hostName+' · '+check.item.payloadType;offline.inspect();
 }
 try{storage=w.localStorage;session=w.sessionStorage;record=BadrActivation.read(storage);}catch(e){message('Local storage unavailable. Enable browser storage.',true);return;}
 var fw;for(fw in BadrRouter.map)if(Object.prototype.hasOwnProperty.call(BadrRouter.map,fw)){var opt=d.createElement('option'),r=BadrRouter.map[fw];opt.value=fw;opt.textContent=fw+' · '+r.hostName+' · '+r.compatibility;el('firmwares').appendChild(opt);}
 if(detection.detectedFirmware&&BadrRouter.get(detection.detectedFirmware))el('firmwares').value=detection.detectedFirmware;
 offline=BadrOffline(w.applicationCache,session,function(kind,text,p){
  el('cache-status').textContent=text;
  if(kind==='progress')el('bar').style.width=p+'%';
  else if(kind==='ready'){el('bar').style.width='100%';launch();}
  else if(kind==='update')launch();
  else if(kind==='error'&&authorized)message(text,true);
 });
 el('pin-form').onsubmit=function(e){e.preventDefault();if(!BadrActivation.pin(el('pin').value)){message('Incorrect activation code. الكود غير صحيح.',true);return;}authorized=true;el('pin').value='';detect();};
 el('yes').onclick=function(){choose(detection.detectedFirmware);};el('no').onclick=manual;
 el('choose').onclick=function(){choose(el('firmwares').value);};el('firmwares').onchange=function(){el('selection').textContent=describe(this.value);message('Check the firmware on the console. A mismatched choice will be blocked.');};
 el('retry-cache').onclick=function(){offline.retry();};
 el('reverify').onclick=function(){authorized=!!record;detection=BadrDetect(navigator.userAgent);if(detection.detectedFirmware&&BadrRouter.get(detection.detectedFirmware))el('firmwares').value=detection.detectedFirmware;else if(record)el('firmwares').value=record.firmware;detect();};
 el('manual-yes').onclick=function(){choose(manualCandidate,true);};el('manual-back').onclick=manual;
 /* Resume a confirmed replacement only if the previous activation is unchanged.
    The original record is never deleted to stage a replacement. */
 try{var rawPending=session.getItem('badr_pending_setup');if(rawPending){session.removeItem('badr_pending_setup');var pending=JSON.parse(rawPending);if(pending.previous===storage.getItem(BadrActivation.key)&&BadrRouter.check(pending.firmware,detection).ok){authorized=true;choose(pending.firmware);return;}}}catch(e){}
 if(record){
  var verification=BadrSafety.verify(record,navigator.userAgent),requested=false;
  try{requested=session.getItem('badr_reverify_requested')==='true';session.removeItem('badr_reverify_requested');}catch(e){}
  if(!verification.ok){safety(verification);return;}
  if(requested){safety({message:'Re-verify firmware: '+record.firmware+'. Previous activation will be retained until setup succeeds.'});return;}
  authorized=true;selected=record.firmware;show('install');el('selected-summary').textContent=selected+' · '+record.host;offline.inspect();return;
 }
 d.documentElement.className='';show('login');message('First activation at Badr Al Haqiqi.');BadrNav.focus('pin');
}(window,document));
