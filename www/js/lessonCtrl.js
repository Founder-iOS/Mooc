/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
.controller('LessonCtrl', function($scope,$rootScope,$stateParams,$cordovaFileTransfer, $ionicPlatform,$cordovaInAppBrowser,$cordovaFileOpener2,lesson,users) {
    $scope.user = users.lastLoginUser();
    $scope.openResource = function(resource){
        console.log(resource.file_path);
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
        };
        $ionicPlatform.ready(function(){
            //内置reader打开
            var url = resource.file_path;
            var file_name = $scope.getFileName(url);
            var fileDir = cordova.file.documentsDirectory + file_name;
            $cordovaFileOpener2.open(
                fileDir,
                'application/pdf'
            ).then(function() {
                    // file opened successfully
                }, function(err) {
                    // An error occurred. Show a message to the user
                });

            //内置浏览器打开
//    $cordovaInAppBrowser.open(resource.file_path, '_blank', options)
//      .then(function(event) {
//        // success
//            console.log('打开成功');
//      })
//      .catch(function(event) {
//        // error
//             console.log('打开失败');
//
//      });
            //$cordovaInAppBrowser.close();
        }, false);

    };
    $scope.getFileName = function(o){
        var pos=o.lastIndexOf("/");
        return o.substring(pos+1);
    };
    $scope.downloadResource = function(resource){

    };

    $scope.outlineUrl = lesson.outlineUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    $scope.homeworkUrl =lesson.homeworkUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    $scope.quizUrl = lesson.quizUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    $scope.postUrl = lesson.postUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    $scope.notesUrl = lesson.notesUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    $scope.evaluationUrl = lesson.evaluationUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
    console.log('$scope.outlineUrl is ' + $scope.outlineUrl);
    console.log($scope.lesson);
    $scope.doRefresh = function() {
        lesson.getResourcesFromServer($stateParams.lessonId).then(function(data){
            console.log('课时详情返回成功' + eval(data).success);
            if(eval(data).success === 1){
                console.log('11' + eval(data).data.resources);
                $scope.resources = eval(data).data.resources;
                console.log("getResources success");
            }else{
                console.log("getResources fail");
            }
        }, function(data){
            deferred.reject(data);
            console.log('课时详情返回失败' + data);
        });
        console.log('$scope.resources is'+ ' ' +$scope.resources);
    };
    $scope.doRefresh();
});
