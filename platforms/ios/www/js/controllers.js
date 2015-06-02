var DEBUG = true;

angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope,$rootScope,$ionicPlatform,$state,moocService,deviceService,dbService) {
  $rootScope.user = {
     username:'xiaoyu0915',
     password:'111111',
  };

  //deviceService.get();
  $scope.signIn = function(user) {
  if(DEBUG){
    console.log('Sign-In: ', user.username, user.password);
  }
    moocService.signIn(user)
    .then(function(data){
        console.log('返回成功' + eval(data).success);
          if(eval(data).success === 1){
            $rootScope.user = eval(data).data;
              if(ON_BROWSER){
                  dbService.saveUser($rootScope.user,$scope);
              }
            $state.go('courses');
          }
          else{
            alert(eval(data).message);
          }
      }, function(data){
        console.log('返回失败' + data);
      })
  };
})

.controller('CoursesCtrl', function($scope,$ionicPlatform,$rootScope,moocService,testService) {
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
          moocService.courseList($rootScope.user)
            .then(function(data){
                  console.log('返回成功' + eval(data).success);
                  if(eval(data).success === 1){
                    $scope.courses  =eval(data).data;
                    //$scope.$broadcast('scroll.refreshComplete');
                  }
                  else{
                    alert(eval(data).message);
                  }
                  }, function(data){
                      console.log('返回失败' + data);
               })
  };
  $scope.doRefresh();
  //  $scope.courses = testService.getCourses();
})
.controller('CourseDetailCtrl', function($scope,$stateParams,moocService,testService) {
  $scope.index = 1;
  $scope.learningLesson = {chapterNo:0, lessonNo:3};      ///< 正在学习的课程
  $scope.course;
  if(DEBUG){
    console.log('course detail id: ' + $stateParams.courseId);
  }
  
  moocService.courseDetail($stateParams.courseId)
    .then(function(data){
          console.log('课程详情返回成功' + eval(data).success);
          if(eval(data).success === 1){
               //$scope.course  =eval(data).data;
              if(DEBUG){
                  console.log($scope.course);
              }
             }else{
               alert(eval(data).message);
            }        
           }, function(data){
             console.log('课程详情返回失败' + data);
  })
    if(DEBUG){
        $scope.course = testService.getCourseDetails().data;
        console.log("faked data");
        console.log($scope.course);
    }
  $scope.navItems = [{title:'简介',index:0},{title:'课时',index:1}];
  $scope.navViews = [{title:'简介',index:0},{title:'课时',index:1}];
  $scope.goPage = function(index){
     $scope.index = index;
  };
  $scope.goStudyPlan = function(lessonId) {
        ///< 跳转到lessonId页面
  }
})
.controller('LessonCtrl', function($scope,$rootScope,$stateParams,$sce,$cordovaFileTransfer, $ionicPlatform,$cordovaInAppBrowser,$timeout,moocService) {
  $rootScope.user = {
           name:'xiaoyu0915',
           password: '111111'
  };
  $scope.openResource = function(resource){
    console.log(resource.file_path);
     var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };

   $ionicPlatform.ready(function(){
    $cordovaInAppBrowser.open(resource.file_path, '_blank', options)
      .then(function(event) {
        // success
            console.log('打开成功');
      })
      .catch(function(event) {
        // error
             console.log('打开失败');

      });
    //$cordovaInAppBrowser.close();
  }, false);

  };
  $scope.downloadResource = function(resource){
    document.addEventListener('deviceready', function () {
        var url = resource.file_path;
        var fileDir = cordova.file.documentsDirectory + "testImage.png";
        var download = $cordovaFileTransfer.download(url, fileDir).then(function (success) {
          console.log("success " + JSON.stringify(success));
          $timeout(function () {
            $scope.downloadProgress = 100
          }, 1000);
        }, function (error) {
          console.log("Error " + JSON.stringify(error));
        }, function (progress) {
          $timeout(function () {
            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
          });
        });
        if ($scope.downloadProgress > 0.1) {
          download.abort();
        }
      })
  };
  $scope.doRefresh = function() {
            moocService.lessonDetail($stateParams.lessonId)
            .then(function(data){
                  console.log('课时详情返回成功' + eval(data).success);
                  if(eval(data).success === 1){
                  $scope.resources  =eval(data).data.resources;
                  if(DEBUG){
                  console.log($scope.resources);
                  }
                  }else{
                  alert(eval(data).message);
                  }
                  }, function(data){
                  console.log('课时详情返回失败' + data);
                  })
    };
            
  if (DEBUG) {   
    $scope.resources =[{
                                id: 0,
                                name: '计算机基础教程',
                                image: 'img/1.jpg',
                                file_path:'http://172.19.42.53:8080/data/uploads/Courses/644BEAB7-A863-0DF5-6AAB-9FDE5E61526D/44968693f66091eea1dad22a2c42c708.jpg',
                                mine_type:"video/mp4",
                                original_name:'111'
                              },{
                                id: 0,
                                name: '计算机基础教程',
                                image: 'img/2.jpg',
                                file_path:'http://172.19.42.53:8080/data/uploads/Courses/644BEAB7-A863-0DF5-6AAB-9FDE5E61526D/44968693f66091eea1dad22a2c42c708.jpg',
                                mine_type:"video/mp4",
                                original_name:'111'
                              }]
      };
  $scope.doRefresh();
   $scope.outlineUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/gscontent");
   $scope.homeworkUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/assignment");
   $scope.quizUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/quiz");
   $scope.postUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/post");
    $scope.notesUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/notes");
    $scope.evaluationUrl = $sce.trustAsResourceUrl(moocService.getServerAddress() + "/admin/auth/login?name=" +$rootScope.user.name + "&password="+$rootScope.user.password+ "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+$stateParams.lessonId +"/clienttype/evaluation");
   console.log('$scope.outlineUrl is' + $scope.outlineUrl);
   console.log($scope.lesson);


})

