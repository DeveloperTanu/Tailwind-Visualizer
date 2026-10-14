'use client';
import { Dispatch, useState } from 'react';
import { Icon, IconBtn } from './Icon';
import { CATS, PAGES } from '@/lib/presets';
import type { A, S } from '@/lib/store';
import type { NodeT } from '@/lib/types';
const TABS = ['Elements', 'Layouts', 'Typography', 'Components', 'Saved', 'Presets', 'Layers'] as const;
function Layer({ n, depth, s, d }: { n: NodeT; depth: number; s: S; d: Dispatch<A> }) {
  const [ed, setEd] = useState(false);
  const [v, setV] = useState(n.name);
  const commit = () => { setEd(false); const t = v.trim().slice(0, 60); if (t) d({ t: 'upd', id: n.id, patch: { name: t } }); else setV(n.name); };
  return (
    <li>
      <div className="flex items-center gap-1 rounded-md px-1 py-0.5 text-sm" style={{ paddingLeft: 4 + depth * 12, background: s.sel === n.id ? 'color-mix(in srgb,var(--acc) 18%,transparent)' : undefined }}>
        {ed ? (
          <input autoFocus className="field !py-0.5" value={v} aria-label="Element name" onChange={(e) => setV(e.target.value)} onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setV(n.name); setEd(false); } }} />
        ) : (
          <button type="button" className="min-w-0 flex-1 truncate text-left" onClick={() => d({ t: 'sel', id: n.id })} onDoubleClick={() => { setV(n.name); setEd(true); }}>
            {n.name} <span className="text-[10px] text-[var(--mut)]">&lt;{n.tag}&gt;</span>
          </button>
        )}
        {!ed && <button type="button" className="p-1 text-[var(--mut)] hover:text-[var(--acc)]" aria-label={`Rename ${n.name}`} onClick={() => { setV(n.name); setEd(true); }}><Icon n="edit" /></button>}
      </div>
      {n.children.length > 0 && <ul>{n.children.map((c) => <Layer key={c.id} n={c} depth={depth + 1} s={s} d={d} />)}</ul>}
    </li>
  );
}
interface P { s: S; d: Dispatch<A>; into: boolean; setInto: (v: boolean) => void; onClose: () => void }
export default function Sidebar({ s, d, into, setInto, onClose }: P) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Elements');
  const [q, setQ] = useState('');
  const add = (node: NodeT) => d({ t: 'add', node, parent: into ? s.sel : null });
  const searching = q.trim().length > 0;
  const list = searching ? Object.values(CATS).flat().filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())) : CATS[tab] ?? [];
  const row = 'flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--field)] px-3 py-2 text-left text-sm hover:border-[var(--acc)]';
  return (
    <div className="flex h-full w-72 flex-col">
      <div className="flex items-center gap-2 p-3">
        <input className="field" type="search" placeholder="Search elements…" aria-label="Search elements" value={q} onChange={(e) => setQ(e.target.value)} />
        <IconBtn n="close" label="Close sidebar" onClick={onClose} />
      </div>
      <div className="flex flex-wrap gap-1 px-3 pb-2" role="tablist">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t && !searching} className="btn" data-on={tab === t && !searching} onClick={() => { setTab(t); setQ(''); }}>{t}</button>)}
      </div>
      <label className="flex items-center gap-2 px-3 pb-2 text-xs text-[var(--mut)]">
        <input type="checkbox" checked={into} onChange={(e) => setInto(e.target.checked)} /> Add inside selected element
      </label>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {(searching || CATS[tab]) && (list.length ? list.map((p) => (
          <button key={p.name} className={row} onClick={() => add(p.make())}>{p.name}<Icon n="plus" /></button>
        )) : <p className="py-6 text-center text-sm text-[var(--mut)]">No elements match “{q}”.</p>)}
        {!searching && tab === 'Saved' && (s.saved.length ? s.saved.map((n) => (
          <div key={n.id} className="flex gap-1">
            <button className={row} onClick={() => add({ ...JSON.parse(JSON.stringify(n)) as NodeT, id: Math.random().toString(36).slice(2, 9) })}>{n.name}<Icon n="plus" /></button>
            <IconBtn n="trash" label={`Remove saved ${n.name}`} onClick={() => d({ t: 'unsave', id: n.id })} />
          </div>
        )) : <p className="py-6 text-center text-sm text-[var(--mut)]">Nothing saved yet. Select an element and press the star in the toolbar.</p>)}
        {!searching && tab === 'Presets' && PAGES.map((p) => (
          <button key={p.name} className={row} onClick={() => d({ t: 'append', nodes: p.make() })}><span>{p.name}<br /><span className="text-xs text-[var(--mut)]">{p.desc}</span></span><Icon n="plus" /></button>
        ))}
        {!searching && tab === 'Layers' && (s.nodes.length ? <ul><p className="lbl pb-1">Double-click a name to rename</p>{s.nodes.map((n) => <Layer key={n.id} n={n} depth={0} s={s} d={d} />)}</ul>
          : <p className="py-6 text-center text-sm text-[var(--mut)]">The page is empty. Add an element first.</p>)}
      </div>
    </div>
  );
}
