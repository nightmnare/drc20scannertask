import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Head from 'next/head'
import ReactPaginate from 'react-paginate'

export default function Scanner() {
  const [balances, setBalances] = useState([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 20

  const endOffset = itemOffset + itemsPerPage

  const currentItems = balances.slice(itemOffset, endOffset)

  const pageCount = Math.ceil(balances.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % balances.length
    setItemOffset(newOffset)
  }

  const checkBalance = async () => {
    setBalances([])
    setLoading(true)
    setShowResult(false)
    const apiUrl = 'https://unielon.com/v3/drc20/address'
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_address: address,
        limit: 1000,
        offset: 0,
      }),
    }

    try {
      const response = await fetch(apiUrl, options)
      const result = await response.json()
      if (result.code === 200 && result.data) {
        setBalances(result.data)
      }
      setLoading(false)
      setShowResult(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <main className={`bg-gray-100 dark:bg-gray-900 h-screen`}>
      <Head>
        <title>Drc20 - Scanner</title>
        <meta name='description' content='Drc20 token scanner.' />
      </Head>
      <Header />
      <div className='p-3'>
        <h1 className='text-3xl mt-10 text-center mb-5'>
          Check your Drc-20 balances
        </h1>

        <div className='max-w-[1000px] m-auto bg-white dark:bg-gray-800 px-3 py-5 rounded shadow-lg'>
          <div className='flex items-center relative'>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='rounded bg-white text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-5 pr-20 w-full'
              placeholder='Address'
            />

            <button
              className='rounded bg-orange-600 px-2 py-1 text-white absolute right-2'
              onClick={checkBalance}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Check'}
            </button>
          </div>

          <div className='flex flex-wrap mt-5'>
            {currentItems.length === 0 ? (
              <>
                {showResult ? (
                  <p className='text-center block w-full'>No data</p>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {currentItems.map((item, index) => {
                  return (
                    <div key={index} className='w-full md:w-6/12 px-3 py-1'>
                      <div className='border p-3 rounded dark:border-gray-600'>
                        <p>
                          Token name:{' '}
                          <Link
                            href={`/drc20/${item.tick}`}
                            className='font-bold text-orange-500'
                          >
                            {item.tick}
                          </Link>
                        </p>
                        <p>
                          Mint amount:{' '}
                          <span className='font-bold'>{item.amt}</span>
                        </p>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>

          <div>
            <ReactPaginate
              breakLabel='...'
              nextLabel='>'
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={pageCount}
              previousLabel='<'
              renderOnZeroPageCount={null}
              className='pagination'
            />
          </div>
        </div>
      </div>
    </main>
  )
}
