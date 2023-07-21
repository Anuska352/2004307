

const express = require('express');
const request = require('request-promise');
const app = express();

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "No URLs provided in the 'url' query parameter." });
  }

  try {
    const fetchNumbersFromUrl = async (url) => {
      try {
        const response = await request.get({ uri: url, json: true, timeout: 500 });
        if (response && response.numbers && Array.isArray(response.numbers)) {
          return response.numbers;
        }
        return [];
      } catch (error) {
        return [];
      }
    };

    const fetchPromises = urls.map(fetchNumbersFromUrl);
    const numbersArray = await Promise.all(fetchPromises);
    const numbersSet = new Set(numbersArray.flat());
    const numbers = Array.from(numbersSet).sort((a, b) => a - b);

    res.json({ numbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});