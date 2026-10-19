(function(w){
 'use strict';
 var map={};
 function row(fw,host,chain,patch,payload,status,allowed,reason){map[fw]={firmware:fw,host:host,hostName:host==='flash'?'RawGame4':'Raw13G',route:host+'/',chain:chain,patch:patch,payloadFile:payload,payloadType:host==='flash'?'GoldHEN (upstream)':'Unverified GoldHEN-labelled binary',compatibility:status,launchAllowed:allowed,reason:reason};}
 row('11.00','flash','lapse','1100.bin','payload.bin','Source-supported',true,'Upstream support claim; local hardware validation pending.');
 row('11.50','flash','lapse','1150.bin','payload.bin','Source-supported',true,'Upstream support claim; local hardware validation pending.');
 row('12.00','flash','lapse','1200.bin','payload.bin','Source-supported',true,'Upstream support claim; local hardware validation pending.');
 row('12.02','flash','lapse','1200.bin','payload.bin','Experimental alias',true,'Offsets mark this alias UNTESTED-on-hardware. Confirm only for owner testing.');
 row('12.50','flash','poops','1250.bin','payload.bin','Source-supported',true,'Upstream support claim; some kernel RVAs are unverified.');
 row('12.52','flash','poops','1250.bin','payload.bin','Experimental alias',true,'Offsets mark the WebKit alias assumed and UNTESTED-on-hardware. Confirm only for owner testing.');
 row('13.00','flash','poops','1300.bin','payload.bin','Source-supported',true,'Original offsets report proven execution; local hardware validation pending.');
 row('13.02','flash2','jb','1302.bin','payload2.bin','Experimental — unavailable',false,'Kernel/patch evidence exists, but shipped GoldHEN-labelled binary contradicts PS4-HEN payload comments. Payload firmware compatibility unverified.');
 row('13.04','flash2','jb','1302.bin','payload2.bin','Experimental — unavailable',false,'Kernel alias of 13.02. Shipped payload identity and firmware support remain unverified.');
 row('13.50','flash2','jb','1350.bin','payload2.bin','Experimental — unavailable',false,'Patch marked UNTESTED on hardware; shipped GoldHEN-labelled payload contradicts PS4-HEN comments.');
 row('13.52','flash2','jb','1352.bin','goldhen.bin','Experimental — unavailable',false,'Source reports patched GoldHEN kernel panics (2/2), while selecting goldhen.bin. Binary equals payload2.bin. No verified compatible payload.');
 w.BadrRouter={map:map,get:function(fw){return Object.prototype.hasOwnProperty.call(map,fw)?map[fw]:null;},check:function(fw,detection){
  var item=this.get(fw);
  if(!item)return {ok:false,reason:'Unsupported firmware. No route is enabled.'};
  if(!detection || detection.consoleType!=='PS4' || !detection.detectedFirmware)return {ok:false,reason:'Firmware could not be detected automatically. Manual choice cannot override the engine User-Agent requirement. Check firmware on the PS4; execution is blocked.'};
  if(detection.detectedFirmware!==fw)return {ok:false,reason:'Firmware mismatch: detected '+detection.detectedFirmware+', selected '+fw+'. Execution blocked.'};
  if(!item.launchAllowed)return {ok:false,reason:item.reason+' Execution unavailable.'};
  return {ok:true,item:item};
 }};
}(window));
