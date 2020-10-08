var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var globales = require("../base/globales");
require("../vendor/vtex-smartResearch.min");
require("../vendor/pagination.min");

var funcionalidadesCategoria = function () {

	// Variables globales.
	// html y filtros se declaran globales para optimizar función
	// cambiarPosicionFiltros en evento scroll.
	var html, body, filtros, filtrosOffset;
	var isFilterFixed = false;

	var init = function () {
		// Variables.
		html = $jq("html");
		body = $jq("body");
        filtros = $jq(".contenedor-filtros");
        orders = $jq("#ordering");
		// Listeners de eventos.
        
		moveOrders();
        toggleFiltrosLeft();
        markeCollapsibleSingleNavigator();
		nameColorFiltroConfig();
		displayGrid();
		aplySmartResearch();
		//ordenarFiltrosCategorias();
		ordenFiltrosField();
		ocultarFiltroGenero();
		changeNavigatorSearch();
		isCollection();

		translateOrderBy();
		hackOutOfStock();
		cargascrollLoading();
		//colorFiltroLateral();
		//volverArriba();
		
		globales.funcionalidadesGenerales.ajustarPrecioVitrinas();
    };
    
    var moveOrders = function() {
        orders.append($jq('#O'));
	}
	


	var toggleFiltrosLeft = function(){
		
		//funciones al Search Mulpiple Navigator
		
		$('.search-multiple-navigator fieldset h5').click(function(){
			$(this).siblings('div').toggleClass('display');			
			$(this).toggleClass('display');
		});

		//funciones al Search Single Navigator

		$('.search-single-navigator h4').click(function(){
			$('.search-single-navigator .masculino').toggleClass('display');
			$(this).toggleClass('display');
		});

		$('.search-single-navigator .HideMarca').click(function(){
			$('.search-single-navigator .Marca').toggleClass('display');
			$(this).toggleClass('display');
		});
		$('.search-single-navigator .HidePersonaje').click(function(){
			$('.search-single-navigator .Personaje').toggleClass('display');
			$(this).toggleClass('display');
		});
		$('.search-single-navigator .HideColor').click(function(){
			$('.search-single-navigator .Color').toggleClass('display');
			$(this).toggleClass('display');
		});
		$('.search-single-navigator .HideTalla').click(function(){
			$('.search-single-navigator .Talla').toggleClass('display');
			$(this).toggleClass('display');
		});

		if ($(window).width() < 992) {
			var filter = '<div class="title-filters"><div class="filters"><p class="mic-filter"></p>Filtrar por</div></div>';				
            $('.menu-departamento > div ').prepend(filter);
			var volver = '<div class="turn-back"><div class="contenedor"><p class="mic-arrow-right"></p>VOLVER</div><div class="contenedor-limpiar">Limpiar Filtro<p class="mic-exit"></p></div></div>';				
			$('.menu-departamento > div ').prepend(volver);			
			$('#category-body-organize #filters').click(function(){
				$('#category-body-content .category-body-content-left').addClass('active');
			});	
			$('.category-body-content-left .turn-back .contenedor').click(function(){
				$('#category-body-content .category-body-content-left').removeClass('active');
			});			
			$(".category-body-content-left .turn-back .contenedor-limpiar").click(function() {
				$(".search-multiple-navigator label").each(function() {
					$(this).hasClass("sr_selected") && ($(this).trigger("click"), $(".filtros-bc span:not(.filtros-aplicados)").hide())
				});
				$('.box-banner.active, .box-banner .active').removeClass('active');
				$(".filtros-bc").hide();
			})
		}                
	}

    var markeCollapsibleSingleNavigator = function() {
		if($('body').hasClass('resultado-busca')) {
			$('.search-single-navigator').find('h3').addClass('single-navigator-collapsible');
			$('.search-single-navigator h3').find('span').remove();
			$('.search-single-navigator').find('ul').addClass('single-navigator-content');

			var coll = document.getElementsByClassName("single-navigator-collapsible");
			var i;

			for (i = 0; i < coll.length; i++) {
				coll[i].addEventListener("click", function() {
					this.classList.toggle("active");
					var content = this.nextElementSibling;
					if (content.style.maxHeight === "1000px") {
						content.style.maxHeight = "0";
						content.style.display = "none";
					} else {
						content.style.maxHeight = "1000px";
						content.style.display = "block";
					}
				});
			}
		}
		if($('body').hasClass('movies-marca')) {
			$('.search-single-navigator').find('h3').addClass('single-navigator-collapsible');
			$('.search-single-navigator h3').find('span').remove();
			$('.search-single-navigator').find('ul').addClass('single-navigator-content');

			var coll = document.getElementsByClassName("single-navigator-collapsible");
			var i;

			for (i = 0; i < coll.length; i++) {
				coll[i].addEventListener("click", function() {
					this.classList.toggle("active");
					var content = this.nextElementSibling;
					if (content.style.maxHeight === "1000px") {
						content.style.maxHeight = "0";
						content.style.display = "none";
					} else {
						content.style.maxHeight = "1000px";
						content.style.display = "block";
					}
				});
			}
		}
    }
    
	var nameColorFiltroConfig = function () {
		setTimeout(function(){
			$('.filtro_color div label').each(function () {
				var cadena = $(this).text();
				var color = cadena.split("_");
				var valor = color[0];
				customHtml="<div class='colores'>";
				customHtml+='<span>'+valor+'</span>';
				$(this).append(customHtml);
				$(this).css('font-size','0');
			});
		},500);
	}

	var displayGrid = function () {	

		$('#category-body-organize .grids .grid1').click(function(){
			$(this).addClass('active');
			$('#category-body-organize .grids .grid2').removeClass('active');
			$('#category-body-organize .grids .grid3').removeClass('active');
			$('.category-body-content-right .prateleira ul li').addClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid2');
			$('.category-body-content-right .prateleira ul li').removeClass('grid3');
		});
	
		$('#category-body-organize .grids .grid2').click(function(){
			$(this).addClass('active');
			$('#category-body-organize .grids .grid1').removeClass('active');
			$('#category-body-organize .grids .grid3').removeClass('active');
			$('.category-body-content-right .prateleira ul li').addClass('grid2');
			$('.category-body-content-right .prateleira ul li').removeClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid3');
		});

		$('#category-body-organize .grids .grid3').click(function(){
			$(this).addClass('active');
			$('#category-body-organize .grids .grid1').removeClass('active');
			$('#category-body-organize .grids .grid2').removeClass('active');
			$('.category-body-content-right .prateleira ul li').addClass('grid3');
			$('.category-body-content-right .prateleira ul li').removeClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid2');
		});
		if ($(window).width() < 992) {
			$('#category-body-organize #grids .grid2').addClass('active');
			$('#category-body-organize .grids .grid1').show();
			$('#category-body-organize .grids .grid2').hide();
			$('#category-body-organize .grids .grid1').click(function(){
				$(this).addClass('active');
				$('#category-body-organize .grids .grid2').removeClass('active');
				$('#category-body-organize .grids .grid1').hide();
				$('#category-body-organize .grids .grid2').show();
				$('.category-body-content-right .prateleira ul li').addClass('grid1');
			});
	
			$('#category-body-organize .grids .grid2').click(function(){
				$(this).addClass('active');
				$('#category-body-organize .grids .grid1').removeClass('active');
				$('#category-body-organize .grids .grid1').show();
				$('#category-body-organize .grids .grid2').hide();
				$('.category-body-content-right .prateleira ul li').addClass('grid2');
				$('.category-body-content-right .prateleira ul li').removeClass('grid1');
			});
		};		
	}

	var ordenarFiltrosCategorias = function(){		
		$.each($('.search-multiple-navigator fieldset'),function(i,v){
			var datos = $(v).find('label').sort(function(a,b){
				if(!isNaN(parseInt(a.textContent)) && !isNaN(parseInt(b.textContent))){
					if(parseInt(a.textContent) < parseInt(b.textContent)){
						return -1;
					}else{
						return 1;
					}
				}else{
					if(a.textContent < b.textContent){
						return -1;
					}else{
						return 1;
					}
				}
			});
			$(v).children('div').append(datos);
		});
	}

	var ordenFiltrosField = function() {
		$.each($('.search-multiple-navigator'),function(i,v){
			$(this).find('fieldset.filtro_faixa-de-preco').appendTo(this);
			$(this).find('fieldset.filtro_edad').appendTo(this);
			$(this).find('fieldset.filtro_color').appendTo(this);
			$(this).find('fieldset.filtro_talla').appendTo(this);
			$(this).find('fieldset.filtro_genero').appendTo(this);
			$(this).find('fieldset.filtro_categoria').appendTo(this);
			$(this).find('fieldset.filtro_marca').appendTo(this);
			$(this).find('fieldset.filtro_personaje').appendTo(this);
		})
	}

	var aplySmartResearch = function () {
		$("#departament-navegador input[type='checkbox']").vtexSmartResearch({
			filterErrorMsg: "¡Ha habido un error al intentar filtrar la página!",
			filterScrollTop: function(shelfOffset) {
				return shelfOffset.top - 80
			},
			callback: function() {
				var wrapper = $(".search-multiple-navigator, .search-single-navigator");
				wrapper.find("h3").addClass("display");
				wrapper.find("h3 + ul").show();
				wrapper.find("h3 + div").show();
				wrapper.find("h5 + ul").hide();
				wrapper.find("h5 + div").hide();				
			},
			ajaxCallback: function () {				
				globales.funcionalidadesGenerales.porcentajeDescuento();
				globales.funcionalidadesGenerales.clicktallas();
				globales.funcionalidadesGenerales.dispHover();
				globales.funcionalidadesGenerales.changeBuyButtonText();
				globales.funcionalidadesGenerales.nameTallaConfig();								
				globales.funcionalidadesGenerales.confignumberPrice();
				displayGrid();
				hackOutOfStock();
				cargascrollLoading();
				//$('#grids div').removeClass('active');
			},
			shelfCallback:function(){
				globales.funcionalidadesGenerales.porcentajeDescuento();
				globales.funcionalidadesGenerales.clicktallas();
				globales.funcionalidadesGenerales.dispHover();
				globales.funcionalidadesGenerales.changeBuyButtonText();
				globales.funcionalidadesGenerales.nameTallaConfig();
				globales.funcionalidadesGenerales.confignumberPrice();
				displayGrid();
				hackOutOfStock();
				cargascrollLoading();
				//$('#grids div').removeClass('active');
            },
			emptySearchMsg: '<h3>¡Esta combinación de filtros no ha devuelto ningún resultado!</h3>',
		})
	}

	var cargascrollLoading = function() {
		
		var grid1 = $('#category-body-organize #grids .grid1').hasClass('active');
		var grid2 = $('#category-body-organize #grids .grid2').hasClass('active');
		var grid3 = $('#category-body-organize #grids .grid3').hasClass('active');			
		if(grid1){
			$('.category-body-content-right .prateleira ul li').addClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid2');
			$('.category-body-content-right .prateleira ul li').removeClass('grid3');			
		}else if(grid2){
			$('.category-body-content-right .prateleira ul li').addClass('grid2');
			$('.category-body-content-right .prateleira ul li').removeClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid3');			
		}else if(grid3){
			$('.category-body-content-right .prateleira ul li').addClass('grid3');
			$('.category-body-content-right .prateleira ul li').removeClass('grid1');
			$('.category-body-content-right .prateleira ul li').removeClass('grid2');
		}else{
			
		}
	}

	var ocultarFiltroGenero = function(){
		if(location.search.indexOf('map=productClusterIds') !== -1){
			$('.filtro_genero').css('display','block');
		}else{
			$('.filtro_genero').css('display','none');
		}
	};

	var changeNavigatorSearch = function() {
		$('#departament-navegador .navigation').addClass('navigation-tabs');
		$('#departament-navegador .navigation').removeClass('navigation');
	}

	var isCollection = function(){
		var urlPath = window.location.pathname;
		/*--------------------MIC-----------------------*/
		if(urlPath.indexOf("/157") > -1){
			$('.category-header-name h1').html('New Arrivals');	
		} else if (urlPath.indexOf("/156") > -1){
			$('.category-header-name h1').html('Express Mujer');				
		} else if (urlPath.indexOf("/155") > -1) {
			$('.category-header-name h1').html('Express Hombre');		
			$('#category-header img.desktop').attr("src","/arquivos/BANNER_CAT_HOMBRE_DESKTOP.png");
            $('#category-header img.mobile').attr("src","/arquivos/BANNER_CAT_HOMBRE_MOBILE.png");		
		} else if (urlPath.indexOf("/151") > -1){
			$('.category-header-name h1').html('Camisetas');				
		} else if (urlPath.indexOf("/153") > -1){
			$('.category-header-name h1').html('Buzos y Chaquetas');				
		} else if (urlPath.indexOf("/152") > -1){
			$('.category-header-name h1').html('Pijamas');				
		} else if (urlPath.indexOf("/150") > -1){
			$('.category-header-name h1').html('SALE Mujer');				
		} else if (urlPath.indexOf("/148") > -1){
			$('.category-header-name h1').html('SALE');				
		} else if (urlPath.indexOf("/149") > -1) {
			$('.category-header-name h1').html('SALE Hombre');				
			$('#category-header img.desktop').attr("src","/arquivos/BANNER_CAT_HOMBRE_DESKTOP.png");
            $('#category-header img.mobile').attr("src","/arquivos/BANNER_CAT_HOMBRE_MOBILE.png");
		} else if (urlPath.indexOf("/146") > -1) {
			$('.category-header-name h1').html('Novedades Mujer');				
		} else if (urlPath.indexOf("/147") > -1) {
			$('.category-header-name h1').html('Express');
		} else if (urlPath.indexOf("/145") > -1) {
			$('.category-header-name h1').html('Novedades Hombre');				
			$('#category-header img.desktop').attr("src","/arquivos/BANNER_CAT_HOMBRE_DESKTOP.png");
            $('#category-header img.mobile').attr("src","/arquivos/BANNER_CAT_HOMBRE_MOBILE.png");
		} else if (urlPath.indexOf("/144") > -1) {
			$('.category-header-name h1').html('Protección');				
		} else if (urlPath.indexOf("/143") > -1) {
			$('.category-header-name h1').html('Exclusivo Mujer');
		} else if (urlPath.indexOf("/142") > -1) {
			$('.category-header-name h1').html('Exclusivo Hombre');
			$('#category-header img.desktop').attr("src","/arquivos/BANNER_CAT_HOMBRE_DESKTOP.png");
            $('#category-header img.mobile').attr("src","/arquivos/BANNER_CAT_HOMBRE_MOBILE.png");
		} else if (urlPath.indexOf("/139") > -1) {
			$('.category-header-name h1').html('Mujer');
		} else if (urlPath.indexOf("/140") > -1) {
			$('.category-header-name h1').html('Accesorios');
		} else if (urlPath.indexOf("/137") > -1) {
			$('.category-header-name h1').html('Colección Express');
		} else if (urlPath.indexOf("/138") > -1) {
			$('.category-header-name h1').html('Hombre');
			$('#category-header img.desktop').attr("src","/arquivos/BANNER_CAT_HOMBRE_DESKTOP.png");
            $('#category-header img.mobile').attr("src","/arquivos/BANNER_CAT_HOMBRE_MOBILE.png");
		}
		$(window).load(function () {
			$('#category-header').css("visibility","visible");
		});
	}

	var toggleFiltros = function () {
		globales.funcionalidadesGenerales.toggleFiltros(this)
	}

	var colorFiltroLateral = function(){
		$('.filtro_color > div > label').each(function(){
			var bgc   = $(this).attr('title');
			var pos   = bgc.indexOf('#');
			var color = bgc.substring(pos);
			$(this).css('background-color', color);
		});
	}
	var translateOrderBy = function() {
		$('.ordering #O option:first-child').text("Ordenar por");
		$('.ordering #O option[value="OrderByPriceASC"]').text("Mejor Precio");
		$('.ordering #O option[value="OrderByPriceDESC"]').text("Mayor Precio");
		$('.ordering #O option[value="OrderByTopSaleDESC"]').text("Más Vendidos");
		$('.ordering #O option[value="OrderByReviewRateDESC"]').text("Mejor Evaluados");
		$('.ordering #O option[value="OrderByReleaseDateDESC"]').text("Fecha de lanzamiento");
		$('.ordering #O option[value="OrderByBestDiscountDESC"]').text("Mejor Descuento");		
	}
	
	var hackOutOfStock = function() {
		var element = $('#category-page .attribute-product .out-of-stock');
		if(typeof element !== "undefined" && element != null) {
			element.text('agotado');
			element.parent().prev().prepend(element);
		}
		element.siblings('.button-product').remove();
	}

	var orderByMobile = function(){
		var pathName = window.location.pathname;
		var list     = '';

		$('#O:first > option').each(function() {
			var currentVal  = $(this).val();
			var currentText = $(this).text();
			var link     = pathName + '?=' + currentVal;

			if (currentVal){
		    	list += '<li>' +
			    		'<a href="' + link + '">' + currentText + '<i class="icon-angle"></i></a>' +
		    		'</li>';
			}
		});

		$('.filters__ordenar > ul').html(list);
	}

	//mostrar filtros en mobile

	var filterByMobile = function(){
		if( $( ".filters__filter" ).is( ':visible' ) )
			$( ".filters__filter" ).slideUp(400);
		else
			$( ".filters__filter" ).slideDown(400);
	};

	var orderByMobileFilter = function(){
		if( $( ".filters__ordenar" ).is( ':visible' ))
			$( ".filters__ordenar" ).slideUp(400);
		else
			$( ".filters__ordenar" ).slideDown(400);
	}

	var showfiltersmobile = function(){

		$('.filter_link__filtrar, .filters__filter > .icon-close').click(function(){
			if( $( ".filters__ordenar" ).is( ':visible' )){
				orderByMobileFilter();
			}
			filterByMobile();
		});


		$('.filter_link__ordenar, .filters__ordenar > .icon-close').click(function(){
			if( $( ".filters__filter" ).is( ':visible' )){
				filterByMobile();
			}
			orderByMobileFilter();
		});
	}

	// Funcionalidad para poner el sidebar copiandolo del menú principal.
	var ponerSideBar = function (depto) {
		var categoryName   = vtxctx.categoryName ? vtxctx.categoryName.toLowerCase() : '';
		var departmentName = vtxctx.departmentName ? vtxctx.departmentName.toLowerCase() : '';
		var currentURL     = window.location.pathname.split('/');
		var filterCategorySidebarMenu = $('.filters__categorias .site-nav__submenu--has-sub-submenu.site-nav__' + categoryName );

		if ( !categoryName &&  !departmentName && vtxctx.searchTerm)  {
			$('.site-nav__' +  currentURL[1].toLowerCase() + ' > .site-nav__link' ).addClass('active');
			$jq('.filters__categorias').hide();
			$jq('.filters__categorias').removeClass("filters__categorias");
			return;
		}

		var ul = $('.site-nav__' +  departmentName + ' > .site-nav__submenu' );
		ul.clone().appendTo('.filters__categorias');

		if (filterCategorySidebarMenu.length) {
			filterCategorySidebarMenu.children('a').addClass('active');
		} else{
			var cat = $('.filters__categorias a[href*=' + categoryName.replace(/\s/g,"-") + ']').first();
			if (cat.length) {
				cat.addClass('active');
			}else{
				var currentURL = currentURL[2] ? currentURL[2].toLowerCase() : '';
				if ((currentURL != categoryName) && currentURL) {
                    // $('.filters__categorias .site-nav__submenu--has-sub-submenu.site-nav__' + currentURL ).children().eq(0).addClass('active');
					$('.filters__categorias .site-nav__submenu--has-sub-submenu.site-nav__' + currentURL ).children().addClass('active');
				}
			}
		}
	}

	// Funcionalidad del acordeon en el sidebar.
	var validarAccordionSideBar = function (e) {
		if ($jq(window).width() > 1000) {
			e.preventDefault();
			globales.funcionalidadesGenerales.toggleAccordion(this);
		};
	};

	//traducción de selector - Ordenar por
	var changeTextLanguage = function(){
        $(' .orderBy select option').each(function(indexOption,valueOption){
            if ($(valueOption).text() == 'Selecione'){
                $(valueOption).text('Ordenar por')
            }
            if ($(valueOption).text() == 'Menor Preço'){
                $(valueOption).text('Menor Precio')
            }
            if ($(valueOption).text() == 'Maior Preço'){
                $(valueOption).text('Mayor Precio')
            }
            if ($(valueOption).text() == 'Mais vendidos'){
                $(valueOption).text('Más Vendidos')
            }
            if ($(valueOption).text() == 'Melhores avaliações'){
                $(valueOption).text('Los Mejores Calificados')
            }
            if ($(valueOption).text() == 'A - Z'){
                $(valueOption).text('A - Z')
            }
            if ($(valueOption).text() == 'Z - A'){
                $(valueOption).text('Z - A')
            }
            if ($(valueOption).text() == 'Data de lançamento'){
                $(valueOption).text('Lo Nuevo')
            }
            if ($(valueOption).text() == 'Melhor Desconto'){
                $(valueOption).text('Mejor Descuento')
            }
        });
    };

		var setPagination = function(primera_carga,last_search){
		if(typeof primera_carga == "undefined")
			primera_carga = true;
		if(typeof last_search == "undefined")
			last_search = '';
        $('.cat-container__products__vitrine #paginador').remove();
        $('.cat-container__products__vitrine #counter-products').remove();
        $('.cat-container__products__vitrine').append('<div id="counter-products"></div><div id="paginador"></div>');
        var num_prods_first = 0;
        if($('.searchResultsTime .resultado-busca-numero .value').length && primera_carga){
            num_prods_first = $('.searchResultsTime .resultado-busca-numero .value').html();
        }
        var total_pages = 10;
        var visible_pages = 3;
        if(primera_carga){
            visible_pages = 5;
        }
        if(num_prods_first != 0 && primera_carga){
            total_pages = ( getUrlParameter('PS') == undefined && getUrlParameter('Ps') == undefined && getUrlParameter('ps') == undefined && getUrlParameter('pS') == undefined ) ? parseInt(num_prods_first) / 12 : (parseInt(num_prods_first)/parseInt(getUrlParameter('PS'))) ;
            if (total_pages != Math.floor(total_pages)) {
                total_pages = parseInt(total_pages) +1;
            }
            if( total_pages > 50 ){
                num_prods_first = Math.floor(num_prods_first*50/total_pages); // Se agrega una validación para la cantidad máxima de páginas permitadas por VTEX, después de la 50 no trae más productos.
                total_pages = 50;
            }
            $('.cat-container__products__vitrine #counter-products').append('Página <span class="pag-actual">1</span> de <span class="total-pages">'+total_pages+'.</span> Total <span class="total-products">'+num_prods_first+'</span> productos.');
        }else{
            try {
                var total_products = getTotalProductsLastSearch(last_search);
                if (total_products) {
                    total_pages = ( getUrlParameter('PS') == undefined && getUrlParameter('Ps') == undefined && getUrlParameter('ps') == undefined && getUrlParameter('pS') == undefined ) ? parseInt(total_products) / 12 : (parseInt(total_products)/parseInt(getUrlParameter('PS'))) ;
                    if (total_pages != Math.floor(total_pages)) {
                        total_pages = parseInt(total_pages) + 1;
                    }
                    if( total_pages > 50 ){
                        total_products = Math.floor(total_products*50/total_pages);
                        total_pages = 50;
                    }
                    if (total_pages < 5) {
                        visible_pages = total_pages;
                    }else{
                        visible_pages = 5;
                    }
                    $('.cat-container__products__vitrine #counter-products').append('Página <span class="pag-actual">1</span> de <span class="total-pages">'+total_pages+'.</span> Total <span class="total-products">'+total_products+'</span> productos.')
                }
            }catch (exception) {
                console.log('[ERROR] Error al obtener el num total de productos de la busqueda');
            }
        }
        if($('.pag-hidden').length){
            $('.pag-hidden').remove();
        }
        var html = '<div class="pag-hidden" style="display:none">';
        for(var i = 1; i<=total_pages; i++ ){
            html+= '<span class="hidden-pag-'+i+'">'+i+'</span>';
        }
        html+=' </div>';
        $('#paginador').prepend(html);
        $('.top.pagination').remove();
        $('#paginador').twbsPagination({
            totalPages: total_pages,
            visiblePages: visible_pages,
            next: '>',
            prev: '<',
            last: 'ÚLTIMO',
            first: 'PRIMERO',
            onPageClick: function (event, page) {
                $('.pag-hidden .hidden-pag-'+page).click();
                if( window.innerWidth < 769 ){ // Si estamos en mobile agrega la página actual y la cantidad de páginas entre los dos textos del paginador
                    var actual = $('.pag-actual').text();
                    var total = $('.total-pages').text().split('.')[0];
                    $('<li class="page-item qty">'+actual +' / '+ total +'</li>')
                    .insertAfter($('li.page-item.prev'));
                }
            }
        });
    }
    var getTotalProductsLastSearch = function(last_search){
        var result = false;
        var urlToFind = '';
        if (last_search != '' && typeof last_search != 'undefined') {
            var params = last_search.split('&');
            var first_param = params[0].split('?');
            var filter_params = params.map(function (value) {
                return  value.indexOf('fq=') !== -1 && value
            }).filter(function( value ){
                return value !== false
            });
            var urlToFind = "/api/catalog_system/pub/products/search?"+first_param[1]+'&O=OrderByReleaseDateDESC&_from=0&_to=1';
            $.each(filter_params, function(index, value){
                index > 0 ? urlToFind += '&'+value: "";
            });
            var cantidadTotal = 0;
            $.ajax({
                type: 'GET',
                url: urlToFind,
                async: false,
                cache: true,
                success: function (json, status, xhr)
                {
                    cantidadTotal = (xhr.getResponseHeader("resources").split("/")[1]);
                },
                complete: function (jqXHR, textStatus) {
                    result = cantidadTotal;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    result = false;
                }
            });
        }
        return result;
	}
	function animatePagination(animar){
		if(animar){
			$('body').append('<div class="wim-pagination-frame-container"><div class="wim-pagination-frame"></div></div>');
		}else{
			setTimeout(function(){
				$('html, body').animate({
					scrollTop: $("body").offset().top
				}, 0);
				var isApp = (window.location != window.parent.location)
				? document.referrer.search('customapp')
				: document.location.href.search('customapp');
				if (isApp != -1) {
					console.log("esApp");
					parent.postMessage("top","*");
				}
				setTimeout(function(){
					$('.wim-pagination-frame-container').remove();
				},600);
			},400);
		}
	}
    var getUrlParameter = function(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
	}

	var activarBannerCyberDays = function(){
		$('.cyberDays').css('display','block');
	}

	return {
		init:init,
		cargascrollLoading:cargascrollLoading
	};

}();

$jq(document).ready(function () {
	// Funciones a ejecutar en DOM Ready.
	funcionalidadesCategoria.init();
});

$(document).on('ajaxComplete',function(){
	funcionalidadesCategoria.cargascrollLoading();
})
	
module.exports.funcionalidadesCategoria = funcionalidadesCategoria;