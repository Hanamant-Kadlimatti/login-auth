// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngMockE2E'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,  USER_ROLES, $ionicConfigProvider,) {
  $ionicConfigProvider.tabs.position('bottom'); //bottom
  $stateProvider
  .state('login', {
     url : '/login',
     templateUrl : 'templates/login.html',
     controller: 'LoginCtrl'
  })

  .state('main', {
    url : '/',
    abstract : 'true',
    templateUrl : 'templates/main.html',
  })

  .state('main.dash', {
    url : 'main/dash',
     views : {
       'dash-tab' : {
        templateUrl : 'templates/dashboard.html',
        controller: 'DashCtrl'
       }
     }
  })

  .state('main.public', {
    url : 'main/public',
     views : {
       'public-tab' : {
        templateUrl : 'templates/public.html',
       }
     }
  })

  .state('main.favourite', {
    url : 'main/favourite',
     views : {
       'favourite-tab' : {
        templateUrl : 'templates/favourite.html',
       }
     }
  })

  .state('main.inbox', {
    url : 'main/inbox',
     views : {
       'inbox-tab' : {
        templateUrl : 'templates/inbox.html',
       }
     }
  })

  .state('main.admin', {
    url : 'main/admin',
     views : {
       'admin-tab' : {
        templateUrl : 'templates/admin.html',
       }
     },
     data : {
       authorizedRoles : [USER_ROLES.admin]
     }
  })

  $urlRouterProvider.otherwise('main/dash')

})


.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }

    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
})

.run(function($httpBackend) {
  // $httpBackend.whenGET(/templates\/\w*.#/).passThrough;
  $httpBackend.whenGET('http://localhost:8100/valid').respond({message : 'This is my valid response!'})

  $httpBackend.whenGET('http://localhost:8100/notauthenticated').respond(401, {message : 'Not Authenticated!'})

  $httpBackend.whenGET('http://localhost:8100/notauthorized').respond(403, {message : 'Not Authorized!'})

  $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
  
}); 

