const STEP_LABELS = ['เลือกเอกสาร', 'ตรวจข้อมูล', 'คำนวณ', 'ผลลัพธ์'];

const RING_TEXT = {
  1: ['อ่านเอกสารเสร็จ', 'ต่อไป ตรวจข้อมูลในเอกสาร'],
  2: ['ตรวจข้อมูลเสร็จ', 'ต่อไป คำนวณจากภาพดาวเทียม'],
  3: ['คำนวณเสร็จ', 'ต่อไป ผลการตรวจสอบ'],
};

// circumference of the ring, 2 * PI * 96
const RING_LENGTH = 603.19;

class App extends TemplateComponent {
  constructor(props) {
    super(props);
    this.view = 'app';
    this.timers = [];
    this.state = this.initialState(props.start, props.caseKey);
  }

  initialState(screen = 'upload', caseKey = 'A') {
    return {
      screen,
      under: null, // page that stays behind the ring overlay
      upload: screen === 'upload' ? 'idle' : 'done',
      caseKey,
      field3Done: false,
      match: 'yes',
      ringStep: 1,
      ringFill: 0,
      ringShown: false,
      tick: 0,
      calcDone: false,
      reveal: false,
      num: 0,
      wipe: 50,
      layer: caseKey === 'A' ? 'burn' : 'after',
      open: { prov: false, calc: false, limits: false, doc: false, edits: false },
    };
  }

