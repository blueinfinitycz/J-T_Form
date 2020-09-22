 const dataFrmPart1 = {
    jmeno_inpt: {type:"text"},
    prijmeni_inpt: {type:"text"},
    tel_inpt: {type:"tel"},
    email_inpt: {type:"email"},
    info_chcx: {type:"checkbox",status:"required"}
  }
  
  const dataFrmPart2 = {
    nationality_select: {type:"select"},
    cisloOP_inpt: {type:"text"},
    platnostOP_inpt: {type:"date"},
    rd_inpt: {type:"text"},
    mistoNarozeni_inpt: {type:"text"},
    addr_trv_ulice_inpt: {type:"text"},
    addr_trv_psc_inpt: {type:"text"},
    addr_trv_mesto_inpt: {type:"text"},
    chckTrvalBydliste_chcx: {type:"checkbox",status:"optionable"},
    addr_kores_ulice_inpt: {type:"text"},
    addr_kores_mesto_inpt: {type:"text"},
    addr_kores_psc_inpt: {type:"text"},
    addr_kores_psc_inpt: {type:"text"}
  }
  
  const dataFrmPart3 = {
    castka_inpt: {type:"text"},
    splatky_inpt: {type:"text"},
    dokumentace_inpt: {type:"file"},
    vyseSplatky_inpt: {type:"text"},
    registr_inpt: {type:"text"},
    doklady_inpt: {type:"text"},
    uzavreniPujcky_inpt: {type:"text"}
  }
  
  const dataFrmPart4 = {
    domacnost_inpt:{type:"select"},
    pocetOsob_inpt:{type:"number"},
    pocetDeti_inpt:{type:"number"},
    bydleni_inpt:{type:"select"},
    hlavniZdrojPrijmu_inpt:{type:"select"},
    mesicniPrijem_inpt: {type:"number"},
    mesicniSplatky_inpt: {type:"number"}
  }
  
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