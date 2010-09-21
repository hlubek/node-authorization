var authorizationRules = {
/*
role: {
	aScope: {
		anAction: [
			// At least one should return true
			fn1, fn2
  		]
	}
}
*/
};

var truthy = function() {
	return true;
};

var authorization = module.exports = {
	rolesForUser: function(user) {
		return user && user.roles;
	},
	// Tied to connect-auth, replace with custom logic
	userForRequest: function(req) {
		return req.getAuthDetails() && req.getAuthDetails().user && req.getAuthDetails().user.details;
	},
	role: function(role, builder) {
		builder({
			hasPermissionOn: function(scope, actions, fn) {
				authorizationRules[role] = authorizationRules[role] || {};
				authorizationRules[role][scope] = authorizationRules[role][scope] || {};
				actions.forEach(function(action) {
					if (fn === undefined) {
						fn = truthy;
					}
					authorizationRules[role][scope][action] = authorizationRules[role][scope][action] || [];
					authorizationRules[role][scope][action].push(fn);
				});
			}
		});
	},
	authorized: function(req) {
		return {
			to: function(action, scope) {
				var user = authorization.userForRequest(req),
					roles = authorization.rolesForUser(user);
				return function(context) {
					return roles && roles.some(function(role) {
						if (authorizationRules[role] && authorizationRules[role][scope] && authorizationRules[role][scope][action]) {
							return authorizationRules[role][scope][action].some(function(fn) {
								var result = fn(context, user);
								return result;
							});
						}
						return false;
					});
				};
			}
		};
	}
};
