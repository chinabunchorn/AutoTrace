/* Fictional supply-network illustration. No geographic, logistics or procurement evidence.
 * story-origin-01 is a recurring narrative symbol, not a product AOI or crop polygon.
 */
(() => {
  'use strict';
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=(a,b,value)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  const locations=[
    {id:'01',x:250,y:190,selected:true,path:'M375 190C525 190 500 276 650 276S815 352 925 352H1090'},
    {id:'02',x:280,y:360,selected:false,path:'M397 360C560 360 530 418 715 418H1090'},
    {id:'03',x:230,y:530,selected:false,path:'M345 530C510 530 525 560 650 560S820 484 930 484H1090'},
  ];
  const plant=`<path d="M0 18V-23M0-6C-13-7-17-16-17-16S-3-17 0-6M0 3C13 1 17-8 17-8S3-7 0 3" fill="none" stroke="#5c7850" stroke-width="3" stroke-linecap="round"/><path d="M-4-18L0-33L4-18Z" fill="#b39752"/>`;
  function node(location){
    const {id,x,y,selected}=location;
    return `<g class="supply-node" id="supply-node-${id}" data-origin-id="story-origin-${id}" data-selected="${selected}" transform="translate(${x} ${y})">
      <ellipse cx="0" cy="0" rx="${selected?139:120}" ry="83" fill="${selected?'#e1e6cf':'#e9eadd'}" stroke="${selected?'#193f31':'#d5ddca'}" stroke-width="${selected?3:1.5}"/>
      <g transform="translate(0 -28) scale(.72)">
        <path d="M-83-30L40-54L83 18L-42 42Z" fill="#b6c6a1"/>
        <path d="M-83-30L-42 42M-50-37L-10 36M-19-43L21 30M10-49L51 24M40-54L83 18" fill="none" stroke="#8fa67d" stroke-width="3"/>
        <g transform="translate(-42 -4)">${plant}</g><g transform="translate(4 -13)">${plant}</g><g transform="translate(40 6)">${plant}</g>
      </g>
      <text class="supply-name" x="0" y="35" text-anchor="middle">Supplier ${id}</text>
      <text class="supply-detail" x="0" y="70" text-anchor="middle" lang="th">${selected?'แหล่งปลูกที่เลือก':'ผู้ส่งมอบสมมติ'}</text>
      ${selected?'<g class="supply-selection"><circle cx="-89" cy="-105" r="4" fill="#193f31"/><text x="-75" y="-98">Selected origin</text></g>':''}
    </g>`;
  }
  class PitchSuppliers {
    constructor(svg){
      this.svg=svg;this.kind='svg';
      // All markup is authored, fixed illustration content; never insert uploaded text here.
      svg.innerHTML=`<title>Fictional suppliers delivering corn to Factory A</title><desc>Three fictional supplier origins and illustrative routes. The highlighted story origin is not a geographic AOI, measured crop polygon, real source or transport record.</desc>
      <defs>
        <g id="supply-truck-shape">
          <ellipse cx="-1" cy="2" rx="35" ry="13" fill="#193f3114"/>
          <rect x="-28" y="-11" width="36" height="22" rx="2" fill="#d8cda4" stroke="#7d8767" stroke-width="1.5"/>
          <path d="M-22-6H2M-22 0H2M-22 6H2" stroke="#b4a77d" stroke-width="1.5"/>
          <path d="M9-10H23L32-5V7L23 10H9Z" fill="#f7f6f0" stroke="#56705b" stroke-width="1.5"/>
          <path d="M21-7L28-3V4L21 7Z" fill="#68867a"/>
          <rect x="-23" y="-14" width="9" height="4" rx="1" fill="#33483b"/><rect x="-23" y="10" width="9" height="4" rx="1" fill="#33483b"/>
          <rect x="16" y="-13" width="8" height="3" rx="1" fill="#33483b"/><rect x="16" y="10" width="8" height="3" rx="1" fill="#33483b"/>
        </g>
      </defs>
      <g aria-hidden="true" class="supply-landscape">
        <path d="M0 58C255 10 402 98 585 43S961 84 1134 52S1444 95 1600 36V184C1412 245 1138 156 963 214S583 176 368 206S100 175 0 213Z" fill="#e8ecde"/>
        <path d="M615 83L790 50L886 127L701 158Z" fill="#dde5d2"/><path d="M779 52L828 128M736 63L790 139M689 71L748 145" stroke="#cbd8bc" stroke-width="2"/>
        <path d="M678 620L851 601L950 662L767 700Z" fill="#e2e8d8"/><path d="M826 608L894 684M785 612L853 690M740 618L806 695" stroke="#cfdcc3" stroke-width="2"/>
        <path d="M521 144C530 262 453 400 514 524S466 646 550 720" fill="none" stroke="#d0dfd6" stroke-width="15" stroke-linecap="round"/>
      </g>
      <g class="supply-roads">${locations.map(r=>`<path d="${r.path}" fill="none" stroke="#dadfcd" stroke-width="23" stroke-linecap="round"/><path class="supply-route" id="supply-route-${r.id}" d="${r.path}" fill="none" stroke="${r.selected?'#758b66':'#a7b59a'}" stroke-width="3" stroke-dasharray="5 11" stroke-linecap="round"/>`).join('')}</g>
      ${locations.map(node).join('')}
      <g id="supply-factory" aria-label="Fictional Factory A">
        <ellipse cx="1272" cy="454" rx="250" ry="124" fill="#e1e6d6"/>
        <path d="M1040 313H1490V522H1040Z" fill="#eeede1"/>
        <path d="M1041 375H1112M1041 442H1112M1041 508H1112" stroke="#c8d2bd" stroke-width="3"/>
        <g fill="#bfc9b2" stroke="#8fa17f" stroke-width="1.5">
          <path d="M1410 332H1449V457H1410ZM1410 332L1429 313L1449 332Z"/>
          <path d="M1463 341H1502V466H1463ZM1463 341L1482 322L1502 341Z"/>
          <path d="M1411 369H1448M1411 405H1448M1464 378H1501M1464 414H1501" fill="none"/>
        </g>
        <path d="M1145 363H1305V473H1145Z" fill="#d8dcc4"/>
        <path d="M1305 363L1395 327V437L1305 473Z" fill="#bbc8ad"/>
        <path d="M1145 363L1225 300L1305 363Z" fill="#e3e3cd"/>
        <path d="M1145 363L1225 300L1315 270L1235 333Z" fill="#577451"/>
        <path d="M1225 300L1315 270L1395 327L1305 363Z" fill="#3e6149"/>
        <path d="M1162 405H1201V473H1162ZM1244 405H1283V473H1244Z" fill="#7d9270"/>
        <path d="M1165 418H1198M1165 431H1198M1165 444H1198M1247 418H1280M1247 431H1280M1247 444H1280" stroke="#b2bfa2" stroke-width="1.5"/>
        <path d="M1326 454H1427V503H1326Z" fill="#d4dcc3"/>
        <path d="M1326 454L1356 437H1457L1427 454Z" fill="#45664d"/>
        <path d="M1340 468H1356V487H1340ZM1370 468H1386V487H1370ZM1400 468H1416V487H1400Z" fill="#537763"/>
        <text class="supply-destination" x="1280" y="220" text-anchor="middle">Factory A</text>
        <text class="supply-detail" x="1280" y="249" text-anchor="middle" lang="th">โรงงานสมมติ</text>
      </g>
      <g class="supply-trucks">${locations.map(r=>`<g class="supply-truck" id="supply-truck-${r.id}" data-supplier="${r.id}" aria-label="Illustrative truck from Supplier ${r.id}"><use href="#supply-truck-shape"/></g>`).join('')}</g>`;
      this.routes=locations.map(r=>{
        const path=svg.querySelector('#supply-route-'+r.id);
        return {path,length:path.getTotalLength(),truck:svg.querySelector('#supply-truck-'+r.id)};
      });
    }
    render(progress){
      this.routes.forEach((route,index)=>{
        const travel=smooth(.34+index*.04,.86+index*.04,progress),distance=route.length*travel;
        const point=route.path.getPointAtLength(distance),before=route.path.getPointAtLength(Math.max(0,distance-.5)),after=route.path.getPointAtLength(Math.min(route.length,distance+.5));
        const angle=Math.atan2(after.y-before.y,after.x-before.x)*180/Math.PI;
        route.truck.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle})`);
        route.truck.dataset.travel=travel;route.truck.dataset.x=point.x;route.truck.dataset.y=point.y;
      });
    }
  }
  window.PitchSuppliers=PitchSuppliers;
})();
