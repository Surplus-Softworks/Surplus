const e = '11',
  t = 'flex',
  r = 'keybind-slot',
  n = 'input',
  o = 'touchcancel',
  i = 'risky-label',
  a = 'Right Shift',
  c = 'credit-item',
  s = 'credit-name',
  l = 'Trajectory',
  d = 'help-panel';
const u = Object,
  h = Array,
  b = Math;
function m(e, t = je + Br) {
  const r = t.length;
  let n = je;
  for (let o = 0; e.length > o; o++) {
    const i = Nt(Br, e, [o]) ^ Nt(Br, t, [o % r]);
    n += Hr(i);
  }
  return n;
}
function g(e) {
  return new Ft((t) => {
    function r(e) {
      if (!e || Re != typeof e || e instanceof h) return Ne;
      let t = { v: 0, t: 0, j: 0, y: 0, l: 0 };
      return (
        new Set([...St(e), ...kt(u.getPrototypeOf(e) || {})]).forEach((r) => {
          let n = e[r];
          (_t(n) ? t.y++ : Re == typeof n && Ne !== n ? t.j++ : Me == typeof n ? t.t++ : t.v++,
            t.l++);
        }),
        Mt(t)
          .map((e) => Ct(97 + e))
          .join(je)
      );
    }
    function n() {
      const e = St(o),
        t = St(tn);
      return e.every((e) => t.includes(e));
    }
    const o = {
        h: '10-7-0-0-17',
        m: '21-20-11-1-53',
        p: ['7-9-1-0-17', '9-10-1-0-20', '10-11-1-0-22'],
        _: '9-9-3-1-22',
        k: '1-7-1-2-11',
        C: '0-4-1-1-6',
        M: ['1-19-5-1-26', '1-18-5-1-25'],
        N: '0-6-1-1-8',
        S: '0-4-0-1-5',
        T: '0-2-1-0-3',
        A: '0-4-0-2-6',
        P: '0-7-2-2-11',
        B: '0-3-1-0-4',
        D: '1-3-1-1-6',
        L: '0-3-1-0-4',
        O: '1-3-1-0-5',
        I: ['3-8-3-0-14', '5-8-3-0-16'],
        R: '51-64-87-2-204',
        F: '1-28-5-4-38',
        H: je,
        W: '0-3-0-1-4',
        q: '1-7-2-0-10',
        $: '36-42-12-3-93',
        Z: '12-4-2-1-19',
        V: '52-40-44-3-139',
        G: '2-8-5-0-15',
        K: '8-23-3-1-35',
        U: '1-7-1-1-10',
        J: '2-8-1-1-12',
        X: '4-28-6-1-39',
        Y: '1-17-3-1-22',
        ee: '0-3-2-0-5',
        te: '3-5-1-1-10',
        re: '5-7-4-0-16',
        ne: ['21-11-3-1-36', '23-11-3-1-38'],
        oe: '6-11-2-1-20',
        ie: '6-6-5-0-17',
        ae: je,
        se: je,
        ce: je,
        le: je,
        de: je,
        ue: je,
        he: je,
        fe: je,
        be: je,
        me: je,
        ge: je,
        ye: je,
        pe: je,
        ve: je,
        we: je,
        _e: je,
        ke: je,
        xe: je,
      },
      i = {};
    for (const [e, t] of u.entries(o))
      if (je != t)
        if (t instanceof h)
          (t.forEach((e, r) => {
            const n = e
              .split('-')
              .map(qt)
              .map((e) => Ct(97 + e))
              .join(je);
            t[r] = n;
          }),
            (i[e] = t));
        else {
          const r = t
            .split('-')
            .map(qt)
            .map((e) => Ct(97 + e))
            .join(je);
          i[e] = r;
        }
      else i[e] = je;
    const a = setInterval(() => {
      ((tn = (() => {
        function t(e, t) {
          const n = r(e[t]);
          if (n)
            for (const [e, r] of u.entries(i))
              o[e] || (r instanceof h && r.some((e) => e == n) && (o[e] = t), r == n && (o[e] = t));
        }
        if (!e || !e.game) return {};
        const n = e.game,
          o = { ...tn };
        for (const e in n)
          if (n.hasOwnProperty(e)) {
            try {
              n[e].hasOwnProperty('deadBodyPool')
                ? (o.L = e)
                : n[e].hasOwnProperty('airdropPool') && (o.B = e);
            } catch {}
            try {
              if (n[e].hasOwnProperty('bones')) {
                o.V = e;
                const r = new n[e].constructor();
                for (const o in r)
                  try {
                    t(n[e], o);
                  } catch {}
                if (
                  (Ne != o.oe &&
                    (o.ve = kt(n[e][o.oe]).find((t) => n[e][o.oe][t] instanceof Fr.Array)),
                  Ne != o.oe && Ne != o.p)
                ) {
                  const t = kt(n[e][o.oe]),
                    r = kt(n[o.p]);
                  o.ue = t.filter((e) => r.includes(e)).find((t) => Pe == typeof n[e][o.oe][t]);
                }
                if (Ne == o.ne) continue;
                if (Ne != o.V) {
                  try {
                    n[o.V].selectIdlePose.call({
                      [o.ne]: new Wt(
                        {},
                        {
                          get(e, t) {
                            o.we = t;
                          },
                        }
                      ),
                    });
                  } catch {}
                  try {
                    n[o.V].canInteract.call({
                      [o.ne]: new Wt(
                        {},
                        {
                          get(e, t) {
                            o._e = t;
                          },
                        }
                      ),
                    });
                  } catch {}
                }
                (() => {
                  let e = !1,
                    t = !1;
                  const n = [Ne, Ne, (e) => (o.ae = e), (e) => (o.le = e)],
                    i = [(e) => (o.se = e), (e) => (o.de = e), Ne],
                    a = kt(r.__proto__).find((e) => 13 == r[e].length);
                  try {
                    r[a].call(
                      new Wt(
                        {},
                        {
                          get: (e, t) => (
                            n.shift()?.(t),
                            new Wt({ x: 0, y: 0 }, { get: (e, t) => e[t] || { x: 0, y: 0 } })
                          ),
                          set: (t, r) => (e && ((e = !1), (o.ce = r)), i.shift()?.(r), !0),
                        }
                      ),
                      Ne,
                      { getPlayerById() {} },
                      Ne,
                      {
                        isSoundPlaying() {
                          return !1;
                        },
                      },
                      Ne,
                      {
                        isBindDown() {
                          return (n.unshift(Ne, Ne, Ne, Ne, Ne), !1);
                        },
                      },
                      new Wt(
                        {},
                        {
                          get(r, n) {
                            ((e = !0), (t = !0));
                          },
                        }
                      )
                    );
                  } catch {}
                  t || (o.ce = o.ae);
                })();
                continue;
              }
              if (n[e].hasOwnProperty('triggerPing')) {
                o.H = e;
                continue;
              }
              if (n[e].hasOwnProperty('mapTexture')) {
                o.Ce = e;
                continue;
              }
              if (n[e].hasOwnProperty('topLeft')) {
                ((o.R = e),
                  kt(n[e]).forEach((t) => {
                    Re == typeof n[e][t] && Ne != n[e][t] && r(n[e][t]) == i.ie && (o.ie = t);
                  }));
                continue;
              }
            } catch {}
            try {
              t(n, e);
            } catch (e) {}
          }
        try {
          Ne != o.M &&
            kt(n[o.M].playerPool).forEach((e) => {
              _t(n[o.M].playerPool[e]) && (o.fe = e);
            });
        } catch {}
        try {
          Ne == o.be &&
            (o.be = kt(n.__proto__)
              .filter((e) => Me == typeof n[e])
              .find((e) => 3 == n[e].length));
        } catch {}
        try {
          if (Ne != o.Ce && Ne != o.he && Ne == o.me)
            try {
              n[o.Ce][o.he].call(
                new Wt(
                  {},
                  {
                    get(e, t) {
                      throw ((o.me = t), Ne);
                    },
                  }
                )
              );
            } catch {}
        } catch {}
        try {
          if (Ne != o.me && Ne == o.ge) {
            const e = n[o.Ce][o.me][o.fe],
              t = new Wt(
                {},
                {
                  get(e, t) {
                    o.ge = t;
                  },
                }
              );
            e[0].render.call({}, t, t);
          }
        } catch {}
        try {
          if (Ne != o.H && Ne == o.ye) {
            let e = new n[o.H].constructor();
            ((e.activePlayer = 1),
              (e.emoteSelector.ping = 'ping_danger'),
              (e.uiManager = { getWorldPosFromMapPos() {} }),
              (e.camera = new Wt(
                {},
                {
                  get(e, t) {
                    o.ye = t;
                  },
                }
              )),
              e.triggerPing());
          }
        } catch {}
        try {
          Ne != o.H &&
            Ne == o.he &&
            (o.he = kt(n[o.H].__proto__).find((e) => 10 == n[o.H][e].length));
        } catch {}
        try {
          Ne != o.m &&
            Ne == o.pe &&
            n[o.m].getAimMovement.call(
              {},
              {
                [o.oe]: new Wt(
                  {},
                  {
                    get(e, t) {
                      o.pe = t;
                    },
                  }
                ),
              }
            );
        } catch {}
        try {
          Ne != o.D &&
            Ne == o.ke &&
            (o.ke = kt(e.game[o.D]).find((t) => e.game[o.D][t] instanceof Fr.Array));
        } catch {}
        try {
          Ne != o.q &&
            Ne == o.xe &&
            ((f = kt(e.game[o.q].__proto__).find((t) => 4 == e.game[o.q][t].length)),
            e.game[o.q][f].call(
              new Wt(e.game[o.q], {
                get: (e, t) =>
                  e[t].bind(
                    new Wt(
                      {},
                      {
                        get(e, t) {
                          o.xe = t;
                        },
                      }
                    )
                  ),
              })
            ));
        } catch {}
        return o;
      })()),
        n() && (clearInterval(a), t(tn)));
    });
    At(() => {
      n() || (clearInterval(a), t(tn));
    }, Ze);
  });
}
function y() {
  if (!Zr.game?.initialized) return;
  const e = Gr.Me.ze;
  try {
    (((e) => {
      e &&
        Gr.Me.Ne &&
        Zr.game[tn._].layers[3].children.forEach((e) => {
          e._texture?.textureCacheIds &&
            e._texture.textureCacheIds.some(
              (e) =>
                (e.includes('ceiling') && !e.includes('map-building-container-ceiling-05')) ||
                e.includes('map-snow-')
            ) &&
            (e.visible = !1);
        });
    })(e),
      e &&
        Zr.game[tn.D][tn.ke].forEach((e) => {
          (Gr.Me.Se && (e.sprite._tintRGB = 1), (e.sprite.alpha = Gr.Me.Te / Ze));
        }),
      ((e) => {
        e &&
          Zr.game[tn.Ce][tn.me][tn.fe].forEach((e) => {
            (['tree', 'table', 'stairs'].some((t) => e.type.includes(t)) &&
              (e.sprite.alpha = Gr.Me.Ae / 100),
              e.type.includes('bush') && (e.sprite.alpha = 0));
          });
      })(e));
  } catch {}
}
function p(e, t, r) {
  const n = e[t],
    o = new Wt(n, r);
  (nn.set(o, n), (e[t] = o));
}
function v(e) {
  return St(Zr.game[tn.M].teamInfo).find((t) =>
    Zr.game[tn.M].teamInfo[t].playerIds.includes(e.__id)
  );
}
function w(e) {
  const t = e[tn.ne][tn.we];
  return t && dn[t] ? dn[t] : Ne;
}
function k(e) {
  return e ? dn[e.bulletType] : Ne;
}
function x(e) {
  if (!Mn.je) return;
  const { Pe: t, Be: r, De: n, Le: o } = e,
    i = t ?? Te,
    a = performance.now();
  if ((Bn(a), Te === i)) {
    Rn();
    const e = Sn(Mn.Oe),
      t = Mn.Ee ?? Sn(e);
    if (!o && Tn(t, e)) {
      const r = En(t, e);
      ((Mn.Ie = { startPos: Sn(t), targetPos: Sn(e), startTime: a, duration: r }), In(r));
    } else ((Mn.Ie = Ne), Ln(Ne));
    ((Mn.Pe = Te), (Mn.Re = Ne));
  } else {
    Rn();
    const e = r ? { x: r.x, y: r.y } : Sn(Mn.Oe),
      t = Mn.Ee ?? Sn(Mn.Oe),
      n = Tn(e, Mn.Re);
    (i !== Mn.Pe || n
      ? ((Mn.Ie = { startPos: Sn(t), targetPos: Sn(e), startTime: a, duration: o ? 0 : En(t, e) }),
        (Mn.Re = Sn(e)))
      : Mn.Ie && (Mn.Ie.targetPos = Sn(e)),
      (Mn.Pe = i));
  }
  const c = An(n);
  (((e, t) =>
    !(
      (e || t) &&
      (!e ||
        !t ||
        e.touchMoveActive !== t.touchMoveActive ||
        Et(e.touchMoveLen - t.touchMoveLen) > zn ||
        Et(e.x - t.x) > zn ||
        Et(e.y - t.y) > zn)
    ))(c, Mn.Fe) ||
    ((Mn.He = {
      startDir: An(Mn.We),
      targetDir: c,
      startTime: a,
      duration: Mn.Ie?.duration ?? 195,
    }),
    (Mn.Fe = c)),
    Bn(a));
}
function z(e) {
  const t = Zr.game[tn.V],
    r = v(e) === v(t);
  (Reflect.defineProperty(e.nameText, 'visible', { get: () => Gr.$e.qe && Gr.$e.ze, set() {} }),
    (e.nameText.visible = !0),
    (e.nameText.tint = r ? 13360629 : 16721960),
    (e.nameText.style.fill = r ? '#3a88f4' : '#ff2828'),
    (e.nameText.style.fontSize = 20),
    (e.nameText.style.dropShadowBlur = 0.1));
}
function C() {
  try {
    const e = Zr.game[tn.V],
      t = Zr.game[tn.M].playerPool[tn.fe];
    if (!(Zr.pixi && e && e.container && Zr.game?.initialized)) return;
    const r = fo(e.container, 'playerLines');
    (r.clear(),
      Gr.$e.ze &&
        Gr.$e.Ze &&
        ((e, t, r) => {
          const n = e[tn.ae].x,
            o = e[tn.ae].y,
            i = v(e),
            a = co(e.layer),
            c = so(e);
          t.forEach((t) => {
            if (!t.active || t[tn.ne][tn._e] || e.__id === t.__id) return;
            const s = v(t),
              l = lo(t.layer, c, a);
            (r.lineStyle(2, s === i ? Jn : l && !t.downed ? Xn : eo, 0.45),
              r.moveTo(0, 0),
              r.lineTo(Ge * (t[tn.ae].x - n), Ge * (o - t[tn.ae].y)));
          });
        })(e, t, r));
    const n = fo(e.container, 'grenadeDangerZones');
    (n.clear(),
      Gr.$e.ze &&
        Gr.$e.Ge.Ve &&
        ((e, t) => {
          const r = e[tn.ae].x,
            n = e[tn.ae].y,
            o = co(e.layer),
            i = so(e),
            a = Zr.game?.[tn.q]?.[tn.xe];
          a &&
            Mt(a)
              .filter(
                (e) => (9 === e.__type && gt !== e.type) || (e.smokeEmitter && e.explodeParticle)
              )
              .forEach((e) => {
                const a = lo(e.layer, i, o);
                (t.beginFill(a ? Xn : eo, a ? 0.1 : 0.2),
                  t.drawCircle(Ge * (e.pos.x - r), Ge * (n - e.pos.y), 208),
                  t.endFill(),
                  t.lineStyle(2, 0, 0.2),
                  t.drawCircle(Ge * (e.pos.x - r), Ge * (n - e.pos.y), 208));
              });
        })(e, n));
    const o = fo(e.container, 'grenadeTrajectory');
    (o.clear(),
      Gr.$e.ze &&
        Gr.$e.Ge.Ke &&
        ((e, t) => {
          if (3 !== e[tn.oe][tn.pe]) return;
          const r = e[tn.ne][tn.we];
          if (!r) return;
          const n = Zr.game,
            o = e[tn.ae].x,
            i = e[tn.ae].y;
          let a, c;
          const s = n[tn.R].spectating,
            l = n[tn.m].shotDetected || n[tn.Y].isBindDown(sn),
            d = s ? Ne : $n();
          if (d) {
            const e = n[tn.p][tn.ge]({ x: o, y: i }),
              t = d.x - e.x,
              r = d.y - e.y,
              s = Dt(t * t + r * r);
            ((a = t / s), (c = r / s));
          } else if (s || (Vr.Ue && l))
            if (!s && Vr.Ue) {
              const e = n[tn.p][tn.ge]({ x: o, y: i }),
                t = Vr.Ue.clientX - e.x,
                r = Vr.Ue.clientY - e.y,
                s = Dt(t * t + r * r);
              ((a = t / s), (c = r / s));
            } else ((a = e[tn.le].x), (c = e[tn.le].y));
          else {
            const e = n[tn.X].mousePos._x - Fr.innerWidth / 2,
              t = n[tn.X].mousePos._y - Fr.innerHeight / 2,
              r = Dt(e * e + t * t);
            ((a = e / r), (c = t / r));
          }
          const f = rt * a + ct * c;
          ((a = ct * a - rt * c), (c = f));
          const u = (Lt(jt(Kr.Je, 0), 32.4) / 15) * (r.includes(gt) ? 11 : 15),
            h = o + a * u,
            b = i - c * u;
          let m = to;
          (r.includes(gt)
            ? (m = ro)
            : r.includes('frag')
              ? (m = no)
              : r.includes('mirv')
                ? (m = oo)
                : r.includes('martyr') && (m = io),
            t.lineStyle(3, m, 0.7),
            t.moveTo(0, 0),
            t.lineTo(Ge * (h - o), Ge * (i - b)));
          const g = r.replace('_cook', je),
            y = dn[g]?.explosionType;
          if (y && dn[y]) {
            const e = Ge * (dn[y].rad.max + 1);
            (t.beginFill(m, 0.2),
              t.drawCircle(Ge * (h - o), Ge * (i - b), e),
              t.endFill(),
              t.lineStyle(2, m, 0.4),
              t.drawCircle(Ge * (h - o), Ge * (i - b), e));
          }
        })(e, o));
    const i = fo(e.container, 'flashlights');
    (i.clear(),
      Gr.$e.ze &&
        (Gr.$e.Ye.Xe || Gr.$e.Ye.Qe) &&
        ((e, t, r) => {
          const n = w(e),
            o = k(n),
            i = co(e.layer),
            a = so(e);
          (Gr.$e.Ye.Qe && uo(e, e, o, n, r),
            Gr.$e.Ye.Xe &&
              t
                .filter(
                  (t) =>
                    !(
                      !t.active ||
                      t[tn.ne][tn._e] ||
                      e.__id === t.__id ||
                      !lo(t.layer, a, i) ||
                      !t.container.worldVisible ||
                      v(t) === v(e)
                    )
                )
                .forEach((t) => {
                  const n = w(t),
                    o = k(n);
                  uo(e, t, o, n, r, 0, 0.05);
                }));
        })(e, t, i));
    const a = fo(e.container, 'bulletTrajectory');
    (a.clear(),
      Gr.$e.ze &&
        Gr.$e.Ye.Ke &&
        ((e, t) => {
          const r = w(e),
            n = k(r);
          if (!n || !r) return;
          const o = Zr.game,
            i = e[tn.ae],
            a = o[tn.R].spectating,
            c = o[tn.m].shotDetected || o[tn.Y].isBindDown(sn);
          let s;
          const l = a ? Ne : $n();
          if (l) {
            const e = o[tn.p][tn.ge]({ x: i.x, y: i.y });
            s = Tt(e.y - l.y, e.x - l.x) - Ht;
          } else if (a || (Vr.Ue && c))
            if (!a && Vr.Ue) {
              const e = o[tn.p][tn.ge]({ x: i.x, y: i.y });
              s = Tt(e.y - Vr.Ue.clientY, e.x - Vr.Ue.clientX) - Ht;
            } else s = Tt(e[tn.le].x, e[tn.le].y) - Ht / 2;
          else
            s = Tt(
              o[tn.X].mousePos._y - Fr.innerHeight / 2,
              o[tn.X].mousePos._x - Fr.innerWidth / 2
            );
          const d = ((e, t, r, n, o, i = 3) => {
              const a = [];
              let c = Wn(e),
                s = Un(t),
                l = r,
                d = 0;
              const f = Zr.game,
                u = f?.[tn.q]?.[tn.xe];
              if (!u) return a;
              const h = un && void 0 !== hn ? hn : n,
                b = Mt(u).filter(
                  (e) =>
                    !(
                      !e.collider ||
                      e.dead ||
                      (void 0 !== e.height && 0.25 > e.height) ||
                      (void 0 !== e.layer && !Qn(e.layer, h)) ||
                      e?.type.includes('decal') ||
                      e?.type.includes('decal')
                    )
                ),
                m = f?.[tn.M],
                g = m?.playerPool?.[tn.fe],
                y = tn.J,
                p = y ? f?.[y] : Ne,
                v = p?.player?.radius ?? 1,
                w = [];
              if (_t(g))
                for (const e of g) {
                  if (!e || !e.active) continue;
                  if (e.__id === o.__id) continue;
                  const t = e[tn.ne];
                  if (!t) continue;
                  if (t[tn._e]) continue;
                  const r = e.layer ?? t.m_layer ?? 0;
                  if (!(Qn(r, h) || 2 & r)) continue;
                  const n = e[tn.ae] ?? e.m_pos;
                  if (!n) continue;
                  const i =
                    Pe == typeof e.m_rad
                      ? e.m_rad
                      : Pe == typeof e.rad
                        ? e.rad
                        : v *
                          (Pe == typeof t.m_scale ? t.m_scale : Pe == typeof t.scale ? t.scale : 1);
                  i > 0 && w.push({ pos: { x: n.x, y: n.y }, rad: i });
                }
              for (; i >= d && l > 0.1; ) {
                const e = On(c, Kn(s, l));
                let t = Ne,
                  r = 1 / 0,
                  n = Ne,
                  o = Ne;
                for (const i of b) {
                  if (!1 === i.collidable) continue;
                  const a = Yn.et(i.collider, c, e);
                  if (a) {
                    const e = Gn(Vn(a.point, c));
                    r > e && e > 1e-4 && ((r = e), (t = a), (n = i), (o = 'obstacle'));
                  }
                }
                for (const i of w) {
                  const a = Yn.tt(c, e, i.pos, i.rad);
                  if (a) {
                    const e = Gn(Vn(a.point, c));
                    r > e && e > 1e-4 && ((r = e), (t = a), (n = Ne), (o = ht));
                  }
                }
                if (!t) {
                  a.push({ start: Wn(c), end: e, hitPlayer: !1 });
                  break;
                }
                {
                  if ((a.push({ start: Wn(c), end: Wn(t.point), hitPlayer: ht === o }), ht === o))
                    break;
                  const e = n?.type;
                  let f = !1;
                  if (
                    ((f =
                      n && void 0 !== n.reflectBullets
                        ? !0 === n.reflectBullets
                        : [
                            'metal_wall',
                            'stone_wall',
                            'container_wall',
                            'hedgehog',
                            'bollard',
                            'airdop',
                            'silo',
                            'collider',
                            'warehouse_wall',
                          ].some((t) => e?.includes(t))),
                    !f || d >= i)
                  )
                    break;
                  {
                    const e = Zn(s, t.normal);
                    ((s = On(Kn(t.normal, -2 * e), s)),
                      (s = Un(s)),
                      (c = On(t.point, Kn(s, 0.01))),
                      (l = jt(1, l - Dt(r)) / 1.5),
                      d++);
                  }
                }
              }
              return a;
            })(i, qn(It(s), -Bt(s)), n.distance, e.layer, e),
            f = d.some((e) => e.hitPlayer);
          t.lineStyle(f ? 4 : 2, f ? Xn : 16711935, 0.5);
          for (const e of d) {
            const r = { x: Ge * (e.start.x - i.x), y: Ge * (i.y - e.start.y) },
              n = { x: Ge * (e.end.x - i.x), y: Ge * (i.y - e.end.y) };
            (t.moveTo(r.x, r.y), t.lineTo(n.x, n.y));
          }
        })(e, a),
      t.forEach(z));
  } catch {}
}
function N(e, t, r, n) {
  return (e - r) ** 2 + (t - n) ** 2;
}
function _() {
  try {
    const i = Zr.game;
    if (!i.initialized || (!Gr.rt.ze && !Gr.nt.ze) || i[tn.R].spectating)
      return (x(new xn(Te)), To && (To.style.display = Ee), void (Co.ot = Ne));
    const a = i[tn.M].playerPool[tn.fe],
      c = i[tn.V],
      s = zo(c.layer);
    let l = !1,
      d = Ne,
      f = Ne;
    try {
      const u = i[tn.V][tn.oe][tn.pe],
        h = 2 === u,
        b = 3 === u,
        m = i[tn.Y].isBindDown(sn),
        g = Gr.nt.ze && m;
      let y = Co.it;
      g
        ? (y && y.active && !y[tn.ne][tn._e]) ||
          ((y = ((e, t) => {
            const r = v(t),
              n = zo(t.layer),
              o = Mo(t);
            let i = Ne,
              a = 1 / 0;
            for (const c of e) {
              if (!c.active) continue;
              if (c[tn.ne][tn._e]) continue;
              if (!Gr.rt.st && c.downed) continue;
              if (t.__id === c.__id) continue;
              if (!So(c.layer, o, n)) continue;
              if (v(c) === r) continue;
              const e = t[tn.ce],
                s = c[tn.ce],
                l = N(e.x, e.y, s.x, s.y);
              a > l && ((a = l), (i = c));
            }
            return i;
          })(a, c)),
          (Co.it = y))
        : ((y = Ne), (Co.it = Ne));
      let p = 1 / 0;
      if (y) {
        const e = c[tn.ce],
          t = y[tn.ce];
        p = Pt(e.x - t.x, e.y - t.y);
      }
      const z = 5.5 >= p;
      if ((g && Gr.nt.ct && !h && z && Kr.lt.push(ln), g && h && z && y)) {
        const e = y[tn.ce],
          t = Tt((o = c[tn.ce]).y - (n = e).y, o.x - n.x) + Ht,
          r = { touchMoveActive: !0, touchMoveLen: 255, x: It(t), y: Bt(t) },
          a = i[tn.p][tn.ge]({ x: e.x, y: e.y });
        return (
          x(new xn('meleeLock', { x: a.x, y: a.y }, r, !0)),
          (l = !0),
          To && (To.style.display = Ee),
          void (Co.ot = Ne)
        );
      }
      if ((g && !z && (Co.it = Ne), !Gr.rt.ze || h || b))
        return (x(new xn(Te)), To && (To.style.display = Ee), void (Co.ot = Ne));
      const C = m;
      let _ = Co.dt?.active && !Co.dt[tn.ne][tn._e] ? Co.dt : Ne;
      if (_) {
        const e = Mo(c);
        So(_.layer, e, s)
          ? To && (To.style.backgroundColor = 'rgb(190, 12, 185)')
          : ((_ = Ne), (Co.dt = Ne));
      }
      if (
        (_ ||
          (To && (To.style.backgroundColor = 'red'),
          (Co.dt = Ne),
          (_ = ((e, t) => {
            const r = v(t),
              n = zo(t.layer),
              o = Mo(t);
            let i = Ne,
              a = 1 / 0;
            for (const c of e) {
              if (!c.active) continue;
              if (c[tn.ne][tn._e]) continue;
              if (!Gr.rt.st && c.downed) continue;
              if (t.__id === c.__id) continue;
              if (!So(c.layer, o, n)) continue;
              if (v(c) === r) continue;
              const e = Zr.game[tn.p][tn.ge]({ x: c[tn.ce].x, y: c[tn.ce].y }),
                s = N(e.x, e.y, Zr.game[tn.X].mousePos._x, Zr.game[tn.X].mousePos._y);
              a > s && ((a = s), (i = c));
            }
            return i;
          })(a, c)),
          (Co.ut = _)),
        _)
      ) {
        const n = c[tn.ce],
          o = _[tn.ce],
          i = Pt(n.x - o.x, n.y - o.y);
        _ === Co.ut || Co.dt || ((Co.ut = _), (Co.ht[_.__id] = []), (Co.ft[_.__id] = []));
        const a = ((e, t) => {
          if (!e || !t) return Ne;
          const r = e[tn.ce],
            n = t[tn.ce],
            o = performance.now(),
            i = e.__id,
            a = (() => {
              if (0 == Zr.game.pings.length) return Fn ?? 0;
              let e = Nt([].slice, Zr.game.pings, [-5]),
                t = e.reduce((e, t) => e + t);
              return ((Fn = t / e.length / Ze), Fn);
            })(),
            c = Co.ht[i] ?? (Co.ht[i] = []);
          if ((c.push([o, { ...r }]), c.length > 20 && c.shift(), 20 > c.length))
            return Zr.game[tn.p][tn.ge]({ x: r.x, y: r.y });
          const s = (o - c[0][0]) / Ze,
            l = { x: (r.x - c[0][1].x) / s, y: (r.y - c[0][1].y) / s },
            d = k(w(t)),
            f = d?.speed || Ze,
            { x: u, y: h } = l,
            b = r.x - n.x,
            m = r.y - n.y,
            g = f ** 2 - u ** 2 - h ** 2,
            y = -2 * (u * b + h * m),
            p = -(b ** 2) - m ** 2;
          let v;
          if (1e-6 > Et(g)) v = -p / y + a;
          else {
            const e = y ** 2 - 4 * g * p;
            if (0 > e) return Zr.game[tn.p][tn.ge]({ x: r.x, y: r.y });
            const t = Dt(e),
              n = (-y - t) / (2 * g),
              o = (-y + t) / (2 * g);
            if (((v = (Lt(n, o) > 0 ? Lt(n, o) : jt(n, o)) + a), 0 > v || v > 5))
              return Zr.game[tn.p][tn.ge]({ x: r.x, y: r.y });
          }
          return Zr.game[tn.p][tn.ge]({ x: r.x + u * v, y: r.y + h * v });
        })(_, c);
        if (!a) return (x(new xn(Te)), To && (To.style.display = Ee), void (Co.ot = Ne));
        if (((f = { x: a.x, y: a.y }), C && (Gr.rt.ze || (Gr.nt.ze && 8 >= i)))) {
          const n =
            ((e = $n()),
            !!(t = a) &&
              (!e ||
                Pt(t.x - e.x, t.y - e.y) > 6 ||
                Et(((r = _o(t) - _o(e)), Tt(Bt(r), It(r)))) > No));
          (x(new xn('aimbot', { x: a.x, y: a.y }, Ne, !n)), (Co.ot = { x: a.x, y: a.y }), (l = !0));
          const o = Vr.Ue;
          d = o ? { x: o.clientX, y: o.clientY } : { x: a.x, y: a.y };
        } else d = { x: a.x, y: a.y };
      } else ((f = Ne), (d = Ne), To && (To.style.display = Ee), (Co.ot = Ne));
      if ((l || (x(new xn(Te)), (Co.ot = f ? { x: f.x, y: f.y } : Ne)), To)) {
        let e = d;
        if ((!e && f && (e = { x: f.x, y: f.y }), e && Gr.rt.bt)) {
          const { x: t, y: r } = e;
          ((To.style.left === t + nt && To.style.top === r + nt) ||
            ((To.style.left = t + nt), (To.style.top = r + nt)),
            (To.style.display = 'block'));
        } else To.style.display = Ee;
      }
    } catch (e) {
      (To && (To.style.display = Ee),
        x(new xn(Te, Ne, Ne, !0)),
        (Co.it = Ne),
        (Co.dt = Ne),
        (Co.ut = Ne),
        (Co.ot = Ne));
    }
  } catch (e) {
    (x(new xn({ mode: Te, immediate: !0 })), (Co.ot = Ne));
  }
  var e, t, r, n, o;
}
function M(e, t) {
  for (var r in t) e[r] = t[r];
  return e;
}
function S(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function T(e, t, r) {
  var n,
    o,
    i,
    a = {};
  for (i in t) 'key' == i ? (n = t[i]) : 'ref' == i ? (o = t[i]) : (a[i] = t[i]);
  if (
    (arguments.length > 2 && (a.children = arguments.length > 3 ? Ot.call(arguments, 2) : r),
    Me == typeof e && Ne != e.gt)
  )
    for (i in e.gt) void 0 === a[i] && (a[i] = e.gt[i]);
  return A(e, a, n, o, Ne);
}
function A(e, t, r, n, o) {
  var i = {
    type: e,
    yt: t,
    key: r,
    ref: n,
    vt: Ne,
    wt: Ne,
    _t: 0,
    kt: Ne,
    xt: Ne,
    constructor: void 0,
    Ct: o ?? ++Kt,
    zt: -1,
    Mt: 0,
  };
  return (Ne == o && Ne != Vt.Nt && Vt.Nt(i), i);
}
function P(e) {
  return e.children;
}
function D(e, t) {
  ((this.yt = e), (this.context = t));
}
function j(e, t) {
  if (Ne == t) return e.wt ? j(e.wt, e.zt + 1) : Ne;
  for (var r; e.vt.length > t; t++) if (Ne != (r = e.vt[t]) && Ne != r.kt) return r.kt;
  return Me == typeof e.type ? j(e) : Ne;
}
function E(e) {
  var t, r;
  if (Ne != (e = e.wt) && Ne != e.xt) {
    for (e.kt = e.xt.base = Ne, t = 0; e.vt.length > t; t++)
      if (Ne != (r = e.vt[t]) && Ne != r.kt) {
        e.kt = e.xt.base = r.kt;
        break;
      }
    return E(e);
  }
}
function L(e) {
  ((!e.St && (e.St = !0) && Zt.push(e) && !R.Tt++) || Gt != Vt.At) && ((Gt = Vt.At) || Ut)(R);
}
function R() {
  for (var e, t, r, n, o, i, a, c = 1; Zt.length; )
    (Zt.length > c && Zt.sort(Qt),
      (e = Zt.shift()),
      (c = Zt.length),
      e.St &&
        ((r = void 0),
        (n = void 0),
        (o = (n = (t = e).Ct).kt),
        (i = []),
        (a = []),
        t.jt &&
          (((r = M({}, n)).Ct = n.Ct + 1),
          Vt.Nt && Vt.Nt(r),
          O(
            t.jt,
            r,
            n,
            t.Pt,
            t.jt.namespaceURI,
            32 & n.Mt ? [o] : Ne,
            i,
            o ?? j(n),
            !!(32 & n.Mt),
            a
          ),
          (r.Ct = n.Ct),
          (r.wt.vt[r.zt] = r),
          K(i, r, a),
          (n.kt = n.wt = Ne),
          r.kt != o && E(r))));
  R.Tt = 0;
}
function I(e, t, r, n, o, i, a, c, s, l, d) {
  var f,
    u,
    b,
    m,
    g,
    y,
    p,
    v = (n && n.vt) || rr,
    w = t.length;
  for (
    s = ((e, t, r, n, o) => {
      var i,
        a,
        c,
        s,
        l,
        d = r.length,
        f = d,
        u = 0;
      for (e.vt = h(o), i = 0; o > i; i++)
        Ne != (a = t[i]) && 'boolean' != typeof a && Me != typeof a
          ? ((s = i + u),
            ((a = e.vt[i] =
              Fe == typeof a || Pe == typeof a || 'bigint' == typeof a || a.constructor == String
                ? A(Ne, a, Ne, Ne, Ne)
                : or(a)
                  ? A(P, { children: a }, Ne, Ne, Ne)
                  : Ne == a.constructor && a._t > 0
                    ? A(a.type, a.yt, a.key, a.ref ? a.ref : Ne, a.Ct)
                    : a).wt = e),
            (a._t = e._t + 1),
            (c = Ne),
            -1 != (l = a.zt = F(a, r, s, f)) && (f--, (c = r[l]) && (c.Mt |= 2)),
            Ne == c || Ne == c.Ct
              ? (-1 == l && (o > d ? u-- : d > o && u++), Me != typeof a.type && (a.Mt |= 4))
              : l != s && (l == s - 1 ? u-- : l == s + 1 ? u++ : (l > s ? u-- : u++, (a.Mt |= 4))))
          : (e.vt[i] = Ne);
      if (f)
        for (i = 0; d > i; i++)
          Ne != (c = r[i]) && !(2 & c.Mt) && (c.kt == n && (n = j(c)), Q(c, c));
      return n;
    })(r, t, v, s, w),
      f = 0;
    w > f;
    f++
  )
    Ne != (b = r.vt[f]) &&
      ((u = -1 == b.zt ? tr : v[b.zt] || tr),
      (b.zt = f),
      (y = O(e, b, u, o, i, a, c, s, l, d)),
      (m = b.kt),
      b.ref && u.ref != b.ref && (u.ref && U(u.ref, Ne, b), d.push(b.ref, b.xt || m, b)),
      Ne == g && Ne != m && (g = m),
      (p = !!(4 & b.Mt)) || u.vt === b.vt
        ? (s = B(b, s, e, p))
        : Me == typeof b.type && void 0 !== y
          ? (s = y)
          : m && (s = m.nextSibling),
      (b.Mt &= -7));
  return ((r.kt = g), s);
}
function B(e, t, r, n) {
  var o, i;
  if (Me == typeof e.type) {
    for (o = e.vt, i = 0; o && o.length > i; i++) o[i] && ((o[i].wt = e), (t = B(o[i], t, r, n)));
    return t;
  }
  e.kt != t &&
    (n && (t && e.type && !t.parentNode && (t = j(e)), r.insertBefore(e.kt, t || Ne)), (t = e.kt));
  do {
    t = t && t.nextSibling;
  } while (Ne != t && 8 == t.nodeType);
  return t;
}
function H(e, t) {
  return (
    (t = t || []),
    Ne == e ||
      'boolean' == typeof e ||
      (or(e)
        ? e.some((e) => {
            H(e, t);
          })
        : t.push(e)),
    t
  );
}
function F(e, t, r, n) {
  var o,
    i,
    a,
    c = e.key,
    s = e.type,
    l = t[r],
    d = Ne != l && !(2 & l.Mt);
  if ((Ne === l && Ne == e.key) || (d && c == l.key && s == l.type)) return r;
  if (n > (d ? 1 : 0))
    for (o = r - 1, i = r + 1; o >= 0 || t.length > i; )
      if (Ne != (l = t[(a = 0 > o ? i++ : o--)]) && !(2 & l.Mt) && c == l.key && s == l.type)
        return a;
  return -1;
}
function $(e, t, r) {
  '-' == t[0]
    ? e.setProperty(t, r ?? je)
    : (e[t] = Ne == r ? je : Pe != typeof r || nr.test(t) ? r : r + nt);
}
function q(e, t, r, n, o) {
  var i, a;
  e: if ('style' == t)
    if (Fe == typeof r) e.style.cssText = r;
    else {
      if ((Fe == typeof n && (e.style.cssText = n = je), n))
        for (t in n) (r && t in r) || $(e.style, t, je);
      if (r) for (t in r) (n && r[t] == n[t]) || $(e.style, t, r[t]);
    }
  else if ('o' == t[0] && 'n' == t[1])
    ((i = t != (t = t.replace(Yt, '$1'))),
      (a = t.toLowerCase()),
      (t = a in e || 'onFocusOut' == t || 'onFocusIn' == t ? a.slice(2) : t.slice(2)),
      e.l || (e.l = {}),
      (e.l[t + i] = r),
      r
        ? n
          ? (r.u = n.u)
          : ((r.u = Jt), e.addEventListener(t, i ? er : Xt, i))
        : e.removeEventListener(t, i ? er : Xt, i));
  else {
    if (Ae == o) t = t.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
    else if (
      'width' != t &&
      'height' != t &&
      'href' != t &&
      'list' != t &&
      'form' != t &&
      'tabIndex' != t &&
      'download' != t &&
      'rowSpan' != t &&
      'colSpan' != t &&
      'role' != t &&
      'popover' != t &&
      t in e
    )
      try {
        e[t] = r ?? je;
        break e;
      } catch (e) {}
    Me == typeof r ||
      (Ne == r || (!1 === r && '-' != t[4])
        ? e.removeAttribute(t)
        : e.setAttribute(t, 'popover' == t && 1 == r ? je : r));
  }
}
function W(e) {
  return function (t) {
    if (this.l) {
      var r = this.l[t.type + e];
      if (Ne == t.t) t.t = Jt++;
      else if (r.u > t.t) return;
      return r(Vt.event ? Vt.event(t) : t);
    }
  };
}
function O(e, t, r, n, o, i, a, c, s, l) {
  var d,
    f,
    u,
    h,
    b,
    m,
    g,
    y,
    p,
    v,
    w,
    k,
    x,
    z,
    C,
    N,
    _,
    T = t.type;
  if (Ne != t.constructor) return Ne;
  (128 & r.Mt && ((s = !!(32 & r.Mt)), (i = [(c = t.kt = r.kt)])), (d = Vt._t) && d(t));
  e: if (Me == typeof T)
    try {
      if (
        ((y = t.yt),
        (p = 'prototype' in T && T.prototype.render),
        (v = (d = T.contextType) && n[d.xt]),
        (w = d ? (v ? v.yt.value : d.wt) : n),
        r.xt
          ? (g = (f = t.xt = r.xt).wt = f.Bt)
          : (p
              ? (t.xt = f = new T(y, w))
              : ((t.xt = f = new D(y, w)), (f.constructor = T), (f.render = Y)),
            v && v.sub(f),
            (f.yt = y),
            f.state || (f.state = {}),
            (f.context = w),
            (f.Pt = n),
            (u = f.St = !0),
            (f.Dt = []),
            (f._sb = [])),
        p && Ne == f.Lt && (f.Lt = f.state),
        p && Ne != T.Ot && (f.Lt == f.state && (f.Lt = M({}, f.Lt)), M(f.Lt, T.Ot(y, f.Lt))),
        (h = f.yt),
        (b = f.state),
        (f.Ct = t),
        u)
      )
        (p && Ne == T.Ot && Ne != f.Et && f.Et(), p && Ne != f.It && f.Dt.push(f.It));
      else {
        if (
          (p && Ne == T.Ot && y !== h && Ne != f.Rt && f.Rt(y, w),
          (!f.kt && Ne != f.Ft && !1 === f.Ft(y, f.Lt, w)) || t.Ct == r.Ct)
        ) {
          for (
            t.Ct != r.Ct && ((f.yt = y), (f.state = f.Lt), (f.St = !1)),
              t.kt = r.kt,
              t.vt = r.vt,
              t.vt.some((e) => {
                e && (e.wt = t);
              }),
              k = 0;
            f._sb.length > k;
            k++
          )
            f.Dt.push(f._sb[k]);
          ((f._sb = []), f.Dt.length && a.push(f));
          break e;
        }
        (Ne != f.Ht && f.Ht(y, f.Lt, w),
          p &&
            Ne != f.Wt &&
            f.Dt.push(() => {
              f.Wt(h, b, m);
            }));
      }
      if (((f.context = w), (f.yt = y), (f.jt = e), (f.kt = !1), (x = Vt.Tt), (z = 0), p)) {
        for (
          f.state = f.Lt, f.St = !1, x && x(t), d = f.render(f.yt, f.state, f.context), C = 0;
          f._sb.length > C;
          C++
        )
          f.Dt.push(f._sb[C]);
        f._sb = [];
      } else
        do {
          ((f.St = !1), x && x(t), (d = f.render(f.yt, f.state, f.context)), (f.state = f.Lt));
        } while (f.St && 25 > ++z);
      ((f.state = f.Lt),
        Ne != f.qt && (n = M(M({}, n), f.qt())),
        p && !u && Ne != f.$t && (m = f.$t(h, b)),
        (N = d),
        Ne != d && d.type === P && Ne == d.key && (N = Z(d.yt.children)),
        (c = I(e, or(N) ? N : [N], t, r, n, o, i, a, c, s, l)),
        (f.base = t.kt),
        (t.Mt &= -161),
        f.Dt.length && a.push(f),
        g && (f.Bt = f.wt = Ne));
    } catch (e) {
      if (((t.Ct = Ne), s || Ne != i))
        if (e.then) {
          for (t.Mt |= s ? 160 : 128; c && 8 == c.nodeType && c.nextSibling; ) c = c.nextSibling;
          ((i[i.indexOf(c)] = Ne), (t.kt = c));
        } else {
          for (_ = i.length; _--; ) S(i[_]);
          V(t);
        }
      else ((t.kt = r.kt), (t.vt = r.vt), e.then || V(t));
      Vt.kt(e, t, r);
    }
  else
    Ne == i && t.Ct == r.Ct
      ? ((t.vt = r.vt), (t.kt = r.kt))
      : (c = t.kt = G(r.kt, t, r, n, o, i, a, s, l));
  return ((d = Vt.Zt) && d(t), 128 & t.Mt ? void 0 : c);
}
function V(e) {
  (e && e.xt && (e.xt.kt = !0), e && e.vt && e.vt.forEach(V));
}
function K(e, t, r) {
  for (var n = 0; r.length > n; n++) U(r[n], r[++n], r[++n]);
  (Vt.xt && Vt.xt(t, e),
    e.some((t) => {
      try {
        ((e = t.Dt),
          (t.Dt = []),
          e.some((e) => {
            e.call(t);
          }));
      } catch (e) {
        Vt.kt(e, t.Ct);
      }
    }));
}
function Z(e) {
  return Re != typeof e || Ne == e || (e._t && e._t > 0) ? e : or(e) ? e.map(Z) : M({}, e);
}
function G(e, t, r, n, o, i, a, c, s) {
  var l,
    d,
    f,
    u,
    h,
    b,
    m,
    g = r.yt,
    y = t.yt,
    p = t.type;
  if (
    ('svg' == p
      ? (o = Ae)
      : 'math' == p
        ? (o = 'http://www.w3.org/1998/Math/MathML')
        : o || (o = Oe),
    Ne != i)
  )
    for (l = 0; i.length > l; l++)
      if ((h = i[l]) && 'setAttribute' in h == !!p && (p ? h.localName == p : 3 == h.nodeType)) {
        ((e = h), (i[l] = Ne));
        break;
      }
  if (Ne == e) {
    if (Ne == p) return document.createTextNode(y);
    ((e = document.createElementNS(o, p, y.is && y)),
      c && (Vt.Vt && Vt.Vt(t, i), (c = !1)),
      (i = Ne));
  }
  if (Ne == p) g === y || (c && e.data == y) || (e.data = y);
  else {
    if (((i = i && Ot.call(e.childNodes)), (g = r.yt || tr), !c && Ne != i))
      for (g = {}, l = 0; e.attributes.length > l; l++) g[(h = e.attributes[l]).name] = h.value;
    for (l in g)
      if (((h = g[l]), ot == l));
      else if (Ue == l) f = h;
      else if (!(l in y)) {
        if ((Be == l && Ve in y) || (lt == l && 'defaultChecked' in y)) continue;
        q(e, l, Ne, h, o);
      }
    for (l in y)
      ((h = y[l]),
        ot == l
          ? (u = h)
          : Ue == l
            ? (d = h)
            : Be == l
              ? (b = h)
              : lt == l
                ? (m = h)
                : (c && Me != typeof h) || g[l] === h || q(e, l, h, g[l], o));
    if (d) (c || (f && (d.Gt == f.Gt || d.Gt == e.innerHTML)) || (e.innerHTML = d.Gt), (t.vt = []));
    else if (
      (f && (e.innerHTML = je),
      I(
        'template' == t.type ? e.content : e,
        or(u) ? u : [u],
        t,
        r,
        n,
        'foreignObject' == p ? Oe : o,
        i,
        a,
        i ? i[0] : r.vt && j(r, 0),
        c,
        s
      ),
      Ne != i)
    )
      for (l = i.length; l--; ) S(i[l]);
    c ||
      ((l = Be),
      'progress' == p && Ne == b
        ? e.removeAttribute(Be)
        : Ne != b &&
          (b !== e[l] || ('progress' == p && !b) || ('option' == p && b != g[l])) &&
          q(e, l, b, g[l], o),
      (l = lt),
      Ne != m && m != e[l] && q(e, l, m, g[l], o));
  }
  return e;
}
function U(e, t, r) {
  try {
    if (Me == typeof e) {
      var n = Me == typeof e.Mt;
      (n && e.Mt(), (n && Ne == t) || (e.Mt = e(t)));
    } else e.current = t;
  } catch (e) {
    Vt.kt(e, r);
  }
}
function Q(e, t, r) {
  var n, o;
  if (
    (Vt.unmount && Vt.unmount(e),
    (n = e.ref) && ((n.current && n.current != e.kt) || U(n, Ne, t)),
    Ne != (n = e.xt))
  ) {
    if (n.Kt)
      try {
        n.Kt();
      } catch (e) {
        Vt.kt(e, t);
      }
    n.base = n.jt = Ne;
  }
  if ((n = e.vt)) for (o = 0; n.length > o; o++) n[o] && Q(n[o], t, r || Me != typeof e.type);
  (r || S(e.kt), (e.xt = e.wt = e.kt = void 0));
}
function Y(e, t, r) {
  return this.constructor(e, r);
}
function J(e, t, r) {
  var n, o, i, a;
  (t == document && (t = document.documentElement),
    Vt.wt && Vt.wt(e, t),
    (o = (n = Me == typeof r) ? Ne : (r && r.vt) || t.vt),
    (i = []),
    (a = []),
    O(
      t,
      (e = ((!n && r) || t).vt = T(P, Ne, [e])),
      o || tr,
      tr,
      t.namespaceURI,
      !n && r ? [r] : o ? Ne : t.firstChild ? Ot.call(t.childNodes) : Ne,
      i,
      !n && r ? r : o ? o.kt : t.firstChild,
      n,
      a
    ),
    K(i, e, a));
}
function X(e, t) {
  J(e, t, X);
}
function ee(e, t) {
  (fr.Dt && fr.Dt(ar, e, lr || t), (lr = 0));
  var r = ar.Ut || (ar.Ut = { wt: [], Dt: [] });
  return (e >= r.wt.length && r.wt.push({}), r.wt[e]);
}
function te(e) {
  return (
    (lr = 1),
    (function (e, t) {
      var r,
        n,
        o,
        i = ee(ir++, 2);
      return (
        (i.t = e),
        i.xt ||
          ((i.wt = [
            fe(void 0, t),
            (e) => {
              var t = i.Jt ? i.Jt[0] : i.wt[0],
                r = i.t(t, e);
              t !== r && ((i.Jt = [r, i.wt[1]]), i.xt.Xt({}));
            },
          ]),
          (i.xt = ar),
          ar.Yt) ||
          ((r = function (e, t, r) {
            var o, a;
            return (
              !i.xt.Ut ||
              ((o = i.xt.Ut.wt.filter((e) => !!e.xt)),
              o.every((e) => !e.Jt)
                ? !n || n.call(this, e, t, r)
                : ((a = i.xt.yt !== e),
                  o.forEach((e) => {
                    if (e.Jt) {
                      var t = e.wt[0];
                      ((e.wt = e.Jt), (e.Jt = void 0), t !== e.wt[0] && (a = !0));
                    }
                  }),
                  (n && n.call(this, e, t, r)) || a))
            );
          }),
          (ar.Yt = !0),
          (n = ar.Ft),
          (o = ar.Ht),
          (ar.Ht = function (e, t, i) {
            if (this.kt) {
              var a = n;
              ((n = void 0), r(e, t, i), (n = a));
            }
            o && o.call(this, e, t, i);
          }),
          (ar.Ft = r)),
        i.Jt || i.wt
      );
    })(fe, e)
  );
}
function re(e, t) {
  var r = ee(ir++, 3);
  !fr.Lt && de(r.Ut, t) && ((r.wt = e), (r.u = t), ar.Ut.Dt.push(r));
}
function ne(e) {
  return ((lr = 5), oe(() => ({ current: e }), []));
}
function oe(e, t) {
  var r = ee(ir++, 7);
  return (de(r.Ut, t) && ((r.wt = e()), (r.Ut = t), (r.Dt = e)), r.wt);
}
function ie(e, t) {
  return ((lr = 8), oe(() => e, t));
}
function ae() {
  for (var e; (e = dr.shift()); )
    if (e.jt && e.Ut)
      try {
        (e.Ut.Dt.forEach(se), e.Ut.Dt.forEach(le), (e.Ut.Dt = []));
      } catch (t) {
        ((e.Ut.Dt = []), fr.kt(t, e.Ct));
      }
}
function ce(e) {
  var t,
    r = () => {
      (clearTimeout(n), pr && cancelAnimationFrame(t), At(e));
    },
    n = At(r, 35);
  pr && (t = zt(r));
}
function se(e) {
  var t = ar,
    r = e.xt;
  (Me == typeof r && ((e.xt = void 0), r()), (ar = t));
}
function le(e) {
  var t = ar;
  ((e.xt = e.wt()), (ar = t));
}
function de(e, t) {
  return !e || e.length !== t.length || t.some((t, r) => t !== e[r]);
}
function fe(e, t) {
  return Me == typeof t ? t(e) : t;
}
function ue(e, t) {
  var r, n;
  for (r in e) if ('__source' !== r && !(r in t)) return !0;
  for (n in t) if ('__source' !== n && e[n] !== t[n]) return !0;
  return !1;
}
function he(e, t) {
  ((this.yt = e), (this.context = t));
}
function be(e, t, r) {
  return (
    e &&
      (e.xt &&
        e.xt.Ut &&
        (e.xt.Ut.wt.forEach((e) => {
          Me == typeof e.xt && e.xt();
        }),
        (e.xt.Ut = Ne)),
      Ne !=
        (e = ((e, t) => {
          for (var r in t) e[r] = t[r];
          return e;
        })({}, e)).xt && (e.xt.jt === r && (e.xt.jt = t), (e.xt.kt = !0), (e.xt = Ne)),
      (e.vt = e.vt && e.vt.map((e) => be(e, t, r)))),
    e
  );
}
function me(e, t, r) {
  return (
    e &&
      r &&
      ((e.Ct = Ne),
      (e.vt = e.vt && e.vt.map((e) => me(e, t, r))),
      e.xt && e.xt.jt === t && (e.kt && r.appendChild(e.kt), (e.xt.kt = !0), (e.xt.jt = r))),
    e
  );
}
function ge() {
  ((this.Mt = 0), (this.o = Ne), (this._t = Ne));
}
function ye(e) {
  var t = e.wt.xt;
  return t && t.Qt && t.Qt(e);
}
function pe() {
  ((this.i = Ne), (this.l = Ne));
}
function ve() {}
function we() {
  return this.cancelBubble;
}
function ke() {
  return this.defaultPrevented;
}
function xe(e) {
  return {
    render(t) {
      ((e, t) => {
        (Ne == t.vt && (t.textContent = je), J(e, t));
      })(t, e);
    },
    unmount() {
      ((e) => {
        e.vt && J(Ne, e);
      })(e);
    },
  };
}
function ze(e, t, r, n, o, i) {
  var a, c, s, l;
  if ((t || (t = {}), 'ref' in (s = t)))
    for (c in ((s = {}), t)) 'ref' == c ? (a = t[c]) : (s[c] = t[c]);
  if (
    ((l = {
      type: e,
      yt: s,
      key: r,
      ref: a,
      vt: Ne,
      wt: Ne,
      _t: 0,
      kt: Ne,
      xt: Ne,
      constructor: void 0,
      Ct: --Ir,
      zt: -1,
      Mt: 0,
      er: o,
      tr: i,
    }),
    Me == typeof e && (a = e.gt))
  )
    for (c in a) void 0 === s[c] && (s[c] = a[c]);
  return (Vt.Nt && Vt.Nt(l), l);
}
function Ce(e) {
  (e(Gr), xi());
}
const Ne = null,
  _e = 'div',
  Me = 'function',
  Se = 'path',
  Te = 'idle',
  Ae = 'http://www.w3.org/2000/svg',
  Pe = 'number',
  De = 'https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest',
  je = '',
  Ee = 'none',
  Le = 'circle',
  Re = 'object',
  Ie = '0.375rem',
  Be = 'value',
  He = 'span',
  Fe = 'string',
  $e = 'group ',
  qe = 'hidden',
  We = '12',
  Oe = 'http://www.w3.org/1999/xhtml',
  Ve = 'defaultValue',
  Ke = 'mouseup',
  Ze = 1e3,
  Ge = 16,
  Ue = 'dangerouslySetInnerHTML',
  Qe = 'section-title',
  Ye = 'currentColor',
  Je = '0.5rem',
  Xe = 'feature-item',
  et = 'feature-name',
  tt = 'undefined',
  rt = 0.03489949670250097,
  nt = 'px',
  ot = 'children',
  it = 'line',
  at = 'help-title',
  ct = 0.9993908270190958,
  st = 'noopener noreferrer',
  lt = 'checked',
  dt = 'keydown',
  ft = '1mglay',
  ut = 'keybind-help-text',
  ht = 'player',
  bt = '0.625rem',
  mt = '2.0.0',
  gt = 'smoke',
  yt = 'layer',
  pt = 'section',
  vt = '0.75rem',
  wt = 'Layer Spoofer',
  kt = u.getOwnPropertyNames,
  xt = u.defineProperty,
  zt = requestAnimationFrame,
  Ct = String.fromCharCode,
  Nt = Reflect.apply,
  _t = h.isArray,
  Mt = u.values,
  St = u.keys,
  Tt = b.atan2,
  At = setTimeout,
  Pt = b.hypot,
  Dt = b.sqrt,
  jt = b.max,
  Et = b.abs,
  Lt = b.min,
  Rt = Date.now,
  It = b.cos,
  Bt = b.sin,
  Ht = b.PI,
  Ft = Promise,
  $t = Symbol,
  qt = Number,
  Wt = Proxy;
var Ot,
  Vt,
  Kt,
  Zt,
  Gt,
  Ut,
  Qt,
  Yt,
  Jt,
  Xt,
  er,
  tr,
  rr,
  nr,
  or,
  ir,
  ar,
  cr,
  sr,
  lr,
  dr,
  fr,
  ur,
  hr,
  br,
  mr,
  gr,
  yr,
  pr,
  vr,
  wr,
  kr,
  xr,
  zr,
  Cr,
  Nr,
  _r,
  Mr,
  Sr,
  Tr,
  Ar,
  Pr,
  Dr,
  jr,
  Er,
  Lr,
  Rr,
  Ir;
const Br = je.charCodeAt,
  Hr = Ct,
  Fr = window.ou,
  $r = window.ou.document,
  qr = window.sr,
  Wr = window.sl,
  Or = '__cf_ray',
  Vr = { Ue: Ne, rr: Ne },
  Kr = { lt: [], Je: 0 };
let Zr;
const Gr = ((e, t) => {
  const r = {},
    n = {},
    o = (e, t, n) => {
      const i = {};
      for (const a in e) {
        if ('_k' === a) continue;
        const c = e[a],
          s = t?.[a];
        if (Re == typeof c && c._k) i[a] = o(c, s, n + '.' + a);
        else {
          const e = n + '.' + a;
          ((r[e] = Pe == typeof s ? s : !!s),
            xt(i, a, {
              get() {
                return r[e];
              },
              set(t) {
                r[e] = Pe == typeof r[e] ? (Pe == typeof t ? t : 0) : !!t;
              },
              enumerable: !0,
            }));
        }
      }
      return i;
    };
  for (const r in e) n[r] = o(e[r], t[r], r);
  return (
    (n._serialize = () => {
      const t = (e, n) => {
          const o = {};
          for (const i in e) {
            if ('_k' === i) continue;
            const a = e[i];
            Re == typeof a && a._k ? (o[a._k] = t(a, n + '.' + i)) : (o[a] = r[n + '.' + i]);
          }
          return o;
        },
        n = {};
      for (const r in e) n[e[r]._k] = t(e[r], r);
      return n;
    }),
    (n._deserialize = (t) => {
      if (!t || Re != typeof t) return;
      const n = (e, t, o) => {
        if (t && Re == typeof t)
          for (const i in e) {
            if ('_k' === i) continue;
            const a = e[i];
            if (Re == typeof a && a._k) n(a, t[a._k], o + '.' + i);
            else {
              const e = t[a];
              if (void 0 !== e) {
                const t = o + '.' + i;
                r[t] = Pe == typeof r[t] ? (Pe == typeof e ? e : 0) : !!e;
              }
            }
          }
      };
      for (const r in e) n(e[r], t[e[r]._k], r);
    }),
    n
  );
})(
  {
    rt: { _k: '\t', ze: '𝅷', nr: '𝅹', st: '󠀁', ir: '󠀻', bt: '󠀢' },
    nt: { _k: '󠁑', ze: '󠁧', ct: '󠁢' },
    ar: { _k: '󠁠', ze: '󠄇', nr: '󠄧' },
    sr: { _k: '󠄸', ze: '󠄴' },
    Me: { _k: '󠅔', ze: '󠅑', Te: '󠅢', Ae: '󠅿', Ne: '󠆛', Se: '󠆸' },
    $e: {
      _k: '󠇍',
      qe: '󠇓',
      ze: '󠇥',
      Ze: '󠇯',
      Ye: { _k: '󠇮', Qe: '󠅬', Xe: '󠅰', Ke: '󠅝' },
      Ge: { _k: '󠅎', Ve: '󠅋', Ke: '󠄼' },
    },
    cr: { _k: '󠄩', ze: '󠄞', lr: '󠄚' },
    dr: { _k: '󠄏', ze: '󠄏󠄏' },
    ur: { _k: '󠄏󠄏󠄏', ze: '󠄎' },
    hr: { _k: '󠄎󠄎', ze: '󠄃', br: '󠄃󠄃' },
    mr: { _k: '󠅁󠅁', ze: '󠅁' },
  },
  {
    rt: { ze: !0, nr: 50, st: !0, ir: !0, bt: !0 },
    nt: { ze: !0, ct: !1 },
    ar: { ze: !1, nr: 50 },
    sr: { ze: !0 },
    Me: { ze: !0, Te: 50, Se: !0, Ae: 50, Ne: !0 },
    $e: { qe: !0, ze: !0, Ze: !0, Ge: { Ve: !0, Ke: !0 }, Ye: { Qe: !0, Xe: !0, Ke: !0 } },
    dr: { ze: !0 },
    cr: { ze: !0, lr: !0 },
    ur: { ze: !0 },
    hr: { ze: !0, br: !1 },
    mr: { ze: !0 },
  }
);
let Ur,
  Qr,
  Yr = !1,
  Jr = !1;
const Xr = JSON.stringify;
let en = Ne;
Ne == Ne &&
  (en = setInterval(() => {
    (() => {
      if (!Yr || Jr) return;
      Jr = !0;
      const e = Gr._serialize(),
        t = Xr(e);
      (t !== Qr &&
        (((e, t) => {
          const r = ((e) => {
            let t = je;
            for (let r = 0; e.length > r; r++) t += e.charCodeAt(r).toString(Ge).padStart(4, '0');
            return t;
          })(Fe == typeof t ? t : (t ?? je) + je);
          $r.cookie = ((e) => `${Or}=${e}; path=/; max-age=315360000`)(r);
        })(0, m(t)),
        (Qr = t)),
        (Jr = !1));
    })();
  }, 250));
let tn = {},
  rn = !1;
const nn = new WeakMap();
((nn.set = nn.set),
  (nn.get = nn.get),
  (nn.delete = nn.delete),
  (nn.has = nn.has),
  p(Fr.Function.prototype, 'toString', {
    apply(e, t, r) {
      return Nt(e, nn.get(t) || t, r);
    },
  }),
  p(Fr.Element.prototype, 'attachShadow', {
    apply(e, t, r) {
      for (;;)
        try {
          je();
        } catch {}
    },
  }));
const on = EventTarget.prototype.addEventListener,
  an = { capture: !0, passive: !1 },
  cn = (e) => {
    if (e.shiftKey && Gr.ur.ze)
      try {
        const t = Zr.game[tn.V][tn.oe];
        let r = t[tn.ue];
        ((r += e.deltaY > 0 ? 20 : -30),
          (r = jt(36, r)),
          xt(t, tn.ue, { configurable: !0, get: () => r, set() {} }),
          e.preventDefault(),
          e.stopImmediatePropagation());
      } catch {}
  },
  sn = 4,
  ln = 13;
let dn;
p(Fr.Object, 'keys', {
  apply(e, t, r) {
    return (
      'bullet' == r[0]?.bullet_mp5?.type &&
        'explosion' == r[0]?.explosion_frag?.type &&
        'gun' == r[0]?.mp5?.type &&
        'throwable' == r[0]?.frag?.type &&
        ((dn = r[0]), (Fr.Object.keys = e)),
      Nt(e, t, r)
    );
  },
});
let fn = { gr: void 0, yr: void 0 },
  un = !1,
  hn = Ne;
const bn = 'Space';
let mn = Ne,
  gn = Ne,
  yn = 1;
const pn = (e, t) => {
    if (e?.container)
      try {
        e.container.alpha = t;
      } catch {}
  },
  vn = () => {
    try {
      gn &&
        (((e) => {
          if (e)
            try {
              mn
                ? (xt(e, yt, mn), !(Be in mn) || mn.get || mn.set || (e.layer = hn))
                : Ne !== hn && (e.layer = hn);
            } catch {
              if (Ne !== hn)
                try {
                  e.layer = hn;
                } catch {}
            } finally {
              ((mn = Ne), (hn = Ne));
            }
        })(gn),
        pn(gn, yn));
    } catch {}
    ((un = !1), (gn = Ne), (yn = 1));
  },
  wn = (e) => {
    if (e.code === bn && Gr.mr.ze && !un)
      try {
        const e = Zr.game?.[tn.V];
        if (!e || void 0 === e.layer || !e.container) return;
        ((gn = e),
          (yn = e.container.alpha),
          ((e, t) => {
            if (!e || void 0 === e.layer) return !1;
            try {
              if (((mn = u.getOwnPropertyDescriptor(e, yt)), (hn = e.layer), mn)) {
                if (!mn.configurable) return ((mn = Ne), !1);
              } else mn = { value: hn, writable: !0, enumerable: !0, configurable: !0 };
              return (
                xt(e, yt, {
                  configurable: !0,
                  get() {
                    return t;
                  },
                  set() {},
                }),
                !0
              );
            } catch {
              return ((mn = Ne), (hn = Ne), !1);
            }
          })(e, 0 === e.layer ? 1 : 0)
            ? ((un = !0), pn(e, 0.5))
            : (gn = Ne));
      } catch {
        vn();
      }
  },
  kn = (e) => {
    e.code === bn && un && vn();
  };
class xn {
  constructor(e = Te, t = Ne, r = Ne, n = !1) {
    ((this.Pe = e), (this.Be = t), (this.De = r), (this.Le = n));
  }
}
const zn = 0.001,
  Cn = Ht / 90,
  Nn = (e) => 1 - (1 - e) ** 3,
  _n = (e) => jt(0, Lt(1, e)),
  Mn = {
    je: !1,
    Pe: Te,
    Oe: { x: 0, y: 0 },
    Ee: Ne,
    Re: Ne,
    Ie: Ne,
    pr: !1,
    We: Ne,
    Fe: Ne,
    He: Ne,
    vr: !1,
    wr: Ne,
  },
  Sn = (e) => (e ? { x: e.x, y: e.y } : Ne),
  Tn = (e, t) => !((!e && !t) || (e && t && zn >= Et(e.x - t.x) && zn >= Et(e.y - t.y))),
  An = (e) =>
    e ? { touchMoveActive: e.touchMoveActive, touchMoveLen: e.touchMoveLen, x: e.x, y: e.y } : Ne,
  Pn = () => ({ x: Fr.innerWidth / 2, y: Fr.innerHeight / 2 }),
  Dn = (e, t) => Tt(e.y - t.y, e.x - t.x),
  jn = (e, t) => {
    return Et(Tt(Bt((r = t - e)), It(r)));
    var r;
  },
  En = (e, t) => {
    if (!e || !t) return 45;
    const r = Pn(),
      n = Dn(e, r),
      o = Dn(t, r),
      i = jn(n, o),
      a = Pt(t.x - e.x, t.y - e.y),
      c = _n(i / Ht),
      s = _n(a / 450);
    return 45 + 360 * jt(c, s) * (Gr.rt.nr / 100);
  },
  Ln = (e) => {
    e
      ? ((Mn.pr = !0), (Mn.Ee = Sn(e)), (Vr.Ue = { clientX: e.x, clientY: e.y }))
      : ((Mn.pr = !1), (Mn.Ee = Ne), (Vr.Ue = Ne));
  },
  Rn = () => {
    Ne !== Mn.wr && (clearTimeout(Mn.wr), (Mn.wr = Ne));
  },
  In = (e) => {
    (Rn(),
      (Mn.wr = At(
        () => {
          ((Mn.wr = Ne), Te === Mn.Pe && ((Mn.Ie = Ne), Ln(Ne)));
        },
        jt(0, e)
      )));
  },
  Bn = (e = performance.now()) => {
    if (!Mn.je) return;
    let t = Ne;
    const r = Mn.Ie;
    let n = !1;
    if (r) {
      const { startPos: o, targetPos: i, startTime: a, duration: c } = r,
        s = c > 0 ? _n((e - a) / c) : 1,
        l = Nn(s);
      let d = !1;
      if (c > 0 && o && i)
        if (Pt(i.x - o.x, i.y - o.y) > 6) d = !0;
        else {
          const e = Pn();
          d = jn(Dn(o, e), Dn(i, e)) > Cn;
        }
      (d && 0.999 > s && Te !== Mn.Pe && (n = !0),
        (t = { x: o.x + (i.x - o.x) * l, y: o.y + (i.y - o.y) * l }),
        0.999 > s || ((Mn.Ie = Ne), Te === Mn.Pe ? (t = Ne) : ((Mn.Re = Sn(i)), (t = Sn(i)))));
    } else Te !== Mn.Pe && Mn.Re && (t = Sn(Mn.Re));
    ((Mn.vr = n),
      Ln(t),
      ((e) => {
        const t = Mn.He;
        if (t) {
          const { startDir: r, targetDir: n, startTime: o, duration: i } = t,
            a = i > 0 ? _n((e - o) / i) : 1,
            c = Nn(a);
          let s;
          if (!r && n)
            s = { touchMoveActive: !0, touchMoveLen: n.touchMoveLen * c, x: n.x * c, y: n.y * c };
          else if (r && n)
            s = {
              touchMoveActive: !0,
              touchMoveLen: r.touchMoveLen + (n.touchMoveLen - r.touchMoveLen) * c,
              x: r.x + (n.x - r.x) * c,
              y: r.y + (n.y - r.y) * c,
            };
          else if (r && !n) {
            const e = 1 - c;
            s = {
              touchMoveActive: e > zn,
              touchMoveLen: r.touchMoveLen * e,
              x: r.x * e,
              y: r.y * e,
            };
          } else s = Ne;
          ((Mn.We = s), 0.999 > a || ((Mn.He = Ne), (Mn.We = n ? An(n) : Ne)));
        }
        Vr.rr = Mn.We?.touchMoveActive && Mn.We.touchMoveLen > zn ? An(Mn.We) : Ne;
      })(e),
      (() => {
        if (!Mn.pr || Te === Mn.Pe) return;
        const e = Zr?.game;
        if (!e?.initialized) return;
        const t = e[tn.V],
          r = t?.bodyContainer,
          n = Mn.Ee;
        if (!r || !n) return;
        const o = Pn();
        r.rotation = Tt(n.y - o.y, n.x - o.x) || 0;
      })());
  },
  Hn = () => {
    if (Mn.je) return;
    const e = Zr?.game,
      t = Zr?.pixi?._ticker;
    if (!e || !t) return;
    const r = e[tn.X],
      n = r?.mousePos;
    if (!n) return void Fr.requestAnimationFrame(Hn);
    Mn.Oe = { x: n._x ?? n.x ?? Fr.innerWidth / 2, y: n._y ?? n.y ?? Fr.innerHeight / 2 };
    const o = (e) => ({
      configurable: !0,
      get() {
        return ((e, t) => {
          if (!Mn.pr) return t;
          const r = Mn.Ee;
          return r ? ('x' === e ? r.x : r.y) : t;
        })(e, this['_' + e]);
      },
      set(t) {
        ((this['_' + e] = t),
          ((e, t) => {
            if (((Mn.Oe = { ...Mn.Oe, [e]: t }), Te !== Mn.Pe)) return;
            if (!Mn.pr) return ((Mn.Ee = Ne), void (Mn.Ie = Ne));
            const r = performance.now();
            Bn(r);
            const n = Sn(Mn.Oe),
              o = Mn.Ee ?? n;
            if (!Tn(o, n)) return (Rn(), (Mn.Ie = Ne), (Mn.Re = Ne), void Ln(Ne));
            const i = En(o, n);
            ((Mn.Ie = { startPos: Sn(o), targetPos: n, startTime: r, duration: i }), In(i));
          })(e, t));
      },
    });
    (xt(n, 'x', o('x')), xt(n, 'y', o('y')), t.add(() => Bn()), (Mn.je = !0));
  };
let Fn;
const $n = () => Sn(Mn.Ee),
  qn = (e, t) => ({ x: e, y: t }),
  Wn = (e) => ({ x: e.x, y: e.y }),
  On = (e, t) => ({ x: e.x + t.x, y: e.y + t.y }),
  Vn = (e, t) => ({ x: e.x - t.x, y: e.y - t.y }),
  Kn = (e, t) => ({ x: e.x * t, y: e.y * t }),
  Zn = (e, t) => e.x * t.x + e.y * t.y,
  Gn = (e) => e.x * e.x + e.y * e.y,
  Un = (e) => {
    const t = Dt(e.x * e.x + e.y * e.y);
    return t > 1e-4 ? { x: e.x / t, y: e.y / t } : { x: 1, y: 0 };
  },
  Qn = (e, t) => (1 & e) == (1 & t) || (2 & e && 2 & t),
  Yn = {
    _r(e, t, r, n) {
      const o = Vn(t, e),
        i = 1 / o.x,
        a = 1 / o.y,
        c = (r.x - e.x) * i,
        s = (n.x - e.x) * i,
        l = (r.y - e.y) * a,
        d = (n.y - e.y) * a,
        f = jt(Lt(c, s), Lt(l, d)),
        u = Lt(jt(c, s), jt(l, d));
      if (0 > u || f > u || f > 1) return Ne;
      const h = On(e, Kn(o, jt(0, f))),
        b = Kn(On(r, n), 0.5),
        m = Kn(Vn(n, r), 0.5),
        g = Vn(h, b);
      let y;
      const p = Et(Et(g.x) - m.x);
      return (
        (y = Et(Et(g.y) - m.y) > p ? { x: g.x > 0 ? 1 : -1, y: 0 } : { x: 0, y: g.y > 0 ? 1 : -1 }),
        { point: h, normal: y }
      );
    },
    tt(e, t, r, n) {
      const o = Vn(t, e),
        i = Vn(e, r),
        a = Zn(o, o),
        c = 2 * Zn(i, o);
      let s = c * c - 4 * a * (Zn(i, i) - n * n);
      if (0 > s) return Ne;
      s = Dt(s);
      const l = (-c - s) / (2 * a),
        d = (-c + s) / (2 * a);
      let f = -1;
      if ((0 > l || l > 1 ? 0 > d || d > 1 || (f = d) : (f = l), 0 > f)) return Ne;
      const u = On(e, Kn(o, f));
      return { point: u, normal: Un(Vn(u, r)) };
    },
    et: (e, t, r) =>
      e
        ? 1 === e.type
          ? Yn._r(t, r, e.min, e.max)
          : 0 === e.type
            ? Yn.tt(t, r, e.pos, e.rad)
            : Ne
        : Ne,
  },
  Jn = 3836148,
  Xn = 14432052,
  eo = 16777215,
  to = 16750848,
  ro = 11184810,
  no = 16733440,
  oo = 16711680,
  io = 15610675,
  ao = {},
  co = (e) => 2 === e || 3 === e,
  so = (e) => (co(e.layer) ? e.layer : un && void 0 !== hn ? hn : e.layer),
  lo = (e, t, r) => !(!co(e) && !r) || e === t,
  fo = (e, t) => (
    e[t] ||
      (ao[t] && ao[t].parent && ao[t].parent.removeChild(ao[t]),
      (e[t] = new fn.gr()),
      e.addChild(e[t])),
    e[t]
  ),
  uo = (e, t, r, n, o, i = 255, a = 0.1) => {
    if (!r || !n) return;
    const c = { x: Ge * (t[tn.ae].x - e[tn.ae].x), y: Ge * (e[tn.ae].y - t[tn.ae].y) },
      s = Zr.game,
      l = t === e,
      d = s[tn.R].spectating,
      f = s[tn.m].shotDetected || s[tn.Y].isBindDown(sn);
    let u;
    const h = l && !d ? $n() : Ne;
    if (h) {
      const e = s[tn.p][tn.ge]({ x: t[tn.ae].x, y: t[tn.ae].y });
      u = Tt(e.y - h.y, e.x - h.x) - Ht;
    } else if (!l || d || (Vr.Ue && f))
      if (l && !d && Vr.Ue) {
        const e = s[tn.p][tn.ge]({ x: t[tn.ae].x, y: t[tn.ae].y });
        u = Tt(e.y - Vr.Ue.clientY, e.x - Vr.Ue.clientX) - Ht;
      } else u = Tt(t[tn.le].x, t[tn.le].y) - Ht / 2;
    else u = Tt(s[tn.X].mousePos._y - Fr.innerHeight / 2, s[tn.X].mousePos._x - Fr.innerWidth / 2);
    const b = n.shotSpread * (Ht / 180);
    (o.beginFill(i, a),
      o.moveTo(c.x, c.y),
      o.arc(c.x, c.y, 16.25 * r.distance, u - b / 2, u + b / 2),
      o.lineTo(c.x, c.y),
      o.endFill());
  },
  ho = ['frag', 'mirv', 'martyr_nade'];
let bo = Rt(),
  mo = !1,
  go = Ne;
const yo = () => {
    ((mo = !1), go && (go.destroy(), (go = Ne)));
  },
  po = () => {
    var e;
    if (
      (() => {
        const e = Zr.game;
        if (!e?.initialized) return !1;
        const t = e[tn.V];
        return Ne != t?.[tn.oe]?.[tn.pe] && Ne != t?.[tn.ne]?.[tn.we];
      })()
    )
      if (3 === Zr.game[tn.V][tn.oe][tn.pe])
        try {
          const t = Zr.game,
            r = t[tn.V],
            n = r[tn.ne][tn.we],
            o = (Rt() - bo) / Ze;
          if (!((e) => 'cook' === e.throwableState)(r) || ((e = n), !ho.some((t) => e.includes(t))))
            return void yo();
          if ((o > 4 && (mo = !1), !mo))
            return (
              yo(),
              (go = new Zr.game[tn.R][tn.ie].constructor()),
              Zr.pixi.stage.addChild(go.container),
              go.start('Grenade', 0, 4),
              (mo = !0),
              void (bo = Rt())
            );
          go.update(o - go.elapsed, t[tn.p]);
        } catch {}
      else yo();
  };
let vo;
const wo = () => {
    vo = Gr.sr.ze;
  },
  ko = (e) => {
    0 === e.button && wo();
  },
  xo = (e) => {
    0 === e.button && (vo = !1);
  },
  zo = (e) => 2 === e || 3 === e,
  Co = { dt: Ne, ht: {}, ut: Ne, it: Ne, ft: {}, ot: Ne },
  No = Ht / 90,
  _o = (e) => (e ? Tt(e.y - Fr.innerHeight / 2, e.x - Fr.innerWidth / 2) : 0),
  Mo = (e) => (zo(e.layer) ? e.layer : un && void 0 !== hn ? hn : e.layer),
  So = (e, t, r) => !(!zo(e) && !r) || e === t;
let To;
Nt(on, Fr, [
  dt,
  (e) => {
    'KeyN' === e.code && (Co.dt ? (Co.dt = Ne) : Gr.rt.ir && (Co.dt = Co.ut));
  },
]);
let Ao = !1;
const Po = {
    container_06: 14074643,
    barn_01: 6959775,
    stone_02: 1646367,
    tree_03: 16777215,
    tree_03sp: 255,
    stone_04: 15406938,
    stone_05: 15406938,
    crate_03: 5342557,
    bunker_storm_01: 6959775,
    bunker_hydra_01: 10030546,
    bunker_crossing_stairs_01b: 13571226,
    bunker_crossing_stairs_01: 13571226,
  },
  Do = {
    container_06: 1,
    stone_02: 6,
    tree_03: 8,
    tree_03sp: 8,
    barn_01: 1,
    stone_04: 6,
    stone_05: 6,
    crate_03: 1.8,
    bunker_storm_01: 1.75,
    bunker_hydra_01: 1.75,
    bunker_crossing_stairs_01b: 2,
    bunker_crossing_stairs_01: 2,
  },
  jo = [11, 12],
  Eo = [
    { kr: je, Cr: Ne, zr: Rt(), Mr: je },
    { kr: je, Cr: Ne, zr: Rt(), Mr: je },
    { kr: je, Cr: Ne, Mr: je },
    { kr: je, Cr: Ne, Mr: je },
  ],
  Lo = (e) => Kr.lt.push(e),
  Ro = (e) => {
    try {
      const t = dn[e];
      return ('single' === t.fireMode || 'burst' === t.fireMode) && t.fireDelay >= 0.45;
    } catch {
      return !1;
    }
  },
  Io = (e) => {
    Lo(jo[e]);
  },
  Bo = () => {
    var e, t;
    if (
      Zr.game?.[tn.h] &&
      Ne != Zr.game?.[tn.V]?.[tn.oe]?.[tn.pe] &&
      Zr.game?.initialized &&
      Gr.hr.ze
    )
      try {
        const r = Zr.game[tn.V][tn.oe],
          n = r[tn.pe],
          o = r[tn.ve],
          i = o[n],
          a = Eo[n];
        if (i.ammo === a.Cr) return;
        const c = 0 === n ? 1 : 0,
          s = o[c];
        (Ro(i.type) &&
          i.type === a.Mr &&
          (a.Cr > i.ammo ||
            (0 === a.Cr &&
              i.ammo > a.Cr &&
              (Zr.game[tn.m].shotDetected || Zr.game[tn.Y].isBindDown(sn)))) &&
          ((a.zr = Rt()),
          Ro(s.type) && s.ammo && !Gr.hr.br
            ? Io(c)
            : je !== s.type
              ? ((t = n), Io(c), Io(t))
              : ((e = n), Lo(ln), Io(e))),
          (a.Cr = i.ammo),
          (a.Mr = i.type));
      } catch {}
  };
((tr = {}),
  (nr = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i),
  (or = _t),
  (Ot = (rr = []).slice),
  (Vt = {
    kt(e, t, r, n) {
      for (var o, i, a; (t = t.wt); )
        if ((o = t.xt) && !o.wt)
          try {
            if (
              ((i = o.constructor) && Ne != i.Nr && (o.Xt(i.Nr(e)), (a = o.St)),
              Ne != o.Sr && (o.Sr(e, n || {}), (a = o.St)),
              a)
            )
              return (o.Bt = o);
          } catch (t) {
            e = t;
          }
      throw e;
    },
  }),
  (Kt = 0),
  (D.prototype.Xt = function (e, t) {
    var r;
    ((r = Ne != this.Lt && this.Lt != this.state ? this.Lt : (this.Lt = M({}, this.state))),
      Me == typeof e && (e = e(M({}, r), this.yt)),
      e && M(r, e),
      Ne != e && this.Ct && (t && this._sb.push(t), L(this)));
  }),
  (D.prototype.Tr = function (e) {
    this.Ct && ((this.kt = !0), e && this.Dt.push(e), L(this));
  }),
  (D.prototype.render = P),
  (Zt = []),
  (Ut = Me == typeof Ft ? Ft.prototype.then.bind(Ft.resolve()) : At),
  (Qt = (e, t) => e.Ct._t - t.Ct._t),
  (R.Tt = 0),
  (Yt = /(PointerCapture)$|Capture$/i),
  (Jt = 0),
  (Xt = W(!1)),
  (er = W(!0)),
  (lr = 0),
  (dr = []),
  (ur = (fr = Vt)._t),
  (hr = fr.Tt),
  (br = fr.Zt),
  (mr = fr.xt),
  (gr = fr.unmount),
  (yr = fr.wt),
  (fr._t = (e) => {
    ((ar = Ne), ur && ur(e));
  }),
  (fr.wt = (e, t) => {
    (e && t.vt && t.vt.Vt && (e.Vt = t.vt.Vt), yr && yr(e, t));
  }),
  (fr.Tt = (e) => {
    (hr && hr(e), (ir = 0));
    var t = (ar = e.xt).Ut;
    (t &&
      (cr === ar
        ? ((t.Dt = []),
          (ar.Dt = []),
          t.wt.forEach((e) => {
            (e.Jt && (e.wt = e.Jt), (e.u = e.Jt = void 0));
          }))
        : (t.Dt.forEach(se), t.Dt.forEach(le), (t.Dt = []), (ir = 0))),
      (cr = ar));
  }),
  (fr.Zt = (e) => {
    br && br(e);
    var t = e.xt;
    (t &&
      t.Ut &&
      (t.Ut.Dt.length &&
        ((1 !== dr.push(t) && sr === fr.requestAnimationFrame) ||
          ((sr = fr.requestAnimationFrame) || ce)(ae)),
      t.Ut.wt.forEach((e) => {
        (e.u && (e.Ut = e.u), (e.u = void 0));
      })),
      (cr = ar = Ne));
  }),
  (fr.xt = (e, t) => {
    (t.some((e) => {
      try {
        (e.Dt.forEach(se), (e.Dt = e.Dt.filter((e) => !e.wt || le(e))));
      } catch (r) {
        (t.some((e) => {
          e.Dt && (e.Dt = []);
        }),
          (t = []),
          fr.kt(r, e.Ct));
      }
    }),
      mr && mr(e, t));
  }),
  (fr.unmount = (e) => {
    gr && gr(e);
    var t,
      r = e.xt;
    r &&
      r.Ut &&
      (r.Ut.wt.forEach((e) => {
        try {
          se(e);
        } catch (e) {
          t = e;
        }
      }),
      (r.Ut = void 0),
      t && fr.kt(t, r.Ct));
  }),
  (pr = Me == typeof zt),
  ((he.prototype = new D()).isPureReactComponent = !0),
  (he.prototype.Ft = function (e, t) {
    return ue(this.yt, e) || ue(this.state, t);
  }),
  (vr = Vt._t),
  (Vt._t = (e) => {
    (e.type && e.type.Yt && e.ref && ((e.yt.ref = e.ref), (e.ref = Ne)), vr && vr(e));
  }),
  (wr = Vt.kt),
  (Vt.kt = (e, t, r, n) => {
    if (e.then)
      for (var o, i = t; (i = i.wt); )
        if ((o = i.xt) && o.xt) return (Ne == t.kt && ((t.kt = r.kt), (t.vt = r.vt)), o.xt(e, t));
    wr(e, t, r, n);
  }),
  (kr = Vt.unmount),
  (Vt.unmount = (e) => {
    var t = e.xt;
    (t && t.Ar && t.Ar(), t && 32 & e.Mt && (e.type = Ne), kr && kr(e));
  }),
  ((ge.prototype = new D()).xt = function (e, t) {
    var r,
      n,
      o,
      i,
      a = t.xt,
      c = this;
    (Ne == c.o && (c.o = []),
      c.o.push(a),
      (r = ye(c.Ct)),
      (n = !1),
      (o = () => {
        n || ((n = !0), (a.Ar = Ne), r ? r(i) : i());
      }),
      (a.Ar = o),
      (i = () => {
        var e, t;
        if (!--c.Mt)
          for (
            c.state.Qt && (c.Ct.vt[0] = me((e = c.state.Qt), e.xt.jt, e.xt.jr)),
              c.Xt({ Qt: (c._t = Ne) });
            (t = c.o.pop());

          )
            t.Tr();
      }),
      c.Mt++ || 32 & t.Mt || c.Xt({ Qt: (c._t = c.Ct.vt[0]) }),
      e.then(o, o));
  }),
  (ge.prototype.Kt = function () {
    this.o = [];
  }),
  (ge.prototype.render = function (e, t) {
    var r, n, o;
    return (
      this._t &&
        (this.Ct.vt &&
          ((r = document.createElement(_e)),
          (this.Ct.vt[0] = be(this._t, r, ((n = this.Ct.vt[0].xt).jr = n.jt)))),
        (this._t = Ne)),
      (o = t.Qt && T(P, Ne, e.fallback)) && (o.Mt &= -33),
      [T(P, Ne, t.Qt ? Ne : e.children), o]
    );
  }),
  (xr = (e, t, r) => {
    if ((++r[1] === r[0] && e.l.delete(t), e.yt.Pr && ('t' !== e.yt.Pr[0] || !e.l.size)))
      for (r = e.i; r; ) {
        for (; r.length > 3; ) r.pop()();
        if (r[0] > r[1]) break;
        e.i = r = r[2];
      }
  }),
  ((pe.prototype = new D()).Qt = function (e) {
    var t = this,
      r = ye(t.Ct),
      n = t.l.get(e);
    return (
      n[0]++,
      (o) => {
        var i = () => {
          t.yt.Pr ? (n.push(o), xr(t, e, n)) : o();
        };
        r ? r(i) : i();
      }
    );
  }),
  (pe.prototype.render = function (e) {
    var t, r;
    for (
      this.i = Ne,
        this.l = new Map(),
        t = H(e.children),
        e.Pr && 'b' === e.Pr[0] && t.reverse(),
        r = t.length;
      r--;

    )
      this.l.set(t[r], (this.i = [1, 0, this.i]));
    return e.children;
  }),
  (pe.prototype.Wt = pe.prototype.It =
    function () {
      var e = this;
      this.l.forEach((t, r) => {
        xr(e, r, t);
      });
    }),
  (zr = (tt != typeof $t && $t.for && $t.for('react.element')) || 60103),
  (Cr =
    /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/),
  (Nr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/),
  (_r = /[A-Z0-9]/g),
  (Mr = tt != typeof document),
  (Sr = (e) => (tt != typeof $t && 'symbol' == typeof $t() ? /fil|che|rad/ : /fil|che|ra/).test(e)),
  (D.prototype.Br = {}),
  ['componentWillMount', 'componentWillReceiveProps', 'componentWillUpdate'].forEach(function (e) {
    xt(D.prototype, e, {
      configurable: !0,
      get() {
        return this['UNSAFE_' + e];
      },
      set(t) {
        xt(this, e, { configurable: !0, writable: !0, value: t });
      },
    });
  }),
  (Tr = Vt.event),
  (Vt.event = (e) => (Tr && (e = Tr(e)), (e.persist = ve), (e.Dr = we), (e.Lr = ke), (e.Or = e))),
  (Ar = {
    enumerable: !1,
    configurable: !0,
    get() {
      return this.class;
    },
  }),
  (Pr = Vt.Nt),
  (Vt.Nt = (e) => {
    (Fe == typeof e.type &&
      ((e) => {
        var t,
          r,
          o,
          i = e.yt,
          a = e.type,
          c = {},
          s = -1 === a.indexOf('-');
        for (t in i)
          ((r = i[t]),
            (Be === t && Ve in i && Ne == r) ||
              (Mr && ot === t && 'noscript' === a) ||
              'class' === t ||
              'className' === t ||
              ((o = t.toLowerCase()),
              Ve === t && Be in i && Ne == i.value
                ? (t = Be)
                : 'download' === t && !0 === r
                  ? (r = je)
                  : 'translate' === o && 'no' === r
                    ? (r = !1)
                    : 'o' === o[0] && 'n' === o[1]
                      ? 'ondoubleclick' === o
                        ? (t = 'ondblclick')
                        : 'onchange' !== o || (n !== a && 'textarea' !== a) || Sr(i.type)
                          ? 'onfocus' === o
                            ? (t = 'onfocusin')
                            : 'onblur' === o
                              ? (t = 'onfocusout')
                              : Nr.test(t) && (t = o)
                          : (o = t = 'oninput')
                      : s && Cr.test(t)
                        ? (t = t.replace(_r, '-$&').toLowerCase())
                        : Ne === r && (r = void 0),
              'oninput' === o && c[(t = o)] && (t = 'oninputCapture'),
              (c[t] = r)));
        ('select' == a &&
          c.multiple &&
          _t(c.value) &&
          (c.value = H(i.children).forEach((e) => {
            e.yt.selected = -1 != c.value.indexOf(e.yt.value);
          })),
          'select' == a &&
            Ne != c.defaultValue &&
            (c.value = H(i.children).forEach((e) => {
              e.yt.selected = c.multiple
                ? -1 != c.defaultValue.indexOf(e.yt.value)
                : c.defaultValue == e.yt.value;
            })),
          i.class && !i.className
            ? ((c.class = i.class), xt(c, 'className', Ar))
            : ((i.className && !i.class) || (i.class && i.className)) &&
              (c.class = c.className = i.className),
          (e.yt = c));
      })(e),
      (e.$$typeof = zr),
      Pr && Pr(e));
  }),
  (Dr = Vt.Tt),
  (Vt.Tt = (e) => {
    Dr && Dr(e);
  }),
  (jr = Vt.Zt),
  (Vt.Zt = (e) => {
    jr && jr(e);
    var t = e.yt,
      r = e.kt;
    Ne != r && 'textarea' === e.type && Be in t && t.value !== r.value && (r.value = t.value ?? je);
  }),
  (Er = P),
  (Lr = {
    createRoot: xe,
    hydrateRoot: (e, t) => (
      ((e, t) => {
        X(e, t);
      })(t, e),
      xe(e)
    ),
  }));
const Ho = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  Fo = (e) => {
    const t = ((e) =>
      e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, r) => (r ? r.toUpperCase() : t.toLowerCase())))(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  $o = (...e) =>
    e
      .filter((e, t, r) => !!e && je !== e.trim() && r.indexOf(e) === t)
      .join(' ')
      .trim();
Rr = {
  xmlns: Ae,
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: Ee,
  stroke: Ye,
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
const qo = ({
    color: e = Ye,
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    children: o,
    iconNode: i,
    class: a = je,
    ...c
  }) =>
    T(
      'svg',
      {
        ...Rr,
        width: t + je,
        height: t,
        stroke: e,
        'stroke-width': n ? (24 * +r) / +t : r,
        class: ['lucide', a].join(' '),
        ...c,
      },
      [...i.map(([e, t]) => T(e, t)), ...H(o)]
    ),
  Wo = (e, t) => {
    const r = ({ class: r = je, children: n, ...o }) =>
      T(qo, { ...o, iconNode: t, class: $o('lucide-' + Ho(Fo(e)), 'lucide-' + Ho(e), r) }, n);
    return ((r.displayName = Fo(e)), r);
  },
  Oo = Wo('arrow-left-right', [
    [Se, { d: 'M8 3 4 7l4 4', key: '9rb6wj' }],
    [Se, { d: 'M4 7h16', key: '6tx8e3' }],
    [Se, { d: 'm16 21 4-4-4-4', key: 'siv7j2' }],
    [Se, { d: 'M20 17H4', key: 'h6l3hr' }],
  ]),
  Vo = Wo('circle-question-mark', [
    [Le, { cx: We, cy: We, r: '10', key: ft }],
    [Se, { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', key: '1u773s' }],
    [Se, { d: 'M12 17h.01', key: 'p32p05' }],
  ]),
  Ko = Wo(Le, [[Le, { cx: We, cy: We, r: '10', key: ft }]]),
  Zo = Wo('database', [
    ['ellipse', { cx: We, cy: '5', rx: '9', ry: '3', key: 'msslwz' }],
    [Se, { d: 'M3 5V19A9 3 0 0 0 21 19V5', key: '1wlel7' }],
    [Se, { d: 'M3 12A9 3 0 0 0 21 12', key: 'mv7ke4' }],
  ]),
  Go = Wo('eye', [
    [
      Se,
      {
        d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
        key: '1nclc0',
      },
    ],
    [Le, { cx: We, cy: We, r: '3', key: '1v7zrd' }],
  ]),
  Uo = Wo('globe', [
    [Le, { cx: We, cy: We, r: '10', key: ft }],
    [Se, { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', key: '13o1zl' }],
    [Se, { d: 'M2 12h20', key: '9i4pu4' }],
  ]),
  Qo = Wo('map', [
    [
      Se,
      {
        d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
        key: '169xi5',
      },
    ],
    [Se, { d: 'M15 5.764v15', key: '1pn4in' }],
    [Se, { d: 'M9 3.236v15', key: '1uimfh' }],
  ]),
  Yo = Wo('package', [
    [
      Se,
      {
        d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z',
        key: '1a0edw',
      },
    ],
    [Se, { d: 'M12 22V12', key: 'd0xqtd' }],
    ['polyline', { points: '3.29 7 12 12 20.71 7', key: 'ousv84' }],
    [Se, { d: 'm7.5 4.27 9 5.15', key: '1c824w' }],
  ]),
  Jo = Wo('radio', [
    [Se, { d: 'M16.247 7.761a6 6 0 0 1 0 8.478', key: '1fwjs5' }],
    [Se, { d: 'M19.075 4.933a10 10 0 0 1 0 14.134', key: 'ehdyv1' }],
    [Se, { d: 'M4.925 19.067a10 10 0 0 1 0-14.134', key: '1q22gi' }],
    [Se, { d: 'M7.753 16.239a6 6 0 0 1 0-8.478', key: 'r2q7qm' }],
    [Le, { cx: We, cy: We, r: '2', key: '1c9p78' }],
  ]),
  Xo = Wo('rocket', [
    [
      Se,
      {
        d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
        key: 'm3kijz',
      },
    ],
    [
      Se,
      {
        d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
        key: '1fmvmk',
      },
    ],
    [Se, { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', key: '1f8sc4' }],
    [Se, { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5', key: 'qeys4' }],
  ]),
  ei = Wo('scan', [
    [Se, { d: 'M3 7V5a2 2 0 0 1 2-2h2', key: 'aa7l1z' }],
    [Se, { d: 'M17 3h2a2 2 0 0 1 2 2v2', key: '4qcy5o' }],
    [Se, { d: 'M21 17v2a2 2 0 0 1-2 2h-2', key: '6vwrx8' }],
    [Se, { d: 'M7 21H5a2 2 0 0 1-2-2v-2', key: 'ioqczr' }],
  ]),
  ti = Wo('sword', [
    ['polyline', { points: '14.5 17.5 3 6 3 3 6 3 17.5 14.5', key: '1hfsw2' }],
    [it, { x1: '13', x2: '19', y1: '19', y2: '13', key: '1vrmhu' }],
    [it, { x1: '16', x2: '20', y1: '16', y2: '20', key: '1bron3' }],
    [it, { x1: '19', x2: '21', y1: '21', y2: '19', key: '13pww6' }],
  ]),
  ri = Wo('target', [
    [Le, { cx: We, cy: We, r: '10', key: ft }],
    [Le, { cx: We, cy: We, r: '6', key: '1vlfrh' }],
    [Le, { cx: We, cy: We, r: '2', key: '1c9p78' }],
  ]),
  ni = Wo('users', [
    [Se, { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
    [Se, { d: 'M16 3.128a4 4 0 0 1 0 7.744', key: '16gr8j' }],
    [Se, { d: 'M22 21v-2a4 4 0 0 0-3-3.87', key: 'kshegd' }],
    [Le, { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
  ]),
  oi = Wo('zoom-in', [
    [Le, { cx: e, cy: e, r: '8', key: '4ej97u' }],
    [it, { x1: '21', x2: '16.65', y1: '21', y2: '16.65', key: '13gj7c' }],
    [it, { x1: e, x2: e, y1: '8', y2: '14', key: '1vmskp' }],
    [it, { x1: '8', x2: '14', y1: e, y2: e, key: 'durymu' }],
  ]);
Ir = 0;
const ii = {
    Er: ri,
    Ir: ti,
    Rr: Oo,
    Fr: Xo,
    Hr: Go,
    Wr: ei,
    qr: Jo,
    $r: oi,
    Zr: Vo,
    Vr: ni,
    Gr: Uo,
    Kr: Zo,
    Ur: Qo,
    Jr: Yo,
    Xr: Ko,
    Yr: (e) =>
      ze('svg', {
        xmlns: Ae,
        viewBox: '0 0 24 24',
        fill: Ye,
        ...e,
        children: ze('g', {
          transform: 'matrix(0.12165, 0, 0, 0.121648, 12.165857, 24.329102)',
          children: ze(Se, {
            d: 'M 25.931 -21.833 C 27.232 -18.444 28.451 -15.125 29.729 -11.829 C 30.514 -9.806 31.527 -7.885 31.316 -5.576 C 31.208 -4.383 30.701 -3.609 29.684 -3.253 C 28.784 -2.937 27.794 -2.732 26.842 -2.73 C 7.964 -2.701 -10.914 -2.691 -29.792 -2.737 C -31.485 -2.741 -33.283 -2.953 -34.025 -4.958 C -34.485 -6.2 -34.228 -7.385 -33.786 -8.581 C -31.084 -15.902 -28.238 -23.177 -25.765 -30.575 C -24.008 -35.83 -22.637 -41.225 -21.327 -46.614 C -20.184 -51.313 -19.278 -56.077 -18.436 -60.841 C -17.805 -64.412 -17.386 -68.023 -16.976 -71.627 C -16.511 -75.72 -16.163 -79.825 -15.761 -83.925 C -15.658 -84.972 -15.546 -86.019 -15.414 -87.304 C -17.56 -87.101 -19.504 -86.912 -21.448 -86.735 C -22.546 -86.636 -23.65 -86.596 -24.743 -86.461 C -29.122 -85.919 -33.513 -85.444 -37.873 -84.769 C -42.896 -83.991 -47.925 -83.183 -52.888 -82.1 C -57.819 -81.024 -62.701 -79.692 -67.551 -78.287 C -72.353 -76.895 -77.121 -75.366 -81.841 -73.72 C -85.797 -72.341 -89.649 -70.673 -93.575 -69.206 C -94.607 -68.82 -95.73 -68.616 -96.832 -68.49 C -98.373 -68.312 -99.53 -69.852 -99.74 -70.914 C -99.92 -71.847 -99.99 -72.817 -99.99 -73.771 C -100.01 -92.169 -100.02 -110.57 -99.97 -128.97 C -99.97 -130.23 -99.64 -131.53 -99.25 -132.75 C -98.829 -134.05 -96.981 -134.68 -95.181 -134.05 C -91.343 -132.69 -87.594 -131.09 -83.776 -129.68 C -74.777 -126.34 -65.593 -123.59 -56.258 -121.38 C -52.115 -120.39 -47.913 -119.65 -43.723 -118.88 C -39.9 -118.18 -36.066 -117.52 -32.219 -116.97 C -29.657 -116.61 -27.063 -116.47 -24.484 -116.22 C -21.551 -115.95 -18.617 -115.67 -15.478 -115.37 C -15.603 -117.43 -15.692 -119.3 -15.838 -121.17 C -15.929 -122.34 -16.096 -123.51 -16.243 -124.67 C -16.798 -129.09 -17.352 -133.51 -17.92 -137.92 C -19.004 -146.35 -20.833 -154.65 -23.038 -162.83 C -24.846 -169.55 -27.141 -176.14 -29.378 -182.73 C -30.722 -186.69 -32.468 -190.52 -33.853 -194.47 C -35.081 -197.97 -33.554 -199.53 -30.363 -199.98 C -30.128 -200.01 -29.884 -199.99 -29.644 -199.99 C -10.806 -199.99 8.032 -200 26.871 -199.96 C 27.854 -199.96 28.877 -199.71 29.813 -199.38 C 31.322 -198.86 31.858 -196.83 31.422 -195.51 C 30.652 -193.18 29.68 -190.92 28.86 -188.6 C 26.767 -182.7 24.594 -176.81 22.67 -170.85 C 20.453 -163.98 18.67 -156.99 17.347 -149.88 C 16.667 -146.23 15.829 -142.6 15.228 -138.93 C 14.698 -135.69 14.357 -132.42 14.009 -129.16 C 13.639 -125.68 13.362 -122.2 13.036 -118.72 C 12.94 -117.7 12.817 -116.69 12.686 -115.49 C 14.674 -115.58 16.515 -115.63 18.35 -115.77 C 19.596 -115.86 20.832 -116.07 22.073 -116.23 C 25.871 -116.71 29.681 -117.11 33.465 -117.68 C 38.227 -118.4 42.993 -119.14 47.709 -120.11 C 52.205 -121.03 56.676 -122.12 61.09 -123.38 C 66.823 -125.02 72.525 -126.78 78.172 -128.7 C 82.718 -130.24 87.162 -132.08 91.653 -133.78 C 93.041 -134.31 94.466 -134.66 95.695 -133.51 C 96.249 -132.99 96.768 -132.3 96.985 -131.59 C 97.255 -130.71 97.267 -129.73 97.267 -128.79 C 97.282 -110.71 97.292 -92.632 97.25 -74.554 C 97.247 -73.144 97.055 -71.659 96.578 -70.345 C 95.971 -68.677 94.386 -68.047 92.706 -68.613 C 90.417 -69.383 88.183 -70.314 85.905 -71.121 C 79.998 -73.212 74.146 -75.497 68.147 -77.285 C 61.612 -79.234 54.953 -80.786 48.314 -82.366 C 44.322 -83.315 40.278 -84.077 36.23 -84.756 C 32.996 -85.298 29.724 -85.629 26.46 -85.977 C 22.985 -86.347 19.5 -86.624 16.021 -86.95 C 15.004 -87.046 13.99 -87.171 12.784 -87.303 C 12.876 -85.322 12.925 -83.482 13.058 -81.648 C 13.154 -80.323 13.357 -79.005 13.519 -77.685 C 13.914 -74.466 14.278 -71.243 14.719 -68.03 C 15.158 -64.829 15.62 -61.629 16.175 -58.447 C 16.654 -55.702 17.206 -52.965 17.853 -50.255 C 19.082 -45.115 20.288 -39.965 21.718 -34.88 C 22.947 -30.513 24.477 -26.231 25.931 -21.833 Z',
          }),
        }),
      }),
  },
  ai = ({ onMouseDown: e, version: t }) =>
    ze(_e, {
      className: 'header',
      onMouseDown(t) {
        e(t);
      },
      children: [
        ze(ii.Yr, { className: 'menu-icon' }),
        ze(_e, { className: 'title', children: ['Surplus', t && ' ' + t] }),
        ze(_e, { className: 'credit', children: 'by mahdi, noam' }),
      ],
    }),
  ci = ({ activeTab: e, onTabChange: t, Qr: r }) =>
    ze(_e, {
      className: 'navbar',
      children: [
        ze(_e, {
          className: 'nav-tabs',
          children: [
            { id: 'main', label: 'Main' },
            { id: 'visuals', label: 'Visuals' },
            { id: 'misc', label: 'Misc' },
            { id: 'help', label: 'Help' },
          ].map((r) =>
            ze(
              'button',
              {
                className: 'nav-tab ' + (e === r.id ? 'active' : je),
                'data-tab': r.id,
                onClick: () => t(r.id),
                children: r.label,
              },
              r.id
            )
          ),
        }),
        ze('button', { className: 'close-btn', onClick: r, children: '×' }),
      ],
    }),
  si = ({ id: e, label: t, checked: r, onChange: o, style: i = {} }) =>
    ze(_e, {
      className: 'checkbox-item',
      style: i,
      onClick(e) {
        'checkbox' !== e.target.type && o(!r);
      },
      children: [
        ze(n, {
          type: 'checkbox',
          id: e,
          checked: r,
          onChange(e) {
            (e.stopPropagation(), o(e.target.checked));
          },
          className: 'checkbox ' + (r ? 'checkbox-checked' : je),
        }),
        ze('label', {
          htmlFor: e,
          className: 'checkbox-item-label',
          onClick: (e) => e.stopPropagation(),
          children: t,
        }),
      ],
    }),
  li = ({ id: e, label: t, value: r, min: a = 0, max: c = 100, warning: s = !1, onChange: l }) => {
    const [d, f] = te(!1),
      u = ne(Ne),
      h = ((r - a) / (c - a)) * 100,
      b = {
        background: `linear-gradient(to right, #6edb72 0%, #58c05c ${h}%, #333 ${h}%, #333 100%)`,
      },
      m = (e) => {
        (e.stopPropagation(), l(parseInt(e.target.value)));
      },
      g = (e) => {
        e.stopPropagation();
      },
      y = ie(() => f(!0), []),
      p = ie(() => f(!1), []),
      v = ie(
        (e) => {
          (e.stopPropagation(), y());
        },
        [y]
      ),
      w = ie(
        (e) => {
          (e.stopPropagation(), y());
        },
        [y]
      ),
      k = ie(
        (e) => {
          (e && e.stopPropagation(), p());
        },
        [p]
      ),
      x = ie(
        (e) => {
          (e && e.stopPropagation(), p());
        },
        [p]
      );
    return (
      re(() => {
        if (d)
          return (
            window.addEventListener(Ke, k),
            window.addEventListener('touchend', x),
            window.addEventListener(o, x),
            () => {
              (window.removeEventListener(Ke, k),
                window.removeEventListener('touchend', x),
                window.removeEventListener(o, x));
            }
          );
      }, [d, k, x]),
      ze(_e, {
        className: 'checkbox-item slider-container',
        onClick: g,
        children: [
          ze('label', {
            htmlFor: e,
            style: { color: '#ddd', fontSize: '0.8125rem', cursor: 'default', pointerEvents: Ee },
            children: t,
          }),
          ze(n, {
            ref: u,
            type: 'range',
            className: 'slider ' + (d ? 'slider-dragging' : je),
            id: e,
            min: a,
            max: c,
            value: r,
            onChange: m,
            onInput: m,
            onClick: g,
            onMouseDown: v,
            onMouseUp: k,
            onMouseLeave: k,
            onTouchStart: w,
            onTouchEnd: x,
            onTouchCancel: x,
            style: b,
          }),
          s && ze(He, { className: i, style: { marginLeft: Je }, children: 'RISKY!!!' }),
        ],
      })
    );
  },
  di = (e) => {
    const t = e.value;
    return ze(li, { ...e, value: t, warning: e.shouldWarning?.(t) ?? !1 });
  },
  fi = ({ keybind: e, mode: t = 'single', style: n = {} }) =>
    ze(
      _e,
      'multiple' === t && _t(e)
        ? {
            className: 'keybind-slot-container',
            style: n,
            children: e.map((t, n) =>
              ze(
                Er,
                {
                  children: [
                    ze(_e, { className: r, children: t }),
                    e.length - 1 > n &&
                      ze(He, { className: 'keybind-slot-separator', children: '+' }),
                  ],
                },
                n
              )
            ),
          }
        : { className: r, style: n, children: e }
    ),
  ui = ({
    icon: e,
    label: t,
    keybind: r,
    keybindMode: n,
    enabled: o,
    onEnabledChange: a,
    warning: c = !1,
  }) =>
    ze(_e, {
      className: Qe,
      children: [
        e && ze(e, { size: Ge }),
        ze(_e, {
          className: 'section-title-container',
          children: [
            t,
            c && ze(He, { className: i, style: { marginLeft: Je }, children: 'RISKY!!!' }),
          ],
        }),
        r && ze(fi, { keybind: r, mode: n }),
        ze(si, {
          id: t.toLowerCase().replace(/\s+/g, '-') + '-enable',
          label: 'Enabled',
          checked: o,
          onChange: a,
          style: { border: Ee, background: Ee, padding: '4px 6px', margin: 0 },
        }),
      ],
    }),
  hi = ({ en: e, tn: r }) =>
    ze(_e, {
      className: pt,
      children: [
        ze(ui, {
          icon: ii.Er,
          label: 'Aimbot',
          keybind: 'B',
          enabled: e.rt.ze,
          onEnabledChange: (e) => r((t) => (t.rt.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.rt.ze ? je : qe),
          children: [
            ze(di, {
              id: 'aim-smooth',
              label: 'Smooth',
              value: e.rt.nr,
              onChange: (e) => r((t) => (t.rt.nr = e)),
              shouldWarning: (e) => 20 >= e,
            }),
            ze(si, {
              id: 'target-knocked',
              label: 'Target Knocked',
              checked: e.rt.st,
              onChange: (e) => r((t) => (t.rt.st = e)),
            }),
            ze(_e, {
              style: { display: t, alignItems: 'center', gap: bt },
              children: [
                ze(si, {
                  id: 'sticky-target',
                  label: 'Sticky Target',
                  checked: e.rt.ir,
                  onChange: (e) => r((t) => (t.rt.ir = e)),
                }),
                ze(fi, { keybind: 'N' }),
              ],
            }),
            ze(si, {
              id: 'aimbot-show-dot',
              label: 'Aimbot Dot',
              checked: e.rt.bt,
              onChange: (e) => r((t) => (t.rt.bt = e)),
            }),
          ],
        }),
        ze(ui, {
          icon: ii.Ir,
          label: 'Melee Lock',
          enabled: e.nt.ze,
          onEnabledChange: (e) => r((t) => (t.nt.ze = e)),
          warning: !0,
        }),
        ze(_e, {
          className: $e + (e.nt.ze ? je : qe),
          children: ze(si, {
            id: 'auto-melee',
            label: 'Auto Melee',
            checked: e.nt.ct,
            onChange: (e) => r((t) => (t.nt.ct = e)),
          }),
        }),
        ze(ui, {
          icon: ii.Rr,
          label: 'Auto Switch',
          enabled: e.hr.ze,
          onEnabledChange: (e) => r((t) => (t.hr.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.hr.ze ? je : qe),
          children: ze(si, {
            id: 'useonegun',
            label: 'Use One Gun',
            checked: e.hr.br,
            onChange: (e) => r((t) => (t.hr.br = e)),
          }),
        }),
        ze(ui, {
          icon: ii.Fr,
          label: 'Semi Auto',
          enabled: e.sr.ze,
          onEnabledChange: (e) => r((t) => (t.sr.ze = e)),
        }),
      ],
    }),
  bi = ({ en: e, tn: t }) =>
    ze(_e, {
      className: pt,
      children: [
        ze(ui, {
          icon: ii.Hr,
          label: 'X-Ray',
          enabled: e.Me.ze,
          onEnabledChange: (e) => t((t) => (t.Me.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.Me.ze ? je : qe),
          children: [
            ze(si, {
              id: 'remove-ceilings',
              label: 'Remove Ceilings',
              checked: e.Me.Ne,
              onChange: (e) => t((t) => (t.Me.Ne = e)),
            }),
            ze(si, {
              id: 'darker-smokes',
              label: 'Darker Smokes',
              checked: e.Me.Se,
              onChange: (e) => t((t) => (t.Me.Se = e)),
            }),
            ze(li, {
              id: 'smoke-opacity',
              label: 'Smoke Opacity',
              value: e.Me.Te,
              onChange: (e) => t((t) => (t.Me.Te = e)),
            }),
            ze(li, {
              id: 'tree-opacity',
              label: 'Tree Opacity',
              value: e.Me.Ae,
              onChange: (e) => t((t) => (t.Me.Ae = e)),
            }),
          ],
        }),
        ze(ui, {
          icon: ii.Wr,
          label: wt,
          keybind: 'Space',
          enabled: e.mr.ze,
          onEnabledChange: (e) => t((t) => (t.mr.ze = e)),
        }),
        ze(ui, {
          icon: ii.qr,
          label: 'ESP',
          enabled: e.$e.ze,
          onEnabledChange: (e) => t((t) => (t.$e.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.$e.ze ? je : qe),
          children: [
            ze(si, {
              id: 'visible-nametags',
              label: 'Visible Nametags',
              checked: e.$e.qe,
              onChange: (e) => t((t) => (t.$e.qe = e)),
            }),
            ze(si, {
              id: 'player-esp',
              label: 'Players',
              checked: e.$e.Ze,
              onChange: (e) => t((t) => (t.$e.Ze = e)),
            }),
            ze(_e, { className: Qe, children: 'Grenades' }),
            ze(_e, {
              className: 'subgroup',
              children: [
                ze(si, {
                  id: 'grenade-esp',
                  label: 'Explosions',
                  checked: e.$e.Ge.Ve,
                  onChange: (e) => t((t) => (t.$e.Ge.Ve = e)),
                  style: { marginRight: Ie },
                }),
                ze(si, {
                  id: 'grenade-trajectory',
                  label: l,
                  checked: e.$e.Ge.Ke,
                  onChange: (e) => t((t) => (t.$e.Ge.Ke = e)),
                  style: { marginRight: Ie },
                }),
              ],
            }),
            ze(_e, { className: Qe, children: 'Flashlights' }),
            ze(_e, {
              className: 'subgroup',
              children: [
                ze(si, {
                  id: 'own-flashlight',
                  label: 'Own',
                  checked: e.$e.Ye.Qe,
                  onChange: (e) => t((t) => (t.$e.Ye.Qe = e)),
                  style: { marginRight: Ie },
                }),
                ze(si, {
                  id: 'others-flashlight',
                  label: 'Others',
                  checked: e.$e.Ye.Xe,
                  onChange: (e) => t((t) => (t.$e.Ye.Xe = e)),
                  style: { marginRight: Ie },
                }),
                ze(si, {
                  id: 'flashlight-trajectory',
                  label: l,
                  checked: e.$e.Ye.Ke,
                  onChange: (e) => t((t) => (t.$e.Ye.Ke = e)),
                  style: { marginRight: Ie },
                }),
              ],
            }),
          ],
        }),
        ze(ui, {
          icon: ii.$r,
          label: 'Infinite Zoom',
          keybind: ['Shift', 'Scroll'],
          keybindMode: 'multiple',
          enabled: e.ur.ze,
          onEnabledChange: (e) => t((t) => (t.ur.ze = e)),
        }),
      ],
    }),
  mi = ({ en: e, tn: t }) =>
    ze(_e, {
      className: pt,
      children: [
        ze(ui, {
          icon: ii.Ur,
          label: 'Map Highlights',
          enabled: e.cr.ze,
          onEnabledChange: (e) => t((t) => (t.cr.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.cr.ze ? je : qe),
          children: ze(si, {
            id: 'smaller-trees',
            label: 'Smaller Trees',
            checked: e.cr.lr,
            onChange: (e) => t((t) => (t.cr.lr = e)),
          }),
        }),
        ze(ui, {
          icon: ii.Jr,
          label: 'Auto Loot',
          enabled: e.dr.ze,
          onEnabledChange: (e) => t((t) => (t.dr.ze = e)),
        }),
        ze(ui, {
          icon: ii.Xr,
          label: 'Mobile Movement',
          enabled: e.ar.ze,
          onEnabledChange: (e) => t((t) => (t.ar.ze = e)),
        }),
        ze(_e, {
          className: $e + (e.ar.ze ? je : qe),
          children: ze(li, {
            id: 'mobile-movement-smooth',
            label: 'Smooth',
            value: e.ar.nr,
            onChange: (e) => t((t) => (t.ar.nr = e)),
          }),
        }),
      ],
    }),
  gi = () =>
    ze(_e, {
      className: 'section help-section',
      children: [
        ze(_e, {
          className: at,
          children: [ze(ii.Zr, { size: Ge }), ze(He, { children: 'Controls & Information' })],
        }),
        ze(_e, {
          className: d,
          style: { marginBottom: vt },
          children: [
            ze(_e, {
              style: { display: t, alignItems: 'center', marginBottom: Ie },
              children: [
                ze(_e, { className: 'keybind-button', children: a }),
                ze(He, { className: 'keybind-description', children: 'Show/Hide Menu' }),
              ],
            }),
            ze('p', {
              className: ut,
              children: [
                'Press ',
                ze('strong', { children: a }),
                ' at any time to toggle the entire menu visibility.',
              ],
            }),
          ],
        }),
        ze(_e, { className: 'section-subtitle', children: 'Feature Keybinds' }),
        ze(_e, {
          className: d,
          children: [
            ze('p', {
              className: ut,
              style: { marginBottom: Je },
              children: "Each feature's keybind is displayed next to its name in the menu:",
            }),
            ze(_e, {
              className: 'features-container',
              children: [
                ze(_e, {
                  className: Xe,
                  children: [
                    ze(He, { className: et, children: 'Aimbot' }),
                    ze(fi, { keybind: 'B' }),
                  ],
                }),
                ze(_e, {
                  className: Xe,
                  children: [
                    ze(He, { className: et, children: 'Spinbot' }),
                    ze(fi, { keybind: 'H' }),
                  ],
                }),
                ze(_e, {
                  className: Xe,
                  children: [ze(He, { className: et, children: wt }), ze(fi, { keybind: 'T' })],
                }),
              ],
            }),
          ],
        }),
        ze(_e, {
          className: at,
          style: { marginTop: '1rem' },
          children: [ze(ii.Vr, { size: Ge }), ze(He, { children: 'Community & Support' })],
        }),
        ze(_e, {
          className: 'community-container',
          children: [
            ze(_e, {
              className: 'discord-panel',
              children: [
                ze(_e, {
                  style: { display: t, marginBottom: Je },
                  children: [
                    ze(ii.Discord, { style: { color: '#5865F2' } }),
                    ze(He, {
                      style: {
                        marginLeft: Ie,
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      },
                      children: 'Discord Server',
                    }),
                  ],
                }),
                ze('p', {
                  style: {
                    color: '#bbb',
                    fontSize: vt,
                    lineHeight: 1.4,
                    marginBottom: bt,
                    flexGrow: 1,
                  },
                  children: 'Join for support, bug reports, suggestions, and announcements:',
                }),
                ze('a', {
                  href: 'https://discord.gg/Bc2FDqddmH',
                  target: '_blank',
                  rel: st,
                  className: 'discord-link',
                  children: 'discord.gg',
                }),
              ],
            }),
            ze(_e, {
              className: 'website-panel',
              children: [
                ze(_e, {
                  style: { display: t, marginBottom: Je },
                  children: [
                    ze(ii.Gr, { style: { color: '#69f74c' } }),
                    ze(He, {
                      style: {
                        marginLeft: Ie,
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      },
                      children: 'Official Website',
                    }),
                  ],
                }),
                ze('p', {
                  style: {
                    color: '#bbb',
                    fontSize: vt,
                    lineHeight: 1.4,
                    marginBottom: bt,
                    flexGrow: 1,
                  },
                  children:
                    'Visit our website for the latest updates and a backup Discord invite link:',
                }),
                ze('a', {
                  href: 'https://s.urpl.us',
                  target: '_blank',
                  rel: st,
                  className: 'website-link',
                  children: 's.urpl.us',
                }),
              ],
            }),
          ],
        }),
        ze(_e, {
          className: at,
          children: [ze(ii.Kr, { size: Ge }), ze(He, { children: 'Credits' })],
        }),
        ze(_e, {
          className: 'credits-panel',
          children: ze(_e, {
            className: 'credits-container',
            children: [
              ze(_e, {
                className: c,
                children: [
                  ze(_e, { className: s, children: 'mahdi' }),
                  ze(_e, { children: 'Developer, Designer' }),
                ],
              }),
              ze(_e, {
                className: c,
                children: [
                  ze(_e, { className: s, children: 'noam' }),
                  ze(_e, { children: 'Developer' }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  yi = ({ en: e, tn: t, Qr: r, version: n }) => {
    const [o, i] = te('help'),
      [a, c] = te({ x: 175, y: 125 }),
      [s, l] = te(!1),
      [d, f] = te({ x: 0, y: 0 }),
      u = ne(Ne);
    re(() => {
      const e = (e) => {
          if (s) {
            const t = u.current;
            if (!t) return;
            const r = t.querySelector('.header');
            if (!r) return;
            const n = r.getBoundingClientRect(),
              o = 100;
            let i = e.clientX - d.x,
              a = e.clientY - d.y;
            const s = 0,
              l = Fr.innerHeight - n.height;
            ((i = jt(-(t.offsetWidth - o), Lt(Fr.innerWidth - o, i))),
              (a = jt(s, Lt(l, a))),
              c({ x: i, y: a }));
          }
        },
        t = () => {
          l(!1);
        };
      return (
        s && ($r.addEventListener('mousemove', e), $r.addEventListener(Ke, t)),
        () => {
          ($r.removeEventListener('mousemove', e), $r.removeEventListener(Ke, t));
        }
      );
    }, [s, d]);
    const h = (e) => {
      e.stopPropagation();
    };
    return ze(_e, {
      id: 'ui',
      ref: u,
      style: { position: 'fixed', zIndex: '99999', left: a.x + nt, top: a.y + nt },
      onClick: h,
      onMouseDown: h,
      onPointerDown: h,
      onPointerUp: h,
      onTouchStart: h,
      onTouchEnd: h,
      children: ze(_e, {
        className: 'popup',
        children: [
          ze(ai, {
            onMouseDown(e) {
              (l(!0), f({ x: e.clientX - a.x, y: e.clientY - a.y }));
            },
            version: n,
          }),
          ze(ci, { activeTab: o, onTabChange: i, Qr: r }),
          ze(_e, {
            className: 'content-container ' + (o ? 'active' : je),
            children: (() => {
              switch (o) {
                case 'main':
                  return ze(hi, { en: e, tn: t });
                case 'visuals':
                  return ze(bi, { en: e, tn: t });
                case 'misc':
                  return ze(mi, { en: e, tn: t });
                default:
                  return ze(gi, {});
              }
            })(),
          }),
        ],
      }),
    });
  };
let pi = Ne,
  vi = () => {},
  wi = je,
  ki = !1;
const xi = () => {
  pi && ki && pi.render(ze(yi, { en: Gr, tn: Ce, Qr: () => vi(!1), version: wi }));
};
let zi = !1,
  Ci = !1,
  Ni = { x: 0, y: 0 };
const _i = { rn: !1, nn: !1, an: !1, sn: !1, cn: 0 },
  Mi = () => {
    (p(Zr.game, 'init', {
      apply(e, t, r) {
        const n = Nt(e, t, r);
        return (
          g(Zr).then(() => {
            (Ci ||
              ((fn.yr = Zr.pixi.stage.constructor),
              (fn.gr = Zr.pixi.stage.children.find((e) => e.lineStyle)?.constructor),
              Hn(),
              Zr.pixi._ticker.add(C),
              Zr.pixi._ticker.add(po),
              (() => {
                const e = () => {
                  (() => {
                    const e = Ur;
                    return (
                      !!e &&
                      (To ||
                        ((To = $r.createElement(_e)),
                        To.classList.add('aimbot-dot'),
                        e.appendChild(To)),
                      !0)
                    );
                  })()
                    ? Ao || (Zr.pixi._ticker.add(_), (Ao = !0))
                    : zt(e);
                };
                e();
              })(),
              Zr.pixi._ticker.add(Bo),
              Nt(on, Fr, [dt, wn]),
              Nt(on, Fr, ['keyup', kn]),
              (Ci = !0)),
              rn || (Zr.pixi._ticker.add(y), (rn = !0)),
              (Ci = !0));
          }),
          n
        );
      },
    }),
      (() => {
        const e = kt(Zr.game.__proto__).find(
          (e) => Me == typeof Zr.game[e] && 3 === Zr.game[e].length
        );
        p(Zr.game, e, {
          apply(e, t, r) {
            const [n, o] = r;
            return (
              1 === n && (o.isMobile = Gr.dr.ze),
              3 === n &&
                ((e) => {
                  for (const t of Kr.lt) e.addInput(t);
                  Kr.lt.length = 0;
                })(o),
              o.inputs
                ? ((i = o),
                  vo && ((i.shootStart = !0), (i.shootHold = !0)),
                  ((e) => {
                    if (!Gr.ar.ze) return;
                    const t = (e.moveRight ? 1 : 0) + (e.moveLeft ? -1 : 0),
                      r = (e.moveDown ? -1 : 0) + (e.moveUp ? 1 : 0);
                    if (0 !== t || 0 !== r)
                      return (
                        (e.touchMoveActive = !0),
                        (e.touchMoveLen = !0),
                        (Ni.x += ((t - Ni.x) * Gr.ar.nr) / Ze),
                        (Ni.y += ((r - Ni.y) * Gr.ar.nr) / Ze),
                        (e.touchMoveDir.x = Ni.x),
                        void (e.touchMoveDir.y = Ni.y)
                      );
                    ((Ni.x = 0), (Ni.y = 0));
                  })(o),
                  ((e) => {
                    Vr.rr &&
                      ((e.touchMoveActive = !0),
                      (e.touchMoveLen = !0),
                      (e.touchMoveDir.x = Vr.rr.x),
                      (e.touchMoveDir.y = Vr.rr.y));
                  })(o),
                  ((e) => {
                    if (!e) return;
                    const t = Mn.Pe,
                      r =
                        !!e.shootStart || !!e.shootHold || (_t(e.inputs) && e.inputs.includes(sn));
                    (r && !_i.sn && Gr.rt.ze && (_i.cn = 3), (_i.sn = r), r || (_i.cn = 0));
                    const n = _i.cn > 0;
                    if ((n && _i.cn--, !((Mn.vr && Te !== t) || n)))
                      return (
                        _i.rn &&
                          ((e.shootStart = !0),
                          _i.nn &&
                            ((e.shootHold = !0),
                            _t(e.inputs) && _i.an && !e.inputs.includes(sn) && e.inputs.push(sn))),
                        (_i.rn = !1),
                        (_i.nn = !1),
                        (_i.an = !1),
                        void (_i.cn = 0)
                      );
                    let o = !1;
                    if (_t(e.inputs))
                      for (let t = e.inputs.length - 1; t >= 0; t -= 1)
                        e.inputs[t] === sn && (e.inputs.splice(t, 1), (o = !0));
                    const i = !!e.shootStart,
                      a = !!e.shootHold || o;
                    (i || a) &&
                      ((e.shootStart = !1),
                      (e.shootHold = !1),
                      (_i.rn = _i.rn || i || a),
                      (_i.nn = _i.nn || a),
                      (_i.an = _i.an || o));
                  })(o),
                  (Kr.Je = o.toMouseLen),
                  Nt(e, t, r))
                : Nt(e, t, r)
            );
            var i;
          },
        });
      })());
  };
try {
  xt(window, 'console', {
    value: new Wt(
      {},
      {
        get: () => () => {},
        set: () => !0,
        has: () => !0,
        apply: () => () => {},
        construct: () => ({}),
      }
    ),
    configurable: !1,
    writable: !1,
  });
} catch (T) {}
try {
  window.onerror = () => {};
} catch (T) {}
try {
  window.onunhandledrejection = () => {};
} catch (T) {}
try {
  window.onrejectionhandled = () => {};
} catch (T) {}
try {
  window.onabort = () => {};
} catch (T) {}
try {
  window.onunload = () => {};
} catch (T) {}
try {
  window.onbeforeunload = () => {};
} catch (T) {}
try {
  (window.addEventListener('error', () => {}, !0),
    window.addEventListener('unhandledrejection', () => {}, !0),
    window.addEventListener('rejectionhandled', () => {}, !0),
    window.addEventListener('abort', () => {}, !0));
} catch (T) {}
try {
  xt(window, 'Error', { value: void 0, configurable: !1, writable: !1 });
} catch (T) {}
try {
  window.alert = () => {};
} catch (T) {}
try {
  window.confirm = () => {};
} catch (T) {}
try {
  window.prompt = () => {};
} catch (T) {}
try {
  u.freeze(window.console);
} catch (T) {}
try {
  u.freeze(window);
} catch (T) {}
(async () => {
  const e = Rt();
  try {
    const t = await fetch(De);
    mt !== (await t.json()).tag_name &&
      e > 1760037951114 &&
      (Wr('https://s.urpl.us/'),
      ($r.head.innerHTML = je),
      ($r.body.innerHTML =
        '<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 3 seconds...</h1>'),
      await new Ft(() => {}),
      je());
  } catch {}
  var t;
  ((() => {
    if (zi) return;
    zi = !0;
    const e = () =>
      (() => {
        (() => {
          const e = document.createElement('link');
          ((e.href =
            'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css'),
            (e.rel = 'stylesheet'),
            $r.head.appendChild(e));
        })();
        const e = ((e) => {
          const t = document.createElement(_e);
          return (e.appendChild(t), (pi = Lr.createRoot(t)), t);
        })(
          (() => {
            Ur = qr;
            const e = document.createElement('style');
            return (
              (e.textContent =
                "#ui{--border-radius:0.375rem;--border-width:0.0625rem;--transition-duration:100ms;--green-gradient:linear-gradient(180deg, #6edb72 0%, #58c05c 100%);--shadow-size:0.125rem;--shadow-opacity:0.2;--glow-size:0.25rem;--glow-opacity:0.2}*{font-family:GothamPro,sans-serif;box-sizing:border-box;margin:0;padding:0}:focus-visible{outline:0}.popup{user-select:none;position:relative;background:#131313;border-radius:.9375rem;box-shadow:0 calc(var(--shadow-size) * 4) calc(var(--shadow-size) * 16) rgba(0,0,0,calc(var(--shadow-opacity) * 1.5));width:21.25rem;overflow:hidden;border:var(--border-width) solid #333;transition:.3s ease-out}.header{background:#181818;padding:.53125rem;user-select:none;transition:.1s;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:grab}.header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#5b5b5b 50%,transparent);transform:translateZ(0)}.header:hover{background:#1b1b1b!important;transition:.2s}.header:active{background:#1d1d1d!important;transition:.2s;cursor:grabbing}.menu-icon{width:.875rem;height:.875rem;color:#fff;pointer-events:none;position:absolute;left:.375rem;top:.375rem}.navbar{background:#161616;padding:.5rem;border-bottom:.0625rem solid #333}.title{font-size:1rem;font-weight:600;color:#fff;text-align:center;position:relative;z-index:1}.credit{font-size:.75rem;font-style:italic;color:rgba(255,255,255,.45);text-align:center;display:block;position:relative;z-index:1}.nav-tabs{display:flex;gap:.5rem;align-items:center;justify-content:center;transition:.3s}.nav-tab{padding:.375rem .75rem;background:#202020;border:var(--border-width) solid transparent;border-radius:var(--border-radius);color:#bababa;font-size:.75rem;font-weight:600;cursor:pointer;transition:background var(--transition-duration) ease,color var(--transition-duration) ease,border var(--transition-duration) ease}.nav-tab:hover{background:#2c2c2c}.nav-tab:active{background:#282828}.nav-tab.active{color:#fff;border-color:#555}.close-btn{position:absolute;top:.0625rem;right:.5rem;cursor:pointer;border:none;background:0 0;font-size:1.25rem;color:#666;transition:color var(--transition-duration) ease}.close-btn:hover{color:#fff}.close-btn:active{color:#ccc}.content-container{padding-top:.625rem;padding-left:1rem;padding-right:1rem;max-height:0;opacity:0;overflow:hidden;transition:max-height .3s ease-out,opacity .2s ease-out,padding .3s ease-out}.content-container.active{max-height:62.5rem;opacity:1;padding-bottom:1rem}.section{margin-bottom:1.25rem}.section:last-child{margin-bottom:0}.section-title{color:#fff;font-size:.8125rem;font-weight:600;margin:0 0 .375rem;letter-spacing:.03125rem;display:flex;justify-content:space-between;align-items:center;gap:.375rem;position:relative}.risky-label{color:#ff3232;font-size:.7rem;font-weight:700;letter-spacing:.03125rem;animation:2s ease-in-out infinite risky-glow}@keyframes risky-glow{0%,100%{text-shadow:0 0 .125rem rgba(255,50,50,.4)}50%{text-shadow:0 0 .3rem rgba(255,50,50,.7)}}.section-title .checkbox-item{border:none;background:0 0;padding:.25rem .375rem;margin:0}.section-title .checkbox-item:hover{background:rgba(255,255,255,.05);border-radius:var(--border-radius)}.section-title label{font-size:.75rem;color:#ddd!important}.section-title-container{flex-grow:1}.subsection-title{color:#bbb;font-size:.75rem;font-weight:600;margin:.875rem 0 .25rem .9375rem;position:relative}.subsection-title::before{content:'';position:absolute;left:-.625rem;top:50%;height:.0625rem;width:.375rem;background:#666}.group{display:flex;flex-direction:column;background:rgba(255,255,255,.02);border-radius:var(--border-radius);padding:.625rem;margin-bottom:.625rem;gap:.375rem;border:var(--border-width) solid rgba(255,255,255,.1);max-height:20rem;opacity:1;overflow:hidden;transition:max-height .25s ease-out,opacity .25s ease-out,padding .25s ease-out,margin .25s ease-out}.group.hidden{max-height:0;opacity:0;padding:0 .625rem;margin-bottom:0}.group .section-title{margin-top:.625rem}.subgroup{margin-left:.09375rem;padding-left:.0625rem;display:flex;flex-wrap:wrap;gap:.375rem}.checkbox-item{border:var(--border-width) solid #2c2c2c;display:inline-flex;align-items:center;padding:.375rem .5rem;border-radius:var(--border-radius);transition:background var(--transition-duration) ease;cursor:pointer;width:fit-content;background-color:rgba(0,0,0,.04)}.checkbox-item:hover{background:rgba(255,255,255,.05)}.checkbox-item:active{background:rgba(255,255,255,.03)}.checkbox-item-label{color:#ddd;font-size:.8125rem;margin-left:.5rem;cursor:pointer;pointer-events:none}.checkbox{appearance:none;width:1rem;height:1rem;border:none;border-radius:25%;background:radial-gradient(circle at 35% 35%,#6a6a6a,#4d4d4d,#3d3d3d,#2a2a2a);box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.1);cursor:pointer;transition:background .2s ease-out,box-shadow .2s ease-out}.checkbox:hover{background:radial-gradient(circle at 35% 35%,#7a7a7a,#5d5d5d,#4d4d4d,#3a3a3a)}.checkbox-checked{background:radial-gradient(circle at 35% 35%,#8ef592,#6edb72,#4fb052,#3a8a3d);box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.3),0 0 var(--glow-size) rgba(110,219,114,var(--glow-opacity))}.slider-container{display:flex;align-items:center;gap:.625rem}.slider{appearance:none;width:5.625rem;height:.3125rem;border-radius:var(--border-radius);outline:0;cursor:pointer}.keybind-slot{width:auto;height:1.125rem;padding:0 .375rem;background:radial-gradient(ellipse at 50% 30%,#555,#4d4d4d,#3d3d3d,#2a2a2a);color:#ddd;font-size:.625rem;font-weight:600;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--border-radius);border:none;box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.1)}.keybind-slot-container{display:inline-flex;align-items:center;gap:.25rem}.keybind-slot-separator{color:#888;font-size:.625rem;font-weight:600}.help-section{font-size:.8125rem}.help-title{color:#fff;font-size:.9375rem;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem;font-weight:600}.help-panel{background:rgba(255,255,255,.05);border-radius:var(--border-radius);padding:.625rem;margin-bottom:.75rem;border:var(--border-width) solid rgba(255,255,255,.08)}.keybind-button{min-width:4.5rem;padding:.25rem .625rem;background:linear-gradient(135deg,#2a2a2a 0,#353535 100%);color:#ddd;font-size:.75rem;font-weight:600;border-radius:var(--border-radius);border:var(--border-width) solid #444;box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset 0 var(--shadow-size) 0 rgba(255,255,255,.1);display:inline-block}.keybind-description{margin-left:.625rem;color:#fff;font-size:.8125rem}.keybind-help-text{color:#bbb;font-size:.75rem;line-height:1.4;margin:0}.discord-panel{background:rgba(88,101,242,.15);border-radius:var(--border-radius);padding:.625rem;margin-bottom:.75rem;border:var(--border-width) solid rgba(88,101,242,.3);flex:1;display:flex;flex-direction:column;min-height:9.375rem}.website-panel{background:rgba(105,247,76,.1);border-radius:var(--border-radius);padding:.625rem;margin-bottom:.75rem;border:var(--border-width) solid rgba(105,247,76,.3);flex:1;display:flex;flex-direction:column;min-height:9.375rem}.discord-link{display:block;background:rgba(88,101,242,.3);color:#fff;text-decoration:none;padding:.5rem;border-radius:var(--border-radius);font-size:.8125rem;text-align:center;font-weight:600;border:var(--border-width) solid rgba(88,101,242,.5);transition:background var(--transition-duration) ease;margin-top:auto}.discord-link:hover{background:rgba(88,101,242,.4)}.discord-link:active{background:rgba(88,101,242,.35)}.website-link{display:block;background:rgba(105,247,76,.15);color:#fff;text-decoration:none;padding:.5rem;border-radius:var(--border-radius);font-size:.8125rem;text-align:center;font-weight:600;border:var(--border-width) solid rgba(105,247,76,.3);transition:background var(--transition-duration) ease;margin-top:auto}.website-link:hover{background:rgba(105,247,76,.2)}.website-link:active{background:rgba(105,247,76,.175)}.credits-panel{background:rgba(255,255,255,.05);border-radius:var(--border-radius);padding:.625rem;margin-bottom:.75rem;border:var(--border-width) solid rgba(255,255,255,.08)}.credits-container{display:flex;flex-wrap:wrap;gap:1rem;color:#ddd;font-size:.8125rem}.credit-item{flex:1;min-width:7.5rem}.credit-name{font-weight:600;margin-bottom:.25rem;color:#fff}.section-subtitle{color:#fff;font-size:.875rem;margin-bottom:.5rem;font-weight:600}.features-container{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem}.feature-item{display:flex;align-items:center;border-radius:var(--border-radius)}.feature-name{color:#fff;font-size:.8125rem;margin-right:.375rem}.community-container{display:flex;gap:.75rem;margin-bottom:.75rem}.aimbot-dot{position:fixed;width:.625rem;height:.625rem;border-radius:50%;background:red;border:.125rem solid rgba(255,255,255,.8);box-shadow:0 0 .5rem rgba(255,0,0,.5);transform:translate(-50%,-50%);pointer-events:none;display:none;z-index:2147483647}input[type=checkbox]{appearance:none;width:1rem;height:1rem;border:none;border-radius:25%;background:radial-gradient(circle at 35% 35%,#6a6a6a,#4d4d4d,#3d3d3d,#2a2a2a);box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.1);cursor:pointer;transition:background .2s ease-out,box-shadow .2s ease-out}input[type=checkbox]:hover{background:radial-gradient(circle at 35% 35%,#7a7a7a,#5d5d5d,#4d4d4d,#3a3a3a)}input[type=checkbox]:checked{background:radial-gradient(circle at 35% 35%,#8ef592,#6edb72,#4fb052,#3a8a3d);box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.3),0 0 var(--glow-size) rgba(110,219,114,var(--glow-opacity))}input[type=range]{appearance:none;width:5.625rem;height:.3125rem;border-radius:var(--border-radius);outline:0;cursor:pointer}input[type=range]::-webkit-slider-thumb{appearance:none;width:1rem;height:1rem;background:radial-gradient(circle at 35% 35%,#8ef592,#6edb72,#4fb052,#3a8a3d);border:none;border-radius:50%;cursor:pointer;box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.3);transition:transform .1s,background .1s}input[type=range]::-moz-range-thumb{width:1rem;height:1rem;background:radial-gradient(circle at 35% 35%,#8ef592,#6edb72,#4fb052,#3a8a3d);border:none;border-radius:50%;cursor:pointer;box-shadow:0 var(--shadow-size) calc(var(--shadow-size) * 3) rgba(0,0,0,var(--shadow-opacity)),inset calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) calc(var(--shadow-size) * 2) rgba(0,0,0,var(--shadow-opacity)),inset var(--shadow-size) var(--shadow-size) var(--shadow-size) rgba(255,255,255,.3);transition:transform .1s,background .1s}input[type=range]::-moz-range-thumb:hover,input[type=range]::-webkit-slider-thumb:hover{background:radial-gradient(circle at 35% 35%,#a0f7a4,#7eeb82,#5fc563,#4a9a4d)}input[type=range]::-webkit-slider-thumb:active{transform:scale(.85)}input[type=range]::-moz-range-thumb:active{transform:scale(.85)}input[type=range].slider-dragging::-webkit-slider-thumb{transform:scale(.85)}input[type=range].slider-dragging::-moz-range-thumb{transform:scale(.85)}li::marker{color:silver}"),
              qr.appendChild(e),
              qr
            );
          })()
        );
        (((e) => {
          Nt(on, Fr, [
            dt,
            (t) => {
              if ('ShiftRight' === t.code) {
                const t = e.querySelector('#ui');
                if (!t) return;
                return (
                  (t.style.display = Ee === t.style.display ? je : Ee),
                  void (vi = (e) => {
                    t && (t.style.display = e ? je : Ee);
                  })
                );
              }
              'KeyB' !== t.code || ((Gr.rt.ze = !Gr.rt.ze), xi());
            },
          ]);
        })(e),
          ((e) => {
            vi = (t) => {
              const r = e.querySelector('#ui');
              r && (r.style.display = t ? je : Ee);
            };
          })(e),
          (() => {
            const e = JSON.parse;
            At(() => {
              try {
                const t = (() => {
                  const e = (() => {
                    const e = $r.cookie;
                    if (!e) return Ne;
                    const t = Or + '=',
                      r = e.split(';');
                    for (const e of r) {
                      const r = e.trim();
                      if (r.startsWith(t)) return r.slice(9);
                    }
                    return Ne;
                  })();
                  return e
                    ? ((e) => {
                        if (Fe != typeof e || e.length % 4 != 0) return Ne;
                        let t = je;
                        for (let r = 0; e.length > r; r += 4) {
                          const n = e.slice(r, r + 4),
                            o = qt.parseInt(n, Ge);
                          if (qt.isNaN(o)) return Ne;
                          t += Ct(o);
                        }
                        return t;
                      })(e)
                    : Ne;
                })();
                if (Ne != t) {
                  const r = m(t),
                    n = e(r);
                  Gr._deserialize(n);
                }
              } catch {
              } finally {
                ((Yr = !0), (ki = !0), xi());
              }
            }, Ze);
          })(),
          Fr.fetch(De)
            .then((e) => e.json())
            .then((e) => {
              ((wi = mt + (mt !== e.tag_name ? ' (update available!)' : je)), ki && xi());
            })
            .catch(() => {
              ((wi = mt), ki && xi());
            }));
      })();
    'loading' === $r.readyState ? Nt(on, $r, ['DOMContentLoaded', e]) : e();
  })(),
    Nt(on, Fr, ['wheel', cn, an]),
    wo(),
    Nt(on, Fr, ['mousedown', ko]),
    Nt(on, Fr, [Ke, xo]),
    p(Fr.Array.prototype, 'sort', {
      apply(e, t, r) {
        try {
          Gr.cr.ze &&
            t.some((e) => Ne != e?.obj?.ori) &&
            t.forEach((e) => {
              ((e) => {
                Gr.cr.lr &&
                  e.obj.type.includes('tree') &&
                  e.shapes.forEach((e) => {
                    e.scale = 1.8;
                  });
              })(e);
              const t = Po[e.obj.type],
                r = Do[e.obj.type];
              t &&
                r &&
                e.shapes.forEach((n) => {
                  ((n.color = t), (n.scale = r), (e.zIdx = 999));
                });
            });
        } catch {}
        return Nt(e, t, r);
      },
    }),
    (t = Mi),
    p(Fr.Function.prototype, 'call', {
      apply(e, r, n) {
        try {
          Ne != n[0]?.nameInput &&
            Ne != n[0]?.game &&
            ((Fr.Function.prototype.call = e), (Zr = n[0]), t());
        } catch {}
        return Nt(e, r, n);
      },
    }));
})();
