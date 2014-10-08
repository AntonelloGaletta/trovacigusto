var customer = {
	
	data: { 
		id: "",
		email: "", 
		name: "", 
		surname: "",
		avatar: "",
		enabled: "",
		lastLogin: "",
		phoneMobile: "",
		birthDate: "",
		newsletter: false,
		bundle: this.address
	},

	address: {
		route: "", //la via
		routeNumber: "", //string, civico
		adminLevel1: "", //string, nel nostro caso regione
		adminLevel2: "", //string, nel nostro caso provincia
		adminLevel3: "", //string, nel nostro caso comune
		postalCode: "",
		lat: "", //float
		lon: ""
	},
/*
	save : function() {
		if (customer.data.id != "") {
			localStorage.setItem(customer.data.id, JSON.stringify(customer.data));
		}
	},
*/
	load : function(id) {
		if (id != "") {
			var value = localStorage.getItem($.trim(id));
	        customer.data = JSON.parse(value);
	    }
	}

}