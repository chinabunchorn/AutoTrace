/* Seven-beat presentation controller. No product inputs, confirmations or results. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const clamp=value=>Math.max(0,Math.min(1,value));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
  const months=['October','November','December','January'];
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let scene='city',progress=0,busy=false,frame=null,version=0,duration=12,regionDuration=4;
  const questionDuration=1.2,factoryDuration=4,suppliersDuration=6,checkDuration=1.6;
  const evidenceIntroDuration=2,evidenceDuration=1.2;
  const terrain=new window.PitchTerrain($('terrain'),$('region-labels'),()=>render());
  let factory=null,suppliers=null;
  let evidence=null,evidenceStep=0;
  const minimal=new URLSearchParams(location.search).get('motion')==='off';
  const reduced=()=>minimal||media.matches;
  const daylightAt=value=>reduced()?1:(1+Math.cos(value*2*Math.PI))/2;
  const rgb=values=>`rgb(${values.map(value=>Math.round(value)).join(',')})`;
  const colorMix=(a,b,t)=>a.map((value,i)=>lerp(value,b[i],t));

  function state(){
    let phase;
    if(scene==='city')phase=busy?'months':progress===0?'ready':progress===1?'city-hold':'months';
    else if(scene==='region')phase=progress===1?'region-hold':'ascent';
    else if(scene==='question')phase=progress===1?'question-hold':'question-reveal';
    else if(scene==='factory')phase=progress===1?'factory-hold':'descent';
    else if(scene==='suppliers')phase=progress===1?'suppliers-hold':progress<.32?'pullback':'deliveries';
    else if(scene==='check')phase=progress===1?'check-hold':'check-reveal';
    else phase=progress===1?'evidence-hold':evidenceStep===0?'evidence-wipe':'evidence-reveal';
    const monthProgress=scene==='city'?progress:1;
    const renderer=scene==='evidence'?'html':scene==='check'?progress<.65?'svg':'html':scene==='suppliers'?progress<.32&&factory?factory.kind:'svg':scene==='factory'&&factory?factory.kind:terrain.kind;
    return {scene,progress,busy,phase,beat:scene==='city'?1:scene==='region'?2:scene==='question'?3:scene==='factory'?4:scene==='suppliers'?5:scene==='check'?6:7,month:months[Math.min(3,Math.floor(monthProgress*4))],renderer,duration,regionDuration,questionDuration,factoryDuration,suppliersDuration,checkDuration,evidenceIntroDuration,evidenceDuration,evidenceStep:scene==='evidence'?evidenceStep:null,reveal:scene==='evidence'?window.PitchEvidence.steps[evidenceStep].id:null,daylight:daylightAt(monthProgress)};
  }
  function stop(){version++;if(frame!==null)cancelAnimationFrame(frame);frame=null;busy=false;}
  function render(){
    const evidenceScene=scene==='evidence',checkScene=scene==='check',supplierScene=scene==='suppliers',factoryScene=scene==='factory',question=scene==='question',regional=scene!=='city';
    $('world').style.opacity=1;
    $('check-backdrop').style.opacity=0;
    $('stage').dataset.check='false';
    $('stage').dataset.evidence='false';
    $('evidence-scene').style.visibility='hidden';
    $('evidence-scene').setAttribute('aria-hidden','true');
    const cityProgress=regional?1:progress;
    const month=months[Math.min(3,Math.floor(cityProgress*4))];
    const haze=smooth(0,1,cityProgress);
    const daylight=daylightAt(cityProgress),night=1-daylight;
    const lift=question||factoryScene||supplierScene||checkScene||evidenceScene?1:regional?progress:0;
    const camera=1-Math.pow(1-lift,3);
    const reveal=smooth(.08,.42,lift);
    const labelReveal=smooth(.42,.85,lift);
    const top=colorMix(colorMix([153,203,213],[193,204,202],haze),[20,37,53],night);
    const horizon=colorMix([220,228,210],[47,65,67],night);
    const paper=colorMix([247,246,240],[29,45,49],night);
    $('stage').style.setProperty('--ink',rgb(colorMix([32,61,50],[237,231,207],night)));
    $('stage').style.setProperty('--paper-rgb',paper.map(Math.round).join(','));
    $('stage').style.setProperty('--haze-rgb',colorMix([210,217,210],[95,113,113],night).map(Math.round).join(','));
    $('sky').style.background=`linear-gradient(180deg,${rgb(top)} 0%,${rgb(horizon)} 76%,${rgb(paper)} 100%)`;
    $('sun').style.opacity=daylight*daylight*(1-haze*.65)*(1-reveal);
    $('sun').style.right=23+Math.sin(cityProgress*2*Math.PI)*10+'%';
    $('sun').style.top=22+night*28+'%';
    $('moon').style.opacity=night*night*(1-haze*.6)*(1-reveal);
    $('stars').style.opacity=night*(1-haze*.8)*(1-reveal);
    $('wisps').style.opacity=daylight*(1-haze*.9)*(1-reveal);
    $('city').style.opacity=1-smooth(.14,.42,lift);
    $('city').style.transform=`translateY(${camera*-60}%) scale(${1+smooth(0,.4,lift)*1.9})`;
    $('city').style.filter=`brightness(${1-night*.68}) saturate(${1-haze*.18})`;
    $('skyline-far').style.opacity=1-haze*.94;
    $('skyline-mid').style.opacity=1-haze*.72;
    $('city-lights').style.opacity=night*(1-haze*.55)*(1-smooth(.14,.42,lift));
    $('city-lights').style.transform=$('city').style.transform;
    $('haze').style.opacity=haze*.65*(1-reveal);
    $('pm-dust').style.opacity=smooth(.08,.85,cityProgress)*(1-smooth(.14,.42,lift));
    $('pm-dust').style.transform=$('city').style.transform;
    $('pm-dust').style.setProperty('--dust-color',rgb(colorMix([112,104,86],[206,189,149],night)));
    $('dust-dense').style.opacity=smooth(.45,1,cityProgress);
    $('cloud-pass').style.opacity=Math.sin(Math.PI*smooth(0,.72,lift))*.62;
    $('cloud-pass').style.transform=`translate(${lift*-10}%,${lift*15}%) scale(${1+lift*.7})`;
    terrain.opacity(reveal);
    $('earth-backdrop').style.opacity=reveal;
    $('earth-backdrop').style.transform=`translateY(${(1-camera)*18}px) scale(${1.03-camera*.03})`;
    $('region-labels').style.opacity=labelReveal;
    terrain.transform('none');
    $('factory-scene').style.opacity=0;
    $('factory-scene').setAttribute('aria-hidden','true');
    $('factory-claim').style.opacity=0;
    $('factory-claim').style.visibility='hidden';
    $('factory-claim').setAttribute('aria-hidden','true');
    $('supply-scene').style.opacity=0;
    $('supply-scene').setAttribute('aria-hidden','true');

    $('month-panel').style.opacity=1-smooth(0,.26,lift);
    $('month-panel').style.pointerEvents=regional?'none':'';
    $('month').textContent=month;
    const wide=regional&&lift>.42;
    $('title').textContent=wide?'Beyond the city.':regional?'Above the haze.':'Bangkok, over time.';
    $('description').textContent=wide?'มุมมองที่กว้างกว่าตัวเมือง…ภาพจำลองพื้นที่เผา':regional?'จากภาพในเมือง สู่มุมมองที่กว้างขึ้น':haze>.65?'ภาพจำลองเมืองที่ยังเคลื่อนไหว…ใต้ฟ้าที่ PM2.5 บดบัง':'ภาพจำลองชีวิตเมือง…ในวันที่ฟ้ายังเปิด';
    const questionProgress=question?smooth(0,1,progress):0;
    $('stage').dataset.question=String(question&&questionProgress>=.5);
    const caption=document.querySelector('.caption');
    caption.style.opacity=question?Math.abs(2*questionProgress-1):1;
    caption.style.transform=question?`translateY(${questionProgress<.5?-questionProgress*12:(1-questionProgress)*12}px)`:'none';
    if(question&&questionProgress>=.5){
      $('title').textContent='Beyond what we see.';
      $('description').textContent='แล้วคำกล่าวอ้างว่า “ไม่เผา” ตรวจสอบได้อย่างไร?';
    }
    if(factoryScene){
      if(!factory)factory=new window.PitchFactory($('factory-canvas'),$('factory-sign'),()=>render());
      factory.render(progress);
      const disappearing=1-smooth(.15,.44,progress),arrival=smooth(.38,.68,progress),claim=smooth(.8,1,progress);
      terrain.opacity(disappearing);
      terrain.transform(`translateY(${smooth(0,.5,progress)*12}%) scale(${1+smooth(0,.5,progress)*.65})`);
      $('earth-backdrop').style.opacity=disappearing;
      $('region-labels').style.opacity=1-smooth(0,.22,progress);
      $('cloud-pass').style.opacity=smooth(.05,.32,progress)*(1-smooth(.62,.93,progress));
      $('cloud-pass').style.transform=`translate(0,${progress*32-15}%) scale(${1+progress*.3})`;
      $('factory-scene').style.opacity=arrival;
      $('factory-scene').setAttribute('aria-hidden',String(arrival<1));
      $('factory-claim').style.opacity=claim;
      $('factory-claim').style.visibility=claim>0?'visible':'hidden';
      $('factory-claim').setAttribute('aria-hidden',String(claim<1));
      caption.style.opacity=progress<.5?1-smooth(0,.22,progress):smooth(.65,.88,progress);
      $('stage').dataset.question=String(progress<.5);
      $('title').textContent=progress<.5?'Beyond what we see.':"Factory A's claim.";
      $('description').textContent=progress<.5?'แล้วคำกล่าวอ้างว่า “ไม่เผา” ตรวจสอบได้อย่างไร?':'คำกล่าวอ้างของโรงงานสมมติ · ยังไม่ผ่านการตรวจสอบ';
    }
    if(supplierScene||checkScene){
      const amount=checkScene?1:progress;
      if(!suppliers)suppliers=new window.PitchSuppliers($('supply-map'));
      suppliers.render(amount);
      const mapReveal=smooth(.16,.32,amount),claim=1-smooth(0,.16,amount);
      if(amount<.32){
        if(!factory)factory=new window.PitchFactory($('factory-canvas'),$('factory-sign'),()=>render());
        factory.render(1-smooth(0,.32,amount));
      }
      terrain.opacity(0);$('earth-backdrop').style.opacity=0;$('region-labels').style.opacity=0;$('cloud-pass').style.opacity=0;
      $('factory-scene').style.opacity=1-mapReveal;
      $('factory-scene').setAttribute('aria-hidden',String(mapReveal>0));
      $('factory-claim').style.opacity=claim;
      $('factory-claim').style.visibility=claim>0?'visible':'hidden';
      $('factory-claim').setAttribute('aria-hidden',String(claim<1));
      $('supply-scene').style.opacity=mapReveal;
      $('supply-scene').setAttribute('aria-hidden',String(mapReveal<1));
      $('supply-map').style.transform=`scale(${lerp(.78,1,smooth(.1,.35,amount))})`;
      caption.style.opacity=amount<.25?1-smooth(0,.18,amount):smooth(.25,.45,amount);
      $('title').textContent=amount<.25?"Factory A's claim.":'More than one supplier.';
      $('description').textContent=amount<.25?'คำกล่าวอ้างของโรงงานสมมติ · ยังไม่ผ่านการตรวจสอบ':'Factory A รับผลผลิตมาจากหลายแหล่ง โดยมีจำนวนที่แตกต่างกัน';
    }
    if(checkScene){
      const cream=smooth(0,.65,progress),newCopy=progress>=.4;
      $('world').style.opacity=1-cream;
      $('check-backdrop').style.opacity=cream;
      $('supply-scene').setAttribute('aria-hidden',String(progress>0));
      $('stage').dataset.check=String(newCopy);
      caption.style.opacity=newCopy?smooth(.4,1,progress):1-smooth(0,.3,progress);
      if(newCopy){
        $('title').textContent='How can we check?';
        $('description').textContent='ถ้ามีข้าวโพดจากแปลงที่เผาเข้ามา\nเราจะตรวจสอบคำกล่าวอ้างได้อย่างไร?';
      }
    }
    if(evidenceScene){
      if(!suppliers)suppliers=new window.PitchSuppliers($('supply-map'));
      if(!evidence)evidence=new window.PitchEvidence($('evidence-scene'),$('supply-node-01'));
      const copy=evidence.render(evidenceStep,progress),entry=evidenceStep===0,newCopy=!entry||progress>=.4;
      $('world').style.opacity=0;$('check-backdrop').style.opacity=1;
      $('evidence-scene').style.visibility='visible';
      $('evidence-scene').setAttribute('aria-hidden',String(progress<1));
      $('stage').dataset.check=String(!newCopy);
      $('stage').dataset.evidence=String(newCopy);
      caption.style.opacity=entry?newCopy?smooth(.4,.85,progress):1-smooth(0,.3,progress):progress<.4?1-smooth(0,.35,progress):smooth(.4,1,progress);
      $('title').textContent=newCopy?copy.title:'How can we check?';
      $('description').textContent=newCopy?copy.description:'ถ้ามีข้าวโพดจากแปลงที่เผาเข้ามา\nเราจะตรวจสอบคำกล่าวอ้างได้อย่างไร?';
    }
    const s=state();
    $('stage').dataset.phase=s.phase;
    $('stage').dataset.scene=scene;
    $('stage').dataset.renderer=s.renderer;
    $('stage').dataset.minimal=String(reduced());
    if(regional)terrain.render(camera);
  }
  function seek(target,value,step=0){
    if(!['city','region','question','factory','suppliers','check','evidence'].includes(target)||!Number.isFinite(value)||target==='evidence'&&(!Number.isInteger(step)||step<0||step>=window.PitchEvidence.steps.length))throw new TypeError('Seek needs a supported scene, finite progress and valid evidence step.');
    stop();scene=target;evidenceStep=target==='evidence'?step:0;progress=clamp(value);render();return state();
  }
  function animate(target,start=0,step=0){
    stop();scene=target;evidenceStep=target==='evidence'?step:0;progress=start;
    if(reduced()){progress=1;render();return;}
    busy=true;render();const stamp=performance.now(),token=version,length=(target==='evidence'?step===0?evidenceIntroDuration:evidenceDuration:target==='check'?checkDuration:target==='suppliers'?suppliersDuration:target==='factory'?factoryDuration:target==='question'?questionDuration:target==='region'?regionDuration:duration)*1000*(1-start);
    function tick(now){
      if(version!==token)return;
      progress=lerp(start,1,clamp((now-stamp)/length));render();
      if(progress<1)frame=requestAnimationFrame(tick);else{frame=null;busy=false;render();}
    }
    frame=requestAnimationFrame(tick);
  }
  function next(){
    if(busy)return;
    if(scene==='city'&&progress<1)animate('city',progress);
    else if(scene==='city')animate('region',0);
    else if(scene==='region'&&progress===1)animate('question',0);
    else if(scene==='question'&&progress===1)animate('factory',0);
    else if(scene==='factory'&&progress===1)animate('suppliers',0);
    else if(scene==='suppliers'&&progress===1)animate('check',0);
    else if(scene==='check'&&progress===1)animate('evidence',0);
    else if(scene==='evidence'&&progress===1&&evidenceStep<window.PitchEvidence.steps.length-1)animate('evidence',0,evidenceStep+1);
    else if(progress<1)animate(scene,progress,evidenceStep);
  }
  function previous(){if(scene==='evidence')evidenceStep>0?seek('evidence',1,evidenceStep-1):seek('check',1);else if(scene==='check')seek('suppliers',1);else if(scene==='suppliers')seek('factory',1);else if(scene==='factory')seek('question',1);else if(scene==='question')seek('region',1);else seek('city',scene==='region'?1:0);}
  function reset(){seek('city',0);}
  async function fullscreen(){
    try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}
    catch{ /* Some preview hosts do not support fullscreen; leave the scene intact. */ }
  }

  const changed=()=>{if(media.matches&&busy)seek(scene,1,evidenceStep);else render();};
  if(media.addEventListener)media.addEventListener('change',changed);
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,select,summary')||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.repeat){
      if(['arrowright',' ','pagedown','arrowleft','pageup','r','f'].includes(event.key.toLowerCase()))event.preventDefault();
      return;
    }

    if(['ArrowRight',' ','PageDown'].includes(event.key)){event.preventDefault();next();}
    else if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();previous();}
    else if(event.key.toLowerCase()==='r')reset();
    else if(event.key.toLowerCase()==='f')fullscreen();
  });
  $('stage').addEventListener('click',next);
  window.addEventListener('resize',render);
  document.addEventListener('fullscreenchange',render);
  // Development-only seek/state access; no review UI in the presentation.
  window.pitchReview=Object.freeze({seek,state,next,previous,restart:reset,framing:()=>scene==='factory'&&factory?factory.framing:null});
  render();
})();
