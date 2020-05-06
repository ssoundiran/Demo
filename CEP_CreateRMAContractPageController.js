({
    doInit: function(component, event, helper) {

        console.log("States Value: " + component.get("v.statesList"));
        helper.onChangeCountryHelper(component,event,helper);
        var parRecId = component.get("v.recordId");
        var getShipDetails = component.get("c.getShippingAddress");
        getShipDetails.setParams({ parRMAId: parRecId });
        getShipDetails.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rec = response.getReturnValue();
                //console.log("Distributor Name: "+rec[0].CEP_Registration_ID__r['Account']['Distributor_Name__c']);
                //console.log("Distributor Name: "+rec[1].CEP_Registration_ID__r['Account']['Distributor_Name__c']);
                var rmaRecord = rec[0];
                
                if(!rmaRecord.CEP_Manual_Verification_Required__c){
                    console.log('shipping details**** ' + rmaRecord);
                    console.log('shipping details**** ' + JSON.stringify(rmaRecord));
                    var  slicedShippingStreet='';
                    if((rmaRecord.CEP_Registration_ID__r['Account']['ShippingStreet'])!=undefined)
                    slicedShippingStreet = (rmaRecord.CEP_Registration_ID__r['Account']['ShippingStreet']).slice(0,100);
             
                    if(rmaRecord.hasOwnProperty('CEP_Registration_ID__c')){
                        component.set("v.firstName", rmaRecord.CEP_Registration_ID__r['Account']['CEP_First_Name__c']);
                        component.set("v.lastName", rmaRecord.CEP_Registration_ID__r['Account']['CEP_Last_Name__c']);
                        component.set("v.shipStreet", slicedShippingStreet);
                        component.set("v.shipCity", rmaRecord.CEP_Registration_ID__r['Account']['ShippingCity']);
                        component.set("v.shipState", rmaRecord.CEP_Registration_ID__r['Account']['ShippingState']);
                        component.set("v.shipCountry", rmaRecord.CEP_Registration_ID__r['CEP_Country__c']);
                        component.set("v.shipPinCode", rmaRecord.CEP_Registration_ID__r['Account']['ShippingPostalCode']);
                        component.set("v.shipPhone", rmaRecord.CEP_Registration_ID__r['Account']['CEP_Phone_Number__c']);
                        component.set("v.ShippingAddress2", rmaRecord['Shipping_Address_2__c']);
                        component.set("v.shipCompany",rmaRecord['Distributor_Name__c']);
                        component.set("v.parAssetId",rmaRecord.CEP_Registration_ID__c);
                        var CEPRAItem = rmaRecord['CEP_RAItem__c'];
                        /*if(CEPRAItem!='Main Unit'){
                    		component.set("v.RMAItemType", true);
                        }*/
                        
                    }
                    else{
                        $A.get("e.force:closeQuickAction").fire();
                        var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                message: 'The RMA does not have an Asset Attached. Manual RMA is not possible.',
                                duration: '5000',
                                key: 'info_alt',
                                type: 'error',
                                mode: 'sticky'
                        });
                        toastEvent.fire();   
                    }
                }
                else{
                    $A.get("e.force:closeQuickAction").fire();
                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'Verification Error',
                            message: 'This RMA has been queued for verification. It will not be exported / processed until the customer care team reviews and approves the request.',
                            duration: '5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'sticky'
                    });
                    toastEvent.fire();    
                }
            }
        });
        $A.enqueueAction(getShipDetails);
        
        var parRecId = component.get("v.recordId");
        var getDistributorName=component.get("c.getDistributorShippingAddress");
        getDistributorName.setParams({ parRMAId: parRecId });
        getDistributorName.setCallback(this, function(response) {
            var state = response.getState();
            console.log('state**** ' + state);
            if (state === "SUCCESS") {
                if(response.getReturnValue().length > 1){
                    component.set("v.distributorName",response.getReturnValue());
                    component.set("v.showDistName", true);
                }
            }
        });
		 $A.enqueueAction(getDistributorName);
        
        console.log('contract parent record id Init**** ' + parRecId);
        var getContracts = component.get("c.RMAretrieveContracts");
        getContracts.setParams({ parentRectId: parRecId, source:'CEP'});
        getContracts.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.showSpinner", false);
                if (response.getReturnValue().length > 0) {
                    console.log('response**** ' + response.getReturnValue());
                    component.set("v.entConfList", response.getReturnValue());
                    component.set("v.showcontractInfo", true);
                    component.set("v.showNewCont", true);
                } else {
                    console.log('inside else**** ');
                    component.set("v.nocontract", true);
                }
            }
        });
        $A.enqueueAction(getContracts);

        var getAutoAplyCont = component.get("c.getAutoApplyCont");
        console.log('getAutoAplyCont>>>'+getAutoAplyCont);
        getAutoAplyCont.setParams({ parRMAId: parRecId });
        getAutoAplyCont.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.showSpinner", false);
                if (response.getReturnValue().length > 0) {
                    component.set("v.autoApplycontracts", response.getReturnValue());
                    component.set("v.showcontractInfo", true);
                    component.set("v.showAutoCont", true);
                } else {
                    //component.set("v.nocontract", true);
                }
            }
        });
        $A.enqueueAction(getAutoAplyCont);

        var getavailablecontracts = component.get("c.RMAgetAvailabeContarcts");
        getavailablecontracts.setParams({ parRMAId: parRecId });
        getavailablecontracts.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.showSpinner", false);
                if (response.getReturnValue().length > 0) {
                    console.log('inside avilable contracts*** ' + JSON.stringify(response.getReturnValue()));
                    component.set("v.showcontractInfo", false);
                    component.set("v.showAutoCont", false);
                    component.set("v.contractExists", true);
                } else {
                    //component.set("v.nocontract", true);
                }
            }
        });
        $A.enqueueAction(getavailablecontracts);
    },
    onChangeCountry: function(component, event, helper) {
        helper.onChangeCountryHelper(component,event,helper);
    },
    onChangeDealer: function(component, event, helper){
        //alert(component.get("v.selectedDealer"));
        var dealerName=component.get("v.selectedDealer");
        var getDistributorByName=component.get("c.getDistributorShippingAddressByName");
        getDistributorByName.setParams({ dealerName: dealerName });
        getDistributorByName.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rec = response.getReturnValue();
                var distaddress = rec[0];
                console.log('distaddress**** ' + distaddress);
                console.log('distaddress ' + JSON.stringify(distaddress));
                component.set("v.firstName", distaddress['Ship_to_First_Name__c']);
                component.set("v.lastName",distaddress['Ship_to_Last_Name__c'] );
                component.set("v.shipStreet",distaddress['Address1__c']);
                component.set("v.ShippingAddress2",distaddress['Address2__c']);
                component.set("v.shipCity", distaddress['City__c']);
                component.set("v.shipState", distaddress['State__c']);
                component.set("v.shipCountry",distaddress['Country__c']);
                component.set("v.shipPinCode", distaddress['Postcode__c']);
                component.set("v.shipPhone", distaddress['Phone__c']);
                component.set("v.shipCompany",distaddress['Name']);
            }
        });
        $A.enqueueAction(getDistributorByName);       
    },
    contractSave: function(component, event, helper) {
        //alert(component.get("v.ShippingAddress2"));
        if (component.get("v.selectedEntConfigId") === '' && component.get("v.selectedAutoApply") === '') {
            component.set("v.openmodal", true);
        } else if (component.get("v.shipStreet") == '' || component.get("v.shipStreet") == undefined ||
            component.get("v.shipCity") == '' || component.get("v.shipCity") == undefined ||
            component.get("v.shipCountry") == '' || component.get("v.shipCountry") == undefined ||
                component.get("v.shipPinCode") == '' || component.get("v.shipPinCode") == undefined ||
                component.get('v.firstName') == '' ||  component.get('v.lastName') == '' ||
                component.get('v.shipState') == '' || component.get('v.shipState') == undefined ||
                component.get('v.shipPhone') == '' || component.get('v.shipPhone') == undefined ){
            component.set("v.addressErrorModal", true);
        } else if (component.get("v.selectedEntConfigId") === '' && component.get("v.selectedAutoApply") !== '') {
            component.set("v.showSpinner", true);
            var UpdatecontractRMA = component.get("c.RMAinsertContract");
            UpdatecontractRMA.setParams({
                parRMAId: component.get("v.recordId"),
                EntConfigId: component.get("v.selectedAutoApply"),
                FirstName : component.get("v.firstName"),
                LastName : component.get("v.lastName"),
                shipStreet: component.get("v.shipStreet"),
                shipCity: component.get("v.shipCity"),
                shipState: component.get("v.shipState"),
                shipCountry: component.get("v.shipCountry"),
                shipCode : component.get("v.shipPinCode"),
                shipPhone : component.get("v.shipPhone"),
                shipCompany: component.get("v.shipCompany"),
                addressType: component.get("v.addressType"),
                address2:component.get("v.ShippingAddress2")
            });
            UpdatecontractRMA.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('reponse from backend**** ' + response.getReturnValue());
                    /*if (response.getReturnValue() === 'updated') {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: 'Success',
                            message: 'The contract has been created!',
                            duration: '5000',
                            key: 'info_alt',
                            type: 'success',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();
                    }*/
                    component.set("v.showSpinner", false);
					var returnStr = response.getReturnValue();
                    console.log('returnStr'+returnStr.substring(0, 3));
					if (returnStr.substring(0, 3) === '800') {
                        console.log('inside if^^^');
                        var getRMAContract = component.get("c.getContractRecord");
                        getRMAContract.setParams({ RMAContractId: returnStr });
                        getRMAContract.setCallback(this, function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                                var RMAcontract = response.getReturnValue();
                                $A.get('e.force:refreshView').fire();
                                console.log('contractRecord1^^^ ' + JSON.stringify(RMAcontract));
                                if ($A.util.isObject(RMAcontract)) {
                                    if (RMAcontract.CEP_Entitlement_Configuration__r.CEP_Charge_status__c === 'Charge') {
                                        component.set("v.showSpinner", false);
                                        component.set("v.contractId", returnStr);
                                    } else {
                                        var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({
                                            title: 'Success',
                                            message: 'The contract has been created!',
                                            duration: '5000',
                                            key: 'info_alt',
                                            type: 'success',
                                            mode: 'dismissible'
                                        });
                                        toastEvent.fire();
                                        $A.get("e.force:closeQuickAction").fire();
                                        $A.get('e.force:refreshView').fire();
                                    }
                                }
                            }
                        });
                        $A.enqueueAction(getRMAContract);
                    } else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: 'Error',
                            message: 'This RMA has been queued for verification. It will not be exported / processed until the customer care team reviews and approves the request. ',
                            duration: '1000',
                            key: 'info_alt',
                            type: 'Error',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();

                    }
                }
            });
            $A.enqueueAction(UpdatecontractRMA);
        } else if (component.get("v.selectedEntConfigId") !== '' && component.get("v.selectedAutoApply") === '') {
           // alert(component.get("v.ShippingAddress2"));
            component.set("v.showSpinner", true);
            var saveCont = component.get("c.RMAinsertContract");
            saveCont.setParams({ parRMAId : component.get("v.recordId"), 
                EntConfigId: component.get("v.selectedEntConfigId"),
                                FirstName : component.get("v.firstName"),
                                LastName : component.get("v.lastName"),
                shipStreet: component.get("v.shipStreet"),
                shipCity: component.get("v.shipCity"),
                shipState: component.get("v.shipState"),
                shipCountry: component.get("v.shipCountry"),
                                shipCode : component.get("v.shipPinCode"),
                                shipPhone : component.get("v.shipPhone"),
                                shipCompany: component.get("v.shipCompany"),
                                addressType: component.get("v.addressType"),
                                address2:component.get("v.ShippingAddress2"),
            });
            saveCont.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.showSpinner", false);
                    var returnStr = response.getReturnValue();
                    console.log('inside success*** ' + JSON.stringify(returnStr));
                    if (returnStr.substring(0, 3) === '800') {
                        var getRMAContract = component.get("c.getContractRecord");
                        getRMAContract.setParams({ RMAContractId: returnStr });
                        getRMAContract.setCallback(this, function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                                var RMAcontract = response.getReturnValue();
                                $A.get('e.force:refreshView').fire();
                                console.log('contractRecord^^^ ' + JSON.stringify(RMAcontract));
                                if ($A.util.isObject(RMAcontract)) {
                                    if (RMAcontract.CEP_Entitlement_Configuration__r.CEP_Charge_status__c === 'Charge') {
                                        component.set("v.showSpinner", false);
                                        component.set("v.contractId", returnStr);
                                    } else {
                                        var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({
                                            title: 'Success',
                                            message: 'The contract has been created!',
                                            duration: '5000',
                                            key: 'info_alt',
                                            type: 'success',
                                            mode: 'dismissible'
                                        });
                                        toastEvent.fire();
                                        $A.get("e.force:closeQuickAction").fire();
                                        $A.get('e.force:refreshView').fire();
                                    }
                                }
                            }
                        });
                        $A.enqueueAction(getRMAContract);
                    } else if(returnStr =='inValid Address'){  
                        console.log('returnStr---->'+returnStr);
                        component.set("v.addressvalidation", true); 
                    }                    
                    else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: 'Error',
                            message: 'This RMA has been queued for verification. It will not be exported / processed until the customer care team reviews and approves the request. ',
                            duration: '1000',
                            key: 'info_alt',
                            type: 'Error',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();

                    }
                }
            });
            $A.enqueueAction(saveCont);
        }
    },
    savechecked: function(component, event, helper) {
        console.log(event.target.id);
        console.log(event.target.dataset.entname);
        component.set("v.selectedAutoApply", '');
        component.set("v.selectedEntConfigId", event.target.id);
        component.set("v.selectedEntConfigName", event.target.dataset.entname);
        let parentRmaNeededStr = $A.get("$Label.c.CEP_parentRMAContarcts");
        console.log('label valu^^^^ '+parentRmaNeededStr);
        console.log('selected contarct name*** '+component.get("v.selectedEntConfigName"));
        if(parentRmaNeededStr.indexOf(component.get("v.selectedEntConfigName")) !== -1){
            let parentRMA = component.get("c.getParentRMADetails");
            parentRMA.setParams({ parAssetId: component.get("v.parAssetId"),
                                  currentRMAId : component.get("v.recordId") });
            parentRMA.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    if(response.getReturnValue().length > 0){
                        component.set("v.parentRMAList",response.getReturnValue());
                        component.set("v.showparRMA", true);
                    }
                }
            });
            $A.enqueueAction(parentRMA);
        }
        else if(parentRmaNeededStr.indexOf(component.get("v.selectedEntConfigName")) === -1){
            component.set("v.showparRMA", false);    
        }
    },
    autoapplysave: function(component, event, helper) {
        console.log(event.target.id);
        component.set("v.selectedEntConfigId", '');
        component.set("v.selectedAutoApply", event.target.id);
    },
    closemodal: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    closeErrorModal: function(component, event, helper) {
        component.set("v.openmodal", false);
    },
    closeShipErrorModal: function(component, event, helper) {
        component.set("v.addressErrorModal", false);
        component.set("v.addressvalidation", false);
    },
    intiatePayment: function(component, event, helper) {
        //show - contract frame.
        console.log('<<RMA intiatePayment>>'); 
        var evt = $A.get("e.force:navigateToComponent");
        var accid = component.get("v.recordId");
        evt.setParams({ 
            componentDef: "c:CEP_PurchaseContractModal",
            componentAttributes:{ 	
                 "authCcFlg" : "False",
            	 "purchaseContractFlg": "False",
            	 "ManualRmaFlg" : "True",
            	 "ariaAccNumber" : "",
            	 "contractId": component.get("v.contractId") , 
                 "AccId" : accid
        	}
        });
        evt.fire(); 

    },
    onRender: function(component, event, helper) {

        let iframediv = document.getElementById("iframeDiv");
        let formdiv = document.getElementById("formDiv");
        let selectPaymentSource = document.getElementById("selectPaymentSource");
        try {
            if (component.get("v.showPaymentFrame") == false) {
                iframediv.style.display = "none";
                formdiv.style.display = "none";
                selectPaymentSource.style.display = "none";
            }
        } catch (e) {
            // do nothing if the form no there
        }

    }

})