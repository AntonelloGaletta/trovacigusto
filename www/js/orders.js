var order = {
	
	data: { 
		id: "",
		sessionId: "",
        status: "",
        data: "",
        seats: "",
        timestamp: "",
        serviceDate: "",
        serviceTime: "",
        serviceType: "",
        servicePrice: "",
        currency: "",
        price: "",
        discountAmount: "",
        discountReason: "",
        notes: "",
        bookingConfirm: "",
        bookingCode: "",
        
        bundle: {
            items: {
                id: "",
                oid: "",
                timestamp: "",
                name: "",
                itemType: "",
                currency: "",
                price: "",
                amount: "",
                instanceClass: "",
                instanceId: "",
                state: "",
                stateData: "",
                promotion: "",
                options: ""
            }
        },
        
        bookable: "",
        unbookableReason: "",
        totalPrice: ""
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
	        order.data = JSON.parse(value);
	    }
	}

}