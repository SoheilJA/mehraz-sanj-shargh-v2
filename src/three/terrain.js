import * as THREE from 'three'
import { terrainHeight } from '../core/noise.js'

const C = { navy: new THREE.Color(0x0B1220), deep: new THREE.Color(0x101B2C),
  slate: new THREE.Color(0x18283B), teal: new THREE.Color(0x28D7C2), ink: new THREE.Color(0xF1F5F9) }

const textSprite = (txt, color = '#94A3B8') => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64
  const c = cv.getContext('2d')
  c.font = '600 34px monospace'; c.fillStyle = color; c.textAlign = 'center'; c.textBaseline = 'middle'
  c.fillText(txt, 32, 34)
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }))
  sp.scale.setScalar(2.4)
  return sp
}

export function createTerrain(canvas, { reduced = false } = {}) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  } catch { return null } // caller shows SVG fallback

  const mobile = innerWidth < 768
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.3 : 1.75))
  renderer.setClearColor(0x0B1220, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 220)
  const disposables = []
  const track = o => { disposables.push(o); return o }

  /* ---- terrain geometry (CPU displacement, shared by mesh/points) ---- */
  const [sx, sz] = mobile ? [96, 64] : [160, 104]
  const geo = track(new THREE.PlaneGeometry(90, 56, sx, sz))
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const heights = new Float32Array(pos.count)
  const rands = new Float32Array(pos.count)
  for (let i = 0; i < pos.count; i++) {
    const h = terrainHeight(pos.getX(i), pos.getZ(i))
    pos.setY(i, h); heights[i] = h; rands[i] = Math.random()
  }
  geo.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1))
  geo.computeVertexNormals()

  const uniforms = {
    uTime: { value: 0 }, uScan: { value: -45 },
    uTeal: { value: C.teal }, uDeep: { value: C.deep },
    uSlate: { value: C.slate }, uNavy: { value: C.navy }
  }

  const terrainMat = track(new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      attribute float aHeight; varying float vH; varying vec3 vPos; varying vec3 vN;
      void main(){ vH=aHeight; vPos=position; vN=normal;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `
      uniform float uTime,uScan; uniform vec3 uTeal,uDeep,uSlate,uNavy;
      varying float vH; varying vec3 vPos; varying vec3 vN;
      void main(){
        float hn = clamp(vH/7.5*.5+.5, 0., 1.);
        vec3 col = mix(uDeep, uSlate, hn*.85);
        col += clamp(dot(normalize(vN), normalize(vec3(-.35,.9,-.25))),0.,1.)*.04;
        /* animated topographic contours */
        float lvl = vH*1.6 - uTime*.35;
        float c  = fract(lvl); float d = min(c, 1.-c);
        float aa = fwidth(lvl)*1.3;
        float line = 1.-smoothstep(.0, .05+aa, d);
        col += uTeal * line * (.16 + .12*hn);
        /* reference grid */
        vec2 gp = vPos.xz/5.; vec2 gg = abs(fract(gp)-.5)/fwidth(gp);
        col += vec3(.05,.08,.12) * (1.-smoothstep(0.,1.6,min(gg.x,gg.y))) * .7;
        /* travelling scan line */
        float s = vPos.x - uScan;
        float scan = exp(-s*s*.35);
        col += uTeal * scan*.28 + uTeal * line * scan*.5;
        /* fade to page background at edges */
        float fade = smoothstep(52., 24., length(vPos.xz));
        col = mix(uNavy, col, fade);
        gl_FragColor = vec4(col, 1.); }`
  }))
  scene.add(new THREE.Mesh(geo, terrainMat))

  if (!mobile) scene.add(new THREE.Mesh(geo,
    track(new THREE.MeshBasicMaterial({ color: 0x28D7C2, wireframe: true, transparent: true, opacity: .045 }))))

  /* ---- point cloud (single draw call, pulsing measurement points) ---- */
  const pGeo = track(new THREE.BufferGeometry())
  pGeo.setAttribute('position', geo.attributes.position)
  pGeo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))
  pGeo.computeBoundingSphere()
  const pMat = track(new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uTeal: { value: C.teal }, uInk: { value: C.ink }, uDPR: { value: renderer.getPixelRatio() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aRand; uniform float uTime,uDPR; varying float vA,vR;
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.);
        float pulse = .55 + .45*sin(uTime*1.6 + aRand*6.2831);
        gl_PointSize = (1.4 + aRand*2.6) * pulse * uDPR * (140. / -mv.z);
        vA = pulse; vR = aRand;
        gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `
      uniform vec3 uTeal,uInk; varying float vA,vR;
      void main(){
        float d = length(gl_PointCoord-.5); if(d>.5) discard;
        vec3 c = mix(uInk, uTeal, step(.82, vR));
        gl_FragColor = vec4(c, (1.-d*2.)*vA*.8); }`
  }))
  scene.add(new THREE.Points(pGeo, pMat))

  /* ---- survey markers + rays + axis tripod ---- */
  const tealBasic = () => track(new THREE.MeshBasicMaterial({ color: 0x28D7C2, transparent: true }))
  const markerPts = [[-18, 8], [7, -12], [24, 4], [-6, -16]]
    .map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z), z))
  const ring_dots = []
  markerPts.forEach((p, i) => {
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.1, .06, 8, 32)), tealBasic())
    ring.rotation.x = Math.PI / 2; ring.position.set(p.x, p.y + .12, p.z)
    ring.userData.phase = i * 1.6; scene.add(ring)
    const lg = track(new THREE.BufferGeometry().setFromPoints([p, p.clone().setY(p.y + 5)]))
    scene.add(new THREE.Line(lg, tealBasic()))
  })
  const station = new THREE.Vector3(30, 17, 24)
  markerPts.slice(0, 2).forEach((p, i) => {
    const g = track(new THREE.BufferGeometry().setFromPoints([station, p]))
    scene.add(new THREE.Line(g, tealBasic()))
    const dot = new THREE.Mesh(track(new THREE.SphereGeometry(.16, 8, 8)), tealBasic())
    dot.userData = { from: station, to: p, phase: .35 + i * .5 }
    scene.add(dot); ring_dots.push(dot)
  })
  const tripod = new THREE.Vector3(-38, terrainHeight(-38, 22), 22)
  const axes = [[new THREE.Vector3(7, 0, 0), 0x28D7C2], [new THREE.Vector3(0, 7, 0), 0x94A3B8], [new THREE.Vector3(0, 0, 7), 0x94A3B8]]
  axes.forEach(([dir, col]) => {
    const g = track(new THREE.BufferGeometry().setFromPoints([tripod, tripod.clone().add(dir)]))
    scene.add(new THREE.Line(g, track(new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .6 }))))
  })
  ;['X', 'Y', 'Z'].forEach((t, i) => {
    const sp = textSprite(t, i === 0 ? '#28D7C2' : '#7F91A8')
    sp.position.copy(tripod).add([new THREE.Vector3(8, 0, 0), new THREE.Vector3(0, 8, 0), new THREE.Vector3(0, 0, 8)][i])
    scene.add(sp); track(sp.material.map)
  })

  /* ---- camera rig, parallax, loop ---- */
  const par = { x: 0, y: 0, tx: 0, ty: 0 }
  if (!reduced && !mobile) {
    addEventListener('pointermove', e => {
      par.tx = e.clientX / innerWidth - .5; par.ty = e.clientY / innerHeight - .5
    }, { passive: true })
  }
  const updateCamera = t => {
    par.x += (par.tx - par.x) * .04; par.y += (par.ty - par.y) * .04
    const az = Math.sin(t * .07) * .2 + par.x * .12
    const elv = .62 + par.y * .06 + Math.sin(t * .05) * .015
    const r = mobile ? 56 : 46
    camera.position.set(Math.sin(az) * r * Math.cos(elv), r * Math.sin(elv) + 4, Math.cos(az) * r * Math.cos(elv) + 10)
    camera.lookAt(0, 0, -3)
  }

  const resize = () => {
    const p = canvas.parentElement, w = p.clientWidth, h = p.clientHeight
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); resize()

  const render = t => {
    uniforms.uTime.value = t
    uniforms.uScan.value = -45 + 90 * (0.5 - 0.5 * Math.cos(t * .14))
    scene.traverse(o => {
      if (o.userData?.phase !== undefined && o.geometry?.type === 'TorusGeometry')
        o.scale.setScalar(1 + .18 * Math.sin(t * 2 + o.userData.phase))
      if (o.userData?.from) {
        const k = (t * .25 + o.userData.phase) % 1
        o.position.lerpVectors(o.userData.from, o.userData.to, k)
      }
    })
    updateCamera(t)
    renderer.render(scene, camera)
  }

  let raf = null, visible = true
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !raf && !reduced) raf = requestAnimationFrame(frame)
  })
  io.observe(canvas)
  const t0 = performance.now()
  const frame = now => { raf = null; if (!visible || document.hidden) return; render((now - t0) / 1000); raf = requestAnimationFrame(frame) }

  let resolveReady
  const ready = new Promise(r => (resolveReady = r))
  if (reduced) { render(3.2); resolveReady() }
  else raf = requestAnimationFrame(frame)
  requestAnimationFrame(() => resolveReady())

  const dispose = () => {
    if (raf) cancelAnimationFrame(raf)
    ro.disconnect(); io.disconnect()
    disposables.forEach(d => { d.dispose?.() })
    renderer.dispose()
  }
  return { ready, dispose }
}
