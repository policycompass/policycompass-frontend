angular.module('pcApp.export.directives.exportDirective', [
    'ngProgress'
])

    .directive('pcExport',
    ['ngProgress',
        function (ngProgress) {
            var controller = function ($scope) {

                $scope.isDisabled = function() {
                    return $scope.downloading
                        || ($scope.type == "visualizations" && !!$scope.$parent.$parent.visualization.visualization_type_id && $scope.$parent.$parent.visualization.visualization_type_id == 4)
                        || ($scope.type == "visualizations" && !$('svg')[0])
                        || ($scope.type == "ags" && !$('svg')[0])
                        || ($scope.type == "models" && !cy);
                };

                $scope.downloading = false;
                $scope.download = function ($event) {
                    $event && $event.target && $event.target.blur && $event.target.blur();
                    $scope.downloading = true;
                    ngProgress.start();
                    try{
                        var filename = $scope.id + ".png";
                        if ($scope.type == "ags") {
                            var agId = (new Date()).getTime();
                            try {
                                agId = $scope.$parent.$parent.$parent.ag.id || "";
                            } catch (e) {
                            }
                            filename = $scope.id + agId + ".png";
                            //svg2png($('svg')[0], true, function(png) {
                            //    //angular.element('*[ng-app]').injector().get("dialogs").notify("PNG image:",'<img src="'+png+'">')
                            //    downloadPng(png, $scope.id);
                            //});
                            //svgAsDataUri($('svg')[0], null, function (uri) {
                            //    imageUri2Canvas(uri, function (canvas) {
                            //        canvasCrop(canvas);
                            //        canvas.toBlob(function (blob) {
                            //            saveAs(blob, filename);
                            //        })
                            //    });
                            //});
                            svgAsDataUri($('svg')[0], null, function (uri) {
                                svgUri2pngUri(uri, function(uri){
                                    imageUri2Canvas(uri, function (canvas) {
                                        canvasCrop(canvas);
                                        canvas.toBlob(function (blob) {
                                            saveAs(blob, filename);
                                            ngProgress.complete();
                                            $scope.downloading = false;
                                        })
                                    });
                                });
                            });
                        }
                        if ($scope.type == "visualizations") {
                            flushAnimationFrames();
                            svgAsDataUri($('svg')[0], null, function (uri) {
                                svgUri2pngUri(uri, function(uri){
                                    imageUri2Canvas(uri, function (canvas) {
                                        canvas.toBlob(function (blob) {
                                            saveAs(blob, filename);
                                            ngProgress.complete();
                                            $scope.downloading = false;
                                        })
                                    });
                                });
                            });
                        }
                        if ($scope.type == "models") {
                            var uri = cy.png({full: true});
                            imageUri2Canvas(uri, function (canvas) {
                                canvas.toBlob(function (blob) {
                                    saveAs(blob, filename);
                                    ngProgress.complete();
                                    $scope.downloading = false;
                                })
                            });
                        }
                    } catch (e){
                        ngProgress.complete();
                    }
                };

                function svgUri2pngUri(uri, cb) {
                    var image = new Image();
                    image.crossOrigin = "Anonymous"; //Enable CORS
                    image.src = uri;
                    image.onload = function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var context = canvas.getContext('2d');

                        context.drawImage(image, 0, 0);

                        if (cb) cb(canvas.toDataURL('image/png'));
                    }
                }
                function imageUri2Canvas(uri, cb) {
                    var image = new Image();
                    image.crossOrigin = "Anonymous"; //Enable CORS
                    image.src = uri;
                    image.onload = function () {
                        var canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var context = canvas.getContext('2d');

                        context.fillStyle = "#FFFFFF";
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(image, 0, 0);

                        if (cb) cb(canvas);
                    };

                }

                function canvasCrop(canvas) {
                    var context = canvas.getContext('2d');
                    crop(context, canvas);
                    return canvas;
                }

                function crop(ctx, canvas) {
                    var ww = canvas.width,
                        wh = canvas.height,
                        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
                        x, y;

                    /* WE INICIALIZE TOP LEFT CORNER FAR IN THE RIGHT SIDE */
                    var topLeftCorner = {};
                    topLeftCorner.x = canvas.width;
                    topLeftCorner.y = canvas.height;

                    /* WE INICIALIZE BOTTOM LEFT CORNER OUTSIDE THE CANVAS
                     BELOW WE'LL SEE WHY :) */
                    var bottomRightCorner = {};
                    bottomRightCorner.x = -1;
                    bottomRightCorner.y = -1;

                    /* NOW WE RUN TROUGHT ALL THE IMAGES'S PIXELS CHECKING IF THERE IS SOTHING ON THEM */
                    for (y = 0; y < wh; y++) {
                        for (x = 0; x < ww; x++) {

                            var pixelPosition = (x * 4) + (y * wh * 4);

                            /* EACH PIXEL HAS 4 "BYTES" OF DATA CORRESPONDING TO red, green, blue AND alpha*/
                            r = imageData.data[pixelPosition]; //red
                            g = imageData.data[pixelPosition + 1]; //green
                            b = imageData.data[pixelPosition + 2]; //blue

                            /* I'M ONLY INTERESTED IN ALPHA COMPONENT, IF SOMETHING IS PRESENT IN THAT PIXEL ALPHA (a) VALUE MUST BE > 0*/
                            a = imageData.data[pixelPosition + 3]; //alpha

                            /* I IGNORE THE r,g,b COMPONENT, ONLY CHECK IF alpha > 0 */
                            if (a > 0 && (r < 255 || g < 255 || b < 255)) {

                                /* HERE I GET THE TOP MOST LEFT PIXEL, AND THE BOTTOM MOST RIGHT ONE */
                                if (x < topLeftCorner.x) {
                                    topLeftCorner.x = x;
                                }
                                if (y < topLeftCorner.y) {
                                    topLeftCorner.y = y;
                                }
                                if (x > bottomRightCorner.x) {
                                    bottomRightCorner.x = x;
                                }
                                if (y > bottomRightCorner.y) {
                                    bottomRightCorner.y = y;
                                }
                            }
                        }
                    }
                    /* Add some air in it */
                    if (topLeftCorner.x > 5) {
                        topLeftCorner.x -= 5;
                    }
                    if (topLeftCorner.y > 5) {
                        topLeftCorner.y -= 5;
                    }
                    if (bottomRightCorner.x < canvas.width - 5) {
                        bottomRightCorner.x += 5
                    }
                    if (bottomRightCorner.y < canvas.height - 5) {
                        bottomRightCorner.y += 5
                    }

                    /* NOW WE SAVE THE REGION WE WANT TO TRIM TO  A VARIABLE */
                    /* (x, y, width, heigth) */
                    var relevantData = ctx.getImageData(topLeftCorner.x, topLeftCorner.y, bottomRightCorner.x - topLeftCorner.x, bottomRightCorner.y - topLeftCorner.y);

                    /* RESIZE OUR ORIGINAL CANVAS TO TE SIZE WE NEED */
                    canvas.width = bottomRightCorner.x - topLeftCorner.x;
                    canvas.height = bottomRightCorner.y - topLeftCorner.y;
                    ww = canvas.width;
                    wh = canvas.height;

                    /* NOW WE CLEAN THE CANVAS*/
                    ctx.clearRect(0, 0, ww, wh);

                    /* FINALLY WE "PASTE" BACK THE RELEVANT CONTENT AT 0,0 */
                    ctx.putImageData(relevantData, 0, 0);

                }

                //Disable d3's transitions API
                //https://github.com/mbostock/d3/issues/1789
                function flushAnimationFrames() {
                    var now = Date.now;
                    Date.now = function () {
                        return Infinity;
                    };
                    d3.timer.flush();
                    Date.now = now;
                }
            };
            return {
                restrict: 'EA',
                replace: true,
                controller: ['$scope', controller],
                scope: {
                    id: "@?exportId",
                    type: '@?'
                },
                templateUrl: "modules/export/partials/export.html"
            };

        }
    ]);
