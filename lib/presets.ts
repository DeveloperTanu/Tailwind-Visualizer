import { uid } from './tw';
import type { NodeT } from './types';
export const n = (tag: string, classes: string, text = '', children: NodeT[] = [], name?: string): NodeT => ({ id: uid(), name: name ?? tag, tag, text, classes, children });
export interface Preset { name: string; make: () => NodeT }
const btn = (t: string, c = 'bg-indigo-600 text-white hover:bg-indigo-500') => n('button', `rounded-lg px-4 py-2 text-sm font-medium transition ${c}`, t, [], 'Button');
const navbar = () => n('nav', 'flex items-center justify-between bg-white px-6 py-4 border-b border-stone-200', '', [
  n('span', 'text-lg font-bold text-stone-900', 'Acme', [], 'Logo'),
  n('div', 'hidden md:flex gap-6 text-sm text-stone-600', '', ['Product', 'Pricing', 'Docs'].map((t) => n('a', 'hover:text-stone-900', t, [], 'Link')), 'Menu'),
  btn('Sign up')], 'Navbar');
const hero = () => n('section', 'bg-stone-900 px-6 py-16 lg:py-24 text-center', '', [
  n('h1', 'text-3xl lg:text-5xl font-bold text-white', 'Build faster with Tailwind'),
  n('p', 'mx-auto mt-4 max-w-xl text-stone-300', 'A short supporting line that explains your product.'),
  n('div', 'mt-8 flex justify-center gap-3', '', [btn('Get started'), btn('Learn more', 'bg-stone-700 text-white hover:bg-stone-600')], 'Actions')], 'Hero');
const features = () => n('section', 'grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-100 p-8', '',
  ['Fast', 'Flexible', 'Friendly'].map((t) => n('div', 'rounded-xl bg-white p-6 shadow-sm', '', [n('h3', 'text-lg font-semibold text-stone-900', t), n('p', 'mt-2 text-sm text-stone-600', 'Describe this feature in a sentence or two.')], 'Feature card')), 'Feature grid');
const pricing = () => n('section', 'grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8', '',
  [['Starter', '$9'], ['Pro', '$29'], ['Team', '$79']].map(([t, p]) => n('div', 'flex flex-col gap-3 rounded-xl border border-stone-200 p-6', '', [
    n('h3', 'text-lg font-semibold text-stone-900', t), n('p', 'text-3xl font-bold text-stone-900', `${p}/mo`),
    n('ul', 'text-sm text-stone-600', '', ['Feature one', 'Feature two'].map((x) => n('li', '', x))), btn('Choose')], `${t} plan`)), 'Pricing');
const testimonial = () => n('section', 'bg-stone-100 px-6 py-12', '', [n('blockquote', 'mx-auto max-w-2xl text-center text-xl text-stone-800', '"This tool saved us weeks of work."'), n('p', 'mt-4 text-center text-sm text-stone-500', '— Happy customer')], 'Testimonial');
const form = () => n('div', 'mx-auto flex max-w-md flex-col gap-3 bg-white p-6', '', [
  n('input', 'rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-500', 'Email address'),
  n('textarea', 'rounded-lg border border-stone-300 px-3 py-2 text-sm h-32', 'Your message'), btn('Send')], 'Contact form');
const footer = () => n('footer', 'flex flex-col md:flex-row items-center justify-between gap-2 bg-stone-900 px-6 py-8 text-sm text-stone-400', '', [n('span', '', '© 2026 Acme'), n('span', '', 'Privacy · Terms')], 'Footer');
export const CATS: Record<string, Preset[]> = {
  Elements: [
    { name: 'Button', make: () => btn('Click me') },
    { name: 'Link', make: () => n('a', 'text-indigo-600 underline', 'A link', [], 'Link') },
    { name: 'Divider', make: () => n('hr', 'my-4 border-stone-300', '', [], 'Divider') },
    { name: 'Input', make: () => n('input', 'rounded-lg border border-stone-300 px-3 py-2 text-sm', 'Type here', [], 'Input') },
    { name: 'Textarea', make: () => n('textarea', 'rounded-lg border border-stone-300 px-3 py-2 text-sm h-32', 'Message', [], 'Textarea') },
    { name: 'Image placeholder', make: () => n('div', 'h-48 w-full rounded-xl bg-stone-300', '', [], 'Image') },
  ],
  Layouts: [
    { name: 'Container', make: () => n('div', 'mx-auto max-w-6xl p-6', '', [], 'Container') },
    { name: 'Section', make: () => n('section', 'px-6 py-12', '', [], 'Section') },
    { name: 'Two columns', make: () => n('div', 'grid grid-cols-1 md:grid-cols-2 gap-6 p-6', '', [n('div', 'rounded-lg bg-stone-100 p-4', 'Left'), n('div', 'rounded-lg bg-stone-100 p-4', 'Right')], 'Two columns') },
    { name: 'Three columns', make: () => n('div', 'grid grid-cols-1 md:grid-cols-3 gap-6 p-6', '', [1, 2, 3].map((i) => n('div', 'rounded-lg bg-stone-100 p-4', `Column ${i}`)), 'Three columns') },
    { name: 'Sidebar layout', make: () => n('div', 'flex flex-col md:flex-row gap-6 p-6', '', [n('aside', 'w-full md:w-64 rounded-lg bg-stone-100 p-4', 'Sidebar'), n('main', 'flex-1 rounded-lg bg-stone-50 p-4', 'Content')], 'Sidebar layout') },
  ],
  Typography: [
    { name: 'Heading 1', make: () => n('h1', 'text-4xl font-bold text-stone-900', 'Heading one') },
    { name: 'Heading 2', make: () => n('h2', 'text-2xl font-semibold text-stone-900', 'Heading two') },
    { name: 'Heading 3', make: () => n('h3', 'text-lg font-semibold text-stone-900', 'Heading three') },
    { name: 'Paragraph', make: () => n('p', 'text-base text-stone-700', 'Write something meaningful here.') },
    { name: 'Blockquote', make: () => n('blockquote', 'border-l-4 border-stone-400 pl-4 italic text-stone-700', 'A memorable quote.') },
    { name: 'List', make: () => n('ul', 'list-disc pl-6 text-stone-700', '', [n('li', '', 'First'), n('li', '', 'Second')], 'List') },
  ],
  Components: [
    { name: 'Navbar', make: navbar }, { name: 'Hero', make: hero }, { name: 'Feature cards', make: features },
    { name: 'Pricing', make: pricing }, { name: 'Testimonial', make: testimonial }, { name: 'Contact form', make: form }, { name: 'Footer', make: footer },
  ],
};
export const PAGES: { name: string; desc: string; make: () => NodeT[] }[] = [
  { name: 'Landing page', desc: 'Navbar, hero, features, pricing, footer', make: () => [navbar(), hero(), features(), pricing(), footer()] },
  { name: 'Contact page', desc: 'Navbar, form, footer', make: () => [navbar(), form(), footer()] },
  { name: 'Social proof', desc: 'Hero, testimonial, footer', make: () => [hero(), testimonial(), footer()] },
];
export const blank = (tag: string): NodeT => n(tag, '', tag === 'hr' ? '' : tag, [], tag);
