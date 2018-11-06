$(document).ready(
	function() {

		if ( $(window).width() > 991 ) {
			$('#segments').height( $(window).outerHeight() - 50 );
			$('#contact').height( $(window).outerHeight() - 50 );
		}

		$( window ).resize(function() {
  			if ( $(window).width() > 991 ) {
				  $('#segments').height( $(window).outerHeight() - 50 );
				  $('#contact').height( $(window).outerHeight() - 50 );
			}
			else {
				$('#segments').css('height', 'auto');
				$('#contact').css('height', 'auto');
			}
		});

		var getparam = function(name) { return  decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; }
		var what = getparam('form');
		var message = getparam("message");
		if ( what ) {
			if ( message ) {
				$('#formmessage').html(message);
				$('#formmessage').slideDown();
			}
			if ( what == 'password' ) {
				openForgotten();
			}
			setTimeout( function() { scrollToAnchor('loginform'); }, 500 );
		}
	}
);

function openSegment( i ) {

	$.each( [1,2,3],
		function() {
			if ( this == i ) {
				$('.segment:nth-child('+this+')').addClass('open');
			} else {
				$('.segment:nth-child('+this+')').hide();
			}
		}
	);
	scrollToAnchor('segments');
}

function closeSegment() {
	$.each( [1,2,3],
		function() {
			$('.segment:nth-child('+this+')').removeClass('open');
			$('.segment:nth-child('+this+')').show();
		}
	);	
	scrollToAnchor('segments');
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

function scrollToAnchor(aid){
    var aTag = $("*[id='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top - 66 },'slow');
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
	}
	$.ajax({
		type: "POST",
		url: 'http://jtleasing.jtfg.com/post',
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

