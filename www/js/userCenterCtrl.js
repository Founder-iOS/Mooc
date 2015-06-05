angular.module('starter.controllers')
.controller('UserCenterCtrl', function($scope,users) {
	$scope.user = users.lastLoginUser();
	if(DEBUG) console.log('user center controller :',$scope.user);
    $scope.listItems = [
        {text:'学习笔记',      iconClass:'ion-record',                  hasDetails:true},
        {text:'版本号 1.0.0',  iconClass:'ion-information-circled',    hasDetails:false},
        {text:'关于我们',      iconClass:'ion-ios-football',            hasDetails:true}
    ];

    $scope.logout = function(){

    };

    $scope.click = function(index){
        // 仅当listItems[index].hasDetails == true 时做处理
        if($scope.listItems[index].hasDetails){

        }
    }
});