/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
    .controller('SignInCtrl', function($scope,$ionicPlatform,$state,users) {
        $scope.user = users.lastLoginUser();
        if (user) {
            console.log("last login user: ",user);
        }
        $scope.signIn = function() {
            users.getFromServer($scope.user.name,$scope.user.password).then(function(data){
                console.log('返回成功' + eval(data).success);
                if(eval(data).success === 1){
                    var password = $scope.user.password;
                    $scope.user = eval(data).data;
                    $scope.user.password = password;
                    users.save($scope.user );
                    console.log("signin success");
                    $state.go('tab.courses');
                }
                else{
                    alert(eval(data).message);
                }
            }, function(data) {
                console.log('返回失败' + data);
            });
        }
    });
