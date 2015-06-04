/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
    .controller('SignInCtrl', function($scope,$ionicPlatform,$state,users) {
        $scope.user = users.lastLoginUser();
        if (user) {
            console.log(user);

        }
        $scope.signIn = function() {
            users.getFromServer($scope.user.name,$scope.user.password).then(function(data){
                console.log('返回成功' + eval(data).success);
                if(eval(data).success === 1){
                    var user  = eval(data).data;
                    user.password =  $scope.password;
                    users.save(user);
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
