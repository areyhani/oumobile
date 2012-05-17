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
	 }
	
	
			}