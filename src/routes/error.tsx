export default function ErrorPage () {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-2">
      <h1 className='font-black md:text-8xl text-5xl text-primary-dark select-none text-center'>
        Oops!
      </h1>
      <h2 className="font-semibold md:text-6xl text-3xl text-white select-none text-center">It appears the page you are looking for does not exist.</h2>
    </div>
  )
}
