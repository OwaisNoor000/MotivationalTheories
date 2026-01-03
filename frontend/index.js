function removeBanner (){
      let licenseBanner = document.getElementsByClassName("svc-creator__banner");
      if(licenseBanner.length>0){

        licenseBanner[0].style.visibility = "hidden";
      }else{
      }
    }

setInterval(removeBanner,500)