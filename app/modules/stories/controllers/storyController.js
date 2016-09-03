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
                ['h1', 'h4', 'h5', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline'],
                ['ul', 'ol'],
                ['insertLink', 'insertImage', 'insertVideo'],
                ['wordcount', 'charcount'],
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
                $scope.chapters.push({"number":$scope.chapterCount, "contents":[]});

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

            var prepareNewChapters = function(){
                var newChapters = [];

                for(var i=0; i<$scope.chapters.length;i++){
                    var newChapter = {};
                    newChapter.title = angular.element('#chapter'+$scope.chapters[i].number+'_title').val()
                    newChapter.text = angular.element('#chapter'+$scope.chapters[i].number+'_text').val()
                    newChapter.number = i;
                    newChapter.contents = $scope.chapters[i].contents;
                    newChapters.push(newChapter);
                }
                return newChapters;

            }

            $scope.saveStory = function(){
                var newStory = {};
                newStory.title = $scope.story_title;
                newStory.chapters = prepareNewChapters();
                $http.post(API_CONF.STORY_MANAGER_URL + '/stories', {
                    title: newStory.title,
                    chapters: newStory.chapters
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
                            "contentId": 9
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
                /*
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
                });*/
            }

            var prepareNewChapters = function(){
                var newChapters = [];

                for(var i=0; i<$scope.chapters.length;i++){
                    var newChapter = {};
                    newChapter.title = angular.element('#chapter'+$scope.chapters[i].number+'_title').val()
                    newChapter.text = angular.element('#chapter'+$scope.chapters[i].number+'_text').val()
                    newChapter.number = i;
                    newChapter.contents = $scope.chapters[i].contents;
                    newChapters.push(newChapter);
                }
                return newChapters;

            }

            $scope.addChapter = function(){
                $scope.chapterCount++
                $scope.chapters.push({"number":$scope.chapterCount, "contents":[]});

                /*setTimeout(function () {
                    $location.hash('chapter' + $scope.chapterCount);
                    $anchorScroll();
                }, 300) */
            };

            $scope.saveStory = function(){
                var newStory = {};
                newStory.title = $scope.story_title;
                newStory.chapters = prepareNewChapters();

                $http.put(API_CONF.STORY_MANAGER_URL + '/stories/' + $scope.story.id, {
                    id: $scope.story.id,
                    title: newStory.title,
                    chapters: newStory.chapters,
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
                            "contentId": 9
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
                /*
                $http.get(API_CONF.STORY_MANAGER_URL + '/stories', {params: {id:$routeParams.storyId, getList:false}}).then(function(response){
                    if(response){
                        $scope.story = response.data.result;
                       //$scope.story = {"id":146,"chapters":[{"number":0,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"Introduction","contents":[{"type":0,"index":1,"stringIndex":150,"contentId":214},{"type":0,"index":1,"stringIndex":150,"contentId":215}]},{"number":1,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"After Deleted Chapter","contents":[{"type":1,"index":2,"stringIndex":153,"contentId":216}]},{"number":2,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"Conclusion","contents":[{"type":0,"index":1,"stringIndex":152,"contentId":217}]}],"title":"Test Story One"}
                        $scope.storyTitle = $scope.story.title;
                        $scope.storyChapters = $scope.story.chapters;
                        //countContents();
                        //organizeContents();
                    }
                });*/
            }

            var countContents = function(){
                for(var i=0; i<$scope.storyChapters.length;i++) {
                    allContentCount += $scope.storyChapters[i].contents.length;
                }
            }


            var organizeContents = function(){
                for(var i=0; i<$scope.storyChapters.length;i++){
                    $scope.storyChapters[i].metrics = [];
                    $scope.storyChapters[i].visualizations = [];
                    $scope.storyChapters[i].causals = [];
                    for(var j=0; j<$scope.storyChapters[i].contents.length; j++){
                        switch($scope.storyChapters[i].contents[j].type){
                            case 0:{
                                var m_id = 1;
                                //var m_id = $scope.storyChapters[i].contents[j].index;
                                $scope.storyChapters[i].metrics.push(Metric.get({id: m_id}, function (metric) {
                                    addContentToScope(0, 0, metric);
                                }, function (err) {
                                    throw {message: JSON.stringify(err.data)};
                                }));
                            }
                                break;
                            case 1:{
                                var v_id = 1;
                                //var v_id = $scope.storyChapters[i].contents[j].index;
                                $scope.storyChapters[i].visualizations.push(Visualization.get({id: v_id}, function (visualization) {
                                    addContentToScope(0,1,visualization);
                                }, function (err) {
                                    throw {message: JSON.stringify(err.data)};
                                }));
                            }
                                break;
                            case 2:{
                                var c_id = 1;
                                //var c_id = $scope.storyChapters[i].contents[j].index;
                                $scope.storyChapters[i].causals.push(Visualization.get({id: c_id}, function (causal) {
                                    //addContentToScope(i, 2, causal);
                                }, function (err) {
                                    throw {message: JSON.stringify(err.data)};
                                }));
                            }
                                break;
                        }
                    }
                }
            }

            var addContentToScope = function(chapter,type, content){
                switch(type){
                    case 0:{
                        $scope.storyChapters[chapter].metrics.push(content);
                    }
                        break;
                    case 1:{
                        $scope.storyChapters[chapter].visualizations.push(content);
                    }
                        break;
                    case 2:{
                        $scope.storyChapters[chapter].causals.push(content);
                    }
                }

                contentCount++;
                if(allContentCount == contentCount){
                    addContentsToHtml();
                }

            }

            var addContentsToHtml = function(){
                for(var i=0; i<$scope.storyChapters.length;i++){
                    console.log("visu " + angular.toJson($scope.storyChapters[i].visualizations[0]));
                }

            }

            $scope.jumpToChapter = function(number){
                var old = $location.hash();
                $location.hash('anchor-chapter'+number);
                $anchorScroll();
                $location.hash(old);
            }

            $scope.init();

        }
    ]);

