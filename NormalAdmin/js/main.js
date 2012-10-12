var interval = null;
(function($) {
$.fn.serializeObject = function() {
	var obj = {};
	$.each( this.serializeArray(), function(i,o){
		var n = o.name,
		v = o.value;
		obj[n] = obj[n] === undefined ? v
		: $.isArray( obj[n] ) ? obj[n].concat( v )
		: [ obj[n], v ];
	});
	// include unchecked checkboxes, use true/false instead of default on/[blank]
	this.find("input[type='checkbox']").each(function() {
		obj[$(this).attr("name")] = $(this).prop("checked") ? true : false;
	});
	return obj;
};
})(jQuery);
//Models

//-----models-----
var AccountModel = Backbone.Model.extend({
	initialize : function() {
	this.context = {
			skin : this.skin,
			editType:this.editType,
			data: {}
		};
		//this.users = new UserList();
		//this.sites = new SiteList();
		//if(this.skin)
			//this.users.account = this.sites.account = this.id;
	},
	sync : function(method, model, options) {
	console.log(options);
		if(method == "read") {
		console.log('#read');
			var params = { type: "GET", url: "/accounts/view", dataType: "json", data:{account: model.toJSON().account}};
		}
		else if(method == "create") {
		console.log('#create');
			var params = { type: "POST", url: "/accounts/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
		console.log('#update');
		console.log(model.toJSON());
			var params = { type: "POST", url: "/accounts/save", dataType: "json", account:model.toJSON.account, name: model.toJSON.account, data: model.toJSON() };
		}
		else if(method == "delete") {
		console.log('#delete');
		console.log(model.context);
			var params = { type: "POST", url: "/accounts/delete", dataType: "json", data:model.context.data };
		}
		return $.ajax(_.extend(params, options));
	},

	
});

var SiteModel = Backbone.Model.extend({
initialize : function() {
	this.context = {
			skin : this.skin,
			editType:this.editType,
			data: {}
		};
		//this.users = new UserList();
		//this.sites = new SiteList();
		//if(this.skin)
			//this.users.account = this.sites.account = this.id;
	},
	sync : function(method, model, options) {
		
		if(method == "read") {
			var params = { type: "GET", url: "/sites/view", dataType: "json", data : { account : model.get("account"), site: model.get("site")} };
		}
		else if(method == "create") {
		console.log('create');
			var params = { type: "POST", url: "/sites/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			var params = { type: "POST", url: "/sites/save", dataType: "json",name: model.get("site") ,site:model.get("site"), data: model.toJSON() };
		}
		else if(method == "delete") {
			var params = { type: "POST", url: "/sites/delete", dataType: "json", data: { account: model.get("account"), site: model.get("site") } };
		}
		return $.ajax(_.extend(params, options));
	},
});

var UserModel = Backbone.Model.extend({
initialize : function() {
	this.context = {
			skin : this.skin,
			editType:this.editType,
			data: {}
		};
	},
	sync : function(method, model, options) {
		if(method == "read") {
		console.log("user-read");
			var params = { type: "GET", url: "/users/view", dataType: "json",account: model.get("account"), user: model.get("user"), data:model.toJSON()};
		}
		else if(method == "create") {
			console.log("user-create");
			var params = { type: "POST", url: "/users/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			console.log("user-update");
			var params = { type: "POST", url: "/users/save", dataType: "json", data: model.toJSON() };
		}
		else if(method == "delete") {
			console.log("user-delete");
			var params = { type: "POST", url: "/users/delete", dataType: "json", data: { account: model.get("account"), user: model.get("user") } };
		}
		return $.ajax(_.extend(params, options));
	}
});

var GroupModel = Backbone.Model.extend({
initialize : function() {
	this.context = {
			skin : this.skin,
			editType:this.editType,
			name:this.group,
			data: ''
		};
	},
	sync : function(method, model, options) {
		if(method == "read") {
		console.log("group-read");
			var params = { type: "GET", url: "/groups/view", dataType: "json",account: model.get("account"), name: model.get("group"), data:model.toJSON()};
		}
		else if(method == "create") {
			console.log("group-create");
			var params = { type: "POST", url: "/groups/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			console.log("group-update");
			var params = { type: "POST", url: "/groups/save", dataType: "json",  data: model.toJSON() };
		}
		else if(method == "delete") {
			console.log("group-delete");
			var params = { type: "POST", url: "/groups/delete", dataType: "json", data: { account: model.get("account"), group: model.get("group") } };
		}
		return $.ajax(_.extend(params, options));
	}
});


//Views
window.loginView = Backbone.View.extend({
	initialize:function(){
				this.render();
	},
	events:{
				'pageinit' : 'pageShow',
				'click #submit' : 'login'
	},  
	pageShow: function() {
				var device= browserdetect();
	            console.log(window.location.pathname);
	            console.log(window.location.href);
	            if (device.desktop){
						new Messi('You are viewing OUMobile in a desktop. This feature is designed for mobile devices. For the best user experience, we suggest you to login to normal OU Campus when you are using desktop.', {title: 'Warning', titleClass: 'anim warning', modal:true, buttons: [{id: 0, label: 'Close', val: 'X'}],
							callback :function(val){
								   //submit when Enter Key is pressed
									$('input').keypress(function(event) {
										 if (event.which === 13) {
											 $('#submit').click();
											}
									});
							}
						});
				}
		},
	render:function (eventName) {
				$(this.el).html(_.template($('#adminLogin').html())); 
				return this;
		},
	login: function(){
					var skin = this.skin;
					var account = this.account;
					var username = $('#username').val();
					var password = $('#password').val();
					console.log(this.account);
					if (! this.account){
					 new Messi("There is no account selected. The URL should contain the name of the account account." , {title: 'Error', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
					}
					else{	  
					$.ajax({
						url:'/authentication/login',
						type:'post',
						data: {
							'skin': skin,
							'account':account,
							'username':username,
							'password':password
						},
						error: function(data){ 	
 								Common.errorhandler(data);
						},
						success: function(data) {
								var  nextstepurl= skin + "/accounts/" + account;
								window.app.navigate(nextstepurl, {trigger:true});
								}
					});
					
					}
		}
});

window.accountView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .users' : 'users',
		'click .sites' : 'sites',
		'click .groups' : 'groups',
		'click .report' : 'report',
		'click #addBtn' :'addBtn',
		'click #editBtn' : 'editBtn',
		'click .logout' :'logout',
	},
	template: _.template($('#account').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"account",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:this.account}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow: function(){
		var skin =this.skin;
		var account=this.account;
		$.ajax({
					url:'/accounts/view',
					data:{
					'skin':skin,
					'account':account
					},
					type:'get',
					success:function(data){
						  if(data.error){
							  console.log(data.error);
							  window.app.navigate(skin+' ',{trigger:true});
							 }
						  
						$('#accountHeader').text("Account: "+data.account);
						 var accountDiv = $('#account');
						

						
						$('#account-name').append(data.name);
						$('#account-fname').append(data.first_name);
						$('#account-lname').append(data.last_name);
						$('#account-date').append(_.dateString(_.parseISO8601(data.created)));
						
						var sitecounta = $(document.createElement('a'));
						var sitecount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.text(data.site_count);
						$('#account-nsite').append(sitecounta).append(sitecount);
						
						var pagecounta = $(document.createElement('a'));
						var pagecount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.html(data.page_count);
						$('#account-npage').append(pagecounta).append(pagecount);
						
						var groupcounta = $(document.createElement('a'));
						var groupcount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.html(data.group_count);
						$('#account-ngroup').append(groupcounta).append(groupcount);
						
						var usercounta = $(document.createElement('a'));
						var usercount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.html(data.user_count);
						$('#account-nuser').append(usercounta).append(usercount);
				
						
				
						$('#sitestooltip').attr({'title':'Show all sites of account: '+ data.account});
						$('#userstooltip').attr({'title':'Show all users of account: '+ data.account});
						$('#groupstooltip').attr({'title':'Show all groups of account: '+ data.account});
			
					}
			});	
	},
	users: function(){
		var skin =this.skin;
		var account=this.account;
		window.app.navigate(skin+'/users/'+account,{trigger:true});
		return false;
	},
	sites: function(){
		var skin =this.skin;
		var account=this.account;
		window.app.navigate(skin+'/sites/'+account,{trigger:true});
		return false;
	},
	groups: function(){
		var skin =this.skin;
		var account=this.account;
		window.app.navigate(skin+'/groups/'+account,{trigger:true});
		return false;
	},
	addBtn:function(){Common.add(this.skin, '', this.site,'account','single');
	},
	editBtn:function(){Common.add(this.skin, this.account, '','account','single','edit');
	},
	report:function(){
		var skin =this.skin;
		var account=this.account;
		window.app.navigate(skin+'/site-reports/'+account+'/'+this.site,{trigger:true});
		return false;
	},
	logout:function(){
	Common.subuserLogout();
	}
	});
window.accountEditView = Backbone.View.extend({
	events:{
		'pageshow' : 'pageShow',
		'click #cancelBtn' :'cancelBtn',
		'click #createaccount' : 'AccountEdit',
		'click #saveaccount' : 'AccountEdit'
	},
	template: _.template($('#accountEdit').html()),
	phonetemplate: _.template($('#accountEditphone').html()),
	headertemplate:_.template($('#header').html()),
	initialize:function(){
		_.bindAll(this);
		this.render();		
	},
	render:function(){
	console.log('render');
			var device = this.device; 
			$(this.el).html(this.headertemplate({page:"account", logoutid:"logout",mode:"edit",editType:this.editType, headertitle: this.headerTitle, skin:this.skin,account: this.account, site:this.site}));
			if(device =="tablet"){
			console.log(this.model.context);
				$(this.el).append(this.template(this.model.context));
			}else if (device =="phone"){
				$(this.el).append(this.phonetemplate(this.model.context));
			}	
	},

	pageShow: function(){
	console.log("pageShow");
	//var accountcontext = $('#accountform').serializeObject();
   			var editType = this.editType;
			$.mobile.fixedToolbars.show(true);
			if (editType == "edit"){
				   var accountsDiv =$('#accountdiv');
				   var data= this.model.context.data;
			    			$.each(data,function(key,value){
									var element= $("#"+key + "");
									 $("#"+key + "").val(value);
								   if( value == true && $("#"+key+"")[0]){ 
								   $("input[type='checkbox'][id='"+key+"']").attr("checked",true).checkboxradio("refresh");
										$("#"+key+"")[0].selectedIndex = 1;
									 }
			    			});
							$('#headerEditAccount').text(data.account);
							$('.dropdown').selectmenu('refresh');
							$('.slide').slider('refresh');
							$("input[type='checkbox']").checkboxradio("refresh"); 

							var value= $('#page_check').val();
								if (value != "0") {
				
									$('#filechecklist').show();
								} else {
									$('#filechecklist').hide();
							}
							var value= $('#accessibility').attr("checked");
								if (value) {
									$('#accessibilityOptions').show();
								} else {
									$('#accessibilityOptions').hide();
							}
			 }	

	},
	AccountEdit:function(){
		     		    $('.error').removeClass('error');
		     		    $('.errormessage').empty();
		     		    $('.errormessage').hide();
		     		    var accountsavecontent = $('#accountform').serializeObject();
						console.log(accountsavecontent);
						var self= this;
						this.model.save(accountsavecontent,
										{success:function(model,response){
												console.log('success');
														if(self.editMode == 'multiple'){
															Common.direct(self.skin,'' ,'accounts');
														}else{
															Common.workflowMode(self.skin,self.account,'' ,'account');
														}
												},
										error: function(model,response){
										console.log('error');
										console.log(response);
										var page =window.location.hash;
												var pageType="account";
												var  mode="edit";
												var name = self.account;
												self.errorhandler(response, pageType, mode , name);
												return false;
										}
										});	 
						return false;
	},
	errorhandler: function(response, pageType, mode , name) {
		Common.errorhandler (response, pageType, mode , name);
	},
	//where to go when canceled
	cancelBtn: function() {
		if(this.editMode == 'multiple'){
			Common.direct(this.skin,'' ,'accounts');
		}else{
			Common.workflowMode(this.skin,this.account,'' ,'account');
		}
	}
});

window.groupsView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
		'click #addBtn': 'addBtn',
		'click #homeBtn': 'homeBtn'
	},
	template:_.template($('#groupstemplate').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (){
			$(this.el).html(this.headertemplate({page:"groups",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"workflow",editType:" ",headertitle:"Groups"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow:function(){ 

			 var account=this.account;
			 var self = this;
			 var sites= $('#groups-list');

				 $.ajax({
						url:'/groups/list?skin='+this.skin+'&account='+this.account,
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data){
							$.each(data,function(index,value){
								 var a = $(document.createElement('a'))
								 	.attr({href:'#'+ self.skin + '/groups/' + value.account+ '/' + value.name})
									.attr({rel:'external'})
									.addClass('ui-link-inherit hyperlinkli')
									.text(value.name);
								var groupurl = $(document.createElement('span'))
									.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
									.text('Total Members:  '+value.member_count);
									
								 var li =$(document.createElement('li'));
								li.append(a).append(groupurl);
								 sites.append(li);
								 
								 var headerText =$('#headerText');
								 var headerTextValue =$(document.createElement('span'))
										.html('Sites <br /> <span style="font-size:13px">Account: '+ account );
										headerText.empty();
									headerText.append(headerTextValue);
					
							});
								sites.listview("refresh");
						}
						});
	},
	addBtn:function(){Common.add(this.skin, this.account, '','account');},
	homeBtn:function(){Common.workflowMode (this.skin, this.account, '' ,'account');},
	logout:function(){Common.logout();}

});
window.groupsEditModeView = Backbone.View.extend({
initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .Everyone':'EveryoneGroup',
		'click #deleteBtn':'deleteBtn',
		'click #okBtn':'okBtn',
		'click #addBtn' : 'addBtn',
		'click #homeBtn': 'homeBtn'
	},
	template:_.template($('#groupsEditMode').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"group",mode:"edit-mode",editType:"add",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:"Groups"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"toolbar"})) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		$('#editModePagesanchore').attr('id','editModePages');
		var Browser = browserdetect();
		var editPath = '#'+this.skin+'/group-edit/multiple/tablet/'+this.account;
		if(Browser.phone){
				editPath = '#'+this.skin+'/group-edit/multiple/phone/'+this.account;
		 }
		$.ajax({
				url: '/groups/list?account='+this.account,
				type: 'get',
				error:function(data){
				  Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
					 console.log(data.error);
						window.app.navigate(this.skin+'',{trigger:true});
					}
					console.log(data);
					var groups = $ ('#groups-list');
					
				    var idCount = 0;
					$.each(data, function(index, value) {
						
						   var inputElement = $(document.createElement('input'))
	                             .attr({type: 'checkbox' })
	                             .attr({id: idCount+1 })
	                             .addClass('custom')
	                             .attr({'value': value.name });
	                             
									
									
						   var inputText =$(document.createElement('span'))
						    		 .addClass('ui-btn-text')
						    		  .attr({id:idCount+1})
						     	   	 .text(value.name);
							if (value.name == 'Everyone'){
						    var a = $(document.createElement('a'))
						           .attr({rel:'external'})
						           .addClass('Everyone ui-link-inherit hyperlinkli');
							}else{
									 var a = $(document.createElement('a'))
						           .attr({href: editPath +'/'+value.name })
						           .attr({rel:'external'})
						           .addClass('ui-link-inherit hyperlinkli');
							
							}
				
					         var hyperlinkInputText = a.append(inputText);
							var addinputElement = inputElement.after(hyperlinkInputText);
					     	var li = $(document.createElement('li')).append(addinputElement);
							groups.append(li);
						idCount++;
						
					});
					groups.listview("refresh");
				}
			});
			
	
	},
	EveryoneGroup:function(){
	     new Messi('Group "Everyone" can not be modified',{title: 'Editing Groups', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
	},
	deleteBtn: function(event){
			var deletArray =$("input:checked");
			var deleteCount=0;
   			 var deleteString= "";
   			 $.each(deletArray, function(index, value) {
					 deleteString = deleteString + '&group='+value.value;
					 deleteCount++;
			 });
		
			this.model.context.data = deleteString;
			if (deleteCount==0){
				new Messi('There were no Group selected to delete.', {title: 'Deleting Groups', titleClass: 'info', buttons: [{id: 0, label: 'Close', val: 'X'}]});	
			}
			else{	
			var self = this;
			this.model.destroy({
				success: function(){
					console.log('success');
					Common.direct(self.skin,self.account,'groups');
				},
				error:function() {
					console.log('error');
				},
				data:deleteString
			});
			return false;
			}
	 },
	okBtn:function(){
		Common.direct(self.skin,'','groups');
		return false;
	},
	homeBtn:function(){Common.workflowMode (this.skin, this.account, '' ,'account');},
	addBtn:function(){
		Common.add(this.skin, this.account, '','group','multiple');
	}
});
window.groupView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #editBtn' : 'editBtn',
		'click .logout' :'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#grouptemplate').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"group",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Group Actions"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow: function(){
	 var data= this.model.context.data;
		$.mobile.fixedToolbars.show(true);
		var sessionObj = Common.whoamI();
		var user = sessionObj.user;
		var skin = sessionObj.skin;
		var account = this.account;
		var site=this.site;
		var groupDiv = $('#members');
		 
		var membercounta = $(document.createElement('a'));
		var membercount = $(document.createElement('span'))
		.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
		.text( data.member_count);

		$('#group-name').append(data.group);
		$('#member-count').append(membercounta).append(membercount);
		$('#headertitle').text(data.group);
		
		$.each(data.members,function(index,value){
								var li = $(document.createElement('li'))
								 .html(value);
								 
								groupDiv.append(li);
		});
			groupDiv.listview("refresh");

	},
	editBtn: function(){
		if(this.group == 'Everyone'){
		  new Messi('Group "Everyone" can not be modified',{title: 'Editing Groups', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
		}else{
			Common.add(this.skin, this.account, this.group,'group','single','edit');
		}
	},
	logout:function(){Common.logout();},
	homeBtn: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}

});
window.groupEditView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #cancelBtn':'cancelBtn',
		'click #creategroup' :'GroupEdit',
		'click #savegroup' : 'GroupEdit'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#groupEdit').html()),
	phoneTemplate:_.template($('#groupEditphone').html()),
	footertempalte:_.template($('#footer').html()),
	render:function(){
		var device = this.device; 
		$(this.el).html(this.headertemplate({page:"group",skin:this.skin, account:this.account, site:this.site,logoutid:"logout", mode:"edit",editType:this.editType,headertitle: this.headerTitle}));
	  	if(device == 'tablet'){
				$(this.el).append(this.template(this.model.context));
	  	}else{
				$(this.el).append(this.phoneTemplate(this.model.context));
	  	}
	  	return this;
	},
	pageShow: function(){
		var membersdata= this.model.context.data;
		$(document).ready(function() {
   			 $("#selectable").selectable();
  		});
	
		//$.mobile.fixedToolbars.show(true);
		var sessionObj = Common.whoamI();
		var user = sessionObj.user;
		var skin = sessionObj.skin;
		var account = this.account;
		var site=this.site;
		var groupDiv = $('#members');
		var membercount =0;
				
		 $.ajax({
						url:'/users/list',
						data:{'account':account},
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data){
								if (data.error){
									 window.app.navigate(skin+' ',{trigger:true});
									 console.log(data.error);
									}	
									
								console.log(data);
								$.each(data, function(index, value) {

										  
								var a = $(document.createElement('a'))
											.addClass('ui-link-inherit hyperlinkli')
											.html(value.username);
											
								var li = $(document.createElement('li')).append(a)
								 .attr({"data-mini" : "true"})
								 .attr({"data-icon" : "minus"})
								 .attr({"id" : value.username});
		
								groupDiv.append(li);
								});
 
								groupDiv.listview("refresh");
								
								$.each(membersdata.members,function(index,value){
									$('#'+value).addClass('ui-btn-up-b selectedfilter');
									$('#'+value+' a').css('color' ,'#FFFFFF');
									$('#'+value+ ' span').addClass('ui-icon-check');
									membercount++;
									$('#member-count').text(membercount);
								});	
							 
							
							}		
					
							
				});

         $("#members").selectable({
         selected: function(event,ui){
				 var id =ui.selected.id;
				 if ($(ui.selected).hasClass('selectedfilter')) {
							$(ui.selected).removeClass('ui-selectee');
							$(ui.selected).removeClass('selectedfilter').removeClass('ui-selected');
							$('#'+id).removeClass('ui-btn-up-b');
							$('#'+id).addClass('ui-btn-up-c');
							$('#'+id+' a').css('color' ,'#555555');
							$('#'+id+ ' span').removeClass('ui-icon-check');
							$('#'+id+ ' span').addClass('ui-icon-minus');
							membercount--;
							$('#member-count').text(membercount);
						
				} else {   
					$(ui.selected).addClass('ui-selectee')
					$(ui.selected).addClass('selectedfilter').addClass('ui-selected');
							$('#'+id).removeClass('ui-btn-up-c');
							$('#'+id).addClass('ui-btn-up-b');
							$('#'+id+' a').css('color' ,'#FFFFFF');
							$('#'+id+ ' span').removeClass('ui-icon-minus');
							$('#'+id+ ' span').addClass('ui-icon-check');
							membercount++;
							$('#member-count').text(membercount);
				}

			}
			 });
		 $('#group-name').append(membersdata.group);
		 $('#headertitle').text(membersdata.group);
		 groupDiv.listview("refresh");
},
	GroupEdit: function(){
		var selectedGroups = $('li:.selectedfilter');
		 var memberString= "";
		
		$.each (selectedGroups , function(index, value){
		    memberString= memberString +"&user="+value.id;
		});
		
		var groupname = '';
		if(this.group){
			groupname = this.group;
		}else{
		    groupname = $('#group-name').attr('value');
		}

		this.model.context.name = groupname;
		var ApiData = 'skin='+this.skin +'&account='+this.account+'&name='+groupname+'&group='+groupname+memberString;
		
		var self= this;
			this.model.save(this.model.context,
						{success:function(model,response){
									console.log('success');
									if(this.editMode == 'multiple'){
										console.log('multiple');
										Common.direct(self.skin,self.account ,'groups');
									}else{
										console.log('single');
										Common.workflowMode(self.skin,self.account,self.group,'group');
									}
						},
						error: function(model,response){
									console.log('error');
									console.log(response);
									var page =window.location.hash;
									var pageType="group";
									var  mode="edit";
									var name = self.account;
									Common.errorhandler(response, pageType, mode , name);
									return false;
						},
						data:ApiData
					   });	 
						return false;
	},
	cancelBtn: function() {
		if(this.editMode == 'multiple'){
		console.log('multiple');
			Common.direct(this.skin,this.account ,'groups');
		}else{
		console.log('single');
			Common.workflowMode(this.skin,this.account,this.group,'group');
		}
	}
	
});

