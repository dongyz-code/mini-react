var s = /* @__PURE__ */ ((t) => (t.UPDATE = "UPDATE", t.PLACEMENT = "PLACEMENT", t.DELETION = "DELETION", t.PLACEMENT_AND_UPDATE = "PLACEMENT_AND_UPDATE", t.CONTENT_RESET = "CONTENT_RESET", t))(s || {}), N = /* @__PURE__ */ ((t) => (t.TEXT_ELEMENT = "TEXT_ELEMENT", t))(N || {});
function L(t, n) {
  var T;
  let o = 0, e = (T = t.alternate) == null ? void 0 : T.child, c;
  for (; o < n.length || e; ) {
    const i = n[o];
    let l;
    const u = (i == null ? void 0 : i.type) === (e == null ? void 0 : e.type);
    u && (l = {
      type: e == null ? void 0 : e.type,
      props: i.props,
      stateNode: e == null ? void 0 : e.stateNode,
      return: t,
      alternate: e,
      effectTag: s.UPDATE,
      element: i
    }), i && !u && (l = {
      type: i.type,
      props: i.props,
      stateNode: void 0,
      return: t,
      alternate: void 0,
      effectTag: s.PLACEMENT,
      element: i
    }), e && !u && (e.effectTag = s.DELETION, C(e)), e && (e = e.sibling), o === 0 ? t.child = l : i && (c.sibling = l), c = l, o++;
  }
}
let r, p, h, a = null, g = [];
function C(t) {
  g.push(t);
}
function D(t, n) {
  p = {
    stateNode: n,
    props: {
      children: [t]
      // 此时的element还只是React.createElement函数创建的virtual dom树
    },
    alternate: h
    // element: element,
  }, g = [], r = p;
}
function M(t) {
  a = t, a.stateHooks = [], a.effectHooks = [];
  const n = [t.type(t.props)];
  L(t, n);
}
function A(t) {
  t.stateNode || (t.stateNode = v(t)), L(t, t.props.children);
}
function O(t) {
  if (t.type instanceof Function ? M(t) : A(t), t.child)
    return t.child;
  let o = t;
  for (; o; ) {
    if (o.sibling)
      return o.sibling;
    o = o.return;
  }
}
function m(t) {
  let n = !1;
  for (; r && !n; )
    r = O(r), n = t.timeRemaining() < 1, console.log("workInProgressRoot", p), console.log("currentRoot", h);
  requestIdleCallback(m);
}
requestIdleCallback(m);
const f = (t) => t.startsWith("on"), d = (t) => t !== "children", E = (t, n) => (o) => t[o] !== n[o], R = (t, n) => (o) => !(o in n);
function v(t) {
  const n = t.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(t.type);
  return w(n, {}, t.props), n;
}
function w(t, n, o) {
  Object.keys(n).forEach((e) => {
    if (f(e) && (!(e in o) || E(n, o)(e))) {
      const c = e.toLowerCase().substring(2);
      t.removeEventListener(c, n[e]);
    }
    if (d(e) && R(n, o)(e) && (t[e] = ""), f(e) && E(n, o)(e)) {
      const c = e.toLowerCase().substring(2);
      t.addEventListener(c, o[e]);
    }
    d(e) && E(n, o)(e) && (t[e] = o[e]);
  });
}
function U(t, n) {
  D(t, n);
}
function _(t) {
  return {
    type: N.TEXT_ELEMENT,
    props: {
      nodeValue: t,
      children: []
    }
  };
}
function I(t, n, ...o) {
  return {
    type: t,
    props: {
      ...n,
      children: o.map((e) => typeof e == "object" && e !== null ? e : _(e))
    }
  };
}
const X = {
  render: U,
  createElement: I
};
export {
  I as createElement,
  X as default,
  U as render
};
//# sourceMappingURL=mini-react.mjs.map
