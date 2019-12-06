$(document).ready(
	function() {

		//if ( $(window).width() > 991 ) {
		//	$('#segments').height( window.innerHeight  * 1.0 );
			$('#contact').height( window.innerHeight - 50 );
		//}


		$( window ).resize(function() {
  			if ( $(window).width() > 991 ) {
				//$('#segments').height( window.innerHeight  * 1.0 );
				$('#contact').height( window.innerHeight - 50 );
			}
			else {
				//$('#segments').css('height', 'auto');
				$('#contact').css('height', 'auto');
			}
		});

		$(window).scroll(function (event) {
    		var scroll = $(window).scrollTop();
			var opacity = (scroll - 200)/300;
			if (opacity<0) opacity = 0;
			if (opacity>1) opacity = 1;
			$('nav.navbar').css('background','rgba(148, 121, 240,'+opacity+')');

			
			var finprod = $('#finprod').offset().top;
			var zakpod = $('#zakpod').offset().top;
			var advant = $('#advant').offset().top;
			var aboutus = $('#aboutus').offset().top;
			var contact = $('#contact').offset().top;
			if ( scroll > ( finprod - 50 ) /* && scroll < aboutus - 150 */ ) {
				$('button.fixed').show();
			} else {
				$('button.fixed').hide();
			}

			if ( scroll > ( contact - 50 ) ) {
				dataLayer.push({ "event": "Kontakt"});
				gtag_report_event("Kontakt");
			} else {
				if ( scroll > ( aboutus - 50 ) ) {
					dataLayer.push({ "event": "O společnosti"});
					gtag_report_event("O společnosti");
				} else {
					if ( scroll > ( advant - 50 ) ) {
						dataLayer.push({ "event": "Srozumitelnost"});
						gtag_report_event("Srozumitelnost");
					} else {
						if ( scroll > ( zakpod - 50 ) ) {
							dataLayer.push({ "event": "Flexibilita"});
							gtag_report_event("Flexibilita");
						} else {
							if ( scroll > ( finprod - 50 ) ) {
								dataLayer.push({ "event": "Financujeme"});
								gtag_report_event("Financujeme");
							}
						}
					}
				}
			}
    		// Do something
		});

		$(".owl-carousel").owlCarousel({items: 1, dots: true, nav: false, autoplay: true, loop: true, autoplayTimeout: 3000, slideSpeed:1500, paginationSpeed: 1500, smartSpeed: 1500});
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
		"source": "medvet"
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
