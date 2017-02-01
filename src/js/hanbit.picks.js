
require([
    "common"
], function () {

    var common = require("common");

    common.initHotPlaces();

    $("#calc").on("click", function() {
        $.ajax({
            url: "/api2/calc",
            method: "GET",
            data: {
                left: $("#leftNum").val(),
                right: $("#rightNum").val(),
                operator: $("#op").val()
            },
            success: function(data) {
                var result = data.result;
                $("#result").text(result);
            }
        });
    });

});
