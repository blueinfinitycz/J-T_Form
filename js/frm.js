    /* spotrebitelskyUver */
 const dataFrmPart1 = {
    jmeno_inpt: {type:"text"},
    prijmeni_inpt: {type:"text"},
    tel_inpt: {type:"tel"},
    email_inpt: {type:"email"}
  }
  
  /* osobniUdaje */
  const dataFrmPart2 = {
    nationality_select: {type:"select"},
    opVydal_inpt: {type:"text"},
    cisloOp_inpt: {type:"text"},
    platnostOP_inpt: {type:"date"},
    rd_inpt: {type:"text"},
    mistoNarozeni_inpt: {type:"text"},
    addr_trv_ulice_inpt: {type:"text"},
    addr_trv_mesto_inpt: {type:"text"},
    addr_trv_psc_inpt: {type:"text"},
    chckTrvalBydliste_chcx: {type:"checkbox",status:"optionable"},
    addr_kores_ulice_inpt: {type:"text"},
    addr_kores_mesto_inpt: {type:"text"},
    addr_kores_psc_inpt: {type:"text"}
  }

   /* ZADOST O PUJCKU */
  const dataFrmPart3 = {
    kopieOP_data: {type:"file"},
    potvrzeniPrijmu_data: {type:"file"},
    zacatekUveru_inpt: {type:"text"},
    jsemPolitickyExponovanaOsoba_chcx: {type:"radio"},
    nejsemPolitickyExponovanaOsoba_chcx: {type:"radio"},
    uzavreniPujcky_chcx: {type:"checkbox"}
  }
  
  /* INFORMACE O VAS  */
  const dataFrmPart4 = {
    domacnost_inpt:{type:"select"},
    pocetOsob_inpt:{type:"number"},
    pocetDeti_inpt:{type:"number"},
    bydleni_inpt:{type:"select"},
    hlavniZdrojPrijmu_inpt:{type:"select"},
    mesicniPrijem_inpt: {type:"number"},
    mesicniSplatky_inpt: {type:"number"}
  }

    let trace=console.log.bind(console);
      let _urokovaSazba = 0.109;
      let _vyseCastkyValue =  document.getElementById("vyseCastkyValue");
          _vyseCastkyValue.textContent=4000;
      let _vyseCastkyValue_inpt =  document.getElementById("vyseCastkyValue_inpt");
      let _dobaSplaceniValue = document.getElementById("dobaSplaceniValue");
          _dobaSplaceniValue.textContent=12;
      let _dobaSplaceniValue_inpt = document.getElementById("dobaSplaceniValue_inpt");
          
      let _urokovaSazbaValue =  document.getElementById("urokovaSazbaValue");
      let _rpsnValue =  document.getElementById("rpsnValue");
      let _vyseSplatkyValue =  document.getElementById("vyseSplatkyValue");
     
      _urokovaSazbaValue.textContent=_urokovaSazba+ " %";
      _dobaSplaceniValue.textContent=12+ " měsíců";
      _rpsnValue.textContent=_urokovaSazba;

      _vyseCastkyValue_inpt.addEventListener("input",(e)=> {
        trace("vyse castky: ",e.currentTarget.value);
        _vyseCastkyValue.textContent=e.currentTarget.value;
        let _vyseSplatky = vyseSplatky();
       _vyseSplatkyValue.textContent = _vyseSplatky;

       _rpsn.vyseCastkyPujcky(_vyseCastkyValue_inpt.value); // pujcka
        _rpsn.vyseMesicniSplatky(_vyseSplatky); // mesicni splatka
        _rpsn.dobaSplaceni(_dobaSplaceniValue_inpt.value); // pocet mesicnich splatek
        _rpsnValue.textContent=_rpsn.calculate()*100;
        _vyseSplatkyValue.textContent = _vyseSplatky;
      });

      _dobaSplaceniValue_inpt.addEventListener("input", (e) => {

        _dobaSplaceniValue.textContent=e.currentTarget.value + " měsíců"
        let _vyseSplatky = vyseSplatky();

        _rpsn.vyseCastkyPujcky(_vyseCastkyValue_inpt.value); // pujcka
        _rpsn.vyseMesicniSplatky(_vyseSplatky); // mesicni splatka
        _rpsn.dobaSplaceni(_dobaSplaceniValue_inpt.value); // pocet mesicnich splatek
        _rpsnValue.textContent=_rpsn.calculate()*100;
        _vyseSplatkyValue.textContent = _vyseSplatky;

        }
      );

      function vyseSplatky(){
        return  _vyseCastkyValue_inpt.value * ((_urokovaSazba/12) / (1-Math.pow((1/(1+_urokovaSazba/12)) ,  _dobaSplaceniValue_inpt.value)));
      }

      function RPSN(){
        this.a=0;
        this.b=0;
        this.n=0;

        this.vyseCastkyPujcky = function($a){this.a=$a;}
        this.vyseMesicniSplatky = function($b){this.b=$b}
        this.dobaSplaceni = function($n){this.n=$n}
        this.getValue = function($in){
         let $a = this.a;
         let $b=this.b;
         let $n = this.n;
         
           return $a - ($b/Math.pow(1+$in, 1/12)*((Math.pow(1+$in, -1*$n/12)-1)/(Math.pow(1+$in, -1/12)-1)));
        }

        this.roundNumber =  function(num, scale){
            if(!(""+num).includes("e")){
              return +(Math.round(num+"e"+scale)+"e"+scale);
            }else{
              let arr = (""+num).split("e");
              let sig = "";

              if(+arr[1] + scale > 0){
                sig = "+";
              }
              return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
            }
        }

        this.calculate = function(){
         let $l = 0.000001;
         let $r = 2;
         let $cOld = -1;
         
         for ($i = 0; $i <= 50; $i++){
           let $c = ($l + $r)/2;
           let $lv = this.getValue($l);
           let $rv = this.getValue($r);
           let $cv = this.getValue($c);
           
          if ($lv < 0 && $cv < 0 && $rv > 0){
                  $l = $c;
             }else if ($lv < 0 && $cv > 0 && $rv > 0){
                       $r = $c;
             }else{
                throw new Error("Invalid interval");
             }
        
             if (this.roundNumber($c, 7) == this.roundNumber($cOld, 7)){
                 return this.roundNumber($c, 7);
                }else{
                   $cOld = $c;
                }
         }
         throw new Error("nelze vyresit")
        }
       }
       
       
       let _rpsn = new RPSN();

   function InputTelValidation(){
     this.init = elm=> elm.value=elm.value.replace(/[^0-9.]/g,'')
     this.validate = (elm)=> {
       let _status = elm.value.length===9
      return {status:_status,msg:_status ? "" : "Telefonní (mobilní) číslo musí obsahovat všech 9 čísel"} 
      }
   }
  
   function InputNumberValidation(){
     this.init = elm => isNaN(elm.value)
     this.validate = (elm,fce) => fce===undefined ? elm.value : fce(elm.value)
   }
  
   function InputTextValidation(){
     this.validate = elm=>elm.value.length>0
   }
  
   function InputEmailValidation(){
     const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     
     this.validate = (elm)=>{
       let _status=emailPattern.test(elm.value)
       return {status:_status,msg:_status ? "" : "Vyplňte prosím správně celý email"}
       }
   }
  
  const objValidation = {
    tel: new InputTelValidation(),
    number: new InputNumberValidation(),
    text:new InputTextValidation(),
    email: new InputEmailValidation(),
    }
  
  function FormPart(containerId,data,validationRules,showNextFrmStep,hideNextSteps,sendData){
    this.validation=validationRules;
    this.data=data;
    this.frmStepName = containerId;
    this.showNextFrmStep=showNextFrmStep;
    this.hideNextSteps=hideNextSteps;
    this.containerId=document.getElementById(containerId);
    this.btNext = this.containerId.querySelector(".btNext__container");
    this.errMsg = this.containerId.querySelector(".errMsg__container");
    this.btSendData = this.containerId.querySelector(".btSendData__container")
  
    this.click(this.btNext || this.btSendData,()=> {
      if(this.validate(this.data)){
        this.btNext ? showNextFrmStep(containerId) : sendData()
        this.errMessage("");
      }else{return null}
    }
    )
  
    this.hide(this.btNext ?? this.btSendData)
    this.addEventListenerToInpt()
  }
  
  FormPart.prototype.addEventListenerToInpt=function(){
     
    for(i in this.data) {
      let item = document.getElementById(i)
          item.addEventListener("input",(e)=>{
            const elm=e.target;
            this.hideNextSteps(this.frmStepName)
            if(elm.type==="number" || elm.type==="tel") this.validation[elm.type].init(elm)
              this.checkFilledAllFormPart() ? this.show(this.btNext ?? this.btSendData) : this.hide(this.btNext ?? this.btSendData)
          })
    }
  }

  FormPart.prototype.show=function(elm){elm.style=""}
  FormPart.prototype.hide=function(elm){elm.style.display="none";}
  FormPart.prototype.click=function(elm,fce){elm.addEventListener("click",(e)=>fce())}
  FormPart.prototype.getData=function(){
    let data={name:this.frmStepName}
    for(let i in this.data){
      let item = document.getElementById(i);
      data[i]=item.value
    }
    return data
  }
  FormPart.prototype.validate=function(data){
    let res=true;
      for(i in data) {
        let itemName = data[i]
        if(itemName.type==="email" || itemName.type==="tel") {
          let item = document.getElementById(i)
          let resObj = this.validation[itemName.type].validate(item)
          if(!resObj.status){
            this.errMessage(resObj.msg)
            res=false
            break;
          }
        }
      }
      return res
  }
  FormPart.prototype.checkFilledAllFormPart = function(){
      let idx = 0;
     for(i in this.data) {
       let item = document.getElementById(i);
       if(
         (item.type!=="checkbox" && item.value.length>0) ||
         (item.type==="checkbox" && item.checked && this.data[i].status==="required") ||
         (item.type==="checkbox" && this.data[i].status==="optionable")
         ){
        idx++;
       }

       if(item.type==="checkbox" && this.data[i].status==="optionable") {
         let frmPart = document.getElementById(item.dataset["togglepart"])
         item.checked ? this.hide(frmPart) : this.show(frmPart)
       }

  }
  // console.log(idx," : ", Object.keys(this.data).length)
  return (idx===Object.keys(this.data).length)
  }

  FormPart.prototype.errMessage=function(msg){this.errMsg.textContent=msg;}
  
  function Form(){
    let showNextFrmStep=function(frmName){
        for(let i=0;i<frmStepsArr.length;i++){
          let item = frmStepsArr[i]
            if(item.frmStepName===frmName){
                frmStepsArr[i+1].show(frmStepsArr[i+1].containerId)
                console.log("YPOS: ",frmStepsArr[i+1].containerId.clientPos)
                break;
             }
         }
    }
  
      let hideNextSteps=function(frmName){
        let startIndex=frmStepsArr.map(item =>item.frmStepName).indexOf(frmName)
        for(let i=startIndex+1;i<frmStepsArr.length;i++){
          let item = frmStepsArr[i]
              item.hide(item.containerId)
        }
      }
  
      let sendData = function(){
        let data = frmStepsArr.map(item => item.getData());
        console.log("DATA: ",data);

        fetch("nejaka_url")
        .then(res => res.json)
      }

    let frmStepsArr = this.frmStepsContainer.map((item,index) => {
      let _item = new item.template(item.containerId,item.data,item.validation,showNextFrmStep,hideNextSteps,sendData);
      index > 0 ? _item.hide(_item.containerId) : _item.show(_item.containerId)
      return _item;
    })
  }

  const _form = {
    frmStepsContainer:[
      {containerId:"spotrebitelskyUver",data:dataFrmPart1,validation:objValidation,template:FormPart},
      {containerId:"osobniUdaje",data:dataFrmPart2,validation:objValidation,template:FormPart},
      {containerId:"zadostOPujcku",data:dataFrmPart3,validation:objValidation,template:FormPart},
      {containerId:"informaceOVas",data:dataFrmPart4,validation:objValidation,template:FormPart},
      ],
    createForm:Form,
  }
  
  _form.createForm()