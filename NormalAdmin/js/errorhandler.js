window.alertpageView=Backbone.View.extend({
	events:{
		'pageshow' : 'pageShow',
		'click #okBtn' :'okBtn'
		
	},
	template:_.template($('#alertmessage').html()),
	render:function (eventName) {
	window.location.replace(this.page + '&dialog');
			$(this.el).append(this.template());
			return this;
	},
	pageShow:function(){  
			 var data = this.data;
			var pageType=this.pageType;
			 var  mode= this.mode;
			 var name= this.name;
			 var errorMessageObj =jQuery.parseJSON(data.responseText);
			 var errorMessage_formvalidation = errorMessageObj.validation_errors;
			 var system_error = errorMessageObj.error;

		if ( errorMessage_formvalidation){
			$(".alert_body","#alert_title").empty();
			var errorCount=0;
			  $.each( errorMessage_formvalidation, function(index,value) {
			  $("#"+index).addClass('ui-body-d');
			  $("#"+index+"Label").addClass('error');
			  $("#"+index+"Help").show();
			  $("#"+index+"Help").addClass('errormessage');
			  $("#"+index+"Help").text(value);
				errorCount++;
			});
			$("#alert_title").text("Error saving " + pageType + ": "+ name);
			$(".alert_body").text("There are "+ errorCount +" errors in account settings. Please fix the errors first in order to  " + mode + " the " + pageType + ".");
			console.log("An error occured, the  " + pageType + " is not saved yet. Please fix the errors first.");
					return false;	
		}
		
		else if (system_error &&!(errorMessage_formvalidation)){
						console.log(system_error);
						$("#alert_title").text("Error for " + pageType + " : "+ name);
						$("#alert_body").text(system_error);
				}
				
		
	},
	okBtn:function(){
	console.log(this.page);
			window.app.navigate(this.page,{trigger:true});
			//Common.direct(this.skin,this.account,'account');
			 $.each( errorMessage_formvalidation, function(index,value) {
			  $("#"+index).addClass('ui-body-d');
			  $("#"+index+"Label").addClass('error');
			  $("#"+index+"Help").show();
			  $("#"+index+"Help").addClass('errormessage');
			  $("#"+index+"Help").text(value);
				errorCount++;
			});
			return false;
	}
	});

function alertpage(data,pageType, mode , name,page){
    console.log('#alertpage');
    console.log(data);
	var alertview= new alertpageView();
	alertview.data=data;
	alertview.pageType=pageType;
	alertview.mode=mode;
	alertview.name=name;
	alertview.page=page;
	alerttitle ="title";
	alertbody= "body";
	ok="ok";
	changePage(alertview, true);
}


function changePage(page,transitionType) {
		if (interval != null) {
			clearInterval(interval);
		}
       	$(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition='fade';
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        if(transitionType){
        	transition = transitionType;
        }

        $.mobile.changePage($(page.el), {changeHash:false,transition:transition, reloadPage:true});
    }
   
