/* Authored concept explanation only. No PDF extraction, evidence lookup,
 * confirmed inputs, numeric scenario values, assessment or product handoff.
 */
(() => {
  'use strict';
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=(a,b,value)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  const steps=Object.freeze([
    Object.freeze({id:'document',title:'AutoTrace',description:'เริ่มจากเนื้อหาในเอกสารซื้อ',content:`<h2>Read the source.</h2><p>แหล่งปลูก · ชนิดพืช · ช่วงเวลา · ปริมาณซื้อ</p><p class="evidence-emphasis">ข้อมูลที่แจ้ง<br>ยังไม่ใช่ข้อเท็จจริงที่ยืนยันแล้ว</p>`}),
    Object.freeze({id:'review',title:'Human review.',description:'ตรวจ แก้ไข และยืนยันข้อมูลก่อนจับคู่หลักฐาน',content:`<h2>Read. Correct. Confirm.</h2><p>ตรวจข้อมูลกับเนื้อหาต้นทาง</p><p>แก้ข้อมูลที่คลาดเคลื่อน</p><p class="evidence-emphasis">ผู้ใช้ยืนยัน<br>ก่อนไปขั้นตอนถัดไป</p><p class="evidence-label">ภาพอธิบายขั้นตอน ไม่ใช่การยืนยันข้อมูลจริง</p>`}),
    Object.freeze({id:'origin',title:'Origin & evidence.',description:'แหล่งปลูกเดียวกัน ช่วงเวลาเดียวกัน',content:`<h2>One origin. One period.</h2><p>นำข้อมูลพื้นที่ ที่สกัดได้มาจากเอกสาร ไปค้นหาภาพถ่ายดาวเทียม Sentinel-2 และหาข้อมูลไร่ข้าวโพดในพื้นที่ด้วย GISTDA API</p><p class="evidence-label">หลักฐานและสมมติฐานต้องยืนยันก่อนคำนวณ</p>`}),
    Object.freeze({id:'production',title:'From the field.',description:'เริ่มจากผลผลิตของแหล่งปลูกนี้',content:`<h2>The whole field.</h2><p>แหล่งปลูกนี้อาจให้ผลผลิตได้เท่าไร<br>ในช่วงเวลาที่เลือก?</p><p class="evidence-label">ต้องทบทวนพื้นที่ปลูก<br>และสมมติฐานผลผลิตก่อน</p>`}),
    Object.freeze({id:'burn',title:'Where burning is shown.',description:'ไฮไลต์บริเวณการเผาในภาพตัวอย่าง',content:`<h2>A highlighted portion.</h2><p>สีส้มแสดงส่วนที่สัมพันธ์กับการเผา<br>ในภาพจำลอง</p><p class="evidence-label">ไม่ใช่ข้อมูลไฟจริง<br>หรือปริมาณข้าวโพดที่เสียหาย<br>และไม่ใช่หลักฐานการปนเปื้อน</p>`}),
    Object.freeze({id:'supply',title:'What comes from the unburned part?',description:'เน้นเฉพาะส่วนที่ไม่เผาในภาพตัวอย่าง',content:`<h2>Focus on the green part.</h2><p>ประเมินผลผลิตจากส่วนไม่เผา<br>แล้วเทียบกับการซื้อจากแหล่งนี้<br>ในช่วงเวลาเดียวกัน</p><p class="evidence-label">ภาพอธิบายแนวคิด · ไม่ใช่ผลประเมิน</p>`}),
    Object.freeze({id:'compare',title:'Check the claim.',description:'ผลผลิตจากส่วนไม่เผา เพียงพอกับการซื้อที่แจ้งหรือไม่?',content:`<h2>Would it be enough?</h2><figure id="evidence-purchase-picture"><svg viewBox="0 0 620 162" role="img" aria-label="Hypothetical purchase comparison, not a measured quantity chart"><defs><pattern id="evidence-purchase-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 10L10 0M8 12L12 8" stroke="#a15f32" stroke-width="2"/></pattern></defs><text x="18" y="27">ผลผลิตจากส่วนไม่เผา</text><rect class="evidence-quantity-band" x="18" y="44" width="340" height="24" fill="#567b52"/><text x="18" y="106">การซื้อที่แจ้ง (กรณีตัวอย่าง)</text><rect class="evidence-quantity-band" x="18" y="123" width="500" height="24" fill="#e0e3d8" stroke="#93a28b"/><g class="evidence-example-gap"><rect x="358" y="123" width="160" height="24" fill="#dfc19a"/><rect x="358" y="123" width="160" height="24" fill="url(#evidence-purchase-hatch)"/></g></svg><figcaption class="evidence-label" lang="th">ภาพเปรียบเทียบ ไม่ได้ใช้สเกลปริมาณ</figcaption></figure><p class="evidence-condition">ถ้าปริมาณที่แจ้งซื้อมากกว่าผลผลิตจากส่วนไม่เผา<br>ต้องตรวจสอบคำกล่าวอ้างเพิ่มเติม</p><p class="evidence-label">ข้อมูลไม่ครบหรือขัดกัน ต้องตรวจทาน ไม่สรุปผล</p><p class="evidence-label">ภาพอธิบายแนวคิด · ไม่ใช่ผลประเมิน<br>ไม่ใช่หลักฐานว่าโรงงานทำผิด</p>`}),
    Object.freeze({id:'close',title:'Review the evidence.',description:'ตรวจสอบที่มา ก่อนสรุปผล',content:`<h2>Document → Review → Evidence</h2><p>ยืนยันหลักฐานและสมมติฐาน<br>ก่อนคำนวณและสรุปผล</p><p class="evidence-label">การสาธิตขั้นตอนจริงยังไม่เชื่อมต่อ</p>`}),
  ]);
  class PitchEvidence {
    static get steps(){return steps;}
    constructor(element,selectedOrigin){
      this.element=element;
      // Fixed authored markup only; never insert uploaded source text here.
      element.innerHTML=`<div id="evidence-body">
        <div class="evidence-illustration">
          <article id="evidence-document" class="evidence-document" lang="th">
            <h2>Procurement</h2><p class="evidence-label">เอกสารสมมติประกอบเรื่อง</p>
            <dl><div><dt>แหล่งปลูก</dt><dd>Supplier 01 · สมมติ</dd></div><div><dt>ชนิดพืช</dt><dd>ข้าวโพด</dd></div><div><dt>ช่วงเวลา</dt><dd>ยังไม่กำหนด</dd></div><div><dt>ปริมาณซื้อ</dt><dd>ยังไม่ระบุ</dd></div></dl>
            <p class="evidence-label">ภาพเอกสาร ไม่ใช่การสกัด PDF</p>
          </article>
          <figure id="evidence-map" hidden>
            <svg id="evidence-origin-map" viewBox="0 0 620 440" role="img" aria-label="Recurring fictional selected-origin symbol, not a real AOI or GISTDA crop polygon">
              <title>The same fictional selected origin</title>
              <path d="M30 100C180 60 260 140 420 80S530 135 610 95V310C470 365 370 285 260 350S90 315 20 370Z" fill="#e8ecde"/>
              <path d="M540 30C480 120 560 230 520 315S535 375 575 415" fill="none" stroke="#d0dfd6" stroke-width="12" stroke-linecap="round"/>
            </svg>
            <figcaption class="evidence-label" lang="th">ภาพประกอบแหล่งปลูก · ไม่ใช่ข้อมูลแปลงจริง</figcaption>
          </figure>
          <figure id="evidence-field" hidden>
            <svg id="evidence-field-canvas" viewBox="0 0 620 350" role="img" aria-label="Enlarged fictional Supplier 01 crop field, not measured geography or production">
              <title>The same fictional field, enlarged for explanation</title>
              <text class="evidence-field-name" x="30" y="26">Supplier 01 · Selected origin</text>
            </svg>
            <figcaption class="evidence-label" lang="th">ภาพตัวอย่าง ไม่ใช่สัดส่วนหรือปริมาณจริง</figcaption>
            <p id="evidence-field-key" class="evidence-label" lang="th" hidden><span class="evidence-burn-key">สีส้ม: การเผาจำลอง</span><br><span class="evidence-green-key">สีเขียว: ส่วนไม่เผาในภาพตัวอย่าง</span></p>
          </figure>
          <div id="evidence-closing" hidden><p class="evidence-closing-mark">A claim.<br>A starting point.</p><p lang="th">คำกล่าวอ้างคือจุดเริ่มต้น<br>ไม่ใช่ข้อสรุป</p></div>
          <p id="evidence-assumptions" class="evidence-label" lang="th" hidden>สมมติฐานตัวอย่าง: ไม่มีสต็อกยกมา<br>ไม่มีวัตถุดิบทดแทนจากนอกแหล่งที่เลือก</p>
        </div>
        <div id="evidence-content">${steps.map(step=>`<section class="evidence-detail" data-step="${step.id}" hidden>${step.content}</section>`).join('')}</div>
      </div>`;
      this.body=element.querySelector('#evidence-body');
      this.panels=[...element.querySelectorAll('.evidence-detail')];
      const origin=selectedOrigin.cloneNode(true);
      origin.id='evidence-origin-symbol';origin.setAttribute('class','evidence-origin');
      origin.removeAttribute('data-origin-id');origin.removeAttribute('data-selected');
      origin.dataset.storyOrigin='story-origin-01';origin.setAttribute('transform','translate(300 220) scale(1.3)');
      origin.querySelectorAll('[class]').forEach(node=>node.setAttribute('class',node.getAttribute('class').replaceAll('supply-','evidence-origin-')));
      element.querySelector('#evidence-origin-map').append(origin);
      const field=selectedOrigin.querySelector('g').cloneNode(true);
      field.id='evidence-field-plot';field.dataset.storyOrigin='story-origin-01';
      field.setAttribute('transform','translate(300 215) scale(2.9)');
      element.querySelector('#evidence-field-canvas').append(field);
      const svgNode=(tag,attributes)=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attributes).forEach(([name,value])=>node.setAttribute(name,value));return node;};
      const shape=field.querySelector('path').getAttribute('d'),exampleBurn='M8-70H100V60H-12Z';
      // These positions are authored illustration, never a burn fraction, source geometry
      // or a ScenarioBurnProvider input. All highlights are clipped to the same crop glyph.
      const definitions=svgNode('defs',{});
      definitions.innerHTML=`<clipPath id="evidence-field-clip"><path d="${shape}"/></clipPath><pattern id="evidence-burn-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#98582d" stroke-width="1.1"/></pattern><mask id="evidence-unburned-mask" maskUnits="userSpaceOnUse" x="-110" y="-90" width="230" height="180" style="mask-type:luminance"><path d="${shape}" fill="white"/><path d="${exampleBurn}" fill="black"/></mask>`;
      element.querySelector('#evidence-field-canvas').prepend(definitions);
      this.fieldBase=svgNode('g',{id:'evidence-field-base'});
      while(field.firstChild)this.fieldBase.append(field.firstChild);
      field.append(this.fieldBase);
      this.burn=svgNode('g',{id:'evidence-burn-overlay','clip-path':'url(#evidence-field-clip)'});
      this.burn.append(svgNode('path',{d:exampleBurn,fill:'#dcae78'}),svgNode('path',{d:exampleBurn,fill:'url(#evidence-burn-hatch)'}));
      this.focus=svgNode('g',{id:'evidence-unburned-focus',mask:'url(#evidence-unburned-mask)'});
      const greenCrop=this.fieldBase.cloneNode(true);greenCrop.removeAttribute('id');
      this.focus.append(greenCrop,svgNode('path',{d:shape,fill:'none',stroke:'#244f38','stroke-width':'3'}));
      field.append(this.burn,this.focus);
    }
    render(step,progress){
      const active=step>0&&progress<.4?step-1:step;
      this.panels.forEach((panel,index)=>{panel.hidden=index!==active;});
      this.element.querySelector('#evidence-document').hidden=active>=2;
      this.element.querySelector('#evidence-map').hidden=active!==2;
      this.element.querySelector('#evidence-field').hidden=active<3||active>6;
      this.element.querySelector('#evidence-field-key').hidden=active<4||active>6;
      this.body.dataset.visual=String(active>=3&&active<=5);
      this.element.querySelector('#evidence-closing').hidden=active!==7;
      this.element.querySelector('#evidence-assumptions').hidden=active!==5&&active!==6;
      this.element.dataset.step=steps[active].id;
      this.element.style.clipPath=step===0?`inset(0 ${(1-smooth(0,1,progress))*100}% 0 0)`:'none';
      const fade=step===0?smooth(.2,.9,progress):progress<.4?1-smooth(0,.35,progress):smooth(.4,1,progress),anchored=step===4||step===5;
      this.body.style.opacity=anchored?1:fade;
      this.element.querySelector('#evidence-content').style.opacity=anchored?fade:1;
      const burn=step===4?smooth(.4,1,progress):active>=4&&active<=6?1:0,focus=step===5?smooth(.4,1,progress):active>=5&&active<=6?1:0;
      this.fieldBase.style.opacity=1-.65*focus;
      this.burn.style.opacity=burn*(.85-.65*focus);
      this.focus.style.opacity=focus;
      return steps[active];
    }
  }
  window.PitchEvidence=PitchEvidence;
})();
