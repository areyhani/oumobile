	accounttabs=['#generalsettings','#personalinformation' , '#publishsettings' , '#loginpage' , '#optionalsettings'];
	usertabs =['#userinformation','#LDAPconfiguration' , '#restrictions' , '#preferences'];
	sitetabs=['#siteinformation','#productionserver' , '#ldp' , '#sitepreference' , '#publishSettings' , '#wysiwygSettings', '#directEditBtn', '#fileNaming'];
	
	function toggle (value,tabs){
		$(this).dblclick();
		var currentframe= value+'-div';
	    $(currentframe).show();
	    $(value).addClass('ui-btn-hover-c');
		$.each(tabs, function(index,item){
			if(item != value){
			var divcontent = item+'-div';
				$(divcontent).hide();
				$(item).removeClass('ui-btn-hover-c');
			}
		});
		$.mobile.fixedToolbars.show(true);
	}
			$('#generalsettings').live('click', function(){
				toggle ('#generalsettings',accounttabs);
			});
			
			$('#personalinformation').live('click', function(){
				toggle ('#personalinformation',accounttabs);
			});
			
		    $('#publishsettings').live('click', function(){
				toggle ('#publishsettings',accounttabs);
			});
			
			$('#loginpage').live('click', function(){
				toggle ('#loginpage',accounttabs);
			});
			
			$('#optionalsettings').live('click', function(){
				toggle ('#optionalsettings',accounttabs);
			});
			
		
		
			$('#userinformation').live('click', function(){
				toggle ('#userinformation',usertabs);
			});
			$('#preferences').live('click', function(){
				toggle('#preferences',usertabs);
			});
			$('#restrictions').live('click', function(){
			   toggle('#restrictions',usertabs);
			});
			$('#LDAPconfiguration').live('click', function(){
			   toggle('#LDAPconfiguration',usertabs);
			});
			
					
			
			$('#siteinformation').live('click', function(){
				toggle('#siteinformation',sitetabs);
			});
			$('#productionserver').live('click', function(){
				toggle('#productionserver',sitetabs);
			});
			$('#ldp').live('click', function(){
		  		toggle('#ldp',sitetabs);
			});
			$('#sitepreference').live('click', function(){
				toggle('#sitepreference',sitetabs);
			});
			$('#publishSettings').live('click', function(){
			 	toggle('#publishSettings',sitetabs);
			});
			$('#wysiwygSettings').live('click', function(){
				toggle('#wysiwygSettings',sitetabs);
			});
			$('#directEditBtn').live('click', function(){
				toggle('#directEditBtn',sitetabs);
			});
			$('#fileNaming').live('click', function(){
				toggle('#fileNaming',sitetabs);
			});
		
		
			$('#templateDirectory').live('click', function(){
			$(this).dblclick();
			var templateDirectory = $('#use_local_templates').val();
			if(templateDirectory == "false"){ 
			$('#LocalTemplatePath').hide();
			$('#RemoteTemplatePath').show();
			}
			else{
			$('#RemoteTemplatePath').hide();
			$('#LocalTemplatePath').show();
			}
			}
			);