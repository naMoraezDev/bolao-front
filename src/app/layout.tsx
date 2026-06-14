import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/contexts/auth"
import { QueryProvider } from "@/lib/query-provider"

export const metadata: Metadata = {
  title: "Lance! Bolão - Aposte e Ganhe",
  description: "Plataforma de bolão de campeonatos de futebol do Lance!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
