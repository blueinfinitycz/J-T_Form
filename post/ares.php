<?php

$ares_ico_fin = "";
$ares_dic_fin = "";
$ares_firma_fin = "";
$ares_ulice_fin = "";
$ares_cp1_fin   = "";
$ares_cp2_fin   = "";
$ares_mesto_fin = "";
$ares_psc_fin   = "";
$ares_stav_fin = "";
 
$ic = str_replace( " ", "", $_REQUEST["ico_ajax_send"]);
$file = @getPage("http://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=".$ic);

if($file)
  {
    $xml = @simplexml_load_string($file);
  }
 
if($xml) 
  {
    $ns = $xml->getDocNamespaces();
    $data = $xml->children($ns['are']);
    $el = $data->children($ns['D'])->VBAS;
     
    if (strval($el->ICO) == $ic) 
      {
        $ares_ico_fin = strval($el->ICO);
        $ares_dic_fin = strval($el->DIC);
        $ares_firma_fin = strval($el->OF);
        $ares_ulice_fin = strval($el->AA->NU);
        $ares_cp1_fin   = strval($el->AA->CD);
        $ares_cp2_fin   = strval($el->AA->CO);
        if($ares_cp2_fin != ""){ $ares_cp_fin = $ares_cp1_fin."/".$ares_cp2_fin; }else{ $ares_cp_fin = $ares_cp1_fin; }
        $ares_mesto_fin = strval($el->AA->N);
        $ares_psc_fin   = strval($el->AA->PSC);
        $ares_stav_fin = 1;

		    echo $ares_firma_fin;
      } 
    else
      {
        $ares_stav_fin  = 'IČO firmy nebylo nalezeno';
      } 
  }
else
  {
    $ares_stav_fin  = 'Databáze ARES není dostupná';
  }


function getPage($url) {
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_PROXY, "proxyapps.pa.jtfg.com:3128");

		//curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		$curl_scraped_page = curl_exec($ch);
		curl_close($ch);

    $pos = strpos( $curl_scraped_page, "<?xml" );
    $curl_scraped_page = substr( $curl_scraped_page, $pos ); 

		return $curl_scraped_page;
	}
