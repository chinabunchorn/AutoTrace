VIEWS.loading = `
<div class="screen">
  <main class="wrap-wide g2 loading-main">
    <section class="loading-side">
      <div class="title-block">
        <h1 class="page-title">{{loadTitle}}</h1>
        <p class="loading-sub">{{cs.name}} ซื้อ 1,000 ตัน จาก {{cs.area}}</p>
      </div>

      <div class="load-progress">
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow="{{t}}" aria-label="ความคืบหน้าการคำนวณ">
          <div class="bar-fill fill" style="width: {{loadWidth}}"></div>
        </div>
        <div class="load-count num"><span>{{t}} จาก 4 ขั้นตอน</span><span>{{pct}}%</span></div>
      </div>

      <ol class="load-steps">
        <sc-for list="{{loadSteps}}" as="s">
          <li style="opacity: {{s.opacity}}">
            <div class="step-rail">
              <sc-if value="{{s.done}}">
                <span class="step-mark done"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 8.5l3 3L13 4.5"></path></svg></span>
              </sc-if>
              <sc-if value="{{s.now}}">
                <span class="step-mark now"><span class="pulse"></span></span>
              </sc-if>
              <sc-if value="{{s.wait}}">
                <span class="step-mark wait">{{s.n}}</span>
              </sc-if>
              <sc-if value="{{s.notLast}}">
                <div class="step-line" style="background: {{s.lineBg}}"></div>
              </sc-if>
            </div>
            <div class="step-text">
              <div class="step-title">{{s.title}}</div>
              <div class="reveal {{s.on}} step-found num">{{s.found}}</div>
            </div>
            <span class="step-status">{{s.status}}</span>
          </li>
        </sc-for>
      </ol>

      <sc-if value="{{loadDone}}">
        <div class="reveal on">
          <button type="button" class="cta big" onClick="{{seeResult}}">
            ดูผลการตรวจสอบ
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path></svg>
          </button>
        </div>
      </sc-if>
    </section>

    <figure class="map-card">
      <div class="map-stage">
        <div class="map-wait">กำลังดึงภาพดาวเทียม</div>
        <!-- three layers stacked on top of each other, each one wipes in from the left -->
        <img class="layer" src="{{load1}}" alt="ภาพดาวเทียมของพื้นที่ที่ซื้อ" style="clip-path: inset(0 {{clip1}} 0 0)">
        <img class="layer" src="{{load2}}" alt="ชั้นแปลงข้าวโพด" style="clip-path: inset(0 {{clip2}} 0 0)">
        <img class="layer" src="{{load3}}" alt="ชั้นพื้นที่ที่อาจถูกเผา" style="clip-path: inset(0 {{clip3}} 0 0)">
        <sc-if value="{{scanning}}"><div class="scan"></div></sc-if>
        <div class="map-stage-label">{{mapStage}}</div>
        <div class="reveal {{chipOn}} burn-chip" style="background: {{chipBg}}">
          <div class="burn-chip-value num">{{cs.burnPct}}</div>
          <div class="burn-chip-text">ของผลผลิตอยู่ในพื้นที่ที่อาจถูกเผา</div>
        </div>
      </div>

      <sc-if value="{{cs.legend}}">
        <div class="map-legend">
          <span><span class="key boundary"></span>ขอบเขตจากเอกสาร</span>
          <span><span class="key maize"></span>แปลงข้าวโพด GISTDA</span>
          <span><span class="key burn"></span>พื้นที่ที่อาจถูกเผา</span>
        </div>
      </sc-if>
      <figcaption class="map-caption">{{cs.loadCaption}}</figcaption>
    </figure>
  </main>
</div>
`;
