var DEBUG = false;
var FAKE_DATA = false;

angular.module('starter.controllers', [])



    .controller('TabsCtrl', function($scope, $rootScope, $state) {
        $rootScope.$on('$ionicView.beforeEnter', function() {

            $rootScope.hideTabs = false;
            console.log('state name is' + $state.current.name);
            if ($state.current.name === 'tab.course-detail' ||$state.current.name === 'tab.lesson') {
                $rootScope.hideTabs = true;
            }
            else{
                $rootScope.hideTabs = false;
            }

        });
    });


