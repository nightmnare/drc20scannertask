import Head from 'next/head'
import Navbar from './navbar'

const Header = () => {
  return (
    <div>
      <Head>
        <meta property='og:url' content='https://drc20.xyz/' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='DRC20 Scanner' />
        <meta
          property='og:description'
          content='Live Index site for DRC20 tokens. See the live price, chart, Marketcap of DRC-20 Tokens.'
        />
        <meta
          property='og:image'
          content='https://drc20.xyz/logo.png'
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:domain' content='drc20-scanner.netlify.app' />
        <meta
          property='twitter:url'
          content='https://drc20-scanner.netlify.app/'
        />
        <meta name='twitter:title' content='DRC-20 scanner' />
        <meta
          name='twitter:description'
          content='DRC-20 token scanner website'
        />
        <meta
          name='twitter:image'
          content='https://drc20-scanner.netlify.app/logo.png'
        />

        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='1080' />
        <meta property='og:image:height' content='1080' />
        <meta property='og:image:alt' content='Logo' />
      </Head>
      <Navbar></Navbar>
    </div>
  )
}

export default Header
