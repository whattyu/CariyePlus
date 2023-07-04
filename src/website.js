const express = require('express');
const app = express();

app.get('/', function(res) {
	res.send('Hello World');
});

app.listen(8080);
