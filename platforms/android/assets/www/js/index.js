var api = "api/v1/catering/";
var ristID = 2;
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        // temporaneamente rimuovo i due tokens
        localStorage.removeItem("auth_token"); 
        localStorage.removeItem("csrf_token"); 
                

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        if (Multiplatform.navigator.connection("WIFI")) {
            
            document.addEventListener('deviceready', this.onDeviceReady, false);
            document.addEventListener("backbutton", this.onBackKeyDown, false);
            
            // Login event
            $("#submitLogin_cat").on("tap", function() {
            
                var username = $("#username_cat").val();
                var pwd = $("#pwd_cat").val();
            
                console.log("[handleLogin]");
                console.log("USER: ",username);
                console.log("PWD: ",pwd);
                
                if (username.length === 0 || pwd.length === 0) {
                    console.log("! empty fields");
                    alert("empty fields");
                    return false;
                }

                if ( (localStorage.getItem("auth_token") != null) ) {
                    var auth_token = localStorage.getItem("auth_token");

                    servers.private.query("token", "", "GET", "", servers.callbacks.handleTokenAuth);

                } else {
                    servers.private.query("auth", "", "POST", {
                        "username": username,
                        "password": pwd
                    }, servers.callbacks.handleLogin);
                }
            });

            // Retrive customers list
            $("#customersList").on("tap", function() {
                servers.private.query(api+ristID+"/customers", "", "GET", "", servers.callbacks.handleCustomers);
            });

            $("#customersList_cat").on("pagebeforeshow", function(event) {
                     
                var customersListview = $("#customers");
                customersListview.html("");
                var localCustomers = localStorageCat.retriveCustomers();
                 
                for (var i=0; i<localCustomers.data.length; i++) {
                    customer.data.id = localCustomers.data[i].id;
                    customer.data.name = localCustomers.data[i].name;
                    customer.data.surname = localCustomers.data[i].surname;
                    customer.data.email = localCustomers.data[i].email;

                    var singleCustomer = $("<li data-theme='a'><a href='#' data-id='"+customer.data.id+"'>"
                        +"<img src='img/avatar.jpg' style='width: auto;' />"
                        +"<h2>"+customer.data.surname+"&nbsp;"+customer.data.name+"</h2>"
                        +"<p>Email: "+customer.data.email+"</p>"
                        +"</a></li>");

                    singleCustomer.on("tap", function() {
                        var customerId = $(this).find('a').attr("data-id");
                        servers.private.query(api+ristID+"/customers", "/"+customerId, "GET", "", servers.callbacks.handleSelectedCustomer);
                    });
                    customersListview.append(singleCustomer);
                }
                customersListview.listview("refresh");
            });
            
            var map;
            $("#customersDetail_cat").on("pagebeforeshow", function(event) {

                // TAB personal details

                var customerPersonalDetails = $("#customerPersonalDetails");
                customerPersonalDetails.html("");
                customerPersonalDetails.empty();

                var selectedCustomer = localStorageCat.retriveSelectedCustomer();
                var detailsSelectedCustomer;

                if(selectedCustomer.data) {
                    detailsSelectedCustomer = ("<li>Nome: <strong>"+selectedCustomer.data.name+"</strong></li>"
                    +"<li>Cognome: <strong>"+selectedCustomer.data.surname+"</strong></li>"
                    +"<li>Telefono: <strong>"+selectedCustomer.data.phoneMobile+"</strong></li>"
                    +"<li>Data di nascita: <strong>"+selectedCustomer.data.birthDate+"</strong></li>");
                }

                /*
                if(selectedCustomer.data.bundle.addresses[0]) {
                    detailsSelectedCustomer += ("<li>Città: <strong>"+selectedCustomer.data.bundle.addresses[0].city+"</strong></li>"
                    +"<li>CAP: <strong>"+selectedCustomer.data.bundle.addresses[0].postalCode+"</strong></li>"
                    +"<li>Via: <strong>"+selectedCustomer.data.bundle.addresses[0].route+"</strong></li>"
                    +"<li>N°: <strong>"+selectedCustomer.data.bundle.addresses[0].routeNumber+"</strong></li>");
                }
                */
                
                customerPersonalDetails.append(detailsSelectedCustomer);
                customerPersonalDetails.listview("refresh");


                // TAB MAPS
                
                
//                var _lat = (selectedCustomer.data.bundle.addresses[0].lat);
//                var _lon = (selectedCustomer.data.bundle.addresses[0].lon);
                var _lat = 45.4643324;
                var _lon = 9.1678994;
                var _zoom = 12;
                
                var map = new GMaps({
                    div: '#map_canvas',
                    lat: _lat,
                    lng: _lon,
                    zoom: _zoom,
                    zoomControl : true,
                    zoomControlOpt: {
                        style : 'SMALL',
                        position: 'TOP_LEFT'
                    },
                    width: 'auto',
                    height: '300px'
                });

                map.addMarker({
                  lat: _lat,
                  lng: _lon
                });
                
                $('#map_canvas').css('height',getRealContentHeight());

                function getRealContentHeight() {
                    var header = $.mobile.activePage.find("div[data-role='header']:visible");
                    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
                    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
                    var viewport_height = $(window).height();

                    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
                    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
                        content_height -= (content.outerHeight() - content.height());
                    } 
                    return content_height;
                }
                
            });

            $("#customersDetail_cat").on("pageshow", function(event) {
                $("#tabs").tabs({
                    show: function(event, ui){
                        
                        if (ui.panel.id == 'map_canvas' && $('#map_canvas').is(':empty'))
                        {
                            map.refresh();  
                        }
                    }                    
                });
            });
            
            
            // Retrive orders
            $("#ordersLists").on("tap", function() {
                servers.private.query(api+"order/"+ristID+"/any/all", "", "GET", "", servers.callbacks.handleOrders);
            });
            
            $("#orders_list").on("pagebeforeshow", function(event) {
                     
                var ordersListview = $("#orders");
                ordersListview.html("");
                var localOrders = localStorageCat.retriveOrders();
                var status_icon = "";
                var typeOfOrder = "";
                
                for (var i=0; i<localOrders.data.length; i++) {
                    
                    order.data.id             = localOrders.data[i].id            
                    order.data.sessionId      = localOrders.data[i].sessionId     
                    order.data.status         = localOrders.data[i].status        
                    order.data.data           = localOrders.data[i].data          
                    order.data.seats          = localOrders.data[i].seats         
                    order.data.timestamp      = localOrders.data[i].timestamp     
                    order.data.serviceDate    = localOrders.data[i].serviceDate   
                    order.data.serviceTime    = localOrders.data[i].serviceTime   
                    order.data.serviceType    = localOrders.data[i].serviceType   
                    order.data.servicePrice   = localOrders.data[i].servicePrice  
                    order.data.currency       = localOrders.data[i].currency      
                    order.data.price          = localOrders.data[i].price         
                    order.data.discountAmount = localOrders.data[i].discountAmount
                    order.data.discountReason = localOrders.data[i].discountReason
                    order.data.notes          = localOrders.data[i].notes         
                    order.data.bookingConfirm = localOrders.data[i].bookingConfirm
                    order.data.bookingCode    = localOrders.data[i].bookingCode
                    
                    order.data.totalPrice    = localOrders.data[i].totalPrice
                    
                    if(order.data.status == "aborted") {
                        status_icon = "red";
                    } else if(order.data.status == "confirmed") {
                        status_icon = "green";
                    } else {
                        status_icon = "yellow";
                    }
                    
                    if(order.data.serviceType == "delivery") {
                        typeOfOrder = "delivery";
                    } else if(order.data.serviceType == "table") {
                        typeOfOrder = "table";
                    } else if(order.data.serviceType == "takeaway") {
                        typeOfOrder = "takeaway";
                    } else {
                        typeOfOrder = "null";
                    }
                    
                    var singleOrder = $("<div id='"+order.data.id+"' data-role='collapsible' data-iconpos='right'><h3>"
                        +"<img src='img/"+typeOfOrder+".png' style='width: 30px; height: 30px;' />"
                        +"<img src='img/"+status_icon+".png' style='width: auto;' />"
                        +order.data.serviceType+"</h3>"
                        +"<div style='float: left; height: 60px;'>"
                        +"<p>Prezzo totale: <strong>"+order.data.totalPrice+order.data.currency+"</strong></p>"
                        +"<p>Orario: <strong>"+order.data.serviceTime+"</strong></p>"
                        +"</div>"
                        +"<a data-role='button' data-theme='a' class='ui-btn' data-mini='true' style='float:right; margin-top: 20px;' data-id='"+order.data.id+"' id='customer_"+order.data.id+"'>VISUALIZZA</a>"
                        +"</div>");

                    singleOrder.on("tap", "#customer_"+order.data.id,function() {
                        var orderId = $(this).attr("data-id");
                        servers.private.query(api+"order/"+ristID+"/"+orderId, "/detail", "GET", "", servers.callbacks.handleSelectedOrder);
                    });
                    ordersListview.append(singleOrder);
                }
                ordersListview.collapsibleset ("refresh");
            });
            
            
            
            $("#selected_order").on("pagebeforeshow", function(event) {
                
                var _singleOrder = $("#order");
                    _singleOrder.html("");
                    _singleOrder.empty();

                    var selectedOrder = localStorageCat.retriveSelectedOrder();
                    var detailsSelectedOrder;
                    
                    var staticInfo = "<img src='img/avatar.jpg' style='float:left;' /><p>NOME: <strong>Tizio</strong></p>"+"<p>COGNOME: <strong>Caio</strong></p><hr />";
                    var buttonConfirm = "<a data-role='button' data-theme='a' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a' style='float: left;width: 30%;'>CONFERMA</a>";
                    var buttonDecline = "<a href='#popupMenu' data-rel='popup' data-transition='slideup' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-left ui-btn-a' style='float: right;width: 30%;'>ANNULLA</a>";
                
                    
                    _singleOrder.append(staticInfo);
                
                    if(selectedOrder.length != 0) {
                        for(var count =0; count < selectedOrder.length; count++) {
                            detailsSelectedOrder = (
                                "<p></p>"
                                +"<p>Piatto: <strong>"+selectedOrder[count][1]+"</strong></p>"
                                +"<p>Prezzo: <strong>"+selectedOrder[count][2]+selectedOrder[count][3]+"</strong></p>"
                                +"<hr />");
                                
                                _singleOrder.append(detailsSelectedOrder);
                        }
                    }
                
                    _singleOrder.append(buttonConfirm);
                    _singleOrder.append(buttonDecline);
                    
                
                
                    $('#declineBTN').on('tap', function() {
                        // notification RADIO BUTTONS 
                        Multiplatform.navigator.notification.alert("Attenzione: ordine annullato, invia feedback sul motivo della cancellazione", function() {});
                    });
                    
                
                //_singleOrder.listview("refresh");
            });
            
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    onBackKeyDown: function() {
        app.receivedEvent('onBackKeyDown');
        if($.mobile.activePage.is('#loginPage_cat')){
            e.preventDefault();
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};
