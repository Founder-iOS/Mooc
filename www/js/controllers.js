var DEBUG = true;

angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope,$rootScope,$ionicPlatform,$state,moocService,deviceService,dbService) {
  $rootScope.user = {
     username:'teacher201503',
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
.controller('LessonCtrl', function($scope,$rootScope,$stateParams) {
   $scope.lesson = {
                    id:'1',
                    outline:'http://www.baidu.com',
                    homework:'http://www.baidu.com',
                    quiz:'http://www.baidu.com',
                    discuss:'http://www.baidu.com',
                    comment:'http://www.baidu.com',
                    note:'http://www.baidu.com',
                    resources:[{
                                id: 0,
                                name: '计算机基础教程',
                                image: 'img/1.jpg',
                                fileUrl:'http://172.19.42.53:8080/data/uploads/Courses/644BEAB7-A863-0DF5-6AAB-9FDE5E61526D/44968693f66091eea1dad22a2c42c708.jpg'
                              },{
                                id: 0,
                                name: '计算机基础教程',
                                image: 'img/2.jpg',
                                fileUrl:'http://172.19.42.53:8080/data/uploads/Courses/644BEAB7-A863-0DF5-6AAB-9FDE5E61526D/44968693f66091eea1dad22a2c42c708.jpg'
                              }]
                  };
   $scope.outlineUrl = 'http://172.19.43.55:8080/admin/auth/login?name=teacher201503&password=111111&rediurl=http://172.19.43.55:8080/default/study/clientindex/fromouter/1/iscourse/1/id/8996590F-E596-9F0B-7713-6A834BAB75D9/clienttype/gscontent';

   console.log($scope.lesson);
})

