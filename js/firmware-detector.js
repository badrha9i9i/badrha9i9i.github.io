(function(w){
 'use strict';
 w.BadrDetect=function(ua){
  ua=String(ua||'');
  var pattern=/(?:^|[\s(;])PlayStation\s+4(?:\/| +)([1-9][0-9]?)\.([0-9]{2})(?=$|[\s;)])/g;
  var m=pattern.exec(ua), duplicate=m && pattern.exec(ua), fw=m&&!duplicate?m[1]+'.'+m[2]:null;
  var row=fw?w.BadrRouter.get(fw):null;
  return {consoleType:fw?'PS4':null,detectedFirmware:fw,detectionSource:fw?'user-agent':null,detectionConfidence:fw?'high':'none',supported:!!(row&&row.launchAllowed),recommendedHost:row?row.host:null};
 };
}(window));
