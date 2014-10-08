var api = "api/v1/catering/";
var ristID = 2;
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        if (Multiplatform.navigator.connection("WIFI")) {
            
            document.addEventListener('deviceready', this.onDeviceReady, false);

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
                //if()
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

                    var singleCustomer = $("<li data-theme='a'><a href='#' id='"+customer.data.id+"'>"
                        +"<img src='img/avatar.jpg' style='width: auto;' />"
                        +"<h2>"+customer.data.surname+"&nbsp;"+customer.data.name+"</h2>"
                        +"<p>Email: "+customer.data.email+"</p>"
                        +"</a></li>");

                    singleCustomer.on("tap", function() {
                        
                        var customerId = $(this).find('a').attr("id");
                        servers.private.query(ristID+"/customers", "/"+customerId, {
                            // i tokens
                        }, servers.callbacks.handleSelectedCustomer, true);
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

                if(selectedCustomer.data.bundle.addresses[0]) {
                    detailsSelectedCustomer += ("<li>Città: <strong>"+selectedCustomer.data.bundle.addresses[0].city+"</strong></li>"
                    +"<li>CAP: <strong>"+selectedCustomer.data.bundle.addresses[0].postalCode+"</strong></li>"
                    +"<li>Via: <strong>"+selectedCustomer.data.bundle.addresses[0].route+"</strong></li>"
                    +"<li>N°: <strong>"+selectedCustomer.data.bundle.addresses[0].routeNumber+"</strong></li>");
                }

                customerPersonalDetails.append(detailsSelectedCustomer);
                customerPersonalDetails.listview("refresh");


                // TAB MAPS

                var _lat = (selectedCustomer.data.bundle.addresses[0].lat);
                var _lon = (selectedCustomer.data.bundle.addresses[0].lon);
                var _zoom = 12;
                
                var map = new GMaps({
                    div: '#map_canvas',
                    lat: _lat,
                    lng: _lon,
                    zoom: 12,
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
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};
