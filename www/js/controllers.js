angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS ){
         $scope.username =  AuthService.username();

         $scope.$on(AUTH_EVENTS.notAuthorized, function(event){
            var alertPopup = $ionicPopup.alert({
                title : 'unauthorized',
                template : 'You are not allow to access this resource'
            })
         });


         
         $scope.$on(AUTH_EVENTS.notauthenticated, function(event){
             AuthService.logout();
             $state.go('login')
            var alertPopup = $ionicPopup.alert({
                title : 'Session  Lost!',
                template : 'Sorry, You have to login again!'
            })
         })


         $scope.setCurrentUsername= function(){
             $scope.username = name;
         }
})





.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService){
     $scope.data = {}

     $scope.login = function (data){
        AuthService.login(data.username, data.password).then(function(authenticated){
           $state.go('main.dash', { }, {reload: 'true'})
           $scope.setCurrentUsername(data.username);
        }, function(err){
            var alertPopup = $ionicPopup.alert({
                title : 'Login Failed',
                template : 'Plese check yor credentials!'
            })
        })
     }
})

.controller('DashCtrl', function($scope, $state, $ionicPopup, $http, AuthService){
      $scope.logout = function(){
          AuthService.logout();
          $state.go('login')
      }

      $scope.performValidRequest = function (){
            $http.get('http://localhost:8100/valid').then(
                function(result) {
                    $scope.response = result
                })
      }

      $scope.performUnauthorizedRequest = function (){
        $http.get('http://localhost:8100/notauthorized').then(
            function(result) {
                // $scope.response = result
            }, function(err) {
                $scope.response = err;
            })
  }

  $scope.performInValidRequest = function (){
    $http.get('http://localhost:8100/notauthenticated').then(
        function(result) {
            // $scope.response = result
        }, function(err) {
            $scope.response = err;
        })
}
})