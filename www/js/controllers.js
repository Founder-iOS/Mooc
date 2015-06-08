var DEBUG = false;
var FAKE_DATA = false;

angular.module('starter.controllers', [])
    .controller('TabsCtrl', function($scope, $scope, $state) {
        $scope.$on('$ionicView.beforeEnter', function() {
            if(DEBUG) console.log('state name is ' + $state.current.name);
            if ($state.current.name === 'tab.course-detail' ||$state.current.name === 'tab.lesson') {
                $scope.hideTabs = true;
            }
            else{
                $scope.hideTabs = false;
            }

        });
    });


