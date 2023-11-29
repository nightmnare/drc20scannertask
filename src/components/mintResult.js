import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'

export default function MintResult({ searchResult, receiveAddress }) {
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 20

  const endOffset = itemOffset + itemsPerPage

  const currentItems = searchResult.slice(itemOffset, endOffset)

  const pageCount = Math.ceil(searchResult.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % searchResult.length
    setItemOffset(newOffset)
  }

  return (
    <div className='search-result px-3'>
      <div className='bg-white mt-5 rounded-md p-3 shadow-lg dark:bg-transparent'>
        <p className='text-xl px-3 mb-2'>
          Address{' '}
          <span className='text-orange-500 font-bold'>{receiveAddress}</span>{' '}
          mint results:
        </p>
        <div className='flex flex-wrap'>
          {currentItems.map((result, index) => {
            return (
              <div key={index} className='w-full md:w-6/12 px-3 py-1'>
                <div className='border p-3 rounded dark:border-gray-600'>
                  <p>
                    Token name:{' '}
                    <Link
                      href={`/drc20/${result.tick}`}
                      className='font-bold text-orange-500'
                    >
                      {result.tick}
                    </Link>{' '}
                  </p>
                  <p>
                    Mint amount: <span className='font-bold'>{result.amt}</span>{' '}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

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
  )
}
