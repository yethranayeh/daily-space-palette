type OKLCH = { l: number; c: number; h: number };
type ColorPoint = [number, number, number];

function linearize(value: number): number {
  return value > 0.04045 ? Math.pow((value + 0.055) / 1.055, 2.4) : value / 12.92;
}

function rgbToXYZ(r: number, g: number, b: number): ColorPoint {
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);

  return [
    rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375,
    rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175,
    rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041,
  ];
}

function xyzToOKLab(x: number, y: number, z: number): ColorPoint {
  const l = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  const l_cbrt = Math.cbrt(l);
  const m_cbrt = Math.cbrt(m);
  const s_cbrt = Math.cbrt(s);

  return [
    0.2104542553 * l_cbrt + 0.793617785 * m_cbrt - 0.0040720468 * s_cbrt,
    1.9779984951 * l_cbrt - 2.428592205 * m_cbrt + 0.4505937099 * s_cbrt,
    0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.808675766 * s_cbrt,
  ];
}

function okLabToOKLCH(L: number, a: number, b: number): OKLCH {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) {
    h += 360;
  }

  return { l: L, c, h };
}

export function rgbToOKLCH(r: number, g: number, b: number): OKLCH {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const [x, y, z] = rgbToXYZ(rn, gn, bn);
  const [L, a, bVal] = xyzToOKLab(x, y, z);

  return okLabToOKLCH(L, a, bVal);
}
