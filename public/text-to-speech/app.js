const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const gTTS = require('gtts');  

app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/synthesize', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  else{
    try {
        const gtts = new gTTS(text, 'en');
        const audioFilePath = path.join(__dirname, 'public', 'output.mp3');
        
        gtts.save(audioFilePath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to convert text to speech' });
          }
          
          res.json({ audioUrl: '/output.mp3' });
        });
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
      }
    
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
