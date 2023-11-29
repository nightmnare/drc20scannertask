import Header from '@/components/header'
import PriceTable from '@/components/priceTable'
import Footer from '@/components/footer'
import Head from 'next/head'

export default function Home() {
  return (
    <main className='bg-gray-100 dark:bg-gray-900'>
      <Head>
        <title>DRC-20 scanner</title>
        <meta name='description' content='DRC-20 token scanner website' />
      </Head>
      <Header />
      <PriceTable />
      <Footer />
    </main>
  )
}
