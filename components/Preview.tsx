'use client';
import { useEffect, useRef, useState } from 'react';
const SRC = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">@custom-variant dark (&:where(.dark, .dark *));</style>
<style>body{margin:0}[data-sel]{outline:2px solid #6366f1!important;outline-offset:-2px}[data-id]{cursor:pointer}</style></head><body><div id="r"></div></body></html>`;
interface P { html: string; dark: boolean; sel: string | null; width: number; onPick: (id: string | null) => void; onCss: (css: string) => void }
/** The canvas is a real iframe running the Tailwind v4 browser compiler (JIT), so any utility works and breakpoints follow the iframe width. */
export default function Preview({ html, dark, sel, width, onPick, onCss }: P) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const pick = useRef(onPick); pick.current = onPick;
  const doc = () => ref.current?.contentDocument ?? null;
  const onLoad = () => {
    const dc = doc(); if (!dc) return;
    dc.addEventListener('click', (e) => { e.preventDefault(); pick.current((e.target as Element).closest('[data-id]')?.getAttribute('data-id') ?? null); });
    setReady(true);
  };
  useEffect(() => {
    const dc = doc(); if (!ready || !dc) return;
    const r = dc.getElementById('r'); if (r) r.innerHTML = html;
    dc.documentElement.classList.toggle('dark', dark);
    const t = setTimeout(() => onCss([...dc.querySelectorAll('style')].map((x) => x.textContent ?? '').join('')), 300);
    return () => clearTimeout(t);
  }, [html, dark, ready, onCss]);
  useEffect(() => {
    const dc = doc(); if (!ready || !dc) return;
    dc.querySelectorAll('[data-sel]').forEach((e) => e.removeAttribute('data-sel'));
    if (sel) dc.querySelector(`[data-id="${CSS.escape(sel)}"]`)?.setAttribute('data-sel', '');
  }, [sel, html, ready]);
  return <iframe ref={ref} title="Canvas preview" srcDoc={SRC} onLoad={onLoad} sandbox="allow-same-origin allow-scripts" className="block h-full bg-white" style={{ width }} />;
}
