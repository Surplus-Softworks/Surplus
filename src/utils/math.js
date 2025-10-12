export const v2 = {
  create_: (x, y) => ({ x, y }),
  copy_: (v) => ({ x: v.x, y: v.y }),
  add_: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub_: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  mul_: (v, s) => ({ x: v.x * s, y: v.y * s }),
  dot_: (a, b) => a.x * b.x + a.y * b.y,
  length_: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  lengthSqr_: (v) => v.x * v.x + v.y * v.y,
  normalize_: (v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return len > 0.0001 ? { x: v.x / len, y: v.y / len } : { x: 1, y: 0 };
  },
  perp_: (v) => ({ x: -v.y, y: v.x }),

  easeOutCubic_: (t) => 1 - (1 - t) ** 3,
  clamp01_: (value) => Math.max(0, Math.min(1, value)),
};

export const collisionHelpers = {
  intersectSegmentAABB_: (a, b, min, max) => {
    const dir = v2.sub_(b, a);
    const invDir = { x: 1 / dir.x, y: 1 / dir.y };

    const t1 = (min.x - a.x) * invDir.x;
    const t2 = (max.x - a.x) * invDir.x;
    const t3 = (min.y - a.y) * invDir.y;
    const t4 = (max.y - a.y) * invDir.y;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0 || tmin > tmax || tmin > 1) return null;

    const t = Math.max(0, tmin);
    const point = v2.add_(a, v2.mul_(dir, t));

    const center = v2.mul_(v2.add_(min, max), 0.5);
    const extent = v2.mul_(v2.sub_(max, min), 0.5);
    const localPt = v2.sub_(point, center);

    let normal;
    const dx = Math.abs(Math.abs(localPt.x) - extent.x);
    const dy = Math.abs(Math.abs(localPt.y) - extent.y);

    if (dx < dy) {
      normal = { x: localPt.x > 0 ? 1 : -1, y: 0 };
    } else {
      normal = { x: 0, y: localPt.y > 0 ? 1 : -1 };
    }

    return { point, normal };
  },

  intersectSegmentCircle_: (a, b, pos, rad) => {
    const d = v2.sub_(b, a);
    const f = v2.sub_(a, pos);

    const aa = v2.dot_(d, d);
    const bb = 2 * v2.dot_(f, d);
    const c = v2.dot_(f, f) - rad * rad;

    let discriminant = bb * bb - 4 * aa * c;
    if (discriminant < 0) return null;

    discriminant = Math.sqrt(discriminant);
    const t1 = (-bb - discriminant) / (2 * aa);
    const t2 = (-bb + discriminant) / (2 * aa);

    let t = -1;
    if (t1 >= 0 && t1 <= 1) t = t1;
    else if (t2 >= 0 && t2 <= 1) t = t2;

    if (t < 0) return null;

    const point = v2.add_(a, v2.mul_(d, t));
    const normal = v2.normalize_(v2.sub_(point, pos));

    return { point, normal };
  },

  intersectSegment_: (collider, a, b) => {
    if (!collider) return null;

    if (collider.type === 1) {
      return collisionHelpers.intersectSegmentAABB_(a, b, collider.min, collider.max);
    } else if (collider.type === 0) {
      return collisionHelpers.intersectSegmentCircle_(a, b, collider.pos, collider.rad);
    }

    return null;
  },
};

export const sameLayer = (a, b) => {
  return (a & 0x1) === (b & 0x1) || (a & 0x2 && b & 0x2);
};
