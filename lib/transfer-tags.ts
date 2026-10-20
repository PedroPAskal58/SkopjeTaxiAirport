const tagStyles: Record<string, string> = {
  'Meet & greet': 'bg-amber-400/15 text-amber-300 ring-amber-400/30',
  'Most popular': 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30',
  'Border crossing': 'bg-sky-400/15 text-sky-300 ring-sky-400/30',
  Domestic: 'bg-violet-400/15 text-violet-300 ring-violet-400/30',
}

export function getTransferTagStyle(tag: string) {
  return tagStyles[tag] ?? 'bg-slate-400/15 text-slate-300 ring-slate-400/30'
}
