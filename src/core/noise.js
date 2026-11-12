// deterministic value-noise fbm — shared by the 3D hero and 2D contour map
const hash2 = (ix, iy) => {
  let n = (ix * 374761393 + iy * 668265263) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}
export const vnoise = (x, y) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
export const fbm = (x, y, oct = 5) => {
  let v = 0, amp = 0.5, f = 1
  for (let i = 0; i < oct; i++) { v += amp * vnoise(x * f, y * f); f *= 2; amp *= 0.5 }
  return v
}
export const terrainHeight = (x, z) => {
  const n = fbm(x * 0.045 + 31.4, z * 0.045 + 17.7, 5)
  let h = (n - 0.5) * 2
  h = Math.sign(h) * Math.pow(Math.abs(h), 1.25) * 7.5
  const ex = Math.min(1, Math.max(0, (45 - Math.abs(x)) / 14))
  const ez = Math.min(1, Math.max(0, (28 - Math.abs(z)) / 10))
  return h * ex * ez
}