window.usersView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #editBtn': 'editBtn',
		'click .logout':'logout',
		'click #addBtn': 'addBtn',
		'click #homeBtn' : 'homeBtn'
	},
	template:_.template($('#userstemplate').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"users",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"workflow",editType:" ",headertitle:"Users"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow:function(){

			 $.mobile.fixedToolbars.show(true);
			var sessionObj = Common.whoamI();
			var user= sessionObj.user;
			var skin= sessionObj.skin;
			var account =this.account;
			var site = this.site;
			var users= $('#users-list');
				 $.ajax({
						url:'/users/list',
						data:{'account':account},
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data){
								if (data.error){
									 window.app.navigate(skin+' ',{trigger:true});
									 console.log(data.error);
									}
									
								console.log(data);
								$.each(data, function(index, value) {
								var privilege = $(document.createElement('span'))
											.addClass('priv ui-li-count ui-btn-up-c ui-btn-corner-all')
											.text('Privilege: ' + value.privilege);
											
								var userIcon = $(document.createElement('div'))
										 .addClass('icon-user-2 user-icon')
										 .html('<span>&nbsp;</span>');
								if(value.locked){ 
								    var sup =$(document.createElement('sup'));
									var lock = $(document.createElement('i'))
									.addClass('error icon-locked');
									sup = sup.append(lock);
									userIcon = userIcon.append(sup);
								}			 
								var nextstepurl = "#"+skin + "/users/" +account + "/"+value.username;	 
								var a = $(document.createElement('a'))
											.attr({href : nextstepurl})
											.attr({rel:'external'})
											.attr({'data-transition':'slidedown'})
											.addClass('ui-link-inherit hyperlinkli')
											.html(value.username);
											a.append(privilege).append(userIcon);
		
									var li = $(document.createElement('li')).append(a);
									users.append(li);
								
								});
								users.listview("refresh");
									var headerText =$('#headerText');
									var headerTextValue =$(document.createElement('span'))
														.text('Users');
														headerText.empty();
														headerText.append(headerTextValue);
							}
						});
	},
	editBtn: function(){
			window.app.navigate(this.skin+'/users-edit-mode/'+this.account,{trigger:true});
	},
	addBtn:function(){Common.add(this.skin,this.account,this.site,'user');},
	logout:function(){Common.logout();},
	homeBtn:function(){Common.workflowMode (this.skin, this.account, '' ,'account');}
});
window.userView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #editBtn' : 'editBtn',
		'click #unlockUser' :'unlockUser',
		'click .logout': 'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#usertemplate').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"user",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"User"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow: function(){
	 var data= this.model.context.data;
		$.mobile.fixedToolbars.show(true);
		var sessionObj = Common.whoamI();
		var user = sessionObj.user;
		var skin = sessionObj.skin;
		var account = this.account;
		var site=this.site;
		var accountDiv = $('#account');
		 
		var savecounta = $(document.createElement('a'));
		var savecount = $(document.createElement('span'))
		.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
		.text(data.save_count);
		
		var privilegea = $(document.createElement('a'));
		var privilege = $(document.createElement('span'))
		.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
		.text( data.privilege);
		
		
		var savedate = $(document.createElement('span'))
		.addClass('information')
		.text(_.dateString(_.parseISO8601(data.last_saved)));
		
		var logindate = $(document.createElement('span'))
		.addClass('information')
		.text(_.dateString(_.parseISO8601(data.last_login)));
		var approver = data.approver;
		if(approver == ""){
			approver ="None";
	
		}
		if(data.locked){
			$('#unlockUser').show();
		}
		$('#user-name').append(data.user);
		$('#approver').append(approver);
		$('#privilege').append(privilegea).append(privilege);
		$('#fname').append(data.first_name);
		$('#lname').append(data.last_name);
		if(savedate){
			$('#last-save-date').append(savedate);
		}else{
			$('#last-save-date').append("N/A");
		}
		
		if(logindate){
			$('#last-login-date').append(logindate);
		}else{
			$('#last-login-date').append("N/A");
		}
		$('#save-count').append(savecounta).append(savecount);
		$('#headertitle').text(user);

	},
	unlockUser:function(){
			new Messi('Unlock User API: To be implemented.', {title: 'Error', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Close', val: 'X'}],
					callback :function(val){
			}});
	},
	editBtn: function(){
	Common.add(this.skin, this.account, this.user,'user','single','edit');
	},
	logout:function(){Common.logout();},
	homeBtn: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}
});
window.usersEditModeView = Backbone.View.extend({
initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click .logout' :'logout',
		'click #okBtn':'okBtn',
		'click #addBtn' : 'addBtn',
		'click #homeBtn': 'homeBtn'
	},
	template:_.template($('#usersEditMode ').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"user",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"edit-mode",editType:"add",headertitle:"Users"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"toolbar"}));
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		$('#editModePagesanchore').attr('id','editModePages');
		var Browser = browserdetect();
		var editPath = '#'+this.skin+'/user-edit/multiple/tablet/'+this.account;
		if(Browser.phone){
				editPath = '#'+this.skin+'/user-edit/multiple/phone/'+this.account;
		 }
		$.ajax({
				url: '/users/list?account='+this.account,
				type: 'get',
				error:function(data){
				 	Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
					 console.log(data.error);
						window.app.navigate(this.skin+'',{trigger:true});
					}
					console.log(data);
					var users = $ ('#user-list');
					//users.empty();
				    var idCount = 0;
					$.each(data, function(index, value) {
					 // console.log(data);
						
						   var inputElement = $(document.createElement('input'))
	                             .attr({type: 'checkbox' })
	                             .attr({id: idCount+1 })
	                             .addClass('custom')
	                            .attr({'value': value.username });
	                             
									
									
						   var inputText =$(document.createElement('span'))
						    		 .addClass('ui-btn-text')
						    		  .attr({id:idCount+1})
						     	   	 .text(value.username);
							
						    var a = $(document.createElement('a'))
						           .attr({href: editPath +'/'+value.username })
						           .attr({rel:'external'})
						           .addClass('ui-link-inherit hyperlinkli');
							
				
					
					         var hyperlinkInputText = a.append(inputText);
							var addinputElement = inputElement.after(hyperlinkInputText);
					     	var li = $(document.createElement('li')).append(addinputElement);
							users.append(li);
						idCount++;
						
					});
					users.listview("refresh");
				}
			});
			
	
	},
	deleteBtn: function(event){
			var deletArray =$("input:checked");
			var deleteCount=0;
   			 //console.log(deletArray);
   			 var deleteString= "";
   			 $.each(deletArray, function(index, value) { 
					 console.log(index + ': ' + value.defaultValue); 
					 deleteString= deleteString + '&user='+value.defaultValue;
					 deleteCount++;
			 });
			this.model.context.data=deleteString;
			if (deleteCount==0){
				new Messi('There were no User selected to delete.', {title: 'Deleting Users', titleClass: 'info', buttons: [{id: 0, label: 'Close', val: 'X'}]});
				/*window.app.navigate(this.skin+'/message/'+this.account+'/'+this.user,{trigger:true});
				$("#alert_title").empty();
				$("#alert_body").empty();
				$("#alert_title").text("Action: Deleting Users:");
				$("#alert_body").text("There were no User selected to delete.");*/			
			}
			else{
			new Messi('Are you sure you want to delete the selected accounts ?',{title: 'Deleting Accounts', titleClass: 'anim warning', buttons: [{id:0, label:'Yes', val:'Y'},{id:1, label:'No', val: 'N'}],
				callback:function(val){
					if(val =='Y'){
					var self = this;
					this.model.destroy({
						//data:this.model.context,
						success: function(){
							console.log('success');
							Common.direct(self.skin,self.account,'user');
						},
						error:function() {
							console.log('error');
						}
					});
					}
				}
			});
			return false;
			}
	 },
	logout:function(){Common.logout();},
	okBtn:function(){
		Common.direct(self.skin,'','user');
		return false;
	},
	addBtn:function(){
		Common.add(this.skin,this.account,'','user');
	},
	homeBtn:function(){Common.workflowMode (this.skin, this.account, '' ,'account');}
});
window.userEditView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #cancelBtn':'cancelBtn',
		'click #createuser' :'UserEdit',
		'click #saveuser' : 'UserEdit'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#userEdit').html()),
	phoneTemplate:_.template($('#userEditphone').html()),
	footertempalte:_.template($('#footer').html()),
	render:function(){
		var device = this.device; 
		$(this.el).html(this.headertemplate({page:"user",skin:this.skin, account:this.account, site:this.site,logoutid:"logout", mode:"edit",editType:this.editType,headertitle: this.headerTitle}));
	  	if(device == 'tablet'){
				$(this.el).append(this.template(this.model.context));
	  	}else{
				$(this.el).append(this.phoneTemplate(this.model.context));
	  	}
	  	return this;
	},
	pageShow: function(){
	var usercontext = $('#userform').serializeObject();
	console.log(usercontext);

			$('#sendmessage').click(function(){
			var serializedelement =$(this).serialize();
			//console.log(serializedelement);
			if (serializedelement=='sendmessage=on'){
			$('#showmessagedetails').show('slidedown',false,true);
			}
			else{$('#showmessagedetails').hide('slideup',false,true);}
			});
		var user= this.user;
			if (this.editType == "edit"){
				   var userdiv =$('#userdiv');
				   var data= this.model.context.data;

							$('#headerEditUser').text(data.user);
							$.each(data,function(key,value){
								var element= $("#"+key + "");
								$("#"+key + "").val(value);
						   if( value == true && $("#"+key+"")[0]){ 
						 		$("input[type='checkbox'][id='"+key+"']").attr("checked",true).checkboxradio("refresh");
								$("#"+key+"")[0].selectedIndex = 1;
							 }
							});
							
							$('#headerEditAccount').text(data.account);
							$('.dropdown').selectmenu('refresh');
							$('.slide').slider('refresh');
						
			 }
			 
		 $.ajax({
				url:'/users/list',
				data:{'account':this.account},
				type: 'get',
				error:function(data){
					 Common.errorhandler(data);
				},
				success: function(data){

						$.each(data, function(index, value) {
									
						var option = $(document.createElement('option'))
						.text(value.username)
						.attr({'value': value.username});
						
						$('#approver').append(option);
						});	
					}
				});
				
		 $.ajax({
					url:'/toolbars/list',
					data:{'account':this.account},
					type: 'get',
					error:function(data){
						 Common.errorhandler(data);
					},
					success: function(data){
	
							$.each(data, function(index, value) {
	
							var option = $(document.createElement('option'))
							.text(value.name)
							.attr({'value': index +1 });
	
							$('#toolbar').append(option);
							});	
						}
				});
	
	},
	UserEdit:function(){
			$('.error').removeClass('error');
		    $('.errormessage').empty();
		    $('.errormessage').hide();
		    var usersavecontent= $('#userform').serializeObject();
		    console.log(usersavecontent);
			var self=this;
			this.model.save(usersavecontent,
							{success:function(model,response){
									console.log('success');
									if(self.editMode == "multiple"){
										Common.direct(self.skin,self.account ,'users');
									}
									else{
										Common.workflowMode(self.skin,self.account,self.user ,'user');
									}
							},
							error: function(model,response){
							console.log('error');
							var page =window.location.hash;
									var pageType="user";
									var  mode="edit";
									var name = self.account;
									self.errorhandler(response, pageType, mode , name);
									 return false;
							}
						});	  
						return false;
	},
		errorhandler : function (response, pageType, mode , name){
		Common.errorhandler (response, pageType, mode , name);
	},
		cancelBtn:function(){	
		if (this.editMode =="multiple") {
			Common.direct(this.skin,this.account,'users');
		}
		else{
			Common.workflowMode(this.skin,this.account,this.user ,'user');
		}
	}
});

