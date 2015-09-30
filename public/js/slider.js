var $j = jQuery.noConflict();
var windowWidth;
var currentSlide;
var numSlides;
var scrollPos;
var top = $j(window).scrollTop();
var currentSlideImg;
var numSlideImgs;

$j(document).ready(function(){

    currentSlide = 0;
    windowWidth = $j(window).width();
    numSlides = $j('.slide').length;

    currentSlideImg = 0;
    numSlideImgs = $j('.slide-selected .slide_img').length;
    
    //on page load, get slide number from url
    //save slide number as currentSlide
    //add slide-selected class to current slide
    $j('.slide').eq(currentSlide).addClass('slide-selected');
    $j('.slide-selected .slide_img').eq(currentSlide).addClass('slide-show');

    //add functionality
    // arrows();
    next();
    previous();

    //set up correct screen sizing
    $j(window).resize(resizeWidth);
    resizeWidth();

    //set up hash change
    $j(window).on('hashchange', getCurrentUrl);
    getCurrentUrl();

    SafariOnly();

    setInterval(stickySubNav, 60);

});

 
function stickySubNav() {
    scrollPos = $j(document).scrollTop();
    var windowWidth = $j(window).width();
    

    if (windowWidth <= 1160 && scrollPos > 91) {
        $j('#subheader').css({
            'top': '0'+ 'px'

        });

    } else if (windowWidth > 768 && scrollPos >= 121) {

        $j('#subheader').css({
            'top': '91'+ 'px'
        });

    } else if (windowWidth > 768 && scrollPos < 121) {

        $j('#subheader').css({
            'top': '121'+ 'px'
        });

    } else if (windowWidth <= 768 && scrollPos < 91)  {
        $j('#subheader').css({
            'top': '91'+ 'px'
        });
    }

}



function getCurrentUrl() {
    var page = String(window.location.hash).substring(1);
    currentSlide = $j('.slide[data-page="'+page+'"]').index();
    currentSlidePage();
    
    $j('html, body').scrollTop(0);
}


//on page resize, 
function resizeWidth() {
    windowWidth = $j(window).width();
    
    $j('#wrapper-slides').width(numSlides * windowWidth);
    $j('.slide').width(windowWidth);

    $j('.slide').each(function(i) {
        $j(this).css('left', (i * windowWidth) + 'px');
    });
}


//update arrow display based on current slide
function arrows() {

    if(currentSlide===(numSlides-1)) {
        $j('#nav-next').css('display', 'none');
        $j('#nav-previous').css('display', 'block');
    } else if (currentSlide === 0){
        $j('#nav-next').css('display', 'block');
        $j('#nav-previous').css('display', 'none');
    } else if (currentSlide > 0 && currentSlide < (numSlides-1)) {
        $j('#nav-next').css('display', 'block');
        $j('#nav-previous').css('display', 'block');

    }
}


//move to the next slide
function next() {
    $j('#nav-next').on('click', function() {
        var page = $j('.slide').eq(currentSlide+1).attr('data-page');
        window.location.hash = page;
        
        //Scroll to the Top
        $j('html, body').scrollTop(0);
    });
}


//move to the previous slide
function previous() {
    $j('#nav-previous').on('click', function(){
        var page = $j('.slide').eq(currentSlide-1).attr('data-page');
        window.location.hash = page;
        
        //Scroll to the Top
        $j('html, body').scrollTop(0);
    });
}


