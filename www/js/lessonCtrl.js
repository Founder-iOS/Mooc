/**
 * Created by charlyzhang on 15-6-4.
 */

angular.module('starter.controllers')
    .controller('LessonCtrl', function($scope,$rootScope,$stateParams, $ionicPlatform,$cordovaInAppBrowser,$cordovaFileOpener2,downloadService,lesson,users) {
        $scope.user = users.lastLoginUser();

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
        $scope.index = 1;
        $scope.footerBarItems = [
                                 {title:'概述',index:0,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'资源',index:1,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'作业',index:2,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'测验',index:3,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'讨论',index:4,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'评价',index:5,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'},
                                 {title:'笔记',index:6,icon:'ion-ios-loop',selectIcon:'ion-ios-skipbackward'}
                                ];
        $scope.switchPage = function(index){
            $scope.index = index;
        };

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
        $scope.doRefresh();


        var formatResource = function(){
            console.log('课时详情结果:' +  JSON.stringify($scope.lesson.resources));

            var updateResourse = function(resourseInd){
                if(resourseInd >= $scope.lesson.resources.length) return;
                var resource = $scope.lesson.resources[resourseInd];
                resource.lesson_id = $scope.lesson.id;
                console.log('resource is ' +  JSON.stringify(resource));
                var task =  downloadService.getDownloadResource(resource);
                if(task){
                    resource = task;
                }
                else{
                    resource.downloading = false;
                }
                var dbResource;
                lesson.getResourceFromDB(resource).then(function(res){
                    var len = res.rows.length;
                    if(len === 1){
                        console.log('update db');
                        dbResource =  res.rows.item(0);
                        console.log('db resource is ' + JSON.stringify(dbResource));
                        if(!resource.downloading){
                            resource.progress = dbResource.progress;
                            resource.finishDownload =  dbResource.finishDownload;
                        }
                        console.log("resource id is "+ resource.id);
                        lesson.updateResourceToDB(resource);
                    }
                    else{
                        console.log('insert db');
                        resource.progress = 0;
                        resource.finishDownload = false;
                        lesson.saveResourceToDB(resource);
                    }
                    updateResourse(++resourseInd);
                },function(err){

                },function(progress){
                });
            };

            updateResourse(0);

//            lesson.getAllResourceFromDB().then(function(res){
//                var len = res.rows.length;
//                console.log("getAllResourceFromDB resources length: ",len);
//                if(len>0){
//                    for (var i = 0; i < len; i++){
//                        var dbResource = res.rows.item(i);
//                        console.log('db resource is ' + JSON.stringify(dbResource));
//                        console.log('db resource is rows is' + JSON.stringify(res.rows));
//                        console.log('db resource is rows is item' + JSON.stringify(res.rows.item));
//                    }
//                } else {
//                    console.log("no rows");
//                }
//            },function(err){
//            },function(progress){
//            });




        };

//        var resource = {"id":"62148D41-9311-B5AD-129C-34EEE8B896AB"+Math.random()*10000,"name":"互联网思维01","original_name":"互联网思维01","mime_type":"video/mp4","size":"372450294","file_path":"http://42.62.16.168:8080/data/uploads/Courses/60C0FC3C-251B-9A7B-3C02-0CA02B0ED809/f05d55a4f3161e69e24044df614e71c2.mp4",
//                "progress":0,"downloading":false,"finishDownload":false};
//        $scope.lesson = {"resources":[resource]};
//
//        $ionicPlatform.ready(function(){
//            console.log("begin outer test");
//            // get
//            lesson.getAllResourceFromDB().then(function(res){
//                var len = res.rows.length;
//                console.log("getAllResourceFromDB resources length: ",len);
//
//                if(len>0){
//                    for (var i = 0; i < len; i++){
//                        console.log(i+" row: ",res.rows.item(i)['name']);
//                    }
//                } else {
//                    console.log("no rows");
//                }
//            },function(err){
//            },function(progress){
//            });
//            console.log("end outer test");
//
//            // save
//            lesson.saveResourceToDB(resource).then(function(res){
//                if(res.rowsAffected === 1) console.log("save success");
//                else                       console.log("save fail");
//            },function(err){
//            },function(progress){
//            });
//
//            // get
//            lesson.getAllResourceFromDB().then(function(res){
//                var len = res.rows.length;
//                console.log("getAllResourceFromDB resources length: ",len);
//
//                if(len>0){
//                    for (var i = 0; i < len; i++){
//                        console.log(i+" row: ",res.rows.item(i)['name']);
//                    }
//                } else {
//                    console.log("no rows");
//                }
//            },function(err){
//            },function(progress){
//            });
//
//            // update
//            resource.name = "name changed";
//            lesson.updateResourceToDB(resource).then(function(res){
//                if(res.rowsAffected === 1) console.log("update success");
//                else                       console.log("update fail");
//            },function(err){
//                console.log("update fail:",err);
//            },function(progress){
//            });
//
//            // get
//            lesson.getAllResourceFromDB().then(function(res){
//                var len = res.rows.length;
//                console.log("getAllResourceFromDB resources length: ",len);
//
//                if(len>0){
//                    for (var i = 0; i < len; i++){
//                        console.log(i+" row: ",JSON.stringify(res.rows.item(i)) );
//                    }
//                } else {
//                    console.log("no rows");
//                }
//            },function(err){
//            },function(progress){
//            });
//        });

    });
