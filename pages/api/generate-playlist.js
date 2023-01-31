// import 'Configuration' and 'OpenAIApi' classes
import { Configuration, OpenAIApi} from 'openai';

// create a new instance of the Configuration class by passing in your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

// create a new instance of the OpenAIApi class by passing in your configuration
const openai = new OpenAIApi(configuration);


const generatePlaylist = async (req, res) => {
  // run first prompt
  const bookName = req.body.query;
  const basePromptPrefix = `Create a 10-song playlist that captures the mood, themes, and emotions of the book "${bookName}". Include a mix of contemporary and classic songs or any other genre that relate to the story through lyrics or themes such as love, loss, hope and other strong emotions. The playlist should be suitable for listening while reading the book or as a standalone experience. Ensure that the songs are in the format of objects with properties, for example: {"song": "The Long Road", "artist": "Mark Knopfler", "videoId": "[empty]"}. Please make sure to recommend only existing and different songs every time.The output should be an array of these song objects.`
  
  console.log(`API: Running...${basePromptPrefix}`)
  try {

      // calls the createCompletion method specifying the mode, prompt, temperature, and max tokens
      const baseCompletion = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `${basePromptPrefix}`,
          temperature: 0.7,
          max_tokens: 700
        })
        console.log("success: ", baseCompletion.data.choices[0].text)
        
        // get the text from the choices array
        const basePromptOutput = baseCompletion.data.choices[0].text
        
        // send the text to the client
        res.status(200).json({ basePromptOutput });

    } catch (error) {
        console.error("Gpt3-api-eror>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error)
    }
}

export default generatePlaylist;
