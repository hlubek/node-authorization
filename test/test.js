require('./common');

var mockAdminUser = {
		name: 'Mock admin',
		roles: ['admin']
	},
	mockNobodyUser = {
		name: 'Mock nobody user',
		roles: []
	},
	mockGuestUser = {
		name: 'Mock guest user',
		roles: ['guest']
	},
	mockGuestWithSitesUser = {
		name: 'Mock guest user with sites',
		roles: ['guest'],
		sites: [
			'http://www.google.com',
			'http://www.example.com'
		]
	},
	mockMultiUser = {
		name: 'Mock multirole user',
		roles: ['guest', 'admin']
	},
	mockSite = {
		url: 'http://www.example.com'
	},
	mockRequest = function(user) {
		return {
			getAuthDetails: function() {
				return {
					user: {
						details: user
					}
				};
			}
		};
	};

// Test definition of a role with a simple permission

authorization.role('admin', function(role) {
	role.hasPermissionOn('site', ['view']);
});

assert.ok(authorization.authorized(mockRequest(mockAdminUser)).to('view', 'site')(mockSite), 'Simple hasPermissionOn should be allowed');

assert.equal(false, authorization.authorized(mockRequest(mockNobodyUser)).to('view', 'site')(mockSite), 'Without hasPermissionOn should not be allowed');

// Test adding of role permissions

authorization.role('admin', function(role) {
	role.hasPermissionOn('site', ['update', 'delete']);
});

assert.ok(authorization.authorized(mockRequest(mockAdminUser)).to('update', 'site')(mockSite), 'Adding of actions should work');
assert.ok(authorization.authorized(mockRequest(mockAdminUser)).to('delete', 'site')(mockSite), 'Adding of actions should work');

// Test of multiple roles

authorization.role('guest', function(role) {
	role.hasPermissionOn('site', ['view']);
});

assert.ok(authorization.authorized(mockRequest(mockGuestUser)).to('view', 'site')(mockSite), 'Multiple roles should work');
assert.equal(false, authorization.authorized(mockRequest(mockGuestUser)).to('update', 'site')(mockSite), 'Permissions shouls not be shared');

// Test of multiple roles

assert.ok(authorization.authorized(mockRequest(mockMultiUser)).to('update', 'site')(mockSite), 'User with multiple roles should be allowed if any role is allowed');
assert.ok(authorization.authorized(mockRequest(mockMultiUser)).to('view', 'site')(mockSite), 'User with multiple roles should be allowed if any role is allowed');

// Test of complex functions

authorization.role('guest', function(role) {
	role.hasPermissionOn('site', ['update'], function(site, user) {
		return user.sites && user.sites.indexOf(site.url) !== -1;
	});
});

assert.equal(false, authorization.authorized(mockRequest(mockGuestUser)).to('update', 'site')(mockSite), 'This context should not be allowed');
assert.ok(authorization.authorized(mockRequest(mockGuestWithSitesUser)).to('update', 'site')(mockSite), 'This context should be allowed');

