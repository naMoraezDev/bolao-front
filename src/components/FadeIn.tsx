'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  show: boolean
  children: ReactNode
  className?: string
}

export default function FadeIn({ show, children, className = '' }: FadeInProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="fade-content"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
