var globales = require("../base/globales");

var funcionalidadesMyaccount = function () {
    // Variables globales.
	// html y filtros se declaran globales para optimizar función
	// cambiarPosicionFiltros en evento scroll.

	var init = function () {
		// Variables.
		toggleMarker();
		buttonReturn();
        // Listeners de eventos.
        
		// Funciones a ejecutar.		
		   
	}
	
	var toggleMarker = function() {
		$(document).on("click","#content #siteNotice .hora",function(){
			$(this).css("background","#fff");
			$(this).siblings().css("background","#ccc");
			$(this).parents().siblings('.Horario-tienda').css("display","block");
			$(this).parents().siblings('#bodyContent').css("display","none");                        
		});

		$(document).on("click","#content #siteNotice .info",function(){
			$(this).css("background","#fff");
			$(this).siblings().css("background","#ccc");
			$(this).parents().siblings('#bodyContent').css("display","block");
			$(this).parents().siblings('.Horario-tienda').css("display","none");
		});
	}

	var buttonReturn = function() {
		$(document).on("click",".button-page-anterior a",function(){
			window.history.go(-1);
		});
	}

    return {
		init:init,
	};

}();

$(document).ready(function () {
	// Funciones a ejecutar en DOM Ready.
	funcionalidadesMyaccount.init();
    //console.log("");
});