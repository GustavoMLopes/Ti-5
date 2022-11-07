import type { AppProps } from 'next/app'
import GlobalStyle, { fontFaceRules } from '../components/GlobalStyle.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}