window.sitesView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
		'click #addBtn': 'addBtn',
		'click #homeBtn': 'homeBtn',
		'click #homeBtn' : 'homeBtn'
	},
	template:_.template($('#sitestemplate').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"sites",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:"Sites"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow:function(){ 
		     var sessionObj = Common.whoamI();
	         var user= sessionObj.user;
			 var account=this.account;
			 var sites= $('#sites-list');
				 $.ajax({
						url:'/sites/list?skin='+this.skin+'&account='+this.account,
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data){
							if (data.error){
								 console.log(data.error);
							}
		
							var params =location.search;
							$.each(data,function(index,value){
								 var  nextstepurl= '#'+sessionObj.skin+'/sites/'+account+'/'+value.site;
								 var a = $(document.createElement('a'))
								 	.attr({href: nextstepurl})
									.attr({rel:'external'})
									.addClass('ui-link-inherit hyperlinkli')
									.text(value.site);
								
								var siteurl = $(document.createElement('span'))
									.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
									.text(value.url);
									
								 var li =$(document.createElement('li')).append(a);
								li.append(siteurl);
								 sites.append(li);
								 
								 var headerText =$('#headerText');
								 var headerTextValue =$(document.createElement('span'))
										.html(value.site);
										headerText.empty();
									headerText.append(headerTextValue);
					
							});
					
								sites.listview("refresh");
						}
						});
	},
	addBtn:function(){Common.add(this.skin,this.account,this.site,'site');},
	homeBtn:function(){Common.home;},
	logout:function(){Common.logout();},
	homeBtn: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}	

});
window.sitesEditModeView =Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click .logout' :'logout',
		'click #okBtn':'okBtn',
		'click #addBtn' : 'addBtn',
		'click #homeBtn': 'homeBtn'
	},
	template:_.template($('#sitesEditMode').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"site",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"edit-mode",editType:"add",headertitle:"Sites"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"toolbar"})) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var Browser = browserdetect();
		$('#editModePagesanchore').attr('id','editModePages');
		var idCount = 0;  
		//console.log(Browser);
		var editPath ='#'+this.skin+'/site-edit/multiple/tablet/'+ this.account;
		if(Browser.phone){
			var editPath ='#'+this.skin+'/site-edit/multiple/phone/'+this.account;
		}
		$.ajax({
				url: '/sites/list?skin='+this.skin+'&account='+this.account,
				type: 'get',
				error:function(data){
				 			 Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
						console.log(data.error);
					}
					var sites = $('#sites-list');
					$.each(data, function(index, value) {
						   var inputElement = $(document.createElement('input'))
	                             .attr({type: 'checkbox' })
	                             .attr({id: idCount+1 })
	                             .addClass('custom')
	                             .attr({value: value.site });
	 	
						   var inputText =$(document.createElement('span'))
								 .addClass('ui-btn-text')
								 .attr({id:idCount+1})
								 .text(value.site);   	   	 
	
							var a = $(document.createElement('a'))
						           .attr({href:editPath +'/'+value.site})
						           .attr({rel:'external'})
						           .addClass('ui-link-inherit hyperlinkli');
					        var hyperlinkInputText = a.append(inputText);
							var addinputElement = inputElement.after(hyperlinkInputText);
					     	var li = $(document.createElement('li')).append(addinputElement);
							sites.append(li);
							idCount++;
					});
					sites.listview("refresh");
				}
			});
	},
	deleteBtn: function(event){
			var deletArray =$("input:checked");
			var deleteCount=0;
   			 //console.log(deletArray);
   			 var deleteString= "";
   			 $.each(deletArray, function(index, value) { 
					 console.log(index + ': ' + value.defaultValue); 
					 deleteString= deleteString + '&site='+value.defaultValue;
					 deleteCount++;
			 });
			this.model.context.data=deleteString;
			if (deleteCount==0){
				new Messi('There were no Site selected to delete.', {title: 'Deleting Sites', titleClass: 'info', buttons: [{id: 0, label: 'Close', val: 'X'}]});
				/*window.app.navigate(this.skin+'/message/'+this.account,{trigger:true});
				$("#alert_title").empty();
				$("#alert_body").empty();
				$("#alert_title").text("Action: Deleting Sites:");
				$("#alert_body").text("There were no Site selected to delete.");*/			
			}
			else{	
			var self = this;
			this.model.destroy({
				success: function(){
					console.log('success');
					Common.direct(self.skin,self.account,'site');

				},
				error:function() {
					console.log('error');
				}
			});
			return false;
			}
	 },

	logout:function(){Common.logout();},
	okBtn:function(){
		Common.direct(self.skin,self.account,'site');
		return false;
	},
	homeBtn:function(){
		Common.workflowMode (this.skin, this.account, '' ,'account');
	},
	addBtn:function(){
		Common.add(this.skin,this.account,this.site,'site','multiple');
	}
});
window.siteView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #editBtn' : 'editBtn',
		'click .logout' :'logout',
		'click #homeBtn' : 'homeBtn',
		'click #publishBtn' :'publish',
		'click #reportsBtn' :'reports',
		'click #scanBtn' :'scan',
		'click #backupBtn' : 'backup'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#sitetemplate').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"site",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Actions"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow: function(){
	 var data= this.model.context.data;
		$.mobile.fixedToolbars.show(true);
		var sessionObj = Common.whoamI();
		var user = sessionObj.user;
		var skin = sessionObj.skin;
		var account = this.account;
		var site=this.site;
		var accountDiv = $('#account');
		 
		var savecounta = $(document.createElement('a'));
		var savecount = $(document.createElement('span'))
		.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
		.text( data.save_count);
		
		var url = $(document.createElement('span'))
		.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
		.text( data.http_root)
		.css('font-size','12px')
		.css('padding','1px 3px');
		
		
		var date = $(document.createElement('span'))
		.addClass('information')
		.text(_.dateString(_.parseISO8601(data.last_saved)));
		
		$('#site-name').append(data.site);
		$('#last-save-date').append(date);
		$('#save-count').append(savecounta).append(savecount);
		$('#url').append(url);	
		$('#headertitle').text(site);
	


	},
	editBtn: function(){
		Common.add(this.skin, this.account, this.site,'site','single','edit');
	},
	logout:function(){
		Common.logout();
	},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	},
	publish: function(){
		console.log("publish");
		window.app.navigate(this.skin+'/site-publish/'+ this.account+ '/' + this.site,{trigger:true});
		return false;
	},
	reports:function(){
		console.log("reports");
		window.app.navigate(this.skin+'/site-reports/'+ this.account+ '/' + this.site,{trigger:true});
		return false;
	},
	scan:function(){
		console.log("scan");
		window.app.navigate(this.skin+'/site-scan/'+ this.account+ '/' + this.site,{trigger:true});
		return false;
	},
	backup:function(){
		console.log("backup");
		//window.app.navigate(this.skin+'/site-backup/'+ this.account+ '/' + this.site,{trigger:true});
		new Messi('Site Backup API: To be implemented.', {title: 'Error', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Close', val: 'X'}],
					callback :function(val){
		}});
		return false;
	}
});
window.siteEditView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();
	
	},
	events:{
		'pageshow' : 'pageShow',
		'click #cancelBtn': 'cancelBtn',
		'click #createsite' :'SiteEdit',
		'click #savesite': 'SiteEdit',
		'click #testConnectivityBtn' : 'testLDP',
		'click #buildIndex' : 'buildIndex',
		'click #downloadRegBtn' : 'downloadReg',
		"keyup #file_regex, #test_file_regex, #binary_regex, #test_binary_regex" : "testRegex",
		"click #negate_regex span, #negate_binary_regex span" : "testRegex"
		
	},
	headertemplate:_.template($('#header').html()),
	template: _.template($('#siteEdit').html()),
	phoneTemplate:_.template($('#siteEditphone').html()),
	render:function(){
		var device = this.device;
		$(this.el).html(this.headertemplate({page:"site",mode:"edit",skin:this.skin, account:this.account, site:this.site,logoutid:"logout", mode:"edit",editType:this.editType, headertitle: this.headerTitle}));
		if(device =='tablet'){
		console.log('render');
				$(this.el).append(this.template(this.model.context));
		}else{
				$(this.el).append(this.phoneTemplate(this.model.context));
		}
		return this;
	},
	pageShow:function(){
	var sitecontext= $('#siteform').serializeObject();
	console.log(sitecontext);
	$.mobile.fixedToolbars.show(true);
		
		if (this.editType == "edit"){
				   var accountsDiv =$('#sitediv');
				   var data= this.model.context.data;
							$('#headerEditSite').text(data.account);
							$.each(data,function(key,value){
								var element= $("#"+key + "");
								$("#"+key + "").val(value.toString());
								$('input:[name='+key+']').val(value).attr("checked",true);

							});	
							if(sitecontext.password){
								$("#fauthtype0").attr("checked",true);
							}else{
								$("#fauthtype1").attr("checked",true);
								$('#passwordLi').hide();
							}
							$('#headerEditAccount').text(data.account);
							$('.dropdown').selectmenu('refresh');
							$('.slide').slider('refresh');
							$('.fixcheckbox').checkboxradio("refresh");
							$('.fixcheckbox:radio:checked').checkboxradio("refresh");

			 }	
			$("#file_regex").keypress(function() {
			   if ($(this).val() == ""){
 				$('.regextest').hide('slideup',false,true);
 				}
				else{
				$('.regextest').show('slidedown',false,true);
				}
			});
			
			$("#binary_regex").keypress(function() {
				if ($(this).val() == ""){
 					$('.binaryregextest').hide('slideup',false,true);
 				}
				else{
					$('.binaryregextest').show('slidedown',false,true);
				}
			});
			 
		    $.ajax({
					url:'/toolbars/list',
					data:{'account':this.account},
					type: 'get',
					error:function(data){
						 Common.errorhandler(data);
					},
					success: function(data){
	
							$.each(data, function(index, value) {
	
							var option = $(document.createElement('option'))
							.text(value.name)
							.attr({'value': index +1 });
							$('#toolbar').append(option);
							});	
						}
				});

	
	},
	SiteEdit:function() {
		     		    $('.error').removeClass('error');
		     		    $('.errormessage').empty();
		     		    $('.errormessage').hide();
		     		    var sitesavecontent = $('#siteform').serializeObject();
						console.log(sitesavecontent);
						var self=this;
						this.model.save(sitesavecontent,
										{success:function(model,response){
												console.log('success');
												if(self.editMode=="mutiple"){
													Common.direct(self.skin,self.account ,'sites');
												}
												else{
													Common.workflowMode(self.skin, self.account, self.site , 'site');
												}
										},
										
										error: function(model,response){
										console.log('error');
										console.log(response);
										var page =window.location.hash;
												var pageType="site";
												var  mode="edit";
												var name = self.site;
												self.errorhandler(response, pageType, mode , name);
												return false;
										}
										});	 
						return false;
	},
	testRegex : function(evt) { 
		this.regexTimer && clearTimeout(this.regexTimer);
		var $this = $(evt.currentTarget);
		var self = this;
		var binary = $this.attr("id").indexOf("binary") >= 0;
		var $fileRegex = binary ? $("#binary_regex") : $("#file_regex");
		var $testRegex = binary ? $("#test_binary_regex") : $("#test_file_regex");
		var negate =binary ? $("#negate_binary_regex").serializeObject() : $("#negate_regex").serializeObject() ;
		var inverse = binary ? negate.negate_binary_regex : negate.negate_regex;
		console.log(inverse);
		if(!$fileRegex.val()) {
			$fileRegex.removeClass("success error");
			$testRegex.removeClass("success error");
			$fileRegex.closest('i.error').detach();
			$testRegex.closest('i.success').detach();	
			return;
		}
		this.regexTimer = setTimeout(function() {
			clearTimeout(self.regexTimer);
			self.regexTimer = false;
						var checkmark = $(document.createElement('i'))
							.addClass('success icon-checkmark');
			var errormark = $(document.createElement('i'))
							.addClass('error icon-cancel-3');
			$('i.error').detach();
			$('i.success').detach();
			$fileRegex.removeClass("success error");
			$testRegex.removeClass("success error");
			if(!($this.attr("id").indexOf("test") >= 0 && $fileRegex.closest(".control-group").hasClass("error"))) {
				$.ajax({
					type: "GET", url: "/servlet/OX/checkRE", dataType: "json",
					data: { re: $fileRegex.val(), test: $testRegex.val() },
					success: function(data) {
						if(data["re-valid"])
							$fileRegex.removeClass("error").addClass("success") ;
						else
							$fileRegex.removeClass("success").addClass("error") ;
							
						if(!$testRegex.val() || !$fileRegex.val()){
							$testRegex.removeClass("success error") ;
						}else if((data["test-passed"] && !inverse) || (!data["test-passed"] && inverse)){
							$testRegex.removeClass("error").addClass("success") ;
						}else{
							$testRegex.removeClass("success").addClass("error");
						}
							$('input[type=text].error').after(errormark);
							$('input[type=text].success').after(checkmark);
					},	
					error: function() {
						$this.addClass("error");
						$('input[type=text].error').after(errormark);
	
					}
				});
			}
		}, 500);
	},

	testLDP : function(evt) {
			var self = this;
			$.ajax({
				type: "POST", url: "/servlet/OX/ldptest", dataType: "json",
				data: {
					site: this.model.get("site"),
					user: this.model.get("account")
				},
				success: function(data) {
						if(data.error){
							$("#testConnectivityStatus").show();
							$("#testConnectivityStatus").addClass("error").html(data.output);
						}else{
							$("#testConnectivityStatus").show();
							$("#testConnectivityStatus").addClass("success").html(data.output);
						}
				},
				error: function() {
						$("#testConnectivityStatus").show();
						$("#testConnectivityStatus").addClass("error").html(data.output);
				}
				});
	},
	Index : function() {
			var self = this;
			$.ajax({
				type: "GET", url: "/servlet/OX/buildindex",
				data: {
					superadmin: true,
					user: this.model.get("account"),
					site: this.model.get("site"),
					action: this.interval ? "checkstatus" : "build"
				},
				success: function(data) {
				console.log(data.status);
				    if(data.status == "wait") {
						$("#buildIndexStauts").html(data.message).attr("class","success");
				    }
					else if(data.status == "ok") {
						clearInterval(self.interval);
						self.interval = false;
						$("#buildIndexStauts").html(data.message).attr("class","success");
						$("#buildIndex").prop("disabled", false);
					}
				},
				error: function(data) {
					clearInterval(self.interval);
					$("#buildIndexStauts").html(data.message).attr("class","error");
					$("#buildIndex").prop("disabled", false);
				}
	});
	},
	buildIndex : function() {	
		$("#buildIndexStauts").show();
		$("#buildIndexBtn").prop("disabled", true);
		this.Index();
		this.interval = setInterval(this.Index, 2000);
		return false;
	},
	downloadReg:function(){
		document.location.href = "/servlet/OX/ldpregfile?user="+this.account+ "&site=" + this.site;
		return false;

	},
	cancelBtn:function(){
			if(this.editMode == 'multiple'){
				Common.direct(this.skin,this.account,'sites');
			}else{
				Common.workflowMode(this.skin,this.account,this.site ,'site');
			}
		
	},
	errorhandler : function (response, pageType, mode , name){
		Common.errorhandler (response, pageType, mode , name);
	},
	logout:function(){Common.logout();},
	addBtn: function(){
		Common.add(this.skin, this.account, this.site, 'site');
	}
});

