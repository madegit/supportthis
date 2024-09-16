import { SessionProvider } from 'next-auth/react'
import { CreatorProvider } from '../contexts/CreatorContext'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CreatorProvider>
        <Component {...pageProps} />
      </CreatorProvider>
    </SessionProvider>
  )
}

export default MyApp