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
                            console.log("chapterNumber " + chapterNumber);
                            console.log('error contentId: ' + $scope.contentId);
                            $scope.contentType = scope.contentType;
                            $scope.contentId = scope.contentId;
                            $scope.chapterNumber = chapterNumber;

                            $scope.close = function(){
                                $modalInstance.close();
                            }
                            $scope.addToChapter = function(chapterIndex, contentType){
                                console.log('no error contentId: ' + $scope.contentId)

                                try {
                                    if (typeof $scope.contentId == "undefined" || $scope.contentId == '') {
                                        throw "empty";
                                    }
                                    scope.chapter.contents.push({"type": scope.contentType, "contentId": $scope.contentId});
                                }
                                catch(err) {
                                    console.log('error contentId: ' + $scope.contentId)
                                    console.log('error contentType: ' + scope.contentType)
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
