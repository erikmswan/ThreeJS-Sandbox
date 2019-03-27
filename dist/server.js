const Express = require('express');

const app = new Express();
const port = 8080;

app.use(Express.static(__dirname + '/public'));

app.get('/*', (req, res) => {
  console.log(`GET ${req.headers.host}${req.url}`);
  res.sendFile(__dirname + '/index.html'), err => {
    if (err) res.status(500);
  };
});

app.listen(port, () => console.log(`\nReact-boilerplate listening on port => ${port}.\n`));