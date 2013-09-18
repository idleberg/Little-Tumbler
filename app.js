// Little Tumbler
var lbver = '0.1';

// Tumblr
var name = 'probs99';
var oauth = {
	// -> http://www.tumblr.com/oauth/apps
	consumer_key: ''
};


// Requirements
var Blog = require('tumblr').Blog;
var blog = new Blog(name+'.tumblr.com', oauth);

var express = require('express');
var app = express(); 
var hbs = require('hbs');


// Express set-up
app.set('view engine', 'html');
app.set('view engine', 'hbs');


// Render meta.json
app.get('/meta.json', function(req, res) {

	var handler = { };

	handler.meta = {
		// -> http://remote.bergcloud.com/developers/reference/metajson
		"owner_email":"example@example.com",
		"publication_api_version":"1.0",
		"name": "Little Tumbler",
		"description": "Send Tumblr content to your Little Printer",
		"delivered_on":"every day",
		"external_configuration": false,
		"send_timezone_info": false,
		"send_delivery_count": false
	};

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

		var handler = { };
		
		handler.tumblr = {
			"title": response.blog.title,
			"name": response.blog.name,
			"url": response.blog.url,
			"description": response.blog.description,
			"caption": response.posts[0].caption,
			"image": response.posts[0].photos[0].alt_sizes[2].url,
			"image_permalink": response.posts[0].image_permalink,
			"image_caption": response.posts[0].photos[0].caption,
			"tags": response.posts[0].tags,
		}

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
	res.send('Hello, my name is <a href="https://github.com/idleberg/Little-Tumbler">Little Tumbler</a>!');
});


// Okay, let's go!
console.log('\nLittle Tumbler' +lbver+ '- https://github.com/idleberg/Little-Tumbler');
console.log('\nScraping http://' +name+ '.tumblr.com');
console.log('Server running at http://localhost:3000');

app.listen(3000);