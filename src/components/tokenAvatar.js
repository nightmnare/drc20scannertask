export default function TokenAvatar({ name }) {
  return (
    <div>
      <div className='h-[35px] w-[35px] rounded-full bg-gray-200 flex justify-center items-center text-lg mr-1 text-gray-800'>
        {name.charAt(0)}
      </div>
    </div>
  )
}
