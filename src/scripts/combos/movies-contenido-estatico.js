var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var globales = require("../base/globales");

var funcionalidadesPaginasEstaticas = function () {

	var init = function () {
	valida();
	};
	function valida(){
	$("#formSuscri").validate({
		rules:{
			'132640':{
				required: true
			},
			'132641': {
				required: true
			},
			'email': {
				email   : true,
				required: true
			}
			,
			'132643': {
				required: true
			}
		},
		messages:{
			'132640':{
				required: 'Por favor ingresa tu nombre'
			},
			'132641': {
				required: 'Por favor ingresa tus apellidos'
			},
			'email': {
				email   : 'El formato del email debe ser example@example.com',
				required: 'Por favor ingresa tu email'
			},
			'132643': {
				required: 'Por favor selecciona el sexo al que perteneces'
			}
		},
		errorElement: "span",
		errorPlacement: function ( error, element ) {
			//$('.errorInput').css('color','#E61E84');

			element.siblings('.errorInput').html(error.html());
		//	setTimeout(function(){  $('.errorInput').html('');}, 3000);
		},
		submitHandler: function(form){
			localStorage.setItem('firstBuyRigistered',3);
			form.submit();
		}
	});
	}

	// Funciones públicas.
	return {init:init};

}();

$jq(document).ready(function () {
	
	funcionalidadesPaginasEstaticas.init();

});
