(function(exports) {
var App = exports.App = {}; // global app container
var Templates = App.Templates = {}; // template collection
var Contexts = App.Contexts = {}; // context collection
var Views = App.Views = {}; // view instances
var Collections = App.Collections = {}; // collection instances
var Sorters = {
	string : function(column, order) {
		return function(a, b) {
			var x = a.get(column) || "";
			var y = b.get(column) || "";
			x = x.toLowerCase();
			y = y.toLowerCase();
			var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));
			return (!order || order == "asc") ? result : result * -1;
		};
	},
	number : function(column, order) {
		return function(a, b) {
			var x = a.get(column);
			var y = b.get(column);
			var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));
			return (!order || order == "asc") ? result : result * -1;
		};
	},
	// alias for date sorting
	date : function(column, order) {
		return this.number(column, order);
	},
	// custom sorter for last name, first name
	fullName : function(order) {
		return function(a, b) {
			var x1 = a.get("last_name") || "";
			var x2 = a.get("first_name") || "";
			var y1 = b.get("last_name") || "";
			var y2 = b.get("first_name") || "";
			var x = x1.toLowerCase() + x2.toLowerCase();
			var y = y1.toLowerCase() + y2.toLowerCase();
			var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));
			return (!order || order == "asc") ? result : result * -1;
		};
	},
};
var Regex = {
	account : /^[A-Za-z\d][\w.@\-]+$/, // at least 2 characters, start with letter or digit, contains letters, digits, . _ - @
	email : /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/, // copied from Validator.java
	endWithSlash : /\/$/,
	http : /^https?:\/\/.*/
}
// add any utility functions to underscore
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

// custom jquery function to serialize a form to an object, and include all checkboxes
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

App.user = localStorage.getItem("user") || null;
App.skin = window.location.pathname.substr(1).split("/")[0];
App.rootPath = "/" + App.skin + "/oumobile2";

//-----models-----
var Account = Backbone.Model.extend({
	initialize : function() {
		this.users = new UserList();
		this.sites = new SiteList();
		if(this.id)
			this.users.account = this.sites.account = this.id;
	},
	sync : function(method, model, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/accounts/view", dataType: "json", data: { account : model.id } };
		}
		else if(method == "create") {
			var params = { type: "POST", url: "/accounts/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			var params = { type: "POST", url: "/accounts/save", dataType: "json", data: model.toJSON() };
		}
		else if(method == "delete") {
			var params = { type: "POST", url: "/accounts/delete", dataType: "json", data: { account : model.id } };
		}
		return $.ajax(_.extend(params, options));
	},
	validate : function(attrs) {
		var obj = { errors: {} };
		if(attrs.account === "")
			obj.errors["account"] = "Account name is a required field.";
		else if(attrs.account && attrs.account.length < 2)
			obj.errors["account"] = "Account name must be at least 2 characters in length.";
		else if(attrs.account && attrs.account.search(Regex.account) < 0)
			obj.errors["account"] = "Account names must start with a letter or digit, and contain only letters, digits, or . _ - @";
		if(attrs.email && attrs.email.search(Regex.email) < 0)
			obj.errors["email"] = "Invalid email address";
		if(attrs.help_root && attrs.help_root.search(Regex.endWithSlash) < 0)
			obj.errors["help_root"] = "Help URL must end with a slash (/)";
		if(attrs.sso_url && attrs.sso_url.search(Regex.endWithSlash) >= 0)
			obj.errors["sso_url"] = "CAS or Shibboleth URL must not end with a slash (/)";
		else if(attrs.sso_url && attrs.sso_url.search(/^(https?:\/|shib:)\/.*/) < 0)
			obj.errors["sso_url"] = "CAS or Shibboleth URL must begin with http://, https://, or shib:/";
		if(attrs.logout_url && attrs.logout_url.search(Regex.endWithSlash) >= 0)
			obj.errors["logout_url"] = "Logout URL must not end with a slash (/)";
		if(attrs.announcement_url && attrs.announcement_url.search(Regex.http) < 0)
			obj.errors["announcement_url"] = "Announcement URL must begin with http:// or https://";
		if(attrs.logo_url && attrs.logo_url.search(Regex.http) < 0)
			obj.errors["logo_url"] = "Logo URL must begin with http:// or https://";
		if(attrs.fail_count && parseInt(attrs.fail_count) <= 0)
			obj.errors["fail_count"] = "Failed attempts must be greater than 0";
		if(attrs.file_check > 0 && !attrs.spell_check && !attrs.link_check && !attrs.page_validate && !attrs.accessibility_check)
			obj.errors["page_check_options"] = "Select at least one page check option with page check enabled";
		var errorCount = _.keys(obj.errors).length;
		if(errorCount > 0) {
			obj.error = errorCount + " field" + (errorCount != 1 ? "s are" : " is") + " invalid. Please make corrections and resubmit."
			obj.code = "INVALID_INPUT";
			return obj;
		}
	}
});

