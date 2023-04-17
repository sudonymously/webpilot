import '@/styles/globals.css'
import "@/styles/editor.css"
import type { AppProps } from 'next/app'
import { CodeProvider } from '@/hooks/useCode'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CodeProvider>
        <Component {...pageProps} />
      </CodeProvider>
    </>
  )
}
