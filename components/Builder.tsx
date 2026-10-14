'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Icon, IconBtn } from './Icon';
import Preview from './Preview';
import Sidebar from './Sidebar';
import Inspector from './Inspector';
import { clearStorage, find, useWorkspace } from '@/lib/store';
import { toHTML, toJSX, toPreview } from '@/lib/tw';
import type { Bp, St, VP } from '@/lib/types';
const WIDTH: Record<VP, number> = { mobile: 375, tablet: 768, desktop: 1280 };
const VP_BP: Record<VP, Bp> = { mobile: '', tablet: 'md:', desktop: 'lg:' };
const cookie = (k: string, v: string) => { document.cookie = `${k}=${v};path=/;max-age=31536000;samesite=lax`; };
export default function Builder() {
  const { s, d, ready } = useWorkspace();
  const [vp, setVp] = useState<VP>('desktop');
  const [bp, setBp] = useState<Bp>('lg:');
  const [st, setSt] = useState<St>('');
  const [open, setOpen] = useState(true);
  const [into, setInto] = useState(false);
  const [dark, setDark] = useState(false);
  const [css, setCss] = useState('');
  const [toast, setToast] = useState('');
  const side = useRef<HTMLElement>(null);
  const first = useRef(true);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setOpen(window.innerWidth >= 768 && !/tv-side=0/.test(document.cookie));
  }, []);
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = gsap.to(side.current, { width: open ? 288 : 0, duration: first.current || reduce ? 0 : 0.25, ease: 'power2.out' });
    first.current = false;
    return () => { t.kill(); };
  }, [open]);
  const toggleSide = (v: boolean) => { setOpen(v); cookie('tv-side', v ? '1' : '0'); };
  const toggleTheme = () => { const v = !dark; setDark(v); document.documentElement.classList.toggle('dark', v); cookie('tv-theme', v ? 'dark' : 'light'); };
  const copy = useCallback((text: string, label: string) => {
    const done = (ok: boolean) => { setToast(ok ? `${label} copied` : `Could not copy ${label}`); setTimeout(() => setToast(''), 1600); };
    navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
  }, []);
  const html = useMemo(() => toPreview(s.nodes), [s.nodes]);
  const sel = s.sel ? find(s.nodes, s.sel) : null;
  const pickVp = (v: VP) => { setVp(v); setBp(VP_BP[v]); };
  return (
    <div className="flex h-dvh flex-col">
      <header className="panel z-40 flex flex-wrap items-center gap-2 border-x-0 border-t-0 px-3 py-2">
        <IconBtn n={open ? 'close' : 'menu'} label={open ? 'Close sidebar' : 'Open sidebar'} onClick={() => toggleSide(!open)} />
        <div className="font-semibold tracking-tight"><span className="text-[var(--acc)]">Tailwind</span> Visualizer</div>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <button className="btn" onClick={() => { if (confirm('Reset the page? Saved elements are kept.')) d({ t: 'reset' }); }}><Icon n="reset" />Reset</button>
          <button className="btn" onClick={() => { if (confirm('Clear ALL data (page, saved elements, preferences)?')) { clearStorage(); cookie('tv-side', '1'); d({ t: 'clear' }); } }}>Clear data</button>
          <button className="btn" disabled={!s.nodes.length} onClick={() => copy(toHTML(s.nodes), 'Page HTML')}><Icon n="copy" />HTML</button>
          <button className="btn" disabled={!s.nodes.length} onClick={() => copy(toJSX(s.nodes), 'Page JSX')}><Icon n="copy" />JSX</button>
          <IconBtn n={dark ? 'sun' : 'moon'} label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme} />
        </div>
      </header>
      <div className="relative flex min-h-0 flex-1">
        <aside ref={side} aria-label="Sidebar" className="panel absolute inset-y-0 left-0 z-30 overflow-hidden border-y-0 border-l-0 md:static" style={{ width: 288 }}>
          <Sidebar s={s} d={d} into={into} setInto={setInto} onClose={() => toggleSide(false)} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-3 py-2">
            {(['mobile', 'tablet', 'desktop'] as VP[]).map((v) => <IconBtn key={v} n={v === 'mobile' ? 'phone' : v} label={`${v} preview (${WIDTH[v]}px)`} on={vp === v} onClick={() => pickVp(v)} />)}
            <span className="text-xs text-[var(--mut)]">{WIDTH[vp]}px · editing <b className="text-[var(--acc)]">{bp || 'base'}</b></span>
            {sel && (
              <div className="ml-auto flex items-center gap-1">
                <span className="max-w-40 truncate rounded-md bg-[var(--field)] px-2 py-1 text-xs">{sel.name}</span>
                <IconBtn n="up" label="Move up" onClick={() => d({ t: 'mv', id: sel.id, dir: -1 })} />
                <IconBtn n="down" label="Move down" onClick={() => d({ t: 'mv', id: sel.id, dir: 1 })} />
                <IconBtn n="dup" label="Duplicate" onClick={() => d({ t: 'dup', id: sel.id })} />
                <IconBtn n="star" label="Save element" onClick={() => { d({ t: 'save', id: sel.id }); copy('', 'Saved to library'); }} />
                <IconBtn n="trash" label="Delete" onClick={() => d({ t: 'del', id: sel.id })} />
              </div>)}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-3">
            <div className="mx-auto h-full overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-sm" style={{ width: WIDTH[vp], minWidth: WIDTH[vp] > 800 ? WIDTH[vp] : undefined, maxWidth: WIDTH[vp] > 800 ? undefined : '100%' }}>
              {!ready ? <p className="p-8 text-sm text-stone-500" role="status">Loading workspace…</p>
                : !s.nodes.length ? <div className="grid h-full place-items-center p-8 text-center text-stone-500"><div><p className="font-medium text-stone-800">Your page is empty</p><p className="text-sm">Add an element from the sidebar or load a preset.</p></div></div>
                : <Preview html={html} dark={dark} sel={s.sel} width={WIDTH[vp]} onPick={(id) => d({ t: 'sel', id })} onCss={setCss} />}
            </div>
          </div>
        </main>
        {sel && (
          <aside aria-label="Inspector" className="panel absolute inset-y-0 right-0 z-30 border-y-0 border-r-0 lg:static">
            <Inspector n={sel} bp={bp} setBp={setBp} st={st} setSt={setSt} d={d} css={css} copy={copy} onClose={() => d({ t: 'sel', id: null })} />
          </aside>)}
      </div>
      {toast && <div role="status" className="panel fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-3 py-2 text-sm">{toast}</div>}
    </div>
  );
}
