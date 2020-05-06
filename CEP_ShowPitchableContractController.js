({
	doInit : function(component, event, helper) {
		var action = component.get("c.checkPitchableContract");
        action.setParams({            
            'recordIDVal': component.get("v.recordId")            
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                var result = response.getReturnValue();				
				component.set("v.msg",result);
                var cmpEvent = component.getEvent("cmpEvent");
                cmpEvent.setParams({"message" :result }); 
                cmpEvent.fire(); 
		      }
            
        });       
        $A.enqueueAction(action); 
        var actionarticle = component.get("c.checkPitchableContractmsg");        
        actionarticle.setCallback(this, function (response) {
            var state = response.getState();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                var result = response.getReturnValue();	
                component.set("v.pitchablemsg", result);
		      }
            
        });       
        $A.enqueueAction(actionarticle);
	}
   
})