import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/header'
import moment from 'moment'
import MintProgress from '@/components/progress'
import {
  CpuChipIcon,
  UserCircleIcon,
  UserGroupIcon,
  CircleStackIcon,
  BanknotesIcon,
  ClockIcon,
  CubeIcon,
  CubeTransparentIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'
import Footer from '@/components/footer'

export default function Tick() {
  const [tokenData, setTokenData] = useState(null)
  const router = useRouter()

  const tick = router.query.tick

  const fetchData = async () => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tick,
      }),
    }

    try {
      const response = await fetch(`https://unielon.com/v3/drc20/tick`, options)
      const result = await response.json()
      if (result.code === 200) {
        setTokenData(result.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className='bg-gray-100 dark:bg-gray-900'>
      <Head>
        <title>Drc20 - Token page</title>
        <meta name='description' content='Drc20 token scanner.' />
      </Head>
      <Header />

      <div className='px-3 main-content'>
        {tokenData ? (
          <div className='max-w-[1000px] bg-gray-200 rounded m-auto p-4 mt-10 text-sm dark:bg-gray-800 break-all'>
            <h2 className='text-lg mb-2'>
              <span className='text-2xl font-bold'>{tick}</span> Token details:
            </h2>
            <div className='bg-white p-2 border-b rounded-t dark:bg-gray-800 dark:border-gray-600'>
              <MintProgress progress={tokenData.mint_amt / tokenData.max_amt} />
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <CpuChipIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Inscription:</p>
                <p>{tokenData.inscription}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <CircleStackIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Supply:</p>
                <p>{tokenData.max_amt}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <CubeIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Minted:</p>
                <p>{tokenData.mint_amt}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <CubeTransparentIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Limit per mint:</p>
                <p>{tokenData.lim}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <CommandLineIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Decimal:</p>
                <p>{tokenData.dec}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <UserCircleIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Deploy By:</p>
                <p>{tokenData.deploy_by}</p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <ClockIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Last Deploy Time:</p>
                <p>
                  {moment(tokenData.deploy_time * 1000).format(
                    'MM/DD/YYYY hh:mm A'
                  )}
                </p>
              </div>
            </div>

            <div className='bg-white p-2 border-b flex items-center dark:bg-gray-800 dark:border-gray-600'>
              <UserGroupIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Holders:</p>
                <p>{tokenData.holders}</p>
              </div>
            </div>

            <div className='bg-white p-2 rounded-b flex items-center dark:bg-gray-800'>
              <BanknotesIcon
                className='h-5 w-5 z-10 text-black mr-2 dark:text-white min-w-[20px]'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold'>Total Transactions:</p>
                <p>{tokenData.transactions}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='animate-pulse max-w-[1000px] bg-gray-100 rounded m-auto p-4 mt-4 dark:bg-gray-800'>
            <div className='bg-gray-200 p-2 rounded-t h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 h-10 mb-2 dark:bg-gray-600'></div>
            <div className='bg-gray-200 p-2 rounded-b h-10 mb-2 dark:bg-gray-600'></div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
