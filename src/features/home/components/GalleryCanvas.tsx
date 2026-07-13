"use client";

import React, { useEffect, useRef } from "react";

const SRCS = [
  "/uploads/1777070729622_ue92qnwmv.webp",
  "/uploads/1779977660770_ohgkwi81t.webp",
  "/uploads/1779977775683_f64cek05f.webp",
  "/uploads/1779978098795_12c9r0.webp",
  "/uploads/1779978155818_7my48s.webp",
  "/uploads/1779979480050_heo3br.webp",
  "/uploads/1779979523189_zsx8dy.webp",
  "/uploads/1779980586976_djmyc0bwg.webp",
  "/uploads/1779981210614_z8anfkwt9.webp",
  "/uploads/1779981254652_qfiz1gi16.webp",
  "/uploads/1780056328682_yybq9j446hf.webp",
  "/uploads/1780323669967_full_k5z7gkgaj2c.webp",
  "/uploads/1780323976519_f19dh3fhdyf.webp",
  "/uploads/1780324529343_kxj6z5hrcbm.webp",
  "/uploads/1780331784203_flsv29g4i1h.webp",
  "/uploads/1780428783324_750zzldez.webp",
  "/uploads/1780428831123_f4n9ub1yb.webp",
  "/uploads/1780429768620_y9fl042td.webp",
  "/uploads/1780430074281_4p4lyyeur.webp",
  "/uploads/1780430134263_3j0n0pfv5.webp",
];

const SIZES = [
  [160,210],[220,280],[300,200],[130,170],[260,340],
  [180,120],[200,260],[340,230],[150,200],[280,190],
  [230,300],[170,220],[320,210],[140,180],[250,160],
  [190,250],[310,420],[120,160],[270,180],
];

const VS = `
attribute vec2 a_pos;
attribute vec2 a_uv;
uniform vec2 u_res;
uniform vec2 u_cam;
uniform float u_scale;
varying vec2 v_uv;
void main(){
  vec2 screen = (a_pos * u_scale + u_cam) / u_res * 2.0 - 1.0;
  screen.y = -screen.y;
  gl_Position = vec4(screen, 0, 1);
  v_uv = a_uv;
}`;

const FS = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_alpha;
uniform float u_bright;
uniform float u_time;
float rand(vec2 c){ return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec4 col = texture2D(u_tex, v_uv);
  float lum = dot(col.rgb, vec3(0.299,0.587,0.114));
  col.rgb = mix(vec3(lum), col.rgb, 0.07);
  col.rgb = (col.rgb - 0.5) * 1.06 * u_bright + 0.28 * u_bright;
  col.rgb += rand(v_uv + vec2(u_time*0.11, u_time*0.07)*180.0) * 0.09 - 0.045;
  col.rgb -= sin(gl_FragCoord.y * 3.14159 * 0.8) * 0.02;
  vec2 uvc = v_uv - 0.5;
  col.rgb *= max(1.0 - dot(uvc*1.3, uvc*1.3)*1.8, 0.2);
  col.rgb = clamp(col.rgb, 0.0, 1.0);
  gl_FragColor = vec4(col.rgb, u_alpha);
}`;

const FS_BG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;
float rand(vec2 c){ return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec3 col = vec3(0.017,0.016,0.016);
  float t = floor(u_time*24.0)/24.0;
  col += rand(uv*400.0+t*7.3)*0.05;
  col -= sin(gl_FragCoord.y*3.14159*0.75)*0.01;
  vec2 vu = uv-0.5;
  col *= max(1.0-dot(vu*1.7,vu*1.7)*1.3,0.0);
  float gt=floor(u_time*8.0);
  if(abs(uv.y-rand(vec2(gt,0.1)))<rand(vec2(gt,0.2))*0.004 && rand(vec2(gt,0.3))>0.7) col+=0.06;
  gl_FragColor = vec4(col,1.0);
}`;

