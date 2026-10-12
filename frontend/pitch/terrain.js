/* Authored schematic terrain: not surveyed borders, elevation or observed fires.
 * Native WebGL, no external dependencies. Canvas2D is the deliberate fallback.
 */
(() => {
  'use strict';
  const countries = [
    {name:'THAILAND', color:[.48,.61,.43], label:[100.9,17.1], ring:[[97.9,19.6],[99.1,20.4],[100.3,19.9],[100.5,18.4],[101.3,18.1],[102.1,18.4],[103.5,18.3],[104.9,17.3],[105.5,15.4],[104.7,14.4],[102.9,14.1],[102.4,12.7],[101.7,12.1],[100.9,13.3],[100.5,13.6],[100.0,13.3],[99.9,11.9],[100.2,10.1],[100.7,8.0],[101.3,6.7],[100.5,6.1],[99.5,7.2],[98.7,8.6],[98.5,10.2],[99.0,11.4],[99.0,13.0],[98.2,14.5],[98.7,16.0],[97.5,17.5],[97.9,19.6]]},
    {name:'MYANMAR', color:[.36,.49,.39], label:[96.8,19.8], ring:[[94.4,22.6],[97.0,23.3],[99.1,22.1],[99.1,20.4],[97.9,19.6],[97.5,17.5],[98.7,16.0],[98.2,14.5],[99.0,13.0],[98.9,11.5],[98.4,10.6],[97.6,13.0],[96.8,15.7],[95.5,16.1],[94.2,18.1],[94.4,22.6]]},
    {name:'LAOS', color:[.57,.64,.46], label:[103.0,20.0], ring:[[100.3,19.9],[101.0,21.8],[102.1,22.2],[103.5,20.6],[104.4,19.3],[105.3,18.4],[106.7,16.4],[106.5,14.4],[105.5,15.4],[104.9,17.3],[103.5,18.3],[102.1,18.4],[101.3,18.1],[100.5,18.4],[100.3,19.9]]},
    {name:'CAMBODIA', color:[.61,.65,.50], label:[104.4,12.1], ring:[[102.9,14.1],[104.7,14.4],[106.5,14.4],[107.5,13.2],[106.0,10.6],[103.6,10.4],[102.4,12.7],[102.9,14.1]]},
    {name:'VIETNAM', color:[.49,.57,.42], label:[108.0,16.6], ring:[[102.1,22.2],[104.7,22.8],[106.8,21.1],[106.0,19.0],[107.9,16.5],[109.5,13.1],[108.4,11.0],[105.0,9.1],[104.5,10.3],[106.0,10.6],[107.5,13.2],[106.5,14.4],[106.7,16.4],[105.3,18.4],[104.4,19.3],[103.5,20.6],[102.1,22.2]]}
  ];
  const markers = [[98.7,18.8],[99.4,19.3],[99.7,18.4],[100.3,18.9],[99.2,17.6],[100.6,17.8],[101.1,17.0],[103.4,16.7],[102.9,15.3],[99.4,15.5],[96.5,19.4],[97.0,20.7],[102.1,20.3],[104.0,18.7]];
  const xyz = (lon,lat,y=0) => [(lon-100.5)*.82,y,(15.5-lat)*.92];
  const inside = (p,ring) => {
    let hit=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      const a=ring[i],b=ring[j];
      if((a[1]>p[1])!==(b[1]>p[1]) && p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) hit=!hit;
    }
    return hit;
  };
  function height(x,z){return .18+Math.max(0,-z)*.075+Math.max(0,Math.sin(x*2.2+z*.7)*Math.cos(z*1.6))*.38;}
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const dot=(a,b)=>a.reduce((v,n,i)=>v+n*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
  const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  function multiply(a,b){const out=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;}
  function lookAt(eye,target){const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
  function perspective(aspect){const f=1/Math.tan(43*Math.PI/360),near=.1,far=100;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);}
  function project(p,m,w,h){const q=[0,0,0,0],v=[...p,1];for(let r=0;r<4;r++)for(let c=0;c<4;c++)q[r]+=m[c*4+r]*v[c];return {x:(q[0]/q[3]*.5+.5)*w,y:(.5-q[1]/q[3]*.5)*h,visible:q[3]>0};}
  const labels=countries.slice(0,3).map(c=>({name:c.name,point:xyz(...c.label,1.2)})).concat([{name:'Bangkok',point:xyz(100.5,13.7,.35),capital:true}]);

  class PitchTerrain {
    constructor(canvas,host,onFallback){
      this.canvas=canvas;this.host=host;this.onFallback=onFallback;this.kind='flat';this.progress=1;this.matrix=null;
      this.labels=labels.map(label=>{const el=document.createElement('span');el.className='map-label'+(label.capital?' capital':'');el.textContent=label.name;host.append(el);return {...label,el};});
      this.forceFlat=new URLSearchParams(location.search).get('flat')==='1';
      if(!this.forceFlat){
        try{this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});if(this.gl){this.setup();this.kind='webgl';}}
        catch(error){this.reason=String(error.message);this.gl=null;}
      }
      if(this.kind==='flat')this.makeFallback();
      canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.kind='flat';this.makeFallback();this.render(this.progress);if(this.onFallback)this.onFallback();});
    }
    makeFallback(){
      if(!this.flatCanvas){this.flatCanvas=document.createElement('canvas');this.flatCanvas.setAttribute('aria-label','Flat schematic regional fallback');this.flatCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';this.canvas.after(this.flatCanvas);}
      this.flatCanvas.style.display='block';this.flat=this.flatCanvas.getContext('2d');this.canvas.style.visibility='hidden';
    }
    setup(){
      const gl=this.gl;
      const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
      const vs=shader(gl.VERTEX_SHADER,'attribute vec3 position;attribute vec4 color;uniform mat4 matrix;varying vec4 vColor;void main(){vColor=color;gl_Position=matrix*vec4(position,1.0);}');
      const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec4 vColor;uniform float appearance;void main(){gl_FragColor=vec4(vColor.rgb,vColor.a*appearance);}');
      this.program=gl.createProgram();gl.attachShader(this.program,vs);gl.attachShader(this.program,fs);gl.linkProgram(this.program);
      if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(this.program));
      this.position=gl.getAttribLocation(this.program,'position');this.color=gl.getAttribLocation(this.program,'color');this.uniform=gl.getUniformLocation(this.program,'matrix');
      this.appearance=gl.getUniformLocation(this.program,'appearance');
      const data=[];
      const triangle=(a,b,c,color,lit=true)=>{
        const n=norm(cross(sub(b,a),sub(c,a)));const light=lit?.78+Math.abs(dot(n,norm([-.4,1,.5])))*.22:1;
        for(const p of [a,b,c])data.push(...p,color[0]*light,color[1]*light,color[2]*light,color[3]??1);
      };

      for(let z=-7.9;z<9.0;z+=.32)for(let x=-5.4;x<7.6;x+=.32){
        const pts=[[x,z],[x+.32,z],[x+.32,z+.32],[x,z+.32]];
        for(const ids of [[0,1,2],[0,2,3]]){
          const mid=ids.reduce((a,i)=>[a[0]+pts[i][0]/3,a[1]+pts[i][1]/3],[0,0]);
          const ll=[mid[0]/.82+100.5,15.5-mid[1]/.92];const country=countries.find(c=>inside(ll,c.ring));if(!country)continue;
          const shade=1+Math.sin(mid[0]*23+mid[1]*17)*.07;
          triangle(...ids.map(i=>[pts[i][0],height(...pts[i]),pts[i][1]]),country.color.map(c=>c*shade));
        }
      }
      const terrainEnd=data.length/7;
      // Warm ground rings and tiny faceted flames. Every marker is authored fiction.
      const smoke=[];
      for(const [lon,lat] of markers){
        const [x,,z]=xyz(lon,lat),y=height(x,z)+.05;
        for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6;triangle([x,y,z],[x+Math.cos(a)*.23,y,z+Math.sin(a)*.23],[x+Math.cos(b)*.23,y,z+Math.sin(b)*.23],[.94,.37,.13,.85],false);}
        const base=[[x-.075,y,z-.065],[x+.075,y,z-.065],[x+.075,y,z+.065],[x-.075,y,z+.065]];
        for(let i=0;i<4;i++)triangle(base[i],base[(i+1)%4],[x,y+.35,z],[.98,.65,.18],false);
        // Save translucent plume triangles for a final pass after opaque terrain.
        for(let k=0;k<4;k++){
          const a=.15+k*.065,cy=y+.4+k*.29,cx=x+k*.08;
          const p=[[cx-a,cy,z],[cx,cy,z-a],[cx+a,cy,z],[cx,cy,z+a]],top=[cx,cy+a*.8,z],bottom=[cx,cy-a*.8,z];
          for(let i=0;i<4;i++)for(const tip of [top,bottom])for(const v of [p[i],p[(i+1)%4],tip])smoke.push(...v,.77,.79,.70,.16-k*.025);
        }
      }
      this.opaqueCount=data.length/7;data.push(...smoke);this.count=data.length/7;this.terrainCount=terrainEnd;
      this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
      const line=[];
      for(const c of countries){for(let i=0;i<c.ring.length-1;i++){const a=xyz(...c.ring[i]),b=xyz(...c.ring[i+1]);for(let k=0;k<8;k++){const p=mix(a,b,k/8),q=mix(a,b,(k+1)/8);for(const v of [p,q])line.push(v[0],height(v[0],v[2])+.045,v[2],.84,.88,.75,c.name==='THAILAND'?.7:.23);}}}
      this.lineBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.lineBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line),gl.STATIC_DRAW);this.lineCount=line.length/7;
    }
    bind(buffer){const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,3,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(this.color);gl.vertexAttribPointer(this.color,4,gl.FLOAT,false,28,12);}
    render(t){
      this.progress=t;const w=this.canvas.clientWidth,h=this.canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
      const b=xyz(100.5,13.7),target=mix([b[0],.2,b[2]],[.6,0,.2],t);
      const factor=w/h<.8?1.55:1;
      const eye=mix([b[0]+.4,2.0,b[2]+3.3],[8*factor,14*factor,15*factor],t);
      this.matrix=multiply(perspective(w/h),lookAt(eye,target));
      if(this.kind==='webgl'){
        const gl=this.gl;const width=Math.round(w*dpr),height=Math.round(h*dpr);
        if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
        gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);gl.uniformMatrix4fv(this.uniform,false,this.matrix);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
        this.bind(this.buffer);gl.uniform1f(this.appearance,1);gl.drawArrays(gl.TRIANGLES,0,this.terrainCount);
        gl.uniform1f(this.appearance,Math.max(0,Math.min(1,(t-.4)/.4)));
        gl.depthMask(false);gl.drawArrays(gl.TRIANGLES,this.terrainCount,this.count-this.terrainCount);
        gl.uniform1f(this.appearance,1);this.bind(this.lineBuffer);gl.drawArrays(gl.LINES,0,this.lineCount);gl.depthMask(true);
        for(const label of this.labels){const p=project(label.point,this.matrix,w,h);label.el.style.left=p.x+'px';label.el.style.top=p.y+'px';label.el.style.display=p.visible?'':'none';}
      }else this.drawFlat(w,h,dpr);
    }
    drawFlat(w,h,dpr){
      const canvas=this.flatCanvas,ctx=this.flat;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
      const scale=Math.min(w*.064,h*.047),center=[w*.59,h*.44];const screen=(lon,lat)=>[center[0]+(lon-100.5)*scale,center[1]+(15.5-lat)*scale];
      for(const c of countries){ctx.beginPath();c.ring.forEach(([lon,lat],i)=>{const p=screen(lon,lat);i?ctx.lineTo(...p):ctx.moveTo(...p);});ctx.closePath();ctx.fillStyle=`rgb(${c.color.map(v=>Math.round(v*255)).join(',')})`;ctx.fill();ctx.strokeStyle='#d3dec0';ctx.lineWidth=1;ctx.stroke();}
      for(const [lon,lat] of markers){const p=screen(lon,lat);ctx.fillStyle='#ca753633';ctx.beginPath();ctx.arc(...p,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ca7536';ctx.beginPath();ctx.arc(...p,3,0,Math.PI*2);ctx.fill();}
      for(const label of this.labels){const lon=label.point[0]/.82+100.5,lat=15.5-label.point[2]/.92,p=screen(lon,lat);label.el.style.left=p[0]+'px';label.el.style.top=p[1]+'px';label.el.style.display='';}
    }
    opacity(value){if(this.flatCanvas)this.flatCanvas.style.opacity=value;this.canvas.style.opacity=value;}
    transform(value){this.canvas.style.transform=value;if(this.flatCanvas)this.flatCanvas.style.transform=value;}
  }
  window.PitchTerrain=PitchTerrain;
})();