//add selected class to current slide
function currentSlidePage() {

    updateSlideAd(currentSlide)

    if (currentSlide === -1 && window.location.hash[0] === undefined) {
        var page = $j('.slide').eq(currentSlide+1).attr('data-page');
        window.location.hash = page;
        
    } else {
        arrows();
        
    }

    var slidePos = (currentSlide / numSlides) * 100;

    //removed selected class from all slides and circles
    $j('.slide').removeClass('slide-selected');
    $j('#subnav a').removeClass('active');

    $j('.slide').each(function(i) {
        if($j(this).index() === currentSlide) {
            $j(this).addClass('slide-selected');
            $j('#subnav a').eq(currentSlide).addClass('active');

        }

        // if($j(this).index() === currentSlide-1) {
            
        // }
    });

    //update slide css
    $j('#wrapper-slides').css({
        'transition': 'top 400ms, left 400ms, transform 400ms',
        'transform': 'translate3d(-' + slidePos + '%, 0%, 0px) scale3d(1, 1, 1)',
        '-webkit-transition': 'top 400ms, left 400ms, -webkit-transform 400ms',
        '-webkit-transform': '-webkit-translate3d(-' + slidePos + '%, 0%, 0px) scale3d(1, 1, 1)',
        '-moz-transition': 'top 400ms, left 400ms, -moz-transform 400ms',
        '-moz-transform': '-moz-translate3d(-' + slidePos + '%, 0%, 0px) scale3d(1, 1, 1)',
        '-ms-transition': 'top 400ms, left 400ms, -o-transform 400ms',
        '-ms-transform': 'translate3d(-' + slidePos + '%, 0%, 0px) scale3d(1, 1, 1)',
        '-o-transition': 'top 400ms, left 400ms, -o-transform 400ms',
        '-o-transform': 'translate3d(-' + slidePos + '%, 0%, 0px) scale3d(1, 1, 1)'
    });
}


function scrollToTop() {
        $j('html, body').animate({scrollTop: 0}, '500', 'easein');
}


function SafariOnly() {
    var uagent = navigator.userAgent.toLowerCase();
    var videoPadding = $j('.video-section video').height();


    // if(/safari/.test(uagent) && !/chrome/.test(uagent))
    // {


        // $j('.video-section').addClass('icon');

        // $j(".video-section").on('click', function(e){



        //     $j(this).children('.video-player').fadeIn(300);
        //     $j(this).children('video').css({'display': 'none'});
        //     $j(this).children('.mobile-lede').css({'display': 'none'});
        //     $j(this).addClass('hidden');

        // });

        

        
        // if(navigator.userAgent.match(/(iPhone|iPod)/i)) {

            
        //     $j('.video-section').removeClass('icon');

        //     $j('.safari-fix').css({'display': 'block'});

        //     $j(".video-section").off('click', function(){



                // $j(this).children('.video-player').fadeIn(300);
                // $j(this).children('video').css({'display': 'none'});
                // $j(this).children('.mobile-lede').css({'display': 'none'});
                // $j(this).addClass('hidden');
        //     });

        //     $j('.video-section .video-player').css({'display': 'none'});

        // } else if(navigator.userAgent.match(/(iPad)/i)) {

            

        //     $j('.video-section').removeClass('icon');

        //     $j('.safari-fix').css({'display': 'block'});

        //     $j(".video-section").off('click', function(){



        //         // $j(this).children('.video-player').fadeIn(300);
        //         // $j(this).children('video').css({'display': 'none'});
        //         // $j(this).children('.mobile-lede').css({'display': 'none'});
        //         // $j(this).addClass('hidden');
        //     });

        //     $j('.video-section .video-player').css({'display': 'none'});

        // }


    // } else {

        $j('.video-section').addClass('icon');

        $j(".video-section").on('click', function(){


            console.log('vwhaaaatt?!');

            // console.log('9823490237 what are the video name ' + _V_.players);

            $j('#video-wrapper').css({
                'z-index': '10'
                // 'padding-top' : videoPadding + 'px'
            });

            $j('#video-wrapper .video-player').eq(0).css({
                'display': 'block'
                // 'height' : videoPadding - 15 + 'px'
            });
            // $j(this).children('video').css({'display': 'none'});
            // $j(this).children('.mobile-lede').css({'display': 'none'});
            // $j(this).addClass('hidden');
        });
    // }
}

function playVideo() {

    $j('#video-wrapper .video-player').css({

    });

}


function terminalCalls() {
    if (isTerminal){ 
                $("a").attr("href", "#");
    }
}