import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="font-display text-[7rem] md:text-[9rem] font-extrabold text-green leading-none tracking-tighter select-none">
            404
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-1 h-1 rounded-full bg-green" />
            <div className="w-8 h-0.5 rounded-full bg-green/30" />
            <div className="w-1 h-1 rounded-full bg-green" />
            <div className="w-8 h-0.5 rounded-full bg-green/30" />
            <div className="w-1 h-1 rounded-full bg-green" />
            <div className="w-8 h-0.5 rounded-full bg-green/30" />
            <div className="w-1 h-1 rounded-full bg-green" />
          </div>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-black-lance mb-3">
          Foi por pouco!
        </h1>

        <p className="text-gray-300 text-base leading-relaxed mb-8">
          A página que você procura não existe ou foi movida de lugar.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white font-semibold rounded-xl hover:bg-green-hover transition-colors no-underline shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar ao início
          </Link>
          <Link
            href="/bolao"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-500 font-semibold rounded-xl border border-line hover:border-green/30 hover:text-green transition-colors no-underline"
          >
            Ver bolões
          </Link>
        </div>
      </div>
    </div>
  )
}
