var mapsStores = {
  lat_act : 0,
  lon_act : 0,
  active_postion:false,
  counter:0,
  markers:[],
  a_counter:0,
  infowindow:{},
  data_Countries:{},
  icon : "/arquivos/ShopPointMovies.png",
  defaultCountry: "Colombia",
  defaultLat : 4.729727,
  defaultLng : -74.059696,
  /*
  Inicialización del script
  @param {String} N/A
  return {String} N/A
  */
  init:function(){
    mapsStores.loadApiGoogle(function(){
      mapsStores.data_Countries = mapsStores.getAllData();  
      mapsStores.getLocation();
      var div = document.createElement("div");
      div.id = "container_country";
      var div_city =  document.createElement("div");
      div_city.id = "container_city";
      document.getElementsByClassName("search-tools")[0].appendChild(div);
      document.getElementsByClassName("search-tools")[0].appendChild(div_city);
      document.getElementsByClassName("search-tools")[0].innerHTML += '<div id="storeContent"></div><div id="stores" class="stores_ul">Elige local</div>';
    });
  },  
  loadApiGoogle:function($callback){
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState){
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                $callback();
            }
        };
    } else {
        script.onload = function () {
            $callback();
        };
    }
    script.src = "//maps.google.com/maps/api/js?key=AIzaSyAm3Oxyma7CTWtQIoJf0jMTuTrFKvUkPpw&sensor=true&region=CO?v=180587";
    document.getElementsByTagName("head")[0].appendChild(script);
  },
  /*
  Inicialización del script
  @param {String} N/A
  return {String} N/A
  */
  getLocation:function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(mapsStores.showPosition,mapsStores.showError);
    }else{
      document.getElementById("error").innerHTML = "Geolocalización no es compatible con este navegador.";
    }
  },
  /*
  Crea el map con las opciones que se le suministren
  @param {Obj} $options - Opciones para la carga del mapa con sus coordenadas
  return {Obj} map - mapa creado
  */
  createMap:function($options){
    mapholder = document.getElementById('map-canvas')
      mapholder.style.height = '100%';
      mapholder.style.width = '100%';
    var map = new google.maps.Map(document.getElementById("map-canvas"),$options);
    return map;
  },
  /*
  Crea las opciones para la creacion del mapa con geolocalizacion y todas las tiendas alrededor
  @param {Obj} $position - objeto que define la fucionalidaad de geoloclizacion
  return {String} N/A
  */
  showPosition:function($position){
    mapsStores.active_postion = true;
      lat = $position.coords.latitude;
      lon = $position.coords.longitude;
      mapsStores.lat_act = lat;
      mapsStores.lon_act = lon;
      latlon = new google.maps.LatLng(lat, lon);

      mapsStores.verificateCountry(function($data){
      //  mapsStores.showError(true);
        var myOptions = {
        center:latlon,zoom:12,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
      };
      var map = mapsStores.createMap(myOptions);
      var marker = new google.maps.Marker({position:latlon,map:map,title:"Tu estas aca!",animation: google.maps.Animation.DROP});  
        mapsStores.painstStores(map,$data,function(){
          mapsStores.addMarker(map);
          });
      });
      mapsStores.loadList();
      if( typeof mapsStores.defaultCountry !== "undefined" && mapsStores.defaultCountry != "" ) {
        $("#countries").val($("#countries option[country='" + mapsStores.defaultCountry + "'").val()).change();
        if (window.location.href.indexOf("/tiendas?shop=") > -1) {
          var shop = mapsStores.getURLParam("shop");
          $("#countries").val($("#countries option[country='" + shop + "'").val());
        }
      }
  },
  /*
  Pinta todas las tiendas en el mapa
  @param {Obj} $map - Mapa donde se pintaran todas las tiendas
  @param {Array} $data - datos de todas las tiendas 
  @param {Function} $callback - funcion que se ejecuta al momento de fializar toda la funcionalidad
  return {Obj} map - mapa creado
  */
  painstStores:function($map,$data,$callback,$centinela){
    mapsStores.markers = [];  
    for (var i = 0; i < $data.length; i++) {
        var store = $data[i];
        var marker = new google.maps.Marker({
          data_complete:store,
          position: {lat: store[2], lng: store[1]},
          map: $map,
          content:store[3],
          icon: mapsStores.icon,
          title: store[0]
        });
        mapsStores.markers.push(marker);
    }

    var data = mapsStores.markers;
    var mq = window.matchMedia("(max-width: 768px)");
     
    var listHTML = '<select id="list_mobile">';
    for(var i=0; i < data.length; i++){
        listHTML += '<option value="'+i+'" style="cursor:pointer">'+data[i].content.name+'</option>';
    }
    listHTML += '</select>';
    document.getElementById("stores").innerHTML = listHTML;

    if (window.location.href.indexOf("/tiendas?shop=") > -1) {
      var value = mapsStores.getURLParam("value");
      if($('#list_mobile option').length > value) {
        mapsStores.storeInMap(value);
        $('#list_mobile').val(value);
      }
    }

    $("#list_mobile").change(function(){
        mapsStores.storeInMap(this.options[this.selectedIndex].value);
    })

    if($callback != undefined){
      $callback();
    }
  },

  /*
  Agrega a todas las marcas de cada tienda la funcionalidad de mesaje al momento de darle click
  @param {Obj} $map - Mapa donde se encuentran las marcas de cada tienda
  return {String} N/A
  */
  addMarker:function($map){
      if(mapsStores.a_counter < mapsStores.markers.length){
        var i = mapsStores.a_counter;
        var markers_alls = mapsStores.markers;
        var marker = markers_alls[i];
          google.maps.event.addListener(marker, 'click', function() {             
            if (mapsStores.infowindow.content != undefined ) {
                  mapsStores.infowindow.close();
            }            
            mapsStores.infowindow = new google.maps.InfoWindow({              
              content: mapsStores.contentHTML(marker.content,marker.content.name, marker)
            });            
            document.getElementById("storeContent").innerHTML = mapsStores.contentHTML(marker.content,marker.content.name, marker);
            $map.setZoom(14);
            $map.setCenter(marker.getPosition());
            mapsStores.infowindow.open($map, marker);
            $map.panTo(marker.getPosition());
          });
            mapsStores.a_counter++;
         mapsStores.addMarker($map);    
      }else{
        mapsStores.a_counter = 0;
      }
  },

  /*
  Crea en contenido HTML para el mensaje que se mostrara en cada tienda al dar click
  @param {Obj} $store - datos de la tienda que se mostrara
  @param {String} $storeName - Nombre de la tienda
  @param {String} $city - ciudada de la tienda
  @param {String} $country - Nombre del pais
  return {String} contentString - codigo HTML con mensaje
  */
  contentHTML:function($store, $storeName, $marker){

    var contentString = '<div id="content">'+
              '<div id="texto-info"><h4>Información de la tienda</h4></div>'+
              '<div id="siteNotice">'+
              '<div style="cursor: pointer;" class="info">Informacion</div>'+
              '<div style="cursor: pointer;" class="hora">Horarios</div>'+
              '</div>'+
              /*'<h2 id="firstHeading" class="firstHeading">'+ $storeName +'</h2>'+*/
              '<div id="bodyContent">'+
              //'<div>' + $store.$country + '</div>' + 
              //'<div>' + $store.$city + '</div>' +       
              '<div>' + $storeName + '</div>' +
              ($store.address != null && $.trim($store.address) != "" 
                ? '<div>' + $store.address + '</div>' 
                : '') +
              ($store.phone != null && $.trim($store.phone) != ""
                ? '<div>' + $store.phone + '</div>' 
                : '') +
              '</div>'+
              
              ($store.horario != null && $.trim($store.horario) != ""
                ? '<div class="Horario-tienda"><strong>Horarios: </strong> <br/> ' + $store.horario + '</div>'
                : '') +
                '<div class="button">'+
                '<div class="button-llamar"><a href="tel: '+$store.phone +'">LLAMAR</a></div>'+
                '<div class="button-dir"><a href="https://www.google.com/maps/search/?api=1&query='+$marker.position+'" target="_blank">COMO LLEGAR</a></div>'+
                '</div>' +
              '</div>';
     return contentString;
  },
  /*
  Verifica el pais con las coordenadas que se obtubieron de la geolocalizacino
  @param {Obj} $callBack - funcion que se ejecuta al momento de finalizar
  return {String} N/A
  */
  verificateCountry:function($callBack){
    $.ajax({
      url:"//maps.googleapis.com/maps/api/geocode/json?latlng="+mapsStores.lat_act+","+mapsStores.lon_act+"&sensor=false&key=AIzaSyAm3Oxyma7CTWtQIoJf0jMTuTrFKvUkPpw",
      taype:"GET",
      success:function(_data){
  
        var name_count = _data.results[_data.results.length - 1].formatted_address.toUpperCase().split(" ").join("");
        var data_all = mapsStores.data_Countries;
        var centinela = false;
        for(name in data_all){
          var name_obj = name.toUpperCase().split(" ").join("");
            if(name_obj == name_count){
              centinela = true;
              mapsStores.verificateCities(data_all[name],_data,$callBack);
            }            
        } 
        if(centinela == false){
            mapsStores.loadMapDefault();
        }
      }
    });   
  },
  /*
  Verifica el pais con las coordenadas que se obtubieron de la geolocalizacino
  @param {Obj} $data_country - datos del pais en que se encuentra obtenidos de la variable creada
  @param {Obj} $data_ajax - datos del pais en que se enncuentra obtenidos de la consulta al api de google
  @param {Obj} $callBack - funcion que se ejecuta al finalizar 
  return {String} N/A
  */
  verificateCities:function($data_country,$data_ajax,$callBack){
    var data = $data_country.cities;
    var city_act = $data_ajax.results[0].formatted_address.toUpperCase().split(" ").join("");
    var centinela = false;
    for(name in data){
      var city_obj = name.toUpperCase().split(" ").join("");
      if(city_act.indexOf(city_obj) >= 0){
        mapsStores.createStoresMap(data[name].stores,$callBack);
        centinela = true;
      }
    }
    if(centinela == false){
      mapsStores.createStoresMap($data_country,$callBack)
    }
  },
  /*
  Crea objeto con todas las tiendas que se encuentran y solo se ejecuta si esta actia la geolocalizacion
  @param {Obj} $stores - objeto con todas las tiendas que se desean pintar
  @param {String} $city
  @param {Function} $callBack - funcion que se ejecuta al momento de finalizar la funcionalidad
  @return {String} N/A
  */
  createStoresMap:function($stores,$callBack){
    var stores_map = {type: 'FeatureCollection',features:[]};
    var coor_stores = [];
    if($stores.cities != undefined){
      $stores = $stores.cities;
      for(name_city in $stores){
        var data_city = $stores[name_city].stores;
        for(name in data_city){
            var data = data_city[name];
            coor_stores.push([name,Number(data.lng), Number(data.lat),{name: name , phone:data.phone , address:data.address , horario : data.schedules}]);
         }
      }
      mapsStores.loadList();
    }else{
      for(name in $stores){
        var data = $stores[name];
        coor_stores.push([name,Number(data.lng), Number(data.lat),{name: name , phone:data.phone , address:data.address , horario : data.schedules}]);
      }
    }
    $callBack(coor_stores);
  },
  loadList:function(){
    var list = document.createElement("select");
          list.id = "countries";
          list.style.width = "100%";
          list.onchange = function(){
            document.getElementById("storeContent").innerHTML = ""
            if(this.value != "NULL"){
              var list_city = document.createElement("select");
              list_city.id = "cities";
              list_city.style.width = "100%";
              list_city.onchange = function(){
                document.getElementById("storeContent").innerHTML = ""
                mapsStores.detectedStoresPaint(mapsStores.getOption("countries").text,mapsStores.getOption("cities").text);
              }
              document.getElementById("container_city").innerHTML = "";
              document.getElementById("container_city").appendChild(list_city);
              mapsStores.fullList("city");
              mapsStores.detectedStoresPaint(mapsStores.getOption("countries").text,"");
            }else{
              document.getElementById("container_city").innerHTML = "";
            }
          };
        document.getElementById("container_country").appendChild(list);
        mapsStores.fullList("country");
  },
  /*
  Funcion que se ejecuta al momento de no aceptar la geolocalizacion
  @param {String} N/A
  @return {String} N/A
  */
  showError:function($centinela){
    if(mapsStores.active_postion == false){
        var obj = mapsStores.data_Countries;
        var country = mapsStores.getURLParam("pais");
        var city = mapsStores.getURLParam("ciudad");
        mapsStores.loadList();
        if($centinela != true){
          if(country == "" && city == ""){
            if( typeof mapsStores.defaultCountry !== "undefined" && mapsStores.defaultCountry != "" ) {
              $("#countries").val($("#countries option[country='" + mapsStores.defaultCountry + "'").val()).change();
              mapsStores.detectedStoresPaint(mapsStores.defaultCountry,"");
            }
          }else{
            if( typeof mapsStores.defaultCountry !== "undefined" && mapsStores.defaultCountry != "" ) {
              $("#countries").val($("#countries option[country='" + mapsStores.defaultCountry + "'").val()).change();
              mapsStores.detectedStoresPaint(country,city);
            }
            
          }
        } 
      } 
    },
    /*
    detecta las tiendas que se deben pintar segun las condiciones del pais y de ciudad
    @param {String} $country - pais que se debe seleccionar
    @param {String} $city - ciudad que se debe seleccionar
    @return {String} N/A
    */
    detectedStoresPaint:function($country,$city){
      var obj = mapsStores.data_Countries;
      var pais = "";
      var cuidad = "";
      var options_map = {zoom: 6,mapTypeId: google.maps.MapTypeId.ROADMAP};
      var stores_arr = [];
      var centinela_global = false;

      if($country != "" && $city == ""){
        pais = obj[$country];
        if(pais != undefined){  
          options_map["center"] = new google.maps.LatLng(pais.lat,pais.lng);
          var cudades = pais.cities;
          for(name in cudades){
            var stores = cudades[name].stores;
            for(name_store in stores){
              var store = stores[name_store];
              stores_arr.push([name_store,store.lng, store.lat,{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
            }
          }
        }else{
          centinela_global = true;
          mapsStores.loadMapDefault();
        } 
      }
      
      if($country == "" && $city != ""){
        var centinela = false;
        for(name in obj){
          var city = obj[name].cities[$city];
          if(city != undefined){
            centinela = true;
            options_map.zoom = 12;
            options_map["center"] = new google.maps.LatLng(city.lat,city.lng);
            var stores = city.stores;
            for(name_store in stores){
              var store = stores[name_store];
              stores_arr.push([name_store,store.lng, store.lat,{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
            }
          }else{
            console.log("Error city does not exist");
          }
        }
        if(centinela == false){
          centinela_global = true;
          mapsStores.loadMapDefault();
        }
      }

      if($country == "" && $city == ""){
        centinela_global = true;
        mapsStores.loadMapDefault();
      }

      if($country != "" && $city != ""){
        pais = obj[$country];
        if(pais != undefined){
          var centinela = false;
          cuidad = pais.cities[$city];
          if(cuidad != undefined){
            centinela = true;
            options_map.zoom = 12;
            options_map["center"] = new google.maps.LatLng(cuidad.lat,cuidad.lng);
            var stores = cuidad.stores;
            for(name_store in stores){
              var store = stores[name_store];
              stores_arr.push([name_store,store.lng, store.lat,{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
            }
          }
          if(centinela == false){
            options_map["center"] = new google.maps.LatLng(pais.lat,pais.lng);
            var cudades = pais.cities;
            for(name in cudades){
              var stores = cudades[name].stores;
              for(name_store in stores){
                var store = stores[name_store];
                stores_arr.push([name_store,store.lng, store.lat,{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
              }
            }
          }
          
        }else{
          var centinela = false;
          for(name in obj){
            var city = obj[name].cities[$city];
            if(city != undefined){
              centinela = true;
              options_map.zoom = 12;
              options_map["center"] = new google.maps.LatLng(city.lat,city.lng);
              var stores = city.stores;
              for(name_store in stores){
                var store = stores[name_store];
                stores_arr.push([name_store,store.lng, store.lat,{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
              }
            }
          }
          if(centinela == false){
            centinela_global = true;
            mapsStores.loadMapDefault();
          }
        }     
      }
      if(centinela_global == false){
        var map = mapsStores.createMap(options_map);
        mapsStores.painstStores(map,stores_arr,function(){
          mapsStores.addMarker(map);
        });
      }
    },
    /*
    se ejecuta al momento de dar click en un elemento de la lista de tiendas y acerca y muestra mensaje de la tienda seleccionada en el mapa
    @param {String} $position - posicion del marcador que se selecciono
    @return {String} N/A
    */
    storeInMap:function($position){      
      var marker = mapsStores.markers[$position];
      if(typeof marker != "undefined") {
        marker.map.setZoom(14);
        marker.map.setCenter(marker.getPosition());      
        if(mapsStores.infowindow.content != undefined ) {
          mapsStores.infowindow.close();
        }
        mapsStores.infowindow = new google.maps.InfoWindow({
          content: mapsStores.contentHTML(marker.content,marker.content.name, marker)        
        });
        mapsStores.infowindow.open(marker.map, marker);
        document.getElementById("storeContent").innerHTML = mapsStores.contentHTML(marker.content,marker.content.name, marker);
      }
    },
    /*
    Pinta un mapa por default
    @param {String} N/A
    @return {String} N/A
    */
    loadMapDefault:function(){
        var options_map = {zoom: 6,mapTypeId: google.maps.MapTypeId.ROADMAP};
        var obj = mapsStores.data_Countries;
        var ciudades = "";
        var stores_arr = [];
        options_map["center"] = new google.maps.LatLng(mapsStores.defaultLat, mapsStores.defaultLng);
        
        if (window.location.href.indexOf("/tiendas?shop=") > -1) {
          var shop = mapsStores.getURLParam("shop");
          ciudades = obj[shop].cities;
        } else {
          ciudades = obj[mapsStores.defaultCountry].cities;
        }

        for(name in ciudades){
          var stores = ciudades[name].stores;
          for(name_store in stores){
            var store = stores[name_store];
            stores_arr.push([name_store,Number(store.lng), Number(store.lat),{name: name_store , phone:store.phone , address:store.address , horario : store.schedules}]);
          }
        } 
        var map = mapsStores.createMap(options_map);
        
        mapsStores.painstStores(map,stores_arr,function(){
          mapsStores.addMarker(map);
        });
    },
    /*
    Obtine la opcion de la lista que se indique
    @param {String} $id - id de la lista que se desea optener la opcion que se selecciona
    @return {Element} option_selected - opcion HTML que se encuentra seleccionada en la lista
    */
    getOption:function($id){
        var option_selected = document.getElementById($id);
        option_selected = option_selected.options[option_selected.selectedIndex];
        return option_selected;
    },
    /*
    Obtine el parametro undicado de la url
    @param {String} $name - nombre del parametro que s desea obtener el valor
    @return {String} $value - valor del parametro 
    */
    getURLParam: function ($name){
          var value = decodeURIComponent((new RegExp('[?|&]' + $name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
          if (value == null) {
              return '';
          } else {
              return value;
          }
    },
     /*
    Llena la lista de pais o ciudad
    @param {String} $list - Nombre de la lista que se desea llenar
    @return {String} N/A
    */
    fullList:function($list){
      if($list == "country"){
        var data = mapsStores.data_Countries;
        var options = '';        
        for(name in data){
          options+='<option country="' + name + '" value="'+String(data[name].lat)+','+String(data[name].lng)+'">'+name+'</option>';
        }
        document.getElementById("countries").innerHTML = options;
    
    
      }else{
        var data = mapsStores.data_Countries;
        var options = '<option value="NULL">Ciudades</option>';
        var option_selected = mapsStores.getOption("countries").text;
        for(name in data){
          if(option_selected == name){
            var city = data[name].cities;
            for(name_atri in city){
              options+='<option value="'+String(city[name_atri].lat)+','+String(city[name_atri].lng)+'">'+name_atri+'</option>';  
            }
          }         
        }
        document.getElementById("cities").innerHTML = options;
      }
    
    
    },
    /*
    se pinta los datos de los paises ciudades y tiendas
    @param {String} N/A
    @return {String} N/A
    */
    getAllData:function(){
      var data = {                
        "Movies": {
          "lat": 10.990262,
          "lng": -74.78924,
          "cities": {            
            "Armenia": {
              "lat": 4.5338898,
              "lng": -75.6811066,
              "stores": {
                "FRANKY MOVIES UNICENTRO ARMENIA (F)": {
                  "lat": 4.540244,
                  "lng": -75.666573,
                  "address": "C.C. UNICENTRO L.1-07",
                  "phone": "(4) 4442849 EXT 342",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },                             
              }
            },
            "Barranquilla": {
              "lat": 10.9685402,
              "lng": -74.7813187,
              "stores": {
                "MOVIES GRAN PLAZA DEL SOL": {
                  "lat": 10.926521,
                  "lng": -74.779984,
                  "address": "C.C. GRAN PLAZA DEL SOL L.158",
                  "phone": "(4)4442849 EXT 391",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES UNICO BARRANQUILLA": {
                  "lat": 10.989781,
                  "lng": -74.811371,
                  "address": "C.C. UNICO L.87",
                  "phone": "(4)4442849 EXT 340",
                  "schedules": "Lunes a Jueves de 9:30AM – 8:30PM, Viernes y Sábado 9:30AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Bogotá": {
              "lat": 4.648311,
              "lng": -74.12046,
              "stores": {
                "MOVIES BIMA (F)": {
                  "lat": 4.808630,
                  "lng": -74.039352,
                  "address": "C.C. BIMA L.4-108",
                  "phone": "(1) 5185567 EXT 103",
                  "schedules": "Lunes a Sábado de 9:30AM – 7:30PM, Domingos y Festivos 10:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES CALLE 122": {
                  "lat": 4.701393,
                  "lng": -74.047195,
                  "address": "Calle 122 N° 18-25",
                  "phone": "(4) 4442849 EXT 376",
                  "schedules": "Lunes a Sábado de 10:00AM – 7:00PM, Domingos y Festivos 11:00AM – 5:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES CENTRO MAYOR": {
                  "lat": 4.591646,
                  "lng": -74.124994,
                  "address": "C.C. CENTRO MAYOR L.2-162",
                  "phone": "(4) 4442849 EXT 426",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES EL RESTREPO": {
                  "lat": 4.585465,
                  "lng": -74.102081,
                  "address": "Carrera 19 Nº 18Sur-68",
                  "phone": "(4)4442849 EXT 403",
                  "schedules": "Lunes a Sábado de 10:00AM – 7:00PM, Domingos y Festivos 11:00AM – 6:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES LA COLINA": {
                  "lat": 4.731696,
                  "lng": -74.067375,
                  "address": "C.C. LA COLINA L.322",
                  "phone": "(4)4442849 EXT 384",
                  "schedules": "Lunes a Sábado de 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES MADRID (F)": {
                  "lat": 4.727620,
                  "lng": -74.257341,
                  "address": "C.C. CASA BLANCA L.15",
                  "phone": "(4)4442849 EXT 438",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES MULTIPLAZA LA FELICIDAD": {
                  "lat": 4.651846,
                  "lng": -74.125381,
                  "address": "C.C. MULTIPLAZA LA FELICIDAD L.B-151",
                  "phone": "(4)4442849 EXT 395",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES PLAZA CENTRAL": {
                  "lat": 4.631260,
                  "lng": -74.115533,
                  "address": "C.C. PLAZA CENTRAL L.3-72",
                  "phone": "(4)4442849 EXT 432",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES PLAZA SOACHA": {
                  "lat": 4.586927,
                  "lng": -74.205437,
                  "address": "C.C. GRAN PLAZA SOACHA L.108",
                  "phone": "(4)4442849 EXT 383",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES SALITRE": {
                  "lat": 4.653131,
                  "lng": -74.109616,
                  "address": "C.C. SALITRE L.336",
                  "phone": "(4)4442849 EXT 437",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }  
              }
            },
            "Bucaramanga": {
              "lat": 7.099671,
              "lng": -73.107364,
              "stores": {
                "MOVIES CAÑAVERAL (F)": {
                  "lat": 7.071057,
                  "lng": -73.106255,
                  "address": "C.C. CAÑAVERAL L.135",
                  "phone": "(7) 7009833",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes 10:00AM – 8:30PM, Sábado 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Cali": {
              "lat": 3.369387,
              "lng": -76.527406,
              "stores": {
                "MOVIES CHIPICHAPE (S)": {
                  "lat": 3.475192,
                  "lng": -76.527611,
                  "address": "C.C. CHIPICHAPE L.615",
                  "phone": "(4)4442849 EXT 416",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes 10:00AM – 8:30PM, Sábado 10:00AM – 9:00PM, Domingos 10:00AM – 8:30PM y Festivos 10:00AM – 9:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",  
                  "images": [""]
                },
                "MOVIES UNICO CALI": {
                  "lat": 3.464807,
                  "lng": -76.500931,
                  "address": "C.C. ÚNICO L.223",
                  "phone": "(4)4442849 EXT 425",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:30PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }              
              }
            },
            "Cartagena": {
              "lat": 10.415174,
              "lng": -75.529394,
              "stores": {
                "MOVIES CASTELLANA": {
                  "lat": 10.393776,
                  "lng": -75.487495,
                  "address": "Av. Pedro de Heredia, Calle 30 No. 30-31",
                  "phone": "(4) 4442849 EXT 379",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES MALL PLAZA CARTAGENA(S)": {
                  "lat": 10.425398,
                  "lng": -75.540077,
                  "address": "C.C. MALL PLAZA CARTAGENA L.246",
                  "phone": "(4)4442849 EXT 422",
                  "schedules": "Lunes a Jueves de 9:30AM – 8:30PM, Viernes, Sábado y Domingo 10:00AM – 9:00PM Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Chia": {
              "lat": 4.8587599,
              "lng": -74.0586624,
              "stores": {
                "FRANKY MOVIES CENTRO CHIA (F)": {
                  "lat": 4.867022,
                  "lng": -74.036105,
                  "address": "C.C. CENRO CHÍA L.1071",
                  "phone": "(4) 4442849 EXT",
                  "schedules": ": Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES CHIA (F)": {
                  "lat": 4.861050,
                  "lng": -74.061849,
                  "address": "Cra. 12 # 10 45",
                  "phone": "(1) 8627086",
                  "schedules": ": Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }              
            },
            "Chiquinquirá": {
              "lat": 5.617357,
              "lng": -73.817162,
              "stores": {
                "MOVIES CHIQUINQUIRA (F)": {
                  "lat": 5.617357,
                  "lng": -73.817162,
                  "address": "Carrera 11 Nº 16-39",
                  "phone": "(8) 7260982",
                  "schedules": "Lunes a Viernes de 10:00AM – 1:00PM y 2:00PM – 8:00PM, Sábado 10:00AM – 8:00PM y Domingos y Festivos 9:00AM – 4:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Ibague": {
              "lat": 4.43889,
              "lng": -75.2322235,
              "stores": {
                "MOVIES LA ESTACION IBAGUE": {
                  "lat": 4.445664,
                  "lng": -75.204330,
                  "address": "C.C. LA ESTACIÓN IBAGUÉ L.223",
                  "phone": "(4)4442849 EXT400",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:30PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Manizales": {
              "lat": 5.0688901,
              "lng": -75.5173798,
              "stores": {
                "MOVIES MALL PLAZA MANIZALES": {
                  "lat": 5.066538,
                  "lng": -75.491287,
                  "address": "C.C. MALL PLAZA MANIZALES L.2073",
                  "phone": "(4)4442849 EXT 330",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos 10:00AM – 8:00PM y con Festivo 10:00AM – 9:00PM y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
              }
            },
            "Medellín": {
              "lat": 6.229205,
              "lng": -75.570466,
              "stores": {
                "MOVIES CARABOBO": {
                  "lat": 6.247789,
                  "lng": -75.570435,
                  "address": "Carrera 52 N° 46-33.",
                  "phone": "(4) 4442849 EXT 356",
                  "schedules": "Lunes a Sábado de 9:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES GUAYABAL (S)": {
                  "lat": 6.228899,
                  "lng": -75.578049,
                  "address": "Calle 29A Nº 52-92",
                  "phone": "(4)4442849 EXT 407",
                  "schedules": "Lunes a Sábado de 10:00AM – 7:00PM, Domingos y Festivos 10:00AM – 5:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES LA CENTRAL (F)": {
                  "lat": 6.238496,
                  "lng": -75.547501,
                  "address": "C.C. LA CENTRAL, Calle 49 (Ayacucho) Nº 21-38 Local 423",
                  "phone": "(4) 4799740",
                  "schedules": "Lunes a Sábado de 11:00AM – 9:00PM, Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES MAYORCA": {
                  "lat": 6.160683,
                  "lng": -75.604836,
                  "address": "C.C. MAYORCA MEGAPLAZA, Calle 51 Sur Nº 48-57 Local 2040",
                  "phone": "(4)4442849 EXT 371",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES PUERTA DEL NORTE": {
                  "lat": 6.160683,
                  "lng": -75.604836,
                  "address": "C.C. MAYORCA MEGAPLAZA, Calle 51 Sur Nº 48-57 Local 2040",
                  "phone": "(4)4442849 EXT 371",
                  "schedules": "Lunes a Jueves de 11:00AM – 8:00PM, Viernes y Sábado 11:00AM – 9:00PM y Domingos y Festivos 12:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES SANTA FE": {
                  "lat": 6.340481,
                  "lng": -75.604836,
                  "address": "C.C. SANTA FE, Calle 51 Sur Nº 48-57 Local 2040 ",
                  "phone": "(4)4442849 EXT 371",
                  "schedules": "Lunes a Sábado de 10:00AM – 9:00PM, Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES UNICENTRO MEDELLÍN (F)": {
                  "lat": 6.241119,
                  "lng": -75.586888,
                  "address": "C.C UNICENTRO MEDELLIN L. 1-014",
                  "phone": "",
                  "schedules": "Lunes a Sábado de 10:00AM – 9:00PM, Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },              
                "OUTLET MOVIES OLAYA": {
                  "lat": 6.219450,
                  "lng": -75.585274,
                  "address": "Carrera 65 N° 14-76",
                  "phone": "(4)4442849 EXT 354",
                  "schedules": "Lunes a Sábado de 9:30AM – 6:30PM, Domingos 10:00AM – 3:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "OUTLET MOVIES SABANETA": {
                  "lat": 6.155511,
                  "lng": -75.607666,
                  "address": "Carrera 43A Nº 60 Sur - 31",
                  "phone": "(4)4442849 EXT 353",
                  "schedules": "Lunes a Sábado de 9:30AM – 6:30PM, Domingos 9:00AM – 3:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Neiva": {
              "lat": 2.95,
              "lng": -75.288,
              "stores": {
                "MOVIES UNICO NEIVA": {
                  "lat": 2.961589,
                  "lng": -75.288521,
                  "address": "C.C. UNICO NEIVA L.33",
                  "phone": "(4)4442849 EXT 417",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:30PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos 10:00AM – 8:30PM y con Festivo 10:00AM – 9:30PM y Festivos 10:00AM – 8:30PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Pereira": {
              "lat": 4.8133302,
              "lng": -75.6961136,
              "stores": {
                "MOVIES EL PROGRESO": {
                  "lat": 4.835731,
                  "lng": -75.683420,
                  "address": "C.C. EL PROGRESO L.9",
                  "phone": "(4) 444 28 49 ext 365",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM, y Domingos y Festivos 11:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES UNICENTRO PEREIRA (F)": {
                  "lat": 4.809115,
                  "lng": -75.741798,
                  "address": "C.C. UNICENTRO L.3-72  ",
                  "phone": "(6) 3130546 EXT 338",
                  "schedules": "Lunes a Viernes: 10 a.m. - 8 p.m. Sábado: 10 a.m. - 9 p.m. Domingos y Festivos: 10 a.m. - 8 p.m.",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES VICTORIA PLAZA (F)": {
                  "lat": 4.811093,
                  "lng": -75.692879,
                  "address": "C.C. VICTORIA PLAZA L.101",
                  "phone": "(4)4442849 EXT 430",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM, y Domingos y Festivos 11:00AM – 7:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Popayan": {
              "lat": 2.43823,
              "lng": -76.6131592,
              "stores": {
                "MOVIES CAMPANARIO (F)": {
                  "lat": 2.459594,
                  "lng": -76.593937,
                  "address": "C.C. CAMPANARIO L.7",
                  "phone": "(8) 8323203",
                  "schedules": "Lunes a Viernes de 10:00AM – 8:00PM, Sábado 10:00AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Riohacha": {
              "lat": 11.536362,
              "lng": -72.921956,
              "stores": {
                "MOVIES WAJIRA": {
                  "lat": 11.534008,
                  "lng": -72.924255,
                  "address": "C.C. VIVA WAJIIRA L.112",
                  "phone": "(4)4442849 EXT 373",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Rionegro": {
              "lat": 6.146891,
              "lng": -75.378489,
              "stores": {
                "FRABKY MOVIES SAN NICOLAS": {
                  "lat": 6.146966,
                  "lng": -75.377743,
                  "address": "C.C. SAN NICOLAS L.33",
                  "phone": "+57 3104071091",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "San Gil": {
              "lat": 6.5592417717,
              "lng": -73.1352539062,
              "stores": {
                "MOVIES SAN GIL (F)": {
                  "lat": 6.551499,
                  "lng": -73.133781,
                  "address": "C.C. El Puente L.140",
                  "phone": "(7) 7243368",
                  "schedules": "Lunes a Jueves de 9:00AM – 8:00PM, Viernes y Sábado 9:00AM – 9:00PM y Domingos 9:00AM – 8:00PM y con Festivo 9:00AM – 9:00PM y Festivos 9:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Sincelejo": {
              "lat": 9.303229,
              "lng": -75.387948,
              "stores": {              
                "FRANKY MOVIES SINCELEJO (F)": {
                  "lat": 9.301759,
                  "lng": -75.382085,
                  "address": "C.C. GUACARI L.2292",
                  "phone": "(4) 4442849 EXT",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Tunja": {
              "lat": 5.5352802,
              "lng": -73.3677826,
              "stores": {              
                "MOVIES UNICENTRO TUNJA (F)": {
                  "lat": 5.546430,
                  "lng": -73.349666,
                  "address": "C.C. UNICENTRO L.1023",
                  "phone": "(8) 746 30 97",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Urabá": {
              "lat": 5.546430,
              "lng": -73.349666,
              "stores": {              
                "MOVIES NUESTRO URABA": {
                  "lat": 5.546430,
                  "lng": -73.349666,
                  "address": "C.C. NUESTRO URABA L.258",
                  "phone": "(8) 746 30 97",
                  "schedules": "Lunes a Jueves de 11:00AM – 8:00PM, Viernes y Sábado 11:00AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Valledupar": {
              "lat": 10.4631395,
              "lng": -73.2532196,
              "stores": {
                "MOVIES GUATAPURI (F)": {
                  "lat": 10.494901,
                  "lng": -73.269119,
                  "address": "C.C. GUATAPURI L.219",
                  "phone": "(5) 5898147",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES MAYALES (F)": {
                  "lat": 10.455345,
                  "lng": -73.242760,
                  "address": "C.C MAYALES PLAZA L.104",
                  "phone": "(4)4442849 EXT 104",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:00PM, Viernes y Sábado 10:00AM – 9:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Villavicencio": {
              "lat": 4.1420002,
              "lng": -73.6266403,
              "stores": {
                "MOVIES UNICO VILLAVICENCIO (F)": {
                  "lat": 4.129066,
                  "lng": -73.624161,
                  "address": "C.C. UNICO L.25",
                  "phone": "(8) 6784352",
                  "schedules": "Lunes a Jueves de 10:00AM – 8:30PM, Viernes 10:00AM – 9:00PM, Sábado 9:30AM – 9:30PM y Domingos 10:00AM – 8:30PM y con Festivo 10:00AM – 9:00PM y Festivos 10:00AM – 8:30PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "MOVIES VIVA VILLAVICENCIO ": {
                  "lat": 4.125253,
                  "lng": -73.638131,
                  "address": "C.C. VIVA L.137A",
                  "phone": "(4)4442849 EXT 435",
                  "schedules": "Lunes a Jueves de 9:30AM – 8:00PM, Viernes y Sábado 9:30AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                },
                "OUTLET MOVIES UNICENTRO VILLA (F)": {
                  "lat": 4.142464,
                  "lng": -73.633186,
                  "address": "C.C. UNICENTRO L.342",
                  "phone": "(8) 6681400",
                  "schedules": "Lunes a Jueves de 9:30AM – 8:00PM, Viernes y Sábado 9:30AM – 9:00PM y Domingos y Festivos 11:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            },
            "Yopal": {
              "lat": 5.33775,
              "lng": -72.3958588,
              "stores": {
                "MOVIES ALCARAVAN": {
                  "lat": 5.335033,
                  "lng": -72.385427,
                  "address": "C.C. ALCARAVAN L.11",
                  "phone": "(4) 4442849 EXT 439",
                  "schedules": "Lunes a Sábado de 10:00AM – 8:00PM y Domingos y Festivos 10:00AM – 8:00PM",
                  "parqueadero": "",
                  "fax": "",
                  "domicilios": "",
                  "video": "",
                  "images": [""]
                }
              }
            }
          }
        },
    };
    
        return data;
  }
};
$(document).ready(function(){
  mapsStores.init();
});
window.onload = function() {
  setTimeout(function() {
      window.history.pushState({}, document.title, "/" + "tiendas");
  }, 300)
  
  /* Cambio de logo */
  /*$('#map-canvas > div > div > div > div:nth-child(3n) > div > div:nth-child(3n) > div').each(function(){
    var title = $(this).attr('title').toLowerCase();
    console.log('title',title);
    if(title.indexOf('little') > -1) {
      $(this).empty();
      var element = '<img alt="" src="/arquivos/mic-buscador-tienda-2.png" draggable="false" style="position: absolute; left: 0px; top: 0px; user-select: none; width: 44px; height: 44px; border: 0px; padding: 0px; margin: 0px; max-width: none; opacity: 1;">'
      $(this).append(element);
    }
 });*/
};