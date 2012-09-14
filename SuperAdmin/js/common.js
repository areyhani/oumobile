function sessionClass(){
	this.admin= null;
	this.pri= null;
	this.user= null;
	this.account= null;
	this.skin=null;
}



_.mixin({
capitalize : function(str) {
	return (_.isString(str) && str.length > 0) ? (str[0].toUpperCase() + str.substr(1)) : "";
},
dateString : function(date, format) {
	if(!_.isDate(date)) return false;
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	var h = date.getHours();
	var h12 = (h > 12) ? h-12 : ( h == 0 ? 12 : h );
	var ampm = (h > 11) ? "PM" : "AM";
	var mm = date.getMinutes();
	mm = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
	var s = date.getSeconds();
	s = (s < 10) ? ("0" + s.toString()) : s.toString();
	return (m + "/" + d + "/" + y + " " + h12 + ":" + mm + " " + ampm); // standard date string - m/d/yyyy h12:mm [AM|PM], add other formats later if needed.
},
parseISO8601 : function(str) { // returns a Date object for ISO8601 date strings, Safari and IE do not support in date constructor

	if(Date.parse(str)) return new Date(str);
	var parts = str.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([-+])(\d{2})(\d{2})/);
	if(!parts) return null;
	var date = Date.UTC(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6]));
	var hourOffset = parseInt(parts[8]) * (parts[7] == "-" ? 3600000 : -3600000);
	var minuteOffset = parseInt(parts[9]) * (parts[7] == "-" ? 60000 : -60000);
	return new Date(date + hourOffset + minuteOffset);
}
});
var Common = {
    whoamI: function(){
    var sessionObj= new sessionClass();
    $.ajax({
    		url:'/authentication/whoami',
    		type:'get',
    		async:false,
    		success: function(data){
    		if (data.error){console.log("error: "+data.error);}
    		//console.log(data);
    		sessionObj.admin= data.admin;
    		sessionObj.pri= data.privilege;
    		sessionObj.user=data.user;
    		sessionObj.account= data.account;
    		sessionObj.skin= data.skin;
    	   }});
    	    return sessionObj;
    	    },
		logout: function() {
		new Messi('Are you sure you want to logout ?',
		{title: 'Warning', titleClass: 'anim warning', modal:true,buttons: [{id: 0, label: 'Yes', val: 'Y'}, {id: 1, label: 'No', val: 'N'}],
		callback : function(val){
			if(val == 'Y'){
				localStorage.clear();
				console.log('#logout');
				$.ajax({
					url: '/authentication/admin_logout',
					type: 'post',
					success: function(data) {
						if(data.error){
						}
						var skin ="skin";
						if(data.skin){
						skin = data.skin;
						}
						window.location.href = '#'+skin;
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
			}
		}
		});	
	},
	subuserLogout: function(){
		new Messi('Are you sure you want to logout ? ',
		{title: 'Warning', titleClass: 'anim warning', buttons: [{id: 0, label: 'Yes', val: 'Y'}, {id: 1, label: 'No', val: 'N'}],
		callback: function(val){
					if (val == 'Y'){
								localStorage.clear();
								console.log('subuserlogout');
								$.ajax({
										 url:'/authentication/logout',
										 type:'post',
										 error:function(data){
												 var errorMessage=jQuery.parseJSON(data.responseText);
												 console.log(errorMessage.error);
												 new Messi(errorMessage.error, {title: 'Error logging out', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
										  },
										 success: function(data){
													 var skin= data.skin;
													 var account= data.account;
													 console.log(data);
													 window.app.navigate(skin+'/accounts/'+account,{trigger:true});
										 }
								});
					}
				 }
		  });
	},
	subuserlogin:function Subuserlogin(skin,account,subuser,site){
				console.log($.mobile.path.parseUrl());
				$.ajax({
					url: '/authentication/login',
					type: 'post',
					data: {
						'skin': skin,
						'account':account,
						'username':subuser,
					},
					error: function(data){ 	
		      		console.log(data);
		      	 	var pageType="user";
		      		var mode="login";
		      		var name = localStorage.getItem('account');
					alertPage(data,pageType, mode ,name);
		     		},
					success: function(data) {
							console.log(data);
							console.log("site:"+site);
							var  nextstepurl=data.skin+'/sites/'+account;
							if(site != "undefined" ){
	           				nextstepurl =data.skin+'/sites/'+account+'/'+site;
	           				 }
							window.app.navigate(nextstepurl, {trigger:true});
							localStorage.setItem('user',subuser);
					}
					});
			},
    subuserLogoutBtn: function(){
     		$('#userLogout').text(localStorage.getItem("user"));
			$('#userLogout').hover(function(){
			$('#userLogout').text("Logout");
			},function(){
			$('#userLogout').text(localStorage.getItem("user"));
			$.mobile.page();
			});
     
     },
	direct: function(skin,account,element){
			console.log('cancel: go to edit mode');
			if(skin && account){
				window.app.navigate(skin+'/'+element+'-edit-mode/'+account,{trigger:true});
			}else{
				window.app.navigate(skin+'/'+element+'-edit-mode',{trigger:true});
			}
			window.location.reload();
			//return false;
	},
	add: function(skin,account,element,pagetype,editMode,editType){
			//element is either site or user, depending where this function is being called.
			var OPType ="add";
			if(editType){
			OPType = editType;
			}
			var editPath =skin+'/'+pagetype+'-'+OPType+'/'+editMode+'/tablet';
			var Browser = browserdetect();
			if(Browser.phone){
				var editPath =skin+'/'+pagetype+'-'+OPType+'/'+editMode+'/phone';
			 }	
			if(element && account){
					window.app.navigate(editPath+'/'+account+'/'+element,{trigger:true});
			}else if (account){
					window.app.navigate(editPath+'/'+account,{trigger:true});
			}
			else{
					window.app.navigate(editPath,{trigger:true});
			}
	},
	home:function(skin){
		 window.location.href='#'+skin+'/accounts';
		 $.mobile.page();
		 return false;
	 },
	editMode:function(skin,account,site,pagetype){
		if(account && site){
		window.app.navigate(skin+'/'+pagetype+'-edit-mode/'+account +'/'+site ,{trigger:true});
		}else if(account){
		window.app.navigate(skin+'/'+pagetype+'-edit-mode/'+account, {trigger:true});
		}
		else{
		window.app.navigate(skin+'/'+pagetype+'-edit-mode',{trigger:true, replace:true});
		}
	},
	workflowMode:function(skin,account,site,page){
		if(account && site){
			window.location.href='#'+skin+'/'+page+'s/'+account +'/'+site;
		}else if(account){
			window.location.href='#'+skin+'/'+page+'s/'+account;
		}
		else{
			window.location.href='#'+skin+'/'+page+'s';
		}
	},
	errorhandler : function errorhandler (data, pageType, mode , name){
			var errorMessageObj =jQuery.parseJSON(data.responseText);
			var errorMessage_formvalidation = errorMessageObj.validation_errors;
			var system_error = errorMessageObj.error;
			if ( errorMessage_formvalidation){  
						 $("#alert_body","alert_title").empty();
						 var errorCount=0;
						  $(".suberrorcount").text(0);
						  $(".suberrorcount").hide();
						  $.each( errorMessage_formvalidation, function(index,value) {
						  $("#"+index).addClass('ui-body-d');
						  $("#"+index+"Label").addClass('error');
						  $("#"+index+"Help").show();
						  $("#"+index+"Help").text(value);
						  var str =$("#"+index+"Help").parent().parent().attr("id");
						  if(str) {
							  var parentstab= str.substring(0, str.indexOf('-')); 
						  }else{
							  parentstab= $("#"+index+"Help").parent().parent().parent().attr("id");
						  }
						  var suberrorcount =  parseInt( $("#"+parentstab + " .suberrorcount").text());
						  $("#"+parentstab + " .suberrorcount").show();
						  $("#"+parentstab + " .suberrorcount").text(suberrorcount+1);
						  $("#"+parentstab + " .suberrorcount").css({"color":"red"});
						  $("#"+index+"Help").addClass('errormessage');
						 // $("#"+index+"Help").text(value);
							suberrorcount=0;
							errorCount++; 
						});
						  new Messi("There are "+ errorCount +" errors. Please fix the errors first in order to  " + mode + " the " + pageType + ".", 
						  			{title: 'Title', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}],
						  			callback: function(val) { 
											  $(".alert_body").addClass('ui-body-d error errormessage');
											  $(".alert_body").css('text-align', 'center');
											  $(".alert_body").show();
											  $(".alert_body").text("There are "+ errorCount +" errors. Please fix the errors first in order to  " + mode + " the " + pageType + ".");
											  console.log("Error occured, the  " + pageType + " is not saved yet. Please fix the errors first.");
										  }
							});

			
						return false;
				}
				else if (system_error &&!(errorMessage_formvalidation)){
						console.log(system_error);
						new Messi(system_error,
								 {title: 'Error', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}],
								 callback: function(val){

								 }
						});
				}		
	  		return false;

	 }
	
	}
	
