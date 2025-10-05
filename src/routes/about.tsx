export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full select-none">
      <h1 className='font-black md:text-8xl text-6xl text-primary-dark select-none mt-[25%] mb-2 md:mb-4'>
        About
      </h1>
      <p className="text-center text-lg md:text-xl max-w-4xl px-4 font-semibold">
        <b className="text-primary">BioIndex</b> is a search tool and knowledge engine for space biology research. It is designed to help researchers, students, and enthusiasts find relevant information quickly and easily. It was developed during the 2025 <a target="_blank" href="https://www.spaceappschallenge.org/" className="text-primary underline">Nasa Space Apps Challenge</a> by <a className="text-primary underline" href="https://github.com/nasARC" target="_blank">team nasARC</a>.
      </p>
    </div>
  )
}
