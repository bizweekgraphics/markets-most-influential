
//load ad into iframe
function updateSlideAd(currrentSlide) {
  var correlatorStr = new String(Math.random()).substring(2,11)
  
  if (isTerminal) return
  var slug = config.bb_slug;
  var adcode = (config.ad_code) ? config.ad_code : '/5262/business/news/bmmi';

  var ads = document.getElementsByClassName('adunit');
  if(ads.length<1) return;

  var new_leader = '<iframe width="300" height="250" id="lb_ad_frame" style="visibility:hidden;"' +
      'onload="this.style.visibility=' + "'visible'" +
      '" class="ad_frame" scrolling="no" frameborder="no" src="' +
      'http://www.bloomberg.com/graphics/assets/ad.html?url=/' + slug + "&size=300x250&position=box1&iu="+adcode+"&correlator=" +
      correlatorStr;

  for (var i=0; i< ads.length; i++){
      if (currrentSlide-1 == i){
        ads[i].style.display = "block";
        var randValue = new String(Math.random()).substring(2,11);
        var n = i + 1;
        ads[i].innerHTML = new_leader + '&tile=' + ((n % 2) + 1) + '&ord=' + randValue + '"></iframe>';        
      }
  }
}
