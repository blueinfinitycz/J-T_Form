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
				$('#formmessage2').html(message);
				$('#formmessage2').slideDown();
			}
			setTimeout( function() { scrollToAnchor('loginform'); }, 500 );
		}

		var hash = window.location.hash;
		if ( hash ) scrollToAnchor(hash.replace("#",""));
	}
);

function openSegment( i ) {

	$('#segments').height( ($(window).outerHeight() * 1.60) - 50 );
	$.each( [1,2,3],
		function() {
			if ( this == i ) {
				$('.segment:nth-child('+this+')').addClass('open');
				$('.segment:nth-child('+this+')').css('flex','3');
				scrollToAnchor('segment-'+i);
			} else {
				//$('.segment:nth-child('+this+')').hide();
				$('.segment:nth-child('+this+')').css('flex','1');
				$('.segment:nth-child('+this+')').removeClass('open');
			}
		}
	);
	//scrollToAnchor('segments');
}

function closeSegment() {

	$('#segments').height( ($(window).outerHeight() * 1) - 50 );
	$.each( [1,2,3],
		function() {
			$('.segment:nth-child('+this+')').removeClass('open');
			//$('.segment:nth-child('+this+')').show();
			$('.segment:nth-child('+this+')').css('flex','1');
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

function toggleDocsInsurance() {
	if ( $('#list-docs-insurance').is(':visible') ) {
		$('#list-docs-insurance').slideUp();
		$('#arrow-docs-product').html('↓')
	} else {
		$('#list-docs-insurance').slideDown();
		$('#arrow-docs-insurance').html('↑')
	}

}

function toggleDocsProdukt() {
	if ( $('#list-docs-product').is(':visible') ) {
		$('#list-docs-product').slideUp();
		$('#arrow-docs-product').html('↓')
	} else {
		$('#list-docs-product').slideDown();
		$('#arrow-docs-product').html('↑')
	}

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

function scrollToAnchor(aid){
    var aTag = $("*[id='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top - 60 },'slow');
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
		url: 'https://jtleasing.jtfg.com/post/index.php',
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
	$('#formFailedmessage').html('Nastala chyba. Zkuste to znovu pozdeji.');
	$('#formFailedmessage').fadeIn();
}

function openForgotten() {
	
	$('#forgotten').slideDown();
	$('#login').slideUp();
}