# Node.js Authorization module

A simple authorization module for managing authorization rules inside an application.
It uses the connect auth request method for accessing request user info. It works seamlessly with
express or other frameworks.

## Tutorial

Installation:

    $ cd ~/.node_libraries
    $ git clone git://github.com/chlu/node-authorization.git

Or put it (authorization.js) in your applications lib folder.

Usage (for example with express):

	var ...,
		authorization = require('node-authorization/lib/authorization');

	// A permission can be as simple like this, it would allow users with role "guest" to view a blog
	authorization.role('guest', function(role) {
		role.hasPermissionOn('blog', ['view']);
	});
	// Specific functions implement business logic, here a blog is only writable by users with role "user" that are the owner of the blog
	authorization.role('user', function(role) {
		role.hasPermissionOn('blog', ['view', 'update', 'delete'], function(blog, user) {
			return blog.owner == user.username;
		});
	});

	// Testing for an authorizated action is simple
	app.get('/blog/:name', function(req, res) {
		// Some context like an object, possibly from a db
		var blog = {
			name: req.params.name
		};
		if (!authorization.authorized(req).to('view', 'blog')(blog)) {
			return res.send('Not authorized', 403);
		}
		...
	});

It's also easy to put the authorized function for a specific request in the rendering context of a template to use it for view conditions.
