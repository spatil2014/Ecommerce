/**
 * Created by s.basanagouda.patil on 2/17/2016.
 */
//(function(){
"use strict";
    var app = angular.module('searchApp',['ngResource','ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
         .when('/',{
            templateUrl:'partials/search-tpl.html',
            controller: 'searchCtrl'
        })
        .when('/login', {
        	templateUrl: 'partials/Login.html'
        })
        .when('/register', {
        	templateUrl: 'partials/Register.html'
        })
        .when('/page/:key', {
        templateUrl: function(parameters){
            return 'partials/' + parameters.key + '.html';
        },
        controller: 'detailCtrl'
    });
    }]);

    app.controller('searchCtrl', function($scope, SearchService, selectedService, filterFilter){

        var filterItems=[];
        $scope.filtered=[];
        $scope.filteredResults=[];
        $scope.itemsPerPage = 6;
        $scope.currentPage = 0;
        $scope.searchType = 'all';
        $scope.selected= '';

        $scope.selectedItem = function(itm) {
        	selectedService.selectedVal = itm;
        };

        $scope.$on('$routeChangeStart', function(next, current) { 
        	$("#myModal").modal('hide');
        });
        //load modal for login/register
//        $("#myModal").modal('show');

        // Handle search based on category
        $scope.switchSearchType = function(searchCategory) {
            $scope.searchType = searchCategory;
            $scope.getFilteredData($scope.searchTerm, searchCategory);
            $scope.currentPage = 0;

        };

        // Fetch data based on search query
        $scope.getFilteredData = function() {
            $scope.searchResults = [];
            $scope.noOfPages = 0;
//            if($scope.searchTerm != '' && $scope.searchTerm != undefined) {
                SearchService.query(function(data) {
                       $scope.$watch('searchTerm', function (newVal, oldVal) {

                        $scope.filtered = filterFilter(data, newVal);
                           filterItems=[];
                           if( $scope.searchType === 'all') {
                               filterItems = $scope.filtered;
                           } else {
                               for(var i=0;i<$scope.filtered.length;i++) {
                                   if($scope.filtered[i].category ===  $scope.searchType) {
                                       filterItems.push($scope.filtered[i]);
                                   }
                               }
                           }
                           $scope.searchResults = filterItems;
                           $scope.noOfPages = Math.ceil($scope.searchResults.length / $scope.itemsPerPage);
                   }, true);
                });
//            } else {
//                $scope.searchResults = '';
//            }
        };

        //Handle optional search category on search results
        $scope.optionalFilters = [];
        $scope.filterByCategory = function (item) {

            if($scope.filteredResults.length) {
                $scope.noOfPages = Math.ceil($scope.filteredResults.length / $scope.itemsPerPage);
            }
            return $scope.optionalFilters[item.region] || noFilter($scope.optionalFilters);
        };
        var items = $scope.filteredResults;
        function noFilter(filterObj) {
            for (var key in filterObj) {
                if (filterObj[key]) {
                    return false;
                }
            }
            return true;
        };

        $scope.calculateRoute = function(location) {
        	console.log(location);
        	var from;
            navigator.geolocation.getCurrentPosition(function(position) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                  "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                },
                function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK)
                	  from = results[0].formatted_address;
//                    $("#" + addressId).val(results[0].formatted_address);
                  else
                    $("#error").append("Unable to retrieve your address<br />");
                });
              },
              function(positionError){
                $("#error").append("Error: " + positionError.message + "<br />");
              },
              {
                enableHighAccuracy: true,
                timeout: 10 * 1000 // 10 seconds
              });
        	var myOptions = {
        	          zoom: 10,
        	          center: new google.maps.LatLng(40.84, 14.25),
        	          mapTypeId: google.maps.MapTypeId.ROADMAP
        	        };
        	        // Draw the map
        	        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
        	        var directionsService = new google.maps.DirectionsService();
        	        var directionsRequest = {
        	          origin: "560001",
        	          destination: location,
        	          travelMode: google.maps.DirectionsTravelMode.DRIVING,
        	          unitSystem: google.maps.UnitSystem.METRIC
        	        };
        	        directionsService.route(
        	          directionsRequest,
        	          function(response, status)
        	          {
        	            if (status == google.maps.DirectionsStatus.OK)
        	            {
        	              new google.maps.DirectionsRenderer({
        	                map: mapObject,
        	                directions: response
        	              });
        	            }
        	            else
        	              $("#error").append("Unable to retrieve your route<br />");
        	          }
        	        );
        	        $("#shopModal").modal('show')
        }
    });

    app.controller('detailCtrl', function($scope, selectedService) {
        $scope.selected = selectedService.selectedVal;
    });

app.filter('offset', function () {
    "use strict";
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

// To get unique values from search results for optional search on
app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});