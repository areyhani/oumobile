  	function browserdetect(){
  	var UserAgent = navigator.userAgent;
  	console.log(UserAgent);
   	var Browser = {
     		 iphone: UserAgent.match(/(iPhone)/),
     		 ipad: UserAgent.match(/(iPad)/),
      		 blackberry: UserAgent.match(/BlackBerry/),
     		 android: UserAgent.match(/Android/),
     		 desktop: UserAgent.match(/windows|linux|OS/)
   	};

     if (Browser.iphone){
        console.log("Load Iphone Version.");
     }
     else if(Browser.ipad){
        console.log("Load Ipad Version.");
        
     }
     else if (Browser.desktop){
     console.log("Load Desktop Version.");
     }
     return  Browser;
     }