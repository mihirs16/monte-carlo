const express = require('express');
const Gun = require('gun');

const port = process.env.PORT || 8000;

const app = express();
app.use(Gun.serve)

const server = app.listen(port, () => {
    console.log("Listening at: http://localhost://" + port)
})

Gun({web: server})
