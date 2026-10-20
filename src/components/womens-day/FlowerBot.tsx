export default function FlowerBot({ cool, waving }: { cool: boolean; waving: boolean }) {
  return <svg className={`wd-bot ${waving ? 'wd-bot-waving' : ''}`} viewBox="0 0 150 160" fill="none" aria-hidden="true">
    <path d="M67 27V15" stroke="#45253D" strokeWidth="4"/><circle cx="67" cy="10" r="6" fill="#F6ABC4"/>
    <rect x="28" y="29" width="78" height="65" rx="22" fill="#EFE0F8" stroke="#45253D" strokeWidth="3"/>
    <rect x="38" y="42" width="58" height="36" rx="12" fill="#FFF8F0"/>
    {cool ? <g fill="#45253D"><path d="M39 47h24v17H43ZM71 47h24l-4 17H71Z"/><path d="M60 49h14v5H60Z"/></g>
      : <g fill="#45253D"><circle cx="53" cy="54" r="4"/><circle cx="81" cy="54" r="4"/></g>}
    <path d="M59 70q8 6 16 0" stroke="#45253D" strokeWidth="3" strokeLinecap="round"/>
    <rect x="42" y="99" width="50" height="34" rx="10" fill="#F6ABC4" stroke="#45253D" strokeWidth="3"/>
    <path d="m42 108-19 12M52 135v13M82 135v13" stroke="#45253D" strokeWidth="6" strokeLinecap="round"/>
    <g className="wd-bot-arm"><path d="m94 109 20-15 1-22" stroke="#45253D" strokeWidth="6" strokeLinecap="round"/><path d="m115 80 9-29" stroke="#7B9B72" strokeWidth="4"/><path d="M111 44q-5-17 9-12l6 8 9-9q14 9-3 23-15 10-21-10" fill="#F6ABC4" stroke="#45253D" strokeWidth="2"/></g>
    <path d="m61 112 6 9 7-9" stroke="#FFF8F0" strokeWidth="3"/>
  </svg>;
}
