VIEWS.result = `
<div class="screen">
  <section class="result-hero">
    <div class="wrap-wide g2 result-hero-inner">
      <div class="headline">
        <h1>ข้าวโพดถูกเผาอย่างน้อย</h1>
        <p class="big-number num" style="color: {{numColor}}">{{num}}</p>
        <p class="headline-sub">หรือประมาณ <strong style="color: {{numColor}}">{{cs.gap}} ตัน</strong> ต่อ <strong>1,000 ตัน</strong> ที่ซื้อจาก {{cs.area}}</p>
        <div class="reveal {{revealOn}} verdict" style="background: {{verdictTint}}; color: {{verdictInk}}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 3L2 21h20z"></path><path d="M12 10v5"></path><path d="M12 17.5v.5"></path></svg>
          {{cs.verdict}}
        </div>
        <div class="prov-row">
          <button type="button" class="ghost prov-toggle" onClick="{{acc.prov.toggle}}" aria-expanded="{{acc.prov.expanded}}" aria-controls="prov">
            <sc-if value="{{acc.prov.closed}}">ดูที่มาของตัวเลข</sc-if>
            <sc-if value="{{acc.prov.open}}">ซ่อนที่มาของตัวเลข</sc-if>
            <span class="sign" style="transform: rotate({{acc.prov.rot}})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></span>
          </button>
        </div>
      </div>

      <figure class="waffle-figure">
        <!-- 100 squares, 1 square = 10 tonnes -->
        <div class="waffle" role="img" aria-label="{{cs.waffleAria}}">
          <sc-for list="{{cells}}" as="c">
            <div class="cell" style="background: {{c.bg}}; transition-delay: {{c.delay}}"></div>
          </sc-for>
        </div>
        <figcaption class="waffle-legend">
          <span>1 ช่อง = 10 ตัน</span>
          <span><span class="key burn"></span>มาจากแปลงที่อาจถูกเผา</span>
          <span><span class="key clean"></span>มาจากแปลงไม่เผาได้</span>
        </figcaption>
      </figure>

      <sc-if value="{{acc.prov.open}}">
        <div id="prov" class="reveal on prov">
          <h2>ที่มาของตัวเลข</h2>
          <div class="chain">
            <sc-for list="{{chain}}" as="c">
              <div class="reveal {{revealOn}} chain-node" style="background: {{c.bg}}; color: {{c.fg}}; border-color: {{c.border}}; transition-delay: {{c.delay}}">
                <span class="chain-label">{{c.label}}</span>
                <span class="chain-value num" style="color: {{c.valColor}}">{{c.val}}<span class="chain-unit"> {{c.unit}}</span></span>
                <span class="chain-src" style="color: {{c.srcColor}}">{{c.src}}</span>
              </div>
              <sc-if value="{{c.arrow}}">
                <div class="arr" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path></svg></div>
              </sc-if>
            </sc-for>
          </div>
        </div>
      </sc-if>
    </div>
  </section>

  <main class="wrap-wide result-main">
    <section class="sr compare">
      <div class="compare-head">
        <h2>{{cs.compareTitle}}</h2>
        <sc-if value="{{multiLayer}}">
          <div class="layer-switch" role="group" aria-label="ภาพฝั่งขวา">
            <sc-for list="{{layers}}" as="ly">
              <button type="button" aria-pressed="{{ly.pressed}}" onClick="{{ly.pick}}" style="background: {{ly.bg}}; color: {{ly.fg}}">{{ly.label}}</button>
            </sc-for>
          </div>
        </sc-if>
      </div>

      <figure class="compare-figure">
        <!-- drag anywhere on the picture to move the divider -->
        <div class="wipe" onPointerDown="{{wipeDown}}" onPointerMove="{{wipeMove}}" onPointerUp="{{wipeUp}}" onPointerCancel="{{wipeUp}}">
          <div class="sr-orbit wipe-images">
            <img src="{{cs.beforeImg}}" alt="ภาพดาวเทียมก่อนฤดูเผา" draggable="false">
            <sc-for list="{{layers}}" as="ly">
              <img class="fadeop" src="{{ly.img}}" alt="" draggable="false" style="clip-path: inset(0 0 0 {{wipePct}}); opacity: {{ly.op}}">
            </sc-for>
          </div>
          <div class="wipe-line" style="left: {{wipePct}}">
            <div class="wipe-knob">
              <svg width="26" height="16" viewBox="0 0 26 16" fill="none" stroke="#283F24" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M7 2 L1 8 L7 14"></path><path d="M19 2 L25 8 L19 14"></path></svg>
            </div>
          </div>
          <div class="wipe-tag left">{{cs.beforeTag}}</div>
          <div class="wipe-tag right">{{rightTag}}</div>
        </div>
        <label class="wipe-range">
          <span>ก่อน</span>
          <input type="range" min="0" max="100" value="{{wipe}}" onChange="{{wipeRange}}" aria-label="เลื่อนเทียบภาพก่อนและหลังฤดูเผา">
          <span>หลัง</span>
        </label>
        <figcaption class="small-caption">{{cs.compareCaption}}</figcaption>
      </figure>
    </section>

    <section class="sr bars-card">
      <h2>ผลผลิตจากแปลงไม่เผาเทียบกับปริมาณรับซื้อ</h2>
      <!-- R - C = B drawn as three bars, heights come from cs.eq -->
      <div class="eq" role="img" aria-label="ปริมาณรับซื้อเทียบกับผลผลิตจากแปลงไม่เผา">
        <div class="eq-head"><div class="eq-label">ปริมาณรับซื้อ</div><div class="v num">1,000 ตัน</div></div>
        <div></div>
        <div class="eq-head"><div class="eq-label">ผลผลิตจากแปลงไม่เผา</div><div class="v num clean">{{cs.clean}} ตัน</div></div>
        <div></div>
        <div class="eq-head"><div class="eq-label">{{cs.eq3Label}}</div><div class="v num" style="color: {{numColor}}">{{cs.gap}} ตัน</div></div>

        <div class="eq-col"><div class="grow sr-y eq-bar bought" style="height: {{eqR}}"></div></div>
        <div class="op" aria-hidden="true">{{cs.op1}}</div>
        <div class="eq-col"><div class="grow sr-y eq-bar clean" style="height: {{eqC}}"></div></div>
        <div class="op" aria-hidden="true">{{cs.op2}}</div>
        <div class="eq-col"><div class="grow sr-y eq-bar burn" style="height: {{eqB}}"></div></div>

        <div class="eq-note">จากเอกสาร {{cs.no}}</div>
        <div></div>
        <div class="eq-note">{{cs.note2}}</div>
        <div></div>
        <div class="eq-note">{{cs.note3}}</div>
      </div>
    </section>

    <section class="sr details">
      <h2>รายละเอียด</h2>
      <div>
        <div class="acc">
          <button type="button" class="acc-btn" onClick="{{acc.calc.toggle}}" aria-expanded="{{acc.calc.expanded}}"><span>วิธีคำนวณ</span><span class="sign" style="transform: rotate({{acc.calc.rot}})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></span></button>
          <sc-if value="{{acc.calc.open}}">
            <div class="reveal on acc-body">
              <ul class="formula num">
                <sc-for list="{{cs.formula}}" as="f"><li>{{f}}</li></sc-for>
              </ul>
            </div>
          </sc-if>
        </div>

        <div class="acc">
          <button type="button" class="acc-btn" onClick="{{acc.limits.toggle}}" aria-expanded="{{acc.limits.expanded}}"><span>ข้อจำกัดของข้อมูล</span><span class="sign" style="transform: rotate({{acc.limits.rot}})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></span></button>
          <sc-if value="{{acc.limits.open}}">
            <div class="reveal on acc-body">
              <ul class="limits">
                <sc-for list="{{cs.limits}}" as="l"><li>{{l}}</li></sc-for>
              </ul>
            </div>
          </sc-if>
        </div>

        <div class="acc">
          <button type="button" class="acc-btn" onClick="{{acc.doc.toggle}}" aria-expanded="{{acc.doc.expanded}}"><span>ข้อมูลจากเอกสาร {{cs.file}}</span><span class="sign" style="transform: rotate({{acc.doc.rot}})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></span></button>
          <sc-if value="{{acc.doc.open}}">
            <div class="reveal on acc-body">
              <dl class="doc-summary">
                <dt>เลขที่เอกสาร</dt><dd>{{cs.no}}</dd>
                <dt>ไฟล์</dt><dd>{{cs.file}} 2 หน้า</dd>
                <dt>บริษัท</dt><dd>{{cs.name}}</dd>
                <dt>ปริมาณรับซื้อทั้งหมด</dt><dd>5,000 ตัน</dd>
                <dt>รับซื้อจากพื้นที่นี้</dt><dd>20% = 1,000 ตัน</dd>
                <dt>รหัสพื้นที่</dt><dd>{{cs.code}}</dd>
              </dl>
            </div>
          </sc-if>
        </div>

        <div class="acc">
          <button type="button" class="acc-btn" onClick="{{acc.edits.toggle}}" aria-expanded="{{acc.edits.expanded}}"><span>ประวัติการแก้ไข</span><span class="sign" style="transform: rotate({{acc.edits.rot}})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></span></button>
          <sc-if value="{{acc.edits.open}}">
            <div class="reveal on acc-body">{{editLog}}</div>
          </sc-if>
        </div>
      </div>
    </section>

    <div class="result-actions">
      <button type="button" class="ghost" onClick="{{backToReview}}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M20 12H5"></path><path d="M11 6l-6 6 6 6"></path></svg>
        แก้ไขข้อมูลและคำนวณใหม่
      </button>
      <button type="button" class="ghost" onClick="{{restart}}">ตรวจเอกสารอื่น</button>
    </div>
  </main>
</div>
`;
