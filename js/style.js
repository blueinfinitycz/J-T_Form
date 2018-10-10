$(document).ready(
	function() {

		if ( $(window).width() > 991 ) $('#segments').height( $(window).outerHeight() - 50 );

		$( window ).resize(function() {
  			if ( $(window).width() > 991 ) $('#segments').height( $(window).outerHeight() - 50 );
			  else $('#segments').css('height', 'auto');
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
    $('html,body').animate({scrollTop: aTag.offset().top - 50 },'slow');
	$('.navbar-collapse').collapse('hide');
    return false;
}