import { Fragment } from 'react';
import { Link } from 'react-router-dom';

// Renders plain text with [link text](/path) links. Internal paths use the
// router; anything starting with http opens normally. Nothing else is parsed.
export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    const [, label, href] = m;
    parts.push(href.startsWith('/')
      ? <Link key={i++} to={href}>{label}</Link>
      : <a key={i++} href={href} target="_blank" rel="noopener">{label}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
