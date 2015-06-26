angular.module('starter.controllers', ["firebase","ngCordova", "starter.services"])

.controller('restCtrl', function($scope, $firebaseArray) {
  $scope.ref = new Firebase("https://atucasa.firebaseio.com");
  $scope.restaurants = $firebaseArray($scope.ref);
})


.controller('restMenuCtrl', function($scope, $stateParams, $firebaseObject, $cordovaGeolocation) {
  var ref = new Firebase("https://atucasa.firebaseio.com/"+$stateParams.productId);
  $scope.restaurant = $firebaseObject(ref);
})

.controller('restMapCrtl', function($scope, $stateParams, $firebaseObject, $cordovaGeolocation) {

  var ref = new Firebase("https://atucasa.firebaseio.com/"+$stateParams.productId);
  $scope.restaurant = $firebaseObject(ref);
  var myLatlng = new google.maps.LatLng(-17.37, -66.15);
  var mapOptions = {
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("rest_map"), mapOptions);
  $scope.restaurant.$loaded().then(function () {
    map.setCenter(new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long));
    var infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          map.setZoom(16);
          marker = new google.maps.Marker({
            position: latlng,
            title:  $scope.restaurant.name,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            options: { draggable: false }
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          alert('No se encontro dirección');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  });
  var infowindow2 = new google.maps.InfoWindow();
  var marker2 = new google.maps.Marker({
    position: new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long),
    map: map,
    title:  "Mi ubicación"
  });
  infowindow2.setContent("Mi ubicación");
  infowindow2.open(map, marker2);

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
   $scope.lat = position.coords.latitude
   marker2.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
 }, function(err) {
   console.log(err);
 });

})


.controller('shippingAddressCtrl',function($scope, $rootScope, $window, $cordovaSQLite, $state, $stateParams) {

  var aux_street = $stateParams.mainStreet;
  
  if(aux_street==":mainStreet"){
    aux_street ="";
  }

  $scope.addressForm = {
    street: aux_street,
    number: "",
    refPhone: ""
  };


  $scope.validateAddress = function() {

    console.log("Calle: " + $scope.addressForm.street + " - Nro: " + $scope.addressForm.number);
    var street = $scope.addressForm.street;
    var number = $scope.addressForm.number;
    var refPhone = $scope.addressForm.refPhone;

    if (!street || !number || !refPhone) {
     $rootScope.notify("Por favor ingrese los datos obligatorios: <br>"+"Calle/Av, Nro, Tel. referencia");
     return false;
   }

   return true;  
 }

 $scope.insertAddress = function() {
  var street = $scope.addressForm.street;
  var number = $scope.addressForm.number;
  var refStreet1 = $scope.addressForm.refStreet1;
  var refStreet2 = $scope.addressForm.refStreet2;
  var building = $scope.addressForm.building;
  var refPhone = $scope.addressForm.refPhone;

  var query = "INSERT INTO shippingaddress (street, number, refStreet1, refStreet2, building, refPhone) VALUES (?,?,?,?,?,?)";
  $cordovaSQLite.execute(db, query, [street, number, refStreet1, refStreet2, building, refPhone]).then(function(res) {
            //console.log("INSERT ID -> " + res.insertId);
            //$rootScope.notify("ID registrado:"+res.insertId);
          }, function (err) {
            console.error(err);
          });
}

$scope.saveAddress = function() {
 if ($scope.validateAddress()) {
  $scope.insertAddress(); 
  $state.go('app.restaurantList');
}

}  

})

.controller('addressListCtrl',function($scope, AddressService, $rootScope, $window) {

  $scope.addressList = [];
  $scope.addressList = AddressService.all();

})

.controller('addressMapCtrl',function($scope, $ionicLoading, $rootScope, $ionicLoading, Geo, $window, $state) {

  $scope.latitute="";
  $scope.longitude="";

  $scope.confirmMapAddress = function() {
    $scope.paramStreet="";
    Geo.reverseGeocode($scope.latitute,$scope.longitude).then(function(parts){
      $state.go('app.shippingAddress',{mainStreet: parts[0]});
    },function(){
     console.log("No se pudo realizar reverseGeocode");
     $state.go('app.shippingAddress');
   });

    //$window.location.href = ('#/app/shippingAddress');
  }  

  $scope.initialise = function () {
    var myLatlng = new google.maps.LatLng(-17.37, -66.15);
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    Geo.getLocation().then(function(pos) {
      $scope.latitute=pos.coords.latitude;
      $scope.longitude=pos.coords.longitude;
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "Mi ubicacion"
      });

      infowindow.setContent("Mi ubicación");
      infowindow.open(map, myLocation);
    }, function() { console.log("No se pudo encontrar la ubicacion");});

    $scope.map = map;
  };

  console.log("google.maps.event.addDomListener()"); 
  google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});