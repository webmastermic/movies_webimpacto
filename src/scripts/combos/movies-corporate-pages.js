var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.

require("../vendor/vtex-smartResearch.min");
require("../vendor/pagination.min");

var funcionalidadesPaginasCorporativas = function () {

	// Variables globales.
	// html y filtros se declaran globales para optimizar función
	// cambiarPosicionFiltros en evento scroll.
	var html, body;

	var init = function () {
		// Variables.
		html = $jq("html");
		body = $jq("body");

		makeCorporateCollapsible();
		manageMenuActive();
		customizeFormSelect();
		if($('#form_cliente_contacto').length > 0) {
			formContactoCliente();
		}

		document.addEventListener("click", closeAllSelect);
		initCollapse();
    };
	
	var makeCorporateCollapsible = function() {
		var coll = document.getElementsByClassName("corporate-menu-collapsible");
		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var content = this.nextElementSibling;
				if (content.style.maxHeight === "1000px") {
					content.style.maxHeight = "0";
				} else {
					content.style.maxHeight = "1000px";
				}
			});
		}
	}

    var manageMenuActive = function() {
		if (window.location.href.indexOf("sobre-nosotros") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[0].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("trabaja-con-nosotros") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[1].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("trabaja-con-nosotros") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[1].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("legales") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[2].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("terminos-y-condiciones") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[3].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("politicas-de-privacidad") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[4].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("aviso-de-privacidad") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[0].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[5].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("contactanos") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[0].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("preguntas-frecuentes") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[1].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("como-comprar") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[2].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("reversiones") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[3].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("retracto") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[4].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("garantia-de-productos") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[5].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("cambios-y-devoluciones") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[6].classList.add('active');
				}
			}
		}
		if (window.location.href.indexOf("queremos-cuidarte") > -1) {
			var collapsibleElements = $('.corporate-menu .corporate-menu-list .corporate-content-collapsible');
			if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
				var item = collapsibleElements[1].firstElementChild;
				if(typeof collapsibleElements !== "undefined" && collapsibleElements != null) {
					item.children[7].classList.add('active');
				}
			}
		}
	}

	var customizeFormSelect = function() {
		x = document.getElementsByClassName("custom-select");
		for (i = 0; i < x.length; i++) {
		selElmnt = x[i].getElementsByTagName("select")[0];

		a = document.createElement("DIV");
		a.setAttribute("class", "select-selected");
		a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
		x[i].appendChild(a);
		
		b = document.createElement("DIV");
		b.setAttribute("class", "select-items select-hide");
		for (j = 1; j < selElmnt.length; j++) {
			c = document.createElement("DIV");
			c.innerHTML = selElmnt.options[j].innerHTML;
			c.addEventListener("click", function(e) {
				var y, i, k, s, h;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				h = this.parentNode.previousSibling;
				for (i = 0; i < s.length; i++) {
				if (s.options[i].innerHTML == this.innerHTML) {
					s.selectedIndex = i;
					h.innerHTML = this.innerHTML;
					y = this.parentNode.getElementsByClassName("same-as-selected");
					for (k = 0; k < y.length; k++) {
					y[k].removeAttribute("class");
					}
					this.setAttribute("class", "same-as-selected");
					break;
				}
				}
				h.click();
			});
			b.appendChild(c);
		}
		x[i].appendChild(b);
		a.addEventListener("click", function(e) {
			e.stopPropagation();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
			});
		}
	}

	var closeAllSelect = function(elmnt) {
		var x, y, i, arrNo = [];
		x = document.getElementsByClassName("select-items");
		y = document.getElementsByClassName("select-selected");
		for (i = 0; i < y.length; i++) {
			if (elmnt == y[i]) {
			arrNo.push(i)
			} else {
			y[i].classList.remove("select-arrow-active");
			}
		}
		for (i = 0; i < x.length; i++) {
			if (arrNo.indexOf(i)) {
			x[i].classList.add("select-hide");
			}
		}
	}

	var formContactoCliente = function() {
		$("#contacto_enviar").click(function(e){
			e.preventDefault();
			e.stopPropagation();
			var emailRegexp = /\S+@\S+\.\S+/;
			var phoneRegexp = /^[0-9]*$/;

			var obj = {
				"asunto": $('#contacto_asunto').val(),
				"ciudad": $('#contacto_ciudad').val(),
				"correo": $('#contacto_correo').val(),
				"mensaje": $("#contacto_mensaje").val(),
				"nombre": $("#contacto_nombre").val(),
				"telefono": $("#contacto_telefono").val()
			};

			if(obj.nombre != "" && obj.correo != "" && obj.correo != "" && emailRegexp.test(obj.correo) && obj.asunto != "vacio" && obj.telefono != "" && phoneRegexp.test(obj.telefono)) {
				saveContacto(obj, function(data){
					//console.log(data);
				});
				alert('Formulario enviado con éxito');
				window.location.href = "/"
			} else {
				alert('Debe rellenar los campos obligatorios');
			}
		});
	}

	var saveContacto = function(obj, callback) {
		var request = {
			crossDomain: true,
			async: true,
			cache: false,
			url: "/moviesshopco/dataentities/CT/documents/",
			data: JSON.stringify(obj),
			type: "PUT",
			headers: {
				"content-type": "application/json"
			}
		};
	
		$.ajax(request).success(function (res) {
			if (typeof(callback) != "undefined") {
				callback(res);
			}
			return res;
		}).error(function () {
			displayErrorMsg('HA OCURRIDO UN ERROR DURANTE EL PROCESO DE REGISTRO, POR FAVOR RECARGA LA PÁGINA Y VUELVE A INTENTARLO');
		});
	}

	var displayErrorMsg = function(msg) {
        $("div.mensaje-error").html("<span class='error-nn'>" + msg + "</span>");
	}

	var initCollapse= function(){
		var collapse=$(".corporate-menu-item.corporate-menu-collapsible");

		var page=window.location.href;

		if((page.indexOf("sobre-nosotros") > -1) || (page.indexOf("trabaja-con-nosotros") > -1) || (page.indexOf("legales") > -1) 
		|| (page.indexOf("terminos-y-condiciones") > -1)|| (page.indexOf("politicas-de-privacidad") > -1) || (page.indexOf("aviso-de-privacidad") > -1)){
			collapse[0].click();
		}

		if((page.indexOf("contactanos") > -1) || (page.indexOf("preguntas-frecuentes") > -1) || (page.indexOf("como-comprar") > -1) 
		|| (page.indexOf("reversiones") > -1) || (page.indexOf("retracto") > -1) || (page.indexOf("garantia-de-productos") > -1)
		|| (page.indexOf("cambios-y-devoluciones") > -1) || (page.indexOf("queremos-cuidarte") > -1)){
			collapse[1].click();
		}
	}
	

	return {
		init:init,
	};

}();

$jq(document).ready(function () {
	// Funciones a ejecutar en DOM Ready.
	funcionalidadesPaginasCorporativas.init();

});

module.exports.funcionalidadesPaginasCorporativas = funcionalidadesPaginasCorporativas;