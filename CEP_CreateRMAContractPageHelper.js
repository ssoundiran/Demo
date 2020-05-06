({
	function onChangeCountryHelper(component, event, helper) {
		var country = component.get("v.shipCountry");
		console.log("country: " + country);
		if (country == 'United States') {
		    component.set("v.stateListShow", true);
		}
      }
})
