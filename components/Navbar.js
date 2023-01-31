import Link from 'next/link'


const Navbar = () => {
    return (
        <nav className=" p-4 flex justify-between items-center max-w-800 ">
            <div className='relative '>
                <div className='absolute inset-1 bg-red-400 rounded-sm blur-xl'></div>
                <div className="relative flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-900">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>


                        
                    <Link href="/">
                       <h1 className="ml-1 font-semibold font-sans-serif text-red-800">readingmood</h1>
                    </Link>
                </div>
            </div>
                
                <div className='relative'>
                    <div className='absolute inset-1 bg-red-400 rounded-sm blur-xl text- white'>
                    </div>                    
                    <button 
                    type="submit" 
                    className={`relative float-right  hidden hover:bg-red-900 hover:text-red-200 hover:-translate-y-0.5 transform transition duration-300 ease-in-out font-medium py-1  px-2 rounded-md  border-blue-500 -z-5  `}
                    >
                      Sing In
                    </button>
                    </div>
                </nav>
    )
}

export default Navbar