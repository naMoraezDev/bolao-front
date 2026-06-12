'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Bolões', href: '/pools' },
  { label: 'Ligas Públicas', href: '/leagues' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line shadow-sm">
      <div className="max-w-[1340px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">L</span>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-black-lance leading-tight">
              Lance!
            </span>
            <span className="font-display text-lg text-green font-bold leading-tight ml-0.5">
              Bolão
            </span>
          </div>
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
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600 truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-line text-sm font-medium rounded-normal hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover active:bg-green-active transition-colors cursor-pointer border-none"
            >
              Entrar
            </button>
          )}
          <button className="inline-flex items-center justify-center w-10 h-10 rounded-normal text-gray-500 hover:bg-gray-200 transition-colors md:hidden cursor-pointer border-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
