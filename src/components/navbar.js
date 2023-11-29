import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ThemeChanger from './themeChanger'
import ConnectWallet from './connectWallet'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Scanner', href: '/scanner' },
  { name: 'Inscribe', href: '/inscribe' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [mounted, setMounted] = useState(false)

  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logo = theme === 'dark' ? '/logo-light.png' : '/logo.png'

  return (
    <Disclosure as='nav' className='bg-white shadow-md dark:bg-gray-800'>
      {({ open }) => (
        <>
          <div className='px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 right-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-gray-400'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center sm:items-stretch justify-start'>
                <Link href={'/'} className='flex flex-shrink-0 items-center'>
                  {mounted && (
                    <Image src={logo} width={50} height={50} alt='site logo' />
                  )}
                  <div>
                    <p className='text-orange-500 font-bold leading-4 text-lg'>
                      DRC20
                    </p>
                    <p className='font-bold leading-4'>Scanner</p>
                  </div>
                </Link>
                <div className='hidden sm:ml-6 sm:flex items-center'>
                  <div className='flex space-x-4'>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'text-orange-500'
                            : 'text-gray-800 dark:text-gray-300 dark:hover:text-orange-300',
                          'px-3 py-2 text-sm cursor-pointer font-bold uppercase hover:text-orange-300'
                        )}
                        aria-current={
                          pathname === item.href ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className='absolute inset-y-0 right-10 sm:right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                <ThemeChanger />
                <ConnectWallet />
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pb-3 pt-2'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'text-orange-500'
                      : 'text-gray-800 hover:bg-gray-700 hover:text-white dark:text-gray-300',
                    'block rounded-md px-3 py-2 text-base font-bold'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
