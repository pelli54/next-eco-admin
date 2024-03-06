import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import SessionWrapper from '@/components/SessionWrapper'
import { Toaster } from '@/components/ui/sonner'
export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
    title: 'Simple Shop with Admin Panel',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider
                    attribute="class"
                    enableSystem
                    disableTransitionOnChange
                    defaultTheme="dark"
                >
                    <SessionWrapper>
                        <div>{children}</div>
                        <Toaster/>
                    </SessionWrapper>
                </ThemeProvider>
            </body>
        </html>
    )
}
