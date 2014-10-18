var localStorageCat = {

	table : {
		customers: "_customers",
		selectedCustomer: "_selectedCustomer",
		orders: "_orders",
        order: "_selectedOrders",
	},

    // CUSTOMERS
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
	},
    
    
    //  ORDERS
    saveOrders : function(allOrders) {
		localStorage.setItem(localStorageCat.table.orders, JSON.stringify(allOrders));
	},

	saveSelectedOrder : function(selOrder) {
		localStorage.setItem(localStorageCat.table.order, JSON.stringify(selOrder));
	},
    
    retriveOrders : function() {
		var orders = localStorage.getItem(localStorageCat.table.orders);
		return JSON.parse(orders);
	},

	retriveSelectedOrder : function() {
		var selectedOrder = localStorage.getItem(localStorageCat.table.order);
		return JSON.parse(selectedOrder);
	},

	removeSelectedOrder : function() {
		localStorage.removeItem(localStorageCat.table.order);
	},
}
