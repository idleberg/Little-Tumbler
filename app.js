// Little Tumbler
var lbver = '0.1.4',
	lbport = '3000'

// Tumblr
var name = 'probs99',
	oauth = {
	// -> http://www.tumblr.com/oauth/apps
	consumer_key: ''
};


// Requirements
var Blog = require('tumblr').Blog,
	blog = new Blog(name+'.tumblr.com', oauth),
	express = require('express'),
	app = express(),
	hbs = require('hbs'),
	handler = require('./meta.js');


// Express set-up
app.set('view engine', 'html');
app.set('view engine', 'hbs');


// Render meta.json
app.get('/meta.json', function(req, res) {
	res.render('meta', {title:handler});
});


// Render style-sheet
app.get('/style.css', function(req, res) {
	res.sendfile('./views/style.css');
});


// Render edition
app.get('/edition', function(req, res) {

	// -> http://www.tumblr.com/docs/en/api/v2 
	var params = {offset: 98,limit: 1};

	blog.posts(params, function(error, response) {
		if (error) {
			throw new Error(error);
		}

		handler.tumblr = { };
		if (response.blog.title) handler.tumblr['title'] = response.blog.title;
		if (response.blog.name) handler.tumblr['name'] = response.blog.name;
		if (response.blog.url) handler.tumblr['url'] = response.blog.url;
		if (response.blog.description) handler.tumblr['description'] = response.blog.description;
		if (response.blog.is_nsfw) handler.tumblr['is_nsfw'] = response.blog.is_nsfw;

		if (response.posts[0].post_url) handler.tumblr['post_url'] = response.posts[0].post_url;
		if (response.posts[0].type) handler.tumblr['type'] = response.posts[0].type;
		if (response.posts[0].date) handler.tumblr['date'] = response.posts[0].date;
		if (response.posts[0].caption) handler.tumblr['caption'] = response.posts[0].caption;
		if (response.posts[0].image_permalink) handler.tumblr['image_permalink'] = response.posts[0].image_permalink;
		if (response.posts[0].tags) handler.tumblr['tags'] = response.posts[0].tags;

		if (response.posts[0].photos[0].caption) handler.tumblr['image_caption'] = response.posts[0].photos[0].caption;
		if (response.posts[0].photos[0].alt_sizes[2].url) handler.tumblr['image'] = response.posts[0].photos[0].alt_sizes[2].url;

		res.setHeader('Content-Type', 'text/html');
		res.render('edition', {title:handler});
	});
});


// Render sample
app.get('/sample', function(req, res) {
	res.sendfile('./views/sample.html');
});


// Render default page
app.get('/', function(req, res) {
	var html = '<h1>Hello, my name is <a href="https://github.com/idleberg/Little-Tumbler">Little Tumbler</a>!</h1><p>View <a href="/edition">edition</a>, <a href="sample">sample</a> or <a href="/meta.json">meta.json</a></p>';

	res.send(html);
});


// Okay, let's go!
console.log('\nLittle Tumbler ' +lbver+ ' - https://github.com/idleberg/Little-Tumbler');
console.log('\nScraping http://' +name+ '.tumblr.com');
console.log('Server running at http://localhost:' +lbport);

app.listen(lbport);