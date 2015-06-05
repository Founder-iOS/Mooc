/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
.controller('CourseDetailCtrl', function($scope,$stateParams,courseDetail,testService) {

    $scope.index = 1;
    $scope.learningLesson = {chapterNo:0, lessonNo:3};      ///< 正在学习的课程
    $scope.course;
    if(DEBUG){
        console.log('course detail id: ' + $stateParams.courseId);
    }
    if(FAKE_DATA){
        $scope.course = testService.getCourseDetails().data;
        console.log("faked data - ", $scope.course);
    }
    else
        courseDetail.requestCourseDetailFromServer($stateParams.courseId).then(function(data){
            console.log('课程详情返回成功' + eval(data).success);
            if(eval(data).success === 1){
                $scope.course =  eval(data).data;
                //$scope.course  =eval(data).data;
                if(DEBUG){
                    console.log($scope.course);
                }
            }else{
                alert(eval(data).message);
            }
        }, function(data){
            console.log('课程详情返回失败' + data);
        });

    $scope.navItems = [{title:'简介',index:0},{title:'课时',index:1}];
    $scope.navViews = [{title:'简介',index:0},{title:'课时',index:1}];
    $scope.goPage = function(index){
        $scope.index = index;
    };
    $scope.goStudyPlan = function(lessonId) {
        ///< 跳转到lessonId页面
    };

});