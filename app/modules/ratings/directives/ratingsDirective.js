/**
 * Directives for Rating Manager
 */

angular.module('pcApp.ratings.directives.ratingsDirective', [
    'pcApp.ratings.services.ratingsService',
    'pcApp.auth.services.auth'
])

.directive('pcRating', ['RatingsService', 'Auth', function (RatingsService, Auth) {

        var controller = function($scope) {
            if ($scope.max == undefined) $scope.max = 5;
            if ($scope.score == undefined) $scope.score = 0;
            if ($scope.totalVotes == undefined) $scope.totalVotes = 0;
            $scope.readonly = $scope.readonly || false;
            var awaitingResponse = false;

            var TOOLTIP_LOADING_TEXT = "Loading rating";
            $scope.tooltip = TOOLTIP_LOADING_TEXT;

            $scope.$watch('score', function(){
                updateView();
            });
            function handleResponse(response){
                $scope.score = response.score;
                $scope.totalVotes = response.votes_counter;
                $scope.tooltip = plural($scope.score+' star') + " based on " + plural($scope.totalVotes+' vote') + ".";
                awaitingResponse = false;
            }

            RatingsService.retrieve({
                id: $scope.id
            }, handleResponse);

            $scope.rate = function(index) {
                if ($scope.isReadOnly() || awaitingResponse) return;
                awaitingResponse = true;
                $scope.tooltip = TOOLTIP_LOADING_TEXT;
                var score = index+1;
                RatingsService.rate({
                    id:$scope.id,
                    score: score
                    },
                    handleResponse
                );
                if ($scope.onRatingSelect) $scope.onRatingSelect({rating: $scope.score});
            };

            function updateView() {
                $scope.stars = [];
                $scope.tooltip = plural($scope.score+' star') + " based on " + plural($scope.totalVotes+' vote') + ".";
                    for (var i = 0; i < $scope.max; i++) {
                        $scope.stars[i] = {
                            full: $scope.score - i > .5,
                            half: $scope.score - i == .5
                        };
                        //if (mod <= .5) break;
                    }
            }

            $scope.isReadOnly = function () {
                return $scope.readonly || !Auth.state.loggedIn;
            };

            function plural(str, plural){
                var number = parseFloat(str);
                if(isNaN(number) || Math.abs(number)=== 1) return str;
                if(!plural) return str+'s';
                return str.replace(/\S+(\s*)$/, plural+'$1');
            }
        };

        return {
            restrict: 'EA',
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: "@?ratingId",
                score: '=?ngModel',
                max: '=?', // optional (default is 5)
                onRatingSelect: '&?',
                readonly: '=?'
            },
            templateUrl: "modules/ratings/partials/rating.html"
        };
    }]);