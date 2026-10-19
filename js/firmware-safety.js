(function(w){
 'use strict';
 w.BadrSafety={verify:function(record,ua){
  var detected=w.BadrDetect(ua),current=detected.detectedFirmware;
  if(!record)return {ok:false,code:'setup-required',detection:detected,message:'First activation required.'};
  if(!current)return {ok:false,code:'unknown',detection:detected,message:'Firmware could not be detected automatically. Previous: '+record.firmware+' — Current: Unknown. Manual confirmation required; auto launch stopped.'};
  if(current!==record.firmware)return {ok:false,code:'changed',detection:detected,message:'Firmware Changed! Previous: '+record.firmware+' — Current: '+current};
  var check=w.BadrRouter.check(record.firmware,detected);
  if(!check.ok)return {ok:false,code:'unavailable',detection:detected,message:check.reason};
  return {ok:true,code:'match',detection:detected,item:check.item,message:'Firmware Safety Verification passed.'};
 }};
}(window));
