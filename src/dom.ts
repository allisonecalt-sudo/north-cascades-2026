/**
 * Tiny DOM helpers — no framework. h() builds elements, escape() escapes text.
 */

type Attrs = Record<string, string | number | boolean | undefined>;
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Attrs,
  ...children: (Child | Child[])[]
): HTMLElementTagNameMap[K];
export function h(tag: string, attrs?: Attrs, ...children: (Child | Child[])[]): HTMLElement;
export function h(
  tag: string,
  attrs: Attrs = {},
  ...children: (Child | Child[])[]
): HTMLElement {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === 'class') {
      el.className = String(value);
    } else if (key === 'html') {
      el.innerHTML = String(value);
    } else if (key.startsWith('aria-') || key.startsWith('data-')) {
      el.setAttribute(key, String(value));
    } else if (key in el) {
      // Safe DOM property assignment; restricted to known string/number/boolean attrs.
      (el as unknown as Record<string, unknown>)[key] = value;
    } else {
      el.setAttribute(key, String(value));
    }
  }
  const flat = children.flat();
  for (const child of flat) {
    if (child === null || child === undefined || child === false) continue;
    el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

export function section(id: string, title: string, ...children: Child[]): HTMLElement {
  return h(
    'section',
    { id, class: 'section' },
    h('h2', { class: 'section__title' }, title),
    ...children
  );
}

export function badge(text: string, kind = 'default'): HTMLElement {
  return h('span', { class: `badge badge--${kind}` }, text);
}