window.sitePublishView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
		'click #homeBtn' : 'homeBtn',
		'click #start' : 'start',
		'click #display-errors': 'displayErrors'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#sitePublish').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
	        $(this.el).html(this.headertemplate({page:"site-publish",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Publish"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		//Common.subuserLogoutBtn();
		var platform= browserdetect();
		var sitename = this.site;
		var account = this.account;
		var skin = this.skin;
		
		if(platform.tablet ||platform.desktop ){
			$('#buttons').css('margin','30px');
		}
		$('#siteName').text(sitename);
		$.mobile.page();  
	},
	start: function(event) {
		new Messi('Are you sure you want to publish site: '+this.site +' ?',{title: 'Publish Site', titleClass: 'anim warning', buttons: [{id:0, label:'Yes', val:'Y'},{id:1, label:'No', val: 'N'}],
		callback:$.proxy(function(val){
			if(val =='Y'){
			this.doPublish(this.account,this.site);
			}
		},this)
	   });
		},
	displayErrors: function(event){
	
		var errorList = $('#error-list');
		if (errorList.is(':hidden')) {
			$('#error-list').show('slidedown',false,true);
			$('#buttons').hide('slideup',false,true);
			var action =$(document.createElement('span'))
			.text('Hide Unpublished Pages.');
			
			var arrowUp =$(document.createElement('i'))
			.addClass('icon-arrow-up');
		
			$('#display-errors').html('&nbsp;');
			$('#display-errors').append(action.append(arrowUp ));
			 
		} else {
			$('#error-list').hide('slideup',false,true);
			$('#buttons').show('slidedown',false,true);
			var action =$(document.createElement('span'))
			.text('Show Unpublished Pages.');
			
			var arrowDown =$(document.createElement('i'))
			.addClass('icon-arrow-down');
            $('#display-errors').html('&nbsp;');
			$('#display-errors').append(action.append(arrowDown));
		}
		return false;
	},
	doPublish:function(account,sitename,messageShown) {
				$.ajax({
				url: '/sites/publish?account='+account+'&site='+sitename,
				type: 'post',
				error:function(data){
					 Common.errorhandler(data);
				},
				success:$.proxy(function(data) {
					console.log(data);
					var errorCount =0;
					if (data.finished) {
							clearInterval(interval);
							interval = null;
							$('#start').removeAttr('disabled');
							$('#buttons').css({"opacity": "1"});
							$('#buttons:hover').css({"opacity": "1"});
							var msg;
							if (data.error) {
									var errorList = $('#error-list');
									$.each(data.messages, function(index, error) {
										var li = $(document.createElement('li')).text(error);
										errorList.append(li);
										errorCount= errorCount+1;
									});
									errorList.listview("refresh");
								
								var message = $(document.createElement('div'))
								.text('The site has been published.');
								
								var report =$(document.createElement('div'))
									.text(data.files_published  + (data.files_published === 1 ? ' file has' : ' files have') + ' been published, and '+errorCount+' pages failed to be published.');
									$('#report').append(report);
									$('#message').addClass('success');
									$('#errors').show();
									$('#progress').hide();
							} else {
									msg = 'The site has been successfully published.';
									$('#message').addClass('success');
							} 	
						
							$('#message').html(message.append(report));
							

					} else if (data.error) {
						console.log(data.error);
					} else {
						if (interval === null) {
							$('#message').removeClass('success');
							$('#start').attr('disabled', 'disabled');
							$('#buttons').css({"opacity": "0.65"});
							$('#buttons:hover').css({"opacity": "0.65"});
							$('#start').addClass('mobile-button-disabled ui-state-disabled');
							interval = setInterval($.proxy(function(event) {
								this.doPublish(account,sitename,true);
							},this), 2000);
						
						}
						var published = data.published;
						var filesPublished = data.files_published;
						var status = $('#status');
						var spinner = $('#progress');
						var message = $('#message');
						if (status.is(':hidden')) {
							status.show();
						}
						if (spinner.is(':hidden')) {
							spinner.show();
						}
						if (message.is(':hidden')) {
							message.show();
							message.css('display','block');
						}
						message.html(filesPublished + (filesPublished=== 1 ? ' file has' : ' files have') + ' been published.');
					}
				},this)
			});
				return false;

	},
	logout:function(){Common.subuserLogout();},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});
