(function(w){
 'use strict';var KEY='badr_setup_v2';
 w.BadrActivation={key:KEY,pin:function(value){return value==='52053832';},read:function(s){
  var raw=s.getItem(KEY);if(!raw)return null;
  try{var a=JSON.parse(raw);if(a.schema!==2||a.activated!==true||a.setupComplete!==true||typeof a.firmware!=='string'||typeof a.cacheVersion!=='string'||a.cacheVersion===''||!w.BadrRouter.get(a.firmware)||a.host!==w.BadrRouter.get(a.firmware).host)return null;return a;}catch(e){return null;}
 },save:function(s,fw,version,cacheReady){
  if(!cacheReady)throw new Error('Cache has not completed. Activation not saved.');
  var item=w.BadrRouter.get(fw);if(!item||!item.launchAllowed)throw new Error('Firmware launch is unavailable.');
  var a={schema:2,activated:true,setupComplete:true,firmware:fw,host:item.host,cacheVersion:version};
  var encoded=JSON.stringify(a),previous=s.getItem(KEY),written=false;
  try{s.setItem(KEY,encoded);written=true;if(s.getItem(KEY)!==encoded)throw new Error('Activation storage verification failed.');}
  catch(e){if(written){try{if(previous===null)s.removeItem(KEY);else s.setItem(KEY,previous);}catch(restoreError){throw new Error('Storage failed and previous activation could not be restored. Check browser storage.');}}throw e;}
  return a;
 },reset:function(s){s.removeItem(KEY);s.removeItem('badr_ps4_activated');s.removeItem('badr_debug');if(s.getItem(KEY))throw new Error('Reset failed.');}};
}(window));
