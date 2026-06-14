'use client'

import { useState, type FormEvent } from 'react'
import { useCreateLeague } from '@/lib/queries'
import Modal from './Modal'
import FadeIn from './FadeIn'

interface CreateLeagueModalProps {
  poolSlug: string
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function CreateLeagueModal({ poolSlug, open, onClose, onCreated }: CreateLeagueModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const createMutation = useCreateLeague()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    try {
      await createMutation.mutateAsync({ poolSlug, name: name.trim() })
      setName('')
      onCreated()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar liga')
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black-lance">Criar Liga</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer border-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Nome da liga</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Liga dos Amigos"
            className="w-full px-3 py-2.5 rounded-lg border border-line text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-green focus:ring-1 focus:ring-green/20 outline-none"
            autoFocus
            maxLength={60}
          />
        </div>

        <FadeIn show={!!error}>
          <p className="text-sm font-medium text-red-widget bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        </FadeIn>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!name.trim() || createMutation.isPending}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            {createMutation.isPending ? 'Criando...' : 'Criar Liga'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
