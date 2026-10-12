VIEWS.select = `
<div class="screen">
  <section class="hero">
    <div class="wrap-wide hero-inner">
      <div class="hero-text">
        <h1><span class="nw">ระบบการตรวจสอบการรับรอง</span> <span class="nw">“ปลอดการเผา 100%”</span></h1>
        <p>ตรวจสอบแหล่งที่มาของวัตถุดิบจากเอกสารรับซื้อข้าวโพด และประเมินความเสี่ยงการเผาในพื้นที่ด้วยข้อมูลภาพถ่ายดาวเทียม</p>
      </div>

      <div class="pipe-grid" role="img" aria-label="ขั้นตอนการตรวจ อ่านเอกสาร หาแปลงข้าวโพดในขอบเขต และตรวจพื้นที่ที่อาจถูกเผา">
        <div class="pipe pipe-pic doc-pic first">
          <img src="images/doc-area1.svg" alt="">
        </div>
        <div class="pipe pipe-cap first">
          <span class="pipe-num">1</span>
          <span class="pipe-title"><span class="swatch doc"></span>อ่านเอกสารรับซื้อ</span>
          <span class="pipe-note">ดึงปริมาณ สัดส่วน และรหัสพื้นที่จาก PDF</span>
        </div>
        <div class="pipe-link pipe-arrow first" aria-hidden="true">
          <svg width="92" height="36" viewBox="0 0 92 36" fill="none"><path class="trace" d="M4 18 H66" stroke="#FFBF00" stroke-width="4"></path><path d="M62 4 L88 18 L62 32 Z" fill="#FFBF00"></path></svg>
        </div>

        <div class="pipe pipe-pic second">
          <img src="images/fields-maize.svg" alt="">
        </div>
        <div class="pipe pipe-cap second">
          <span class="pipe-num">2</span>
          <span class="pipe-title"><span class="swatch maize"></span>หาแปลงข้าวโพดในขอบเขต</span>
          <span class="pipe-note">ขอบเขตจากรหัสพื้นที่ ซ้อนกับแปลงข้าวโพด GISTDA</span>
        </div>
        <div class="pipe-link pipe-arrow second" aria-hidden="true">
          <svg width="92" height="36" viewBox="0 0 92 36" fill="none"><path class="trace" d="M4 18 H66" stroke="#FFBF00" stroke-width="4"></path><path d="M62 4 L88 18 L62 32 Z" fill="#FFBF00"></path></svg>
        </div>

        <div class="pipe pipe-pic third">
          <img src="images/fields-burn.svg" alt="">
        </div>
        <div class="pipe pipe-cap third">
          <span class="pipe-num">3</span>
          <span class="pipe-title"><span class="swatch burn"></span>ตรวจพื้นที่ที่อาจถูกเผา</span>
          <span class="pipe-note">เทียบภาพดาวเทียมก่อนและหลังฤดูเผา แล้วคำนวณสัดส่วนขั้นต่ำ</span>
        </div>
      </div>
    </div>
  </section>

  <main class="wrap-wide select-main">
    <section class="sr samples">
      <h2 class="section-title">เอกสารตัวอย่าง</h2>
      <div class="g2 doc-cards">
        <sc-for list="{{docs}}" as="d">
          <article class="card doc-card" style="border-color: {{d.border}}">
            <div class="doc-thumb">
              <img class="art" src="{{d.img}}" alt="ตัวอย่างหน้าเอกสาร {{d.no}}">
              <div class="doc-pin num">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M12 21s-6-6.5-6-11a6 6 0 0 1 12 0c0 4.5-6 11-6 11z"></path><circle cx="12" cy="10" r="2"></circle></svg>
                {{d.area}} {{d.lat}}°N {{d.lon}}°E
              </div>
            </div>

            <div class="doc-body">
              <div class="doc-head">
                <h3>{{d.name}}</h3>
                <span class="doc-no num">{{d.no}}</span>
              </div>
              <dl class="doc-facts">
                <dt>ไฟล์</dt>
                <dd class="with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M14 3H6v18h12V7z"></path><path d="M14 3v4h4"></path></svg>
                  {{d.file}}
                </dd>
                <dt>ปริมาณรับซื้อ</dt>
                <dd class="num">1,000 ตัน <span class="muted">จาก 5,000 ตัน (20%)</span></dd>
                <dt>แหล่งที่มา</dt>
                <dd>{{d.area}} <span class="muted">{{d.code}}</span></dd>
                <dt>การรับรอง</dt>
                <dd><span class="claim">“ปลอดการเผา 100%”</span></dd>
              </dl>

              <div class="doc-action">
                <sc-if value="{{d.idle}}">
                  <button type="button" class="ghost full" onClick="{{d.start}}">ตรวจสอบเอกสารนี้</button>
                </sc-if>
                <sc-if value="{{d.busy}}">
                  <div class="upload-progress">
                    <div class="upload-progress-head">
                      <span>{{upNote}}</span>
                      <sc-if value="{{upDone}}">
                        <span class="ok"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 8.5l3 3L13 4.5"></path></svg></span>
                      </sc-if>
                    </div>
                    <div class="bar"><div class="bar-fill upfill" style="width: {{upWidth}}"></div></div>
                  </div>
                </sc-if>
              </div>
            </div>
          </article>
        </sc-for>
      </div>
    </section>

    <div class="sr">
      <div class="dropzone">
        <span class="dropzone-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M14 3H6v18h12V7z"></path><path d="M14 3v4h4"></path><path d="M12 17v-6"></path><path d="M9 13l3-3 3 3"></path></svg></span>
        <span class="dropzone-text"><strong>อัปโหลดเอกสารรับซื้อ</strong> <span class="muted">ลากไฟล์ PDF มาวางที่นี่</span></span>
        <button type="button" class="ghost" onClick="{{startA}}">เลือกไฟล์</button>
      </div>
    </div>

    <section class="sr history">
      <h2 class="section-title">ประวัติการตรวจสอบ</h2>
      <div class="table-scroll">
        <table class="history-table">
          <thead>
            <tr><th>เลขที่เอกสาร</th><th>บริษัท</th><th>แหล่งที่มา</th><th>มาจากแปลงเผาขั้นต่ำ</th><th>สถานะ</th><th>วันที่ตรวจ</th></tr>
          </thead>
          <tbody>
            <tr class="row">
              <td class="num">PR-2026-0418</td>
              <td class="company">โรงงาน A</td>
              <td>Area-1</td>
              <td class="num"><span class="mini-bar" aria-hidden="true"><span class="burn" style="width: 73.5%"></span></span><strong class="score burn">73.5%</strong></td>
              <td><span class="tag burn">ต้องตรวจสอบเพิ่ม</span></td>
              <td class="muted">10 ต.ค. 2026</td>
            </tr>
            <tr class="row">
              <td class="num">PR-2026-0522</td>
              <td class="company">โรงงาน B</td>
              <td>Area-2</td>
              <td class="num"><span class="mini-bar" aria-hidden="true"><span class="clean" style="width: 0%"></span></span><strong class="score clean">0%</strong></td>
              <td><span class="tag clean">ไม่พบข้อขัดแย้ง</span></td>
              <td class="muted">10 ต.ค. 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</div>
`;
