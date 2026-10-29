// Düz WebGL2 ile prosedürel mermer çizici (three.js gerektirmez).
// Yön maketleri ve doku galerisi bunu kullanır; three.js denemesi aynı GLSL'i render target'a çizer.
import { MARBLE_VERT, MARBLE_FRAG, SLAB, uniformValues } from './marble-glsl.js';

export function createMarble2D(canvas, opts = {}) {
  const gl = canvas.getContext('webgl2', {
    preserveDrawingBuffer: true,
    antialias: false,
    premultipliedAlpha: false,
    alpha: opts.alpha ?? false,
  });
  if (!gl) throw new Error('WebGL2 yok');

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, '#version 300 es\n' + src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      throw new Error('GLSL: ' + log);
    }
    return sh;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, MARBLE_VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, MARBLE_FRAG));
  gl.bindAttribLocation(prog, 0, 'position');
  gl.bindAttribLocation(prog, 1, 'uv');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const pos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pos);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  const uvb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvb);
  // uv.y = 1 at the top of the drawn rectangle
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  const locs = {};
  const loc = (n) => (n in locs ? locs[n] : (locs[n] = gl.getUniformLocation(prog, n)));

  function setUniforms(u) {
    for (const [k, v] of Object.entries(u)) {
      const l = loc(k);
      if (l === null) continue;
      if (k === 'uMode') gl.uniform1i(l, v);
      else if (Array.isArray(v)) {
        if (v.length === 2) gl.uniform2fv(l, v);
        else if (v.length === 3) gl.uniform3fv(l, v);
        else gl.uniform4fv(l, v);
      } else gl.uniform1f(l, v);
    }
  }

  return {
    gl,
    canvas,
    clear(rgb = [0, 0, 0]) {
      gl.disable(gl.SCISSOR_TEST);
      gl.clearColor(rgb[0], rgb[1], rgb[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    // rect in canvas pixels, y measured from the top
    draw(req, rect) {
      const reg = req.region || { x: 0, y: 0, w: req.portrait ? SLAB.h : SLAB.w, h: req.portrait ? SLAB.w : SLAB.h };
      const u = uniformValues({ ...req, region: reg, pxPerM: rect.w / reg.w, encode: true });
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      setUniforms(u);
      const vy = canvas.height - rect.y - rect.h;
      gl.viewport(rect.x, vy, rect.w, rect.h);
      gl.enable(gl.SCISSOR_TEST);
      const strip = 192;
      for (let y = 0; y < rect.h; y += strip) {
        gl.scissor(rect.x, vy + y, rect.w, Math.min(strip, rect.h - y));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.disable(gl.SCISSOR_TEST);
    },
  };
}

// Book-match layouts for flat 2D drawing. Returns a list of {req, rect}.
// kind: 'single' | 'book2' | 'book4'; box: {x,y,w,h} available area; gap: joint in px
export function layout(kind, stone, finish, slab, box, gap = 2) {
  const out = [];
  if (kind === 'single') {
    const ar = SLAB.w / SLAB.h;
    let w = box.w, h = w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    out.push({ req: { stone, finish, slab, side: 0 }, rect: r(x, y, w, h) });
  } else if (kind === 'book2') {
    // two slabs stood on their short edge, the second one flipped like a page
    const pw = SLAB.h, ph = SLAB.w;
    const ar = (pw * 2) / ph;
    let w = box.w, h = w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    const half = (w - gap) / 2;
    out.push({ req: { stone, finish, slab, side: 0, portrait: true }, rect: r(x, y, half, h) });
    out.push({ req: { stone, finish, slab: slab + 1, side: 1, portrait: true, mirrorX: true }, rect: r(x + half + gap, y, half, h) });
  } else if (kind === 'book4') {
    const ar = (SLAB.w * 2) / (SLAB.h * 2);
    let w = box.w, h = w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    const cw = (w - gap) / 2, ch = (h - gap) / 2;
    // in texture space v=0 is the bottom edge; the horizontal hinge is the bottom of the top pair
    out.push({ req: { stone, finish, slab, side: 0 }, rect: r(x, y, cw, ch) });
    out.push({ req: { stone, finish, slab: slab + 1, side: 1, mirrorX: true }, rect: r(x + cw + gap, y, cw, ch) });
    out.push({ req: { stone, finish, slab: slab + 2, side: 0, mirrorY: true }, rect: r(x, y + ch + gap, cw, ch) });
    out.push({ req: { stone, finish, slab: slab + 3, side: 1, mirrorX: true, mirrorY: true }, rect: r(x + cw + gap, y + ch + gap, cw, ch) });
  }
  return out;
}

function r(x, y, w, h) {
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}
