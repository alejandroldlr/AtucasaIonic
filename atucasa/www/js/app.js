// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $ionicLoading, $rootScope, $window, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
if (window.cordova && window.cordova.plugins.Keyboard) {
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
}
if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB("atucasa.db"); //device  db = $cordovaSQLite.openDB("atucasa.db"); //device 
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS shippingaddress (id integer primary key autoincrement, street text, number text, refStreet1 text, refStreet2 text, building text, refPhone text)");

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };


    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };


  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })


  .state('app.restaurantList', {
    url: "/restaurantList/:address_id",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantList.html",
        controller: 'restCtrl'
      }
    }
  })

  .state('app.restaurantMap', {
    url: "/restaurantMap/:productId",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantMap.html",
        controller: 'restMapCrtl'
      }
    }
  })

  .state('app.shippingAddress', {
      url: "/shippingAddress/:mainStreet", // to do completar parametro
      views: {
        'menuContent': {
          templateUrl: "templates/shippingAddress.html",
          controller: 'shippingAddressCtrl'
        }
      }
    })

  .state('app.shippingAddressClean', {
    url: "/shippingAddressClean", 
    views: {
      'menuContent': {
        templateUrl: "templates/shippingAddress.html",
        controller: 'shippingAddressCtrl'
      }
    }
  })


  .state('app.addressList', {
    url: "/addressList",
    views: {
      'menuContent': {
        templateUrl: "templates/addressList.html",
        controller: 'addressListCtrl'
      }
    }
  })

  .state('app.addressMap', {
    url: "/addressMap",
    views: {
      'menuContent': {
        templateUrl: "templates/addressMap.html",
        controller: 'addressMapCtrl'
      }
    }
  })

  .state('app.restaurantMenu', {
    url: "/restaurantMenu/:productId",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantMenu.html",
        controller: 'restMenuCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/shippingAddressClean');
});
