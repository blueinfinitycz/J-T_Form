$(document).ready(

	function() {

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
				if ( val.substring(val.length - 3, val.length) != " Kč" ) {
					$('#leasing-cena').val( $('#leasing-cena').val()+ ' Kč' );
				}
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
		"Intr": 0.02,
		"FV 12": 0.09,
		"FV 24": 0.07,
		"FV 36": 0.05,
		"FV 48": 0.04,
		"FV 60": 0.02,
		"INR (p.m.)": 0.0031,
		"Depr": 1,
	},
	"150000": {
		"Intr": 0.01,
		"FV 12": 0.09,
		"FV 24": 0.07,
		"FV 36": 0.05,
		"FV 48": 0.04,
		"FV 60": 0.02,
		"INR (p.m.)": 0.0031,
		"Depr": 2,
	},
}

function calculate() {
	var val = $('#leasing-cena').val();
	val = val.replace(/\sKč/g, '').trim();
	val = val.replace(/\s/g, '').trim();
	val = parseFloat(val);

	f = factors["25000"];
	if ( val > 150000 ) {
		f = factors["150000"];
	}

	var ol12 = (PMT2( f["Intr"]/12, 12, -val, f["FV 12"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);
	var ol24 = (PMT2( f["Intr"]/12, 24, -val, f["FV 24"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol36 = (PMT2( f["Intr"]/12, 36, -val, f["FV 36"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol48 = (PMT2( f["Intr"]/12, 48, -val, f["FV 48"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;
	var ol60 = (PMT2( f["Intr"]/12, 60, -val, f["FV 60"] * val, 0 ) + ( ( f["INR (p.m.)"] / 12 ) * val ) ).toFixed(0);;

	var ol12p = ( ol12 / val * 100 ).toFixed(2);
	var ol24p = ( ol24 / val * 100 ).toFixed(2);
	var ol36p = ( ol36 / val * 100 ).toFixed(2);
	var ol48p = ( ol48 / val * 100 ).toFixed(2);
	var ol60p = ( ol60 / val * 100 ).toFixed(2);

	$('#leasing-value-ol12').html(ol12);
	$('#leasing-value-ol12p').html(!isNaN(ol12p)?ol12p:0);
	$('#leasing-value-ol24').html(ol24);
	$('#leasing-value-ol24p').html(!isNaN(ol24p)?ol24p:0);
	$('#leasing-value-ol36').html(ol36);
	$('#leasing-value-ol36p').html(!isNaN(ol36p)?ol36p:0);
	$('#leasing-value-ol48').html(ol48);
	$('#leasing-value-ol48p').html(!isNaN(ol48p)?ol48p:0);
	$('#leasing-value-ol60').html(ol60);
	$('#leasing-value-ol60p').html(!isNaN(ol60p)?ol60p:0);

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
}

function processLeasing() {
	
	if ( validateLeasing() ) {
		$('#calc').slideUp();
		$('#form').slideDown( { complete: function () { scrollToAnchor('form') } } );
	}
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

	if ( $('#form-psc').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-psc";
		$('#form-psc-mesto-error').html('Vyplňte PSČ');
		$('#form-psc-mesto-error').fadeIn();
	}

	if ( $('#form-mesto').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-mesto";
		$('#form-psc-mesto-error').html('Vyplňte město');
		$('#form-psc-mesto-error').fadeIn();
	}

	if ( $('#form-telefon').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-telefon";
		$('#form-telefon-error').html('Vyplňte telefon');
		$('#form-telefon-error').fadeIn();
	}

	if ( $('#form-email').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-email";
		$('#form-email-error').html('Vyplňte email');
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

	if ( $('#form-pod-psc').val().trim() == "" ) {
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

	if ( $('#form-dod-email').val().trim() == "" ) {
		if ( !error_anchor ) error_anchor = "form-dod-email";
		$('#form-dod-email-error').html('Vyplňte email podnikání');
		$('#form-dod-email-error').fadeIn();
	}

	if ( error_anchor ) {
		scrollToAnchor(error_anchor);
		return false;
	}

	return true;

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
		$('#formOKmessage').html('Poslané. Ozveme se vám.');
		$('#formOKmessage').fadeIn();
		setTimeout( function() { 
			$('#contactModal').modal('hide');
			$('#formOKmessage').fadeOut();
			$('#formFailedmessage').fadeOut();
		}, 3000);
	} else sendingCalcFailed();
}

function sendingCalcFailed(httpReq,status,exception) {
	$('#formFailedmessage').html('Nastala chyba. Skuste to znovu pozdeji.');
	$('#formFailedmessage').fadeIn();
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

