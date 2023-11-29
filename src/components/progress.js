export default function MintProgress(props) {
  const { progress } = props

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className='flex md:block items-center'>
      <div>
        <span className='block mr-2 w-max'>{(progress * 100).toFixed(3)}%</span>
      </div>
      <div className='h-[10px] w-full bg-gray-100 rounded-full relative'>
        <div
          className={classNames(
            progress === 1 ? 'bg-green-500' : 'bg-orange-500',
            'h-[10px] rounded-full absolute top-0'
          )}
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
