var csrf_token = "";
var auth_token = "";
var servers = {
    query: function (url, type, data, callback) {
        
        if (csrf_token) {
            url +="?_token=" + csrf_token;
        }
        console.log("[query " + url + "]");

        $.ajax({
            "url": url,
            "type": type,
            "data": data,
            "success": callback,
            "headers": {"Origin": "*"},
            "error": function (jqXHR, textStatus, errorThrown) { 
                
                console.log("jqXHR - "+jqXHR.error);
                console.log("jqXHR - "+jqXHR.status);

                alert("Error");
                
                // if(jqXHR.status == 401) {
                //     alert("ho un 401!!! ");
                // }
            },
            "beforeSend": function(xhr) { 

                if(auth_token) {
                    xhr.setRequestHeader("X-Auth-Token", auth_token);
                    // xhr.setRequestHeader("Origin","*"); 
                }
                
                $.mobile.loading('show', {text: "Loading", textVisible: true, theme: "a", html: ""})},
            "complete": function(jqXHR, textStatus) { $.mobile.loading('hide'); }
        });
    },
    private: {
        "URL": "http://cateringa.foothing.it/",
        // "URL": "http://cateringa.foothing.it/api/v1/catering/", 
        // private request with tokens 
        query: function (action, params, type, data, callback) { 
            console.log("[private.query]");
            servers.query(servers.private.URL+action+params, type, data, callback);
        }
    },

    callbacks: {
        handleLogin: function(r) {

            console.log(r.success+"<--------------------");

            // if (r.success) {
                console.log("[callback: handleLogin]");

                var auth_data = $.parseJSON(JSON.stringify(r));

                auth_token = auth_data.token;
                var user = auth_data.user;

                if (r) {
                    console.log("logging user!");
                    
                    localStorage.setItem("auth_token", auth_token);
                    localStorage.setItem("id", user.id);

                    console.log("aut_token SETTED locally");

                    servers.private.query("token", "", "GET", "", servers.callbacks.handleTokenAuth);

                    return;
                } else {
                    Multiplatform.navigator.notification.alert("login failed", function() {});
                }
            // }
        },

        handleTokenAuth: function(r) {

            console.log(r.success+"<--------------------");

            if ((auth_token != null) ) {

                console.log("[callback: handleTokenAuth] oleeeeeeeeee");

                if($.parseJSON(JSON.stringify(r)).success == true ) {
                    csrf_token = $.parseJSON(JSON.stringify(r)).data;
                    localStorage.setItem("csrf_token", csrf_token);
                    console.log(csrf_token);
                }

                $.mobile.pageContainer.pagecontainer("change", "#homePage_cat", { transition: 'slide' });

            }
        },

        handleCustomers: function(rp) { 

            console.log("[callback: handleUsers]");
            var customerList = $.parseJSON(JSON.stringify(rp));
            if (customerList && customerList.success === true) {
                
                console.log("start parsing ALL customer JSON");
                for(var count =0; count < customerList.data.length-1; count++) {
                        
                        customer.data.id = customerList.data[count].id;
                        customer.data.email = customerList.data[count].email;
                        customer.data.name = customerList.data[count].name;
                        customer.data.surname = customerList.data[count].surname;
                        customer.data.enabled = customerList.data[count].enabled;
                        customer.data.lastLogin = customerList.data[count].lastLogin;
                        customer.data.phoneMobile = customerList.data[count].phoneMobile;
                        customer.data.birthDate = customerList.data[count].birthDate;
                        customer.data.newsletter = customerList.data[count].newsletter;
                        
                        console.log(customerList.data[count].id);
                        //customer.save(); // save single customer in localStorage
                };

                localStorageCat.saveCustomers(customerList);  // save ALL customers in localStorage
                
                $.mobile.pageContainer.pagecontainer("change", "#customersList_cat", { transition: 'slide' });

                return;
            } else {
               console.log("parsing error!");
            }
        },

        handleSelectedCustomer: function(rp) {
            console.log("[callback: handleSelectedUser]");
            var _customer = $.parseJSON(JSON.stringify(rp));
            if (_customer && _customer.success === true) {

                console.log("start parsing SINGLE customer JSON");

                customer.data.id = _customer.data.id;
                customer.data.email = _customer.data.email;
                customer.data.name = _customer.data.name;
                customer.data.surname = _customer.data.surname;
                customer.data.enabled = _customer.data.enabled;
                customer.data.lastLogin = _customer.data.lastLogin;
                customer.data.phoneMobile = _customer.data.phoneMobile;
                customer.data.birthDate = _customer.data.birthDate;
                customer.data.newsletter = _customer.data.newsletter;
                
                //console.log("removing actual selected customer -> "+localStorageCat.retriveSelectedCustomer().data.name);

                localStorageCat.removeSelectedCustomer(); // first remove actual customer stored in localstorage
                localStorageCat.saveSelectedCustomer(_customer);  // then save new selected customer

                console.log("save new selected customer -> "+localStorageCat.retriveSelectedCustomer().data.name);

                $.mobile.pageContainer.pagecontainer("change", "#customersDetail_cat", { transition: 'slide' });

                return
            } else {
               console.log("parsing error!");
            }
        },
        
        handleOrders: function(r) { 

            console.log("[callback: handleOrders]");
            var orderList = $.parseJSON(JSON.stringify(r));
            if (orderList && orderList.success === true) {
                
                console.log("start parsing ALL orders JSON");
                for(var count =0; count < orderList.data.length-1; count++) {
                        
                    order.data.id             = orderList.data[count].id            
                    order.data.sessionId      = orderList.data[count].sessionId     
                    order.data.status         = orderList.data[count].status        
                    order.data.data           = orderList.data[count].data          
                    order.data.seats          = orderList.data[count].seats         
                    order.data.timestamp      = orderList.data[count].timestamp     
                    order.data.serviceDate    = orderList.data[count].serviceDate   
                    order.data.serviceTime    = orderList.data[count].serviceTime   
                    order.data.serviceType    = orderList.data[count].serviceType   
                    order.data.servicePrice   = orderList.data[count].servicePrice  
                    order.data.currency       = orderList.data[count].currency      
                    order.data.price          = orderList.data[count].price         
                    order.data.discountAmount = orderList.data[count].discountAmount
                    order.data.discountReason = orderList.data[count].discountReason
                    order.data.notes          = orderList.data[count].notes         
                    order.data.bookingConfirm = orderList.data[count].bookingConfirm
                    order.data.bookingCode    = orderList.data[count].bookingCode
        
                    console.log(orderList.data[count].id);
                    //customer.save(); // save single customer in localStorage
                };

                localStorageCat.saveOrders(orderList);  // save ALL customers in localStorage
                
                $.mobile.pageContainer.pagecontainer("change", "#orders_list", { transition: 'slide' });

                return;
            } else {
               console.log("parsing error!");
            }
        },
        
        
        handleSelectedOrder: function(rp) {
            console.log("[callback: handleSelectedOrder]");
            var _order = $.parseJSON(JSON.stringify(rp));
            if (_order && _order.success === true) {

                console.log("start parsing SINGLE order JSON");
                console.log(_order);

                        
                    order.data.id             = _order.data.id            
                    order.data.sessionId      = _order.data.sessionId     
                    order.data.status         = _order.data.status        
                    order.data.data           = _order.data.data          
                    order.data.seats          = _order.data.seats         
                    order.data.timestamp      = _order.data.timestamp     
                    order.data.serviceDate    = _order.data.serviceDate   
                    order.data.serviceTime    = _order.data.serviceTime   
                    order.data.serviceType    = _order.data.serviceType   
                    order.data.servicePrice   = _order.data.servicePrice  
                    order.data.currency       = _order.data.currency      
                    order.data.price          = _order.data.price         
                    order.data.discountAmount = _order.data.discountAmount
                    order.data.discountReason = _order.data.discountReason
                    order.data.notes          = _order.data.notes         
                    order.data.bookingConfirm = _order.data.bookingConfirm
                    order.data.bookingCode    = _order.data.bookingCode
                    
                    
                    if(_order.data.bundle.items.length > 0) {
                        
                        var items = [];
                        
                        for(var count =0; count < _order.data.bundle.items.length; count++) {
                            var _item = [];
                            
                            _item.push(_order.data.bundle.items[count].id, 
                                       _order.data.bundle.items[count].name, 
                                       _order.data.bundle.items[count].price,
                                       _order.data.bundle.items[count].currency);
                            
                            items.push(_item);
                        }
                        
                        localStorageCat.saveSelectedOrder(items);
                        
                        $.mobile.pageContainer.pagecontainer("change", "#selected_order", { transition: 'slide' });
                    }
                
                
                return
            } else {
               console.log("parsing error!");
            }
        }

    }
}