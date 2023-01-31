import { useState, useEffect, useRef } from "react"
import axios from 'axios'

const GOOGLE_BOOKS_API_KEY = 'AIzaSyD-jgUM3fUP92oEjYlYPQd0x7J3FZuNHCg'

const SearchBar = () => {
    const playlistRef = useRef([])
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isInputActive, setIsInputActive] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [playlist, setPlaylist] = useState([])
    const [videoIds, setVideoIds] = useState([])
    const [isOpen, setIsOpen] = useState(-1)
    const [isPlaying, setIsPlaying] = useState(false)
    const newPlaylist = []

    // a function to suggest book names using google books api while typing in the search bar
    const suggestSimilarBooks = async (value) => {
        
        try {
            // console.log("google books api", query)
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${value}&key=${GOOGLE_BOOKS_API_KEY}`)
            
            setSearchResults(response.data.items);
            // console.log("respnse......>>>>", response.data.items)
        } catch (error) {
            console.error("error-google-books api >>>>>>", error)
        }
    
    }

    // a function to call gpt-3 api to get songs that vibe with the book
    const handleSearchBtnClick = async (query) => {
        // setTimeout: a function to simulate the time taken to get songs from gpt3 api
        try {
            setIsGenerating(true)
            console.log("gpt-3-api-to-get...")
            const response = await axios.post('/api/generate-playlist', {query})
            const data = response.data;
            // setPlaylist(JSON.parse(data.basePromptOutput))
            
            console.log("done........")
            
            await handleSongIds(JSON.parse(data.basePromptOutput))
            

        } catch (error) {
            console.error("error-gpt-3-api >>>>>", error)
        }
        
    }

    const handleSongIds = async (playlist_gpt3) => {
        console.log("playlist_gpt3", playlist_gpt3)
        playlist_gpt3.map(song => {
            getYTubeSongIds(song.song, song.artist)
        })
        
    }

    // a function to get youtube song ids
    const getYTubeSongIds = async (song, artist) => {
        const response = await axios.get('/api/getYTsongIds', {params: {song, artist}})
        const videoId = response.data.videoId
        newPlaylist.push({
            "song": song,
            "artist": artist,
            "videoId":videoId
        })
        if(newPlaylist.length > 9){
            // setPlaylist(newPlaylist)
            playlistRef.current = newPlaylist
            console.log("newPlaylist:::::",newPlaylist)
            printPlaylist()
            setIsGenerating(false)
        }
    } 

    const printPlaylist =  () => {
        console.log("playlist", playlistRef.current)
        setPlaylist(playlistRef.current)
        console.log("playlist", playlist)
        // console.log("videoIds", videoIds)
    }

    const toggleView = (index) => {
        setIsOpen(index === isOpen ? -1: index)
    }
    

    // useEffect
    useEffect(() => {
        // if is of no use here 
        if(query.length > 5 && isInputActive)  {
            suggestSimilarBooks(query)
        }
        // console.log("playlist", playlist)

        
    }, [query])

    return (
        <div className=' flex flex-col items-center p-4  mt-3'>
        {/* Header */}

        <h1 className='text-3xl font-bold text-center mb-2.5 text-red-400'>Songs that vibe with books</h1>
        <h2 className="text-1.8xl text-center text-red-300/40">
                Experience the beauty and depth of literature through our curated songs
        </h2>
        
        <div  className="mx-auto  mt-4 w-full mx-3">
            <div className='relative'>
                <div className='absolute inset-1 bg-red-400 rounded-md blur-2xl text- white'>
                </div>
                <input 
                // add some dip to the input box when it is active

                    className='relative py-3 px-4 w-full  bg-black rounded-md leading-none flex border-none items-center text-red-200/90 text-sm focus:outline-none placeholder-red-200/20 shadow-lg'
                    type='text'
                    placeholder='Kafka on the shore by Haruki Murakami'
                    value ={query}
                    disabled={isGenerating}
                    onChange={e => {
                        setQuery(e.target.value);                       
                      }}
                    onFocus={() => setIsInputActive(true)}
                    // onBlur={() => setIsInputActive(false)}
                /> 
            </div>
        
            {searchResults && searchResults.length > 0 && (
              <div className={`scrollbar-thin ${isInputActive ? 'block': 'hidden'} z:index z-200` }id='search-result'>
                {searchResults.map((result, index) => (
                  index < 5 && (
                    <div 
                       key={index} 
                       className='w-full border border-red-300 p-2 rounded-md border-collapse truncate text-overflow-ellipsis cursor-pointer bg-red-200 hover:bg-red-500'
                       onClick={() => {                         
                          setQuery(`${result.volumeInfo.title} By ${result.volumeInfo.authors}`);
                          console.log(query)

                          setIsInputActive(false)
                          }
                       }
                    >
                       <div className='relative'>
                            <p className='absolute inset-1 bg-red100 rounded-md blur-xl text-white'></p>
                            <p className='truncate text-overflow-ellipsis text-red-900 '>{result.volumeInfo.title} By {result.volumeInfo.authors}</p>
                       </div>
                    </div>
                )))}
                </div>
            )}
            {searchResults &&  (   
                <button 
                    type="submit" 
                    className={`flex md:flex-row bg-red-300 float-right hover:bg-red-900 hover:text-red-200 hover:-translate-y-0.5 transform transition duration-300 ease-in-out text-red-900 font-medium py-1.5  px-4 rounded-md my-3 border-blue-500 -z-5 ${ !isGenerating ? 'cursor-pointer': 'cursor-not-allowed animation-spin bg-red-900 text-red-200'}`}
                    disabled={isGenerating}
                    onClick={() => handleSearchBtnClick(query)}
                >
                    
                    <svg className={`animate-spin h-5 w-5 mr-3 text-red-400 ${isGenerating ? 'block': 'hidden'}`} viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isGenerating ? 'Generating...': 'Generate songs'}
                </button>
            )}
        
        </div>
        
        <br/>
        
        {playlistRef.current && playlistRef.current.length > 0 && playlistRef.current.map((song, index) => (
                <div key={index} className={`relative w-full my-2 border-1  rounded-md ${isGenerating ? 'hidden': 'block'} `}>
                    
                    <div className="absolute inset-1 blur-3xl bg-red-500 rounded-lg "></div>
                                <div className="relative  flex flex-col items-center w-lg text-white mx-auto bg-red-300 justify-between  rounded-md">
                                    <div className='flex flex-row justify-between p-3 w-full '>
                                        {/* on way to truncate the song name is by using 
                                        // text-overflow: ellipsis
                                         */}
                                        <p className=''><span className="text-red-900/90 pl-1">{index+1}.</span> <span className="text-red-900 font-semibold">{song.song} </span> </p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"className="w-6 h-5  text-red-900  hover:animate-bounce" onClick={() => {
                                            toggleView(index);
                                            
                                        }}>
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>


                                    </div>
                                    <div className='w-full relative '>
                                        <div className="absolute inset-1 blur-2xl bg-red-500 rounded-lg shadow-xl" ></div>
                                        <iframe
                                           
                                           width='300'
                                           height='168.5'
                                           src={`https://www.youtube.com/embed/${song.videoId}?playsinline=1&controls=1&showinfo=0`}
                                           className={`relative mx-auto mb-5 bg-red-400 border-none rounded-lg $ ${index === isOpen ? 'block': 'hidden'} `}
                                           /> 
                                    </div>
                            </div>
                </div>
            ))}
      
    </div>
    )
}

export default SearchBar