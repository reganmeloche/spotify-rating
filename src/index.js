import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Setup
app.set('port', (process.env.PORT || 7007));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/test', (req, res) => {
  try {
    const result = { text: 'Hello world!' };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${app.get('port')}`);
});

module.exports = server;
