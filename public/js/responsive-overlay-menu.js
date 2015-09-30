var $jq = jQuery.noConflict();

$jq(document).ready(function () {

    $jq(".menu-btn a").click(function () {
        $jq(".overlay").fadeToggle(200);
        $jq(this).toggleClass('btn-open').toggleClass('btn-close');
    });

    $jq('.overlay').on('click', function () {
        $jq(".overlay").fadeToggle(200);
        $jq(".menu-btn a").toggleClass('btn-open').toggleClass('btn-close');
    });

    $jq('.menu a').on('click', function () {
        $jq(".overlay").fadeToggle(200);
        $jq(".menu-btn a").toggleClass('btn-open').toggleClass('btn-close');
    });

});