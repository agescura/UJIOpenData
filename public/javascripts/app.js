/**
 * Created by agescura on 17/11/15.
 */

var app = angular.module('demoapp', ['leaflet-directive']);
app.controller('LeafletController', [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 39.94472,
            lng: -0.06407,
            zoom: 15
        }
    });
}]);