  componentDidMount() {
    if (this.state.screen === 'loading') this.runLoading();
    if (this.state.screen === 'result') this.runReveal();
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  clearTimers() {
    this.timers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.timers = [];
  }

  later(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  }

  go(screen) {
    this.setState({ screen, under: null });
    window.scrollTo(0, 0);
    if (screen === 'loading') this.runLoading();
    if (screen === 'result') this.runReveal();
  }

  // show the ring for a bit, then move on to the next page
  showRing(step, next) {
    this.setState({ screen: 'ring', under: this.state.screen, ringStep: step, ringFill: step - 1, ringShown: false });
    this.later(() => this.setState({ ringFill: step, ringShown: true }), 80);
    this.later(() => this.go(next), 2200);
  }

  startUpload(caseKey) {
    if (this.state.upload !== 'idle') return;
    this.setState({ upload: 'starting', caseKey, field3Done: false, layer: caseKey === 'A' ? 'burn' : 'after' });
    // tiny delay so the progress bar starts from 0 and the width transition can play
    this.later(() => this.setState({ upload: 'busy' }), 60);
    this.later(() => this.setState({ upload: 'done' }), 1400);
    this.later(() => this.showRing(1, 'review'), 1900);
  }

  runLoading() {
    this.setState({ tick: 0, calcDone: false });
    [1, 2, 3, 4].forEach((t) => this.later(() => this.setState({ tick: t }), t * 1000));
    this.later(() => this.setState({ calcDone: true }), 4500);
  }

  // count the big number up from 0 with an ease-out curve
  runReveal() {
    this.setState({ reveal: false, num: 0 });
    this.later(() => this.setState({ reveal: true }), 120);
    const target = CASES[this.state.caseKey].score;
    const start = Date.now() + 120;
    const id = setInterval(() => {
      const p = Math.min(1, Math.max(0, (Date.now() - start) / 1400));
      const eased = 1 - Math.pow(1 - p, 4);
      this.setState({ num: target * eased });
      if (p >= 1) clearInterval(id);
    }, 30);
    this.timers.push(id);
  }

  restart() {
    this.clearTimers();
    this.setState(this.initialState('upload'));
  }

  toggle(key) {
    this.setState({ open: { ...this.state.open, [key]: !this.state.open[key] } });
  }

  setWipe(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - box.left) / box.width) * 100;
    this.setState({ wipe: Math.max(0, Math.min(100, percent)) });
  }

  headerSteps() {
    const s = this.state;
    let done;
    let current;
    if (s.screen === 'upload') { done = 0; current = 1; }
    else if (s.screen === 'review') { done = 1; current = 2; }
    else if (s.screen === 'loading') { done = s.calcDone ? 3 : 2; current = s.calcDone ? 4 : 3; }
    else if (s.screen === 'result') { done = 4; current = 0; }
    else { done = s.ringFill; current = Math.min(4, s.ringFill + 1); }

    return STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const isDone = n <= done;
      const isCurrent = n === current && !isDone;
      return {
        label,
        n: String(n),
        done: isDone,
        notDone: !isDone,
        cur: isCurrent ? 'true' : 'false',
        boxBg: isDone ? '#fff' : isCurrent ? 'var(--accent)' : 'transparent',
        boxFg: isDone || isCurrent ? 'var(--brand)' : 'var(--step-off)',
        boxBorder: isDone ? '#fff' : isCurrent ? 'var(--accent)' : 'var(--step-off-border)',
        labColor: isDone || isCurrent ? '#fff' : 'var(--step-off)',
        labWeight: isCurrent ? 700 : 500,
        line: isCurrent ? 'var(--accent)' : 'transparent',
      };
    });
  }

  renderVals() {
    const s = this.state;
    const cs = CASES[s.caseKey];
    const visible = (name) => s.screen === name || (s.screen === 'ring' && s.under === name);
    const busy = s.upload !== 'idle';
    const f3 = s.field3Done;

    const docs = ['A', 'B'].map((key) => {
      const picked = busy && s.caseKey === key;
      return {
        ...CASES[key],
        img: CASES[key].docImg,
        idle: !picked,
        busy: picked,
        border: picked ? 'var(--brand)' : 'var(--line)',
        start: () => this.startUpload(key),
      };
    });

    // review page: field 3 waits for the person to confirm it
    const meter = [1, 2, 3, 4].map((i) => {
      const pending = i === 3 && !f3;
      return {
        bg: pending ? 'var(--warn-soft)' : 'var(--green)',
        border: pending ? 'var(--burn)' : 'var(--green)',
        style: pending ? 'dashed' : 'solid',
      };
    });

    const loadSteps = cs.steps.map(([title, found], i) => {
      const isDone = i < s.tick;
      const isNow = i === s.tick && s.screen === 'loading' && !s.calcDone;
      return {
        title,
        found,
        n: String(i + 1),
        done: isDone,
        now: isNow,
        wait: !isDone && !isNow,
        on: isDone ? 'on' : '',
        status: isDone ? 'เสร็จสิ้น' : isNow ? 'กำลังประมวลผล' : 'รอ',
        opacity: isDone || isNow ? 1 : 0.45,
        notLast: i < cs.steps.length - 1,
        lineBg: isDone ? 'var(--green)' : 'var(--line)',
      };
    });
    const clip = (step) => (s.tick >= step ? '0%' : '100%');

    const cells = [];
    for (let i = 0; i < 100; i++) {
      const burned = i < cs.red;
      cells.push({
        bg: !s.reveal ? 'var(--cell-idle)' : burned ? 'var(--burn)' : 'var(--green)',
        delay: (s.reveal ? i * 11 : 0) + 'ms',
      });
    }

    const resultColor = cs.hasBurn ? 'var(--burn)' : 'var(--green)';
    const chain = cs.chain.map(([label, val, unit, src, kind], i) => {
      const isResult = kind === 'result';
      let valColor = 'var(--ink)';
      if (isResult) valColor = '#fff';
      else if (kind === 'burn') valColor = 'var(--burn)';
      else if (kind === 'clean') valColor = 'var(--green)';
      return {
        label,
        val,
        unit,
        src,
        bg: isResult ? resultColor : '#fff',
        fg: isResult ? '#fff' : 'var(--ink)',
        valColor,
        srcColor: isResult ? 'rgba(255,255,255,0.86)' : 'var(--muted)',
        border: isResult ? resultColor : 'var(--line)',
        arrow: i < cs.chain.length - 1,
        delay: (0.15 + i * 0.12).toFixed(2) + 's',
      };
    });

    const layers = cs.layers.map((layer) => {
      const active = s.layer === layer.id;
      return {
        label: layer.label,
        img: layer.img,
        op: active ? 1 : 0,
        pressed: active ? 'true' : 'false',
        bg: active ? 'var(--brand)' : '#fff',
        fg: active ? '#fff' : 'var(--brand)',
        pick: () => this.setState({ layer: layer.id }),
      };
    });
    const shownLayer = cs.layers.find((layer) => layer.id === s.layer) || cs.layers[0];

    const acc = {};
    Object.keys(s.open).forEach((key) => {
      const open = s.open[key];
      acc[key] = {
        open,
        closed: !open,
        expanded: open ? 'true' : 'false',
        rot: open ? '45deg' : '0deg',
        toggle: () => this.toggle(key),
      };
    });

    const choice = (value) => {
      const on = s.match === value;
      return {
        bg: on ? 'var(--brand)' : '#fff',
        fg: on ? '#fff' : 'var(--ink)',
        pressed: on ? 'true' : 'false',
        pick: () => this.setState({ match: value }),
      };
    };

    // show "0%" instead of "0.0%" when the score is a whole number
    const numText = Number.isInteger(cs.score) && s.num === cs.score ? String(cs.score) : s.num.toFixed(1);
    const ringCopy = RING_TEXT[s.ringStep];

    return {
      cs,
      steps: this.headerSteps(),
      show: {
        upload: visible('upload'),
        review: visible('review'),
        loading: visible('loading'),
        result: visible('result'),
        ring: s.screen === 'ring',
      },
      restart: () => this.restart(),

      // select page
      docs,
      startA: () => this.startUpload('A'),
      upWidth: s.upload === 'busy' || s.upload === 'done' ? '100%' : '0%',
      upDone: s.upload === 'done',
      upNote: s.upload === 'done' ? 'อ่านเอกสารแล้ว' : 'กำลังอ่านเอกสาร',

      // review page
      okCount: String(f3 ? 4 : 3),
      meter,
      pending3: !f3,
      done3: f3,
      f3bg: f3 ? 'transparent' : 'var(--warn-soft)',
      f3outline: f3 ? '2px solid transparent' : '2px dashed var(--burn)',
      f3mark: f3 ? 'var(--brand)' : 'var(--burn)',
      box3border: f3 ? 'solid' : 'dashed',
      box3color: f3 ? 'var(--ink)' : 'var(--burn)',
      box3bg: f3 ? 'rgba(0,0,0,0.04)' : 'var(--warn-soft)',
      confirm3: () => this.setState({ field3Done: true }),
      matchYes: choice('yes'),
      matchNo: choice('no'),
      confirm: () => this.showRing(2, 'loading'),

      // loading page
      t: String(s.tick),
      pct: String(s.tick * 25),
      loadTitle: s.calcDone || s.tick >= 4 ? 'คำนวณเสร็จสิ้น' : 'กำลังคำนวณ',
      loadWidth: s.tick * 25 + '%',
      loadSteps,
      load1: cs.loads[0],
      load2: cs.loads[1],
      load3: cs.loads[2],
      clip1: clip(1),
      clip2: clip(2),
      clip3: clip(3),
      mapStage: cs.stages[s.tick] || cs.stages[4],
      scanning: s.tick < 4 && s.screen === 'loading',
      chipOn: s.tick >= 3 ? 'on' : '',
      chipBg: resultColor,
      loadDone: s.screen === 'loading' && s.calcDone,
      seeResult: () => this.showRing(3, 'result'),

      // result page
      num: numText + '%',
      numColor: resultColor,
      revealOn: s.reveal ? 'on' : '',
      verdictTint: cs.hasBurn ? 'var(--burn-tint)' : 'var(--clean-tint)',
      verdictInk: cs.hasBurn ? 'var(--burn-ink)' : 'var(--clean-ink)',
      cells,
      chain,
      layers,
      multiLayer: cs.layers.length > 1,
      rightTag: shownLayer.tag,
      wipe: Math.round(s.wipe),
      wipePct: s.wipe.toFixed(1) + '%',
      wipeDown: (e) => {
        this.dragging = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        this.setWipe(e);
      },
      wipeMove: (e) => {
        if (this.dragging) this.setWipe(e);
      },
      wipeUp: () => {
        this.dragging = false;
      },
      wipeRange: (e) => this.setState({ wipe: Number(e.target.value) }),
      eqR: s.reveal ? cs.eq[0] : '0px',
      eqC: s.reveal ? cs.eq[1] : '0px',
      eqB: s.reveal ? cs.eq[2] : '0px',
      acc,
      editLog: f3 ? 'ช่อง 3 สัดส่วนที่รับซื้อ ผู้ตรวจยืนยันค่าเดิม 20% = 1,000 ตัน' : 'ยังไม่มีการแก้ไขข้อมูล',
      backToReview: () => {
        this.clearTimers();
        this.setState({ open: this.initialState().open, reveal: false });
        this.go('review');
      },

      // ring overlay
      ringText: s.ringStep + '/3',
      ringOffset: (RING_LENGTH * (1 - Math.max(0.0001, s.ringFill / 3))).toFixed(2) + 'px',
      ringOn: s.ringShown ? 'on' : '',
      ringLabel: ringCopy[0],
      ringNext: s.ringStep === 3 ? ringCopy[1] + cs.name : ringCopy[1],
      ringDots: [1, 2, 3].map((i) => ({ bg: i <= s.ringFill ? 'var(--accent)' : 'rgba(255,255,255,0.18)' })),
    };
  }
}
