/**
 * Module for all Story Controllers
 */

angular.module('pcApp.stories.controllers.storyController', ['pcApp.stories.services.storyServices'])

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
            }

            $scope.addChapter = function(){
                $scope.chapterCount++;
                $scope.chapters.push({"chapterIndex":$scope.chapterCount, "contents":[]});
                angular.element(document.getElementById('chaptersDiv')).append($compile("<div id='chapter"+$scope.chapterCount+"' <ng-model='chapter"+$scope.chapterCount+"' class='well'> <div class='row'> <div class='col-xs-4'> <h4>Chapter "+$scope.chapterCount+"</h4> </div> <div class='btn-group col-xs-offset-7 col-xs-1 text-right'> <a href='' id='removeChapter+"+$scope.chapterCount+"' class='btn btn-danger fa-trash-o' ng-click='removeChapter("+$scope.chapterCount+")'></a> </div> </div> <br> <input class='form-control' id='chapter"+$scope.chapterCount+"_title' type='text' name='chapter"+$scope.chapterCount+"_title' data-ng-model='chapter"+$scope.chapterCount+"_title' placeholder='Chapter "+$scope.chapterCount+" Title' required> <br> <div id='chapter"+$scope.chapterCount+"_content' name='chapter"+$scope.chapterCount+"_content' class='story-chapter-content well'> <div id='chapter"+$scope.chapterCount+"_content_toolbox' name='chapter"+$scope.chapterCount+"_content_toolbox' class='story-chapter-content-toolbox'> <div class='row'> <div class='btn-group col-xs-4'> <a href='' id='addMetricButton"+$scope.chapterCount+"' class='btn btn-default fonticon-metric' ng-click='addToChapter("+$scope.chapterCount+", 0, "+1+")'></a> <a href='' id='addVisualisationButton"+$scope.chapterCount+"' class='btn btn-default fonticon-visualisation' ng-click='addToChapter("+$scope.chapterCount+", 1, "+2+")'></a> <a href='' id='addCausalButton"+$scope.chapterCount+"' class='btn btn-default fa-bar-chart-o' ng-click='addToChapter("+$scope.chapterCount+", 2)'></a> </div> </div> </div> <div> <textarea class='form-control' rows=10 id='chapter"+$scope.chapterCount+"_text' type='text' name='chapter"+$scope.chapterCount+"_text' data-ng-model='chapter"+$scope.chapterCount+"_text' required placeholder='Chapter "+$scope.chapterCount+" Text' required></textarea> </div></div> </div>")($scope));
            };

            $scope.removeChapter = function(index){
                var dlg = dialogs.confirm("Are you sure you want to remove this chapter?");
                dlg.result.then(function () {
                    $("#chapter"+index).remove();
                    for(var j=0; j<$scope.chapters.length;j++){
                        if($scope.chapters[j].chapterIndex == index){
                            $scope.chapters.splice(j, 1);
                        }
                    }
                });
            };

            $scope.addToChapter = function(chapterIndex, contentType, contentIndex){
                var arrayIndex = 0;
                for(var i=0; i<$scope.chapters.length;i++){
                    if($scope.chapters[i].chapterIndex == chapterIndex){
                        arrayIndex = i;
                    }
                }
                try{
                    $scope.chapters[arrayIndex].contents.push({"type":contentType, "index": contentIndex, "stringIndex": arrayIndex+10*15+contentType});
                }
                catch(e){
                }
            }

            var prepareNewChapters = function(){
                var newChapters = [];

                for(var i=0; i<$scope.chapters.length;i++){
                    var newChapter = {};
                    newChapter.title = $scope.$eval('chapter'+$scope.chapters[i].chapterIndex+'_title')
                    newChapter.text = $scope.$eval('chapter'+$scope.chapters[i].chapterIndex+'_text');
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
        function ($scope, Story, Chapter, Content, $location, $log, dialogs, storyServices, Auth, $filter, $routeParams, $compile, $http, API_CONF) {


            $scope.init = function(){
                $scope.mode = "edit";
                $scope.userState = Auth.state;
                $scope.chapterCount = 0;
                $scope.chapters = [];
                $scope.chaptersDOMIndices = [];
                getStory();
            }

            var getStory = function(id){
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
                        prepareChapters();
                        //organizeContents();
                        //splitChapterTextsForContents();
                    }
                });
            }

            $scope.addToChapter = function(chapterIndex, contentType, contentIndex){
                var arrayIndex = 0;
                for(var i=0; i<$scope.chapters.length;i++){
                    if($scope.chapters[i].chapterIndex == chapterIndex){
                        arrayIndex = i;
                    }
                }
                try{
                    $scope.chapters[arrayIndex].contents.push({"type":contentType, "index": contentIndex, "stringIndex": arrayIndex+10*15+contentType});
                }
                catch(e){
                }
            }

            var prepareNewChapters = function(){
                var newChapters = [];

                for(var i=0; i<$scope.chapters.length;i++){
                    var newChapter = {};
                    newChapter.title = $scope.$eval('chapter'+$scope.chapters[i].chapterIndex+'_title')
                    newChapter.text = $scope.$eval('chapter'+$scope.chapters[i].chapterIndex+'_text');
                    newChapter.number = i;
                    newChapter.contents = $scope.chapters[i].contents;
                    newChapters.push(newChapter);
                }
                return newChapters;

            }

            var prepareChapters = function(){
                for(var i=0; i<$scope.storyChapters.length; i++){
                    angular.element(document.getElementById('chaptersDiv')).append($compile("<div id='chapter"+$scope.storyChapters[i].number+"' <ng-model='chapter"+$scope.storyChapters[i].number+"' class='well'> <div class='row'> <div class='col-xs-4'> <h4>Chapter "+eval($scope.storyChapters[i].number+1)+"</h4> </div> <div class='btn-group col-xs-offset-7 col-xs-1 text-right'> <a href='' id='removeChapter+"+$scope.storyChapters[i].number+"' class='btn btn-danger fa-trash-o' ng-click='removeChapter("+$scope.storyChapters[i].number+")'></a> </div> </div> <br> <input class='form-control' id='chapter"+$scope.storyChapters[i].number+"_title' type='text' name='chapter"+$scope.storyChapters[i].number+"_title' data-ng-model='chapter"+$scope.storyChapters[i].number+"_title' placeholder='Chapter "+$scope.storyChapters[i].number+" Title' required> <br> <div id='chapter"+$scope.storyChapters[i].number+"_content' name='chapter"+$scope.storyChapters[i].number+"_content' class='story-chapter-content well'> <div id='chapter"+$scope.storyChapters[i].number+"_content_toolbox' name='chapter"+$scope.storyChapters[i].number+"_content_toolbox' class='story-chapter-content-toolbox'> <div class='row'> <div class='btn-group col-xs-4'> <a href='' id='addMetricButton"+$scope.storyChapters[i].number+"' class='btn btn-default fonticon-metric' ng-click='addToChapter("+$scope.storyChapters[i].number+", 0, 1)'></a> <a href='' id='addVisualisationButton"+$scope.storyChapters[i].number+"' class='btn btn-default fonticon-visualisation' ng-click='addToChapter("+$scope.storyChapters[i].number+", 1, 2)'></a> <a href='' id='addCausalButton"+$scope.storyChapters[i].number+"' class='btn btn-default fa-bar-chart-o' ng-click='addToChapter("+$scope.storyChapters[i].number+", 2)'></a> </div> </div> </div> <div> <textarea class='form-control' rows=10 id='chapter"+$scope.storyChapters[i].number+"_text' type='text' name='chapter"+$scope.storyChapters[i].number+"_text' data-ng-model='chapter"+$scope.storyChapters[i].number+"_text' required placeholder='Chapter "+$scope.storyChapters[i].number+" Text' required></textarea> </div></div> </div>")($scope));
                    $scope['chapter'+$scope.storyChapters[i].number+'_title'] = $scope.storyChapters[i].title;
                    $scope['chapter'+$scope.storyChapters[i].number+'_text'] = $scope.storyChapters[i].text;
                    $scope.storyChapters[i].chapterIndex = i;
                }
            }

            $scope.addChapter = function(){
                $scope.chapterCount++;
                $scope.chapters.push({"chapterIndex":$scope.chapterCount, "contents":[]});
                angular.element(document.getElementById('chaptersDiv')).append($compile("<div id='chapter"+$scope.chapterCount+"' <ng-model='chapter"+$scope.chapterCount+"' class='well'> <div class='row'> <div class='col-xs-4'> <h4>Chapter "+$scope.chapterCount+"</h4> </div> <div class='btn-group col-xs-offset-7 col-xs-1 text-right'> <a href='' id='removeChapter+"+$scope.chapterCount+"' class='btn btn-danger fa-trash-o' ng-click='removeChapter("+$scope.chapterCount+")'></a> </div> </div> <br> <input class='form-control' id='chapter"+$scope.chapterCount+"_title' type='text' name='chapter"+$scope.chapterCount+"_title' data-ng-model='chapter"+$scope.chapterCount+"_title' placeholder='Chapter "+$scope.chapterCount+" Title' required> <br> <div id='chapter"+$scope.chapterCount+"_content' name='chapter"+$scope.chapterCount+"_content' class='story-chapter-content well'> <div id='chapter"+$scope.chapterCount+"_content_toolbox' name='chapter"+$scope.chapterCount+"_content_toolbox' class='story-chapter-content-toolbox'> <div class='row'> <div class='btn-group col-xs-4'> <a href='' id='addMetricButton"+$scope.chapterCount+"' class='btn btn-default fonticon-metric' ng-click='addToChapter("+$scope.chapterCount+", 0, 1)'></a> <a href='' id='addVisualisationButton"+$scope.chapterCount+"' class='btn btn-default fonticon-visualisation' ng-click='addToChapter("+$scope.chapterCount+", 1, 2)'></a> <a href='' id='addCausalButton"+$scope.chapterCount+"' class='btn btn-default fa-bar-chart-o' ng-click='addToChapter("+$scope.chapterCount+", 2)'></a> </div> </div> </div> <div> <textarea class='form-control' rows=10 id='chapter"+$scope.chapterCount+"_text' type='text' name='chapter"+$scope.chapterCount+"_text' data-ng-model='chapter"+$scope.chapterCount+"_text' required placeholder='Chapter "+$scope.chapterCount+" Text' required></textarea> </div></div> </div>")($scope));
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
                        if($scope.chapters[j].chapterIndex == index){
                            $scope.chapters.splice(j, 1);
                        }
                    }
                });
            };

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
                $http.get(API_CONF.STORY_MANAGER_URL + '/stories', {params: {id:$routeParams.storyId, getList:false}}).then(function(response){
                    if(response){
                        $scope.story = response.data.result;
                       //$scope.story = {"id":146,"chapters":[{"number":0,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"Anfang","contents":[{"type":0,"index":1,"stringIndex":150,"contentId":214},{"type":0,"index":1,"stringIndex":150,"contentId":215}]},{"number":1,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"After Deleted Chapter","contents":[{"type":1,"index":2,"stringIndex":153,"contentId":216}]},{"number":2,"text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.","title":"Conclusion","contents":[{"type":0,"index":1,"stringIndex":152,"contentId":217}]}],"title":"Test Story One"}
                        $scope.storyTitle = $scope.story.title;
                        $scope.storyChapters = $scope.story.chapters;
                        //countContents();
                        //organizeContents();
                    }
                });
            }



            /*
            var splitChapterTextsForContents = function(){
                for(var i=0; i<$scope.storyChapters.length;i++){
                    var contentsStringIndices = [];
                    for(var j=0; j<$scope.storyChapters[i].contents.length;j++){
                        contentsStringIndices.push($scope.storyChapters[i].contents[j].stringIndex);
                    }
                    contentsStringIndices.
                }
            }

            */

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
                    //angular.element(document.getElementById('metricsDiv'+i)).append($compile("")($scope));
                    //angular.element(document.getElementById('visualizationsDiv'+i)).append($compile("<div class='col-lg-3 pc-tile' ng-repeat='rv in storyChapters["+i+"].visualizations'><div class='panel panel-default'> <div class='panel-heading'><a href='#!/visualizations/{{ rv.id }}'> <h3 class='panel-title'>{{ rv.title | limitTo: 25}} </h3></a> </div> <div class='panel-body'> <div class='visualization-graph-page-content'> <div ng-repeat='idvisulist in [rv.id]' ng-include='modules/visualization/partials/graph.html'></div></div></div> </div> </div>")($scope));
                    angular.element(document.getElementById('visualizationsDiv'+i)).append($compile("<div class='panel panel-default col-xs-4'> <div class='panel-heading'><a href='#!/visualizations/{{ storyChapters["+i+"].visualizations["+i+"].id }}'> <h3 class='panel-title'>{{ storyChapters["+i+"].visualizations["+i+"].title | limitTo: 25}} </h3></a> </div> <div class='panel-body'> <div class='visualization-graph-page-content'> <div ng-repeat='idvisulist in [storyChapters["+i+"].visualizations["+i+"].id]' ng-include='modules/visualization/partials/graph.html'></div></div></div> </div> </div>")($scope));
                    //angular.element(document.getElementById('causalsDiv'+i)).append($compile("")($scope));
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

