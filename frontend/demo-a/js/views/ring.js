VIEWS.ring = `
<div class="overlay ring-overlay" role="status" aria-live="polite">
  <div class="ring-box">
    <div class="ring">
      <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="14"></circle>
        <circle class="arc" cx="110" cy="110" r="96" fill="none" stroke="#FFBF00" stroke-width="14" stroke-dasharray="603.19" style="stroke-dashoffset: {{ringOffset}}"></circle>
      </svg>
      <div class="ring-text num">{{ringText}}</div>
    </div>
    <div class="reveal {{ringOn}} ring-label">
      <span class="ring-check"><svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3 3L13 4.5"></path></svg></span>
      {{ringLabel}}
    </div>
    <div class="reveal {{ringOn}} ring-next">{{ringNext}}</div>
    <div class="ring-dots">
      <sc-for list="{{ringDots}}" as="d">
        <div style="background: {{d.bg}}"></div>
      </sc-for>
    </div>
  </div>
</div>
`;
