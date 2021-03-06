require([
    "common",
    "clipboard"
], function () {

    var common = require("common");
    var Clipboard = require("clipboard");

    function addItems(items, sectionCode) {
        var i, item, sectionHTML;

        if (sectionCode === "01") {
            var itemsPerPage = 4;
            var page = 1;
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = Math.min(startIndex + itemsPerPage, items.length);

            for (i=startIndex;i<endIndex;i++) {
                item = items[i];

                sectionHTML = "<li>";
                sectionHTML += "<div class=\"section-img\" " +
                    "style=\"background-image: url('" + window._ctx.root  + "/" + item.img + "')\"></div>";
                sectionHTML += "<div class=\"section-name\">";
                sectionHTML += item.name;
                sectionHTML += "</div>";
                sectionHTML += "<div class=\"section-score\">";
                sectionHTML += item.score.toFixed(1);
                sectionHTML += "</div>";
                sectionHTML += "<div class=\"section-info\">";
                sectionHTML += item.location + " - " + item.category;
                sectionHTML += "</div>";
                sectionHTML += "</li>";

                $(".section-contents.section" + sectionCode + ">ul").append(sectionHTML);
            }

            $(".section-contents.section" + sectionCode + ">ul>li").on("click", function() {
                location.href = window._ctx.root  + "/store.html";
            });
        }
        else if (sectionCode === "02") {
            for (i=0;i<items.length;i++) {
                item = items[i];

                $(".section-contents.section" + sectionCode + ">ul")
                    .append("<li>#" + item + "</li>");
            }
        }
    }

    function initTopList() {
        function initStoreList(topList) {
            for (var i=0;i<topList.stores.length;i++) {
                var store = topList.stores[i];
                var review = store.review;

                var listHTML = "<li>";
                listHTML += "<div class=\"store-img\" style=\"background-image: url('" + window._ctx.root  + "/" + store.img + "')\"></div>";
                listHTML += "<div class=\"store-contents\">";
                listHTML += "<div class=\"store-title\">";
                listHTML += "<span class=\"store-name\">" + (i+1) + ". " + store.name + "</span>";
                listHTML += " <span class=\"store-score\">" + store.score.toFixed(1) + "</span>";
                listHTML += "</div>";
                listHTML += "<div class=\"store-addr\">" + store.address + "</div>";
                listHTML += "<div class=\"store-review\">";
                listHTML += "<div class=\"store-review-editor-pic\" style=\"background-image: url('" + window._ctx.root  + "/" + review.editorPic + "')\"></div>";
                listHTML += "<div class=\"store-review-contents\">";
                listHTML += "<span class=\"store-reivew-editor-name\">" + review.editorName + "</span>";
                listHTML += " " + review.content;
                listHTML += "</div>";
                listHTML += "</div>";
                listHTML += "<div class=\"store-link\">" + store.name + " 더보기 &gt;</div>";
                listHTML += "<div class=\"store-star\">";
                listHTML += "<i class=\"fa fa-star-o\"></i>";
                listHTML += "<div class=\"store-star-text\">";
                listHTML += "가고싶다";
                listHTML += "</div>";
                listHTML += "</div>";
                listHTML += "</div>";
                listHTML += "</li>";

                $(".list-container>ul").append(listHTML);
            }
        }

        function configureMap(topList) {
            var center = {
                lat: 0,
                lng: 0
            };

            var minLat = 5000, maxLat = -5000, minLng = 5000, maxLng = -5000;

            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById("map"), {
                center: center,
                scrollwheel: false,
                zoom: 15
            });

            for (var i=0;i<topList.stores.length;i++) {
                var store = topList.stores[i];

                // Create a marker and set its position.
                var marker = new google.maps.Marker({
                    map: map,
                    position: store.latLng,
                    title: store.name
                });

                minLat = Math.min(minLat, store.latLng.lat);
                maxLat = Math.max(maxLat, store.latLng.lat);
                minLng = Math.min(minLng, store.latLng.lng);
                maxLng = Math.max(maxLng, store.latLng.lng);

                console.log(marker);
            }

            center = {
                lat: (maxLat + minLat) / 2,
                lng: (maxLng + minLng) / 2
            };

            var zoom = common.getBestZoom(minLat, maxLat, minLng, maxLng,
                $("#map").width(), $("#map").height(), 18);

            map.panTo(center);
            map.setZoom(zoom);
        }

        function initMap(topList) {
            require(["async!https://maps.googleapis.com/maps/api/js?key=" +
            "AIzaSyAHX_Y_cP2i1v9lchEPJ4yROwzh9nK6of0"], function() {
                configureMap(topList);
            });
        }

        $.ajax({
            url: window._ctx.root  + "/api/toplists/chirstmas",
            success: function(topList) {
                $("#title-info").html(topList.clicks.toLocaleString() + " 클릭 | " + topList.date);
                $("#title-text").html(topList.title);
                $("#title-desc").html(topList.desc);

                initStoreList(topList);

                function getLotto() {
                    var lotto = [];

                    while (true) {
                        var number = parseInt(Math.random() * 1000) % 45 + 1;

                        if (lotto.indexOf(number) === -1) {
                            lotto.push(number);
                        }
                        else {
                            continue;
                        }

                        if (lotto.length === 6) {
                            break;
                        }

                    }

                    console.log(lotto);
                }

                function animatePath(obj, path) {
                    var index = parseInt(Math.random() * 1000) % path.length;

                    obj.animate({
                        top: path[index].top,
                        right: path[index].right,
                        opacity: path[index].opacity
                    }, {
                        duration: path[index].duration,
                        complete: function () {
                            animatePath(obj, path, index +1);
                        }
                    });

                    getLotto();
                }

                $(".store-star").on("click", function() {
                    var path =[{
                        top: 20, right: 20, duration: 100, opacity: 0.4
                    }, {
                        top: 0, right: 40, duration: 150, opacity: 1
                    }, {
                        top: 30, right: 70, duration: 200, opacity: 0.7
                    }, {
                        top: 0, right: 40, duration: 150, opacity: 0
                    }, {
                        top: 20, right: 20, duration: 50, opacity: 0.2
                    }, {
                        top: 0, right: 0, duration: 300, opacity: 0.5
                    }];

                    animatePath($(this), path);

                });

                initMap(topList);
            }
        });

        var clipboard = new Clipboard(".share-button");

        clipboard.on("success", function() {
            alert("페이지의 주소가 복사되었습니다.");
        });
    }

    function initRelatedArea() {
        $.ajax({
            url: window._ctx.root  + "/api/toplist/related",
            success: function(items) {
                addItems(items, "01");
            }
        });

        $.ajax({
            url: window._ctx.root  + "/api/toplist/keywords",
            success: function(items) {
                addItems(items, "02");
            }
        });
    }

    initTopList();
    initRelatedArea();

    common.initHotPlaces();


});
