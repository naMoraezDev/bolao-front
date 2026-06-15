'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Bolões', href: '/bolao' },
  { label: 'Ligas Públicas', href: '/ligas' },
]

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line shadow-sm">
      <div className="max-w-[1340px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center no-underline">
          <img
            src="https://lncimg.lance.com.br/cdn-cgi/image/width=168,height=64,quality=75,fit=pad,format=webp,background=transparent/uploads/2026/06/Logo_Lance-Copa-do-Mundo.png"
            alt="Lance!"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-normal text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-green-cover-bg text-green'
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-green-cover-bg flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-green/10 hover:ring-green/30 transition-all cursor-pointer border-none"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-green">
                    {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-52 bg-white rounded-xl border border-line shadow-lg py-2 z-50 origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-sm font-semibold text-gray-500 truncate">
                        {user.displayName ?? 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {user.email ?? ''}
                      </p>
                    </div>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-widget hover:bg-red-50 transition-colors cursor-pointer border-none"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 13H3.5C2.7 13 2 12.3 2 11.5V4.5C2 3.7 2.7 3 3.5 3H6M10.5 11L13.5 8L10.5 5M13.5 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover active:bg-green-active transition-colors cursor-pointer border-none"
            >
              Entrar
            </button>
          )}
          <button
            onClick={() => { setMobileNavOpen(!mobileNavOpen); setUserMenuOpen(false) }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-normal text-gray-500 hover:bg-gray-200 transition-colors md:hidden cursor-pointer border-none"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-line overflow-hidden md:hidden"
          >
            <div className="max-w-[1340px] mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`px-4 py-2.5 rounded-normal text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? 'bg-green-cover-bg text-green'
                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {!user && !loading && (
                <Link
                  href="/auth"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-2.5 rounded-normal text-sm font-medium text-green bg-green-cover-bg hover:bg-green hover:text-white transition-colors no-underline mt-1"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
