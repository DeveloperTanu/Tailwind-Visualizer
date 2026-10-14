'use client';
import { useEffect, useReducer, useState } from 'react';
import { uid, validateNode } from './tw';
import type { NodeT } from './types';
export interface S { nodes: NodeT[]; saved: NodeT[]; sel: string | null }
export type A =
  | { t: 'add'; node: NodeT; parent?: string | null } | { t: 'append'; nodes: NodeT[] }
  | { t: 'upd'; id: string; patch: Partial<Pick<NodeT, 'name' | 'tag' | 'text' | 'classes'>> }
  | { t: 'del'; id: string } | { t: 'dup'; id: string } | { t: 'mv'; id: string; dir: -1 | 1 }
  | { t: 'sel'; id: string | null } | { t: 'load'; s: S } | { t: 'save'; id: string } | { t: 'unsave'; id: string } | { t: 'reset' } | { t: 'clear' };
export const find = (ns: NodeT[], id: string): NodeT | null => { for (const n of ns) { if (n.id === id) return n; const f = find(n.children, id); if (f) return f; } return null; };
const mapN = (ns: NodeT[], id: string, f: (n: NodeT) => NodeT): NodeT[] => ns.map((n) => (n.id === id ? f(n) : { ...n, children: mapN(n.children, id, f) }));
const rm = (ns: NodeT[], id: string): NodeT[] => ns.filter((n) => n.id !== id).map((n) => ({ ...n, children: rm(n.children, id) }));
export const clone = (n: NodeT): NodeT => ({ ...n, id: uid(), children: n.children.map(clone) });
const dupIn = (ns: NodeT[], id: string): NodeT[] => ns.flatMap((n) => (n.id === id ? [n, clone(n)] : [{ ...n, children: dupIn(n.children, id) }]));
const mvIn = (ns: NodeT[], id: string, dir: number): NodeT[] => {
  const i = ns.findIndex((n) => n.id === id);
  if (i < 0) return ns.map((n) => ({ ...n, children: mvIn(n.children, id, dir) }));
  const j = i + dir; if (j < 0 || j >= ns.length) return ns;
  const c = [...ns]; [c[i], c[j]] = [c[j], c[i]]; return c;
};
const init: S = { nodes: [], saved: [], sel: null };
function reducer(s: S, a: A): S {
  switch (a.t) {
    case 'add': return { ...s, sel: a.node.id, nodes: a.parent && find(s.nodes, a.parent) ? mapN(s.nodes, a.parent, (n) => ({ ...n, children: [...n.children, a.node] })) : [...s.nodes, a.node] };
    case 'append': return { ...s, nodes: [...s.nodes, ...a.nodes], sel: a.nodes[0]?.id ?? s.sel };
    case 'upd': return { ...s, nodes: mapN(s.nodes, a.id, (n) => ({ ...n, ...a.patch })) };
    case 'del': { const nodes = rm(s.nodes, a.id); return { ...s, nodes, sel: s.sel && find(nodes, s.sel) ? s.sel : null }; }
    case 'dup': return { ...s, nodes: dupIn(s.nodes, a.id) };
    case 'mv': return { ...s, nodes: mvIn(s.nodes, a.id, a.dir) };
    case 'sel': return { ...s, sel: a.id };
    case 'load': return a.s;
    case 'save': { const n = find(s.nodes, a.id); return n ? { ...s, saved: [...s.saved, clone(n)] } : s; }
    case 'unsave': return { ...s, saved: s.saved.filter((n) => n.id !== a.id) };
    case 'reset': return { ...s, nodes: [], sel: null };
    case 'clear': return init;
  }
}
const KEY = 'tv:workspace:v1';
function load(): S | null {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return null;
    const o = JSON.parse(raw) as { v?: number; nodes?: unknown; saved?: unknown };
    if (o.v !== 1 || !Array.isArray(o.nodes) || !Array.isArray(o.saved)) throw new Error('outdated');
    const nodes = o.nodes.map((x) => validateNode(x)); const saved = o.saved.map((x) => validateNode(x));
    if (nodes.includes(null) || saved.includes(null)) throw new Error('invalid');
    return { nodes: nodes as NodeT[], saved: saved as NodeT[], sel: null };
  } catch { try { localStorage.removeItem(KEY); } catch { /* ignore */ } return null; }
}
export function useWorkspace() {
  const [s, d] = useReducer(reducer, init);
  const [ready, setReady] = useState(false);
  useEffect(() => { const l = load(); if (l) d({ t: 'load', s: l }); setReady(true); }, []);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify({ v: 1, nodes: s.nodes, saved: s.saved })); } catch { /* quota */ } }, 300);
    return () => clearTimeout(t);
  }, [s.nodes, s.saved, ready]);
  return { s, d, ready };
}
export const clearStorage = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