const VS_FULL = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0,1); }`;

type PhotoTile = {
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  alpha: number;
  targetAlpha: number;
  bright: number;
  delay: number;
  revealAt?: number;
};

export const GalleryCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    camX: 0, camY: 0, camS: 1,
    tCamX: 0, tCamY: 0, tCamS: 1,
    prlX: 0, prlY: 0, tPrlX: 0, tPrlY: 0,
    mx: 0, my: 0, drag: false, smx: 0, smy: 0, scx: 0, scy: 0,
    startTime: 0,
    tileCache: new Map<string, PhotoTile[]>(),
    texCache: new Map<string, { tex: WebGLTexture | null, loaded: boolean }>(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const cur = curRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    stateRef.current.startTime = performance.now();
    stateRef.current.tCamX = window.innerWidth / 2;
    stateRef.current.tCamY = window.innerHeight / 2;
    stateRef.current.tCamS = 0.9;
    stateRef.current.camX = stateRef.current.tCamX;
    stateRef.current.camY = stateRef.current.tCamY;
    stateRef.current.camS = stateRef.current.tCamS;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function sh(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src); gl!.compileShader(s);
      return s;
    }
    function prog(vs: string, fs: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, sh(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(p, sh(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(p); return p;
    }

    const pPhoto = prog(VS, FS);
    const pBg = prog(VS_FULL, FS_BG);

    const L = {
      pos: gl.getAttribLocation(pPhoto, "a_pos"),
      uv: gl.getAttribLocation(pPhoto, "a_uv"),
      res: gl.getUniformLocation(pPhoto, "u_res"),
      cam: gl.getUniformLocation(pPhoto, "u_cam"),
      scale: gl.getUniformLocation(pPhoto, "u_scale"),
      tex: gl.getUniformLocation(pPhoto, "u_tex"),
      alpha: gl.getUniformLocation(pPhoto, "u_alpha"),
      bright: gl.getUniformLocation(pPhoto, "u_bright"),
      time: gl.getUniformLocation(pPhoto, "u_time"),
    };
    const LB = {
      pos: gl.getAttribLocation(pBg, "a_pos"),
      time: gl.getUniformLocation(pBg, "u_time"),
      res: gl.getUniformLocation(pBg, "u_res"),
    };

    const bgBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bgBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const qBuf = gl.createBuffer();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const { texCache, tileCache } = stateRef.current;

    function loadTex(src: string) {
      if (texCache.has(src)) return texCache.get(src)!;
      const e = { tex: null as WebGLTexture | null, loaded: false };
      texCache.set(src, e);
      const img = new Image();
      img.onload = () => {
        const tex = gl!.createTexture();
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
        e.tex = tex; e.loaded = true;
      };
      img.src = src;
      return e;
    }
    SRCS.forEach(s => loadTex(s));

    function rng(a: number, b: number, i = 0) {
      let h = a * 73856093 ^ b * 19349663 ^ i * 83492791;
      h = (h ^ (h >>> 16)) * 0x45d9f3b; h = (h ^ (h >>> 16)) * 0x45d9f3b; h ^= (h >>> 16);
      return (h >>> 0) / 0xffffffff;
    }

    const TILE = 420;
    const MARGIN = 2;

    function getTile(tx: number, ty: number) {
      const k = `${tx},${ty}`;
      if (tileCache.has(k)) return tileCache.get(k)!;
      const photos: PhotoTile[] = [];
      if (rng(tx, ty, 0) < 0.40) { tileCache.set(k, photos); return photos; }
      const si = Math.floor(rng(tx, ty, 1) * SIZES.length);
      const [w, h] = SIZES[si];
      const margin = 80;
      const px = tx * TILE + margin + rng(tx, ty, 2) * (TILE - w - margin * 2);
      const py = ty * TILE + margin + rng(tx, ty, 3) * (TILE - h - margin * 2);
      const src = SRCS[Math.floor(rng(tx, ty, 4) * SRCS.length)];
      const bright = 0.9 + Math.min(1.0, (w * h) / (300 * 400)) * 0.1;
      const delay = rng(tx, ty, 14) * 1.5;
      photos.push({ x: px, y: py, w, h, src, alpha: 0, targetAlpha: 1, bright, delay });
      if (rng(tx, ty, 5) > 0.45) {
        const si2 = Math.floor(rng(tx, ty, 6) * SIZES.length);
        const [w2, h2] = SIZES[si2];
        const px2 = tx * TILE + margin + rng(tx, ty, 7) * (TILE - w2 - margin * 2);
        const py2 = ty * TILE + margin + rng(tx, ty, 8) * (TILE - h2 - margin * 2);
        const src2 = SRCS[Math.floor(rng(tx, ty, 9) * SRCS.length)];
        const bright2 = 0.9 + Math.min(1.0, (w2 * h2) / (300 * 400)) * 0.1;
        const delay2 = delay + 0.4 + rng(tx, ty, 13) * 1.0;
        photos.push({ x: px2, y: py2, w: w2, h: h2, src: src2, alpha: 0, targetAlpha: 1, bright: bright2, delay: delay2 });
      }
      tileCache.set(k, photos);
      return photos;
    }

    const mousemove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.mx = e.clientX; s.my = e.clientY;
      if (cur) {
        cur.style.left = s.mx + "px";
        cur.style.top = s.my + "px";
      }
      if (!s.drag) {
        s.tPrlX = (s.mx - window.innerWidth / 2) * -0.10;
        s.tPrlY = (s.my - window.innerHeight / 2) * -0.10;
        return;
      }
      s.tCamX = s.scx + (s.mx - s.smx);
      s.tCamY = s.scy + (s.my - s.smy);
    };
    const mousedown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("nav")) return;
      const s = stateRef.current;
      s.drag = true; s.smx = s.mx; s.smy = s.my; s.scx = s.tCamX; s.scy = s.tCamY;
      if (cur) cur.classList.add("active");
    };
    const mouseup = () => { 
      stateRef.current.drag = false; 
      if (cur) cur.classList.remove("active");
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      const f = e.deltaY < 0 ? 1.1 : 0.91;
      const ns = Math.min(6, Math.max(0.05, s.tCamS * f));
      s.tCamX = s.mx - (s.mx - s.tCamX) * (ns / s.tCamS);
      s.tCamY = s.my - (s.my - s.tCamY) * (ns / s.tCamS);
      s.tCamS = ns;
    };
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "0") {
        const s = stateRef.current;
        s.tCamX = window.innerWidth / 2;
        s.tCamY = window.innerHeight / 2;
        s.tCamS = 0.9;
      }
    };

    let touchDistance = 0;
    let touchCenterX = 0;
    let touchCenterY = 0;

    const touchstart = (e: TouchEvent) => {
      const s = stateRef.current;
      if (e.touches.length === 1) {
        s.drag = true;
        s.smx = e.touches[0].clientX;
        s.smy = e.touches[0].clientY;
        s.scx = s.tCamX;
        s.scy = s.tCamY;
        return;
      }

      if (e.touches.length === 2) {
        s.drag = false;
        touchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    };

    const touchmove = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;

      if (e.touches.length === 1 && s.drag) {
        s.tCamX = s.scx + e.touches[0].clientX - s.smx;
        s.tCamY = s.scy + e.touches[0].clientY - s.smy;
        return;
      }

      if (e.touches.length === 2 && touchDistance > 0) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const nextScale = Math.min(6, Math.max(0.05, s.tCamS * distance / touchDistance));

        s.tCamX = centerX - (touchCenterX - s.tCamX) * (nextScale / s.tCamS);
        s.tCamY = centerY - (touchCenterY - s.tCamY) * (nextScale / s.tCamS);
        s.tCamS = nextScale;
        touchDistance = distance;
        touchCenterX = centerX;
        touchCenterY = centerY;
      }
    };

    const touchend = () => {
      stateRef.current.drag = false;
      touchDistance = 0;
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mousedown", mousedown);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("keydown", keydown);
    document.addEventListener("touchstart", touchstart, { passive: true });
    document.addEventListener("touchmove", touchmove, { passive: false });
    document.addEventListener("touchend", touchend);

    let rafId: number | null = null;
    let isPaused = false;

    const handleVisibilityChange = () => {
      isPaused = document.hidden;

      if (isPaused && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!isPaused && rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    function render(now: number) {
      rafId = null;

      if (isPaused || !canvas) return;
      const t = (now - stateRef.current.startTime) / 1000;
      const s = stateRef.current;
      s.prlX += (s.tPrlX - s.prlX) * 0.048;
      s.prlY += (s.tPrlY - s.prlY) * 0.048;
      s.camX += (s.tCamX - s.camX) * (s.drag ? 1 : 0.09);
      s.camY += (s.tCamY - s.camY) * (s.drag ? 1 : 0.09);
      s.camS += (s.tCamS - s.camS) * 0.09;

      gl!.useProgram(pBg);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, bgBuf);
      gl!.enableVertexAttribArray(LB.pos);
      gl!.vertexAttribPointer(LB.pos, 2, gl!.FLOAT, false, 0, 0);
      gl!.uniform1f(LB.time, t);
      gl!.uniform2f(LB.res, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      gl!.useProgram(pPhoto);
      const vw = window.innerWidth, vh = window.innerHeight;
      const wx0 = (-s.camX) / s.camS, wy0 = (-s.camY) / s.camS;
      const tx0 = Math.floor(wx0 / TILE) - MARGIN, ty0 = Math.floor(wy0 / TILE) - MARGIN;
      const tx1 = Math.ceil((wx0 + vw / s.camS) / TILE) + MARGIN, ty1 = Math.ceil((wy0 + vh / s.camS) / TILE) + MARGIN;
      
      const vis: PhotoTile[] = [];
      for (let tx = tx0; tx <= tx1; tx++) {
        for (let ty = ty0; ty <= ty1; ty++) {
          getTile(tx, ty).forEach(p => vis.push(p));
        }
      }

      vis.forEach(p => {
        const e = texCache.get(p.src);
        if (!e || !e.loaded) return;
        if (p.revealAt === undefined) p.revealAt = t + (p.delay || 0);
        p.targetAlpha = t >= p.revealAt ? 1 : 0;
        if (p.alpha < p.targetAlpha) p.alpha = Math.min(p.targetAlpha, p.alpha + 0.008);
        else if (p.alpha > p.targetAlpha) p.alpha = Math.max(p.targetAlpha, p.alpha - 0.004);

        if (p.alpha <= 0.001) return;
        gl!.bindBuffer(gl!.ARRAY_BUFFER, qBuf);
        gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([p.x, p.y, 0, 0, p.x + p.w, p.y, 1, 0, p.x, p.y + p.h, 0, 1, p.x + p.w, p.y + p.h, 1, 1]), gl!.DYNAMIC_DRAW);
        gl!.enableVertexAttribArray(L.pos); gl!.vertexAttribPointer(L.pos, 2, gl!.FLOAT, false, 16, 0);
        gl!.enableVertexAttribArray(L.uv); gl!.vertexAttribPointer(L.uv, 2, gl!.FLOAT, false, 16, 8);
        gl!.uniform2f(L.res, canvas!.width, canvas!.height);
        gl!.uniform2f(L.cam, s.camX + s.prlX, s.camY + s.prlY);
        gl!.uniform1f(L.scale, s.camS);
        gl!.uniform1f(L.alpha, p.alpha);
        gl!.uniform1f(L.bright, p.bright || 0.85);
        gl!.uniform1f(L.time, t);
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, e.tex);
        gl!.uniform1i(L.tex, 0);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      });

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      isPaused = true;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("wheel", wheel);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("touchstart", touchstart);
      document.removeEventListener("touchmove", touchmove);
      document.removeEventListener("touchend", touchend);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, display: 'block', cursor: 'none' }} />
      <div 
        ref={curRef} 
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,.4)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width .2s, height .2s, border-color .2s'
        }}
      />
      <style jsx>{`
        .active {
          width: 40px !important;
          height: 40px !important;
          border-color: rgba(255,255,255,.8) !important;
        }
      `}</style>
    </>
  );
};
