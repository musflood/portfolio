'use strict';

// REQUIRES //

const express = require('express');
const requestProxy = require('express-request-proxy');

// INSTANTIATION //

const app = express();

// SET-UP //

const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));

function proxyGithub(req, res) {
  (requestProxy({
    url:`https://api.github.com/${req.params[0]}`,
    headers: {Authorization: `token ${process.env.GITHUB_TOKEN}`}
  }))(req, res);
}

// ROUTES //

// navigation for tabs
app.get('/info', function(req, res) { res.sendFile('index.html', {root:'./public'}) });
app.get('/projects', function(req, res) { res.sendFile('index.html', {root:'./public'}) });
app.get('/projects/:language', function(req, res) { res.sendFile('index.html', {root:'./public'}) });

// proxied authenticated request to GitHub
app.head('/github/*', proxyGithub);
app.get('/github/*', proxyGithub);

// 404 error


// START SERVER //

app.listen(PORT, function() {
  console.log('Now serving on port', PORT);
});
