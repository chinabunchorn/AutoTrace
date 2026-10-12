VIEWS.review = `
<div class="screen review-screen">
  <main class="wrap-wide review-main">
    <div class="review-head">
      <div class="title-block">
        <h1 class="page-title">ตรวจสอบและแก้ไขข้อมูล</h1>
        <p class="page-sub">{{cs.no}} {{cs.name}} ข้อมูลที่ยืนยันแล้วจะใช้ในการคำนวณ</p>
      </div>
      <div class="match-count">
        <span class="meter" aria-hidden="true">
          <sc-for list="{{meter}}" as="m">
            <span class="meter-seg" style="background: {{m.bg}}; border-style: {{m.style}}; border-color: {{m.border}}"></span>
          </sc-for>
        </span>
        <span>ตรงกับเอกสาร <strong class="num">{{okCount}}/4</strong> ช่อง</span>
        <sc-if value="{{pending3}}"><strong class="warn-text">รอยืนยัน 1 ช่อง</strong></sc-if>
      </div>
    </div>

    <div class="g2 review-grid">
      <section class="panel">
        <div class="panel-head">
          <h2>ข้อมูลจากเอกสาร</h2>
          <span class="panel-meta">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M14 3H6v18h12V7z"></path><path d="M14 3v4h4"></path></svg>
            {{cs.file}}
          </span>
        </div>

        <div class="g2 doc-check">
          <div class="page-preview">
            <div class="mini-page-frame">
              <div class="mini-page">
                <div class="ln" style="width: 55%; height: 7px"></div>
                <div class="mark-box"><span>1</span>{{cs.name}}</div>
                <div class="ln" style="width: 90%"></div>
                <div class="ln" style="width: 75%"></div>
                <div class="mark-box"><span>2</span>5,000 t</div>
                <div class="ln" style="width: 85%"></div>
                <div class="mark-box" style="border-style: {{box3border}}; border-color: {{box3color}}; background: {{box3bg}}"><span>3</span>20% = 1,000 t</div>
                <div class="ln" style="width: 70%"></div>
                <div class="mark-box"><span>4</span>{{cs.code}}</div>
                <div class="ln" style="width: 80%"></div>
                <div class="ln" style="width: 60%"></div>
              </div>
            </div>
            <div class="page-count num">หน้า 1 จาก 2</div>
          </div>

          <div class="fields">
            <label class="field">
              <span class="field-label"><span class="field-no">1</span>บริษัท</span>
              <input type="text" class="input" defaultValue="{{cs.name}}">
              <span class="ok-note"><span class="tick"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5"></path></svg></span>ตรงกับเอกสาร หน้า 1</span>
            </label>

            <label class="field">
              <span class="field-label"><span class="field-no">2</span>ปริมาณรับซื้อทั้งหมด (ตัน)</span>
              <input type="text" class="input" defaultValue="5,000">
              <span class="ok-note"><span class="tick"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5"></path></svg></span>ตรงกับเอกสาร หน้า 1</span>
            </label>

            <!-- field 3 is the one the reader wasn't sure about, the person has to confirm it -->
            <div class="field field-check" style="background: {{f3bg}}; outline: {{f3outline}}">
              <span class="field-label"><span class="field-no" style="background: {{f3mark}}">3</span>สัดส่วนที่รับซื้อจากพื้นที่นี้</span>
              <span class="share-inputs">
                <input type="text" class="input" defaultValue="20" aria-label="เปอร์เซ็นต์">
                <span>% =</span>
                <input type="text" class="input" defaultValue="1,000" aria-label="ตัน">
                <span>ตัน</span>
              </span>
              <sc-if value="{{pending3}}">
                <span class="pending-note">
                  <span class="warn-text">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 3L2 21h20z"></path><path d="M12 10v5"></path><path d="M12 17.5v.5"></path></svg>
                    ความมั่นใจต่ำ ตรวจกับเอกสารหน้า 1
                  </span>
                  <button type="button" class="ghost small" onClick="{{confirm3}}">ยืนยันค่านี้</button>
                </span>
              </sc-if>
              <sc-if value="{{done3}}">
                <span class="ok-note"><span class="tick"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5"></path></svg></span>ยืนยันโดยผู้ตรวจ ตรงกับเอกสาร หน้า 1</span>
              </sc-if>
            </div>

            <label class="field">
              <span class="field-label"><span class="field-no">4</span>รหัสพื้นที่</span>
              <input type="text" class="input" defaultValue="{{cs.codeArea}}">
              <span class="ok-note"><span class="tick"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5"></path></svg></span>ตรงกับเอกสาร หน้า 1</span>
            </label>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>ขอบเขตพื้นที่</h2>
          <span class="panel-meta">{{cs.mapDate}}</span>
        </div>

        <div class="map">
          <img src="{{cs.mapImg}}" alt="ภาพดาวเทียมของพื้นที่ {{cs.area}}">
          <sc-for list="{{cs.handles}}" as="h">
            <div class="map-handle" style="left: {{h.x}}; top: {{h.y}}"></div>
          </sc-for>
          <div class="map-tag" style="left: {{cs.tagX}}; top: {{cs.tagY}}">
            <div class="map-tag-name">{{cs.area}}</div>
            <div class="map-tag-size num">{{cs.rai}} ไร่</div>
          </div>
          <div class="map-tools" role="toolbar" aria-label="เครื่องมือขอบเขต">
            <button type="button" class="tool active" aria-label="ปรับจุดมุม">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M4 9V4h5"></path><path d="M15 4h5v5"></path><path d="M20 15v5h-5"></path><path d="M9 20H4v-5"></path></svg>
              ปรับจุดมุม
            </button>
            <button type="button" class="tool" aria-label="วาดขอบเขตใหม่">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z"></path><path d="M14 6l3 3"></path></svg>
              วาดใหม่
            </button>
          </div>
        </div>

        <div class="map-body">
          <p class="map-note">{{cs.mapNote}}</p>

          <div class="g3 coords">
            <label class="field">
              <span class="coord-label">ละติจูด</span>
              <input type="text" class="input" defaultValue="{{cs.lat}}">
            </label>
            <label class="field">
              <span class="coord-label">ลองจิจูด</span>
              <input type="text" class="input" defaultValue="{{cs.lon}}">
            </label>
            <div class="field">
              <div class="coord-label">ขนาดพื้นที่</div>
              <div class="area-size num">{{cs.rai}} <span class="unit">ไร่</span> <span class="km">{{cs.km}} km²</span></div>
            </div>
          </div>

          <div class="match-choice" role="radiogroup" aria-label="ขอบเขตตรงกับพื้นที่ในเอกสาร">
            <span class="match-choice-title">ขอบเขตตรงกับพื้นที่ในเอกสาร</span>
            <div class="choice-row">
              <button type="button" class="choice" role="radio" aria-checked="{{matchYes.pressed}}" onClick="{{matchYes.pick}}" style="background: {{matchYes.bg}}; color: {{matchYes.fg}}">ตรง ใช้ขอบเขตนี้</button>
              <button type="button" class="choice" role="radio" aria-checked="{{matchNo.pressed}}" onClick="{{matchNo.pick}}" style="background: {{matchNo.bg}}; color: {{matchNo.fg}}">ไม่ตรง ต้องแก้ไข</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="review-actions">
      <button type="button" class="ghost" onClick="{{restart}}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M20 12H5"></path><path d="M11 6l-6 6 6 6"></path></svg>
        ย้อนกลับ
      </button>
      <div class="review-actions-next">
        <span class="muted num">รับซื้อ 1,000 ตัน จาก {{cs.area}} ({{cs.rai}} ไร่)</span>
        <button type="button" class="cta" onClick="{{confirm}}">
          ยืนยันข้อมูลและเริ่มคำนวณ
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path></svg>
        </button>
      </div>
    </div>
  </main>
</div>
`;
