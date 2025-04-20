import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata = {
  title: "InkVeil",
  description: "A minimal, emotion-aware daily diary",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white text-black`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-black/10 py-4">
              <div className="container mx-auto px-4">
                <h1 className="font-serif text-2xl font-light tracking-tight">InkVeil</h1>
              </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
