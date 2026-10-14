import type { NodeT } from './types';
export const uid = () => Math.random().toString(36).slice(2, 9);
export const TAGS = ['div','section','nav','header','footer','aside','main','h1','h2','h3','p','span','a','button','input','textarea','hr','ul','li','blockquote'];
const VOID = new Set(['hr', 'input']);
const T = 'xs|sm|base|lg|xl|\\dxl';
export const G: Record<string, RegExp> = {
  display: /^(block|flex|grid|hidden|inline-flex|inline-block)$/, dir: /^flex-(row|col)(-reverse)?$/,
  justify: /^justify-/, items: /^items-/, cols: /^grid-cols-/, gap: /^gap-\d/,
  w: /^w-/, maxw: /^max-w-/, h: /^(min-)?h-/, p: /^p-/, px: /^px-/, py: /^py-/, m: /^m-/, mx: /^mx-/, my: /^my-/,
  size: new RegExp(`^text-(${T})$`), weight: /^font-(normal|medium|semibold|bold)$/, align: /^text-(left|center|right)$/,
  color: new RegExp(`^text-(?!(${T}|left|center|right)$)`), bg: /^bg-/, border: /^border(-[0-4])?$/,
  radius: /^rounded/, shadow: /^shadow/,
};
const split = (t: string): [string, string] => { const i = t.lastIndexOf(':'); return [t.slice(0, i + 1), t.slice(i + 1)]; };
export const tokens = (c: string) => c.split(/\s+/).filter(Boolean);
export function getUtil(c: string, prefix: string, g: string): string {
  for (const t of tokens(c)) { const [p, b] = split(t); if (p === prefix && G[g].test(b)) return b; }
  return '';
}
/** Replace the utility of group `g` at variant `prefix`; never touches other classes or other variants. */
export function setUtil(c: string, prefix: string, g: string, val: string): string {
  const kept = tokens(c).filter((t) => { const [p, b] = split(t); return !(p === prefix && G[g].test(b)); });
  if (val) kept.push(prefix + val);
  return kept.join(' ');
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
type Mode = 'html' | 'jsx' | 'preview';
function one(n: NodeT, mode: Mode, d: number): string {
  const pad = '  '.repeat(d);
  const attrs = `${mode === 'preview' ? ` data-id="${n.id}"` : ''} ${mode === 'jsx' ? 'className' : 'class'}="${esc(n.classes)}"` +
    `${n.tag === 'a' ? ' href="#"' : ''}${(n.tag === 'input' || n.tag === 'textarea') && n.text ? ` placeholder="${esc(n.text)}"` : ''}`;
  const open = `<${n.tag}${attrs}`;
  if (VOID.has(n.tag)) return `${pad}${open}${mode === 'jsx' ? ' />' : '>'}`;
  if (n.tag === 'textarea') return `${pad}${open}${mode === 'jsx' ? ' />' : '></textarea>'}`;
  const txt = mode === 'jsx' ? esc(n.text).replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;')) : esc(n.text);
  const kids = n.children.map((c) => one(c, mode, d + 1)).join('\n');
  if (!kids) return `${pad}${open}>${txt}</${n.tag}>`;
  return `${pad}${open}>\n${txt ? `${pad}  ${txt}\n` : ''}${kids}\n${pad}</${n.tag}>`;
}
export const toHTML = (ns: NodeT[]) => ns.map((n) => one(n, 'html', 0)).join('\n');
export const toJSX = (ns: NodeT[]) => ns.map((n) => one(n, 'jsx', 0)).join('\n');
export const toPreview = (ns: NodeT[]) => ns.map((n) => one(n, 'preview', 0)).join('');
export function validateNode(x: unknown, depth = 0): NodeT | null {
  if (!x || typeof x !== 'object' || depth > 12) return null;
  const o = x as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.name !== 'string' || typeof o.tag !== 'string' || !TAGS.includes(o.tag) ||
    typeof o.text !== 'string' || typeof o.classes !== 'string' || !Array.isArray(o.children)) return null;
  const children: NodeT[] = [];
  for (const c of o.children) { const v = validateNode(c, depth + 1); if (!v) return null; children.push(v); }
  return { id: o.id.slice(0, 20), name: o.name.slice(0, 60), tag: o.tag, text: o.text.slice(0, 2000), classes: o.classes.slice(0, 2000), children };
}
