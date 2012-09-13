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
		//this.users = new UserList();
		//this.sites = new SiteList();
		//if(this.skin)
			//this.users.account = this.sites.account = this.id;
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

/*var AccountCollection = Backbone.Collection.extend({
model: AccountModel,

});
//-----collections-----
var AccountListCollection = Backbone.Collection.extend({
	model: AccountModel,
	currentSort : { column : "created", order : "desc" }, // default sort order is created date descending
	//comparator : Sorters.date("created", "desc"),
	sync : function(method, collection, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/accounts/list", dataType: "json" };
		}
		return $.ajax(_.extend(params, options));
	},
	parse : function(accounts) {
		//accounts = SampleData.accounts; // for testing different data sets, comment out for actual data
		_.each(accounts, function(account) {
			account.id = account.account;
			account.first_name = account.first_name || "";
			account.last_name = account.last_name || "";
			// convert date strings to Date objects
			account.created = _.parseISO8601(account.created);
			account.last_saved = _.parseISO8601(account.last_saved);
			account.createdDisplay = _.dateString(account.created);
			account.savedDisplay = account.last_saved ? _.dateString(account.last_saved) : "";
		});
		return accounts;
	}
});

var SiteListCollection = Backbone.Collection.extend({
	model: SiteModel,
	initialize : function() {
		this.currentSort = { column : "site", order : "asc" }; // default sort order is user name ascending
	},
	//comparator : Sorters.string("site", "asc"),
	sync : function(method, collection, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/sites/list", dataType: "json", data: {} };
			if(this.account)
				params.data.account = this.account;
		}
		return $.ajax(_.extend(params, options));
	},
	parse : function(sites) {
		//sites = SampleData.sites; // for testing different data sets, comment out for actual data
		_.each(sites, function(site) {
			site.id = site.site;
			// convert date strings to Date objects
			site.last_saved = site.last_saved ? new Date(site.last_saved) : "";
			site.savedDisplay = site.last_saved ? _.dateString(site.last_saved) : "";
		});
		return sites;
	}
});

var UserListCollection = Backbone.Collection.extend({
	model: UserModel,
	initialize : function() {
		this.currentSort = { column : "user", order : "asc" }; // default sort order is user name ascending
	},
	//comparator : Sorters.string("user", "asc"),
	sync : function(method, collection, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/users/list", dataType: "json", data: {} };
			if(this.account)
				params.data.account = this.account;
		}
		return $.ajax(_.extend(params, options));
	},
	parse : function(users) {
		//users = SampleData.users; // for testing different data sets, comment out for actual data
		_.each(users, function(user) {
			user.id = user.user;
			user.first_name = user.first_name || "";
			user.last_name = user.last_name || "";
			user.email = user.email || "";
		});
		return users;
	}
});
*/
//Views
window.adminLoginView = Backbone.View.extend({
	initialize:function(){
				this.render();
	},
	events:{
				'pageinit' : 'pageShow',
				'click #submit' : 'adminLogin'
	},  
	pageShow: function() {
				var device= browserdetect();
	            console.log(window.location.pathname);
	            console.log(window.location.href);
	            if (device.desktop){
						new Messi('You are viewing OUMobile in a desktop. This feature is designed for mobile devices. For the best user experience, we suggest you to login to normal OU Campus when you are using desktop.', {title: 'Warning', titleClass: 'anim warning', modal:true, buttons: [{id: 0, label: 'Close', val: 'X'}],
							callback :function(val){
								   if (typeof(localStorage) == 'undefined' ) {
										console.log('Browser doesnt support localStorage'); 
									}
									else{
										var setusername=localStorage.getItem('username');
										var setPass=localStorage.getItem('pass');
										$('#username').val(setusername);
										$('#password').val(setPass);
									}
									
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
	adminLogin: function(){
					// var skin = window.location.pathname.substr(1).split("/")[0];
					var rememberpassword= $('#rememberpass').serialize();
					var username = $('#username').val();
					var password = $('#password').val();
					
					// If Remember Pass is selected, save pass in local storage.
					console.log(rememberpassword.match("on"));
					if (rememberpassword.match("on")){ 
						localStorage.setItem('username',username);
						localStorage.setItem('pass',password);
					}
					var skin =this.skin;
					$.ajax({
						url: '/authentication/admin_login?skin=' + skin,
						type: 'post',
						data: {
							'username': username,
							'password': password
							},
						success: function(data) {
							window.app.navigate(skin+'/accounts',{trigger:true});
						},
						error: function(data){
						console.log('data: '+ data);
							 var errorMessage=jQuery.parseJSON(data.responseText);
							 console.log(errorMessage.error);
							 new Messi(errorMessage.error, {title: 'Error', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
							}
						  });
		}
});
window.accountsView = Backbone.View.extend({
	initialize:function(){
			page = "account";
			this.render();
	},
	events:{
			'pageshow' : 'pageShow',
			'click .logout' : 'logout',
			'click #addBtn' :'addBtn',
	},
	template:_.template($('#accounts').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
	var skin = this.skin;
			$(this.el).html(this.headertemplate({page:"accounts",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:"Accounts"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow: function(){
			$.mobile.fixedToolbars.show(true);
			var Browser = browserdetect();
			var skin = this.skin;
				$.ajax({
						url: '/accounts/list',
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data) {
							if (data.error) {
								new Messi(data.error, {title: 'Title', titleClass: 'anim error', buttons: [{id: 0, label: 'Close', val: 'X'}]});
								window.app.navigate(skin+' ',{trigger:true});
							}
							var accounts = $ ('#account-list');
							accounts.empty();
							$.each(data, function(index, value) {
								var count = $(document.createElement('span'))
									.addClass('ui-li-count')
									.text('Pages: ' + value.page_count);	
									
								var a = $(document.createElement('a'))
									.attr({ href:'#'+skin+'/accounts/' + value.account })
									.attr({rel:'external'})
									.text(value.account)
									.addClass('hyperlinkli');
								a.append(count);
								var li = $(document.createElement('li')).append(a);
								accounts.append(li);
							});
							accounts.listview("refresh");
							}
					});
	},
	logout:function(){Common.logout();},
	addBtn:function(){Common.add(this.skin,this.account,this.site,'account');}
});
window.groupsView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
		'click #addBtn': 'addBtn',
		'click #homeBtn': 'homeBtn',
	},
	template:_.template($('#groupstemplate').html()),
	headertemplate:_.template($('#header').html()),
	render:function () {
			$(this.el).html(this.headertemplate({page:"groups",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"workflow",editType:" ",headertitle:"Groups"}));
			$(this.el).append(this.template());
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
								 	.attr({href:""})
									//.attr({'onClick':'subusercheck("'+value.site+'")'})
									.attr({rel:'external'})
									.addClass('ui-link-inherit hyperlinkli')
									.text(value.name);
								var siteurl = $(document.createElement('span'))
									.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
									.text('Total: '+value.account);
									
								 var li =$(document.createElement('li')).append(a);
								li.append(siteurl);
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
	homeBtn:function(){Common.home;},
	logout:function(){Common.logout();},

});
window.groupsEditModeView = Backbone.View.extend({
initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click .logout' :'logout',
		'click #okBtn':'okBtn',
		'click #addBtn' : 'addBtn',
	},
	template:_.template($('#groupsEditMode').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"group",mode:"edit-mode",editType:"add",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:"Groups"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate()) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var Browser = browserdetect();
		var editPath = '#'+this.skin+'/groups-edit/tablet/'+this.account;
		if(Browser.phone){
				editPath = '#'+this.skin+'/groups-edit/phone/'+this.account;
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
							groups.append(li);
						idCount++;
						
					});
					groups.listview("refresh");
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
					 deleteString= deleteString + '&group='+value.defaultValue;
					 deleteCount++;
			 });
			this.model.context.data=deleteString;
			if (deleteCount==0){
				new Messi('There were no Group selected to delete.', {title: 'Deleting Groups', titleClass: 'info', buttons: [{id: 0, label: 'Close', val: 'X'}]});
				/*window.app.navigate(this.skin+'/message/'+this.account+'/'+this.user,{trigger:true});
				$("#alert_title").empty();
				$("#alert_body").empty();
				$("#alert_title").text("Action: Deleting Groups:");
				$("#alert_body").text("There were no Group selected to delete.");	*/		
			}
			else{	
			var self = this;
			this.model.destroy({
				//data:this.model.context,
				success: function(){
					console.log('success');
					Common.direct(self.skin,self.account,'groups');
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
		Common.direct(self.skin,'','groups');
		return false;
	},
	addBtn:function(){
		Common.add(this.skin,this.account,'','groups');
	}
});
window.accountsEditModeView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();		
	},
	events:{
		'pageshow' :'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click .logout' :'logout',
		'click #okBtn':'okBtn',
		'click #addBtn':'addBtn',
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#accountsEditMode').html()),
	footertemplate:_.template($('#footer').html()),
	render:function(){
	   $(this.el).html(this.headertemplate({page:"account",mode:"edit-mode",editType:'add', skin:this.skin,account:this.account, site:this.site,logoutid:"logout", headertitle:"Accounts"}));
	   $(this.el).append(this.template());
	   $(this.el).append(this.footertemplate());
	   return this;
	},
	pageShow: function(){
	console.log("groups-edit-mode");
		$.mobile.fixedToolbars.show(true);
		var editPath ='#'+this.skin+'/account-edit/tablet';
		var Browser = browserdetect();
		if(Browser.phone){
	 		var editPath ='#'+this.skin+'/account-edit/phone';
		 }		
		$.ajax({
				url: '/accounts/list',
				type: 'get',
				error:function(data){
				 		Common.errorhandler(data);
				},
				success: function(data) {
					if (data.error) {
					console.log(data.error);
						//window.app.navigate(skin+ ' ' ,{trigger:true});
					}
					var accounts = $ ('#account-list');
					//accounts.empty();
				    var idCount = 0;   
				    
					$.each(data, function(index, value) {
						   var inputElement = $(document.createElement('input'))
	                             .attr({type: 'checkbox' })
	                             .attr({id: idCount+1})
	                             .attr({name: idCount+1})
	                             .addClass('custom')
	                             .attr({value: value.account });
	     		
						   var inputText =$(document.createElement('span'))
						    	 .addClass('ui-btn-text')
						    	 .attr({id:idCount+1})
						     	  .text(value.account);			
						if(Browser.phone){
						  //editPath ='#'+skin+'/account-edit/'+account;
							}
							
							 var a = $(document.createElement('a'))
						           .attr({href: editPath +'/' + value.account })
						           .attr({rel:'external'})
						           .addClass('ui-link-inherit hyperlinkli');
				
					
					        var hyperlinkInputText = a.append(inputText);
							var addinputElement = inputElement.after(hyperlinkInputText);
					     	var li = $(document.createElement('li')).append(addinputElement);
							accounts.append(li);
						idCount++;
					});
					accounts.listview("refresh");
				}
			});
	},
	logout:function(){Common.logout();},
    addBtn:function(){Common.add(this.skin, this.account, this.site,'account');},
	deleteBtn: function(event){
			var deletArray =$("input:checked");
			var deleteCount=0;
   			 //console.log(deletArray);
   			 var deleteString= "";
   			 $.each(deletArray, function(index, value) { 
					 deleteString= deleteString + '&account='+value.defaultValue;
					 deleteCount++;
			 });
			this.model.context.data=deleteString;
			if (deleteCount==0){
				new Messi('There were no Account selected to delete.', {title: 'Deleting Accounts', titleClass: 'info', buttons: [{id: 0, label: 'Close', val: 'X'}],
				callback:function(val){
					$('#editBtnText').removeClass('ui-btn-active');
				}
				});
				
				
			}
			else{	
			var self = this;
				new Messi('Are you sure you want to delete the selected accounts? ', {title: 'Deleting Accounts', titleClass: 'anim warning', buttons: [{id: 0, label: 'Yes', val: 'Y'},{id :1, label: 'No', val:'N'}],
				callback:function(val){
					if(val =='Y'){
							self.model.destroy({
							success: function(){
								console.log('success');
								Common.direct(self.skin,'','account'); 	
								$.page.refresh();
							},
							error:function() {
								console.log('error');
							}
							});
						}
				}
				});
			 	Backbone.history.loadUrl;
			  	return false;
			}
	 },
	okBtn:function(){
			Common.direct(self.skin,'','account');
			return false;
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
		'click #addBtn' :'addBtn',
		'click #editBtn' : 'editBtn',
		'click .logout' :'logout'
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
						localStorage.setItem('account',data.name);
						  if(data.error){
							  console.log(data.error);
							  window.app.navigate(skin+' ',{trigger:true});
							 }
						  
						$('#accountHeader').text("Account: "+data.account);
						 var accountDiv = $('#account');
						 var sitecount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.text(data.site_count);
						
						var usercount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.text(data.user_count);
						
						var groupcount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.text( data.group_count);
						
						var pagecount = $(document.createElement('span'))
						.addClass('ui-li-count ui-btn-up-c ui-btn-corner-all')
						.text( data.page_count);
						
						$('#account-name').append(data.name);
						$('#account-fname').append(data.first_name);
						$('#account-lname').append(data.last_name);
						$('#account-date').append(_.dateString(_.parseISO8601(data.created)));
						$('#account-nsite').append(sitecount);
						$('#account-npage').append(pagecount);
						$('#account-ngroup').append(groupcount);
						$('#account-nuser').append(usercount);
				
						
						
						
						
						localStorage.setItem('account',data.account);
						$('#sitestooltip').attr({'title':'Show all sites of account: '+ data.account});
						$('#userstooltip').attr({'title':'Show all users of account: '+ data.account});
						$('#groupstooltip').attr({'title':'Show all groups of account: '+ data.account});
						//accountDiv.empty();
						 console.log(data);				
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
	logout:function(){Common.logout();
	},
	addBtn:function(){Common.add(this.skin, '', this.site,'account');
	},
	editBtn:function(){Common.add(this.skin, this.account, '','account','edit');
	}
	});
window.accountEditView = Backbone.View.extend({
	events:{
		'pageshow' : 'pageShow',
		'click #cancelBtn' :'cancelBtn',
		'click #createaccount' : 'AccountEdit',
		'click #saveaccount' : 'AccountEdit',
		'click .logout' :'logout'
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
	var accountcontext = $('#accountform').serializeObject();
	console.log(accountcontext);
   			var editType = this.editType;
			$.mobile.fixedToolbars.show(true);
			if (editType == "edit"){
				   var accountsDiv =$('#accountdiv');
				   var data= this.model.context.data;
				   console.log('data');
				   console.log(data);

							$('#headerEditAccount').text(data.account);
							$('#state').val(data.state).selectmenu('refresh', true);
							$('#country').selectmenu('refresh', true);
							$('#country').val(data.country).selectmenu('refresh', true);
							if(data.spell_check){
							$("input[type='checkbox']").attr("checked",true).checkboxradio("refresh"); 
							}else{
							$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh"); }
			
							var switches = $("select[ data-role='slider']");
							$.each(switches, function(index, el){
							$(this).attr('switch', index);
							var element =$("select[switch='"+index+"']").attr('id');
							
							if(data.element){
							var switchelement=$('#dependancymanager');
							switchelement[0].selectedIndex =1;
							switchelement.slider("refresh");
							}

							});
							//accountsDiv.page("refresh");
			
			 }	
	},
	logout:function(){Common.logout();},
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
												Common.direct(self.skin,'' ,'account');
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
	Common.direct(this.skin,'' ,'account');
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
	},
	template:_.template($('#userstemplate').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"users",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"workflow",editType:" ",headertitle:"Users"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow:function(){

			 $.mobile.fixedToolbars.show(true);
				if(localStorage.getItem('user')){
				 	 localStorage.removeItem('user');
				 }
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
										 .attr({'rel':'tooltip'})
										 .attr({'title':'Login as '+value.username })
										 .html('<span>&nbsp;</span>');
										 
								 var a = $(document.createElement('a'))
											.attr({'onClick':'Common.subuserlogin("'+skin+'","'+account+'","'+value.username+'"'+',"'+site+'")'})
											.attr({rel:'external'})
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
	},
	template:_.template($('#usersEditMode ').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"user",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"edit-mode",editType:"add",headertitle:"Users"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate()) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var Browser = browserdetect();
		var editPath = '#'+this.skin+'/user-edit/tablet/'+this.account;
		if(Browser.phone){
				editPath = '#'+this.skin+'/user-edit/phone/'+this.account;
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
	}
});
window.userEditView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout': 'logout',
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
		$.mobile.fixedToolbars.show(true);
		var user= this.user;
			if (this.editType == "edit"){
				   var userdiv =$('#userdiv');
				   var data= this.model.context.data;

							$('#headerEditUser').text(data.user);
							$('#state').val(data.state).selectmenu('refresh', true);
							$('#country').selectmenu('refresh', true);
							$('#country').val(data.country).selectmenu('refresh', true);
							if(data.spell_check){
							$("input[type='checkbox']").attr("checked",true).checkboxradio("refresh"); 
							}else{
							$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh"); }
							var switches = $("select[ data-role='slider']");
							$.each(switches, function(index, el){
							$(this).attr('switch', index);
							var element =$("select[switch='"+index+"']").attr('id');
							});
						
			 }
			
	},
	logout:function(){Common.logout();},
	cancelBtn:function(){	
	Common.direct(this.skin,this.account,'user');
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
									Common.direct(self.skin,self.account ,'user');
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
	},
	template:_.template($('#sitestemplate').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"sites",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",headertitle:"Sites"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow:function(){ 
		     var sessionObj = Common.whoamI();
	         var user= sessionObj.user;
			 var account=this.account;
			 var sites= $('#sites-list');
			 if(localStorage.getItem('site')){
			 	 localStorage.removeItem('site');
			  }
				 $.ajax({
						url:'/sites/list?skin='+this.skin+'&account='+this.account,
						type: 'get',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success: function(data){
							if (data.error){
								 //window.location.href='super-index.html'+location.search;
								 console.log(data.error);
							}
							//sites.empty();
		
							var params =location.search;
							$.each(data,function(index,value){
								 var  nextstepurl= '#'+sessionObj.skin+'/sites/'+account+'/'+value.site;
								 if(!user){nextstepurl ='#'+sessionObj.skin+'/subuserlogin/'+account+'/'+value.site}
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
										.html('Sites <br /> <span style="font-size:13px">Account: '+ account );
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
	},
	template:_.template($('#sitesEditMode').html()),
	headertemplate:_.template($('#header').html()),
	footertemplate:_.template($("#footer").html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"site",skin:this.skin, account:this.account, site:this.site,logoutid:"logout",mode:"edit-mode",editType:"add",headertitle:"Sites"}));
			$(this.el).append(this.template());
			$(this.el).append(this.footertemplate()) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var Browser = browserdetect();
		var idCount = 0;  
		//console.log(Browser);
		var editPath ='#'+this.skin+'/site-edit/tablet/'+ this.account;
		if(Browser.phone){
			var editPath ='#'+this.skin+'/site-edit/phone/'+this.account;
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
					//sites.empty();
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
	addBtn:function(){
		Common.add(this.skin,this.account,this.site,'site');
	}
});
window.siteView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#sitetemplate').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"site",mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Actions"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		var sessionObj = Common.whoamI();
		var user = sessionObj.user;
		var skin = sessionObj.skin;
		var account = this.account;
		var site=this.site;
		Common.subuserLogoutBtn();
		$('#headertitle').text(site);
		$('.publish').attr({'href': '#'+skin+'/site-publish/'+ account + '/' + site});
		$('.reports').attr({'href': '#'+skin+'/site-reports/'+ account + '/' + site});
		$('.scan').attr({'href': '#'+skin+'/site-scan/'+ account + '/' + site});
		$('.settings').attr({'href':'#'+skin+'/site-settings/'+ account + '/' + site});
		$('#publish').attr({'title': 'Publish site: ' + site});
		$('#reports').attr({'title': 'Get reports of site: ' + site});
		$('#scan').attr({'title': 'Scan site: ' + site});

	},
	logout: function(){ 
	Common.subuserLogout();
	},
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
		'click #savesite': 'SiteEdit'
		
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
							$('#state').val(data.state).selectmenu('refresh', true);
							$('#country').selectmenu('refresh', true);
							$('#country').val(data.country).selectmenu('refresh', true);
							if(data.spell_check){
							$("input[type='checkbox']").attr("checked",true).checkboxradio("refresh"); 
							}else{
							$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh"); }
			
							var switches = $("select[ data-role='slider']");
							$.each(switches, function(index, el){
							$(this).attr('switch', index);
							var element =$("select[switch='"+index+"']").attr('id');
							
							if(data.element){
							var switchelement=$('#dependancymanager');
							switchelement[0].selectedIndex =1;
							switchelement.slider("refresh");
							}

							});
						
			 }	
		/*Create New site ajax */
		// cancell Button
		$('#homeBtn').click(Common.home);
	
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
												Common.direct(self.skin,self.account ,'site');
										},
										
										error: function(model,response){
										console.log('error');
										console.log(response);
										var page =window.location.hash;
												var pageType="site";
												var  mode="edit";
												var name = self.site;
												self.errorhandler(response, pageType, mode , name);
												//alertpage(response,pageType, mode ,name,page);
												return false;
										}
										});	 
						return false;
	},
	cancelBtn:function(){
		Common.direct(this.skin,this.account,'site');
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
		'click #start' : 'start',
		'click #display-errors': 'displayErrors'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#sitePublish').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"site-publish",mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Publish"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		Common.subuserLogoutBtn();
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
			this.doPublish(this.account,this.site);
		},
	displayErrors: function(event){
		var errorList = $('#error-list');
		if (errorList.is(':hidden')) {
			$('#error-list').show();
			$('#action').text('hide');
		} else {
			$('#error-list').hide();
			$('#action').text('see');
		}
		return false;
	},
	doPublish:function(account,sitename) {
					$.ajax({
						url: '/sites/publish?account='+account+'&site='+sitename,
						type: 'post',
						error:function(data){
				 			 Common.errorhandler(data);
						},
						success:$.proxy(function(data) {
								console.log(data);
							if (data.done) {
								clearInterval(interval);
								interval = null;
								$('#start').removeAttr('disabled');
								var msg;
								if (data.error) {
									msg = 'The site has been published, but some pages failed to published.';
									var errorList = $('#error-list');
									$.each(data.messages, function(index, error) {
										var li = $(document.createElement('li')).text(error);
										errorList.append(li);
									});
									errorList.listview("refresh");
									$('#errors').show();
									$('#progress').hide();
								} else {
									msg = 'The site has been successfully published.';
								} 	
								$('#message').text(msg);
							} else if (data.error) {
								console.log(data.error);
								//window.location.href = 'index.html';
							} else {
								if (interval === null) {
									$('#start').attr('disabled', 'disabled');
									$('#start').addClass('mobile-button-disabled ui-state-disabled');
									interval = setInterval($.proxy(function(event) {
										this.doPublish(account,sitename);
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
								message.text(filesPublished + (published === 1 ? ' file has' : ' files have') + ' been published.');
							}
						},this)
					});
			},
	logout:function(){Common.subuserLogout();},
});
window.siteScanView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #start' : 'start',
		'click .logout' : 'logout'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#siteScan').html()),
	render: function(){
			$(this.el).html(this.headertemplate({page:"site-scan",mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"Site Scan"}));
			$(this.el).append(this.template());
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
				this.resetIcons();
				$('#start').attr('disabled', 'disabled');
				this.doScan(this.account,this.site);
				if (interval === null) {
					interval = setInterval($.proxy(function() {
						this.doScan(this.account,this.site);
					},this), 2000);
				}			
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
	logout:function(){Common.subuserLogout();},
});
window.siteReportsView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout' : 'logout',
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReports').html()),
	render:function(){
			$(this.el).html(this.headertemplate({page:"site-reports",mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLougout",headertitle:"Site Reports"}));
			$(this.el).append(this.template());
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
});
window.siteSettingsView = Backbone.View.extend({
	initialize:function(){
	this.render();
	},
	events:{
		'pageshow' : 'pageShow',
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteSettings').html()),
	render:function(){
			$(this.el).html(this.headertemplate({page:"site-settings", logoutid:"userLogout",editType:" ", skin:this.skin, account:this.account, site:this.site, headertitle:"Site Settings"}));
			$(this.el).append(this.template());
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var sitename = this.site;
		$.ajax({
			url: '/sites/view' + sitename,
			type: 'get',
			error: function(data){
			Common.errorhandler(data);
			},
			success: function(data) {
				if (data.error) {
					Common.errorhandler(data);
				} else {
					$('#sitename').text(data.name);
					$('#name').val(data.name);
					$('#server').val(data.address);
					$('#username').val(data.username);
					$('#password').val(data.password);
					$('#http_root').val(data.http_root);
					$('#ftp_root').val(data.ftp_root);
				}
			}
		});
		$('#save').click(function() {
			$.ajax({
				url: '/sites/save',
				type: 'post',
				data: {
					name: $('#name').val(),
					address: $('#server').val(),
					username: $('#username').val(),
					password: $('#password').val(),
					ftp_root: $('#ftp_root').val(),
					http_root: $('#http_root').val()
				},
				error:function(data){
				 	 Common.errorhandler(data);
				},
				success: function(data) {
				console.log('saved');
				}
			});
		});
	},
});
window.siteReportCheckedOutView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .pageitem' :'pageItem',
		'click .logout' : 'logout',
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReportCheckedOut').html()),
	render:function(){
			$(this.el).html(this.headertemplate({page:"site-report-checkedout",mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout", headertitle:"Report"}));
			$(this.el).append(this.template());
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
	pageItem: function(){
					var el = $(event.currentTarget);
					var path = el.attr('data-path');
					$.ajax({
						url: '/pages/checkin?account='+ this.account + '&site='+ this.sitename,
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
	},
	logout:function(){Common.subuserLogout();},
});
window.siteReportPublishedView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click .logout':'logout',
	},
	headertemplate: _.template($('#header').html()),
	template: _.template($('#siteReportPublished').html()),
	render: function(){
		$(this.el).html(this.headertemplate({page:'site-report-published',mode:"action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:'userLogout', headertitle:'Recently Published Pages'}));
		$(this.el).append(this.template());
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
									$.each(data, function(index, page) {
											var path = $(document.createElement('h3'))
												.addClass(path)
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
									});
							}
							pageList.listview("refresh");
					 }
			 });	
	},
	logout:function(){Common.subuserLogout();},
});
window.siteReportScheduledView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	events:{
		'pageshow': 'pageShow',
		'click .logout' : 'logout',
	},
	headertemplate: _.template($('#header').html()),
	template:_.template($('#siteReportScheduled').html()),
	render: function(){
		$(this.el).html(this.headertemplate({page:'site-report-scheduled',mode:"Action",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:'userLogout', headertitle:'Scheduled Content'}));
		$(this.el).append(this.template());
		return this;
	},
	pageShow: function(){
		$.mobile.fixedToolbars.show(true);
		var skin = this.skin;
		var account = this.account;
		var sitename = this.site;
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
	logout:function(){Common.subuserLogout();},
});
window.alertView=Backbone.View.extend({
	events:{
		'pageshow' : 'pageShow',
		'click #okBtn' : 'okBtn',
	},
	template:_.template($('#alertmessage').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
			$(this.el).append(this.template());
			return this;
	},

	pageShow:function(){   	
			$("#alert_title").text(this.title);
			$("#alert_body").text(this.text);
	},
	okBtn:function(){
			window.app.navigate(this.skin+'/users/'+this.account+'/'+this.site, {trigger:true});
			return false;
	},
});
window.messageView=Backbone.View.extend({
	events:{
		'pageshow' : 'pageShow',
		'click #okBtn' : 'okBtn'
	},
	template:_.template($('#alertmessage').html()),
	headertemplate:_.template($('#header').html()),
	render:function (eventName) {
			$(this.el).append(this.template());
			return this;
	},

	pageShow:function(){   	
			//$("#alert_title").text(this.title);
			//$("#alert_body").text(this.text);
	},
	okBtn: function(){
			console.log(this.account);
			if(this.account && this.user){
				Common.direct(this.skin, this.account,'user');
			}
			else if(this.account) {
				Common.direct(this.skin, this.account,'site');
			}
			else{
				Common.direct(this.skin, '','account');
			}
		    return false;
	}

});

var AppRouter = Backbone.Router.extend({
    routes:{
        ":skin":"adminLogin",
        ":skin/accounts" : "accounts",
        ":skin/accounts-edit-mode" : "accountsEditMode",
        ":skin/accounts/:id":"account",
        ":skin/account-add/:tablet": "accountAdd",
      	":skin/account-edit/:tablet/:account": "accountEdit",
      	":skin/account-add/:phone": "accountAdd",
      	":skin/account-edit/:phone/:account": "accountEdit",
      	":skin/groups/:account":"groups",
      	":skin/groups-edit-mode/:account":"groupsEditMode",
        ":skin/users/:account":"users",
        ":skin/users-edit-mode/:account":"usersEditMode",
        ":skin/users/:account/:site":"users",
        ":skin/user-edit/:tablet/:account/:user":"userEdit",
        ":skin/user-add/:tablet/:account":"userAdd",
        ":skin/user-edit/:phone/:account/:user":"userEdit",
        ":skin/user-add/:phone/:account":"userAdd",
        ":skin/sites/:account" : "sites",
        ":skin/sites-edit-mode/:account":"sitesEditMode",
        ":skin/sites/:account/:site" : "site",
        ":skin/site-edit/:tablet/:account/:site" : "siteEdit",
        ":skin/site-add/:tablet/:account" : "siteAdd",
        ":skin/site-edit/:phone/:account/:site" : "siteEdit",
        ":skin/site-add/:phone/:account" : "siteAdd",
        ":skin/site-publish/:account/:site": "sitePublish",
        ":skin/site-reports/:account/:site" : "siteReports",
        ":skin/report-checkedout/:account/:site" : "siteReportCheckedOut",
        ":skin/report-published/:account/:site" : "siteReportPublished",
        ":skin/report-scheduled/:account/:site" :"siteReportScheduled",
        ":skin/site-scan/:account/:site" : "siteScan",
        ":skin/site-settings/:account/:site" : "siteSettings",
        ":skin/groups/:account":"groups",
        ":skin/subuserlogin/:account/:site" : "subuserlogin",
        ":skin/message/:account/:user" : "message",
        ":skin/message/:account" : "message",
        ":skin/message" : "message",
           
       // "sites/:site" :"site",
       // "users" :"users",
    },

    initialize:function () {
        // Handle back button throughout the application
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },
    adminLogin:function (skin) {
        console.log('#adminLogin');
        var adminview =new adminLoginView(); 
        adminview.skin =skin;
        this.changePage(adminview);
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
     	this.changePage(accountseditmode);
     	
    },
    account:function (skin,account){
    	console.log('#account');
    	var accountview= new accountView();
    	accountview.skin=skin;
    	accountview.account=account;
    	this.changePage(accountview);
    
    },
    accountAdd:function(skin,device){
      console.log('#account-add');
      var accountmodel=new AccountModel();
      accountmodel.context.skin=skin;
      accountmodel.context.editType= "add";
      var accountAddview = new accountEditView({model:accountmodel});
      accountAddview.skin=skin;
      accountAddview.editType= "add";
      accountAddview.headerTitle="Add Account";
      accountAddview.device=device;
      this.changePage(accountAddview);
    },
    accountEdit:function(skin,device,account){
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
      accountEditview.editType= "edit";
      accountEditview.device=device;
      accountEditview.headerTitle="Edit Account: "+account;
      this.changePage(accountEditview);
		}
		});

    //  accountEditview.load();

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
		 //var groupmodel = new UserModel({id: "groupEdit"});
		// var groupsEditModeview= new usersEditModeView({model: usermodel});
		// groupsEditModeview.skin=skin;
		// groupsEditModeview.account=account;
		// groupmodel.skin = skin;
		 //groupmodel.account = account;
		 this.changePage(groupsEditModeview);
    },
    users:function(skin,account,site){ 
	 console.log('#users');
	 var usersview= new usersView();
	 usersview.account=account;
	 usersview.skin=skin;
	 this.changePage(usersview);
	 if (site){
		usersview.site=site;
	  }
    },
    usersEditMode:function(skin,account){
		 console.log('#users-edit-mode');
		 var usermodel = new UserModel({id: "userEdit"});
		 var usersEditModeview= new usersEditModeView({model: usermodel});
		 usersEditModeview.skin=skin;
		 usersEditModeview.account=account;
		 usermodel.skin = skin;
		 usermodel.account = account;
		 this.changePage(usersEditModeview);
    },
    
    userEdit:function(skin,device,account,user){
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
			userEditview.headerTitle="Edit User: "+ user;
			this.changePage(userEditview);
    	}
    	});

    },
    userAdd:function(skin,device,account){
    	console.log('#user-add');
    	var usermodel= new UserModel({skin:skin,account : account});
    	usermodel.context.skin = skin;
    	usermodel.context.editType= "add";
    	var userAddview = new userEditView({model:usermodel});
    	userAddview.skin = skin;
    	userAddview.account=account;
    	userAddview.editType="add";
    	userAddview.device=device;
    	userAddview.headerTitle="Add User";
    	this.changePage(userAddview);
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
		 this.changePage(sitesEditModeview);

     
    },

    site:function(skin,account,site){
		console.log('#site');
		if(site== " "){
			console.log('site is not selected, it should be redirected to sites');
			this.navigate(skin+'/sites/'+account, {trigger:true});
		}
		else{
			var siteview = new siteView();
			siteview.skin =skin;
			siteview.account =account;
			siteview.site=site;
			this.changePage(siteview);
		}
    },
    siteEdit:function(skin,device,account,site){
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
    	siteEditview.headerTitle="Edit Site :" +site;
    	this.changePage(siteEditview);
    	}
    	});

    },
    siteAdd:function(skin,device,account){
    	console.log('#site-add');
    	var sitemodel=new SiteModel({skin:skin,account:account});
        sitemodel.context.skin=skin;
        sitemodel.context.editType= "add";
    	var siteAddview = new siteEditView({model: sitemodel});
    	siteAddview.skin= skin;
    	siteAddview.account= account;
    	siteAddview.editType="add";
    	siteAddview.device= device;
    	siteAddview.headerTitle="Add Site";
    	this.changePage(siteAddview);
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
    siteSettings : function(skin,account, site){
    	console.log('#site-settings');
    	siteSettingsview = siteSettingsView();
    	siteSettingsview.site =site;
    	this.changePage(siteSettingsview);
    },
    subuserlogin:function(skin,account,site){
	var alertview= new alertView();
	alertview.title="User login:";
	alertview.text="In order to perform actions to site: "+site+ " , you should be login as normal admin.Please select a user first.";
	alertview.ok="#users";
	alertview.skin=skin;
	alertview.account=account;
	alertview.site=site;
	this.changePage(alertview, true);
   },
    message:function(skin,account,user){
	var alertview= new messageView();
	alertview.ok="#users";
	alertview.skin=skin;
	alertview.account=account;
	alertview.user=user;
	this.changePage(alertview, true);
   },
    changePage:function (page,alertPage) {
		if (interval != null) {
			clearInterval(interval);
		}
    	if(alertPage){
    		$(page.el).attr('data-role' , 'dialog');
    		
    	} else{
       		$(page.el).attr('data-role', 'page');
        }
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        else if(alertPage){
           transition = 'pop';
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition, reloadPage:true});
    },

});

$(document).ready(function () {
		console.log('document ready');
		window.app = new AppRouter();
		Backbone.history.start();	
});
