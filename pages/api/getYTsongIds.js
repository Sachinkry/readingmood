import axios from 'axios'
require('dotenv').config()

const getSongFromYTube = async (req, res) => {
    // const songName = req.query.songName;
    // const artist = req.query.artist;
    const { song, artist} = req.query;
    
    console.log(`searching...backend-YT`, song, artist)
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&q=${song} song by ${artist}&key=${process.env.YTUBE_API_KEY}`
    try {
        
        const response = await axios.get(url);
        console.log("calling ytube songs...........................................................................................................")
        const videoId = response.data.items[0].id.videoId;
        res.status(200).json({videoId}); 
        console.log("calling ytube2 songs......................................................................")
        // the thing that is wrong with this is that it is not returning the videoId
        // it is returning the whole response 
        // so to send 
                    
    } catch (err) {
        console.error("err_Getting_SongFromYtube", err);
    }
}

export default getSongFromYTube;