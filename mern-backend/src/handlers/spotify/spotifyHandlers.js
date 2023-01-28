let axios = require('axios');
let qs = require('query-string');

const Result = {
  Fail: 0,
  Success: 1
}

const getAccessToken = async () => {
  try {
    const headers = {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'))
      },
    };

    const data = {
      grant_type: 'client_credentials',
    };
    const body = qs.stringify(data);

    // Make the request using the URL, query string, data, and headers.
    const response = await axios.post('https://accounts.spotify.com/api/token', body, headers);
    return { result: Result.Success, data: response.data };
  }
  catch (err) {
    console.log(`getAccessToken: ${err.message}`)
    return { result: Result.Fail, message: err.message };
  }
}

const searchHandler = async (req, res) => {
  try {
    const searchQuery = req?.body?.searchQuery;
    const searchField = req?.body?.searchField;

    if (!searchQuery || !searchField || !searchQuery.length || !searchField.length) {
      return res.status(404).send("Not found");
    }

    const response = await getAccessToken();
    if (response?.result === Result.Fail) {
      return res.status(500).send({ error: response.message });
    }

    const headers = {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${response.data.access_token}`
      },
    };

    const uri = `https://api.spotify.com/v1/search?q=${searchQuery}&type=${searchField}&offset=0&limit=24`;
    const searchResponse = await axios.get(uri, headers);
    return res.status(200).send(searchResponse.data);
  } catch (err) {
    console.log(`Error searchHandler: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = {
  searchHandler,
};