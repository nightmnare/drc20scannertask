import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Transition } from '@headlessui/react'
import { WalletIcon } from '@heroicons/react/24/outline'
import { setAddressAction, setBalanceAction } from '@/store/actions'

export default function ConnectWallet() {
  const dispatch = useDispatch()

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)

  const walletState = useSelector((RootState) => RootState.wallet)

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const connect = async () => {
    if (!window.unielon) {
      alert('Unielon wallet is not installed.')
    } else {
      const accounts = await window.unielon.requestAccounts()
      setAccount(accounts[0])
      dispatch(setAddressAction(accounts[0]))

      const { total } = await window.unielon.getBalance()
      setBalance(total)
      dispatch(setBalanceAction(total))
    }
  }

  const disconnect = () => {
    setAccount(null)
    dispatch(setAddressAction(null))
    dispatch(setBalanceAction(0))
  }

  const truncateAddress = () => {
    const newAddress = account.slice(0, 5) + '...' + account.slice(-5)
    return newAddress
  }

  useEffect(() => {
    if (walletState.account) connect()
  }, [walletState])

  if (account) {
    return (
      <Menu as='div' className='relative ml-2'>
        <div>
          <Menu.Button className='bg-orange-500 rounded py-1 px-2 text-white'>
            <span className='sr-only'>Open user menu</span>
            <p className='flex items-center'>
              <WalletIcon className='block h-5 w-5 mr-1' aria-hidden='true' />
              {truncateAddress()}
            </p>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 border dark:border-gray-700'>
            <Menu.Item>
              <span
                className={classNames(
                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 cursor-pointer'
                )}
              >
                Balance: {balance} DOGE
              </span>
            </Menu.Item>
            <Menu.Item>
              <span
                className={classNames(
                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 cursor-pointer'
                )}
                onClick={disconnect}
              >
                Disconnect
              </span>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    )
  } else {
    return (
      <button
        className='bg-orange-500 rounded py-1 px-2 text-white ml-2'
        onClick={connect}
      >
        <p className='flex items-center'>
          <WalletIcon className='block h-5 w-5 mr-1' aria-hidden='true' />
          Connect wallet
        </p>
      </button>
    )
  }
}
