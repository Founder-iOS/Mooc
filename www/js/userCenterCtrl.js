angular.module('starter.controllers')
    .controller('UserCenterCtrl', function($scope,users,$state) {
        $scope.user = users.lastLoginUser();
        if(DEBUG) console.log('user center controller :',$scope.user);
        $scope.listItems = [
            {text:'我的学习',     state:'tab.lesson-history', iconClass:'ion-record',                  hasDetails:true},
            {text:'版本号 1.0.0',  iconClass:'ion-information-circled',    hasDetails:false},
            {text:'关于我们',state:'tab.about',       iconClass:'ion-ios-football',            hasDetails:true}
        ];

        $scope.logout = function(){
            $state.go('signin');
        };

        $scope.click = function(index){
            alert
            // 仅当listItems[index].hasDetails == true 时做处理
            var item =  $scope.listItems[index];
            if(item.hasDetails){
                $state.go(item.state);
            }
        }
    });