(function () {
    $("input").keydown(function (e) {
            hideLoginFailedToolTip();
    });

    function hideLoginFailedToolTip() {
        $("#loginFailed").attr("aria-hidden", "true");
        $("#loginFailed").addClass("hidden");
    }

})();
