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
					var skin =this.skin;
					var username = $('#username').val();
					var password = $('#password').val();
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
			'click .logout' : 'logout'
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
									.addClass('ui-link-inherit hyperlinkli');
								a.append(count);
								var li = $(document.createElement('li')).append(a);
								accounts.append(li);
							});
							accounts.listview("refresh");
							}
					});
	},
	logout:function(){Common.logout();}
});
window.accountsEditModeView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this);
		this.render();		
	},
	events:{
		'pageshow' :'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click #okBtn':'okBtn',
		'click #addBtn':'addBtn',
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#accountsEditMode').html()),
	footertemplate:_.template($('#footer').html()),
	render:function(){
	   $(this.el).html(this.headertemplate({page:"account",mode:"edit-mode",editType:'add', skin:this.skin,account:this.account, site:this.site,logoutid:"logout", headertitle:"Accounts"}));
	   $(this.el).append(this.template());
	   $(this.el).append(this.footertemplate({toolbar : "toolbar"}));
	   return this;
	},
	pageShow: function(){
	console.log("groups-edit-mode");
		$.mobile.fixedToolbars.show(true);
		var editPath ='#'+this.skin+'/account-edit/multiple/tablet';
		var Browser = browserdetect();
		if(Browser.phone){
	 		var editPath ='#'+this.skin+'/account-edit/multiple/phone';
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
    addBtn:function(){Common.add(this.skin, this.account, this.site,'account','multiple');},
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
		'click #editBtn' : 'editBtn'
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
	var accountcontext = $('#accountform').serializeObject();
	console.log(accountcontext);
   			var editType = this.editType;
			$.mobile.fixedToolbars.show(true);
			if (editType == "edit"){
				   var accountsDiv =$('#accountdiv');
				   var data= this.model.context.data;
			
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
		'click #homeBtn': 'homeBtn',
		'click .accountPage' : 'accountPage'
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
	homeBtn:function(){Common.home;},
	logout:function(){Common.logout();},
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}

});
window.groupsEditModeView = Backbone.View.extend({
initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #deleteBtn':'deleteBtn',
		'click #okBtn':'okBtn',
		'click #addBtn' : 'addBtn',
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
					 // console.log(data);
						
						   var inputElement = $(document.createElement('input'))
	                             .attr({type: 'checkbox' })
	                             .attr({id: idCount+1 })
	                             .addClass('custom')
	                             .attr({'value': value.name });
	                             
									
									
						   var inputText =$(document.createElement('span'))
						    		 .addClass('ui-btn-text')
						    		  .attr({id:idCount+1})
						     	   	 .text(value.name);
							
						    var a = $(document.createElement('a'))
						           .attr({href: editPath +'/'+value.name })
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
		'click .accountPage' : 'accountPage'
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
	Common.add(this.skin, this.account, this.group,'group','single','edit');
	},
	logout:function(){Common.logout();},
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}

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
	
		$.mobile.fixedToolbars.show(true);
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
		'click .accountPage' : 'accountPage'
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
										 
								var nextstepurl = "#"+skin + "/users/" +account + "/"+value.username;	 
								var a = $(document.createElement('a'))
											.attr({href : nextstepurl})
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
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}
});
window.userView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	events:{
		'pageshow' : 'pageShow',
		'click #editBtn' : 'editBtn',
		'click .logout': 'logout',
		'click .accountPage' : 'accountPage'
	},
	headertemplate:_.template($('#header').html()),
	template:_.template($('#usertemplate').html()),
	footertemplate:_.template($('#footer').html()),
	render:function (eventName) {
			$(this.el).html(this.headertemplate({page:"user",mode:"workflow",editType:" ",skin:this.skin, account:this.account, site:this.site,logoutid:"userLogout",headertitle:"User Actions"}));
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
		$('#user-name').append(data.user);
		$('#approver').append(approver);
		$('#privilege').append(privilegea).append(privilege);
		$('#fname').append(data.first_name);
		$('#lname').append(data.last_name);
		$('#last-save-date').append(savedate);
		$('#last-login-date').append(logindate);
		
		$('#save-count').append(savecounta).append(savecount);
		$('#headertitle').text(user);



	},
	editBtn: function(){
	Common.add(this.skin, this.account, this.user,'user','single','edit');
	},
	logout:function(){Common.logout();},
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}
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
			$(this.el).append(this.footertemplate({toolbar:"toolbar"}));
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
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
	}
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
		'click .accountPage' : 'accountPage'
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
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}
	

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
			$(this.el).append(this.footertemplate({toolbar:"toolbar"})) ;
			return this;
	},
	pageShow:function(){
		$.mobile.fixedToolbars.show(true);
		var Browser = browserdetect();
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
		'click .accountPage' : 'accountPage'
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
		
		$('.publish').attr({'href': '#'+skin+'/site-publish/'+ account + '/' + site});
		$('.reports').attr({'href': '#'+skin+'/site-reports/'+ account + '/' + site});
		$('.scan').attr({'href': '#'+skin+'/site-scan/'+ account + '/' + site});
		$('.settings').attr({'href':'#'+skin+'/site-settings/'+ account + '/' + site});


	},
	editBtn: function(){
		Common.add(this.skin, this.account, this.site,'site','single','edit');
	},
	logout:function(){Common.logout();},
	accountPage: function(){Common.workflowMode (this.skin, this.account, '' ,'account')}
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
												//alertpage(response,pageType, mode ,name,page);
												return false;
										}
										});	 
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


var AppRouter = Backbone.Router.extend({
    routes:{
        ":skin":"adminLogin",
        
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
      this.changePage(accountAddview);
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

      this.changePage(accountEditview);
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
		 this.changePage(groupsEditModeview);
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
			
			this.changePage(groupEditview);
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
    	this.changePage(groupAddview);
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
		 this.changePage(usersEditModeview);
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
			this.changePage(userEditview);
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
	    	console.log('#site-edit');
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
    	
    	this.changePage(siteEditview);
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
    	this.changePage(siteAddview);
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
