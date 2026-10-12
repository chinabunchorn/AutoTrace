#!/usr/bin/env node
// Desktop/Mac seven-beat concept presentation only. No product/application acceptance claims.
// Node 26 built-ins only; the caller supplies an already-running Chromium/CDP.
import { mkdir, writeFile } from 'node:fs/promises';

const defaults = {
  cdp: 'http://127.0.0.1:9229',
  url: 'http://127.0.0.1:8772/pitch/index.html',
  out: 'outputs/pitch-review',
};
const usage = 'node scripts/test_pitch_review.mjs --cdp http://127.0.0.1:9229 --url http://127.0.0.1:8772/pitch/index.html --out outputs/pitch-review [--section name]';
function parseArgs(args) {
  const options = { ...defaults };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (key === '--help' || key === '-h') { console.log(usage); return null; }
    if (!['--cdp', '--url', '--out', '--section'].includes(key) || !args[i + 1] || args[i + 1].startsWith('--')) {
      throw new Error(`Invalid argument: ${key}. Usage: ${usage}`);
    }
    options[key.slice(2)] = args[++i];
  }
  for (const name of ['cdp', 'url']) {
    const url = new URL(options[name]);
    if (!['http:', 'https:'].includes(url.protocol) || !isLoopback(url.hostname) || url.username || url.password) {
      throw new Error(`${name} must be an HTTP(S) loopback URL without credentials`);
    }
  }
  return options;
}
function isLoopback(host) {
  host = host.toLowerCase().replace(/^\[|\]$/g, '');
  return host === 'localhost' || host === '::1' || /^127(?:\.\d{1,3}){3}$/.test(host);
}
function allowedRequest(raw) {
  try {
    const url = new URL(raw);
    return ['data:', 'file:'].includes(url.protocol)
      || (['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol) && isLoopback(url.hostname))
      || raw === 'about:blank';
  } catch { return false; }
}
// Never save headers, request bodies, credentials, fragments, data payloads or query values.
function safeURL(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol === 'data:') return `data:${raw.slice(5).split(/[;,]/)[0]}[payload omitted]`;
    url.username = ''; url.password = ''; url.hash = '';
    for (const key of new Set(url.searchParams.keys())) url.searchParams.set(key, '[redacted]');
    return url.href;
  } catch { return '[unparseable URL omitted]'; }
}
function safeText(raw) {
  return String(raw).replace(/(?:https?|wss?|file|data):[^\s"'<>]+/g, safeURL)
    .replace(/\b(token|password|secret|api[_-]?key|authorization)\s*[:=]\s*[^\s,;]+/gi, '$1=[redacted]');
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CDP {
  constructor(socket) {
    this.socket = socket;
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener('message', event => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        clearTimeout(pending.timer); this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result ?? {});
      } else {
        for (const handler of this.listeners.get(message.method) ?? []) handler(message.params ?? {});
      }
    });
    socket.addEventListener('close', () => this.failPending(new Error('CDP WebSocket closed')));
    socket.addEventListener('error', () => this.failPending(new Error('CDP WebSocket error')));
  }
  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { socket.close(); reject(new Error('CDP WebSocket open timed out (10s)')); }, 10000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Cannot open CDP WebSocket')); }, { once: true });
    });
    return new CDP(socket);
  }
  on(method, handler) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(handler);
  }
  send(method, params = {}, timeout = 12000) {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState !== WebSocket.OPEN) return reject(new Error('CDP socket is not open'));
      const id = ++this.sequence;
      const timer = setTimeout(() => {
        this.pending.delete(id); reject(new Error(`${method} timed out after ${timeout}ms`));
      }, timeout);
      this.pending.set(id, { resolve, reject, timer, method });
      try { this.socket.send(JSON.stringify({ id, method, params })); }
      catch (error) { clearTimeout(timer); this.pending.delete(id); reject(error); }
    });
  }
  failPending(error) {
    for (const entry of this.pending.values()) { clearTimeout(entry.timer); entry.reject(error); }
    this.pending.clear();
  }
  close() { this.failPending(new Error('CDP session finished')); this.socket.close(); }
}

