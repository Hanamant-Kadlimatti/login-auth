angular.module('starter')

.constant('AUTH_EVENTS', {
   notAuthenticated: 'auth-not-authanticated',
   notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
    admin : 'admin_role',
    public : 'public'
})