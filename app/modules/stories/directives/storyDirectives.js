/**
 * Directives for Story Manager
 */

angular.module('pcApp.stories.directives.storyDirectives', [])

    .directive('addMediaButtonModal', function($modal,$location){
        return{
            restrict: 'E',
            scope: {
                contentType: "@",
                contentId: "=",
                chapter: "="
            },
            link: function(scope){
                scope.open = function(chapterNumber){
                    $modalInstance = $modal.open({
                        templateUrl: 'add-media-modal',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope) {
                            $scope.contentType = scope.contentType;
                            $scope.contentId = scope.contentId;
                            $scope.chapterNumber = chapterNumber;

                            $scope.close = function(){
                                $modalInstance.close();
                            }
                            $scope.addToChapter = function(chapterIndex){
                                try {
                                    if (typeof $scope.contentId == "undefined" || $scope.contentId == '') {
                                        throw "empty";
                                    }
                                    for (var content in scope.chapter.contents) {
                                        if (scope.chapter.contents.hasOwnProperty(content)) {
                                            if (scope.chapter.contents[content].type === scope.contentType && scope.chapter.contents[content].contentId === $scope.contentId) {
                                                alert("This " + scope.contentType + " already exists in this chapter and can not be added!");
                                                throw "already exists";
                                            }
                                        }
                                    }
                                    scope.chapter.contents.push({"type": scope.contentType, "index": $scope.contentId});
                                }
                                catch(err) {
                                    console.log('error ' + err + ' contentId: ' + $scope.contentId)
                                    console.log('error ' + err + ' contentType: ' + scope.contentType)
                                }
                                $scope.close();
                            }
                        }
                    });
                }
            },
            templateUrl:'modules/stories/partials/addMedia.html'
        };
    });