var Site = Backbone.Model.extend({
	sync : function(method, model, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/sites/view", dataType: "json", data : { account : model.get("account"), site: model.get("site") } };
		}
		else if(method == "create") {
			var params = { type: "POST", url: "/sites/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			var params = { type: "POST", url: "/sites/save", dataType: "json", data: model.toJSON() };
		}
		else if(method == "delete") {
			var params = { type: "POST", url: "/sites/delete", dataType: "json", data: { account: model.get("account"), user: model.get("site") } };
		}
		return $.ajax(_.extend(params, options));
	},
});

var User = Backbone.Model.extend({
	sync : function(method, model, options) {
		if(method == "read") {
			var params = { type: "GET", url: "/users/view", dataType: "json", data: { account: model.get("account"), user: model.get("user") } };
		}
		else if(method == "create") {
			var params = { type: "POST", url: "/users/new", dataType: "json", data: model.toJSON() };
		}
		else if(method == "update") {
			var params = { type: "POST", url: "/users/save", dataType: "json", data: model.toJSON() };
		}
		else if(method == "delete") {
			var params = { type: "POST", url: "/users/delete", dataType: "json", data: { account: model.get("account"), user: model.get("user") } };
		}
		return $.ajax(_.extend(params, options));
	}
});

//-----collections-----
var AccountList = Backbone.Collection.extend({
	model: Account,
	currentSort : { column : "created", order : "desc" }, // default sort order is created date descending
	comparator : Sorters.date("created", "desc"),
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

var SiteList = Backbone.Collection.extend({
	model: Site,
	initialize : function() {
		this.currentSort = { column : "site", order : "asc" }; // default sort order is user name ascending
	},
	comparator : Sorters.string("site", "asc"),
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

var UserList = Backbone.Collection.extend({
	model: User,
	initialize : function() {
		this.currentSort = { column : "user", order : "asc" }; // default sort order is user name ascending
	},
	comparator : Sorters.string("user", "asc"),
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

//-----views-----

var LoginView = Backbone.View.extend({
	initialize : function() {
		_.bindAll(this);
		this.on("open", this.open, this);
		this.on("close", this.close, this);
	},
	open : function() {
		$("#index").empty();
		this.delegateEvents();
		this.render();
	},
	close : function() {
		this.remove();
	},
	events : {
	},
	login : function() {
		var params = $("#form-login").serializeObject();
		params.skin = App.skin;
		var self = this;
		$.ajax("/authentication/admin_login", { type: "POST", data: params, dataType: "json",
			success: function(data) {
				App.user = data.user;
				App.skin = data.skin;
				localStorage.setItem("user", data.user);
				Contexts.loggedIn.topLinks.right[0].label = data.user; // update context variable
				Views.app.render();
				App.router.navigate(App.router.requested, true);
			},
			error: function(response) {
				var resp = $.parseJSON(response.responseText);
				$("#login-message").addClass("alert alert-error").html(resp.error);
			}
		});
		return false; // prevents form from submitting
	},
	render : function() {
		$("#index").html(Templates.login()).trigger('create');
		$("title").html("OU Mobile - Login");
	}
});

var Router = Backbone.Router.extend({
	routes : {
		"" : "index"
	},

	initialize : function() {
		// create collection and view instances
		Views.login = new LoginView();
		
		this.transition(Views.login);
	},

	index : function() {
		if(!App.user) {
			this.navigate("");
			this.transition(Views.login);
		}

	},

	// call this on every route. If changing pages, fires close event to notify previous view that we are changing pages, so we can clear out event listeners. Fires open event to the next view so it can initialize. 
	transition : function(view, options) {
		options = options || {};
		if(this.currentView) {
			if(this.currentView == view)
				return;
			this.currentView.trigger("close", options);
		}
		this.currentView = view;
		view.trigger("open", options);
	}
});

App.initialize = function() {
	// compile templates and register helpers (final version will precompile templates)
	Templates.login = Handlebars.compile($("#template-login").html());
	Handlebars.registerHelper("attr", function(attrHash) {
		var result = "";
		for (key in attrHash)
			result += (key + "=" + "\"" + attrHash[key] + "\"" + " ");
		return new Handlebars.SafeString(result);
	});

	// define contexts

	// create router instance and start tracking routes
	this.router = new Router();
	Backbone.history.start({ root: this.rootPath });
}

var SampleData = {};
SampleData.accounts = [
	{"account":"gallenauniversity","name":{"first_name":"","last_name":""},"created":"2011-01-16T16:16:51-0800","last_saved":"2012-01-16T16:16:51-0800","save_count":116,"hidden":false,"page_count":3344},
	{"account":"ucla","name":{"first_name":"Mikey","last_name":"Gee"},"created":"2012-03-16T16:16:51-0800","last_saved":"2012-01-15T16:16:51-0800","save_count":6904,"hidden":false,"page_count":334},
	{"account":"usc","name":{"first_name":"Reggie","last_name":"Bush"},"created":"2012-01-18T16:16:51-0800","last_saved":"2012-02-16T16:06:51-0800","save_count":623,"hidden":false,"page_count":421},
	{"account":"arizona","name":{"first_name":"Jordan","last_name":"Hill"},"created":"2012-01-16T15:16:51-0800","last_saved":"2012-01-16T16:16:01-0800","save_count":93216,"hidden":false,"page_count":4213},
	{"account":"arizonastate","name":{"first_name":"James","last_name":"Harden"},"created":"2012-01-16T16:10:51-0800","last_saved":"2012-03-16T16:16:51-0800","save_count":32146,"hidden":false,"page_count":354},
	{"account":"california","name":{"first_name":"Ryan","last_name":"Anderson"},"created":"2012-01-16T16:16:59-0800","last_saved":"2012-01-16T16:16:31-0800","save_count":63215,"hidden":false,"page_count":224},
	{"account":"stanford","name":{"first_name":"Landry","last_name":"Fields"},"created":"2010-01-16T16:16:51-0800","last_saved":"2012-01-16T16:06:51-0800","save_count":16,"hidden":false,"page_count":409043},
	{"account":"oregon","name":{"first_name":"Luke","last_name":"Ridnour"},"created":"2012-09-16T16:16:51-0800","last_saved":"2012-01-16T16:18:51-0800","save_count":62,"hidden":false,"page_count":45909},
	{"account":"oregonstate","name":{"first_name":"Gary","last_name":"Payton"},"created":"2012-01-19T16:16:51-0800","last_saved":"2012-01-16T16:16:51-0800","save_count":676,"hidden":false,"page_count":43242},
	{"account":"washington","name":{"first_name":"Brandon","last_name":"Roy"},"created":"2012-01-16T16:06:41-0800","last_saved":"2012-01-11T16:16:51-0800","save_count":600,"hidden":false,"page_count":4405034},
	{"account":"washingtonstate","name":{"first_name":"Klay","last_name":"Thompson"},"created":"2012-01-16T16:16:01-0800","last_saved":"2012-03-16T16:16:51-0800","save_count":23542326,"hidden":false,"page_count":9904},
	{"account":"colorado","name":{"first_name":"Jules","last_name":"Winfield"},"created":"2009-01-16T16:16:51-0800","last_saved":"2011-01-16T16:16:51-0800","save_count":63221,"hidden":false,"page_count":14},
	{"account":"utah","name":{"first_name":"Vincent","last_name":"Vega"},"created":"2012-01-16T11:16:51-0800","last_saved":"2012-01-16T16:16:59-0800","save_count":65409,"hidden":false,"page_count":43},
	{"account":"nevada","name":{"first_name":"Marsellus","last_name":"Wallace"},"created":"2012-01-16T14:16:52-0800","last_saved":"2012-01-16T16:46:51-0800","save_count":2342366,"hidden":false,"page_count":4234},
	{"account":"idaho","name":{"first_name":"Mia","last_name":"Wallace"},"created":"2008-01-16T16:16:51-0800","last_saved":"2012-01-16T19:16:51-0800","save_count":426,"hidden":true,"page_count":4435},
	{"account":"montana","name":{"first_name":"Winston","last_name":"Wolfe"},"created":"2012-11-16T16:16:51-0800","last_saved":"2012-01-18T16:16:51-0800","save_count":1642,"hidden":true,"page_count":49324},
	{"account":"iowa","name":{"first_name":"Trucy","last_name":"Phan"},"created":"2011-01-14T16:06:31-0800","last_saved":"2011-02-19T16:06:51-0800","save_count":632,"hidden":true,"page_count":443243},
	{"account":"newmexico","name":{"first_name":"Danny","last_name":"Granger"},"created":"2011-04-16T16:16:51-0800","last_saved":"2012-02-18T16:13:51-0800","save_count":64112,"hidden":true,"page_count":4433},
	{"account":"texas","name":{"first_name":"Kevin","last_name":"Durant"},"created":"2011-05-26T16:16:51-0800","last_saved":"2011-09-18T13:16:51-0800","save_count":11642,"hidden":true,"page_count":3243},
	{"account":"oklahoma","name":{"first_name":"Blake","last_name":"Griffin"},"created":"2010-09-12T16:16:51-0800","last_saved":"2011-01-28T16:16:51-0800","save_count":22642,"hidden":true,"page_count":143243},
	{"account":"kansas","name":{"first_name":"Brandon","last_name":"Rush"},"created":"2011-07-06T10:10:31-0800","last_saved":"2011-09-18T16:16:51-0800","save_count":33642,"hidden":true,"page_count":43243},
	{"account":"wisconsin","name":{"first_name":"","last_name":""},"created":"2012-01-15T16:16:51-0800","last_saved":"2012-04-16T16:16:51-0800","save_count":23364,"hidden":true,"page_count":4321}
];
SampleData.users = [{"user":"mgee","name":{"first_name":"Mikey","last_name":"Gee"},"email":"mgee@omniupdate.com","approver":null,"privilege":10,"accounts":["ucla"]},
	{"user":"drose","name":{"first_name":"Derrick","last_name":"Rose"},"email":"drose@bulls.com","approver":null,"privilege":8},
	{"user":"kbryant","name":{"first_name":"Kobe","last_name":"Bryant"},"email":"kbryant@lakers.com","approver":null,"privilege":9},
	{"user":"rsessions","name":{"first_name":"Ramon","last_name":"Sessions"},"email":"rsessions@lakers.com","approver":null,"privilege":2},
	{"user":"abynum","name":{"first_name":"Andrew","last_name":"Bynum"},"email":"abynum@lakers.com","approver":null,"privilege":7},
	{"user":"pgasol","name":{"first_name":"Pau","last_name":"Gasol"},"email":"pgasol@lakers.com","approver":null,"privilege":5},
	{"user":"mpeace","name":{"first_name":"Metta","last_name":"World Peace"},"email":"mpeace@lakers.com","approver":null,"privilege":9},
	{"user":"ljames","name":{"first_name":"LeBron","last_name":"James"},"email":"ljames@heat.com","approver":null,"privilege":3},
	{"user":"dwade","name":{"first_name":"Dwayne","last_name":"Wade"},"email":"dwade@heat.com","approver":null,"privilege":4},
	{"user":"cbosh","name":{"first_name":"Chris","last_name":"Bosh"},"email":"cbosh@heat.com","approver":null,"privilege":5},
	{"user":"mchalmers","name":{"first_name":"Mario","last_name":"Chalmers"},"email":"mchalmers@heat.com","approver":null,"privilege":6},
	{"user":"cpaul","name":{"first_name":"Chris","last_name":"Paul"},"email":"cpaul@clippers.com","approver":null,"privilege":6},
	{"user":"bgriffin","name":{"first_name":"Blake","last_name":"Griffin"},"email":"bgriffin@clippers.com","approver":null,"privilege":6},
	{"user":"djordan","name":{"first_name":"DeAndre","last_name":"Jordan"},"email":"djordan@clippers.com","approver":null,"privilege":6},
	{"user":"cbutler","name":{"first_name":"Caron","last_name":"Butler"},"email":"cbutler@clippers.com","approver":null,"privilege":6},
	{"user":"rfoye","name":{"first_name":"Randy","last_name":"Foye"},"email":"rfoye@clippers.com","approver":null,"privilege":6},
	{"user":"scurry","name":{"first_name":"Stephen","last_name":"Curry"},"email":"scurry@warriors.com","approver":null,"privilege":1},
	{"user":"jthompson","name":{"first_name":"Jason","last_name":"Thompson"},"email":"jthompson@kings.com","approver":null,"privilege":5},
	{"user":"laldridge","name":{"first_name":"LaMarcus","last_name":"Aldridge"},"email":"laldridge@blazers.com","approver":null,"privilege":4},
	{"user":"ajefferson","name":{"first_name":"Al","last_name":"Jefferson"},"email":"ajefferson@jazz.com","approver":null,"privilege":4},
	{"user":"aafflalo","name":{"first_name":"Aaron","last_name":"Afflalo"},"email":"afflalo@nuggets.com","approver":null,"privilege":10},
	{"user":"snash","name":{"first_name":"Steve","last_name":"Nash"},"email":"snash@suns.com","approver":null,"privilege":4},
	{"user":"kdurant","name":{"first_name":"Kevin","last_name":"Durant"},"email":"kdurant@thunder.com","approver":null,"privilege":7}
];
SampleData.sites = [{"site":"site1.omniupdate.com","url":"http://site1.omniupdate.com","last_saved":"2012-05-07T10:07:01-0700","save_count":34},
	{"site":"site1.omniupdate.com","url":"http://site1.omniupdate.com","last_saved":"2011-05-04T19:07:01-0700","save_count":34},
	{"site":"site2.omniupdate.com","url":"http://site2.omniupdate.com","last_saved":"2010-05-27T17:07:01-0700","save_count":1134},
	{"site":"site3.omniupdate.com","url":"http://site3.omniupdate.com","last_saved":"2012-03-17T14:07:01-0700","save_count":24},
	{"site":"site4.omniupdate.com","url":"http://site4.omniupdate.com","last_saved":"2012-01-06T20:07:01-0700","save_count":3424},
	{"site":"site5.omniupdate.com","url":"http://site5.omniupdate.com","last_saved":"2012-04-01T10:07:01-0700","save_count":3444},
	{"site":"site6.omniupdate.com","url":"http://site6.omniupdate.com","last_saved":"2012-01-17T10:07:01-0700","save_count":59034},
	{"site":"site7.omniupdate.com","url":"http://site7.omniupdate.com","last_saved":"2011-11-27T12:07:01-0700","save_count":2234},
	{"site":"site8.omniupdate.com","url":"http://site8.omniupdate.com","last_saved":"2011-06-27T10:07:01-0700","save_count":4634},
	{"site":"site9.omniupdate.com","url":"http://site9.omniupdate.com","last_saved":"2011-02-19T12:07:01-0700","save_count":33334},
	{"site":"site1.oucampus.com","url":"http://site1.oucampus.com","last_saved":"2011-05-04T19:07:01-0700","save_count":34},
	{"site":"site2.oucampus.com","url":"http://site2.oucampus.com","last_saved":"2010-05-27T17:07:01-0700","save_count":1134},
	{"site":"site3.oucampus.com","url":"http://site3.oucampus.com","last_saved":"2012-03-17T14:07:01-0700","save_count":24},
	{"site":"site4.oucampus.com","url":"http://site4.oucampus.com","last_saved":"2012-01-06T20:07:01-0700","save_count":3424},
	{"site":"site5.oucampus.com","url":"http://site5.oucampus.com","last_saved":"2012-04-01T10:07:01-0700","save_count":3444},
	{"site":"site6.oucampus.com","url":"http://site6.oucampus.com","last_saved":"2012-01-17T10:07:01-0700","save_count":59034},
	{"site":"site7.oucampus.com","url":"http://site7.oucampus.com","last_saved":"2011-11-27T12:07:01-0700","save_count":2234},
	{"site":"site8.oucampus.com","url":"http://site8.oucampus.com","last_saved":"2011-06-27T10:07:01-0700","save_count":4634},
	{"site":"site9.oucampus.com","url":"http://site9.oucampus.com","last_saved":"2011-02-19T12:07:01-0700","save_count":33334}
];
	
}(this));
