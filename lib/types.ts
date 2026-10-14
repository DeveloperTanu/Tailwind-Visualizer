export type Bp = '' | 'sm:' | 'md:' | 'lg:' | 'xl:';
export type St = '' | 'hover:' | 'focus:' | 'active:' | 'dark:';
export type VP = 'mobile' | 'tablet' | 'desktop';
export interface NodeT { id: string; name: string; tag: string; text: string; classes: string; children: NodeT[] }
