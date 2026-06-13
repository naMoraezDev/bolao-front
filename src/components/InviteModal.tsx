'use client'

import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api'

interface InviteModalProps {
  leagueSlug: string
  open: boolean
  onClose: () => void
}

export default function InviteModal({ leagueSlug, open, onClose }: InviteModalProps) {
  const [invite, setInvite] = useState<{ code: string; expiresAt: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLParagraphElement>(null)

  const generate = useCallback(async () => {
    setLoading(true)
    setError('')
    setCopied(false)
    try {
      const data = await api.leagues.createInvite(leagueSlug)
      setInvite(data)
    } catch (err: any) {
      setError(err?.message || 'Erro ao gerar convite')
    } finally {
      setLoading(false)
    }
  }, [leagueSlug])

  const copyCode = useCallback(async () => {
    if (!invite?.code) return
    try {
      await navigator.clipboard.writeText(invite.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const range = document.createRange()
      range.selectNodeContents(codeRef.current!)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [invite])

  const copyUrl = useCallback(async () => {
    const url = `${window.location.origin}/leagues/join?code=${invite?.code ?? ''}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [invite])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-line w-full max-w-md p-0 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-black-lance">Convidar Participantes</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer border-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Initial state */}
        {!invite && !loading && !error && (
          <div className="px-6 pb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-cover-bg flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-[280px] mx-auto leading-relaxed">
              Gere um código de convite e compartilhe com quem você quiser. O código é válido por tempo limitado.
            </p>
            <button
              onClick={generate}
              className="px-8 py-3 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors cursor-pointer border-none"
            >
              Gerar Código
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="px-6 pb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-cover-bg flex items-center justify-center mx-auto mb-4">
              <div className="w-5 h-5 rounded-full border-2 border-green/30 border-t-green animate-spin" />
            </div>
            <p className="text-sm text-gray-400">Gerando convite...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-6 pb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-red-widget">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6.5V10.5M10 13V13.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-widget mb-5">{error}</p>
            <button
              onClick={generate}
              className="px-6 py-2.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Code generated */}
        {invite && (
          <div>
            {/* Code box */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-b from-green-cover-bg to-green-cover-btn rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-green" />
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-green" />
                </div>

                <p className="text-[10px] font-semibold text-green uppercase tracking-widest mb-3 relative">
                  Código de convite
                </p>

                <p
                  ref={codeRef}
                  className="text-4xl font-black text-green tracking-[0.25em] select-all relative mb-3"
                >
                  {invite.code}
                </p>

                <div className="flex items-center justify-center gap-2 relative">
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green text-white text-xs font-semibold hover:bg-green-hover transition-colors cursor-pointer border-none"
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M11.5 4L5.5 10L2.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="3" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                          <path d="M10 5V4C10 2.89543 9.10457 2 8 2H4C2.89543 2 2 2.89543 2 4V8C2 9.10457 2.89543 10 4 10H5" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                        Copiar código
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-300 text-center mt-3">
                Válido até {new Date(invite.expiresAt).toLocaleDateString('pt-BR')} &middot; Compartilhe o código com os participantes
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-line mx-6" />

            {/* Share link */}
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Link de convite</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/join?code=${invite.code}`}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-line text-xs text-gray-400 bg-gray-50 outline-none select-all"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={copyUrl}
                  className="px-4 py-2.5 rounded-lg border border-line text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Copiar link
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <button
                onClick={generate}
                className="w-full py-2.5 rounded-lg border border-dashed border-gray-300 text-sm font-semibold text-gray-400 hover:text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Gerar novo código
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
