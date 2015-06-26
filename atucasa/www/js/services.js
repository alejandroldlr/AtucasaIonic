var appService = angular.module('starter.services', ['ngCordova']);

appService.factory('AddressService', function($cordovaSQLite) {
  // Might use a resource here that returns a JSON array
 //$scope, $rootScope, $window, $cordovaSQLite
 /* var addresses = [{"street" :"Av Simon Lopezzz",
                    "number" :"657",
                    "refStreet1":"calle A",
                    "refStreet2":"calle b",
                    "building":"edif sol",
                    "refPhone":"4290142"}];*/

                    var addresses = [];                  
                    
                    var query = "SELECT * FROM shippingaddress ORDER BY id";
                    $cordovaSQLite.execute(db, query, []).then(function(res) {
                      if(res.rows.length > 0) {
      //console.log("SELECTED -> " + res.rows.item(0).street + " " + res.rows.item(0).number);

      for(var i = 0; i < res.rows.length; i++) {
        addresses.push({
          "street" : res.rows.item(i).street,
          "number" : res.rows.item(i).number,
          "refStreet1" : res.rows.item(i).refStreet1,
          "refStreet2" : res.rows.item(i).refStreet2,
          "building" : res.rows.item(i).building,
          "refPhone" : res.rows.item(i).refPhone
        });
      }
    } else {
      console.log("No results found");
      return false;
    }
  }, function (err) {
    console.error(err);
  });


                    return {
                      all: function() {
                        return addresses;
                      }
                    }
                  });

/**
 * A simple example service that returns some data.
 */
 appService.factory('Geo', function($q) {
  return {
    reverseGeocode: function(lat, lng) {
      //console.log("GEO FACTORY");
      var q = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'latLng': new google.maps.LatLng(lat, lng)
      }, function(results, status) {
         //console.log("status:"+status);
         if (status == google.maps.GeocoderStatus.OK) {
          console.log('formatted_address[0]:', results[0].formatted_address);

          if(results.length > 0) {
            var r = results[0];
            var a, types;
            var parts = [];
            var streetMap;
            var foundStreetAddress = false;
            var foundRoute = false;
            var foundIntersection = false;
            for(var i = 0; i < r.address_components.length; i++) {
              a = r.address_components[i];
              types = a.types;
              for(var j = 0; j < types.length; j++) {
                if(!foundStreetAddress && types[j] == 'street_address') { 
                  foundStreetAddress = true;
                  parts.push(a.long_name);
                  console.log('street_address:', a.long_name);
                } else if(!foundRoute && types[j] == 'route') {
                  foundRoute = true;
                  parts.push(a.long_name);
                  console.log('route', a.long_name);
                }else if(!foundIntersection && types[j] == 'intersection'){
                  foundIntersection = true;
                  parts.push(a.long_name);
                  console.log('intersection', a.long_name);
                }
              }
            }
            console.log('Reverse', parts);
            //q.resolve(parts.join(', '));
            q.resolve(parts);
          }
        } else {
          console.log('reverse fail', results, status);
          q.reject(results);
        }
      })

return q.promise;
},
getLocation: function() {
      //console.log("Geo.getLocation");
      var q = $q.defer(); 
      navigator.geolocation.getCurrentPosition(function(position) {
        q.resolve(position);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  };
});
