'use strict';
// REQUIRES
const express = require('express');
// INSTANTIATION
const app = express();
// SET-UP
const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));
// ROUTES
app.get('/info', function(req, res) { res.sendFile('index.html', {root:'./public'}) });
app.get('/projects', function(req, res) { res.sendFile('index.html', {root:'./public'}) });
// START SERVER
app.listen(PORT, function() {
  console.log('Now serving on port', PORT);
});
