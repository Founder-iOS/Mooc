/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
.controller('CourseDetailCtrl', function($scope,$stateParams,$ionicPlatform,courseDetail, testService) {

    $scope.index = 1;
    $scope.learningLesson = {chapterNo:0, lessonNo:3};      ///< 正在学习的课程

    var updateDatabase = function(courseFromServer){
        $ionicPlatform.ready(function(){

            // save course
            courseDetail.saveCourseToDB(courseFromServer).then(function(res){
                if(res.rowsAffected === 1) console.log("course save success");
                else                       console.log("course save fail");
            },function(err){
                console.log('error: ',err);
                courseDetail.updateCourseToDB(courseFromServer).then(function(res2){
                    if(res2.rowsAffected === 1) console.log("course update success");
                    else                        console.log("course update fail");
                },function(err2){
                },function(progress2){
                });
            },function(progress){
            });

            // save chapter
            //for(var i = 0; i < courseFromServer.chapters.length; i++){
            var updateChapter = function(chapterInd){
                if(chapterInd >= courseFromServer.chapters.length) return;
                console.log("chapter id ",chapterInd);
                var chapter = courseFromServer.chapters[chapterInd];
                courseDetail.saveChapterToDB(chapter,courseFromServer.course_id).then(function(res){
                    if(res.rowsAffected === 1) console.log("chapter save success");
                    else                       console.log("chapter save fail");
                    updateChapter(++chapterInd);
                },function(err){
                    console.log('error: ',err);
                    courseDetail.updateChapterToDB(chapter,courseFromServer.course_id).then(function(res2){
                        if(res2.rowsAffected === 1) console.log("chpater update success");
                        else                        console.log("chapter update fail");
                        updateChapter(++chapterInd);
                    },function(err2){
                    },function(progress2){
                    });
                },function(progress){
                });

                // update lesson
                var updateLesson = function(lessonInd){
                    if(lessonInd >= chapter.studyplans.length) return;
                    var l = chapter.studyplans[lessonInd];
                    courseDetail.getLessonFromDB(l.id).then(function(res){
                        var len = res.rows.length;
                        console.log("lesson "+lessonInd, l.id, 'len ', len);
                        if(len === 1){
                            var item = res.rows.item(0);
                            l.enter_time = item.enter_time;
                            l.exit_time = item.exit_time;
                            l.studyed = item.studyed;
                            courseDetail.updateLessonToDB(l, l.enter_time, l.exit_time, l.studyed, chapter.id);
                        } else {
                            courseDetail.saveLessonToDB(l, 0, 0, false, chapter.id);
                        }
                        updateLesson(++lessonInd);
                    },function(err){
                        console.log('error: ',err);
                    },function(progress){
                    });
                };

                updateLesson(0);
            };

            updateChapter(0);
        });
    };

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
                updateDatabase($scope.course);
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