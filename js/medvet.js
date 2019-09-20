$(document).ready(
	function() {

		//if ( $(window).width() > 991 ) {
			$('#segments').height( $(window).outerHeight()  * 1.0 );
			$('#contact').height( $(window).outerHeight() - 50 );
		//}

		$( window ).resize(function() {
  			if ( $(window).width() > 991 ) {
				$('#segments').height( $(window).outerHeight()  * 1.0 );
				$('#contact').height( $(window).outerHeight() - 50 );
			}
			else {
				$('#segments').css('height', 'auto');
				$('#contact').css('height', 'auto');
			}
		});

		$(window).scroll(function (event) {
    		var scroll = $(window).scrollTop();
			var opacity = (scroll - 200)/300;
			if (opacity<0) opacity = 0;
			if (opacity>1) opacity = 1;
			$('nav.navbar').css('background','rgba(148, 121, 240,'+opacity+')');
    		// Do something
		});

	}
);

function scrollToAnchor(aid){
    var aTag = $("*[id='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top - 75 },'slow');
	$('.navbar-collapse').collapse('hide');
    return false;
}

function sendForm() {
	$('#formOKmessage').fadeOut();
	$('#formFailedmessage').fadeOut();

	data = {
		"userName": $('#userName').val(),
		"email": $('#email').val(),
		"phone": $('#phone').val(),
		"desc": $('#desc').val(),
	}
	$.ajax({
		type: "POST",
		url: 'https://jtleasing.jtfg.com/post',
		data: data,
		dataType: 'jsonp',
		jsonp: false,
    	jsonpCallback: "myJsonMethod",
    	success : sendingOK,
    	error : sendingFailed,
	});
}


function sendingOK( data ) {

	if ( data.error == '' ) {
		$('#formOKmessage').html('Poslané. Ozveme se vám.');
		$('#formOKmessage').fadeIn();
		setTimeout( function() { 
			$('#contactModal').modal('hide');
			$('#formOKmessage').fadeOut();
			$('#formFailedmessage').fadeOut();
		}, 3000);
	} else sendingFailed();
}

function sendingFailed(httpReq,status,exception) {
	$('#formFailedmessage').html('Nastala chyba. Skuste to znovu pozdeji.');
	$('#formFailedmessage').fadeIn();
}

function toggleDocsCompany() {
	if ( $('#list-docs-company').is(':visible') ) {
		$('#list-docs-company').slideUp();
		$('#arrow-docs-company').html('↓')
	} else {
		$('#list-docs-company').slideDown();
		$('#arrow-docs-company').html('↑')
	}

}

function showMoreAboutUs() {

	$('#moreaboutus-switcher').addClass('open');
	if ( $(window).width() > 991 ) $('#moreaboutus').css('display','flex');
	else  $('#moreaboutus').css('display','block');
	scrollToAnchor('moreaboutus-switcher');
}

function hideMoreAboutUs() {

	$('#moreaboutus-switcher').removeClass('open');
	$('#moreaboutus').hide();
}
