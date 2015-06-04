/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
.controller('CoursesCtrl', function($scope,$ionicPlatform,courses,users,testService) {
    console.log('开始请求课程列表');
    /*
     moocService.clientActive()
     .then(function(data){
     console.log(data);
     }, function(data){5

     console.log('结束');
     })
     */

//            $scope.downloadFile = function () {
//            $ionicPlatform.ready(function() {
//                                  console.log('开始download');
//                                 var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });
//
//                                 $scope.execute = function() {
//                                 var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
//                                 if(db){
//                                 console.log('开始download111');
//                                 }
//                                 $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
//                                                                                       console.log("insertId: " + res.insertId);
//                                                                                       }, function (err) {
//                                                                                       console.error(err);
//                                                                                       });
//                                 };
//                                 });
//
//            };
//            $scope.downloadFile();

    $scope.user = users.lastLoginUser();
    $scope.getItemHeight = function(item, index) {
        //使索引项平均都有10px高，例如
        return 280;
    };
    $scope.remove = function(course) {
        Courses.remove(chat);
    };
    $scope.gotoCourseDetail = function(courseId) {
        Courses.remove(chat);
    };
    $scope.doRefresh = function() {
        courses.requestCoursesFromServer($scope.user.id).then(function(data){
            console.log('返回成功' + eval(data).success);
            if(eval(data).success === 1){
                $scope.courses  = eval(data).data;
                if(DEBUG) console.log($scope.courses);

                //$scope.$broadcast('scroll.refreshComplete');
            }
            else{
                alert(eval(data).message);
            }
        }, function(data){
            console.log('返回失败' + data);
        });
    };

    if(!FAKE_DATA){
        $scope.doRefresh();
    }
    else {
        $scope.courses = testService.getCourses();
        console.log("faked data - ", $scope.courses);
    }
});