// Small template engine on top of React so the views can stay as plain HTML strings.
// {{a.b}} reads from renderVals(), <sc-if value="{{x}}"> shows children when x is truthy,
// <sc-for list="{{xs}}" as="x"> repeats children, <sc-view name="y"> pulls in VIEWS.y
// We let React do the DOM updates because the CSS transitions need the same elements to stay on the page.

const h = React.createElement;

// the browser lowercases attribute names when it parses HTML, so map them back to React names
const REACT_ATTRS = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  defaultvalue: 'defaultValue',
  defaultchecked: 'defaultChecked',
  onclick: 'onClick',
  onchange: 'onChange',
  onpointerdown: 'onPointerDown',
  onpointermove: 'onPointerMove',
  onpointerup: 'onPointerUp',
  onpointercancel: 'onPointerCancel',
};

const parsedViews = {};

function getView(name) {
  if (!parsedViews[name]) {
    const tpl = document.createElement('template');
    tpl.innerHTML = VIEWS[name].trim();
    parsedViews[name] = Array.from(tpl.content.childNodes);
  }
  return parsedViews[name];
}

function toCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function lookup(expr, scopes) {
  const path = expr.trim();
  if (path === 'true') return true;
  if (path === 'false') return false;

  const [first, ...rest] = path.split('.');
  // search from the innermost loop variable outwards
  let value;
  for (let i = scopes.length - 1; i >= 0; i--) {
    if (first in scopes[i]) {
      value = scopes[i][first];
      break;
    }
  }
  for (const key of rest) {
    if (value == null) break;
    value = value[key];
  }
  return value;
}

function fill(text, scopes) {
  // "{{fn}}" alone keeps the real value (function, boolean, array), mixed text becomes a string
  const whole = text.match(/^\{\{([^{}]*)\}\}$/);
  if (whole) return lookup(whole[1], scopes);
  return text.replace(/\{\{([^{}]*)\}\}/g, (_, expr) => {
    const v = lookup(expr, scopes);
    return v == null ? '' : String(v);
  });
}

function parseStyle(text) {
  const style = {};
  // split on ; but not inside () like inset(0 0 0 50%)
  const parts = text.split(/;(?![^(]*\))/);
  for (const part of parts) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    const prop = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (prop) style[prop.startsWith('--') ? prop : toCamel(prop)] = value;
  }
  return style;
}

function renderList(nodes, scopes) {
  const out = [];
  nodes.forEach((node, i) => {
    const el = renderNode(node, scopes, i);
    if (el != null) out.push(el);
  });
  return out;
}

function renderNode(node, scopes, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    // line breaks between tags are only there to keep the views readable, so skip them
    if (/^\s*$/.test(node.nodeValue) && node.nodeValue.includes('\n')) return null;
    return fill(node.nodeValue, scopes);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.localName;
  const children = Array.from(node.childNodes);

  if (tag === 'sc-view') {
    return h(React.Fragment, { key }, renderList(getView(node.getAttribute('name')), scopes));
  }

  if (tag === 'sc-if') {
    const show = fill(node.getAttribute('value'), scopes);
    return show ? h(React.Fragment, { key }, renderList(children, scopes)) : null;
  }

  if (tag === 'sc-for') {
    const items = fill(node.getAttribute('list'), scopes) || [];
    const name = node.getAttribute('as');
    return h(React.Fragment, { key }, items.map((item, i) =>
      h(React.Fragment, { key: i }, renderList(children, [...scopes, { [name]: item }]))
    ));
  }

  const props = { key };
  const isSvg = node.namespaceURI === 'http://www.w3.org/2000/svg';

  for (const attr of node.attributes) {
    const name = attr.name.toLowerCase();
    const value = fill(attr.value, scopes);

    if (name === 'style') {
      props.style = parseStyle(String(value));
    } else if (REACT_ATTRS[name]) {
      if (value !== undefined) props[REACT_ATTRS[name]] = value;
    } else if (name.startsWith('on')) {
      continue; // events must come from the map above, never as strings
    } else if (isSvg && !name.startsWith('aria-') && name.includes('-')) {
      props[toCamel(name)] = value; // stroke-width -> strokeWidth
    } else {
      props[attr.name] = value;
    }
  }

  const kids = renderList(children, scopes);
  return kids.length ? h(tag, props, kids) : h(tag, props);
}

class TemplateComponent extends React.Component {
  render() {
    const kids = renderList(getView(this.view), [this.renderVals()]);
    return kids.length === 1 ? kids[0] : h(React.Fragment, null, kids);
  }
}
