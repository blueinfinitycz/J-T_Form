$(document).ready(

	function() {

		$('#calcModal').on('hidden.bs.modal', function () {
			
			$('.modal-variant').prop( "checked", false );
			$('#leasing-cena').val('0 Kč');
			$('#leasing-predmet').val(1);
    		$('#leasing-predmet-desc').val('');
			$('#leasing-email').val('');
			$('#leasing-phone').val('');
			$('#leasing-ico').val('');
			$('#leasing-firma').val('');
		});

		$('#leasing-cena').focus(
			function() {
				var val = $('#leasing-cena').val();
				if ( val.substring(val.length - 3, val.length) == " Kč" ) {
					$('#leasing-cena').selectRange(0, val.length -3);
				} else $('#leasing-cena').selectRange(0, val.length);
			}
		);

		$('#leasing-cena').change(
			function() {
				var val = $('#leasing-cena').val();
				val = val.replace(/Kč/g, '').trim();
				val = val.replace(/\s/g, '').trim();
				/*
				if ( val.substring(val.length - 3, val.length) != " Kč" ) {
					$('#leasing-cena').val( $('#leasing-cena').val()+ ' Kč' );
				}
				*/
				//var string = numeral(parseFloat(val)).format('0.0[,]00 Kč');
				var string = accounting.formatMoney(parseFloat(val), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });
				$('#leasing-cena').val( string );

				validatePrice();
				calculate();
			}
		);

		$('#leasing-group-1').click(
			function() {
				$('.lg1').slideDown();
			}
		);

		$('#leasing-group-2').click(
			function() {
				$('.lg1').slideUp();
				$('.lg1 input').prop("checked", false);
			}
		);

		$('#leasing-ico').keyup(
			function() {
				getCompany(this);
			}
		);

		$('#leasing-ico').change(
			function() {
				getCompany(this);
			}
		);

		/* $('#leasing-predmet').change(
			function() {
				if ( $(this).val()=="6" ) {
					$('#leasing-predmet-desc-form-label').fadeIn();
					$('#leasing-predmet-desc-form-value').fadeIn();
					$('#leasing-predmet-desc').focus();
				} else {
					$('#leasing-predmet-desc-form-label').fadeOut();
					$('#leasing-predmet-desc-form-value').fadeOut();
					$('#leasing-predmet-desc').val('');
				}
	
				calculate();
			}
		); */

		autosize($('#leasing-predmet-desc'));
		autosize($('#leasing-email'));
		autosize($('#leasing-phone'));
		autosize($('#leasing-ico'));
		autosize($('#leasing-firma'));

		/*
		$('#leasing-interested').click(
			function() {
				if( $('#leasing-interested').is(':checked') ) {
					$('#leasing-submit').prop('disabled', false);
				} else {
					$('#leasing-submit').prop('disabled', true);
				}
			}
		);
		*/

		calculate();
	}
);

var factors = {
	"25000": {
		"Intr": 0.07,
		"FV 12": 0.09,
		"FV 24": 0.07,
		"FV 36": 0.05,
		"FV 48": 0.04,
		"FV 60": 0.02,
		"INR (p.m.)": 0.0,
		"Depr": 1,
	},
	"150000": {
		"Intr": 0.07,
		"FV 12": 0.09,
		"FV 24": 0.07,
		"FV 36": 0.05,
		"FV 48": 0.04,
		"FV 60": 0.02,
		"INR (p.m.)": 0.0,
		"Depr": 2,
	},
}

var devices = {
	"12": [0.28,0.20,0.20,0.20,0.35,0.20],
	"24": [0.22,0.15,0.15,0.15,0.28,0.15],
	"36": [0.15,0.05,0.05,0.05,0.17,0.05],
	"48": [0.08,0.0,0.0,0.0,0.08,0.0],
	"60": [0.0,0.0,0.0,0.0,0.0,0.0],
};

