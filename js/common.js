var Common = {
	logout: function() {
		localStorage.removeItem('username');
		localStorage.removeItem('pass');
		$.ajax({
			url: '/authentication/admin_logout',
			type: 'post',
			success: function(data) {
				if(data.error)
				{console.log(data.error);}
				var skin = data.skin;
				//console.log(data.skin);
				window.location.href = 'super-index.html?skin='+skin;
				},
			error: function(data){
				 var errorMessage=jQuery.parseJSON(data.responseText);
				 console.log(errorMessage.error);
				 $("alert_title").empty();
				 $("#alert_body").empty();
				 $("#alert_title").text("Error logging out ...");
				 $("#alert_body").text(errorMessage.error);
				
			$.mobile.changePage($('#alert-page'),{
				type: "get", 
				data:"alert_message",
				transition:"pop",
				role: "dialog",
				reloadPage:true,
				});
			}
		});
		
	},
	cancel: function(){
			var params=location.search;
			$.ajax({
			url:'/accounts/list'+params ,
			type:'get',
			success: function(data){
					var accountsDiv =$('#accountdiv');
					if(data.error){
					$.ajax({
						url: '/authentication/admin_logout',
						type: 'post',
						success: function(data) {
						var skin = data.skin;
						window.location.href = 'super-index.html?skin='+skin;
							}
						  });
						}
					window.location.href='accounts.html'+ params;
					//accountsDiv.page("refresh");
					 }
				  });
		 
				},
	
	
	 home: function(){
	 window.location.href="accounts.html"+location.search;
	 },
	 
	 errorhandler : function(data, pageType, mode , name){
			 var errorMessageObj =jQuery.parseJSON(data.responseText);
			 var errorMessage_formvalidation = errorMessageObj.validation_errors;
			 var system_error = errorMessageObj.error;

		if ( errorMessage_formvalidation){
		
			$("#alert_body","alert_title").empty();
			var errorCount=0;
			  $.each( errorMessage_formvalidation, function(index,value) {;
			  $("#"+index).addClass('ui-body-d');
			  $("#"+index+"Label").addClass('error');
			  $("#"+index+"Help").show();
			  $("#"+index+"Help").addClass('errormessage');
			  $("#"+index+"Help").text(value);
				errorCount++;
			});
			

			
			$.mobile.changePage($('#alert-page'),{
			type: "get", 
			//data:"alert_message="+data.errors.email,
			data:"alert_message",
			transition:"pop",
			role: "dialog",
			reloadPage:true,
			});
			
			$("#alert_title").text("Error saving " + pageType + ": "+ name);
			$("#alert_body").text("There are "+ errorCount +" errors in account settings. Please fix the errors first in order to  " + mode + " the " + pageType + ".");
			
			console.log("An error occured, the  " + pageType + " is not saved yet. Please fix the errors first.");

			
		}
		
		else if (system_error &&!(errorMessage_formvalidation)){
						console.log(system_error);
						
						$.mobile.changePage($('#alert-page'),{
						type: "get", 
						//data:"alert_message="+data.errors.email,
						data:"alert_message",
						transition:"pop",
						role: "dialog",
						reloadPage:true,
						});
						$("#alert_title").text("Error for " + pageType + " : "+ name);
						$("#alert_body").text(system_error);
									
						$('#okBtn').click(function(){	
						//Sql-error gonna change to Exists in the API
					
						if(errorMessageObj.code == "EXISTS"){
						//window.location.href='accounts-edit-mode.html' + params;	
						}
						else{
						$.ajax({
						url: '/authentication/admin_logout',
						type: 'post',
						success: function(data) {

						var skin = data.skin;
						window.location.href = 'super-index.html?skin='+skin;
						}
						});}
						
						});
					  }
			else{		  
		
				window.location.href= pageType+ 's-edit-mode.html' + params;	
			}


	 
	 }
	
	
			}