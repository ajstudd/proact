// import '../styles/global.css';
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { AppContextProvider } from '../contexts/AppContext';
import { store } from '../store';
import Layout from 'components/HomeLayout'
import { Provider } from 'react-redux';
import { Metadata } from 'next';
import { MainLayout } from 'components/Layout';
import '../../global.css'

const roboto = Roboto({

  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
  preload: true,
  subsets: ['latin-ext'],
  adjustFontFallback: true,
  fallback: ['sans-serif'],
})

export default function App({ Component, pageProps }: AppProps) {
  return <main
    className={roboto.className}
  >
    <Provider store={store}>
      <AppContextProvider>
        {/*can be used in future if want a sidebar or a fixed header and footer */}
        {/* <MainLayout> */}
        <Layout>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Layout>
        {/* </MainLayout> */}
      </AppContextProvider>
    </Provider>
  </main>
}


