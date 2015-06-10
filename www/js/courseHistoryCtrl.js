/**
* Created by lileichuan on 15/6/5.
*/

angular.module('starter.controllers')
    .controller('CourseHistoryCtrl', function($scope,$ionicPlatform,courses,users,testService) {
        $scope.courses_history = [];
        var user = users.lastLoginUser();

//        var testCH = {"4CF65748-DF66-3546-788F-6BA54FF642D3":{"enter_time":0,"exit_time":0}};
//        users.saveCourseHistory(user,testCH);

        $scope.doRefresh = function() {
            courses.requestCoursesFromServer(user.id).then(function(data){
                console.log('返回成功' + eval(data).success);
                if(eval(data).success === 1){

                    var courseHistory = users.getCourseHistory(user.id);
                    if (DEBUG) console.log(courseHistory);

                    if(courseHistory){
                        var courses = eval(data).data;
                        for(var i=0; i<courses.length; i++){
                            var ch = courseHistory[courses[i].course_id];
                            if(ch){
                                courses[i].enter_time = ch.enter_time;
                                courses[i].exit_time = ch.exit_time;
                                $scope.courses_history.push(courses[i]);
                            } else {
                                console.log("no such course history");
                            }
                        }
//                        }
                        if(DEBUG) console.log($scope.courses_history);
                    }
                }
                else{
                    console.log(eval(data).message);
                }
            }, function(data){
                console.log('返回失败 ', data);
            });
        };

        $scope.doRefresh();
});


//angular.module('starter.controllers')
//    .controller('CourseHistoryCtrl', function($scope,$ionicPlatform,courses,users,testService) {
//
//        $scope.user = users.lastLoginUser();
//
//        $scope.doRefresh = function() {
//            courses.requestCoursesFromServer($scope.user.id).then(function(data){
//                console.log('返回成功' + eval(data).success);
//                if(eval(data).success === 1){
//                    $scope.courses_history  = eval(data).data;
//                    if(DEBUG) console.log($scope.courses);
//
//                    //$scope.$broadcast('scroll.refreshComplete');
//                }
//                else{
//                    alert(eval(data).message);
//                }
//            }, function(data){
//                console.log('返回失败' + data);
//            });
//        };
//
//        if(!FAKE_DATA){
//            $scope.doRefresh();
//        }
//        else {
//            $scope.courses = testService.getCourses();
//            console.log("faked data - ", $scope.courses);
//        }
//    });