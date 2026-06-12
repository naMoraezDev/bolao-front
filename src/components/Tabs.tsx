'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Tab {
  label: string
  value: string
  href: string
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 p-1 bg-gray-200 rounded-lg w-fit">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all no-underline ${
              isActive
                ? 'bg-white text-green shadow-sm'
                : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
