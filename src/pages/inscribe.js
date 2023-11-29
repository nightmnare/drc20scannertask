import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import Header from '@/components/header'
import { QRCode } from 'react-qrcode-logo'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { useSnackbar } from 'notistack'

export default function Inscribe() {
  const [callType, setCallType] = useState('deploy')
  const [tickName, settickName] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [mintLimit, setMintLimit] = useState('')
  const [tickExist, setTickExist] = useState(false)
  const [orderDetail, setOrderDetail] = useState(null)
  const [payAmount, setPayAmount] = useState(100.5)
  const [deployError, setDeployError] = useState('')
  const [tokenDetail, setTokenDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  const walletState = useSelector((RootState) => RootState.wallet)

  const { enqueueSnackbar } = useSnackbar()

  const commonOption = {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
  }

  const fetchData = async () => {
    const options = {
      ...commonOption,
      body: JSON.stringify({
        tick: tickName,
      }),
    }

    try {
      const response = await fetch(`https://unielon.com/v3/drc20/tick`, options)
      const result = await response.json()

      return result
    } catch (error) {}
  }

  const checkTickName = async () => {
    const result = await fetchData()
    if (result.code === 200 && result.data && result.data.tick === tickName) {
      setTickExist(true)
    }
  }

  const checkToken = async () => {
    const result = await fetchData()
    if (result.code === 200 && result.data) {
      setTokenDetail(result.data)
    }
  }

  const payOrder = async () => {
    const rate_fee = orderDetail.rate_fee
    const to_address = orderDetail.fee_address

    const amount = callType === 'mint' ? 100000000 : 10050000000

    try {
      const result = await window.unielon.sendDogecoin(to_address, amount, {
        feeRate: rate_fee,
        type: 'mint',
      })

      if (result) {
        enqueueSnackbar('Payment confirmed successfully.', {
          variant: 'info',
          autoHideDuration: 5000,
          style: {
            backgroundColor: '#202946',
          },
        })

        cancelOrder()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeMintAmount = (value) => {
    if (value < 0) return false
    if (Number(value) > tokenDetail.lim) return false
    if (tokenDetail.max_amt === tokenDetail.mint_amt) return false

    setMintAmount(value)
  }

  const mintToken = async () => {
    setLoading(true)
    const url = 'https://unielon.com/v3/drc20/new'
    const options = {
      ...commonOption,
      body: JSON.stringify({
        amt: mintAmount,
        op: 'mint',
        p: 'drc-20',
        tick: tickName,
        receive_address: walletState.account,
        repeat: 1,
      }),
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()

      if (result.code === 200 && result.data) {
        setOrderDetail(result.data)
      } else if (result.code === 500) {
        alert(result.msg)
      }
    } catch (error) {}

    setLoading(false)
  }

  const deployToken = async () => {
    setLoading(true)
    const url = 'https://unielon.com/v3/drc20/new'
    const options = {
      ...commonOption,
      body: JSON.stringify({
        tick: tickName,
        lim: mintLimit,
        max: totalSupply,
        op: 'deploy',
        p: 'drc-20',
        receive_address: walletState.account,
      }),
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()

      if (result.code === 200 && result.data) {
        setOrderDetail(result.data)
      } else if (result.code === 500) {
        setDeployError(result.msg)
      }
    } catch (error) {}

    setLoading(false)
  }

  const cancelOrder = () => {
    setOrderDetail(null)
    settickName('')
    setMintAmount('')
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleTypeChange = (e) => {
    setCallType(e.currentTarget.value)
  }

  useEffect(() => {
    if (callType === 'mint') setPayAmount(1)
    else setPayAmount(100.5)
  }, [callType])

  useEffect(() => {
    setTickExist(false)
    setTokenDetail(null)
    if (tickName.length > 2 && callType === 'deploy') {
      checkTickName()
    }

    if (tickName.length > 2 && callType === 'mint') {
      checkToken()
    }
  }, [tickName])

  useEffect(() => {
    setDeployError('')
  }, [mintLimit])

  return (
    <main className='bg-gray-100 dark:bg-gray-900 h-screen'>
      <Head>
        <title>Drc20 - Inscribe</title>
        <meta name='description' content='Drc20 token inscribe.' />
      </Head>
      <Header />

      <div className='p-3'>
        <h1 className='text-5xl mt-10 text-center mb-5'>
          {'Inscribe Drc-20 token'}
        </h1>

        <div className='max-w-[700px] bg-white dark:bg-gray-800 m-auto mt-5 p-5 rounded shadow-md text-center'>
          {orderDetail ? (
            <div className='relative'>
              <XCircleIcon
                className='block h-7 w-7 absolute z-10 text-orange-600 absolute top-0 right-0 cursor-pointer'
                aria-hidden='true'
                onClick={cancelOrder}
              />
              <h2 className='text-2xl font-bold text-orange-600'>
                Confirm payment:
              </h2>

              {callType === 'mint' ? (
                <p className='bg-gray-300 table m-auto p-2 rounded mt-2 dark:bg-gray-900 dark:text-white'>
                  {`{"p":"drc-20", "op":"mint", "tick":"${tickName}", "amt":${mintAmount},}`}
                </p>
              ) : (
                <p className='bg-gray-300 table m-auto p-2 rounded mt-2 dark:bg-gray-900 dark:text-white'>
                  {`{"p":"drc-20", "op":"deploy", "tick":"${tickName}", "max":${totalSupply}, "lim":${mintLimit}}`}
                </p>
              )}

              <div className='flex mt-5'>
                <div className='w-4/12 border-r'>
                  <p>Total</p>
                  <p>100.5</p>
                </div>

                <div className='w-4/12'>
                  <p>FreeRate</p>
                  <p>0.5</p>
                </div>

                <div className='w-4/12 border-l'>
                  <p>ServiceFee</p>
                  <p>100</p>
                </div>
              </div>

              <div className='mt-5'>
                <p className='text-orange-600 font-bold'>Scan QR code to pay</p>

                <div className='flex justify-center'>
                  <QRCode
                    value={orderDetail.fee_address}
                    logoWidth={50}
                    logoHeight={50}
                  />
                </div>
                <p>{orderDetail.fee_address}</p>
              </div>

              <button
                className='mt-5 px-2 py-1 bg-orange-600 rounded text-white disabled:bg-gray-600 disabled:text-red-500'
                disabled={payAmount > walletState.balance}
                onClick={payOrder}
              >
                {payAmount > walletState.balance
                  ? 'Insufficient balance.'
                  : 'Pay with wallet'}
              </button>
            </div>
          ) : (
            <>
              <div className='flex justify-center gap-12 mb-10'>
                <p className='flex items-center'>
                  <label
                    htmlFor='mint'
                    className={classNames(
                      'cursor-pointer',
                      callType === 'mint' ? 'text-orange-600' : ''
                    )}
                  >
                    Mint
                  </label>
                  <input
                    type='radio'
                    value='mint'
                    id='mint'
                    className={classNames(
                      'h-4 w-4 text-indigo-600 ml-2 focus:ring-orange-600 cursor-pointer',
                      callType === 'mint' ? 'text-orange-600' : ''
                    )}
                    checked={callType === 'mint'}
                    onChange={handleTypeChange}
                  />
                </p>

                <p className='flex items-center'>
                  <label
                    htmlFor='deploy'
                    className={classNames(
                      'cursor-pointer',
                      callType === 'deploy' ? 'text-orange-600' : ''
                    )}
                  >
                    Deploy
                  </label>
                  <input
                    type='radio'
                    value='deploy'
                    id='deploy'
                    className={classNames(
                      'h-4 w-4 text-indigo-600 ml-2 focus:ring-orange-600 cursor-pointer',
                      callType === 'deploy' ? 'text-orange-600' : ''
                    )}
                    checked={callType === 'deploy'}
                    onChange={handleTypeChange}
                  />
                </p>
              </div>

              {callType === 'mint' ? (
                <div className='mint-form'>
                  <div className='flex items-center'>
                    <div className='w-3/12 md:w-2/12'>
                      <label htmlFor='tickName' className='cursor-pointer'>
                        Tick:
                      </label>
                    </div>

                    <div className='w-9/12 md:w-10/12'>
                      <input
                        type='text'
                        maxLength={4}
                        id='tickName'
                        value={tickName}
                        onChange={(e) => settickName(e.target.value)}
                        className='w-full rounded block flex-1 dark:border-0 py-1.5 px-3 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-gray-800'
                        placeholder='3-4 characters like abcd...'
                      />
                    </div>
                  </div>

                  <div className='flex items-center mt-7'>
                    <div className='w-3/12 md:w-2/12'>
                      <label htmlFor='amount' className='cursor-pointer'>
                        Amount:
                      </label>
                    </div>

                    <div className='w-9/12 md:w-10/12'>
                      <input
                        type='number'
                        id='amount'
                        value={mintAmount}
                        onChange={(e) => changeMintAmount(e.target.value)}
                        className='w-full rounded block flex-1 dark:border-0 py-1.5 px-3 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-gray-800'
                        placeholder='Mint amount.'
                        disabled={!tokenDetail}
                      />
                    </div>
                  </div>

                  {tokenDetail && (
                    <div className='flex items-center mt-7'>
                      <div className='w-3/12 md:w-2/12'></div>
                      <div className='w-9/12 md:w-10/12 text-left'>
                        <p>
                          <span className='font-bold'>Total Supply:</span>{' '}
                          {tokenDetail.max_amt}
                        </p>
                        <p>
                          <span className='font-bold'>Minted Amount:</span>{' '}
                          {tokenDetail.mint_amt}
                        </p>
                        <p>
                          <span className='font-bold'>Mint Limit:</span>{' '}
                          {tokenDetail.lim}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='text-center'>
                    <button
                      className='bg-orange-500 px-2 py-1 rounded mt-5 text-white disabled:bg-gray-400'
                      disabled={
                        !walletState.account ||
                        !tokenDetail ||
                        mintAmount <= 0 ||
                        loading
                      }
                      onClick={mintToken}
                    >
                      {loading ? (
                        <>Loading...</>
                      ) : (
                        <>{walletState.account ? 'Next' : 'Connect Wallet'}</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className='deploy-form'>
                  <div className='flex items-center flex-wrap'>
                    <div className='w-3/12 md:w-2/12'>
                      <label htmlFor='tickName' className='cursor-pointer'>
                        Tick:
                      </label>
                    </div>

                    <div className='w-9/12 md:w-10/12'>
                      <input
                        type='text'
                        id='tickName'
                        maxLength={4}
                        value={tickName}
                        onChange={(e) => settickName(e.target.value)}
                        className='w-full rounded block flex-1 dark:border-0 py-1.5 px-3 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-gray-800'
                        placeholder='3-4 characters like abcd...'
                      />
                    </div>
                    <div className='w-3/12 md:w-2/12'></div>
                    <div className='w-9/12 md:w-10/12'>
                      {tickExist && (
                        <p className='block text-sm text-orange-600'>
                          The tick already exists.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center mt-7'>
                    <div className='w-3/12 md:w-2/12'>
                      <label htmlFor='totalSupply' className='cursor-pointer'>
                        Total Supply:
                      </label>
                    </div>

                    <div className='w-9/12 md:w-10/12'>
                      <input
                        type='number'
                        id='totalSupply'
                        value={totalSupply}
                        onChange={(e) => setTotalSupply(e.target.value)}
                        className='w-full rounded block flex-1 dark:border-0 py-1.5 px-3 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-gray-800'
                        placeholder='Total Supply amount.'
                      />
                    </div>
                  </div>

                  <div className='flex items-center mt-7 flex-wrap'>
                    <div className='w-3/12 md:w-2/12'>
                      <label htmlFor='limitAmount' className='cursor-pointer'>
                        Mint Limit:
                      </label>
                    </div>

                    <div className='w-9/12 md:w-10/12'>
                      <input
                        type='number'
                        id='limitAmount'
                        value={mintLimit}
                        onChange={(e) => setMintLimit(e.target.value)}
                        className='w-full rounded block flex-1 dark:border-0 py-1.5 px-3 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-gray-800'
                        placeholder='Limit amount.'
                      />
                    </div>
                    <div className='w-3/12 md:w-2/12'></div>
                    <div className='w-9/12 md:w-10/12'>
                      {deployError && (
                        <p className='block text-sm text-orange-600 text-left'>
                          {deployError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='text-center'>
                    <button
                      className='bg-orange-500 px-2 py-1 rounded mt-5 text-white disabled:bg-gray-400'
                      disabled={tickExist || !walletState.account || loading}
                      onClick={deployToken}
                    >
                      {loading ? (
                        <>Loading...</>
                      ) : (
                        <>{walletState.account ? 'Next' : 'Connect Wallet'}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