window.siteScanView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #start' : 'start',
		'click .logout' : 'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#siteScan').html()),
	footertemplate:_.template($('#footer').html()),
	render: function(){
			$(this.el).html(this.headertemplate({page:"site-scan",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Scan"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow:function(){
			$.mobile.fixedToolbars.show(true);
			var platform= browserdetect();
			if(platform.tablet ||platform.desktop ){
				$('#buttons').css('margin','30px');
			}
			var site= this.site;
			var account = this.account;
			var sitename =  this.site;
			var sessionObj = Common.whoamI();
			var user = sessionObj.user;
			interval = null;
			var sitename = location.search;
			$.mobile.page();		
	},
	start: function(event){
		new Messi('Are you sure you want to scan site: '+this.site +' ?',{title: 'Scan Site', titleClass: 'anim warning', buttons: [{id:0, label:'Yes', val:'Y'},{id:1, label:'No', val: 'N'}],
		callback:$.proxy(function(val){
			if(val =='Y'){
				this.resetIcons();
				$('#start').attr('disabled', 'disabled');
				$('#buttons').css({"opacity": "0.65"});
				$('#buttons:hover').css({"opacity": "0.65"});
				this.doScan(this.account,this.site);
				if (interval === null) {
					interval = setInterval($.proxy(function() {
						this.doScan(this.account,this.site);
					},this), 2000);
				}
			}
		},this)
	   });
	},
	doScan: function(account,site){
	$.ajax({
				url: '/sites/scan?account=' + account + '&site='+site,
				type: 'post',
				error:function(data){
				 		Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
					console.log(data.error);
					window.app.navigate(skin+' ',{trigger:true});
					} else {
						var currentPass = data.current_pass;
						if (data.finished) {
							 $('#buttons').css({"opacity": "1"});
				             $('#buttons:hover').css({"opacity": "1"});
							if(totalPasses != 4){
							$('li#pass1 span.ui-icon, li#pass2 span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
							}else{
								$('span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
							}
							$('#start').removeAttr('disabled');
							clearInterval(interval);
							interval = null;
						} else {
							var passes = $('#passes');
							var totalPasses = data.total_passes;
							if(totalPasses != 4){
							$('li#pass3').addClass('dmonly'); 
							$('li#pass4').addClass('dmonly'); 
							}
							switch(currentPass) {
							case 4:
								$('span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
								$('li#pass4 span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-current');
								break;
							case 3:
								$('li#pass3 span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-current');
								$('li#pass2 span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
								$('li#pass1 span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
								break;
							case 2:
								$('li#pass2 span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-current');
								$('li#pass1 span.ui-icon').removeClass('ui-icon-current ui-icon-minus').addClass('ui-icon-check');
								break;
							}
						}
					}
				}
			});
	},
	resetIcons: function(){
			$('.ui-icon').removeClass('ui-icon-check ui-icon-current').addClass('ui-icon-minus');
			$('#pass1 span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-current');
	},
	logout:function(){
		Common.subuserLogout();
	},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});
window.siteReportsView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout' : 'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReports').html()),
	footertemplate:_.template($('#footer').html()),
	render:function(){
		    $(this.el).html(this.headertemplate({page:"site-reports",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Reports"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow:function(){

			$.mobile.fixedToolbars.show(true);
			var skin= this.skin;
			var account = this.account;
			var sitename = this.site;
			$('a.report-item').each(function(index, el) {
				var aEl = $(el);
				var elId = aEl.attr('id');
				aEl.attr('href', '#'+skin+'/report-' + elId + '/' +account+'/'+ sitename);
				var link= $('a.'+elId);
				 console.log(link);
				link.attr('href', '#'+skin+'/report-' + elId + '/' +account+'/'+ sitename);
				$('#publishedtooltip').attr({'title':'Show Published content.'});
				$('#scheduledtooltip').attr({'title':'Show Scheduled content.'});
				$('#checkedouttooltip').attr({'title':'Show Checkedout content.'});
			});
			$.mobile.page();
	},
	logout:function(){Common.subuserLogout();},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});
window.siteReportCheckedOutView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .pageitem' :'pageItem',
		'click .logout' : 'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReportCheckedOut').html()),
	footertemplate:_.template($('#footer').html()),
	render:function(){
			$(this.el).html(this.headertemplate({page:"site-report-checkedout",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Report"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate({toolbar:"back"}));
			return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		var skin = this.skin;
		var sitename = this.site;
		var account = this. account;
		$.ajax({
				url: '/pages/checkedout?account='+account+'&site='+sitename,
				type: 'get',
				error:function(data){
				 	Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
						window.app.navigate(skin+' ',{trigger:true});
					}
					var pageList = $('#pages');
					//pageList.empty();
					if (data.length == 0) {
						var li = $(document.createElement('li'))
							.text('There is no checked out content.');
						pageList.append(li);
					} else {
						$.each(data, function(index, page) {
							var path = $(document.createElement('h3'))
								.addClass('path')
								.text(page.name);
							var div = $(document.createElement('span')) 
							.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all');
							var info = $(document.createElement('span'))
								.addClass('lighter')
								.text('Checked out by ');
							div.append(info);
							div.append(page.username);
							var a = $(document.createElement('a'))
								.css({'padding': '0px'})
								.attr('href', '#')
							a.append(path).append(div);
							var li = $(document.createElement('li'))
								.attr({'data-path': page.path, 'data-icon': 'checkin', 'data-iconpos': 'left'})
								.addClass('pageitem')
								.addClass('row')
								.append(a);
							pageList.append(li);
							
						});
					}
					pageList.listview("refresh");
				}
			});
	},
	pageItem: function(event){
	
					var el = $(event.currentTarget);
					var path = el.attr('data-path');
				new Messi('Are you sure you want to check in page: '+this.site +' ?',{title: 'Check in Pages', titleClass: 'anim warning', buttons: [{id:0, label:'Yes', val:'Y'},{id:1, label:'No', val: 'N'}],
				callback:$.proxy(function(val){
					if(val =='Y'){
					$.ajax({
						url: '/pages/checkin?account='+ this.account + '&site='+ this.site,
						type: 'post',
						data: {
							'path': path
						},
						success: function(data) {
							el.hide(500, function() {
								el.remove();
								var pageList = $('#pages');
								if (pageList.children().size() == 0) {
									var li = $(document.createElement('li'))
										.text('There is no checked out content.');
									pageList.append(li);
								}
								pageList.listview("refresh");
							});
						}
					});
					}
					},this)});
	},
	logout:function(){
		Common.subuserLogout();
	},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});

window.siteReportPublishedView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReportPublished').html()),
	footertemplate:_.template($('#footer').html()),
	render: function(){
		$(this.el).html(this.headertemplate({page:"site-report-published",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Recently Published Pages"}));
		$(this.el).append(this.template());
		$(this.el).append(this.footertemplate({toolbar:"back"}));
		return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		var skin = this.skin;
		var account = this.account;
		var sitename = this.site;
			$.ajax({
					url: '/sites/publish_report?account=' + account+'&site='+sitename,
					type: 'get',
					error:function(data){
				 			 Common.errorhandler(data);
					},
					success: function(data) {
					    $("#ajaxSpinnerImage").hide();
					    $(".ui-input-search").show();
						if (data.error) {
							window.app.navigate(skin+' ' ,{trigger:true});
						}
						var pageList = $('#published-pages');
						//pageList.empty();
						if (data.length == 0) {
							var li = $(document.createElement('li'))
									.text('There is no recently published content.');
							pageList.append(li);
						} else {
						console.log('here the problem happens');
									$.each(data, function(index, page) {
									if (index >100){
									return false;
									}else{
											var path = $(document.createElement('h3'))
												.addClass(path)
												.attr({'title':page.path})
												.text(page.path);
												
											var pathdiv = $(document.createElement('div'))
												.addClass('pathdiv');
												
											var div = $(document.createElement('div'));
											
											var info = $(document.createElement('span'))
												.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
												.addClass('lighter')
												.html('Manually published by: <br />'+page.username);
											pathdiv.append(info);
											
											var a = $(document.createElement('a'))
												.css({'padding': '0px'})
												.attr('href', 'report-published-log.html' + sitename + '&path=' + page.path)
												.css('padding-bottom', '0px')
												.append(pathdiv)
												.append(path)
												.append(div);
												
											var li = $(document.createElement('li'))
												.append(a);
											pageList.append(li);
									index=index+1;
									}
									});
							}
							pageList.listview("refresh");
					 }
			 });	
	},
	logout:function(){
		Common.subuserLogout();
	},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});


window.siteReportScheduledView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	events:{
		'pageshow': 'pageShow',
		'click .logout' : 'logout',
		'click #homeBtn' : 'homeBtn'
	},
	headertemplate: _.template($('#header').html()),
	template:_.template($('#siteReportScheduled').html()),
	footertemplate:_.template($('#footer').html()),
	render: function(){
		$(this.el).html(this.headertemplate({page:"site-report-scheduled", mode:"workflow", editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Scheduled Content"}));
		$(this.el).append(this.template());
		$(this.el).append(this.footertemplate({toolbar:"back"}));
		return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		var skin = this.skin;
		var account = this.account;
		var sitename = this.site;
				new Messi('Scheduled Publish API: To be implemented.', {title: 'Error', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Close', val: 'X'}],
					callback :function(val){
				}});
				$.ajax({
					url: '/pages/publish-scheduled?account='+account+'&site='+sitename,
					type: 'get',
					error:function(data){
				 			 Common.errorhandler(data);
					},
					success: function(data) {
						if (data.error) {
							window.app.navigate(skin+' ' ,{trigger:true});
						}
						var pageList = $('#pages');
						//pageList.empty();
						if (data.length == 0) {
							var li = $(document.createElement('li'))
								.text('There is no Scheduled content.');
							pageList.append(li);
						} else {
						
							$.each(data, function(index, page) {
								var path = $(document.createElement('h3'))
									.addClass('path')
									.text(page.name);
								var div = $(document.createElement('span')) 
								.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all');
								var info = $(document.createElement('span'))
									.addClass('lighter')
									.text('Checked out by ');
								div.append(info);
								div.append(page.username);
								var a = $(document.createElement('a'))
								    .css({'padding': '0px'})
									.attr('href', '#')
								a.append(path).append(div);
								var li = $(document.createElement('li'))
									.attr({'data-path': page.path, 'data-icon': 'checkin', 'data-iconpos': 'left'})
									.addClass('pageitem')
									.addClass('row')
									.append(a);
								pageList.append(li);
								
							});
						}
						pageList.listview("refresh");
				
					}
				});
	},
	logout:function(){
		Common.subuserLogout();
	},
	homeBtn: function(){
		Common.workflowMode (this.skin, this.account, '' ,'account')
	}
});

var AppRouter = Backbone.Router.extend({
    routes:{
        ":skin":"login",
        ":skin/:account": "login",
        ":skin/accounts" : "accounts",
        ":skin/accounts-edit-mode" : "accountsEditMode",
        ":skin/accounts/:id":"account",
        ":skin/account-add/:editMode/:device": "accountAdd",
      	":skin/account-edit/:editMode/:device/:account": "accountEdit",
      	
      	":skin/groups/:account":"groups",
      	":skin/groups-edit-mode/:account":"groupsEditMode",
      	":skin/groups/:account/:group":"group", 
      	":skin/group-edit/:editMode/:device/:account/:group":"groupEdit",
      	":skin/group-add/:editMode/:device/:account":"groupAdd",
      	
        ":skin/users/:account":"users",
        ":skin/users-edit-mode/:account":"usersEditMode",
        ":skin/users/:account":"users",
        ":skin/users/:account/:user":"user", 
        ":skin/user-edit/:editMode/:device/:account/:user":"userEdit",
        ":skin/user-add/:editMode/:device/:account":"userAdd",
       
        ":skin/sites/:account" : "sites",
        ":skin/sites-edit-mode/:account":"sitesEditMode",
        ":skin/sites/:account/:site" : "site",
        ":skin/site-edit/:editMode/:device/:account/:site" : "siteEdit",
        ":skin/site-add/:editMode/:device/:account" : "siteAdd",
        
        ":skin/site-publish/:account/:site": "sitePublish",
        ":skin/site-reports/:account/:site" : "siteReports",
        ":skin/report-checkedout/:account/:site" : "siteReportCheckedOut",
        ":skin/report-published/:account/:site" : "siteReportPublished",
        ":skin/report-scheduled/:account/:site" :"siteReportScheduled",
        ":skin/site-scan/:account/:site" : "siteScan"

    },

    initialize:function () {
        // Handle back button throughout the application
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },
    login:function (skinPraram, accountParam) {
        console.log('#adminLogin');
        var loginview =new loginView(); 
        loginview.skin =skin;
        if(account){
        	loginview.account=account;
        }
        this.changePage(loginview);
    },
    accounts:function (skin) {
        console.log('#accounts');
        var accountview=new accountsView();
        accountview.skin=skin;
        this.changePage(accountview);
    },
    accountsEditMode:function(skin){
     	console.log('#accounts-edit-mode');
     	var accountmodel=new AccountModel({id: "accountEdit"});
     	var accountseditmode= new accountsEditModeView({model:accountmodel});
     	accountmodel.context.skin= skin;
     	accountseditmode.skin = skin;
     	this.changePage(accountseditmode,false, true);
     	
    },
    account:function (skin,account){
    	console.log('#account');
    	var accountview= new accountView();
    	accountview.skin=skin;
    	accountview.account=account;
    	this.changePage(accountview,"pop");
    
    },
    accountAdd:function(skin,editMode,device){
      console.log('#account-add');
      var accountmodel=new AccountModel();
      accountmodel.context.skin=skin;
      accountmodel.context.editType= "add";
      var accountAddview = new accountEditView({model:accountmodel});
      accountAddview.skin=skin;
      accountAddview.editType= "add";
      accountAddview.editMode= editMode;
      accountAddview.headerTitle="Add Account";
      accountAddview.device=device;
      this.changePage(accountAddview,"slidedown");
    },
    accountEdit:function(skin,editMode,device,account){
      console.log('#account-edit');
      var accountmodel=new AccountModel({account:account, name:account,id: account});
      accountmodel.fetch({
	  success: function(){
	  accountmodel.context.data= accountmodel.toJSON();
	  accountmodel.context.skin=skin;
	  accountmodel.context.editType= "edit";
	  console.log('context data');
	  console.log(accountmodel.context.data);
	  var accountEditview = new accountEditView({ model : accountmodel});
      accountEditview.skin = skin;
      accountEditview.account= account;
      accountEditview.editMode= editMode;
      accountEditview.editType= "edit";
      accountEditview.device=device;
	  if (device != 'phone'){
			accountEditview.headerTitle="Edit Account: "+account;
	  }else{
			accountEditview.headerTitle= account;
	  }

      this.changePage(accountEditview,"slidedown");
		}
		});
    },
    groups:function(skin,account){ 
	 console.log('#groups');
	 var groupsview= new groupsView();
	 groupsview.account=account;
	 groupsview.skin=skin;
	 this.changePage(groupsview);
    },
    groupsEditMode:function(skin,account){
		 console.log('#groups-edit-mode');
		 var groupsEditModeview= new groupsEditModeView();
		 var groupmodel = new GroupModel({id: "groupEdit"});
		 var groupsEditModeview= new groupsEditModeView({model: groupmodel});
		 groupsEditModeview.skin=skin;
		 groupsEditModeview.account=account;
		 groupmodel.skin = skin;
		 groupmodel.account = account;
		 this.changePage(groupsEditModeview,false, true);
    },
    group:function(skin,account,group){
	    console.log('#group');
    	var self= this;  
    	var groupmodel =  new GroupModel({skin:skin,account:account, group:group, name:group, id: group});
    	groupmodel.context.skin=skin;
        groupmodel.context.editType= "edit";
    	groupmodel.fetch({
    	success:function(){
    	groupmodel.context.data= groupmodel.toJSON();
		console.log(groupmodel.context.data);	
    	var groupview= new groupView({model: groupmodel});
    	groupview.skin = skin;
    	groupview.account=account;
    	groupview.group= group;
    	groupview.editType="edit";
    	this.changePage(groupview);
    	}
		});
    },
    
	groupEdit:function(skin,editMode,device,account,group){
    	console.log('#group-edit');
		var groupmodel = new GroupModel({skin:skin,account:account, group:group, name:group, id: group});
		groupmodel.context.skin=skin;
	    groupmodel.context.editType= "edit";
    	groupmodel.fetch({
    	success:function(){
			groupmodel.context.data= groupmodel.toJSON();
			var groupEditview = new groupEditView({ model : groupmodel});
			groupEditview.skin=skin;
			groupEditview.account=account;
			groupEditview.group= group;
			groupEditview.editType="edit";
			groupEditview.device=device;
			groupEditview.editMode = editMode;
			if (device != 'phone'){
					groupEditview.headerTitle="Edit Group: "+ group;
			}else{
					groupEditview.headerTitle=group;
			}
			
			this.changePage(groupEditview,"slidedown");
    	}
    	});

    },
    groupAdd:function(skin,editMode,device,account){
    	console.log('#group-add');
    	var groupmodel= new GroupModel({skin:skin,account : account});
    	groupmodel.context.skin = skin;
    	groupmodel.context.editType= "add";
    	var groupAddview = new groupEditView({model:groupmodel});
    	groupAddview.skin = skin;
    	groupAddview.account=account;
    	groupAddview.editType="add";
    	groupAddview.device=device;
    	groupAddview.editMode= editMode;
    	groupAddview.headerTitle="Add Group";
    	this.changePage(groupAddview,"slidedown");
    },
    
    users:function(skin,account){ 
	 console.log('#users');
	 var usersview= new usersView();
	 usersview.account=account;
	 usersview.skin=skin;
	 this.changePage(usersview);
    },
    
    user:function(skin,account,user){
	    console.log('#user');
    	var self= this;  
    	var usermodel =  new UserModel({skin:skin,account:account, user:user, name:user, id: user});
    	usermodel.context.skin=skin;
        usermodel.context.editType= "edit";
    	usermodel.fetch({
    	success:function(){
    	usermodel.context.data= usermodel.toJSON();
		console.log(usermodel.context.data);	
    	var userview= new userView({model: usermodel});
    	userview.skin = skin;
    	userview.account=account;
    	userview.user= user;
    	userview.editType="edit";
    	this.changePage(userview);
    	}
		});
    },
    
    usersEditMode:function(skin,account){
		 console.log('#users-edit-mode');
		 var usermodel = new UserModel({id: "userEdit"});
		 var usersEditModeview= new usersEditModeView({model: usermodel});
		 usersEditModeview.skin=skin;
		 usersEditModeview.account=account;
		 usermodel.skin = skin;
		 usermodel.account = account;
		 this.changePage(usersEditModeview,false, true);
    },
    userEdit:function(skin,editMode,device,account,user){
    	console.log('#user-edit');
		var usermodel = new UserModel({skin:skin,account:account,user:user,id:user});
		usermodel.context.skin=skin;
	    usermodel.context.editType= "edit";
    	usermodel.fetch({
    	success:function(){
			usermodel.context.data= usermodel.toJSON();
			var userEditview = new userEditView({ model : usermodel});
			userEditview.skin=skin;
			userEditview.account=account;
			userEditview.user= user;
			userEditview.editType="edit";
			userEditview.device=device;
			userEditview.editMode = editMode;
			if (device != 'phone'){
				userEditview.headerTitle="Edit User: "+ user;
			}else{
				userEditview.headerTitle= user;
			}
			this.changePage(userEditview,"slidedown");
    	}
    	});

    },
    userAdd:function(skin,editMode,device,account){
    	console.log('#user-add');
    	var usermodel= new UserModel({skin:skin,account : account});
    	usermodel.context.skin = skin;
    	usermodel.context.editType= "add";
    	var userAddview = new userEditView({model:usermodel});
    	userAddview.skin = skin;
    	userAddview.account=account;
    	userAddview.editType="add";
    	userAddview.device=device;
    	userAddview.editMode= editMode;
    	userAddview.headerTitle="Add User";
    	this.changePage(userAddview,"slidedown");
    },
    sites:function(skin,account){
		 console.log('#sites');
		 var sitesview= new sitesView();
		 sitesview.skin=skin;
		 sitesview.account=account;
		 this.changePage(sitesview);
    },
    sitesEditMode:function(skin,account){
		 console.log('#sites-edit-mode');
		 var sitemodel = new SiteModel({id: "siteEdit"});
		 var sitesEditModeview= new sitesEditModeView({model: sitemodel});
		 sitemodel.skin=skin;
		 sitemodel.account= account;
		 sitesEditModeview.skin= skin;
		 sitesEditModeview.account=account;
		 this.changePage(sitesEditModeview,false, true);

     
    },
    site:function(skin,account,site){
	    	console.log('#site');
    	var self= this;  
    	var sitemodel =  new SiteModel({skin:skin,account:account, site:site, name:site, id: site});
    	sitemodel.context.skin=skin;
        sitemodel.context.editType= "edit";
    	sitemodel.fetch({
    	success:function(){
    	sitemodel.context.data= sitemodel.toJSON();
		console.log(sitemodel.context.data);	
    	var siteEditview= new siteView({model: sitemodel});
    	siteEditview.skin = skin;
    	siteEditview.account=account;
    	siteEditview.site= site;
    	siteEditview.editType="edit";
    	siteEditview.headerTitle="Edit Site :" +site;
    	this.changePage(siteEditview);
    	}
		});
		
    },
    siteEdit:function(skin,editMode,device,account,site){
    	console.log('#site-edit');
    	var self= this;  
    	var sitemodel =  new SiteModel({skin:skin,account:account, site:site, name:site, id: site});
    	sitemodel.context.skin=skin;
        sitemodel.context.editType= "edit";
    	sitemodel.fetch({
    	success:function(){
    	sitemodel.context.data= sitemodel.toJSON();
		console.log(sitemodel.context.data);	
    	var siteEditview= new siteEditView({model: sitemodel});
    	siteEditview.skin = skin;
    	siteEditview.account=account;
    	siteEditview.site= site;
    	siteEditview.editType="edit";
    	siteEditview.device=device;
    	siteEditview.editMode = editMode;
    	if (device != 'phone'){
				siteEditview.headerTitle="Edit Site :" +site;
		}else{
				siteEditview.headerTitle= site;
		}
    	
    	this.changePage(siteEditview,"slidedown");
    	}
    	});

    },
    siteAdd:function(skin,editMode,device,account){
    	console.log('#site-add');
    	var sitemodel=new SiteModel({skin:skin,account:account});
        sitemodel.context.skin=skin;
        sitemodel.context.editType= "add";
    	var siteAddview = new siteEditView({model: sitemodel});
    	siteAddview.skin= skin;
    	siteAddview.account= account;
    	siteAddview.editType="add";
    	siteAddview.device= device;
    	siteAddview.editMode = editMode;
    	siteAddview.headerTitle="Add Site";
    	this.changePage(siteAddview,"slidedown");
    },
     sitePublish: function(skin,account,site){
    	console.log('#site-publish');
    	var sitePublishview = new sitePublishView();
    	sitePublishview.interval = null;
    	sitePublishview.site=site;
    	sitePublishview.account=account;
    	this.changePage(sitePublishview); 	
    },
    siteReports: function(skin,account,site){
    	console.log('#site-reports');
    	var siteReportsview = new siteReportsView();
    	siteReportsview.skin = skin;
    	siteReportsview.account = account;
    	siteReportsview.site = site;
    	this.changePage(siteReportsview);	
    },
    siteReportCheckedOut: function(skin,account,site){
    	console.log('#site-report-checkedout');
    	var siteReportCheckedoutview = new siteReportCheckedOutView();
    	siteReportCheckedoutview.skin= skin;
    	siteReportCheckedoutview.account = account;
    	siteReportCheckedoutview.site= site;
    	this.changePage(siteReportCheckedoutview);
    },
    siteReportPublished: function(skin, account, site) {
     	console.log('#site-report-scheduled');
     	var siteReportPublishedview = new siteReportPublishedView();
     	siteReportPublishedview.skin = skin;
     	siteReportPublishedview.account = account;
     	siteReportPublishedview.site = site;
     	this.changePage(siteReportPublishedview);
     	
    },
    siteReportScheduled: function(skin, account, site){
    	console.log('#site-report-scheduled');
    	var siteReportScheduledview = new siteReportScheduledView();
    	siteReportScheduledview.skin =skin;
    	siteReportScheduledview.account= account;
    	siteReportScheduledview.site = site;
    	this.changePage(siteReportScheduledview);
    	
    },
    siteScan: function (skin,account, site){
    	console.log('#site-scan');
    	var siteScanview = new siteScanView();
    	siteScanview.skin = skin;
    	siteScanview.account = account;
    	siteScanview.site = site;
    	this.changePage(siteScanview);	
    },
    changePage:function (page,transitionType,dialog) {
		if (interval != null) {
			clearInterval(interval);
		}
       	 if(dialog){
    		$(page.el).attr('id' , 'editModePagesanchore');
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

});

$(document).ready(function () {
		console.log('document ready');
		window.app = new AppRouter();
		Backbone.history.start();	
});
