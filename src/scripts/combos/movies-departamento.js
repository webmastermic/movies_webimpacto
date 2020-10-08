var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var globales = require("../base/globales");

var funcionalidadesDepartamento = function () {

	var init = function () {

		//funciones
		agregarSlickBanners();
		sliderVitrinas();
		eliminarParentesis();
		toggleBannerPrincipal();
	};

	var toggleBannerPrincipal = function () {
		$jq('.menu-depto__link, .banner-principal__menu .icon-close').click(function () {
			$jq('.banner-principal__menu').toggle();
		});
	}

	var agregarSlickBanners = function () {

		//slider vitrinas
		$jq('.ff-departamento .slider-categorias .slider ul').slick({
			dots: true,
			infinite: false,
			speed: 300,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 640,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});

	}

	var sliderVitrinas = function () {
		//slider vitrinas
		$jq('.ff-departamento .helperComplement').remove();
		$jq('.ff-vitrine .ff-main-shelf ul').slick({
			dots: true,
			infinite: false,
			speed: 300,
			slidesToShow: 4,
			slidesToScroll: 4,
			responsive: [
				{
					breakpoint: 1000,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						infinite: true,
						dots: true
					}
				},
				{
					breakpoint: 640,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	}

	var eliminarParentesis = function () {
		$('.menu-departamento a').each(function () {
			var textosinParentesis = $(this).text().replace(/ *\([^)]*\) */g, "");
			$(this).text(textosinParentesis);
		});
	}

	// Funciones públicas.
	return { init: init };

}();

$jq(document).ready(function () {

	// Funciones a ejecutar en DOM Ready.
	funcionalidadesDepartamento.init();

});
