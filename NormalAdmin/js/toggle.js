	accounttabs=['#generalsettings','#personalinformation' , '#publishsettings' , '#loginpage' , '#optionalsettings'];
	usertabs =['#userinformation','#productionServer','#LDAPconfiguration' , '#restrictions' , '#preferences'];
	sitetabs=['#siteinformation','#productionServer' , '#ldp' , '#sitepreference' , '#publishSettings' , '#wysiwygSettings', '#directEditBtn', '#fileNaming'];
	
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
			$('#productionServer').live('click', function(){
				toggle('#productionServer',sitetabs);
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
			
			$('#fauthtype1').live('change', function(){
				$(this).dblclick();
				var element =$('#fauthtype0').siblings()[0].className;
				if(jQuery.contains(element,'ui-radio-on')){
					$('#passwordLi').hide('slidup', false,true);
				}
				}
			);
			$('#fauthtype0').live('change', function(){
				$(this).dblclick();
				var element =$('#fauthtype0').siblings()[0].className;
				if(jQuery.contains(element,'ui-radio-on')){
					$('#passwordLi').show('slidedown',false,true);
				}
				}
			);
			
			$('#page_check').live('change', function(){
			  var value= $('#page_check').val();
				if (value != "0") {

					$('#filechecklist').show('slidedown',false,true);
				} else {

					$('spell_check').checked = false;
					$('link_check').checked = false;
					$('page_validate').checked = false;
					$('accessibility').checked = false;
					$('#filechecklist').hide('slidup', false,true);
			}
			} );
				
			$('#accessibility').live('change', function(){
				var value= $('#accessibility').attr("checked");
				if (value) {
					$('#accessibilityOptions').show('slidedown',false,true);
				} else {
					$('#accessibilityOptions').hide('slidup', false,true);
			}
			} );
				
			$('.icon-eye').live('click', function(){
				var value= $('#showpassword').css('display');
			   if (value == 'none') {
					$('#showpassword').show('slidedown',false,true);
					$('.icon-eye i').removeClass('icon-arrow-down');
					$('.icon-eye i').addClass('icon-arrow-up');
				} else {
					$('#showpassword').hide('slidup', false,true);
					$('.icon-eye i').removeClass('icon-arrow-up');
					$('.icon-eye i').addClass('icon-arrow-down');
			     }
			});
			
			$('#productionServer-div #password').live('keyup', function(){
			   $('#showpassword').val($('#password').val());
			});