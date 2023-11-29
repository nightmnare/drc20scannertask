import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactPaginate from 'react-paginate'
import MintProgress from './progress'
import TokenAvatar from './tokenAvatar'
import moment from 'moment'
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from '@heroicons/react/24/outline'

export default function PriceTable() {
  const [tokenLists, setTokenLists] = useState([])
  const [itemOffset, setItemOffset] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentItems, setCurrentItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [dailyInfo, setDailyInfo] = useState({
    txs: 0,
    volumn: 0,
  })
  const [sortBy, setSortBy] = useState('deploy_time')
  const [sortDirection, setSortDirection] = useState('down')

  const itemsPerPage = 20

  const endOffset = itemOffset + itemsPerPage

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % tokenLists.length
    setItemOffset(newOffset)
  }

  const cancelSearch = () => {
    setSearchResult(false)
    setSearchValue('')
    setPageCount(Math.ceil(tokenLists.length / itemsPerPage))
    setCurrentItems(tokenLists.slice(itemOffset, endOffset))
  }

  const searchToken = () => {
    setLoading(true)
    const filteredLists = tokenLists.filter((token, index) => {
      return token.tick.includes(searchValue)
    })
    setPageCount(Math.ceil(filteredLists.length / itemsPerPage))
    setCurrentItems(filteredLists.slice(itemOffset, endOffset))
    setSearchResult(true)
    setLoading(false)
  }

  const dailyData = async () => {
    try {
      const dailyVolumnResponse = await fetch(
        `https://d20-api2.dogeord.io/ticks/dailyVolume`
      )
      const dailyVolumn = await dailyVolumnResponse.json()

      const dailyTxResponse = await fetch(
        `https://d20-api2.dogeord.io/ticks/dailyTransactions`
      )
      const dailyTx = await dailyTxResponse.json()

      setDailyInfo({
        txs: dailyTx,
        volumn: dailyVolumn,
      })
    } catch (error) {}
  }

  const fetchData = async () => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 1000,
        offset: 0,
      }),
    }

    try {
      const response = await fetch(`https://unielon.com/v3/drc20/all`, options)
      const result = await response.json()
      if (result.code === 200 && result.data) {
        setTokenLists(result.data)
      }
    } catch (error) {}
  }
  useEffect(() => {
    setPageCount(Math.ceil(tokenLists.length / itemsPerPage))
    setCurrentItems(tokenLists.slice(itemOffset, endOffset))
  }, [tokenLists, itemOffset, endOffset])

  useEffect(() => {
    const tempData = [...tokenLists]
    switch (sortBy) {
      case 'holders':
        tempData.sort((a, b) => b.holders - a.holders)
        break

      case 'name':
        tempData.sort((a, b) => {
          if (a.tick > b.tick) return 1
          else return -1
          return 0
        })
        break

      case 'deploy_time':
        tempData.sort((a, b) => b.deploy_time - a.deploy_time)
        break

      case 'progress':
        tempData.sort(
          (a, b) =>
            (b.mint_amt / b.max_amt) * 100 - (a.mint_amt / a.max_amt) * 100
        )
        break

      case 'txs':
        console.log('name sort')
        tempData.sort((a, b) => b.transactions - a.transactions)
        break

      default:
        break
    }

    if (sortDirection === 'up') tempData.reverse()

    setTokenLists(tempData)
  }, [sortBy])

  useEffect(() => {
    const tempData = [...tokenLists]
    tempData.reverse()
    setTokenLists(tempData)
  }, [sortDirection])

  useEffect(() => {
    dailyData()
    fetchData()
  }, [])

  return (
    <div className='main-content'>
      <div className='banner bg-gray-800 block md:flex flex-row-reverse	 justify-between items-center px-10 py-10 md:px-20 dark:bg-[#0a102f]'>
        <div className='mb-5 md:mb-0'>
          <Link
            href={
              'https://t.me/INFINITEBTC'
            }
          >
            <Image
              src={'/AD.png'}
              alt='ad image'
              width={200}
              height={200}
              className='m-auto'
            />
          </Link>
        </div>

        <div className='w-full'>
          <p className='text-white mb-2 text-2xl'>Explore DRC-20 tokens.</p>
          <div className='relative flex items-center md:w-[400px] lg:w-[600px]'>
            <input
              type='text'
              className='rounded bg-white py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 w-full pl-10 pr-28'
              placeholder='Token name'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <MagnifyingGlassIcon
              className='block h-5 w-5 absolute z-10 left-2 text-black'
              aria-hidden='true'
            />
            <button
              className='absolute right-2 bg-orange-500 text-white rounded px-2 py-1 text-sm'
              onClick={searchToken}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
            {searchResult && (
              <XCircleIcon
                className='block h-5 w-5 absolute z-10 right-20 text-black dark:text-white'
                aria-hidden='true'
                onClick={cancelSearch}
              />
            )}
          </div>
        </div>
      </div>

      <div className='px-3'>
        <div className='bg-white mt-5 rounded-md pt-0 pb-2 shadow-lg dark:bg-transparent'>
          <div className='p-3 flex items-center justify-end gap-2 text-sm'>
            <label htmlFor='sort'>Sort By:</label>
            <select
              name=''
              id='sort'
              className='block rounded-md border-0 ring-1 py-1.5 text-gray-900 shadow-sm text-sm'
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value='name'>Name</option>
              <option value='deploy_time'>Deploy Time</option>
              <option value='progress'>Progress</option>
              <option value='holders'>Holders</option>
              <option value='txs'>Transactions</option>
            </select>

            {sortDirection === 'up' ? (
              <BarsArrowUpIcon
                className='block h-5 w-5 text-black dark:text-white'
                aria-hidden='true'
                onClick={() => setSortDirection('down')}
              />
            ) : (
              <BarsArrowDownIcon
                className='block h-5 w-5 text-black dark:text-white'
                aria-hidden='true'
                onClick={() => setSortDirection('up')}
              />
            )}
          </div>
          <div className='pb-5 flex justify-center gap-10 text-sm'>
            <p className='text-center'>
              <span className='font-bold'>Daily transactions:</span>{' '}
              <span>{dailyInfo.txs}</span>
            </p>

            <p className='text-center'>
              <span className='font-bold'>Volumn 24h:</span>{' '}
              <span>${dailyInfo.volumn}</span>
            </p>
          </div>
          <div className='hidden md:flex justify-between md:mx-4 px-4 py-2 transition-all ease-linear duration-200 roundex-xl border-b border-t dark:border-gray-600'>
            <div className='md:min-w-[5%] min-w-[15%] font-bold'>#</div>
            <div className='md:min-w-[15%] min-w-[55%] font-bold text-orange-500'>
              Name
            </div>
            <div className='md:min-w-[20%] min-w-[30%] font-bold'>
              Depoly Time
            </div>
            <div className='md:min-w-[30%] md:block hidden font-bold'>
              Progress
            </div>
            <div className='md:min-w-[15%] md:block hidden font-bold'>
              Holders
            </div>
            <div className='md:min-w-[15%] md:block hidden font-bold'>
              Transactions
            </div>
          </div>

          {currentItems.length === 0 ? (
            <>
              {searchResult ? (
                <div className='text-xs flex justify-between items-center md:mx-4 px-4 py-4 transition-all ease-linear duration-200 roundex-xl border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 flex-wrap md:flex-nowrap'>
                  <p className='w-full block text-center font-lg'>No data</p>
                </div>
              ) : (
                <div className='animate-pulse pt-2 md:pt-0'>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                  <div className='h-12 bg-gray-200 rounded mx-4 my-4 dark:bg-gray-600'></div>
                </div>
              )}
            </>
          ) : (
            <>
              {currentItems.map((token, index) => {
                return (
                  <div
                    className='text-xs flex justify-between items-center md:mx-4 px-4 py-4 transition-all ease-linear duration-200 roundex-xl border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 flex-wrap md:flex-nowrap'
                    key={index}
                  >
                    <div className='md:w-auto md:min-w-[5%] font-bold hidden md:block'>
                      {itemOffset + index + 1}
                    </div>
                    <div className='w-6/12 md:w-auto sm:min-w-[30%] md:min-w-[15%] font-bold flex items-center mb-2 md:mb-0'>
                      <div className='flex justify-center items-center'>
                        <TokenAvatar name={token.tick} />
                        <Link href={`/drc20/${token.tick}`}>
                          <p className='text-orange-500 font-bold'>
                            {token.tick || '-'}
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className='w-6/12 md:w-auto md:min-w-[20%] font-bold mb-2 md:mb-0'>
                      {moment(token.deploy_time * 1000).format(
                        'MM/DD/YYYY hh:mm A'
                      )}
                    </div>
                    <div className='w-full md:w-auto md:min-w-[30%] font-bold pr-3 mb-2 md:mb-0'>
                      <MintProgress progress={token.mint_amt / token.max_amt} />
                    </div>
                    <div className='w-full sm:w-6/12 md:w-auto md:min-w-[15%] font-bold mb-2 md:mb-0'>
                      <span className='inline-block md:hidden'>Holders:</span>{' '}
                      {token.holders}
                    </div>
                    <div className='w-full sm:w-6/12 md:w-auto md:min-w-[15%] font-bold'>
                      <span className='inline-block md:hidden'>
                        Transactions:
                      </span>{' '}
                      {token.transactions}
                    </div>
                  </div>
                )
              })}
            </>
          )}

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
  )
}
