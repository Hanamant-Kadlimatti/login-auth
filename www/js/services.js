
angular.module('starter')

.service('AuthService', function($q, $http, USER_ROLES){
   var LOCAL_TOKEN_KEY = 'your key';
   var username = '';
   var isAuthenticated = false;
   var role ='';
   var authToken;

   function loadUserCredentials (){
       var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

       if(token){
        useCredentials(token)
       }
   }

   function storeUserCredentials (token){
     window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
     useCredentials(token);
   }

   function useCredentials(token){
       username = token.split('.')[0];
       isAuthenticated = 'true';
       authToken = token;

       if(username == 'admin') {
          role = USER_ROLES.admin
       }

       if(username == 'user'){
           role = USER_ROLES.public
       }

       $http.defaults.headers.common['X-Auth-Token'] = token;
   };

 function destroyUserCredentials () {
      authToken = 'undefined';
      username : '';
      isAuthenticated = 'false';
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
 }

   var login = function(name, pw){
       return $q(function(resolve, reject) {
           if((name == 'admin' && pw == 'admin123') || (name == 'user' && pw == 'user123')){
              storeUserCredentials(name + '.yourServerToken');
              resolve('Login Success')
           }else{
               reject('Login Failed !');
           }
       });
   };

   var logout = function (){
       destroyUserCredentials();
   };

   var isAuthorized = function(isAuthorizedRoles){
       if(!angular.isArray(isAuthorizedRoles)){
        isAuthorizedRoles = [isAuthorizedRoles]
       }
       return (isAuthenticated && isAuthorizedRoles.indexOf(role) !== -1)
   }

   loadUserCredentials ();

   return{
       login : login,
       logout : logout,
       isAuthorized : isAuthorized,
       isAuthenticated: function(){
           return isAuthenticated;
       },

       username: function(){
           return username;
       },

       role: function(){
           return role;
       }
   }
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS){
      return {
          responseError : function(response) {
              $rootScope.$broadcast({
                 401 : AUTH_EVENTS.notauthenticated,
                 403 : AUTH_EVENTS.notauthorized,
              }[response.status], response);
              return $q.reject(response)
          }
      }
})

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
})