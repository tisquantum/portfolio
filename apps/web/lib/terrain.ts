export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 640

export type Hill = { x: number; y: number; height: number; spread: number }

type Point = [number, number]

function hash(x: number, y: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const top = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * u
  const bottom =
    hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * u
  return top + (bottom - top) * v
}

function fbm(x: number, y: number) {
  return (
    (valueNoise(x / 150, y / 150) +
      valueNoise(x / 70 + 31, y / 70 + 17) * 0.5 +
      valueNoise(x / 32 + 7, y / 32 + 91) * 0.25) /
    1.75
  )
}

export function elevationAt(hills: Hill[], x: number, y: number) {
  const wx = x + (valueNoise(x / 210 + 5, y / 210) - 0.5) * 50
  const wy = y + (valueNoise(x / 210, y / 210 + 5) - 0.5) * 50

  let h = 40 + (fbm(x, y) - 0.5) * 90
  for (const hill of hills) {
    const dx = wx - hill.x
    const dy = wy - hill.y
    h +=
      hill.height *
      Math.exp(-(dx * dx + dy * dy) / (2 * hill.spread * hill.spread))
  }
  return h
}

export type Contour = { level: number; index: boolean; d: string }

/**
 * Marching squares over the elevation field, with segments stitched into
 * polylines keyed by the grid edge each vertex lies on.
 */
export function traceContours(
  hills: Hill[],
  interval: number,
  cell = 6
): Contour[] {
  const cols = Math.ceil(MAP_WIDTH / cell)
  const rows = Math.ceil(MAP_HEIGHT / cell)
  const stride = cols + 1
  const field = new Float64Array(stride * (rows + 1))
  let max = -Infinity
  let min = Infinity
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const h = elevationAt(hills, i * cell, j * cell)
      field[j * stride + i] = h
      if (h > max) max = h
      if (h < min) min = h
    }
  }

  const contours: Contour[] = []
  const first = Math.ceil(min / interval) * interval
  for (
    let level = first, n = Math.round(first / interval);
    level < max;
    level += interval, n++
  ) {
    const d = traceLevel(field, cols, rows, cell, level)
    if (d) contours.push({ level, index: n % 5 === 0, d })
  }
  return contours
}

function traceLevel(
  field: Float64Array,
  cols: number,
  rows: number,
  cell: number,
  level: number
) {
  const stride = cols + 1
  const at = (i: number, j: number) => field[j * stride + i]!
  const points = new Map<number, Point>()
  const segments: [number, number][] = []

  const horizontal = (i: number, j: number) => {
    const id = (j * stride + i) * 2
    if (!points.has(id)) {
      const a = at(i, j)
      const t = (level - a) / (at(i + 1, j) - a)
      points.set(id, [(i + t) * cell, j * cell])
    }
    return id
  }
  const vertical = (i: number, j: number) => {
    const id = (j * stride + i) * 2 + 1
    if (!points.has(id)) {
      const a = at(i, j)
      const t = (level - a) / (at(i, j + 1) - a)
      points.set(id, [i * cell, (j + t) * cell])
    }
    return id
  }

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const tl = at(i, j)
      const tr = at(i + 1, j)
      const br = at(i + 1, j + 1)
      const bl = at(i, j + 1)
      const code =
        (tl >= level ? 8 : 0) |
        (tr >= level ? 4 : 0) |
        (br >= level ? 2 : 0) |
        (bl >= level ? 1 : 0)
      if (code === 0 || code === 15) continue

      const T = () => horizontal(i, j)
      const B = () => horizontal(i, j + 1)
      const L = () => vertical(i, j)
      const R = () => vertical(i + 1, j)
      const centerAbove = (tl + tr + br + bl) / 4 >= level

      switch (code) {
        case 1:
        case 14:
          segments.push([L(), B()])
          break
        case 2:
        case 13:
          segments.push([B(), R()])
          break
        case 3:
        case 12:
          segments.push([L(), R()])
          break
        case 4:
        case 11:
          segments.push([T(), R()])
          break
        case 6:
        case 9:
          segments.push([T(), B()])
          break
        case 7:
        case 8:
          segments.push([L(), T()])
          break
        case 5:
          if (centerAbove) segments.push([L(), T()], [B(), R()])
          else segments.push([T(), R()], [L(), B()])
          break
        case 10:
          if (centerAbove) segments.push([T(), R()], [L(), B()])
          else segments.push([L(), T()], [B(), R()])
          break
      }
    }
  }

  const byEdge = new Map<number, number[]>()
  segments.forEach(([a, b], index) => {
    for (const edge of [a, b]) {
      const list = byEdge.get(edge)
      if (list) list.push(index)
      else byEdge.set(edge, [index])
    }
  })

  const used = new Uint8Array(segments.length)
  const nextFrom = (edge: number) => {
    for (const index of byEdge.get(edge) ?? []) {
      if (used[index]) continue
      used[index] = 1
      const [a, b] = segments[index]!
      return a === edge ? b : a
    }
    return undefined
  }

  const fmt = (n: number) => n.toFixed(1).replace(/\.0$/, "")
  let d = ""
  for (let s = 0; s < segments.length; s++) {
    if (used[s]) continue
    used[s] = 1
    const chain = [...segments[s]!]
    for (
      let e = nextFrom(chain[chain.length - 1]!);
      e !== undefined;
      e = nextFrom(e)
    )
      chain.push(e)
    for (let e = nextFrom(chain[0]!); e !== undefined; e = nextFrom(e))
      chain.unshift(e)

    chain.forEach((edge, k) => {
      const [x, y] = points.get(edge)!
      d += `${k === 0 ? "M" : "L"}${fmt(x)} ${fmt(y)}`
    })
    if (chain.length > 2 && chain[0] === chain[chain.length - 1]) d += "Z"
  }
  return d
}
