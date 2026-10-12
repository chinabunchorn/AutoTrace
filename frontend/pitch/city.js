/* Authored Bangkok city-life illustration. No measured routes or transport data. */
(() => {
  'use strict';
  const svg=document.querySelector('#city svg');
  const ns='http://www.w3.org/2000/svg';
  const node=(tag,attrs={},parent=svg)=>{
    const el=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);
    parent.append(el);return el;
  };
  const rect=(parent,x,y,width,height,fill,extra={})=>node('rect',{x,y,width,height,fill,...extra},parent);
  const path=(parent,d,fill,extra={})=>node('path',{d,fill,...extra},parent);
  const circle=(parent,cx,cy,r,fill)=>node('circle',{cx,cy,r,fill},parent);
  const group=(parent,attrs={})=>node('g',attrs,parent);
  const motion=(parent,kind,seconds,delay)=>group(parent,{class:`ambient-motion ${kind}`,style:`--speed:${seconds}s;--delay:${delay}s`});
  const defs=svg.querySelector('defs');
  const clip=node('clipPath',{id:'train-clip'},defs);rect(clip,738,475,862,90,'white');

  const details=group(svg,{id:'city-details'});
  for(const [x,y,w,h] of [[310,448,52,187],[760,472,53,143],[1360,478,37,140],[1470,520,56,106]]){
    rect(details,x,y,w,h,'#688879');
    for(let row=y+9;row<y+h-6;row+=15)for(let col=x+7;col<x+w-4;col+=10)rect(details,col,row,3,7,'#dbe6cc',{opacity:'.65'});
    rect(details,x+8,y-9,w-16,9,'#537260');
  }
  // Glass mullions, terraces and rooftop structures reward closer inspection.
  for(const [x,y,w,h] of [[445,432,72,270],[638,399,90,293],[1138,484,65,226],[1290,533,78,180]]){
    for(let col=x;col<x+w;col+=13)path(details,`M${col} ${y}v${h}`,'none',{stroke:'#bed1b7','stroke-width':'.8',opacity:'.35'});
    for(let row=y;row<y+h;row+=24)path(details,`M${x} ${row}h${w}`,'none',{stroke:'#cbd5b8','stroke-width':'.8',opacity:'.35'});
  }
  for(const [x,y] of [[280,394],[1405,422]]){
    path(details,`M${x} ${y+155}V${y}h112m-112 0-34 17h146m-77-17 68 17m-38 0v37`,'none',{stroke:'#647e66','stroke-width':3});
    path(details,`M${x-5} ${y+10}l10 12-10 12 10 12-10 12 10 12-10 12 10 12`,'none',{stroke:'#647e66','stroke-width':1.5});
  }

  const life=group(svg,{id:'city-life'});
  // Elevated train: separate supports and clipping keep it on its authored track.
  for(const x of [810,1020,1240,1460]){
    rect(life,x,547,13,94,'#567361');
    path(life,`M${x-16} 552h45l-11 13h-23Z`,'#7e9478');
  }
  rect(life,738,543,862,11,'#456451');rect(life,738,539,862,4,'#d2d7ba');
  const rail=group(life,{'clip-path':'url(#train-clip)'});
  const train=motion(group(rail,{transform:'translate(0 510)'}),'train-motion',13,-3.9);
  for(let i=0;i<4;i++){
    const x=i*72;rect(train,x,0,68,28,'#eee9cf',{rx:4});rect(train,x+3,19,62,5,'#b76c3b');
    for(let col=x+7;col<x+60;col+=12)rect(train,col,5,9,10,'#375f58',{rx:1});
    rect(train,x+3,27,60,4,'#324d3d');rect(train,x+68,8,4,16,'#74846b');
  }

  // Two-way traffic on a city flyover, not a real road network.
  rect(life,0,607,1600,38,'#4d635a');
  path(life,'M0 626h1600','none',{stroke:'#b4baa0','stroke-width':1.5,'stroke-dasharray':'20 22'});
  rect(life,0,645,1600,7,'#87967d');
  for(let x=65;x<1600;x+=185){rect(life,x,652,11,62,'#59715b');rect(life,x-10,652,31,5,'#b5bea0');}
  const colors=['#d8be66','#e0dcc4','#709c86','#b97953','#afbfac'];
  for(let i=0;i<18;i++){
    const lane=group(life,{transform:`translate(0 ${i%2?634:614})`});
    const car=motion(lane,'traffic-motion',i%2?19:24,-i*2.8-2);
    if(i%2)car.style.animationDirection='reverse';
    const bus=i%7===0,w=bus?58:32;
    rect(car,0,-8,w,12,colors[i%colors.length],{rx:3});
    path(car,bus?`M4-8v-9h${w-8}v9Z`:'M7-8l5-8h12l5 8Z',colors[i%colors.length]);
    if(bus)for(let col=6;col<w-4;col+=10)rect(car,col,-14,7,6,'#345b55');
    else path(car,'M12-13h10l3 5H9Z','#345b55');
    circle(car,7,4,3,'#2b4136');circle(car,w-7,4,3,'#2b4136');
    rect(car,w-2,-6,2,3,'#f1df9a');rect(car,0,-5,2,3,'#b95635');
  }

  // Riverbank shops, palms, lamps and people form a lived-in foreground.
  for(let i=0;i<9;i++){
    const x=978+i*63,y=708+(i%3)*7;
    rect(life,x,y,57,57,i%2?'#8d9d78':'#b5b292');
    rect(life,x+4,y+6,49,4,'#506b53');
    for(const wx of [x+8,x+32]){rect(life,wx,y+15,15,14,'#365b4a');rect(life,wx+6,y+15,2,14,'#c3c9a8');}
    rect(life,x+7,y+38,16,19,'#415d48');rect(life,x+29,y+38,20,19,'#768469');
    path(life,`M${x-3} ${y+36}h63l-5-10h-53Z`,i%2?'#b27549':'#d5c48c');
    for(let col=0;col<5;col++)rect(life,x+col*12,y+26,6,10,'#ede2b9',{opacity:'.55'});
  }
  for(const [x,y] of [[760,756],[907,766],[1270,778],[1490,762]]){
    path(life,`M${x} ${y}q-6-35 2-69`,'none',{stroke:'#4c6244','stroke-width':4});
    for(const dx of [-32,-20,20,33])path(life,`M${x+2} ${y-69}q${dx/2}-18 ${dx} 4q${-dx/2}-10 ${-dx} -4`,'#40694e');
  }
  for(let i=0;i<11;i++){
    const spot=group(life,{transform:`translate(${888+i*57} ${779+(i%3)*5})`});
    const person=motion(spot,'pedestrian-motion',6+i%4,-i*.9);
    circle(person,0,-13,2.7,'#7c6950');rect(person,-2.6,-10,5.2,9,i%2?'#d5c899':'#406955',{rx:1});
    path(person,'M-1-1l-3 6m5-6 3 6M-3-8l-3 5m9-5 3 5','none',{stroke:'#3b5140','stroke-width':1.5});
  }
  for(const x of [825,1105,1390]){
    path(life,`M${x} 791v-57q0-8 10-8h10`,'none',{stroke:'#526b54','stroke-width':2});
    rect(life,x+12,725,9,4,'#dec98a');
  }
  for(let i=0;i<3;i++){
    const boat=motion(group(life,{transform:`translate(0 ${829+i*23})`}), 'boat-motion',32+i*9,-8-i*10);
    path(boat,'M-15 0h103L73 11H1Z','#315b4b');rect(boat,5,-16,56,16,'#ddd2a5');
    path(boat,'M-2-17h72l-10-7H9Z','#bd874a');
    for(let x=11;x<60;x+=11)rect(boat,x,-11,7,6,'#3a5b50');
    path(boat,'M-70 8h50m-62 5h47','none',{stroke:'#e6e8d1','stroke-width':2,opacity:'.7'});
  }
  // Separate light plane remains luminous while the daylight city is darkened.
  const nightSvg=node('svg',{viewBox:'0 0 1600 900',preserveAspectRatio:'xMidYMax slice'},document.getElementById('city-lights'));
  const illumination=group(nightSvg,{class:'night-illumination'});
  for(const [x,y,w,h] of [[443,439,79,270],[630,395,104,304],[881,551,77,163],[970,539,66,183],[1137,480,69,240],[1287,532,89,181]]){
    for(let row=0;row*23<h;row++)for(let col=0;col*18<w;col++){
      if((row*7+col*3)%5<2)rect(illumination,x+col*18+3,y+row*23+3,4,7,'#f2d594',{opacity:'.8'});
    }
  }
  for(let i=0;i<18;i++){
    const lane=group(illumination,{transform:`translate(0 ${i%2?634:614})`});
    const lamps=motion(lane,'traffic-motion',i%2?19:24,-i*2.8-2);
    if(i%2)lamps.style.animationDirection='reverse';
    const w=i%7===0?58:32;rect(lamps,w-2,-6,3,3,'#ffebb0');rect(lamps,0,-5,2,3,'#da7c4e');
  }
  for(const x of [825,1105,1390])circle(illumination,x+17,727,4,'#f6d990');
  for(let i=0;i<9;i++)rect(illumination,985+i*63,746+(i%3)*7,40,8,'#dfb975',{opacity:'.65'});

  // Exaggerated storytelling motes, not visible-to-scale or measured PM2.5.
  const dustSvg=node('svg',{viewBox:'0 0 1600 900',preserveAspectRatio:'xMidYMax slice'},document.getElementById('pm-dust'));
  const dustBase=group(dustSvg),dustDense=group(dustSvg,{id:'dust-dense'});
  const towerBands=[[684,275,170,115],[980,385,190,100],[1220,470,150,60]];
  towerBands.forEach(([cx,cy,rx,ry],band)=>{
    for(let i=0;i<24;i++){
      const angle=i*2.399+band,spread=Math.sqrt((i+.5)/24);
      const anchor=group(i%2?dustDense:dustBase,{transform:`translate(${cx+Math.cos(angle)*rx*spread} ${cy+Math.sin(angle)*ry*spread})`});
      const drift=motion(anchor,'dust-motion',10+i%8,-i*.83-band*1.1);
      if(i%3===0)drift.style.animationDirection='reverse';
      const r=2.5+(i%5)*.6;
      node('circle',{cx:0,cy:0,r:r*1.9,fill:'currentColor',opacity:'.09'},drift);
      node('circle',{class:'dust-mote',cx:0,cy:0,r,fill:'currentColor',opacity:.4+(i%4)*.15},drift);
    }
  });
})();
