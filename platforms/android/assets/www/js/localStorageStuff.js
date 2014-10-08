var localStorageCat = {

	table : {
		customers: "_customers",
		selectedCustomer: "_selectedCustomer",
		orders: "_orders"
	},

	saveCustomers : function(allCustomers) {
		localStorage.setItem(localStorageCat.table.customers, JSON.stringify(allCustomers));
	},

	saveSelectedCustomer : function(selCustomer) {
		localStorage.setItem(localStorageCat.table.selectedCustomer, JSON.stringify(selCustomer));
	},

	retriveCustomers : function() {
		var customers = localStorage.getItem(localStorageCat.table.customers);
		return JSON.parse(customers);
	},

	retriveSelectedCustomer : function() {
		var selectedCustomer = localStorage.getItem(localStorageCat.table.selectedCustomer);
		return JSON.parse(selectedCustomer);
	},

	removeSelectedCustomer : function() {
		localStorage.removeItem(localStorageCat.table.selectedCustomer);
	}
}