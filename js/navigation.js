(function(w,d){
 'use strict';
 function move(e){
  var k=e.keyCode,a=d.activeElement,tag=a&&a.tagName;
  if(k!==37&&k!==38&&k!==39&&k!==40)return;
  if(tag==='SELECT'||(tag==='INPUT'&&(k===37||k===39)))return;
  var nodes=d.querySelectorAll('a[href],button,input,select'),list=[],i,at=-1;
  for(i=0;i<nodes.length;i++)if(!nodes[i].disabled&&nodes[i].offsetWidth&&nodes[i].offsetHeight){if(nodes[i]===a)at=list.length;list.push(nodes[i]);}
  if(!list.length)return;e.preventDefault();var next=(at+(k===37||k===38?-1:1)+list.length)%list.length;list[next].focus();
 }
 d.addEventListener('keydown',move,false);
 w.BadrNav={focus:function(id){var node=d.getElementById(id);if(node)node.focus();},stop:function(){d.removeEventListener('keydown',move,false);}};
 /* PS4 browser native X/Enter activation is retained. No gamepad polling runs during the engine. */
}(window,document));
