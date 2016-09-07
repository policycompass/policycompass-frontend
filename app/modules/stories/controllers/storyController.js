/**
 * Module for all Story Controllers
 */

angular.module('pcApp.stories.controllers.storyController', ['pcApp.stories.services.storyServices'])
angular.module('pcApp.stories.controllers.storyController', ['textAngular'])

    .config(function($provide){
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taOptions.toolbar = [
                ['h1', 'h4', 'h5', 'p', 'quote'],
                ['bold', 'italics', 'underline'],
                ['ul', 'ol'],
                ['insertLink', 'insertImage', 'insertVideo'],
                ['undo', 'redo']
            ];
            return taOptions;
        }]);
    })

    .factory('StoryCreateControllerHelper', function(){
        return {
            sendStory: function(story){
                return true;
            }
        };
    })
    /**
     * Controller to create a story
    */
    .controller('StoryCreateController', [
        '$scope',
        'Story',
        'Chapter',
        'Content',
        '$location',
        '$log',
        'dialogs',
        'storyServices',
        'Auth',
        '$filter',
        '$routeParams',
        '$compile',
        '$http',
        'API_CONF',
        function ($scope, Story, Chapter, Content, $location, $log, dialogs, storyServices, Auth, $filter, $routeParams, $compile, $http, API_CONF) {

            $scope.init = function(){
                $scope.userState = Auth.state;
                $scope.mode = "create";
                $scope.chapters =  [];
                $scope.chapterCount = 0;
                $scope.chaptersDOMIndices = [];
                $scope.addChapter();
                $(function () {
                  $('[data-toggle="tooltip"]').tooltip()
                })
            }

            $scope.addChapter = function(){
                $scope.chapterCount++;
                $scope.chapters.push({"title": "", "number":$scope.chapterCount, "contents":[]});

            };

            $scope.removeChapter = function(index){
                var dlg = dialogs.confirm("Are you sure you want to remove this chapter?");
                dlg.result.then(function () {
                    $("#chapter"+index).remove();
                    for(var j=0; j<$scope.chapters.length;j++){
                        if($scope.chapters[j].number == index){
                            $scope.chapters.splice(j, 1);
                        }
                    }
                });
            };

            $scope.removeFromChapter = function (chapterIndex, contentIndex, contentType) {
                var dlg = dialogs.confirm("Delete this " + contentType + "?");
                dlg.result.then(function () {
                    try {
                        $scope.chapters[chapterIndex].contents.splice(contentIndex, 1);
                    }
                    catch(err) {
                        alert("err " + err + ": failed to remove " + contentType);
                    }
                })
            }


            $scope.saveStory = function(){
                $http.post(API_CONF.STORY_MANAGER_URL + '/stories', {
                    title: $scope.story_title,
                    chapters: $scope.chapters
                }).then(function(response){
                    if(response){
                        $location.path('/stories/' + response.data.result.id);
                    }
                });
            }

            $scope.init();

        }
    ])
    /**
     * Controller to edit a story
    */
    .controller('StoryEditController', [
        '$scope',
        'Story',
        'Chapter',
        'Content',
        '$location',
        '$log',
        'dialogs',
        'storyServices',
        'Auth',
        '$filter',
        '$routeParams',
        '$compile',
        '$http',
        'API_CONF',
        '$anchorScroll',
        function ($scope, Story, Chapter, Content, $location, $log, dialogs, storyServices, Auth, $filter, $routeParams, $compile, $http, API_CONF, $anchorScroll) {


            $scope.init = function(){
                $scope.mode = "edit";
                $scope.mediaSmall = true;
                $scope.userState = Auth.state;
                $scope.chapterCount = 0;
                $scope.chapters = [];
                $scope.chaptersDOMIndices = [];
                getStory();
            }

            var getStory = function(id){
                /*
                $scope.story = {
                    "title":"Test Story One",
                    "id":146,
                    "chapters": [
                    {
                        "number": 0,
                        "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                        "title": "Introduction",
                        "contents": []
                    },
                    {
                        "number":1,
                        "text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                        "title": "After Deleted Chapter",
                        "contents": [
                        {
                            "type": "visualization",
                            "contentId": 69
                        }]
                    },
                    {
                        "number": 2,
                        "text": "<h1>Hier kommt die Überschrift</h1><h6>Das ist die Unterüberschrift</h6><p><img src='https://i.ytimg.com/vi/0SDNXhkojw4/sddefault.jpg'/><br/></p><p>Das ist ein Text.</p><blockquote><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr. No sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p></blockquote><p><b>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</b></p><p><br/></p><h6>Das ist die Unterüberschrift<br/><br/><b>Das ist ein Text.</b></h6>",
                        "title": "Conclusion",
                        "contents": []
                    }]
                };

                $scope.storyTitle = $scope.story.title;
                $scope.story_title = $scope.storyTitle;
                $scope.storyChapters = $scope.story.chapters;
                $scope.chapters = $scope.storyChapters;
                $scope.chapterCount = $scope.chapters.length;
                $scope.oldContents = [];
                for(var i=0; i<$scope.storyChapters.length;i++){
                    for(var j=0; j<$scope.storyChapters[i].contents.length;j++){
                        $scope.oldContents.push($scope.storyChapters[i].contents[j]);
                    }
                }
                */

                $http.get(API_CONF.STORY_MANAGER_URL + '/stories', {params: {id:$routeParams.storyId, getList:false}}).then(function(response){
                    if(response){
                        $scope.story = response.data.result;
                        $scope.storyTitle = $scope.story.title;
                        $scope.story_title = $scope.storyTitle;
                        $scope.storyChapters = $scope.story.chapters;
                        $scope.chapters = $scope.storyChapters;
                        $scope.chapterCount = $scope.chapters.length;
                        $scope.oldContents = [];
                        for(var i=0; i<$scope.storyChapters.length;i++){
                            for(var j=0; j<$scope.storyChapters[i].contents.length;j++){
                                $scope.oldContents.push($scope.storyChapters[i].contents[j]);
                            }
                        }
                    }
                });
            }


            $scope.addChapter = function(){
                $scope.chapterCount++
                $scope.chapters.push({"title": "", "number":$scope.chapterCount, "contents":[]});

                /*setTimeout(function () {
                    $location.hash('chapter' + $scope.chapterCount);
                    $anchorScroll();
                }, 300) */
            };

            $scope.saveStory = function(){
                $http.put(API_CONF.STORY_MANAGER_URL + '/stories/' + $scope.story.id, {
                    id: $scope.story.id,
                    title: $scope.story_title,
                    chapters: $scope.chapters,
                    oldContents: $scope.oldContents
                }).then(function(response){
                    if(response){
                        $location.path('/stories/' + response.data.result.id);
                    }
                });
            }

            $scope.removeChapter = function(index){
                var dlg = dialogs.confirm("Are you sure you want to remove this chapter?");
                dlg.result.then(function () {
                    $("#chapter"+index).remove();
                    for(var j=0; j<$scope.chapters.length;j++){
                        if($scope.chapters[j].number == index){
                            $scope.chapters.splice(j, 1);
                        }
                    }
                });
            };

            $scope.removeFromChapter = function (chapterIndex, contentIndex, contentType) {
                var dlg = dialogs.confirm("Delete this " + contentType + "?");
                dlg.result.then(function () {
                    try {
                        $scope.chapters[chapterIndex].contents.splice(contentIndex, 1);
                    }
                    catch(err) {
                        alert("err " + err + ": failed to remove " + contentType);
                    }
                })
            }

            $scope.init();
        }
    ])

    .controller('StoryDetailController', [
        '$scope',
        'Story',
        'Chapter',
        'Content',
        'Visualization',
        'Metric',
        '$location',
        '$log',
        'dialogs',
        'storyServices',
        'Auth',
        '$filter',
        '$routeParams',
        '$compile',
        '$http',
        'API_CONF',
        '$anchorScroll',
        function ($scope, Story, Chapter, Content, Visualization, Metric, $location, $log, dialogs, storyServices, Auth, $filter, $routeParams, $compile, $http, API_CONF, $anchorScroll) {

            var contents = [];
            var contentCount = 0;
            var allContentCount = 0;
            $scope.init = function(){
                $scope.userState = Auth.state;
                contents.metrics = {};
                contents.visualizations = {};
                contents.causals = {};
                getStory();
            }

            var getStory = function(id){
                /*
                $scope.story = {
                    "title":"Test Story One",
                    "id":146,
                    "chapters": [
                    {
                        "number": 0,
                        "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                        "title": "Introduction",
                        "contents": []
                    },
                    {
                        "number":1,
                        "text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                        "title": "After Deleted Chapter",
                        "contents": [
                        {
                            "type": "visualization",
                            "contentId": 69
                        }]
                    },
                    {
                        "number": 2,
                        "text": "<h1>Hier kommt die Überschrift</h1><h6>Das ist die Unterüberschrift</h6><p><img src='https://i.ytimg.com/vi/0SDNXhkojw4/sddefault.jpg'/><br/></p><p>Das ist ein Text.</p><blockquote><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr. No sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p></blockquote><p><b>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</b></p><p><br/></p><h6>Das ist die Unterüberschrift<br/><br/><b>Das ist ein Text.</b></h6>",
                        "title": "Conclusion",
                        "contents": []
                    }]
                };
                $scope.storyTitle = $scope.story.title;
                $scope.storyChapters = $scope.story.chapters;
                */

                $http.get(API_CONF.STORY_MANAGER_URL + '/stories', {params: {id:$routeParams.storyId, getList:false}}).then(function(response){
                    if(response){
                        $scope.story = response.data.result;
                        $scope.storyTitle = $scope.story.title;
                        $scope.storyChapters = $scope.story.chapters;
                    }
                    if($scope.story == 500){
                        $location.path('/stories');
                    }
                });
            }

            var countContents = function(){
                for(var i=0; i<$scope.storyChapters.length;i++) {
                    allContentCount += $scope.storyChapters[i].contents.length;
                }
            }

            $scope.jumpToChapter = function(number){
                var old = $location.hash();
                $location.hash('anchor-chapter'+number);
                $anchorScroll();
                $location.hash(old);
            }

            $scope.deleteStory = function (story) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Story " + story.title + " permanently?");
                dlg.result.then(function () {
                    // Delete the story via the API
                    $http.delete(API_CONF.STORY_MANAGER_URL + '/stories/' + story.id).then(function(response){
                        if(response){
                            $location.path('/stories');
                        }
                    });
                });
            }

            $scope.init();

        }
    ]);

