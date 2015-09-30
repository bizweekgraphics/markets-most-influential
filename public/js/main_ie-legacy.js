var $j = jQuery.noConflict(),
    windowWidth,
    currentSlide,
    numSlides;


$j(document).ready(function(){

    currentSlide = 0;
    windowWidth = $j(window).width();
    numSlides = $j('.slide').length;
    
    //on page load, get slide number from url
    //save slide number as currentSlide
    //add slide-selected class to current slide
    $j('.slide').eq(currentSlide).addClass('slide-selected');

    //add functionality
    arrows();
    next();
    previous();

    //set up correct screen sizing
    $j(window).resize(resizeWidth);
    resizeWidth();

    //set up hash change
    $j(window).on('hashchange', getCurrentUrl);
    getCurrentUrl();

});


function getCurrentUrl() {
    var page = String(window.location.hash).substring(1);
    currentSlide = $j('.slide[data-page="'+page+'"]').index();
    currentSlidePage();

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

    // updateSlideAd(currentSlide)

    if (currentSlide === -1 && window.location.hash[0] === undefined) {
        var page = $j('.slide').eq(currentSlide+1).attr('data-page');
        window.location.hash = page;
        
    } else {
        arrows();
        
    }

    var slidePos2 = currentSlide * windowWidth;

    //removed selected class from all slides and circles
    $j('.slide').removeClass('slide-selected');
    // $j('#subnav a').removeClass('active');

    $j('.slide').each(function(i) {
        if($j(this).index() === currentSlide) {
            $j(this).addClass('slide-selected');

        }

        if($j(this).index() === currentSlide-1) {
            // $j('#subnav a').eq(currentSlide-1).addClass('active');

        }
    });

    $j('#wrapper-slides').animate({'left': "-" + slidePos2 + "px" }, "slow" );
}