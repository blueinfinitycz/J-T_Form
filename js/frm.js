$(document).ready(function(){

    const data = [
        {
            stepFrmId:1,
            frmElm:[
                {id:"jmeno_inpt",type:"text"},
                {id:"prijmeni_inpt",type:"text"},
                {id:"tel_inpt",type:"text"},
                {id:"email_inpt",type:"email"},
                {id:"info_chcx",type:"checkbox"}
                ]
        },
        {
            stepFrmId:2,
            frmElm:[
                {id:"nationality_select",type:"select"},
                {id:"cisloOP_inpt",type:"text"},
                {id:"platnostOP_inpt", type:"date"},
                {id:"rd_inpt", type:"text"},
                {id:"mistoNarozeni_inpt", type:"text"},
                {id:"addr_trv_ulice_inpt", type:"text"},
                {id:"addr_trv_psc_inpt",type:"text"},
                {id:"addr_trv_mesto_inpt", type:"text"},
                {id:"chckTrvalBydliste_chcx", type:"checkbox"},
                {id:"addr_kores_ulice_inpt", type:"text"},
                {id:"addr_kores_mesto_inpt", type:"text"},
                {id:"addr_kores_psc_inpt",type:"text"}
            ]
        },
        {
            stepFrmId:3,
            frmElm:[
                {id:"castka_inpt", type:"number"},
                {id:"splatky_inpt", type:"number"},
                {id:"dokumentace_inpt", type:"file"},
                {id:"vyseSplatky_inpt", type:"textarea"},
                {id:"registr_inpt", type:"textarea"},
                {id:"doklady_inpt", type:"textarea"},
                {id:"uzavreniPujcky_inpt", type:"textarea"}
            ]
        },
        {
            stepFrmId:4,
            frmElm: [
                {id:"domacnost_inpt", type:"select"},
                {id:"pocetOsob_inpt", type:"number"},
                {id:"pocetDeti_inpt", type:"number"},
                {id:"bydleni_inpt", type:"select"},
                {id:"hlavniZdrojPrijmu_inpt", type:"select"},
                {id:"mesicniPrijem_inpt", type:"number"},
                {id:"mesicniSplatky_inpt", type: "number"}
            ]
        }
    ]

    const obj = {};
          obj.data=data;
          obj.currentNumStep=1;

          const frm = new FrmLeasingFactory();
          const arr=[]
                data.map(item=> arr.push(frm.createFrmStep(item,frmStepGetDataObj)))

                for(let i=0; i<data.length;i++){
                    arr[i].displayContainer(i>0?false:true)
                }
            
                function frmStepGetDataObj(obj){
                    let objFce=undefined;
                    switch(obj.state) {
                        case "checkFrmSteps": objFce=checkFrmSteps;break;
                        case "showNextStep" : objFce=showNextStep;break;
                        case "sendData" : objFce=sendData;break;
                    }
                    objFce(obj)
                }
                
            function checkFrmSteps(obj){
                if(obj.status===0){
                   for(let i=obj.id;i<arr.length;i++) {
                        arr[i].displayContainer(false)
                    }
                }
            }

            function sendData(){
                const resultDataArr = []

                for(let i=0;i<arr.length;i++){
                    const gotDataArrObj = arr[i].checkValidityInputs();
                    // console.log("DATA: ",gotDataArrObj, Array.isArray(gotDataArrObj))
                    if(gotDataArrObj.length>0) {
                        resultDataArr.push(gotDataArrObj)
                    }
                }

                // console.log("DATA: ", JSON.stringify(gotDataArrObj))
                console.log("DATA: ",resultDataArr)
            }

            function showNextStep(obj){
                arr[obj.id].displayContainer(true)
            }

          function FrmLeasingFactory(){
              this.arrSteps=[];
              this.createFrmStep = (data,frmStepGetDataObj) => {
                    return new FrmStep(data,frmStepGetDataObj)
              }
            }

            function FrmStep(data,frmStepGetDataObj){
                this.dataContainer=data;
                (()=>{
                    let data = this.dataContainer.frmElm;
                    for(let i=0;i< data.length;i++){
                        let elm = $(`#stepContainer${this.dataContainer.stepFrmId} #${data[i].id}`)
                        if(elm.prop("tagName")==="INPUT" && elm.attr("type")===undefined) alert(`Chybí nastavený parametr input 'type' u elementu s ID: ${data[i].id}`)
                    }
                })() 
                // this.parentName = `#stepContainer${this.dataContainer.stepFrmId}`;
                this.containerId = this.dataContainer.stepFrmId;
                this.parent=$(`#stepContainer${this.dataContainer.stepFrmId}`)
                this.btNext= $(`#stepContainer${this.dataContainer.stepFrmId} #btNext`);
                this.errMsg = $(`#stepContainer${this.dataContainer.stepFrmId} #errMsg`)
                this.btSendData = $(`#stepContainer${this.dataContainer.stepFrmId} #btSendData`)
                this.chckOptional = false
                
                this.displayContainer=(state) => {state ? this.parent.show() : this.parent.hide()};
                this.checkboxDataArrFunctionality = (elm,state) => {
                    if( $(elm).attr("data-frmcheck")!==undefined){
                        const dataArray = JSON.parse( $(elm).attr("data-frmcheck"))
                        if(dataArray.prop==="toggle"){
                            const toggleElm = $(`#${dataArray.idFrmPart}`)
                            if(state){
                                toggleElm.hide();
                                this.chckOptional=false;
                             }else{
                                this.chckOptional=true;
                                toggleElm.show()
                             }
                        }
                    }
                }

                this.elmPath = this.dataContainer.frmElm.map(item=>"#"+item.id).join();
                this.showHideBtNext = (state)=>{state ? this.btNext.show() : this.btNext.hide()};
                this.showHideBtNext(0);
                this.checkValidityInputs = ()=> {
                        let val = true;
                        const dataToSendArr = [];
                        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                   
                        $(this.elmPath).each((index,elm)=> { 
                            const idName = $(elm).attr("id");
                            const elmValue = $(elm).val()
                            dataToSendArr.push({id:idName,value:elmValue});

                            if(((elm.type === "text" || elm.type ==="number") && elmValue.length<=0) && ($(elm).attr("data-frmcheck")===undefined && this.chckOptional===false) ) {
                                val=false;
                                this.errMsg[0].textContent= "Vyplňte prázdná pole formuláře";
                                return false;
                            }

                            if((elm.type === "tel" && elmValue.length<9) && ($(elm).attr("data-frmcheck")===undefined && this.chckOptional)) {
                                val=false;
                                this.errMsg[0].textContent = "Vyplňte celé telefonní číslo ";
                                return false;
                            }

                            if((elm.type === "email" && !emailPattern.test(elmValue)) && ($(elm).attr("data-frmcheck")===undefined && this.chckOptional===false)) {
                                val = false;
                                this.errMsg[0].textContent="Vyplňte správně celý svůj email";
                                    return false;
                            }

                            if((elm.type === "checkbox" && $(elm).is(":checked")===false) && ($(elm).attr("data-frmcheck")===undefined && this.chckOptional===false)) {
                                val=false;
                                this.errMsg[0].textContent="Zaškrtněte volbu";
                                return false;
                            }

                            if((elm.type === "select-one" && $(this).children("option:selected").val()==="0") && ($(elm).attr("data-frmcheck")===undefined && this.chckOptional===false)) {
                                console.log("CHECK")
                                val=false;
                                this.errMsg[0].textContent="Vyberte volbu ze select boxu";
                                return false;
                            }
                        })

                        if(val) {
                            this.errMsg[0].textContent="";
                            return dataToSendArr;
                        }else{
                            return []
                        }
                }

                this.checkFilledInputs = ()=>{
                    let count=0;
                    $(this.elmPath).each((idx,elm)=>{
                        
                        if(elm.type==="number" || elm.type==="tel") elm.value=elm.value.replace(/[^0-9.]/g,'')

                        if((elm.type==="text" || elm.type==="tel" || elm.type==="number" || elm.type==="email" || elm.type==="date" || elm.type==="file" || elm.type==="textarea") && elm.value.length>0){count++;}

                        if(elm.type==="checkbox" && elm.checked) {
                            count++;
                            this.checkboxDataArrFunctionality(elm,true);
                        }else{
                            this.checkboxDataArrFunctionality(elm,false);
                        }

                        if(elm.type==="select-one" && $(this).children("option:selected").val()!=="0"){count++;}

                        let showHideBtnext = 0;
                        // console.log("COUNT: ", count," : ","DELKA: ",this.dataContainer.frmElm.length)
                        console.log(`
                        COUNT: ${count}
                        DELKA: ${this.dataContainer.frmElm.length}
                        CONTAINER ID: ${this.containerId}
                        CHCKOPTIONAL:  ${this.chckOptional}
                        `)

                         count===(this.containerId === 2 && this.chckOptional===false ? 8 : this.dataContainer.frmElm.length ) ? showHideBtnext = 1 : showHideBtnext = 0;
                         
                        this.showHideBtNext(showHideBtnext)
                       frmStepGetDataObj({state:"checkFrmSteps",id:this.dataContainer.stepFrmId,status:showHideBtnext})
                    })
                }

                this.btNextClick = ()=>{
                    if(this.checkValidityInputs().length>0){
                        frmStepGetDataObj({state:"showNextStep",id:this.dataContainer.stepFrmId})
                    }
                }

                $(this.elmPath).keydown(this.checkFilledInputs)
                $(this.elmPath).change(this.checkFilledInputs)
                  this.btNext.click(this.btNextClick)
               if(this.btSendData[0]!==undefined) this.btSendData.click(()=>{
                    frmStepGetDataObj({state:"sendData"})
               })
            }
})