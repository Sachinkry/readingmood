import Head from 'next/head'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'

export default function Home() {
  return (
    <div className=''>
      {/* Header section */}
      <Head>
        <title>readingmood</title>
        <meta name='description' content='Home Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Main body */}
      <div className='min-h-screen max-w-2xl mx-auto'>
        
        <Navbar />
        <SearchBar />
      </div>
    </div>
  )
}
