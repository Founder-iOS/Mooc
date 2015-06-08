/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
    .controller('LessonCtrl', function($scope,$rootScope,$stateParams, $ionicPlatform,$cordovaInAppBrowser,$cordovaFileOpener2,downloadService,lesson,users) {
        $scope.user = users.lastLoginUser();
        var formatResource = function(){
            console.log('课时详情结果:' +  JSON.stringify($scope.lesson.resources));
            //downloadService.getAllResourceFromDB('11');
            
            for( var i=0,len= $scope.lesson.resources.length; i<len; i++ ){
                resource = $scope.lesson.resources[i];
                console.log('resource is ' +  JSON.stringify(resource));
                var task =  downloadService.getDownloadResource(resource);
                if(task){
                    resource = task;
                }
                else{
                    console.log('不在下载队列');
                    resource.progress = 0;
                    resource.downloading = false;
                    resource.finishDownload = false;
                    resource.lesson_id = $scope.lesson.id;
                }
                //lesson.saveResourceToDB(resource);
            }
        };

        $scope.openResource = function(resource){
            console.log(resource.file_path);
            if(resource.finishDownload){
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
//            $cordovaFileOpener2.open(
//                fileDir,
//                'application/pdf'
//            ).then(function() {
//                    // file opened successfully
//                }, function(err) {
//                    // An error occurred. Show a message to the user
//                });

                    //内置浏览器打开
                    $cordovaInAppBrowser.open(fileDir, '_blank', options)
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
            }



        };
        $scope.getFileName = function(o){
            var pos=o.lastIndexOf("/");
            return o.substring(pos+1);
        };
        $scope.downloadResource = function(resource){
            if(resource.downloading){
                downloadService.removeDownloadTask(resource);
            }
            else{
                downloadService.addDownloadTask(resource);
            }
        };

        $scope.outlineUrl = lesson.outlineUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        $scope.homeworkUrl =lesson.homeworkUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        $scope.quizUrl = lesson.quizUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        $scope.postUrl = lesson.postUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        $scope.notesUrl = lesson.notesUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        $scope.evaluationUrl = lesson.evaluationUrl($scope.user.name,$scope.user.password,$stateParams.lessonId);
        console.log('$scope.outlineUrl is ' + $scope.outlineUrl);
        $scope.doRefresh = function() {
            lesson.getResourcesFromServer($stateParams.lessonId).then(function(data){
                console.log('课时详情返回成功' + eval(data).success);
                if(eval(data).success === 1){
                    $scope.lesson = eval(data).data;
                    formatResource();

                    //console.log("getResources success");
                }else{
                    //console.log("getResources fail");
                }
            }, function(data){
                deferred.reject(data);
                console.log('课时详情返回失败' + data);
            });
        };
        //$scope.doRefresh();

        var resource = {"id":"62148D41-9311-B5AD-129C-34EEE8B896AB"+Math.random()*10000,"name":"互联网思维01","original_name":"互联网思维01","mime_type":"video/mp4","size":"372450294","file_path":"http://42.62.16.168:8080/data/uploads/Courses/60C0FC3C-251B-9A7B-3C02-0CA02B0ED809/f05d55a4f3161e69e24044df614e71c2.mp4",
                "progress":0,"downloading":false,"finishDownload":false};
        $scope.lesson = {"resources":[resource]};
        
        $ionicPlatform.ready(function(){
            console.log("begin outer test");
            // get
            lesson.getAllResourceFromDB().then(function(res){
                var len = res.rows.length;
                console.log("getAllResourceFromDB resources length: ",len);

                if(len>0){
                    for (var i = 0; i < len; i++){
                        console.log(i+" row: ",res.rows.item(i)['name']);
                    }
                } else {
                    console.log("no rows");
                }
            },function(err){
            },function(progress){
            });
            console.log("end outer test");

            // save
            lesson.saveResourceToDB(resource).then(function(res){
                if(res.rowsAffected === 1) console.log("save success");
                else                       console.log("save fail");
            },function(err){
            },function(progress){
            });

            // get
            lesson.getAllResourceFromDB().then(function(res){
                var len = res.rows.length;
                console.log("getAllResourceFromDB resources length: ",len);

                if(len>0){
                    for (var i = 0; i < len; i++){
                        console.log(i+" row: ",res.rows.item(i)['name']);
                    }
                } else {
                    console.log("no rows");
                }
            },function(err){
            },function(progress){
            });

            // update
            resource.name = "name changed";
            lesson.updateResourceToDB(resource).then(function(res){
                if(res.rowsAffected === 1) console.log("update success");
                else                       console.log("update fail");
            },function(err){
                console.log("update fail:",err);
            },function(progress){
            });

            // get
            lesson.getAllResourceFromDB().then(function(res){
                var len = res.rows.length;
                console.log("getAllResourceFromDB resources length: ",len);

                if(len>0){
                    for (var i = 0; i < len; i++){
                        console.log(i+" row: ",res.rows.item(i)['name']);
                    }
                } else {
                    console.log("no rows");
                }
            },function(err){
            },function(progress){
            });
        });

    });
