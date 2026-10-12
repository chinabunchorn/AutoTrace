/* Authored fictional Factory A and speaker. No sourcing, location or emissions evidence.
 * Native WebGL geometry; the Canvas2D fallback projects the same triangles.
 */
(() => {
  'use strict';
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const dot=(a,b)=>a.reduce((v,n,i)=>v+n*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
  const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  function multiply(a,b){const out=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;}
  function lookAt(eye,target){const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
  function perspective(aspect){const f=1/Math.tan(43*Math.PI/360),near=.1,far=180;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);}
  function project(p,m,w,h){const q=[0,0,0,0],v=[...p,1];for(let r=0;r<4;r++)for(let c=0;c<4;c++)q[r]+=m[c*4+r]*v[c];return {x:(q[0]/q[3]*.5+.5)*w,y:(.5-q[1]/q[3]*.5)*h,z:q[2]/q[3],visible:q[3]>0};}
  function model(){
    const triangles=[],light=norm([-.4,1,.65]);let subject='yard';
    const cream=[.84,.85,.71],wall=[.89,.88,.75],roof=[.29,.43,.33],glass=[.27,.42,.38],suit=[.18,.31,.25],skin=[.73,.55,.39];
    function tri(a,b,c,color){const shade=.7+Math.abs(dot(norm(cross(sub(b,a),sub(c,a))),light))*.3;triangles.push({points:[a,b,c],color:color.map(v=>v*shade),subject});}
    function quad(a,b,c,d,color){tri(a,b,c,color);tri(a,c,d,color);}
    function box(center,size,color){
      const [x,y,z]=center,[w,h,d]=size.map(v=>v/2),p=[[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y+h,z-d],[x-w,y+h,z-d],[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]];
      for(const ids of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]])quad(...ids.map(i=>p[i]),color);
    }
    function cylinder(center,radius,height,color,sides=10,topRadius=radius){
      const [x,y,z]=center;
      for(let i=0;i<sides;i++){
        const a=i*Math.PI*2/sides,b=(i+1)*Math.PI*2/sides;
        const low=v=>[x+Math.cos(v)*radius,y,z+Math.sin(v)*radius],high=v=>[x+Math.cos(v)*topRadius,y+height,z+Math.sin(v)*topRadius];
        quad(low(a),low(b),high(b),high(a),color);tri([x,y+height,z],high(a),high(b),color);
      }
    }
    function sphere(center,radius,color,rows=5,sides=8){
      const p=(r,s)=>{const a=r*Math.PI/rows,b=s*Math.PI*2/sides;return [center[0]+Math.sin(a)*Math.cos(b)*radius[0],center[1]+Math.cos(a)*radius[1],center[2]+Math.sin(a)*Math.sin(b)*radius[2]];};
      for(let r=0;r<rows;r++)for(let s=0;s<sides;s++)quad(p(r,s),p(r+1,s),p(r+1,s+1),p(r,s+1),color);
    }
    function beam(a,b,width,color){
      const axis=norm(sub(b,a)),u=norm(cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=cross(axis,u);
      const ring=(p,i)=>{const angle=i*Math.PI/3;return p.map((n,j)=>n+width*(u[j]*Math.cos(angle)+v[j]*Math.sin(angle)));};
      for(let i=0;i<6;i++)quad(ring(a,i),ring(b,i),ring(b,i+1),ring(a,i+1),color);
    }
    // A fictional landscaped yard, not a crop-origin parcel or transport record.
    quad([-14,-.03,-11],[14,-.03,-11],[14,-.03,10],[-14,-.03,10],[.76,.81,.67]);
    quad([-10,0,-4],[-4,0,-6],[-1,0,8],[-9,0,9],[.8,.83,.7]);
    quad([-8,.015,2.7],[10,.015,2.7],[12,.015,6.5],[-10,.015,6.5],[.85,.84,.71]);
    for(let i=0;i<9;i++)box([i*1.5-5,.03,5.8],[.6,.025,.05],[.95,.93,.82]);
    // Warehouse with a pitched roof, roller doors, office and grain-storage silos.
    subject='factory';
    box([2,1.5,-1],[7,3,4],wall);
    tri([-1.5,3,1],[5.5,3,1],[2,4.45,1],cream);
    tri([-1.5,3,-3],[2,4.45,-3],[5.5,3,-3],cream);
    quad([-1.65,3,1.15],[-1.65,3,-3.15],[2,4.45,-3.15],[2,4.45,1.15],roof);
    quad([2,4.45,1.15],[2,4.45,-3.15],[5.65,3,-3.15],[5.65,3,1.15],[.38,.51,.39]);
    for(const x of [-.2,3.7]){
      box([x,1.05,1.03],[1.6,2.1,.04],[.46,.54,.43]);
      for(let y=.3;y<2;y+=.22)box([x,y,1.06],[1.55,.025,.025],[.63,.69,.55]);
      box([x,2.25,1.4],[2,.1,1.2],roof);
    }
    box([6.5,1.1,1],[2.4,2.2,3],cream);box([6.5,2.23,1],[2.6,.16,3.2],roof);
    for(const x of [5.85,6.55,7.25])box([x,1.45,2.53],[.48,.7,.035],glass);
    for(const x of [6.6,8.5]){
      cylinder([x,0,-3.6],.72,4.4,[.72,.76,.65]);cylinder([x,4.4,-3.6],.76,.7,cream,10,0);
      for(const y of [1,2.2,3.5])cylinder([x,y,-3.6],.733,.05,[.48,.57,.46]);
    }
    // Faceted trees at the edge of the fictional yard; no chimneys or emissions.
    subject='yard';
    for(const [x,z,s] of [[-7,-4,1],[9,-7,1.2],[-8,1,.9],[11,2,.85]]){
      cylinder([x,0,z],.12,1.2,[.47,.41,.28],6);
      cylinder([x,.9,z],.9*s,1.4*s,[.43,.57,.39],7,0);
      cylinder([x,1.5*s,z],.65*s,1.4*s,[.5,.62,.42],7,0);
    }
    // Businessman in a green suit, white shirt and tie, with an open-handed pose.
    subject='speaker';
    const x=-4.1,z=3.4;
    for(const side of [-1,1]){
      box([x+side*.19,.83,z],[.3,1.5,.36],[.16,.25,.21]);
      box([x+side*.19,.12,z+.12],[.36,.2,.6],[.16,.19,.16]);
    }
    box([x,2.2,z],[.88,1.35,.48],suit);
    tri([x-.25,2.88,z+.25],[x+.25,2.88,z+.25],[x,2.04,z+.25],[.94,.92,.8]);
    tri([x-.05,2.8,z+.26],[x+.05,2.8,z+.26],[x+.09,2.3,z+.26],[.45,.44,.27]);
    tri([x-.05,2.8,z+.26],[x+.09,2.3,z+.26],[x,2.18,z+.26],[.45,.44,.27]);
    cylinder([x,2.84,z],.15,.25,skin,8);
    sphere([x,3.37,z],[.34,.42,.31],skin);
    cylinder([x,3.57,z-.025],.32,.17,[.19,.2,.16],8,.23);
    for(const side of [-1,1])box([x+side*.115,3.4,z+.292],[.035,.036,.035],[.17,.19,.16]);
    sphere([x,3.31,z+.31],[.065,.065,.09],skin,3,6);
    box([x,3.16,z+.279],[.12,.018,.018],[.4,.29,.23]);
    beam([x-.46,2.72,z],[x-.59,1.84,z+.05],.17,suit);
    sphere([x-.59,1.76,z+.05],[.16,.18,.15],skin,3,6);
    beam([x+.46,2.72,z],[x+.83,2.3,z+.14],.17,suit);
    beam([x+.83,2.3,z+.14],[x+1.21,2.64,z+.26],.145,suit);
    sphere([x+1.32,2.69,z+.26],[.22,.12,.16],skin,3,6);
    return triangles;
  }
  class PitchFactory {
    constructor(canvas,label,onFallback){
      this.canvas=canvas;this.label=label;this.onFallback=onFallback;this.kind='flat';this.progress=1;this.triangles=model();
      if(new URLSearchParams(location.search).get('flat')!=='1'){
        try{this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});if(this.gl){this.setup();this.kind='webgl';}}
        catch(error){this.reason=String(error.message);this.gl=null;}
      }
      if(this.kind==='flat')this.makeFallback();
      canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.kind='flat';this.makeFallback();this.render(this.progress);if(this.onFallback)this.onFallback();});
    }
    setup(){
      const gl=this.gl;
      const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
      this.program=gl.createProgram();
      gl.attachShader(this.program,shader(gl.VERTEX_SHADER,'attribute vec3 position;attribute vec3 color;uniform mat4 matrix;varying vec3 vColor;void main(){vColor=color;gl_Position=matrix*vec4(position,1.0);}'));
      gl.attachShader(this.program,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 vColor;void main(){gl_FragColor=vec4(vColor,1.0);}'));
      gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(this.program));
      this.position=gl.getAttribLocation(this.program,'position');this.color=gl.getAttribLocation(this.program,'color');this.uniform=gl.getUniformLocation(this.program,'matrix');
      const data=this.triangles.flatMap(t=>t.points.flatMap(p=>[...p,...t.color]));
      this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);this.count=data.length/6;
    }
    makeFallback(){
      if(!this.flatCanvas){this.flatCanvas=document.createElement('canvas');this.flatCanvas.setAttribute('aria-label','Projected fictional factory fallback');this.flatCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';this.canvas.after(this.flatCanvas);}
      this.flat=this.flatCanvas.getContext('2d');this.canvas.style.visibility='hidden';
    }
    render(progress){
      this.progress=progress;const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;
      const dpr=Math.min(devicePixelRatio||1,2),t=progress*progress*(3-2*progress),factor=Math.max(1,1.32/(w/h));
      const target=[1,1.8,0],offset=mix([14,26,22],[10,5.6,17],t),eye=target.map((v,i)=>v+offset[i]*factor);
      const matrix=multiply(perspective(w/h),lookAt(eye,target));
      this.framing=Object.fromEntries(['factory','speaker'].map(subject=>{
        const p=this.triangles.filter(t=>t.subject===subject).flatMap(t=>t.points.map(v=>project(v,matrix,w,h)));
        return [subject,{left:Math.min(...p.map(v=>v.x)),right:Math.max(...p.map(v=>v.x)),top:Math.min(...p.map(v=>v.y)),bottom:Math.max(...p.map(v=>v.y))}];
      }));
      if(this.kind==='webgl'){
        const gl=this.gl,width=Math.round(w*dpr),height=Math.round(h*dpr);
        if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
        gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.useProgram(this.program);gl.uniformMatrix4fv(this.uniform,false,matrix);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(this.color);gl.vertexAttribPointer(this.color,3,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,this.count);
      }else{
        // Software depth testing avoids painter-order errors on overlapping walls,
        // doors and silo bands. CSS-pixel resolution bounds CPU work on high-DPI displays.
        const canvas=this.flatCanvas,ctx=this.flat,width=Math.round(w),height=Math.round(h);
        if(canvas.width!==width||canvas.height!==height||!this.pixels){canvas.width=width;canvas.height=height;this.pixels=ctx.createImageData(width,height);this.depth=new Float64Array(width*height);this.flatStamp=null;}
        const stamp=[progress,width,height].join(':');
        if(this.flatStamp!==stamp){
          const pixels=this.pixels.data,depth=this.depth;pixels.fill(0);depth.fill(Infinity);
          const edge=(a,b,x,y)=>(b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x);
          for(const triangle of this.triangles){
            const [a,b,c]=triangle.points.map(v=>project(v,matrix,width,height));if(!a.visible||!b.visible||!c.visible)continue;
            const area=edge(a,b,c.x,c.y);if(Math.abs(area)<1e-8)continue;
            const left=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),right=Math.min(width-1,Math.ceil(Math.max(a.x,b.x,c.x)));
            const top=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),bottom=Math.min(height-1,Math.ceil(Math.max(a.y,b.y,c.y)));
            const dx0=(b.y-c.y)/area,dx1=(c.y-a.y)/area,color=triangle.color.map(v=>Math.round(v*255));
            const dz=dx0*(a.z-c.z)+dx1*(b.z-c.z);
            for(let y=top;y<=bottom;y++){
              let u=edge(b,c,left+.5,y+.5)/area,v=edge(c,a,left+.5,y+.5)/area,z=u*a.z+v*b.z+(1-u-v)*c.z;
              for(let x=left;x<=right;x++,u+=dx0,v+=dx1,z+=dz){
                if(u<0||v<0||u+v>1||z< -1||z>1)continue;
                const i=y*width+x;if(z>=depth[i])continue;depth[i]=z;const j=i*4;
                pixels[j]=color[0];pixels[j+1]=color[1];pixels[j+2]=color[2];pixels[j+3]=255;
              }
            }
          }
          ctx.putImageData(this.pixels,0,0);this.flatStamp=stamp;
        }
      }
      const p=project([2,2.63,1.06],matrix,w,h);this.label.style.left=p.x+'px';this.label.style.top=p.y+'px';this.label.style.display=p.visible?'':'none';
    }
  }
  window.PitchFactory=PitchFactory;
})();
