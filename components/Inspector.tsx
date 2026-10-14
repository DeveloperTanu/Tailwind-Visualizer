'use client';
import { Dispatch, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IconBtn } from './Icon';
import { blank } from '@/lib/presets';
import { TAGS, getUtil, setUtil, tokens, toHTML, toJSX } from '@/lib/tw';
import type { A } from '@/lib/store';
import type { Bp, NodeT, St } from '@/lib/types';
const BPS: [Bp, string][] = [['', 'Base (all)'], ['sm:', 'sm and up'], ['md:', 'md and up'], ['lg:', 'lg and up'], ['xl:', 'xl and up']];
const STS: St[] = ['', 'hover:', 'focus:', 'active:', 'dark:'];
const sp = (p: string) => ['0', '1', '2', '3', '4', '6', '8', '12', '16', '20', '24'].map((v) => `${p}-${v}`);
const COLORS = ['bg-white', 'bg-stone-100', 'bg-stone-400', 'bg-stone-900', 'bg-zinc-900', 'bg-indigo-600', 'bg-emerald-600', 'bg-rose-500', 'bg-amber-400', 'bg-sky-500', 'bg-transparent'];
type Ctl = { label: string; g: string; opts: string[]; swatch?: boolean; text?: boolean };
const SECTIONS: { title: string; items: Ctl[] }[] = [
  { title: 'Layout', items: [
    { label: 'Display', g: 'display', opts: ['block', 'flex', 'grid', 'hidden', 'inline-flex'] },
    { label: 'Direction', g: 'dir', opts: ['flex-row', 'flex-col'] },
    { label: 'Justify', g: 'justify', opts: ['justify-start', 'justify-center', 'justify-between', 'justify-end'] },
    { label: 'Align items', g: 'items', opts: ['items-start', 'items-center', 'items-end', 'items-stretch'] },
    { label: 'Columns', g: 'cols', opts: ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4'] },
    { label: 'Gap', g: 'gap', opts: sp('gap') } ] },
  { title: 'Size', items: [
    { label: 'Width', g: 'w', opts: ['w-auto', 'w-full', 'w-1/2', 'w-1/3', 'w-64', 'w-96'] },
    { label: 'Max width', g: 'maxw', opts: ['max-w-md', 'max-w-2xl', 'max-w-4xl', 'max-w-6xl', 'max-w-full'] },
    { label: 'Height', g: 'h', opts: ['h-auto', 'h-16', 'h-32', 'h-64', 'h-96', 'min-h-screen'] } ] },
  { title: 'Spacing', items: [
    { label: 'Padding', g: 'p', opts: sp('p') }, { label: 'Padding X', g: 'px', opts: sp('px') }, { label: 'Padding Y', g: 'py', opts: sp('py') },
    { label: 'Margin', g: 'm', opts: sp('m') }, { label: 'Margin X', g: 'mx', opts: ['mx-auto', ...sp('mx')] }, { label: 'Margin Y', g: 'my', opts: sp('my') } ] },
  { title: 'Typography', items: [
    { label: 'Size', g: 'size', opts: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-4xl', 'text-6xl'] },
    { label: 'Weight', g: 'weight', opts: ['font-normal', 'font-medium', 'font-semibold', 'font-bold'] },
    { label: 'Align', g: 'align', opts: ['text-left', 'text-center', 'text-right'] } ] },
  { title: 'Color', items: [
    { label: 'Text color', g: 'color', opts: COLORS.map((c) => 'text-' + c.slice(3)), swatch: true, text: true },
    { label: 'Background', g: 'bg', opts: COLORS, swatch: true } ] },
  { title: 'Border & effects', items: [
    { label: 'Border', g: 'border', opts: ['border', 'border-0', 'border-2'] },
    { label: 'Radius', g: 'radius', opts: ['rounded-none', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'] },
    { label: 'Shadow', g: 'shadow', opts: ['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] } ] },
];
interface P { n: NodeT; bp: Bp; setBp: (b: Bp) => void; st: St; setSt: (s: St) => void; d: Dispatch<A>; css: string; copy: (t: string, l: string) => void; onClose: () => void }
export default function Inspector({ n, bp, setBp, st, setSt, d, css, copy, onClose }: P) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = gsap.fromTo(ref.current, { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2, clearProps: 'all' });
    return () => { t.kill(); };
  }, []);
  const prefix = bp + st;
  const up = (patch: Partial<Pick<NodeT, 'name' | 'tag' | 'text' | 'classes'>>) => d({ t: 'upd', id: n.id, patch });
  const set = (g: string, v: string) => up({ classes: setUtil(n.classes, prefix, g, v) });
  const status = (t: string) => (!css ? 'wait' : css.includes('.' + CSS.escape(t)) ? 'ok' : 'bad');
  return (
    <div ref={ref} className="flex h-full w-80 flex-col">
      <div className="flex items-center justify-between p-3"><h2 className="text-sm font-semibold">Inspector</h2><IconBtn n="close" label="Close inspector" onClick={onClose} /></div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-6">
        <div><label className="lbl" htmlFor="nm">Name</label><input id="nm" className="field" maxLength={60} value={n.name} onChange={(e) => up({ name: e.target.value })} /></div>
        <div><p className="lbl mb-1">Tag</p><div className="flex flex-wrap gap-1">{TAGS.map((t) => <button key={t} className="btn" data-on={n.tag === t} onClick={() => up({ tag: t })}>{t}</button>)}</div></div>
        {n.tag !== 'hr' && <div><label className="lbl" htmlFor="tx">{n.tag === 'input' || n.tag === 'textarea' ? 'Placeholder' : 'Text'}</label><textarea id="tx" className="field" rows={2} value={n.text} onChange={(e) => up({ text: e.target.value })} /></div>}
        <div className="rounded-lg border border-[var(--line)] p-2">
          <p className="lbl mb-1">Editing target</p>
          <div className="mb-1 flex flex-wrap gap-1">{BPS.map(([v, l]) => <button key={l} className="btn" data-on={bp === v} onClick={() => setBp(v)}>{l}</button>)}</div>
          <div className="flex flex-wrap gap-1">{STS.map((v) => <button key={v || 'default'} className="btn" data-on={st === v} onClick={() => setSt(v)}>{v ? v.slice(0, -1) : 'default'}</button>)}</div>
          <p className="mt-2 text-xs text-[var(--mut)]">Prefix: <code>{prefix || '(none)'}</code></p>
        </div>
        {SECTIONS.map((sec) => (
          <section key={sec.title}><h3 className="lbl mb-1 border-b border-[var(--line)] pb-1">{sec.title}</h3>
            {sec.items.map((c) => { const cur = getUtil(n.classes, prefix, c.g); return (
              <div key={c.g} className="mb-2"><p className="mb-1 text-xs">{c.label}</p>
                <div className="flex flex-wrap gap-1">{c.opts.map((o) => (
                  <button key={o} className="btn" data-on={cur === o} aria-pressed={cur === o} title={o} onClick={() => set(c.g, cur === o ? '' : o)}>
                    {c.swatch ? <><span className={`inline-block size-3 rounded-full border border-stone-400 ${COLORS.find((x) => x.slice(3) === o.replace(/^(text|bg)-/, '')) ?? ''}`} />{o.replace(/^(text|bg)-/, '')}</> : o.replace(/^(gap|p|px|py|m|mx|my)-/, '')}
                  </button>))}</div></div>); })}
          </section>
        ))}
        <section><h3 className="lbl mb-1 border-b border-[var(--line)] pb-1">Tailwind classes</h3>
          <textarea className="field font-mono" rows={4} aria-label="Tailwind classes" spellCheck={false} value={n.classes} onChange={(e) => up({ classes: e.target.value })} />
          <div className="mt-2 flex flex-wrap gap-1">{tokens(n.classes).map((t) => { const s = status(t); return (
            <button key={t} className="btn font-mono" style={{ borderColor: s === 'ok' ? '#10b981' : s === 'bad' ? '#f43f5e' : undefined, textDecoration: s === 'bad' ? 'line-through' : undefined }}
              title={s === 'ok' ? 'Applied — click to remove' : s === 'bad' ? 'Unsupported utility — click to remove' : 'Compiler loading — click to remove'} onClick={() => up({ classes: tokens(n.classes).filter((x) => x !== t).join(' ') })}>{t}</button>); })}</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <button className="btn" onClick={() => copy(n.classes, 'Classes')}>Copy Tailwind Classes</button>
            <button className="btn" onClick={() => copy(toJSX([n]), 'JSX')}>Copy JSX</button>
            <button className="btn" onClick={() => copy(toHTML([n]), 'HTML')}>Copy HTML</button>
          </div></section>
        <section><h3 className="lbl mb-1">Add child</h3><div className="flex flex-wrap gap-1">{TAGS.map((t) => <button key={t} className="btn" onClick={() => d({ t: 'add', node: blank(t), parent: n.id })}>+ {t}</button>)}</div></section>
      </div>
    </div>
  );
}