async function main(options) {
  const started = Date.now();
  const report = {
    scope: 'Desktop/Mac seven-beat concept presentation, including symbolic workflow/supply explanation; no actual extraction, evidence matching, confirmations, calculations or application handoff.',
    target: safeURL(options.url), cdp: safeURL(options.cdp),
    startedAt: new Date(started).toISOString(),
    notes: [
      'Hold/no-autoplay checks observe a bounded 1200ms interval; they do not prove indefinite stability.',
      'WebGL driver strings may describe SwiftShader/headless software rendering. These are not actual Mac GPU performance measurements.',
      'External requests are intercepted before navigation and blocked. Network query values, fragments, credentials and payloads are omitted.',
      'Screenshots depict seven illustrative story beats, with eight presenter-controlled conceptual reveals in Beat 7. Mobile-specific work is outside the current presentation scope.',
    ],
    checks: [], evidence: [], runtimeMessages: [], networkRequests: [], fatalErrors: [],
  };
  let client, targetId, factoryReference;
  const interceptionJobs = new Set();
  let currentRun = 'setup';
  const allSections = ['normal motion controls and seeks', 'Beat 3 question reveal', 'Beat 4 factory descent', 'Beat 5 supplier arrivals', 'Beat 6 check question', 'Beat 7 evidence reveals', 'desktop overflow', 'reduced motion', 'flat fallback'];
  if(options.section&&!allSections.includes(options.section))throw new Error('Unknown QA section');
  const expectedSections = options.section ? [options.section] : allSections;
  report.sections=expectedSections;
  const completedSections = new Set();
  function record(name, pass, details = {}) {
    report.checks.push({ name, pass: Boolean(pass), run: currentRun, details });
    console.error(`${pass ? 'PASS' : 'FAIL'} ${name}`);
  }
  function assert(name, condition, details) { record(name, condition, details); }
  async function evaluate(expression, timeout = 12000) {
    const response = await client.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true, userGesture: true,
    }, timeout);
    if (response.exceptionDetails) throw new Error(safeText(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text));
    return response.result?.value;
  }
  async function state() {
    const value = await evaluate('window.pitchReview.state()');
    if (!value || typeof value !== 'object') throw new Error('pitchReview.state() did not return an object');
    return value;
  }
  function stateMatches(actual, expected) {
    return Object.entries(expected).every(([key, value]) => key === 'progress'
      ? typeof actual[key] === 'number' && Math.abs(actual[key] - value) < 1e-7 : actual[key] === value);
  }
  async function expectState(name, expected) {
    const actual = await state();
    assert(name, stateMatches(actual, expected), { expected, actual });
    return actual;
  }
  async function frames() {
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))', 5000);
  }
  async function seek(scene, progress, step=0) {
    await evaluate(`window.pitchReview.seek(${JSON.stringify(scene)},${progress},${step})`);
    await frames();
    return state();
  }
  async function click(id) {
    // Clean presentation: Next is a stage click; return/reset are keyboard inputs.
    if(id==='previous'||id==='restart'){
      const key=id==='previous'?'ArrowLeft':'r',code=id==='previous'?'ArrowLeft':'KeyR';
      await client.send('Input.dispatchKeyEvent',{type:'keyDown',key,code});
      await client.send('Input.dispatchKeyEvent',{type:'keyUp',key,code});return;
    }
    const box = await evaluate(`(() => {
      const el = document.getElementById('stage');
      if (!el) throw new Error('Missing stage');
      const r = el.getBoundingClientRect();
      return {x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height,disabled:el.disabled};
    })()`);
    if (!box.width || !box.height || box.disabled) throw new Error(`Button ${id} is not clickable`);
    await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
    await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  }
  async function stable(name, expected) {
    const before = await state();
    await sleep(1200);
    const after = await state();
    const keys = ['phase', 'month', 'renderer', 'busy', 'scene', 'progress', 'evidenceStep', 'reveal'];
    assert(name, stateMatches(before, expected) && stateMatches(after, expected)
      && keys.every(key => before[key] === after[key]), { observationMs: 1200, before, after, expected });
  }
  async function poll(expression, timeout = 20000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      try {
        if (await evaluate(expression, Math.min(5000, Math.max(100, deadline - Date.now())))) return;
      } catch (error) {
        // Navigation may replace the default execution context during readiness polling.
        if (!/execution context|cannot find context|inspected target navigated/i.test(error.message)) throw error;
      }
      await sleep(80);
    }
    throw new Error(`Page readiness timed out after ${timeout}ms`);
  }
  async function navigate(url, run) {
    currentRun = run;
    const navigation = await client.send('Page.navigate', { url }, 20000);
    if (navigation.errorText) throw new Error(`Navigation failed: ${navigation.errorText}`);
    await poll(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete'
      && typeof window.pitchReview?.seek === 'function' && typeof window.pitchReview?.state === 'function'`);
    await evaluate('document.fonts.ready.then(() => true)', 20000);
    await frames();
    const contract = await evaluate(`(() => ({
      controller: ['next','previous','restart','seek','state'].map(name => ({name,exists:typeof window.pitchReview[name]==='function'})),
      stage: !!document.querySelector('#stage'), fonts: document.fonts.status,
      state: window.pitchReview.state(), userAgent: navigator.userAgent
    }))()`);
    const s = contract.state;
    assert(`${run}: UI contract`, contract.stage && contract.fonts === 'loaded'
      && contract.controller.every(c => c.exists)
      && ['phase', 'month', 'renderer', 'busy', 'scene', 'progress'].every(key => key in s)
      && ['webgl','flat','svg','html'].includes(s.renderer) && typeof s.busy === 'boolean'
      && ['city','region','question','factory','suppliers','check','evidence'].includes(s.scene) && Number.isFinite(s.progress) && s.progress >= 0 && s.progress <= 1,
    contract);
    return s;
  }
  async function screenshot(filename, expectedRenderer) {
    await evaluate('document.fonts.ready.then(() => true)');
    await frames();
    const actual = await state();
    const renderInfo = await evaluate(`(() => {
      const stage = document.querySelector('#stage');
      const rect = stage?.getBoundingClientRect();
      const canvases = [...(stage || document).querySelectorAll('canvas')].map(canvas => {
        const result = {id:canvas.id,width:canvas.width,height:canvas.height,visible:!!(canvas.getBoundingClientRect().width && canvas.getBoundingClientRect().height)&&getComputedStyle(canvas).visibility!=='hidden'};
        // Do not initialize the lazy factory context just to inspect another scene.
        if(!result.visible||(canvas.id==='factory-canvas'&&!(stage.dataset.scene==='factory'||stage.dataset.scene==='suppliers'&&stage.dataset.renderer!=='svg')))return result;
        // Existing WebGL canvases return their context; incompatible context types return null.
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return result;
        const debug = gl.getExtension('WEBGL_debug_renderer_info');
        return {...result,webgl:true,contextLost:gl.isContextLost(),version:gl.getParameter(gl.VERSION),
          vendor:gl.getParameter(gl.VENDOR),renderer:gl.getParameter(gl.RENDERER),
          unmaskedRenderer:debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null};
      });
      return {viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
        stage:rect ? {x:rect.x,y:rect.y,width:rect.width,height:rect.height} : null,canvases,
        svg:['suppliers','check'].includes(stage.dataset.scene)&&document.getElementById('supply-map') instanceof SVGSVGElement&&Number(getComputedStyle(document.getElementById('supply-scene')).opacity)===1,
        html:stage.dataset.scene==='evidence'?document.getElementById('evidence-scene') instanceof HTMLElement&&getComputedStyle(document.getElementById('evidence-scene')).visibility==='visible'&&Number(getComputedStyle(document.getElementById('evidence-body')).opacity)>0:stage.dataset.scene==='check'&&document.getElementById('check-backdrop') instanceof HTMLElement&&Number(getComputedStyle(document.getElementById('check-backdrop')).opacity)===1&&Number(getComputedStyle(document.querySelector('.caption')).opacity)>0};
    })()`);
    const hasContext = renderInfo.canvases.some(c => c.id===(['factory','suppliers'].includes(actual.scene)?'factory-canvas':'terrain')&&c.webgl && !c.contextLost && c.visible && c.width > 0 && c.height > 0);
    assert(`${filename}: actual renderer ${expectedRenderer}`, actual.renderer === expectedRenderer
      && (expectedRenderer !== 'webgl' || hasContext)&&(expectedRenderer!=='svg'||renderInfo.svg)&&(expectedRenderer!=='html'||renderInfo.html), { actual, renderInfo });
    const image = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }, 20000);
    const path = `${options.out.replace(/\/$/, '')}/${filename}`;
    const buffer = Buffer.from(image.data, 'base64');
    if (buffer.length < 8 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Invalid PNG response');
    await writeFile(path, buffer);
    report.evidence.push({ path, bytes: buffer.length, run: currentRun, state: actual, renderInfo });
  }
  async function section(name, work) {
    if(options.section&&options.section!==name)return;
    try { await work(); }
    catch (error) { record(name, false, { error: safeText(error.stack ?? error) }); }
    finally { completedSections.add(name); }
  }
  async function viewport(width, height, mobile = false) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    await frames();
  }
  try {
    await mkdir(options.out, { recursive: true });
    const endpoint = new URL('/json/new?about:blank', options.cdp);
    const response = await fetch(endpoint, { method: 'PUT', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Chromium /json/new returned HTTP ${response.status}`);
    const target = await response.json();
    if (!target.webSocketDebuggerUrl || !target.id) throw new Error('Chromium /json/new returned no page WebSocket or target ID');
    targetId = target.id;
    client = await CDP.connect(target.webSocketDebuggerUrl);
    client.on('Runtime.exceptionThrown', params => {
      report.runtimeMessages.push({ run: currentRun, type: 'exception', timestamp: params.timestamp,
        message: safeText(params.exceptionDetails.exception?.description ?? params.exceptionDetails.text),
        url: params.exceptionDetails.url ? safeURL(params.exceptionDetails.url) : null,
        line: params.exceptionDetails.lineNumber });
    });
    client.on('Runtime.consoleAPICalled', params => {
      if (!['error', 'warning'].includes(params.type)) return;
      report.runtimeMessages.push({ run: currentRun, type: params.type, timestamp: params.timestamp,
        message: params.args.map(arg => safeText(arg.description ?? (arg.value !== undefined ? JSON.stringify(arg.value) : arg.type))).join(' ') });
    });
    client.on('Network.requestWillBeSent', params => {
      report.networkRequests.push({ run: currentRun, event: 'request', requestId: params.requestId,
        url: safeURL(params.request.url), method: params.request.method, type: params.type,
        allowed: allowedRequest(params.request.url), timestamp: params.timestamp });
    });
    client.on('Network.responseReceived', params => {
      report.networkRequests.push({ run: currentRun, event: 'response', requestId: params.requestId,
        url: safeURL(params.response.url), status: params.response.status, type: params.type });
    });
    client.on('Network.loadingFailed', params => {
      report.networkRequests.push({ run: currentRun, event: 'failed', requestId: params.requestId,
        error: safeText(params.errorText), blockedReason: params.blockedReason ?? null, canceled: params.canceled ?? false });
    });
    client.on('Fetch.requestPaused', params => {
      const allowed = allowedRequest(params.request.url);
      report.networkRequests.push({ run: currentRun, event: 'interception', requestId: params.networkId ?? params.requestId,
        url: safeURL(params.request.url), decision: allowed ? 'continue' : 'block' });
      const job = client.send(allowed ? 'Fetch.continueRequest' : 'Fetch.failRequest',
        allowed ? { requestId: params.requestId } : { requestId: params.requestId, errorReason: 'BlockedByClient' })
        .catch(error => record('Fetch interception delivered', false, { url: safeURL(params.request.url), error: safeText(error.message) }))
        .finally(() => interceptionJobs.delete(job));
      interceptionJobs.add(job);
    });
    await Promise.all([client.send('Page.enable'), client.send('Runtime.enable'), client.send('Network.enable')]);
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    await client.send('Network.setBypassServiceWorker', { bypass: true });
    await client.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    // Turn off flat even if the supplied URL has it; add it explicitly in the fallback run.
    const normalURL = new URL(options.url); normalURL.searchParams.delete('flat');
    await section('normal motion controls and seeks', async () => {
      await navigate(normalURL.href, 'normal');
      await expectState('Initial ready October', { phase: 'ready', month: 'October', scene: 'city', progress: 0, busy: false });
      const clean=await evaluate(`(() => {
        const panel=document.getElementById('month-panel').getBoundingClientRect();
        return {chrome:document.querySelectorAll('#stage header,#stage footer,#stage button,#stage details,#status,#air-label,.months,.timeline,#beat-number,#region-key').length,
          month:{left:panel.left,top:panel.top},text:document.getElementById('stage').innerText};
      })()`);
      assert('Presentation contains no branding, gauges, review controls or helper text',clean.chrome===0,clean);
      assert('Bangkok time label is close to the upper-left corner',clean.month.left<=30&&clean.month.top<=30,clean.month);
      await expectState('Regional reveal has an independent four-second default', {duration:12,regionDuration:4});
      await stable('Initial scene does not autoplay', { phase: 'ready', month: 'October', scene: 'city', progress: 0, busy: false });
      const streetMotion=()=>evaluate(`(() => {
        const motion=[...document.querySelectorAll('#city .ambient-motion')];
        return {traffic:document.querySelectorAll('.traffic-motion').length,train:!!document.querySelector('.train-motion'),
          boats:document.querySelectorAll('.boat-motion').length,people:document.querySelectorAll('.pedestrian-motion').length,
          transforms:motion.map(el=>getComputedStyle(el).transform),playStates:motion.map(el=>getComputedStyle(el).animationPlayState)};
      })()`);
      const streetBefore=await streetMotion();await sleep(220);const streetAfter=await streetMotion();
      assert('City has moving traffic, skytrain, river boats and pedestrians', streetBefore.traffic>=12
        && streetBefore.train && streetBefore.boats>=2 && streetBefore.people>=6
        && streetBefore.transforms.some((value,i)=>value!==streetAfter.transforms[i]),{before:streetBefore,after:streetAfter});
      await screenshot('01-clear.png', 'webgl');
      const dustState=()=>evaluate(`(() => {
        const layer=document.getElementById('pm-dust');
        const motes=[...document.querySelectorAll('#pm-dust .dust-mote')];
        const motion=[...document.querySelectorAll('#pm-dust .dust-motion')];
        const text=[document.getElementById('month-panel'),document.querySelector('.caption')].map(el=>el.getBoundingClientRect());
        return {count:motes.length,opacity:layer?Number(getComputedStyle(layer).opacity):0,
          transforms:motion.map(el=>getComputedStyle(el).transform),paused:motion.map(el=>getComputedStyle(el).animationPlayState),
          textClear:motes.every(el=>{const r=el.getBoundingClientRect();return text.every(t=>r.right<=t.left||r.left>=t.right||r.bottom<=t.top||r.top>=t.bottom);})};
      })()`);
      const dustClear=await dustState();await seek('city',.5);const dustMiddle=await dustState();
      await seek('city',1);const dustJanuary=await dustState();await sleep(220);const dustMoving=await dustState();
      assert('Illustrative tower particles build from clear October to January',dustJanuary.count>=60&&dustClear.opacity===0&&dustMiddle.opacity>0&&dustMiddle.opacity<dustJanuary.opacity,{clear:dustClear,middle:dustMiddle,january:dustJanuary});
      assert('Tower particles keep drifting at the January hold',dustJanuary.transforms.length>=60&&dustJanuary.transforms.some((value,i)=>value!==dustMoving.transforms[i]),{before:dustJanuary,after:dustMoving});
      assert('Tower particles stay clear of the time label and caption',dustJanuary.count>=60&&dustJanuary.textClear,dustJanuary);
      await seek('city',0);
      const daylightStates=[];
      for(const p of [0,.25,.5,.75,1]){
        await seek('city',p);daylightStates.push(await state());
      }
      assert('One slow day/night cycle ends on January daytime',daylightStates.every((s,i)=>Math.abs(s.daylight-[1,.5,0,.5,1][i])<1e-6)
        && daylightStates.at(-1).month==='January'&&daylightStates.at(-1).phase==='city-hold',{states:daylightStates});
      await seek('city',.5);await screenshot('10-city-night.png','webgl');
      const night=await evaluate(`({moon:Number(getComputedStyle(document.getElementById('moon')).opacity),lights:Number(getComputedStyle(document.getElementById('city-lights')).opacity),windows:document.querySelectorAll('.night-illumination rect').length,ink:getComputedStyle(document.getElementById('title')).color})`);
      assert('Night visibly lights windows and moon with light caption text',night.moon>.6&&night.lights>.6&&night.windows>50&&night.ink==='rgb(237, 231, 207)',night);
      await seek('city',0);
      await click('next');
      const moving = await state();
      assert('Next starts the months transition', moving.busy === true && moving.scene === 'city'
        && moving.phase !== 'ready' && moving.progress >= 0 && moving.progress < 1, { actual: moving });
      // Same JS task: there is no frame progression between the before/after snapshots.
      const rapid = await evaluate(`(() => {
        const before = window.pitchReview.state();
        for(let n=0;n<4;n++) document.getElementById('stage').click();
        return {before,after:window.pitchReview.state()};
      })()`);
      assert('Rapid Next is ignored while busy', rapid.before.busy === true
        && ['phase','month','scene','progress','busy'].every(key => rapid.before[key] === rapid.after[key]), rapid);
      await sleep(140);
      const progressed = await state();
      assert('Months progress under normal motion', progressed.scene === 'city' && progressed.progress > moving.progress, { before: moving, after: progressed });
      for (const progress of [0, 0.5, 1]) {
        await seek('city', progress);
        await expectState(`Exact city seek ${progress}`, { scene: 'city', progress,
          ...(progress === 0 ? { phase: 'ready', month: 'October' } : {}),
          ...(progress === 1 ? { phase: 'city-hold', month: 'January', busy: false } : {}) });
      }
      await stable('City hold does not advance', { phase: 'city-hold', month: 'January', scene: 'city', progress: 1, busy: false });
      assert('Earth decoration stays hidden throughout Beat 1',await evaluate('Number(getComputedStyle(document.getElementById("earth-backdrop")).opacity)===0'));
      const heldDay=await evaluate(`({daylight:window.pitchReview.state().daylight,moon:Number(getComputedStyle(document.getElementById('moon')).opacity),lights:Number(getComputedStyle(document.getElementById('city-lights')).opacity)})`);
      assert('January hold stops day/night cycling at daytime',heldDay.daylight===1&&heldDay.moon===0&&heldDay.lights===0,heldDay);
      const januaryVisibility=await evaluate(`(() => {
        const css=id=>{const el=document.getElementById(id);return el?{opacity:Number(getComputedStyle(el).opacity),filter:getComputedStyle(el).filter}:null;};
        return {haze:css('haze'),city:css('city'),far:css('skyline-far'),description:document.getElementById('description').textContent};
      })()`);
      assert('January uses depth haze without globally blurring the city', januaryVisibility.haze.opacity>=.4
        && januaryVisibility.far?.opacity<=.2 && !januaryVisibility.city.filter.includes('blur(')
        && januaryVisibility.description.includes('PM2.5'),januaryVisibility);
      await screenshot('02-haze.png', 'webgl');
      await click('next');
      const ascending = await state();
      assert('Next starts the region ascent', ascending.scene === 'region' && ascending.phase === 'ascent' && ascending.busy === true, { actual: ascending });
      await seek('region',.5);
      const reveal=await evaluate(`({city:Number(getComputedStyle(document.getElementById('city')).opacity),map:Number(getComputedStyle(document.getElementById('terrain')).opacity),cloud:Number(getComputedStyle(document.getElementById('cloud-pass')).opacity)})`);
      assert('Map reveal is already decisive halfway through the short transition',reveal.map===1&&reveal.city===0&&reveal.cloud<.5,reveal);
      for (const progress of [0, 0.5, 1]) {
        await seek('region', progress);
        await expectState(`Exact region seek ${progress}`, { scene: 'region', progress,
          ...(progress === 0 ? { phase: 'ascent' } : {}),
          ...(progress === 1 ? { phase: 'region-hold', busy: false } : {}) });
        if (progress === 0.5) await screenshot('03-ascent.png', 'webgl');
      }
      await stable('Region hold does not advance', { phase: 'region-hold', scene: 'region', progress: 1, busy: false });
      assert('City particles disappear from the regional scene',(await dustState()).opacity===0,await dustState());
      await screenshot('04-region.png', 'webgl');
      const earth=await evaluate(`(() => {const el=document.getElementById('earth-backdrop');return el?{opacity:Number(getComputedStyle(el).opacity),background:getComputedStyle(el).backgroundImage}:null;})()`);
      assert('Regional view reveals a local curved-Earth backdrop',earth?.opacity===1&&earth.background.includes('earth.svg'),earth);
      const transparent=await evaluate(`(() => {const gl=document.getElementById('terrain').getContext('webgl');const pixel=new Uint8Array(4);gl.readPixels(0,gl.drawingBufferHeight-1,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);return [...pixel];})()`);
      assert('Regional canvas leaves the backdrop visible outside the terrain',transparent[3]===0,{pixel:transparent});
      await click('previous'); await frames();
      await expectState('Previous from region hold returns city hold', { phase: 'city-hold', scene: 'city', progress: 1, month: 'January', busy: false });
      await click('restart'); await frames();
      await expectState('Restart returns ready October', { phase: 'ready', month: 'October', scene: 'city', progress: 0, busy: false });
      // Exercise actual completion, not just deterministic seek endpoints.
      await click('next');
      const cycles=await evaluate(`new Promise(resolve=>{
        const phases=[];const start=performance.now();
        function observe(){
          const s=window.pitchReview.state();
          const light=s.daylight>.85?'day':s.daylight<.15?'night':null;
          if(light&&phases.at(-1)!==light)phases.push(light);
          if(!s.busy)resolve({phases,state:s});
          else if(performance.now()-start>17000)resolve({phases,timeout:true,state:s});
          else requestAnimationFrame(observe);
        }observe();
      })`,18000);
      assert('Real twelve-second playback runs one slow day/night cycle then stops',!cycles.timeout&&cycles.phases.length===3&&cycles.phases.every((p,i)=>p===(i%2?'night':'day'))&&cycles.state.daylight===1,cycles);
      await expectState('Real month animation completes and holds', { phase:'city-hold', scene:'city', progress:1, month:'January', busy:false });
      // A clicker arrow must work after a stage click, without visible controls.
      const ascentStarted=Date.now();
      await client.send('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
      await client.send('Input.dispatchKeyEvent', {type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
      await expectState('Clicker arrow works after stage click', {phase:'ascent',scene:'region',busy:true});
      await poll('window.pitchReview.state().phase === "region-hold"', 10000);
      const ascentMilliseconds=Date.now()-ascentStarted;
      assert('Default camera animation actually finishes in about four seconds',ascentMilliseconds>=3700&&ascentMilliseconds<6500,{ascentMilliseconds});
      await expectState('Real camera ascent completes and holds', {phase:'region-hold',scene:'region',progress:1,busy:false});
      await client.send('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowLeft',code:'ArrowLeft',windowsVirtualKeyCode:37});
      await client.send('Input.dispatchKeyEvent', {type:'keyUp',key:'ArrowLeft',code:'ArrowLeft',windowsVirtualKeyCode:37});
      await expectState('Keyboard previous returns January', {phase:'city-hold',scene:'city',progress:1,month:'January',busy:false});
      await click('next');
      await click('restart');
      await sleep(250);
      await expectState('Reset cancels in-flight camera without stale frames', {phase:'ready',scene:'city',progress:0,month:'October',busy:false});
    });
    await section('Beat 3 question reveal', async () => {
      await navigate(normalURL.href,'question');await seek('region',1);
      await evaluate('window.__qaTerrain=document.getElementById("terrain").toDataURL();true');
      const started=Date.now();await click('next');
      const revealing=await expectState('Next from Beat 2 starts the question reveal',{scene:'question',phase:'question-reveal',beat:3,busy:true,month:'January',questionDuration:1.2});
      if(revealing.scene!=='question')throw new Error('Beat 3 was not entered');
      const rapid=await evaluate(`(() => {const before=window.pitchReview.state();for(let i=0;i<4;i++)document.getElementById('stage').click();return {before,after:window.pitchReview.state()};})()`);
      assert('Rapid clicks cannot skip the Beat 3 reveal',stateMatches(rapid.after,rapid.before),rapid);
      await poll('window.pitchReview.state().phase === "question-hold"',5000);
      const revealMilliseconds=Date.now()-started;
      assert('Question reveal finishes in about 1.2 seconds',revealMilliseconds>=1000&&revealMilliseconds<3000,{revealMilliseconds});
      await expectState('Beat 3 completes at a presenter hold',{scene:'question',phase:'question-hold',beat:3,progress:1,busy:false,month:'January'});
      const caption=await evaluate(`({title:document.getElementById('title').textContent,description:document.getElementById('description').textContent,opacity:Number(getComputedStyle(document.querySelector('.caption')).opacity),chrome:document.querySelectorAll('#stage header,#stage footer,#stage button,#stage details,#status,.timeline').length})`);
      assert('Beat 3 reveals only its topic and draft Thai question',caption.title==='Beyond what we see.'&&caption.description==='แล้วคำกล่าวอ้างว่า “ไม่เผา” ตรวจสอบได้อย่างไร?'&&caption.opacity===1&&caption.chrome===0,caption);
      assert('Beat 3 preserves the accepted regional canvas exactly',await evaluate('window.__qaTerrain===document.getElementById("terrain").toDataURL()'));
      await screenshot('11-beat3-question.png','webgl');
      assert('Beat 3 keeps the same Earth backdrop fully visible',await evaluate('(() => {const el=document.getElementById("earth-backdrop");return !!el&&Number(getComputedStyle(el).opacity)===1;})()'));
      await stable('Beat 3 does not auto-advance',{scene:'question',phase:'question-hold',progress:1,busy:false});
      await click('next');await expectState('Next from the question starts Beat 4',{scene:'factory',phase:'descent',beat:4,busy:true,factoryDuration:4});
      await seek('question',1);
      await click('previous');await expectState('Previous from Beat 3 restores Beat 2 hold',{scene:'region',phase:'region-hold',progress:1,busy:false});
      const restored=await evaluate(`({title:document.getElementById('title').textContent,opacity:Number(getComputedStyle(document.querySelector('.caption')).opacity),question:document.getElementById('stage').dataset.question})`);
      assert('Returning to Beat 2 restores the approved caption',restored.title==='Beyond the city.'&&restored.opacity===1&&restored.question==='false',restored);
      await click('next');await click('previous');await sleep(1400);
      await expectState('Previous cancels an in-flight question without stale text',{scene:'region',phase:'region-hold',progress:1,busy:false});
      await click('next');await click('restart');await sleep(1400);
      await expectState('Restart cancels an in-flight question and returns October',{scene:'city',phase:'ready',progress:0,busy:false,month:'October'});
      for(const progress of [0,.5,1]){
        await seek('question',progress);await expectState(`Exact question seek ${progress}`,{scene:'question',progress,busy:false,phase:progress===1?'question-hold':'question-reveal'});
        assert(`Question seek ${progress} never moves the map`,await evaluate('window.__qaTerrain===document.getElementById("terrain").toDataURL()'));
      }
      await evaluate('delete window.__qaTerrain;true');
    });
    await section('Beat 4 factory descent',async () => {
      await navigate(normalURL.href,'factory');await seek('question',1);
      const started=Date.now();await click('next');
      const descending=await expectState('Presenter starts the factory descent',{scene:'factory',phase:'descent',beat:4,busy:true,factoryDuration:4});
      if(descending.scene!=='factory')throw new Error('Beat 4 was not entered');
      const rapid=await evaluate(`(() => {const before=window.pitchReview.state();for(let i=0;i<4;i++)document.getElementById('stage').click();return {before,after:window.pitchReview.state()};})()`);
      assert('Rapid inputs cannot skip the factory descent',stateMatches(rapid.after,rapid.before),rapid);
      await poll('window.pitchReview.state().phase === "factory-hold"',8000);
      const descentMilliseconds=Date.now()-started;
      assert('Real factory descent finishes in about four seconds',descentMilliseconds>=3700&&descentMilliseconds<6500,{descentMilliseconds});
      await expectState('Factory holds for the presenter',{scene:'factory',phase:'factory-hold',beat:4,progress:1,busy:false});
      const claim=await evaluate(`(() => {const el=document.getElementById('factory-claim');return {text:el.textContent,opacity:Number(getComputedStyle(el).opacity),hidden:el.getAttribute('aria-hidden'),factory:Number(getComputedStyle(document.getElementById('factory-scene')).opacity),map:Number(getComputedStyle(document.getElementById('terrain')).opacity),earth:Number(getComputedStyle(document.getElementById('earth-backdrop')).opacity),cloud:Number(getComputedStyle(document.getElementById('cloud-pass')).opacity),title:document.getElementById('title').textContent};})()`);
      assert('Claim is explicitly fictional and includes the declared period',claim.text.includes('โรงงานสมมติ')&&claim.text.includes('100%')&&claim.text.includes('ในช่วงเวลาที่ระบุ')&&claim.hidden==='false'&&claim.opacity===1,claim);
      assert('Factory replaces map, Earth and transition clouds at the hold',claim.factory===1&&claim.map===0&&claim.earth===0&&claim.cloud===0&&claim.title==="Factory A's claim.",claim);
      await screenshot('15-factory.png','webgl');
      factoryReference=await evaluate('document.getElementById("factory-canvas").toDataURL()');
      await stable('Factory does not advance itself',{scene:'factory',phase:'factory-hold',progress:1,busy:false});
      await click('next');await expectState('Next from Factory A starts Beat 5',{scene:'suppliers',phase:'pullback',beat:5,busy:true,suppliersDuration:6});
      await seek('factory',1);
      await click('previous');await expectState('Previous restores the question hold',{scene:'question',phase:'question-hold',progress:1,busy:false});
      assert('Returning to the question hides the factory claim',await evaluate('document.getElementById("factory-claim").getAttribute("aria-hidden")==="true"&&Number(getComputedStyle(document.getElementById("factory-scene")).opacity)===0'));
      await click('next');await click('previous');await sleep(4500);
      await expectState('Previous cancels the descent without stale frames',{scene:'question',phase:'question-hold',progress:1,busy:false});
      await click('next');await click('restart');await sleep(4500);
      await expectState('Restart cancels the descent and restores October',{scene:'city',phase:'ready',progress:0,busy:false,month:'October'});
      for(const progress of [0,.5,1]){
        await seek('factory',progress);await expectState(`Exact factory seek ${progress}`,{scene:'factory',progress,busy:false,phase:progress===1?'factory-hold':'descent'});
        if(progress<1)assert(`Claim waits during factory seek ${progress}`,await evaluate('Number(getComputedStyle(document.getElementById("factory-claim")).opacity)===0'));
        if(progress===.5)await screenshot('16-factory-clouds.png','webgl');
      }
      await seek('factory',.75);await screenshot('20-factory-arrival.png','webgl');
    });
    await section('Beat 5 supplier arrivals',async () => {
      await navigate(normalURL.href,'suppliers');await seek('factory',1);
      const started=Date.now();await click('next');
      const departing=await expectState('Presenter starts the supplier-map pullback',{scene:'suppliers',phase:'pullback',beat:5,busy:true,suppliersDuration:6});
      if(departing.scene!=='suppliers')throw new Error('Beat 5 was not entered');
      const rapid=await evaluate(`(() => {const before=window.pitchReview.state();for(let i=0;i<5;i++)document.getElementById('stage').click();return {before,after:window.pitchReview.state()};})()`);
      assert('Rapid inputs do not skip supplier arrivals',stateMatches(rapid.after,rapid.before),rapid);
      await sleep(2800);
      const liveTrucks=await evaluate('[...document.querySelectorAll(".supply-truck")].map(el=>Number(el.dataset.travel))');
      assert('Real playback moves trucks before the hold',liveTrucks.length===3&&liveTrucks.some(t=>t>0&&t<1),liveTrucks);
      await poll('window.pitchReview.state().phase === "suppliers-hold"',10000);
      const arrivalMilliseconds=Date.now()-started;
      assert('Real pullback and deliveries finish in about six seconds',arrivalMilliseconds>=5700&&arrivalMilliseconds<9000,{arrivalMilliseconds});
      await expectState('Supplier scene holds with its own SVG renderer',{scene:'suppliers',phase:'suppliers-hold',beat:5,progress:1,busy:false,renderer:'svg'});
      const map=await evaluate(`(() => ({nodes:document.querySelectorAll('#supply-map .supply-node').length,trucks:[...document.querySelectorAll('#supply-map .supply-truck')].map(el=>({travel:Number(el.dataset.travel),transform:el.getAttribute('transform')})),selected:[...document.querySelectorAll('#supply-map .supply-node[data-selected="true"]')].map(el=>el.dataset.originId),title:document.getElementById('title').textContent,description:document.getElementById('description').textContent,claim:document.getElementById('factory-claim').getAttribute('aria-hidden'),opacity:Number(getComputedStyle(document.getElementById('supply-scene')).opacity)}))()`);
      assert('Exactly three fictional suppliers and three arrived trucks',map.nodes===3&&map.trucks.length===3&&map.trucks.every(t=>t.travel===1)&&new Set(map.trucks.map(t=>t.transform)).size===3,map);
      assert('Only one stable story origin is highlighted',map.selected.length===1&&map.selected[0]==='story-origin-01',map.selected);
      assert('Supplier caption matches the requested multi-origin wording',map.title==='More than one supplier.'&&map.description==='Factory A รับผลผลิตมาจากหลายแหล่ง โดยมีจำนวนที่แตกต่างกัน'&&map.claim==='true'&&map.opacity===1,map);
      await screenshot('21-suppliers.png','svg');
      const held=await evaluate('document.getElementById("supply-map").outerHTML');
      await stable('Supplier arrivals do not auto-advance',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      assert('Trucks and highlights stay stationary at the hold',held===await evaluate('document.getElementById("supply-map").outerHTML'));
      await click('next');await expectState('Next from the supplier hold starts Beat 6',{scene:'check',phase:'check-reveal',beat:6,busy:true,checkDuration:1.6});
      await seek('suppliers',1);
      await click('previous');await expectState('Previous restores the complete factory claim',{scene:'factory',phase:'factory-hold',progress:1,busy:false});
      assert('Returning hides the supplier map and restores the claim',await evaluate('document.getElementById("supply-scene").getAttribute("aria-hidden")==="true"&&Number(getComputedStyle(document.getElementById("supply-scene")).opacity)===0&&document.getElementById("factory-claim").getAttribute("aria-hidden")==="false"'));
      const near=await evaluate('document.getElementById("factory-canvas").toDataURL()');
      await seek('suppliers',0);
      assert('Supplier pullback begins at the unchanged factory view',near===await evaluate('document.getElementById("factory-canvas").toDataURL()'));
      await seek('suppliers',.13);await screenshot('22-supplier-pullback.png','webgl');
      assert('Pullback changes the actual 3D camera',near!==await evaluate('document.getElementById("factory-canvas").toDataURL()'));
      await seek('suppliers',.6);await screenshot('23-trucks-in-motion.png','svg');
      const middle=await evaluate('[...document.querySelectorAll(".supply-truck")].map(el=>Number(el.dataset.travel))');
      assert('All three trucks traverse their routes at the midpoint',middle.length===3&&middle.every(t=>t>0&&t<1)&&new Set(middle).size===3,middle);
      await click('next');await click('previous');await sleep(6500);
      await expectState('Previous cancels deliveries without stale frames',{scene:'factory',phase:'factory-hold',progress:1,busy:false});
      await seek('suppliers',.6);await click('next');await click('restart');await sleep(6500);
      await expectState('Restart cancels deliveries and returns to clear October',{scene:'city',phase:'ready',progress:0,busy:false,month:'October'});
      assert('Restart hides the supplier scene',await evaluate('Number(getComputedStyle(document.getElementById("supply-scene")).opacity)===0&&document.getElementById("supply-scene").getAttribute("aria-hidden")==="true"'));
      for(const p of [0,.6,1]){
        await seek('suppliers',p);await expectState(`Exact supplier seek ${p}`,{scene:'suppliers',progress:p,busy:false,phase:p===1?'suppliers-hold':p<.32?'pullback':'deliveries'});
        if(p===0)assert('Re-entry resets all trucks to their origins',await evaluate('[...document.querySelectorAll(".supply-truck")].every(el=>Number(el.dataset.travel)===0)'));
      }
    });
    await section('Beat 6 check question',async () => {
      await navigate(normalURL.href,'check');await seek('suppliers',1);
      const parked=await evaluate('document.getElementById("supply-map").outerHTML');
      const started=Date.now();await click('next');
      const departing=await expectState('Presenter starts the cream question transition',{scene:'check',phase:'check-reveal',beat:6,busy:true,checkDuration:1.6});
      if(departing.scene!=='check')return;
      const rapid=await evaluate(`(() => {const before=window.pitchReview.state();for(let i=0;i<5;i++)document.getElementById('stage').click();return {before,after:window.pitchReview.state()};})()`);
      assert('Rapid inputs cannot skip the cream question reveal',stateMatches(rapid.before,rapid.after),rapid);
      await poll('window.pitchReview.state().phase === "check-hold"',5000);
      const elapsed=Date.now()-started;
      assert('Cream question transition finishes in about 1.6 seconds',elapsed>=1400&&elapsed<4000,{elapsed});
      await expectState('Beat 6 holds with native HTML text',{scene:'check',phase:'check-hold',beat:6,progress:1,busy:false,renderer:'html'});
      const question=await evaluate(`(() => ({title:document.getElementById('title').textContent,description:document.getElementById('description').textContent,backdrop:Number(getComputedStyle(document.getElementById('check-backdrop')).opacity),world:Number(getComputedStyle(document.getElementById('world')).opacity),caption:Number(getComputedStyle(document.querySelector('.caption')).opacity),claim:document.getElementById('factory-claim').getAttribute('aria-hidden')}))()`);
      assert('Beat 6 is a plain cream conditional question',question.title==='How can we check?'&&question.description==='ถ้ามีข้าวโพดจากแปลงที่เผาเข้ามา\nเราจะตรวจสอบคำกล่าวอ้างได้อย่างไร?'&&question.backdrop===1&&question.world===0&&question.caption===1&&question.claim==='true',question);
      await screenshot('28-check-question.png','html');
      await stable('Beat 6 question does not auto-advance',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
      await click('next');await expectState('Beat 6 enters the solution wipe',{scene:'evidence',phase:'evidence-wipe',evidenceStep:0,busy:true});
      await click('previous');await expectState('Solution wipe returns to the exact question',{scene:'check',phase:'check-hold',progress:1,busy:false});
      await click('previous');await expectState('Previous restores the supplier hold',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      assert('Returning restores the requested supplier caption',await evaluate('document.getElementById("description").textContent === "Factory A รับผลผลิตมาจากหลายแหล่ง โดยมีจำนวนที่แตกต่างกัน"'));
      assert('Returning restores the same parked trucks and origin',parked===await evaluate('document.getElementById("supply-map").outerHTML'));
      const restored=await evaluate(`(() => ({world:Number(getComputedStyle(document.getElementById('world')).opacity),cream:Number(getComputedStyle(document.getElementById('check-backdrop')).opacity),check:document.getElementById('stage').dataset.check}))()`);
      assert('Returning removes the cream question layout',restored.world===1&&restored.cream===0&&restored.check==='false',restored);
      for(const p of [0,.3,.8,1]){
        await seek('check',p);await expectState(`Exact check seek ${p}`,{scene:'check',progress:p,busy:false,phase:p===1?'check-hold':'check-reveal',renderer:p<.65?'svg':'html'});
        assert(`Check transition keeps all trucks parked ${p}`,await evaluate('[...document.querySelectorAll(".supply-truck")].every(el=>Number(el.dataset.travel)===1)'));
        if(p===0)assert('Check starts at the unchanged supplier composition',await evaluate('document.getElementById("stage").dataset.check==="false"&&Number(getComputedStyle(document.getElementById("world")).opacity)===1&&Number(getComputedStyle(document.getElementById("check-backdrop")).opacity)===0'));
        if(p===.8){
          const opacity=await evaluate('Number(getComputedStyle(document.querySelector(".caption")).opacity)');
          assert('Question text visibly fades in rather than appearing early',opacity>0&&opacity<1,{opacity});
          await screenshot('29-check-reveal.png','html');
        }
      }
      await seek('check',.3);await click('next');await click('previous');await sleep(2000);
      await expectState('Previous cancels the check reveal without stale callbacks',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false});
      await seek('check',.3);await click('next');await click('restart');await sleep(2000);
      await expectState('Restart cancels the check reveal and restores clear October',{scene:'city',phase:'ready',progress:0,busy:false,month:'October'});
      assert('Restart removes the cream overlay',await evaluate('Number(getComputedStyle(document.getElementById("check-backdrop")).opacity)===0&&Number(getComputedStyle(document.getElementById("world")).opacity)===1&&document.getElementById("stage").dataset.check==="false"'));
      await seek('check',.3);await click('next');
      await evaluate('window.pitchMotionChangeSeen=false;matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",()=>{window.pitchMotionChangeSeen=true},{once:true})');
      await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      // The protocol acknowledgement precedes the browser's queued change event.
      // Wait below the remaining normal transition time, so autoplay cannot pass this check.
      await poll('window.pitchMotionChangeSeen && window.pitchReview.state().phase === "check-hold"',500);
      assert('Browser dispatches the actual motion-preference event',await evaluate('window.pitchMotionChangeSeen&&matchMedia("(prefers-reduced-motion: reduce)").matches'));
      await expectState('Changing motion preference finishes the check safely',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
      await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    });
    await section('Beat 7 evidence reveals',async () => {
      await navigate(normalURL.href,'evidence');await seek('check',1);
      const started=Date.now();await click('next');
      const entering=await expectState('Beat 7 begins with a left-to-right solution wipe',{scene:'evidence',phase:'evidence-wipe',beat:7,evidenceStep:0,reveal:'document',busy:true,evidenceIntroDuration:2});
      if(entering.scene!=='evidence')return;
      await poll('window.pitchReview.state().phase === "evidence-hold"',5000);
      const elapsed=Date.now()-started;
      assert('Solution wipe completes in about two seconds',elapsed>=1800&&elapsed<4500,{elapsed});
      await expectState('Document explanation is a held concept, not a live review',{scene:'evidence',phase:'evidence-hold',evidenceStep:0,reveal:'document',progress:1,busy:false,renderer:'html'});
      assert('Authored procurement sketch is visibly fictional without math shorthand',await evaluate('document.getElementById("evidence-document").textContent.includes("เอกสารสมมติ")&&!/\\bR\\b/.test(document.getElementById("evidence-document").textContent)'));
      assert('Solution explanation introduces no product review controls',await evaluate('document.querySelectorAll("#evidence-scene input,#evidence-scene button,#evidence-scene select,#evidence-scene a").length===0'));
      await screenshot('34-evidence-document.png','html');
      await stable('Document reveal holds for speech',{scene:'evidence',evidenceStep:0,progress:1,busy:false});
      const reveals=[['review','35-evidence-review.png'],['origin','36-evidence-origin.png'],['production','37-evidence-production.png'],['burn','38-evidence-burn.png'],['supply','39-evidence-supply.png'],['compare','40-evidence-compare.png'],['close','41-evidence-close.png']];
      for(let i=1;i<=reveals.length;i++){
        const [reveal,filename]=reveals[i-1];await click('next');
        const started=await expectState(`Presenter starts only the ${reveal} reveal`,{scene:'evidence',evidenceStep:i,reveal,busy:true,phase:'evidence-reveal',evidenceDuration:1.2});
        if(started.evidenceStep!==i)return;
        await poll('window.pitchReview.state().phase === "evidence-hold"',4000);
        await expectState(`${reveal} completes without advancing another step`,{scene:'evidence',evidenceStep:i,reveal,busy:false,progress:1,renderer:'html'});
        const panels=await evaluate(`[...document.querySelectorAll('.evidence-detail:not([hidden])')].map(el=>({tag:el.tagName,step:el.dataset.step??null}))`);
        assert(`Only ${reveal} content is visible`,panels.length===1&&panels[0].step===reveal,panels);
        if(reveal==='origin')assert('The same authored selected field returns, not real crop geometry',await evaluate('document.getElementById("evidence-origin-symbol").dataset.storyOrigin==="story-origin-01"&&document.querySelector("#evidence-origin-symbol>g").outerHTML===document.querySelector("#supply-node-01>g").outerHTML&&document.getElementById("evidence-map").textContent.includes("ไม่ใช่ข้อมูลแปลงจริง")'));
        if(reveal==='origin')assert('Origin detail uses the requested wording while retaining the original subtitle',await evaluate('document.getElementById("description").textContent==="แหล่งปลูกเดียวกัน ช่วงเวลาเดียวกัน"&&document.querySelector(".evidence-detail:not([hidden])>p").textContent==="นำข้อมูลพื้นที่ ที่สกัดได้มาจากเอกสาร ไปค้นหาภาพถ่ายดาวเทียม Sentinel-2 และหาข้อมูลไร่ข้าวโพดในพื้นที่ด้วย GISTDA API"'));
        assert(`No equations or letter quantities in ${reveal}`,await evaluate(`!/[=×<>−]|\\b(?:Q|R|C|b|B_min)\\b|max\\(/.test(document.getElementById('evidence-body').innerText+' '+document.getElementById('description').textContent)&&document.querySelectorAll('#evidence-body .evidence-math').length===0`));
        if(reveal==='production')assert('Production is shown as one recognizable fictional field',await evaluate('document.getElementById("evidence-field")?.hidden===false&&document.getElementById("evidence-field-plot")?.dataset.storyOrigin==="story-origin-01"&&document.getElementById("evidence-field").textContent.includes("ไม่ใช่สัดส่วนหรือปริมาณจริง")'));
        if(reveal==='burn')assert('Burn illustration does not claim destroyed grain or contamination',await evaluate('document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ภาพจำลอง")&&document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ไม่ใช่หลักฐานการปนเปื้อน")'));
        if(reveal==='burn')assert('The field has a visible, clipped and patterned illustrative burn portion',await evaluate(`document.getElementById('evidence-burn-overlay')?.getAttribute('clip-path')==='url(#evidence-field-clip)'&&Number(getComputedStyle(document.getElementById('evidence-burn-overlay')).opacity)>.8&&[...document.querySelectorAll('#evidence-burn-overlay path')].some(path=>path.getAttribute('fill')==='url(#evidence-burn-hatch)')&&document.getElementById('evidence-field-key')?.hidden===false`));
        if(reveal==='supply')assert('Unburned emphasis restores the same field with the burn portion excluded',await evaluate('document.getElementById("evidence-unburned-focus")?.getAttribute("mask")==="url(#evidence-unburned-mask)"&&Number(getComputedStyle(document.getElementById("evidence-unburned-focus")).opacity)===1&&Number(getComputedStyle(document.getElementById("evidence-field-base")).opacity)<.5&&Number(getComputedStyle(document.getElementById("evidence-burn-overlay")).opacity)<.3'));
        if(['supply','compare'].includes(reveal))assert(`Closed-scenario assumptions are visible during ${reveal}`,await evaluate('document.getElementById("evidence-assumptions").hidden===false&&document.getElementById("evidence-assumptions").textContent.includes("ไม่มีสต็อกยกมา")&&document.getElementById("evidence-assumptions").textContent.includes("ไม่มีวัตถุดิบทดแทนจากนอกแหล่งที่เลือก")'));
        if(reveal==='compare')assert('Visual comparison is explicitly hypothetical and guarded, not a result',await evaluate('document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ถ้าปริมาณที่แจ้งซื้อ")&&document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ข้อมูลไม่ครบหรือขัดกัน")&&document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ไม่ใช่ผลประเมิน")'));
        if(reveal==='compare')assert('A visual purchase example replaces the shortfall formula without a numerical scale',await evaluate('document.getElementById("evidence-purchase-picture")?.textContent.includes("ไม่ได้ใช้สเกลปริมาณ")&&document.querySelectorAll("#evidence-purchase-picture .evidence-quantity-band").length===2&&document.querySelector("#evidence-purchase-picture .evidence-example-gap")!==null&&!/\\d|%/.test(document.getElementById("evidence-purchase-picture").textContent)'));
        if(reveal==='close')assert('Closing does not pretend to enter a working application',await evaluate('document.querySelector(".evidence-detail:not([hidden])").textContent.includes("ขั้นตอนจริงยังไม่เชื่อมต่อ")&&document.querySelectorAll("#evidence-scene a,#evidence-scene button").length===0'));
        await screenshot(filename,'html');await stable(`${reveal} holds for presenter speech`,{scene:'evidence',evidenceStep:i,reveal,progress:1,busy:false});
      }
      await click('next');await expectState('Concept closing is the endpoint, not an assessed result',{scene:'evidence',evidenceStep:7,reveal:'close',progress:1,busy:false});
      for(let i=6;i>=0;i--){await click('previous');await expectState(`Previous restores evidence step ${i}`,{scene:'evidence',evidenceStep:i,progress:1,busy:false});}
      await click('previous');await expectState('Previous restores the cream question',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
      await seek('evidence',0,0);
      assert('Wipe starts at the exact question composition',await evaluate('document.getElementById("stage").dataset.check==="true"&&document.getElementById("title").textContent==="How can we check?"&&document.getElementById("evidence-scene").style.clipPath.includes("100%")'));
      await seek('evidence',.6,0);await screenshot('44-evidence-wipe.png','html');
      const highlights=[];
      for(const step of [4,5])for(const p of [0,.6,1]){
        await seek('evidence',p,step);
        highlights.push(await evaluate(`(() => {const crop=document.getElementById('evidence-field-plot'),burn=document.getElementById('evidence-burn-overlay'),focus=document.getElementById('evidence-unburned-focus'),r=crop.getBoundingClientRect();return {step:${step},p:${p},burn:burn?Number(getComputedStyle(burn).opacity):null,focus:focus?Number(getComputedStyle(focus).opacity):null,body:Number(getComputedStyle(document.getElementById('evidence-body')).opacity),bounds:{left:r.left,right:r.right,top:r.top,bottom:r.bottom}};})()`));
      }
      assert('Burn highlight grows while the field stays anchored',highlights[0].burn===0&&highlights[1].burn>0&&highlights[1].burn<highlights[2].burn&&highlights[2].burn>.8&&highlights.slice(0,3).every(item=>item.body===1&&JSON.stringify(item.bounds)===JSON.stringify(highlights[0].bounds)),highlights.slice(0,3));
      assert('Unburned emphasis grows without moving the field',highlights[3].focus===0&&highlights[4].focus>0&&highlights[4].focus<1&&highlights[5].focus===1&&highlights.slice(3).every(item=>item.body===1&&JSON.stringify(item.bounds)===JSON.stringify(highlights[3].bounds)),highlights.slice(3));
      for(let i=0;i<8;i++)for(const p of [0,.3,.8,1]){
        await seek('evidence',p,i);await expectState(`Exact concept seek ${i}:${p}`,{scene:'evidence',evidenceStep:i,progress:p,busy:false,phase:p===1?'evidence-hold':i===0?'evidence-wipe':'evidence-reveal'});
      }
      const before=await state();
      const rejected=await evaluate(`[-1,8,1.5,NaN].map(step=>{try{window.pitchReview.seek('evidence',1,step);return false;}catch(error){return error instanceof TypeError;}})`);
      assert('Invalid concept steps are rejected without changing state',rejected.every(Boolean)&&stateMatches(await state(),before),{rejected});
      await seek('evidence',.2,4);await click('next');
      const rapid=await evaluate(`(() => {const before=window.pitchReview.state();for(let i=0;i<6;i++)document.getElementById('stage').click();return {before,after:window.pitchReview.state()};})()`);
      assert('Rapid clicks cannot skip a concept reveal',stateMatches(rapid.before,rapid.after)&&rapid.after.evidenceStep===4&&rapid.after.busy,rapid);
      await click('previous');await sleep(1600);await expectState('Previous cancels a partial burn reveal without stale frames',{scene:'evidence',evidenceStep:3,reveal:'production',progress:1,busy:false});
      await seek('evidence',.2,6);await click('next');await click('restart');await sleep(1600);
      await expectState('Restart cancels comparison and restores clear October',{scene:'city',phase:'ready',progress:0,busy:false});
      assert('Leaving Beat 7 removes its layout and visibility',await evaluate('document.getElementById("stage").dataset.evidence==="false"&&getComputedStyle(document.getElementById("evidence-scene")).visibility==="hidden"'));
      await seek('evidence',.2,4);await click('next');
      await evaluate('window.pitchMotionChangeSeen=false;matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",()=>{window.pitchMotionChangeSeen=true},{once:true})');
      await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      await poll('window.pitchMotionChangeSeen&&window.pitchReview.state().phase==="evidence-hold"',500);
      await expectState('Live reduced-motion change completes the current reveal, not step zero',{scene:'evidence',evidenceStep:4,reveal:'burn',progress:1,busy:false});
      await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
      for(const [width,height] of [[1440,900],[1280,800],[1920,1080],[1728,1117]]){
        await viewport(width,height);
        for(let i=0;i<8;i++){
          await seek('evidence',1,i);
          const bounds=await evaluate(`(() => {const caption=document.querySelector('.caption').getBoundingClientRect(),nodes=[...document.querySelectorAll('#evidence-body h2,#evidence-body p,#evidence-body dt,#evidence-body dd,#evidence-body figcaption,#evidence-body svg,#evidence-body .evidence-math')].filter(el=>!el.closest('[hidden]')).map(el=>{const r=el.getBoundingClientRect();return {text:el.tagName==='svg'?'origin map':el.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom};});return {caption:{left:caption.left,right:caption.right,top:caption.top,bottom:caption.bottom},nodes,rootWidth:document.documentElement.scrollWidth,rootHeight:document.documentElement.scrollHeight};})()`);
          assert(`Concept ${i} fits desktop ${width}x${height} without caption overlap`,bounds.rootWidth<=width&&bounds.rootHeight<=height&&bounds.caption.left>=0&&bounds.caption.right<=width&&bounds.caption.top>=0&&bounds.nodes.length>0&&bounds.nodes.every(r=>r.left>=0&&r.right<=width&&r.top>=bounds.caption.bottom&&r.bottom<=height),bounds);
          if(width===1728&&i===6)await screenshot('42-evidence-compare-mac.png','html');
          if(width===1280&&i===0)await screenshot('43-evidence-document-1280.png','html');
        }
      }
      await viewport(1440,900);
      assert('Concept never creates duplicate IDs',await evaluate('new Set([...document.querySelectorAll("[id]")].map(el=>el.id)).size===document.querySelectorAll("[id]").length'));
      assert('Story navigation makes no evidence or helper requests',!report.networkRequests.some(r=>r.event==='interception'&&/\/api\/|\/data\//.test(new URL(r.url).pathname)));
    });
    await section('desktop overflow', async () => {
      await navigate(normalURL.href, 'responsive');
      for (const [width, height, mobile] of [[1440,900,false], [1280,800,false], [1920,1080,false], [1728,1117,false]]) {
        await viewport(width, height, mobile);
        await evaluate('document.fonts.ready.then(() => true)');
        for (const [scene, progress] of [['city',0], ['city',1/12], ['city',0.5], ['city',1], ['region',0], ['region',0.5], ['region',1], ['question',0], ['question',.5], ['question',1], ['factory',0], ['factory',.5], ['factory',1], ['suppliers',0], ['suppliers',.6], ['suppliers',1], ['check',0], ['check',.8], ['check',1]]) {
          await seek(scene, progress);
          const measure = await evaluate(`(() => {
            const root = document.documentElement, body = document.body, stage = document.querySelector('#stage');
            const r = stage?.getBoundingClientRect();
            return {width:innerWidth,height:innerHeight,rootWidth:root.scrollWidth,rootHeight:root.scrollHeight,
              bodyWidth:body.scrollWidth,bodyHeight:body.scrollHeight,
              stage:r ? {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height,
                scrollWidth:stage.scrollWidth,clientWidth:stage.clientWidth,scrollHeight:stage.scrollHeight,clientHeight:stage.clientHeight} : null};
          })()`);
          const s = measure.stage;
          assert(`No overflow ${width}x${height} ${scene}:${progress}`, measure.width === width && measure.height === height
            && Math.max(measure.rootWidth,measure.bodyWidth) <= width + 1
            && Math.max(measure.rootHeight,measure.bodyHeight) <= height + 1
            && s && s.width > 0 && s.height > 0 && s.left >= -1 && s.top >= -1 && s.right <= width + 1 && s.bottom <= height + 1
            && s.scrollWidth <= s.clientWidth + 1 && s.scrollHeight <= s.clientHeight + 1,
          { viewport: {width,height,mobile}, scene, progress, measure });

          if(scene==='suppliers'&&progress===1){
            const layout=await evaluate(`(() => {const caption=document.querySelector('.caption').getBoundingClientRect();return [...document.querySelectorAll('.supply-node .supply-name,.supply-node .supply-detail')].map(el=>{const text=el.getBoundingClientRect(),field=el.closest('.supply-node').querySelector('ellipse').getBoundingClientRect();return {text:el.textContent,left:text.left,right:text.right,top:text.top,bottom:text.bottom,field:{left:field.left,right:field.right,top:field.top,bottom:field.bottom},captionTop:caption.top};});})()`);
            assert(`Supplier labels remain inside their own fields ${width}x${height}`,layout.length===6&&layout.every(r=>r.left>=r.field.left&&r.right<=r.field.right&&r.top>=r.field.top&&r.bottom<=r.field.bottom&&r.left>=0&&r.right<=width&&r.bottom<r.captionTop),layout);
            if(width===1920)await screenshot('24-suppliers-widescreen.png','svg');
            if(width===1728)await screenshot('25-suppliers-mac.png','svg');
          }
          if(scene==='check'&&progress===1){
            const layout=await evaluate(`(() => {const caption=document.querySelector('.caption').getBoundingClientRect(),p=document.getElementById('description'),text=p.getBoundingClientRect(),style=getComputedStyle(p),background=getComputedStyle(document.getElementById('check-backdrop'));return {left:caption.left,right:caption.right,top:caption.top,bottom:caption.bottom,lines:Math.round(text.height/parseFloat(style.lineHeight)),font:parseFloat(style.fontSize),whiteSpace:style.whiteSpace,background:background.backgroundColor,world:Number(getComputedStyle(document.getElementById('world')).opacity)};})()`);
            assert(`Cream question is readable in exactly two Thai lines ${width}x${height}`,layout.left>=0&&layout.right<=width&&layout.top>=0&&layout.bottom<=height&&layout.lines===2&&layout.font>=32&&layout.whiteSpace==='pre-line'&&layout.background==='rgb(247, 246, 240)'&&layout.world===0,layout);
            if(width===1920)await screenshot('30-check-widescreen.png','html');
            if(width===1728)await screenshot('31-check-mac.png','html');
          }
          if(scene==='factory'&&progress===1){
            const bounds=await evaluate(`(() => {const claim=document.getElementById('factory-claim').getBoundingClientRect(),caption=document.querySelector('.caption').getBoundingClientRect();return {left:claim.left,top:claim.top,right:claim.right,bottom:claim.bottom,captionTop:caption.top};})()`);
            assert(`Factory claim fits without caption collision ${width}x${height}`,bounds.left>=0&&bounds.top>=0&&bounds.right<=width&&bounds.bottom<bounds.captionTop,bounds);
            const framing=await evaluate('window.pitchReview.framing()');
            assert(`Speaker and complete factory fit ${width}x${height}`,Object.values(framing).every(r=>r.left>=0&&r.right<=width&&r.top>=0&&r.bottom<bounds.captionTop)&&framing.speaker.top>=bounds.bottom,framing);
          }
          if(scene==='question'&&progress===1){
            const bounds=await evaluate(`(() => {const r=document.querySelector('.caption').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};})()`);
            assert(`Question caption remains inside ${width}x${height}`,bounds.left>=0&&bounds.top>=0&&bounds.right<=width&&bounds.bottom<=height,bounds);
          }
        }
      }
      await viewport(1440,900);
    });
    await section('reduced motion', async () => {
      await viewport(1440,900);
      await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await navigate(normalURL.href, 'reduced-motion');
      assert('Reduced motion preference is active', await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'));
      for(const [key,code] of [['ArrowRight','ArrowRight'],[' ','Space'],['PageDown','PageDown']]){
        await seek('city',0);
        await client.send('Input.dispatchKeyEvent',{type:'keyDown',key,code});
        for(let i=0;i<5;i++)await client.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,autoRepeat:true});
        await client.send('Input.dispatchKeyEvent',{type:'keyUp',key,code});
        await expectState(`Held ${code} preserves the first presenter hold`,{scene:'city',phase:'city-hold',progress:1,busy:false});
      }
      for(const [key,code] of [['ArrowLeft','ArrowLeft'],['PageUp','PageUp']]){
        await seek('evidence',1,7);
        await client.send('Input.dispatchKeyEvent',{type:'keyDown',key,code});
        for(let i=0;i<5;i++)await client.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,autoRepeat:true});
        await client.send('Input.dispatchKeyEvent',{type:'keyUp',key,code});
        await expectState(`Held ${code} returns only one concept reveal`,{scene:'evidence',evidenceStep:6,progress:1,busy:false});
      }
      await click('restart');
      const paused=await evaluate(`[...document.querySelectorAll('#city .ambient-motion,#haze i')].map(el=>getComputedStyle(el).animationPlayState)`);
      assert('Reduced motion pauses ambient city and smog loops',paused.length>10&&paused.every(value=>value==='paused'),{playStates:paused});
      await expectState('Reduced motion starts ready', { phase: 'ready', scene: 'city', month: 'October', progress: 0, busy: false });
      await click('next');
      // No duration polling: these must already be completed when the click returns.
      await expectState('Reduced motion Next completes months immediately', { phase: 'city-hold', month: 'January', scene: 'city', progress: 1, busy: false });
      const dustPaused=await evaluate(`[...document.querySelectorAll('#pm-dust .dust-motion')].map(el=>getComputedStyle(el).animationPlayState)`);
      assert('Reduced motion pauses visible illustrative dust particles',dustPaused.length>=60&&dustPaused.every(value=>value==='paused'),{playStates:dustPaused});
      await click('next');
      await expectState('Reduced motion Next completes region immediately', { phase: 'region-hold', scene: 'region', progress: 1, busy: false });
      await stable('Reduced motion region remains held', { phase: 'region-hold', scene: 'region', progress: 1, busy: false });
      await click('next');
      await expectState('Reduced motion completes Beat 3 immediately',{scene:'question',phase:'question-hold',progress:1,busy:false});
      await stable('Reduced motion question remains held',{scene:'question',phase:'question-hold',progress:1,busy:false});
      await click('next');await expectState('Reduced motion completes factory immediately',{scene:'factory',phase:'factory-hold',progress:1,busy:false});
      await click('next');await expectState('Reduced motion completes supplier deliveries immediately',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      assert('Reduced motion parks all three trucks',await evaluate('[...document.querySelectorAll(".supply-truck")].every(el=>Number(el.dataset.travel)===1)'));
      await click('next');await expectState('Reduced motion completes the cream question immediately',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
      for(let i=0;i<8;i++){await click('next');await expectState(`Reduced motion finishes only concept ${i}`,{scene:'evidence',evidenceStep:i,progress:1,busy:false,renderer:'html'});}
      for(let i=6;i>=0;i--){await click('previous');await expectState(`Reduced motion restores concept ${i}`,{scene:'evidence',evidenceStep:i,progress:1,busy:false});}
      await click('previous');await expectState('Reduced motion returns from concept to the question',{scene:'check',phase:'check-hold',progress:1,busy:false});
      await click('previous');await expectState('Reduced motion restores suppliers from the check',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      await click('previous');await expectState('Reduced motion returns to factory',{scene:'factory',phase:'factory-hold',progress:1,busy:false});
      await click('previous');await expectState('Reduced motion restores question from factory',{scene:'question',phase:'question-hold',progress:1,busy:false});
      await click('previous');await expectState('Reduced motion returns from question to region',{scene:'region',phase:'region-hold',progress:1,busy:false});
      await click('restart');
      await expectState('Reduced motion restart', { phase: 'ready', scene: 'city', month: 'October', progress: 0, busy: false });
    });
    await section('flat fallback', async () => {
      await viewport(1440,900);
      await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
      const flatURL = new URL(normalURL); flatURL.searchParams.set('flat','1');
      await navigate(flatURL.href, 'flat');
      await expectState('Flat starts ready October', { phase: 'ready', scene: 'city', month: 'October', progress: 0, busy: false, renderer: 'flat' });
      await stable('Flat does not autoplay', { phase: 'ready', scene: 'city', progress: 0, busy: false, renderer: 'flat' });
      for (const scene of ['city','region']) for (const progress of [0,0.5,1]) {
        await seek(scene, progress);
        await expectState(`Flat exact seek ${scene}:${progress}`, { scene, progress, renderer: 'flat',
          ...(scene === 'city' && progress === 1 ? { phase: 'city-hold', month: 'January' } : {}),
          ...(scene === 'region' && progress === 1 ? { phase: 'region-hold' } : {}) });
      }
      await screenshot('05-flat.png', 'flat');
      await stable('Flat region remains held', { phase: 'region-hold', scene: 'region', progress: 1, busy: false, renderer: 'flat' });
      await click('next');await poll('window.pitchReview.state().phase === "question-hold"',5000);
      await expectState('Flat fallback supports Beat 3',{scene:'question',phase:'question-hold',progress:1,busy:false,renderer:'flat'});
      await screenshot('13-flat-question.png','flat');
      const flatBackdrop=await evaluate(`(() => {const canvas=document.querySelector('canvas[aria-label="Flat schematic regional fallback"]'),earth=document.getElementById('earth-backdrop');return {alpha:canvas.getContext('2d').getImageData(0,0,1,1).data[3],earth:earth?Number(getComputedStyle(earth).opacity):0};})()`);
      assert('Flat fallback also reveals the Earth backdrop',flatBackdrop.alpha===0&&flatBackdrop.earth===1,flatBackdrop);
      await stable('Flat question remains held',{scene:'question',phase:'question-hold',progress:1,busy:false,renderer:'flat'});
      await click('next');await poll('window.pitchReview.state().phase === "factory-hold"',8000);
      await expectState('Projected factory fallback reaches the same hold',{scene:'factory',phase:'factory-hold',progress:1,busy:false,renderer:'flat'});
      await screenshot('18-flat-factory.png','flat');
      assert('WebGL reference exists for factory fallback comparison',!!factoryReference);
      if(factoryReference){
        const difference=await evaluate(`(async () => {
          const image=new Image();image.src=${JSON.stringify(factoryReference)};await image.decode();
          const reference=document.createElement('canvas');reference.width=1440;reference.height=900;const ctx=reference.getContext('2d');ctx.drawImage(image,0,0);
          const fallback=document.querySelector('canvas[aria-label="Projected fictional factory fallback"]').getContext('2d');
          const a=ctx.getImageData(550,280,580,375).data,b=fallback.getImageData(550,280,580,375).data;let sum=0;
          for(let i=0;i<a.length;i+=4)for(let j=0;j<3;j++)sum+=Math.abs(a[i+j]-b[i+j]);
          return {meanRGBDifference:sum/(a.length/4*3),region:'warehouse, doors and silos'};
        })()`);
        assert('Fallback retains WebGL factory surfaces without door/wall occlusion',difference.meanRGBDifference<2,difference);
      }
      await click('next');await poll('window.pitchReview.state().phase === "suppliers-hold"',10000);
      await expectState('SVG arrivals work after the projected factory fallback',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      await screenshot('26-fallback-suppliers.png','svg');
      await click('next');await poll('window.pitchReview.state().phase === "check-hold"',5000);
      await expectState('Cream question works after the factory fallback',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
      await screenshot('32-fallback-check.png','html');
      await click('next');await poll('window.pitchReview.state().phase === "evidence-hold"',5000);
      await expectState('Concept reveal works after factory fallback',{scene:'evidence',evidenceStep:0,progress:1,busy:false,renderer:'html'});
      await seek('evidence',1,7);await screenshot('45-fallback-evidence-close.png','html');
      await seek('evidence',1,0);await click('previous');await expectState('Concept returns to the question after fallback',{scene:'check',phase:'check-hold',progress:1,busy:false});
      await click('previous');await expectState('Cream question returns to fallback suppliers',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
      await click('previous');await expectState('Supplier return preserves the factory fallback',{scene:'factory',phase:'factory-hold',progress:1,busy:false,renderer:'flat'});
      await click('previous');await expectState('Projected factory returns to question',{scene:'question',phase:'question-hold',progress:1,busy:false,renderer:'flat'});
      await click('previous');await expectState('Flat question returns to regional hold',{scene:'region',phase:'region-hold',progress:1,busy:false,renderer:'flat'});
      await click('previous'); await frames();
      await expectState('Flat Previous returns city hold', { phase: 'city-hold', scene: 'city', progress: 1, month: 'January', renderer: 'flat' });
      await click('restart'); await frames();
      await expectState('Flat restart returns ready', { phase: 'ready', scene: 'city', progress: 0, month: 'October', busy: false, renderer: 'flat' });
      await navigate(normalURL.href, 'context-loss');
      await seek('region',1);
      const extension = await evaluate(`(() => {const gl=document.getElementById('terrain').getContext('webgl');const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return false;ext.loseContext();return true;})()`);
      assert('Context-loss test extension available', extension);
      if(extension){
        await poll('window.pitchReview.state().renderer === "flat"',10000);
        await expectState('Context loss retains region hold in flat fallback', {phase:'region-hold',scene:'region',progress:1,busy:false,renderer:'flat'});
        await screenshot('06-context-loss.png','flat');
        await seek('question',1);
        await expectState('Beat 3 survives a lost WebGL context',{scene:'question',phase:'question-hold',progress:1,busy:false,renderer:'flat'});
        await screenshot('14-context-loss-question.png','flat');
        await seek('factory',1);
        await expectState('Factory renderer is independent of regional context loss',{scene:'factory',phase:'factory-hold',progress:1,busy:false,renderer:'webgl'});
        const factoryExtension=await evaluate(`(() => {const gl=document.getElementById('factory-canvas').getContext('webgl');const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return false;ext.loseContext();return true;})()`);
        assert('Factory context-loss test extension available',factoryExtension);
        if(factoryExtension){
          await poll('window.pitchReview.state().renderer === "flat"',10000);
          await expectState('Factory context loss preserves the claim hold',{scene:'factory',phase:'factory-hold',progress:1,busy:false,renderer:'flat'});
          await screenshot('19-context-loss-factory.png','flat');
          await click('next');await poll('window.pitchReview.state().phase === "suppliers-hold"',10000);
          await expectState('SVG supplier arrivals survive lost WebGL contexts',{scene:'suppliers',phase:'suppliers-hold',progress:1,busy:false,renderer:'svg'});
          await screenshot('27-context-loss-suppliers.png','svg');
          await click('next');await poll('window.pitchReview.state().phase === "check-hold"',5000);
          await expectState('Cream question survives lost WebGL contexts',{scene:'check',phase:'check-hold',progress:1,busy:false,renderer:'html'});
          await screenshot('33-context-loss-check.png','html');
          await click('next');await poll('window.pitchReview.state().phase === "evidence-hold"',5000);
          await expectState('Concept survives both lost WebGL contexts',{scene:'evidence',evidenceStep:0,progress:1,busy:false,renderer:'html'});
          await seek('evidence',1,6);await screenshot('46-context-loss-evidence-compare.png','html');
        }
      }
    });
    await sleep(200);
    await Promise.all([...interceptionJobs]);
  } catch (error) {
    report.fatalErrors.push(safeText(error.stack ?? error));
    record('QA harness completed', false, { error: safeText(error.message) });
  } finally {
    for (const name of expectedSections) if (!completedSections.has(name)) record(name, false, { status: 'not-run', reason: 'Setup or earlier fatal blocker' });
    const failures = report.runtimeMessages.filter(message => ['exception','error'].includes(message.type));
    assert('No runtime exceptions or console errors', failures.length === 0 && completedSections.size === expectedSections.length,
      { messages: failures, sectionsAttempted: [...completedSections] });
    const httpErrors = report.networkRequests.filter(r => r.event === 'response' && r.status >= 400);
    assert('No HTTP error responses', httpErrors.length === 0, { responses: httpErrors });
    const external = report.networkRequests.filter(r => r.event === 'interception' && r.decision === 'block');
    assert('No external network dependencies attempted', external.length === 0, { blocked: external });
    const filenames = ['01-clear.png','02-haze.png','03-ascent.png','04-region.png','05-flat.png','11-beat3-question.png','13-flat-question.png','14-context-loss-question.png','15-factory.png','16-factory-clouds.png','18-flat-factory.png','19-context-loss-factory.png','20-factory-arrival.png','21-suppliers.png','22-supplier-pullback.png','23-trucks-in-motion.png','24-suppliers-widescreen.png','25-suppliers-mac.png','26-fallback-suppliers.png','27-context-loss-suppliers.png','28-check-question.png','29-check-reveal.png','30-check-widescreen.png','31-check-mac.png','32-fallback-check.png','33-context-loss-check.png'];
    const evidenceFiles=['34-evidence-document.png','35-evidence-review.png','36-evidence-origin.png','37-evidence-production.png','38-evidence-burn.png','39-evidence-supply.png','40-evidence-compare.png','41-evidence-close.png'];
    const required=options.section?options.section==='Beat 7 evidence reveals'?evidenceFiles:[]:[...filenames,...evidenceFiles];
    assert('All required story screenshots captured this run', required.every(name => report.evidence.some(item => item.path.endsWith(`/${name}`))),
      { expected: required, captured: report.evidence.map(item => item.path) });
    client?.close();
    if (targetId) {
      try {
        const response = await fetch(new URL(`/json/close/${encodeURIComponent(targetId)}`, options.cdp), { signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch (error) { report.notes.push(`Could not close the QA-created tab: ${safeText(error.message)}`); }
    }
    report.finishedAt = new Date().toISOString();
    report.durationMs = Date.now() - started;
    report.summary = { checks: report.checks.length, passed: report.checks.filter(c => c.pass).length,
      failed: report.checks.filter(c => !c.pass).length, screenshots: report.evidence.length,
      exceptionsAndConsoleErrors: failures.length, blockedExternalRequests: external.length };
    report.pass = report.summary.failed === 0 && report.fatalErrors.length === 0;
    const json = JSON.stringify(report, null, 2);
    try { await mkdir(options.out, {recursive:true}); await writeFile(`${options.out.replace(/\/$/,'')}/report.json`, `${json}\n`); }
    catch (error) { report.pass = false; console.error(`Cannot save report: ${safeText(error.message)}`); }
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.pass ? 0 : 1;
  }
}
try {
  const options = parseArgs(process.argv.slice(2));
  if (options) await main(options);
} catch (error) {
  console.error(safeText(error.message));
  process.exitCode = 1;
}
