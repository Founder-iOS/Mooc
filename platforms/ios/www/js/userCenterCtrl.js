angular.module('starter.controllers')
.controller('UserCenterCtrl', function($scope,users) {
	$scope.user = users.lastLoginUser();
	
})