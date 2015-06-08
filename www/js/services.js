var DEBUG = true;

angular.module('starter.services', [])

    .factory('users', function($localstorage,dbService,moocService) {
//     var user = {
//          username:'xiaoyu0915',
////          username:'teacher201503',//'xiaoyu0915',
//           password: '111111'
//     };

        return {
            getFromServer: function(name,password){
                return moocService.signIn(name,password);
            },
            lastLoginUser: function() {
                return user = $localstorage.getObject('lastLoginUser');
            },
            save: function(user){
                console.log('save user  is ' + user);
                $localstorage.setObject('lastLoginUser',user) ;
            }
        };
    })

    .factory('courses', function(dbService,moocService) {
        var courses;
        return {
            requestCoursesFromServer: function(userId) {
                return moocService.courseList(userId);
            }
        };
    })

    .factory('courseDetail', function(dbService,moocService) {
        var course;
        return {
            requestCourseDetailFromServer: function(courseId) {
                return moocService.courseDetail(courseId);
            },
            saveCourseToDB: function(course){
                var query = "INSERT INTO course (id,name,description,teacher_id,teacher_name,study_num,open_time,course_type,credit,period,professional,cover_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                var params =[course.course_id,course.name,course.description,course.teacher_id,course.study_num,course.open_time,course.course_type,course.credit,course.period,course.professional,course.cover_url];
                return dbService.executeSql(query,params);
            },
            updateCourseToDB: function(course){
                var query = "UPDATE course SET name='"+course.name+"',description='"+course.description+"',teacher_id='"+course.teacher_id+
                    "',study_num='"+course.study_num+"',open_time="+course.open_time+",course_type='"+course.course_type+"',credit='"+course.credit+
                    "',period='"+course.period+"',professional='"+course.professional+"',cover_url='" +course.cover_url + "' WHERE id='"+course.id+"'";
                var params =[];
                return dbService.executeSql(query,params);
            },
            getAllCoursesFromDB: function(){
                var query = "select * from course";
                var params = '';
                return dbService.executeSql(query,params);
            }
        }
    })

    .factory('lesson', function($ionicPlatform,$sce,dbService,moocService) {
        var baseUrl = function(username,password,lessonId) {
            var url = moocService.getServerAddress() + "/admin/auth/login?name=" + username + "&password="+ password + "&rediurl="+moocService.getServerAddress()+"/default/study/clientindex/fromouter/1/iscourse/1/id/"+lessonId + "/clienttype/";
            return url;
        };
        return {
            outlineUrl: function(username,password,lessonId) {
                var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'gscontent');
                return url;
            },
            homeworkUrl: function(username,password,lessonId) {
                var url =$sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'assignment');
                return url;
            },
            quizUrl: function(username,password,lessonId) {
                var url =$sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'quiz');
                return url;
            },
            postUrl: function(username,password,lessonId) {
                var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'post');
                return url;
            },
            notesUrl: function(username,password,lessonId) {
                var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'notes');
                return url;
            },
            evaluationUrl: function(username,password,lessonId) {
                var url = $sce.trustAsResourceUrl(baseUrl(username,password,lessonId) + 'evaluation');
                return url;
            },
            getResourcesFromServer: function(lessonId) {
                return moocService.lessonDetail(lessonId);
            },
            saveResourceToDB: function(resource){
                var query = "INSERT INTO resource (id,name,original_name,mime_type,file_path,progress,downloading,finishDownload,lesson_id) VALUES (?,?,?,?,?,?,?,?,?)";
                var params =[resource.id,resource.name,resource.original_name,resource.mime_type,resource.file_path,resource.progress,resource.downloading,resource.finishDownloadresource,resource.lesson_id];
                return dbService.executeSql(query,params);
            },
            updateResourceToDB: function(resource){
                var query = "UPDATE resource SET name='"+resource.name+"',original_name='"+resource.original_name+"',mime_type='"+resource.mime_type+
                    "',file_path='"+resource.file_path+"',progress="+resource.progress+",downloading='"+resource.downloading+"',finishDownload='"+resource.finishDownload+
                    "',lesson_id='"+resource.lesson_id+"' WHERE id='"+resource.id+"'";
                var params =[];
                return dbService.executeSql(query,params);
            },
            getResourceFromDB: function(resource){
//                var query = "SELECT * frmo resource (id,name,true_name,original_name,mime_type,file_path,progress,downloading,finishDownload) VALUES (?,?,?,?,?,?,?,?,?)";
//                var params =[resource.id,resource.name,resource.true_name,resource.original_name,resource.mime_type,resource.file_path,resource.progress,resource.downloading,resource.finishDownload];
//                dbService.executeSql(query,params);

            },
            getAllResourceFromDB: function(){
                var query = "select * from resource";
                var params = '';
                return dbService.executeSql(query,params);
            },
            getFinishDownloadResourceFromDB: function(){

            }

        };
    })

    .factory('deviceService', function($cordovaDevice) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var device ;
        return {
            get: function() {
                document.addEventListener("deviceready", function () {
                    var device = $cordovaDevice.getDevice();

                    var cordova = $cordovaDevice.getCordova();

                    var model = $cordovaDevice.getModel();

                    var platform = $cordovaDevice.getPlatform();

                    var uuid = $cordovaDevice.getUUID();

                    var version = $cordovaDevice.getVersion();
                    alert('version is'+ version);
                }, false);
                return device;
            }
        };
    })

    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .factory('downloadService', function($ionicPlatform,$cordovaFileTransfer,$timeout,lesson) {
        var downloadTasks = new Array();
        var download;
        var  getFileName = function(o){
            var pos=o.lastIndexOf("/");
            return o.substring(pos+1);
        };
        var startDownload = function(resource){
            $ionicPlatform.ready(function(){
                alert('download resouce is ' + resource.name);
                var url = resource.file_path;
                var file_name = getFileName(url);
                var fileDir = cordova.file.documentsDirectory + file_name;
                console.log('full fileDir is: ' + fileDir);
                  download = $cordovaFileTransfer.download(url, fileDir)
                    .then(function (success) {
                        console.log("download success " + JSON.stringify(success));
                          finishDownload(resource)
                    }, function (error) {
                        console.log("download Error " + JSON.stringify(error));
                        faildDownload(resource);
                    }, function (progress) {
                        $timeout(function () {
                            resource.progress = (progress.loaded / progress.total) * 100;
                            console.log("download progress " + resource.progress);

                        });
                    });
            })
        };
        var finishDownload = function(resource){
            resource.finishDownload = true;
            console.log('完成下载' + resource);
            lesson.updateResourceToDB(resource);
            downloadTasks.splice(downloadTasks.indexOf(resource), 1);
            if(downloadTasks.length > 0){
                var resource = downloadTasks[0]
                console.log('开启新的下载' + resource);
                startDownload(resource);
            }
        };
        var faildDownload = function(resource){
            downloadTasks.splice(downloadTasks.indexOf(resource), 1);
            console.log('下载失败' + resource);
            lesson.updateResourceToDB(resource);
            if(downloadTasks.length > 0){
                var resource = downloadTasks[0]
                console.log('下载失败后开启新的下载' + resource);
                startDownload(resource);
            }
        };
        return {
            addDownloadTask: function(resource) {
                downloadTasks.push(resource);
                resource.downloading = true;
                if(downloadTasks.length === 1){
                   console.log('开启第一个下载');
                   startDownload(resource);
                }
            },
            removeDownloadTask: function(resource) {
                var index = downloadTasks.indexOf(resource);
                if(index === 0){
                    console.log('取消下载为当前下载');
                    if(download){
                        download.abort();
                    }
                }
                console.log('停止下载');
                //lesson.updateResourceToDB(resource);
                resource.downloading = false;
                downloadTasks.splice(index, 1);
            },
            getDownloadResource:function(resource){
                for( var i=0,len=downloadTasks.length; i<len; i++ ){
                    var task =  downloadTasks[i];
                    if(task.id === resource){
                        return task;
                    }

                }

            }
        }
    })

    .factory('dbService', function($ionicPlatform,$cordovaSQLite,$q) {
        var db;
        var  openDB = function(){
            db =  $cordovaSQLite.openDB("mooc.db",0);
        };
        return {
            initDB: function(){
                openDB();
                console.log('init db');
                //创建用户表
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id text primary key,name text,true_name text,email text,qq text,mobile text,phone text,address text,icon_path text,role integer,sex integer)",'');
                //创建课程表
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS course (id text primary key,name text,description text,teacher_id text,teacher_name text,study_num integer,open_time double,course_type integer,credit integer,period integer,professional text,cover_url text)",'');
                //章节表
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chapter (id text primary key,name text)",'');
                //课时表
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS lesson (id text primary key,name text,creater text,ctime double,icon_path text,enter_time double,exit_time double,studyed bool)",'');

                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS resource (id text primary key,name text,original_name text,mime_type text,file_path text,progress float,downloading bool,finishDownload bool,lesson_id text)",'');
            },

            executeSql: function(query,params){
                console.log('executeSql');
                var deferred = $q.defer();
                $ionicPlatform.ready(function() {
                    //query = "select * from resource";
                    //params = '';
                    console.log('query and params is ',query,params);
                    $cordovaSQLite.execute(db, query, params).then(function(res) {
                        // if(DEBUG) console.log('操作数据库结果:' + JSON.stringify(res));
                        console.log('操作数据库结果:' + JSON.stringify(res));
                        deferred.resolve(res);
                    }, function (err) {
                        console.error(err);
                        deferred.reject(err);
                    });
                });
                return deferred.promise;
            },
            addChapter: function(){
                var query = "INSERT INTO chapter (id,name) VALUES (?,?)";
                var params =['1','li'];
                executeSql(query,params);
                var params1 =['2','leichuan'];
                executeSql(query,params);

            },
            updateChapter: function(){
                var query = "update chapter set name = ? where id = '1'";
                var params =['zhiwei'];
                executeSql(query,params);
                executeSql(query,params);
            },
            getAllChapters: function(){
               var query = "select * from chapter";
                var params =[];
            executeSql(query,params);
            }

        }
    })

    .service('moocService', function($http, $q){
        var serverAddress = 'http://42.62.16.168:8080';
//  var serverAddress = 'http://172.19.43.55:8080';
        var baseUrl = serverAddress + '/api?method=';
        var makeUrl = function(parms){
            var finalUrl = baseUrl + parms + '&callback=JSON_CALLBACK';
            console.log('finalUrl is ' + finalUrl);
            return finalUrl;
        }

        var request = function(finalUrl){
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url:finalUrl
            }).success(function(data){
                console.log('success' + data);
                deferred.resolve(data);
            }).error(function(){
                console.log('faild');
                deferred.reject('There was an error');
            });
            return deferred.promise;
        }
        this.getServerAddress = function(){
            return serverAddress;
        }
        // 用户登录
        this.signIn = function(name,password){
            //var parms = 'userAuth&user_name='+ user.username +'&user_pwd='+ user.password +'&udid='+'11111';
            var parms = 'userAuth&user_name='+ name +'&user_pwd='+ password +'&udid='+'11111' +'&type=1';    ///<! 明文密码
            console.log('parms is '+ parms);
            var finalUrl = makeUrl(parms);
            return request(finalUrl);
        }
        // 课程列表
        this.courseList = function(userId){
            var parms = 'courseList&user_id=' + userId;
            console.log('courseList parms is'+ parms);
            var finalUrl =makeUrl(parms);

            return request(finalUrl);
        }
        // 课程详情
        this.courseDetail = function(courseId){
            var parms = 'courseDetail&course_id='+courseId;
//    var parms = 'courseDetail&course_id=AB252A87-1C94-3ABA-40BC-1E4AFCD25012';
            console.log('parms is '+ parms);
            var finalUrl =makeUrl(parms);
            return request(finalUrl);
        }
        //lesson详情
        this.lessonDetail = function(lessonId){
            var parms ='getSingleStudyPlan&studyplan_id='+lessonId;
            console.log('parms is '+ parms);
            var finalUrl = makeUrl(parms);
            return request(finalUrl);
        };
    })

    .service('testService', function(){
        /// course profile
        var courses = function(){
            var res = [];
            var courseNum = 10;
            var i = 0;
            while(i++ < courseNum){
                var _course = {
                    course_id: i,
                    course_name: "我的课程"+i,
                    cover_url: function(){
                        return "/img/" + (Math.floor(Math.random()*4)+1) + ".jpg";
                    }(),
                    study_num: Math.floor(Math.random() * 50),
                    open_time: (Date.now() + Math.floor(Math.random()*1000))/1000
                };
                res.push(_course);
            }
            return res;
        }();

        /// course details
        var courseDetails = function(){
            var chapters = [];
            var res = {
                success:1,
                message:"",
                data:chapters
            };

        }();

        this.getCourses = function(){
            return courses;
        }

        this.getCourseDetails = function(){
            return {"success":1,"message":"","data":{"course_id":"AB252A87-1C94-3ABA-40BC-1E4AFCD25012","course_name":"sfdfsdf","teacher_id":"E2AE0797-96AB-D468-84D4-3A70718985A4","teacher_name":"\u9648\u56fd\u51ac\u8001\u5e08","study_num":"111","open_time":"1425139200","end_time":"1427731200","course_type":"1427731200","credit":"11","period":"11","professional":"\u6863\u6848\u7ba1\u7406","description":"sdfsfwfsdfsdfsdfsf","cover_url":"http:\/\/172.19.43.88:8080\/data\/uploads\/Courses\/AB252A87-1C94-3ABA-40BC-1E4AFCD25012\/bdf624560206c7829dcf13552bcc3735.jpg","chapters":[{"id":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","name":"1","studyplans":[{"id":"8996590F-E596-9F0B-7713-6A834BAB75D9","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485564","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"6919F23F-A079-9EB5-20A5-B44B0B050BC6","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485616","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"D748AB70-7FAA-7E23-3960-918EAAD3C201","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431485645","icon_path":"\/public\/admin\/images\/default1.png"},{"id":"EBCE0BD1-AD24-ACBB-7875-615124321C23","name":"78ad497936ad973b3df916b5eae0c0df","pId":"5BF482ED-B5FF-A8FE-3FD1-C34BCE750AAA","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1431502158","icon_path":"\/public\/admin\/images\/default1.png"}]},{"id":"6D5CB29A-BFE4-19E4-3A08-3A4F229D8583","name":"232121","studyplans":[{"id":"DFD2DCBE-7835-2327-A746-CA0A8CDEB96E","name":"q3","pId":"6D5CB29A-BFE4-19E4-3A08-3A4F229D8583","creater":"\u9648\u56fd\u51ac\u8001\u5e08","ctime":"1432882105","icon_path":"http:\/\/172.19.43.88:8080\/data\/uploads\/Courses\/DFD2DCBE-7835-2327-A746-CA0A8CDEB96E\/5881202fe8e50696fcb9dc907aaafa43.jpg"}]}]}};
        }
    });