function calculate() {
	var val = $('#leasing-cena').val();
	var predmet = parseInt($('#leasing-predmet').val()) - 1;
	val = val.replace(/\sKč/g, '').trim();
	val = val.replace(/\s/g, '').trim();
	val = parseFloat(val);

	f = factors["25000"];
	if ( val > 150000 ) {
		f = factors["150000"];
	}

	var a = devices["12"][predmet] * val;
	var a = devices["24"][predmet] * val;
	var a = devices["36"][predmet] * val;
	var a = devices["48"][predmet] * val;
	var a = devices["60"][predmet] * val;

	var ol12 = (PMT2( f["Intr"]/12, 12, -val, devices["12"][predmet] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol24 = (PMT2( f["Intr"]/12, 24, -val, devices["24"][predmet] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol36 = (PMT2( f["Intr"]/12, 36, -val, devices["36"][predmet] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol48 = (PMT2( f["Intr"]/12, 48, -val, devices["48"][predmet] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol60 = (PMT2( f["Intr"]/12, 60, -val, devices["60"][predmet] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);

	ol12 = accounting.formatMoney(parseFloat(ol12), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });
	ol24 = accounting.formatMoney(parseFloat(ol24), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });
	ol36 = accounting.formatMoney(parseFloat(ol36), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });
	ol48 = accounting.formatMoney(parseFloat(ol48), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });
	ol60 = accounting.formatMoney(parseFloat(ol60), { symbol: "Kč",  format: "%v %s", decimal : ",", thousand: " ", precision : 0 });

	/*
	var ol12 = (PMT2( f["Intr"]/12, 12, -val, f["FV 12"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol24 = (PMT2( f["Intr"]/12, 24, -val, f["FV 24"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol36 = (PMT2( f["Intr"]/12, 36, -val, f["FV 36"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol48 = (PMT2( f["Intr"]/12, 48, -val, f["FV 48"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol60 = (PMT2( f["Intr"]/12, 60, -val, f["FV 60"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	*/

	/*
	var ol12p = ( ol12 / val * 100 ).toFixed(2);
	var ol24p = ( ol24 / val * 100 ).toFixed(2);
	var ol36p = ( ol36 / val * 100 ).toFixed(2);
	var ol48p = ( ol48 / val * 100 ).toFixed(2);
	var ol60p = ( ol60 / val * 100 ).toFixed(2);
	*/

	$('#leasing-value-ol12').html(ol12);
	//$('#leasing-value-ol12p').html(!isNaN(ol12p)?ol12p:0);
	$('#leasing-value-ol24').html(ol24);
	//$('#leasing-value-ol24p').html(!isNaN(ol24p)?ol24p:0);
	$('#leasing-value-ol36').html(ol36);
	//$('#leasing-value-ol36p').html(!isNaN(ol36p)?ol36p:0);
	$('#leasing-value-ol48').html(ol48);
	//$('#leasing-value-ol48p').html(!isNaN(ol48p)?ol48p:0);
	$('#leasing-value-ol60').html(ol60);
	//$('#leasing-value-ol60p').html(!isNaN(ol60p)?ol60p:0);

	/*
	var fl36 = (PMT2( f["Intr"]/12, 36, -val, 0, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var fl48 = (PMT2( f["Intr"]/12, 48, -val, 0, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var fl60 = (PMT2( f["Intr"]/12, 60, -val, 0, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;

	var fl36p = ( fl36 / val * 100 ).toFixed(2);
	var fl48p = ( fl48 / val * 100 ).toFixed(2);
	var fl60p = ( fl60 / val * 100 ).toFixed(2);

	$('#leasing-value-fl36').html(fl36);
	$('#leasing-value-fl36p').html(!isNaN(fl36p)?fl36p:0);
	$('#leasing-value-fl48').html(fl48);
	$('#leasing-value-fl48p').html(!isNaN(fl48p)?fl48p:0);
	$('#leasing-value-fl60').html(fl60);
	$('#leasing-value-fl60p').html(!isNaN(fl60p)?fl60p:0);
	*/
}

function processLeasing() {
	
	if ( validateLeasing() ) {
		$('#form-pod-predmet').val( $('#leasing-predmet').val().trim() ); 
		$('#calc').slideUp();
		$('#form').slideDown( { complete: function () { scrollToAnchor('form') } } );
	}
}

function validatePrice () {
	var val = $('#leasing-cena').val();
	val = val.replace(/\sKč/g, '').trim();
	val = val.replace(/Kč/g, '').trim();
	val = val.replace(/\s/g, '').trim();
	val = parseFloat(val);
	$('#leasing-cena-error').fadeOut();
	if ( isNaN(val) ) {
		$('#leasing-cena-error').html('Špatná cena');
		$('#leasing-cena-error').fadeIn();
	} else {
		if ( val < 25000 ) {
			$('#leasing-cena-error').html('Minimální cena je 25 000 Kč');
			$('#leasing-cena-error').fadeIn();
		}
	}
}

function validateModal() {

	$('.formFailedmessage').fadeOut();

	var error_anchor = undefined;
		
	if ( $('#leasing-cena').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "leasing-cena";
		$('#leasing-cena-error').html('Vyplňte cenu');
		$('#leasing-cena-error').fadeIn();
	} else {
		var val = $('#leasing-cena').val();
		val = val.replace(/\sKč/g, '').trim();
		val = val.replace(/Kč/g, '').trim();
		val = val.replace(/\s/g, '').trim();
		val = parseFloat(val);
		if ( isNaN(val) ) {
			if ( !error_anchor ) error_anchor = "leasing-cena";
			$('#leasing-cena-error').html('Špatná cena');
			$('#leasing-cena-error').fadeIn();
		} else {
			if ( val < 25000 ) {
				if ( !error_anchor ) error_anchor = "leasing-cena";
				$('#leasing-cena-error').html('Minimální cena je 25 000 Kč');
				$('#leasing-cena-error').fadeIn();
			}
		}
	}

	if ( $('#leasing-predmet').val().trim() == "6" && $('#leasing-predmet-desc').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "leasing-predmet";
		$('#leasing-predmet-error').html('Prosím upřesněte');
		$('#leasing-predmet-error').fadeIn();
	}

	if (
		!$('#leasing-leasing-ol-12').is(':checked') &&
		!$('#leasing-leasing-ol-24').is(':checked') &&
		!$('#leasing-leasing-ol-36').is(':checked') &&
		!$('#leasing-leasing-ol-48').is(':checked') &&
		!$('#leasing-leasing-ol-60').is(':checked')
	) {
		if ( !error_anchor ) error_anchor = "leasing";
		$('#leasing-leasing-error').html('Vyberte variantu');
		$('#leasing-leasing-error').fadeIn();

	}

	if ( $('#leasing-email').val().trim() == "" || !checkEmail($('#leasing-email').val().trim()) ) {
		if ( !error_anchor ) error_anchor = "leasing-email";
		$('#leasing-email-error').html('Vyplňte správně email');
		$('#leasing-email-error').fadeIn();
	}


	/*
	var group = $('input[name=leasing-group]:checked').val();
	var leasings = $('input[name=leasing-leasing]:checked');
	if ( leasings.length == 0 ) {
		if ( !error_anchor ) error_anchor = "leasing";
		$('#leasing-leasing-error').html('Vyberte leasing');
		$('#leasing-leasing-error').fadeIn();
	}
	*/

	if ( error_anchor ) {
		scrollToAnchor(error_anchor);
		return false;
	}

	return true;
}

function validateLeasing() {

	$('.formFailedmessage').fadeOut();

	var error_anchor = undefined;
	
	if ( $('#leasing-predmet').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "leasing-predmet";
		$('#leasing-predmet-error').html('Vyplňte předmět');
		$('#leasing-predmet-error').fadeIn();
	}
	
	if ( $('#leasing-cena').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "leasing-cena";
		$('#leasing-cena-error').html('Vyplňte cenu');
		$('#leasing-cena-error').fadeIn();
	} else {
		var val = $('#leasing-cena').val();
		val = val.replace(/\sKč/g, '').trim();
		val = val.replace(/\s/g, '').trim();
		val = parseFloat(val);
		if ( isNaN(val) ) {
			if ( !error_anchor ) error_anchor = "leasing-cena";
			$('#leasing-cena-error').html('Špatná cena');
			$('#leasing-cena-error').fadeIn();
		} else {
			if ( val < 25000 ) {
				if ( !error_anchor ) error_anchor = "leasing-cena";
				$('#leasing-cena-error').html('Minimálna cena je 25 000 Kč');
				$('#leasing-cena-error').fadeIn();
			}
		}
	}

	var group = $('input[name=leasing-group]:checked').val();
	var leasings = $('input[name=leasing-leasing]:checked');
	if ( leasings.length == 0 ) {
		if ( !error_anchor ) error_anchor = "leasing";
		$('#leasing-leasing-error').html('Vyberte leasing');
		$('#leasing-leasing-error').fadeIn();
	}

	if ( error_anchor ) {
		scrollToAnchor(error_anchor);
		return false;
	}

	return true;
}

function validateForm() {

	$('.formFailedmessage').fadeOut();

	var error_anchor = undefined;
	
	if ( $('#form-jmeno').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-jmeno";
		$('#form-jmeno-error').html('Vyplňte jméno');
		$('#form-jmeno-error').fadeIn();
	}

	if ( $('#form-adresa').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-adresa";
		$('#form-adresa-error').html('Vyplňte adresu');
		$('#form-adresa-error').fadeIn();
	}

	if ( $('#form-psc').val().trim() == "" || !checkPsc($('#form-psc').val().trim()) ) {
		if ( !error_anchor ) error_anchor = "form-psc";
		$('#form-psc-mesto-error').html('Vyplňte správně PSČ');
		$('#form-psc-mesto-error').fadeIn();
	}

	if ( $('#form-mesto').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-mesto";
		$('#form-psc-mesto-error').html('Vyplňte město');
		$('#form-psc-mesto-error').fadeIn();
	}

	if ( $('#form-telefon').val().trim() == "" || !checkPhoneNumber($('#form-telefon').val().trim()) ) {
		if ( !error_anchor ) error_anchor = "form-telefon";
		$('#form-telefon-error').html('Vyplňte správně telefon');
		$('#form-telefon-error').fadeIn();
	}

	if ( $('#form-email').val().trim() == "" || !checkEmail($('#form-email').val().trim())) {
		if ( !error_anchor ) error_anchor = "form-email";
		$('#form-email-error').html('Vyplňte správně email');
		$('#form-email-error').fadeIn();
	}

	if ( $('#form-ic').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-ic";
		$('#form-ic-dic-error').html('Vyplňte IČ');
		$('#form-ic-dic-error').fadeIn();
	}

	if ( $('#form-dic').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-dic";
		$('#form-ic-dic-error').html('Vyplňte DIČ');
		$('#form-ic-dic-error').fadeIn();
	}

	if ( $('#form-ucet').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-ucet";
		$('#form-ucet-banka-error').html('Vyplňte účet');
		$('#form-ucet-banka-error').fadeIn();
	}

	if ( $('#form-banka').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-banka";
		$('#form-ucet-banka-error').html('Vyplňte kód banky');
		$('#form-ucet-banka-error').fadeIn();
	}

	/*
	if ( $('#form-storgan').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-storgan";
		$('#form-storgan-error').html('Vyplňte statutárni orgán');
		$('#form-storgan-error').fadeIn();
	}

	if ( $('#form-storgannar').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-storgannar";
		$('#form-storgannar-error').html('Vyplňte datum narození statutárniho orgánu');
		$('#form-storgannar-error').fadeIn();
	}
	*/

	if ( $('#form-predpod').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-predpod";
		$('#form-predpod-error').html('Vyplňte predmět podnikáni');
		$('#form-predpod-error').fadeIn();
	}

	if ( $('#form-datpod').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-datpod";
		$('#form-datpod-error').html('Vyplňte datum začátku podnikání');
		$('#form-datpod-error').fadeIn();
	}

	if ( $('#form-pod-predmet').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-pod-predmet";
		$('#form-pod-predmet-error').html('Vyplňte predmět lesingu');
		$('#form-pod-predmet-error').fadeIn();
	}

	if ( $('#form-pod-adresa').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-pod-adresa";
		$('#form-pod-adresa-error').html('Vyplňte adresu');
		$('#form-pod-adresa-error').fadeIn();
	}

	if ( $('#form-pod-psc').val().trim() == ""  || !checkPsc($('#form-pod-psc').val().trim()) ) {
		if ( !error_anchor ) error_anchor = "form-pod-psc";
		$('#form-pod-psc-mesto-error').html('Vyplňte PSČ');
		$('#form-pod-psc-mesto-error').fadeIn();
	}

	if ( $('#form-pod-mesto').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-pod-mesto";
		$('#form-pod-psc-mesto-error').html('Vyplňte město podnikání');
		$('#form-pod-psc-mesto-error').fadeIn();
	}

	if ( $('#form-dod-jmeno').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-dod-jmeno";
		$('#form-dod-jmeno-error').html('Vyplňte jméno dodavatele');
		$('#form-dod-jmeno-error').fadeIn();
	}

	if ( $('#form-dod-adresa').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-dod-adresa";
		$('#form-dod-adresa-error').html('Vyplňte adresu dodávatele');
		$('#form-dod-adresa-error').fadeIn();
	}

	/*
	if ( $('#form-dod-telefon').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-dod-telefon";
		$('#form-dod-telefon-error').html('Vyplňte telefon dodávatele);
		$('#form-dod-telefon-error').fadeIn();
	}
	*/

	if ( $('#form-dod-email').val().trim() == ""  || !checkEmail($('#form-dod-email').val().trim())) {
		if ( !error_anchor ) error_anchor = "form-dod-email";
		$('#form-dod-email-error').html('Vyplňte správně email podnikání');
		$('#form-dod-email-error').fadeIn();
	}

	if ( error_anchor ) {
		scrollToAnchor(error_anchor);
		return false;
	}

	return true;

}

function sendCalcFormModal() {


	$('#formOKmessage').fadeOut();
	$('#formFailedmessage').fadeOut();

	if ( !validateModal() ) return;

	rotatetimeout = window.setTimeout(rotate, 100);
	$('#modal-button').hide();
	$('#modal-progress').show();

	var splatky = [];
	if ( $('#leasing-leasing-ol-12').is(':checked') ) splatky.push( "12" );
	if ( $('#leasing-leasing-ol-24').is(':checked') ) splatky.push( "24" );
	if ( $('#leasing-leasing-ol-36').is(':checked') ) splatky.push( "36" );
	if ( $('#leasing-leasing-ol-48').is(':checked') ) splatky.push( "48" );
	if ( $('#leasing-leasing-ol-60').is(':checked') ) splatky.push( "60" );

	data = {
		"form-predmet": $("#leasing-predmet-text").val(),
		"form-cena": $('#leasing-cena').val(),
		"form-splatky": splatky.join(', '),
		"form-telefon": $('#leasing-phone').val(),
		"form-email": $('#leasing-email').val(),
		"form-ico": $('#leasing-ico').val(),
		"form-firma": $('#leasing-firma').val(),
		"form-predmet-desc": $('#leasing-predmet-desc').val(),
	}

	$.ajax({
		type: "POST",
		url: 'https://jtleasing.jtfg.com/post/calc.php',
		data: data,
		dataType: 'jsonp',
		jsonp: false,
    	jsonpCallback: "myJsonMethod",
    	success : sendingCalcOK,
    	error : sendingCalcFailed,
	});
}

function sendCalcForm() {
	$('#formOKmessage').fadeOut();
	$('#formFailedmessage').fadeOut();

	if ( !validateForm() ) return;

	data = {
		"form-jmeno": $('#form-jmeno').val(),
		"form-adresa": $('#form-adresa').val(),
		"form-psc": $('#form-psc').val(),
		"form-mesto": $('#form-mesto').val(),
		"form-telefon": $('#form-telefon').val(),
		"form-email": $('#form-email').val(),
		"form-ic": $('#form-ic').val(),
		"form-dic": $('#form-dic').val(),
		"form-ucet": $('#form-ucet').val(),
		"form-banka": $('#form-banka').val(),
		"form-storgan": $('#form-storgan').val(),
		"form-storgannar": $('#form-storgannar').val(),
		"form-predpod": $('#form-predpod').val(),
		"form-datpod": $('#form-datpod').val(),

		"form-pod-predmet": $('#form-pod-predmet').val(),
		"form-pod-adresa": $('#form-pod-adresa').val(),
		"form-pod-psc": $('#form-pod-psc').val(),
		"form-pod-mesto": $('#form-pod-mesto').val(),

		"form-dod-jmeno": $('#form-dod-jmeno').val(),
		"form-dod-adresa": $('#form-dod-adresa').val(),
		"form-dod-telefon": $('#form-dod-telefon').val(),
		"form-dod-email": $('#form-dod-email').val(),

	}
	$.ajax({
		type: "POST",
		url: 'https://jtleasing.jtfg.com/post/calc.php',
		data: data,
		dataType: 'jsonp',
		jsonp: false,
    	jsonpCallback: "myJsonMethod",
    	success : sendingCalcOK,
    	error : sendingCalcFailed,
	});
}

function sendingCalcOK( data ) {

	if ( data.error == '' ) {
		$('#leasingOKmessage').html('Vaše žádost o nabídku byla odeslána. Děkujeme, ozveme se Vám.');
		$('#leasingOKmessage').fadeIn();
		setTimeout( function() { 
			$('#calcModal').modal('hide');
			$('#leasingOKmessage').fadeOut();
			$('#leasingFailedmessage').fadeOut();
		}, 3000);
		clearTimeout(rotatetimeout);
		$('#modal-button').show();
		$('#modal-progress').hide();
	} else {
		sendingCalcFailed();
		$('#modal-button').show();
		$('#modal-progress').hide();
	}
}

function sendingCalcFailed(httpReq,status,exception) {
	$('#leasingFailedmessage').html('Nastala chyba. Skuste to znovu pozdeji.');
	$('#leasingFailedmessage').fadeIn();
	clearTimeout(rotatetimeout);
}


function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}

function PMT2(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv)/nperiod;

    var pvif = Math.pow(1 + rate, nperiod);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + rate);
    };

    return pmt;
}

function checkPsc(value) {
	return checkRegexRule(value, /^[\d]{5}$/);
}

function checkPhoneNumber(value) {
	return checkRegexRule(value, /^[+]?[0-9 ]{7,20}$/);
}

function checkEmail(value) {
	return checkRegexRule(value, /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
}

function checkRegexRule(value, regex) {
	var regexRule = new RegExp(regex);
	if (regexRule.test(value)) {
		return true; // ok
	}
	return false; // not ok
}

function getCompany( el ) {
	var val = $(el).val();
	$.get(
		"https://jtleasing.jtfg.com/post/ares.php?ico_ajax_send="+val,
		function(data) {
			$('#leasing-firma').val(data);
			autosize.update($('#leasing-firma'));
		}
	);
}

var rotatecount = 0;
var rotatetimeout;
function rotate() {
	var elem5 = document.getElementById('div5');
	elem5.style.MozTransform = 'scale(0.5) rotate('+rotatecount+'deg)';
	elem5.style.WebkitTransform = 'scale(0.5) rotate('+rotatecount+'deg)';
	if (rotatecount==360) { rotatecount = 0 }
	rotatecount+=45;
	rotatetimeout = window.setTimeout(rotate, 100);
}

function predmetSelected( id ) {

	switch ( id ) {
		case 1:
		$("#leasing-predmet-text").val('Servery a storage');
		break;
		case 2:
		$("#leasing-predmet-text").val('Koncová zařízení (notebooky, PC, monitory)');
		break;
		case 3:
		$("#leasing-predmet-text").val('Tiskárny');
		break;
		case 4:
		$("#leasing-predmet-text").val('Mobily a tablety');
		break;
		case 5:
		$("#leasing-predmet-text").val('Síťové prvky');
		break;
		case 6:
		$("#leasing-predmet-text").val('Síťové prvky');
		break;
	}
	$('.predmetselect.active').removeClass('active');
	$('.predmetselect-'+id).addClass('active');
	$("#leasing-predmet").val(id);
	if ( id=="6" ) {
		$('#leasing-predmet-desc-form').fadeIn();
		$('#leasing-predmet-desc').focus();
	} else {
		$('#leasing-predmet-desc-form').fadeOut();
		$('#leasing-predmet-desc').val('');
	}

	calculate();
}
