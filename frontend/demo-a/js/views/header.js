VIEWS.header = `
<header class="topbar">
  <div class="wrap-wide topbar-inner">
    <button type="button" class="logo" onClick="{{restart}}">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="14.5" ry="6.2" transform="rotate(-35 16 16)" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"></ellipse><path d="M7.5 25.5 C 7.5 14, 14 7, 25.5 6.2 C 25.2 17.5, 18.5 24.6, 7.5 25.5 Z" fill="#9FD27A"></path><path d="M9.5 23.6 L 22.6 9.2" stroke="#283F24" stroke-width="1.5"></path><rect x="10" y="8.4" width="4.6" height="4.6" fill="#FFBF00" stroke="#283F24" stroke-width="1.2"></rect></svg>
      AutoTrace
    </button>

    <ol class="steps" aria-label="ขั้นตอน">
      <sc-for list="{{steps}}" as="st">
        <li data-cur="{{st.cur}}" style="border-bottom-color: {{st.line}}">
          <span class="step-box" style="background: {{st.boxBg}}; color: {{st.boxFg}}; border-color: {{st.boxBorder}}">
            <sc-if value="{{st.done}}">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5"></path></svg>
            </sc-if>
            <sc-if value="{{st.notDone}}">{{st.n}}</sc-if>
          </span>
          <span class="lab" style="color: {{st.labColor}}; font-weight: {{st.labWeight}}">{{st.label}}</span>
        </li>
      </sc-for>
    </ol>
  </div>

  <sc-if value="{{show.result}}">
    <div class="read-progress" aria-hidden="true"></div>
  </sc-if>
</header>
`;
