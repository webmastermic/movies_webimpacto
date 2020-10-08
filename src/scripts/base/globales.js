// GLOBALES
require('slick-carousel');
var $jq       = require("jquery");
window.jq     = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var conf 	  = require("../base/conf");
const Swal    = require('sweetalert2');
var customapp = false;
const swalModalProduct = Swal.mixin({
	animation: true,
	allowEscapeKey:false,
	allowOutsideClick:false,
	customClass: {
		confirmButton: 'btn btn-success',
		cancelButton: 'btn btn-danger'
	},
	buttonsStyling: false,
	customClass: {
		container     : 'movies-container-class',
		popup         : 'movies-popup-class',
		header        : 'movies-header-class',
		title         : 'movies-title-class',
		closeButton   : 'movies-close-button-class',
		icon          : 'movies-icon-class',
		image         : 'movies-image-class',
		content       : 'movies-content-class',
		input         : 'movies-input-class',
		actions       : 'movies-actions-class',
		confirmButton : 'movies-confirm-button-class',
		cancelButton  : 'movies-cancel-button-class',
		footer        : 'movies-footer-class'
	}
});
var funcionalidadesGenerales = function () {
	var container = $jq("body");
	var init = function () {
		$jq('footer.mic-footer .legales .item:not(.tiendas) p').click(function(){
			toggleAccordion($jq(this));
		});
		setStoreRedirect();
		confignumberPrice();
		applyWIMCart();
		buttonFlotante();
		nameTallaConfig();
		bannerDescuento();
		porcentajeDescuento();
		changeBuyButtonText();		
		logueado();
		if(!(getCookie('mic-descuento'))) {
			$('.banner-descuento-desktop').removeClass('inactive');
			$('.banner-descuento-mobile').removeClass('inactive');
		}
	};
	
	var getFirstAvaliableSku = function (product) {
		var skusArray = product.skus
		var filterArray = $(skusArray).filter(function (index) {
			return $(this).available
		})

		if (filterArray.length)
			return filterArray[0]
		else
			return null
	}

	var calcularDescuentoVitrina = function (bestPrice, listPrice, discountContainer) {
		bestPrice = bestPrice.replace("$", "").replace(/[.]+/g, '').replace(/[,]+/g, '');
		listPrice = listPrice.replace("$", "").replace(/[.]+/g, '').replace(/[,]+/g, '');
		var discountPercent = Math.round(((listPrice - bestPrice) * 100) / listPrice) + "%";
		discountContainer.show().find('p').text(discountPercent);
	};

	var ajustarPrecioVitrinas = function () {

		$('.main-shelf').each(function () {
			var idproduct = $(this).attr('data-idProduct');
			var objListPrice = $(this).find('.productList');
			var objBestPrice = $(this).find('.bestPrice');
			var discountContainer = $(this).find('.main-shelf__tag-descuento');
			vtexjs.catalog.getProductWithVariations(idproduct).done(function (product) {
				$.each(product.skus, function (indexSku, valueSku) {
					if (valueSku.available) {
						var prices = ajustarPrecios((valueSku.bestPrice / 100), (valueSku.listPrice / 100), (valueSku.taxAsInt / 100));
						objListPrice.text(prices.listPriceTax);
						objBestPrice.text(prices.bestPriceTax);

						if (valueSku.listPrice > 0) {
							calcularDescuentoVitrina(prices.bestPriceTax, prices.listPriceTax, discountContainer);
						}

						return false;
					}
				});
			});
		});
	};

	var formatearMoneda = function (numero, numDecimales, separadorMiles, separadorDecimales) {
		var n = numero,
			numDecimales = isNaN(numDecimales = Math.abs(numDecimales)) ? 2 : numDecimales,
			separadorDecimales = separadorDecimales == undefined ? "." : separadorDecimales,
			separadorMiles = separadorMiles == undefined ? "," : separadorMiles,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(numDecimales)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + separadorMiles : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + separadorMiles) + (numDecimales ? separadorDecimales + Math.abs(n - i).toFixed(numDecimales).slice(2) : "");
	};

	var ajustarPrecios = function (bestPrice, listPrice, taxBestPrice) {
		return {
			'bestPriceTax': '$ ' + formatearMoneda((bestPrice + taxBestPrice), 0, '.', ','),
			'listPriceTax': '$ ' + formatearMoneda(Math.round((((taxBestPrice / bestPrice) + 1) * listPrice)), 0, '.', ',')
		}
	};

	// Funcionalidad del acordeon. La estructura del HTML debe ser la siguiente:
	// No es necesario que sean elementos ul o li. Pueden ser divs.
	// -----------------------------------------------------------
	//	<ul>
	//		<li>               -> elm
	//			<p></p>          -> prev
	//			<ul>             -> nxtElm
	//				<li>...</li>
	//				<li>...</li>
	//			</ul>
	//		</li>
	//		<li>...</li>       -> parentSiblings
	//	</ul>
	// -----------------------------------------------------------
	var toggleAccordion = function (elm) {
		var child = $jq(elm).parent().children('ul');
		var siblings = child.prev();
		// var nxtElm    = $jq(elm).next();
		var children = $jq(elm).parent().children();

		if (child.hasClass("show")) {
			child.removeClass("show");
			siblings.removeClass("show");
			//child.slideToggle();
		} else {
			if (!child.hasClass("show")) {
				child.addClass("show");
				siblings.addClass("show");
			} else {
				child.removeClass("show");
				siblings.removeClass("show");
			};
			/*child.slideToggle(400, "swing", function () {
				if (!child.hasClass("toggle--is-open")) {
					child.addClass("toggle--is-open");
				} else {
					child.removeClass("toggle--is-open");
				};
			});*/

			/*children.each(function (index) {
				var ul = $jq(this).children("ul");
				if (ul.hasClass("show")) {
					ul.removeClass("show");
					//ul.slideToggle();
				}
			});*/
		}
	};

	var setStoreRedirect = function() {
		$("#cityId").on('change', function() {
			var shop = $('#cityId option:selected').data('shop');
			var value = $(this).val();
			window.location.replace("/tiendas?shop="+ shop +"&value="+ value);
			/*if ($(this).val() == 'selectionKey'){
				DoSomething();
			} else {
				DoSomethingElse();
			}*/
		});
	}

	var setCookie =  function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	};
	var getCookie = function(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};

	var getTypeMovil = function(){
		var md = new MobileDetect(window.navigator.userAgent);
		var type = md.os();
		return type;
	}

	//HEADER FIXED, Pendiente cread Header.js
	var headerFixed = function() {
		var headerDesktop = $('.header-desktop');
		var headerMobile = $('.header-mobile');
		var bannerDesktop = $('.banner-descuento-desktop');	
		var bannerMobile = $('.banner-descuento-mobile');
		var categoryOrganize = $('#category-body #category-body-organize');
		var lastScrollTop = 0;
		
		window.addEventListener("scroll", function(){ 
		var st = window.pageYOffset || document.documentElement.scrollTop;
		if (st > lastScrollTop){
			// downscroll code
			//console.log(lastScrollTop);
			headerDesktop.addClass("sticky");
			headerMobile.addClass("sticky");
			bannerDesktop.addClass("sticky");
			bannerMobile.addClass("sticky");			
		} else {
			headerDesktop.removeClass("sticky");
			headerMobile.removeClass("sticky");
			bannerDesktop.removeClass("sticky");
			bannerMobile.removeClass("sticky");
			// upscroll code
		}
		lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
		}, false);
		clearSearchbar();
		locationSearchbar();
		collapsibleSearchbar();
		makeCollapsible();
		onClickTab();
		toogleMenuMobile();
		closeMenuMobile();
		makeSlide();
		makeSlideSubmenu();
		toogleMiniCartMobile();
		toogleMenuThirdDesktop();
		closeMiniCartMobile();
		toogleMiniCartDesktop();		
	}

	var applySlick = function (objContainer, objOptions) {
		if (!objContainer.hasClass('slick-initialized')) {
			objContainer.on('init', function (event, slick) {
				objContainer.addClass('active');
			}).slick(
				objOptions
			);
		}
		objContainer.slick('setPosition');
	};

	var abrirPopupCarrito = function(orderForm){

	}

	var addToCart = function (skuId,qty,seller,salesChannel) {
		vtexjs.checkout.getOrderForm().done(function(orderForm) {
			var item = {
			  id: skuId,
			  quantity: qty,
			  seller: seller
			};
			vtexjs.checkout.addToCart([item],null,salesChannel).done(function(orderForm) {
				/* Aquí código para abrir popup carrito header */
				//abrirPopupCarrito(orderForm);
				swalModalProduct.fire({
				  title: '¡Producto agregado con éxito!',
				  type: 'success',
				  showCancelButton: true,
				  confirmButtonText: 'Ir a pagar',
				  cancelButtonText: 'Seguir comprando',
				  reverseButtons: true,
				}).then(function(result){
					if (result.value) {
						location.href = "/checkout?sc="+salesChannel;
					}
				})
			});
		});
	};

	var poupSelectedSku = function (objSelectedSku, qty, seller, salesChannel) {
		if (!objSelectedSku.response) {
		    swalModalProduct.fire({
		        type: 'error',
		        title: "¡Campos Obligatorios!",
		        html: objSelectedSku.error,
		        showConfirmButton: false,
		        showCancelButton: true,
				cancelButtonText: 'Aceptar'
		    });
		}
		else{
		    addToCart(objSelectedSku.sku, qty , seller, salesChannel);
		}
		event.preventDefault();
	};

	//MIC-13, Pendiente cread Header.js
	var clearSearchbar = function() {
		$('.menu-mobile .menu-mobile-header .search-container .close-img-container').click(function(){
			$('#menu-mobile-searchbar[type="text"]').val('');
			$('#menu-desktop-searchbar[type="text"]').val('');
		});

		$('.header-desktop .search .searchbar-container .close-img-container').click(function(){
			$('#menu-desktop-searchbar[type="text"]').val('');
			$('#menu-mobile-searchbar[type="text"]').val('');
		});
	};

	var locationSearchbar = function() {
		if($( window ).width() < 992) {
			document.querySelector('#menu-mobile-searchbar').addEventListener('keydown', function (e) {
				if (e.key === 'Enter') {
					if ($("#menu-mobile-searchbar").is(":focus")) {
						/*document.location.replace('/Sistema/buscavazia?ft=' + $("#menu-mobile-searchbar").val());*/
						document.location.replace('/' + $("#menu-mobile-searchbar").val());
					}
				}
			});
			document.querySelector('.search-input-container .search-img').addEventListener("click", function(e) {
				/*document.location.replace('/Sistema/buscavazia?ft=' + $("#menu-mobile-searchbar").val());*/
				document.location.replace('/' + $("#menu-mobile-searchbar").val());
			});
		} else {
			document.querySelector('#menu-desktop-searchbar').addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
					if ($("#menu-desktop-searchbar").is(":focus")) {
						/*var newhref = ('/Sistema/buscavazia?ft=' + $("#menu-desktop-searchbar").val()).toString();*/
						var newhref = ('/' + $("#menu-desktop-searchbar").val()).toString();
						document.location.replace(newhref);
					}
				}
			});
		}
	}

	var collapsibleSearchbar = function() {
		var coll = document.getElementsByClassName("search-logo");
		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				this.previousElementSibling.classList.toggle("active");
				var content = this.previousElementSibling;
				if (content.style.maxWidth === "222px") {
					content.style.maxWidth = "0";
					$('#menu-desktop-searchbar[type="text"]').val('');
					$('#menu-desktop-searchbar').attr("placeholder", "");
					setTimeout(function(){
						content.style.visibility = "hidden";
					}, 100);
				} else {
					content.style.maxWidth = "222px";
					setTimeout(function(){
						$('#menu-desktop-searchbar').attr("placeholder", "Buscar producto...");
						content.style.visibility = "visible";
					}, 100);
				}
			});
		}
	}

	var makeCollapsible = function() {
		var coll = document.getElementsByClassName("menu-collapsible");
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

	var onClickTab = function() {
		var tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].addEventListener("click", function(e) {
				var i, tabcontent, tablinks, tabName;
				tabName = this.getAttribute("data-tab");
				tabcontent = document.getElementsByClassName("tabcontent");
				for (i = 0; i < tabcontent.length; i++) {
				  tabcontent[i].style.display = "none";
				}
				tablinks = document.getElementsByClassName("tablinks");
				for (i = 0; i < tablinks.length; i++) {
				  tablinks[i].className = tablinks[i].className.replace(" active", "");
				}
				document.getElementById(tabName).style.display = "block";
		
				e.currentTarget.className += " active";
			});
		}
	}

	var toogleMenuMobile = function() {
		var closeElements = [];
		closeElements.push(
			document.getElementById("open-menu-nav"),
			document.querySelector('.header-mobile .menu-options .search'),
			document.getElementById("menu-mobile-shadow")
		);
		var aux = $('.header-mobile .content-slide-header .content-slide-header-close-img');
		for (i = 0; i < aux.length; i++) {
			closeElements.push(aux[i])
		}


		for (i = 0; i < closeElements.length; i++) {
			closeElements[i].addEventListener("click", function() {
				if(document.getElementById("menu-mobile-nav").offsetLeft < 0) {
					document.getElementById("menu-mobile-nav").style.left = "0";
					$('#menu-mobile-shadow').css("display","block");
					$(".menu-options .search .search-logo").css("width", "0");
				} else {
					document.getElementById("menu-mobile-nav").style.left = "-100%";
					$('#menu-mobile-shadow').css("display","none");
					$(".menu-options .search .search-logo").css("width", "100%");
					$(".content-slide").css("left", "-100%");
					$(".menu-slide").removeClass("active");
					var col = document.getElementsByClassName("content-collapsible");
					var colac = document.getElementsByClassName("menu-collapsible");
					for (i = 0; i < col.length; i++) {
						if (col[i].style.maxHeight === "1000px") {
							col[i].style.maxHeight = "0";
						}
					}
					for (i = 0; i < colac.length; i++) {
						colac[i].classList.remove("active");
					}
				}
			});
		}
	}

	var closeMenuMobile = function() {
		var closeElements = $('.header-mobile .menu-options .cart.opt-icon');

		for (i = 0; i < closeElements.length; i++) {
			closeElements[i].addEventListener("click", function() {
				document.getElementById("menu-mobile-nav").style.left = "-100%";
				$('#menu-mobile-shadow').css("display","none");
				$(".menu-options .search .search-logo").css("width", "100%");
				$(".content-slide").css("left", "-100%");
				$(".menu-slide").removeClass("active");
				var col = document.getElementsByClassName("content-collapsible");
				var colac = document.getElementsByClassName("menu-collapsible");
				for (i = 0; i < col.length; i++) {
					if (col[i].style.maxHeight === "1000px") {
						col[i].style.maxHeight = "0";
					}
				}
				for (i = 0; i < colac.length; i++) {
					colac[i].classList.remove("active");
				}
			});
		}
	}

	var makeSlide = function() {
		var coll = document.getElementsByClassName("menu-slide");
		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				//this.classList.toggle("active");
				tabcontent = document.getElementsByClassName("tabcontent");
				var content = this.nextElementSibling;
				if (content.style.left === "0px") {
					content.style.left = "-100%";
					this.classList.remove("active");
				} else {
					content.style.left = "0px";
					this.classList.add("active");
				}
			});
		}
	}

	var makeSlideSubmenu = function() {
		var coll = document.getElementsByClassName("menu-slide-submenu");
		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var content = $('.content-slide');
				for (i = 0; i < content.length; i++) {
					if (content[i].style.left === "0px") {
						content[i].style.left = "-100%";
						var man = document.getElementsByClassName("menu-slide");
						var col = document.getElementsByClassName("content-collapsible");
						var colac = document.getElementsByClassName("menu-collapsible");
						for (i = 0; i < man.length; i++) {
							man[i].classList.remove("active");
						}
						for (i = 0; i < col.length; i++) {
							if (col[i].style.maxHeight === "1000px") {
								col[i].style.maxHeight = "0";
							}
						}
						for (i = 0; i < colac.length; i++) {
							colac[i].classList.remove("active");
						}
					}
				}
			});
		}
	}

	var toogleMenuThirdDesktop = function() {
		var toogleMenuThirdElementsMasc = $('.header-desktop .header-center .menu-nino .menu-second .menu-second-dropdown');
		var toogleMenuThirdElementsFem = $('.header-desktop .header-center .menu-nina .menu-second .menu-second-dropdown');


		for (i = 0; i < toogleMenuThirdElementsMasc.length; i++) {
			toogleMenuThirdElementsMasc[i].addEventListener("mouseenter", function() {
				$('.header-desktop .header-center .menu-nino .menu-second .menu-second-dropdown').removeClass('active');
				this.classList.add("active");
			});
		}

		for (i = 0; i < toogleMenuThirdElementsFem.length; i++) {
			toogleMenuThirdElementsFem[i].addEventListener("mouseenter", function() {
				$('.header-desktop .header-center .menu-nina .menu-second .menu-second-dropdown').removeClass('active');
				this.classList.add("active");
			});
		}
	}

	var toogleMiniCartMobile = function() {
		var toogleMiniCartElements = $('.header-mobile .menu-options .cart.opt-icon');

		for (i = 0; i < toogleMiniCartElements.length; i++) {
			toogleMiniCartElements[i].addEventListener("click", function() {
				this.classList.toggle("active");
				if(document.getElementById("mini-cart-mobile-wrapper").offsetHeight <= 0) {
					$('#mini-cart-mobile-wrapper').css("max-height","460px");
					$('#mini-cart-mobile-shadow').css("display","block");
				} else {
					$('#mini-cart-mobile-wrapper').css("max-height","0");
					$('#mini-cart-mobile-shadow').css("display","none");
				}
			});
		}
	}

	var closeMiniCartMobile = function() {
		var closeElements = [];
		closeElements.push(
			document.getElementById("open-menu-nav"),
			document.querySelector('.header-mobile .menu-options .search'),
			document.getElementById("mini-cart-mobile-shadow")
		);

		var aux = $('#mini-cart-mobile-wrapper .mini-cart-header .close-container');
		for (i = 0; i < aux.length; i++) {
			closeElements.push(aux[i])
		}

		for (i = 0; i < closeElements.length; i++) {
			closeElements[i].addEventListener("click", function() {
				$('.header-mobile .menu-options .cart.opt-icon').removeClass('active');
				$('#mini-cart-mobile-wrapper').css("max-height","0");
				$('#mini-cart-mobile-shadow').css("display","none");
			});
		}
	}

	var toogleMiniCartDesktop = function() {
		var toogleMiniCartElements = $('.header-desktop .menu-options .cart');
		var closeMiniCartElements = $('#mini-cart-desktop-wrapper');
		var aux = $('#mini-cart-desktop-wrapper .mini-cart-header .close-container');

		/*for (i = 0; i < toogleMiniCartElements.length; i++) {
			toogleMiniCartElements[i].addEventListener("click", function() {
				this.classList.toggle("active");
				if(document.getElementById("mini-cart-desktop-wrapper").offsetHeight <= 0) {
					$('#mini-cart-desktop-wrapper').css("max-height","460px");
					$('#mini-cart-mobile-shadow').css("display","block");
				} else {
					$('#mini-cart-desktop-wrapper').css("max-height","0");
					$('#mini-cart-mobile-shadow').css("display","none");
				}
			});
		}*/

		for (i = 0; i < toogleMiniCartElements.length; i++) {
			toogleMiniCartElements[i].addEventListener("mouseenter", function() {
				this.classList.add("active");
				$('#mini-cart-desktop-wrapper').css("max-height","460px");
				$('#mini-cart-mobile-shadow').css("display","block");
			});
		}

		for (i = 0; i < closeMiniCartElements.length; i++) {
			closeMiniCartElements[i].addEventListener("mouseleave", function() {
				$('.header-desktop .menu-options .cart').removeClass('active');
				$('#mini-cart-desktop-wrapper').css("max-height","0");
				$('#mini-cart-mobile-shadow').css("display","block");
			});
		}

		for (i = 0; i < aux.length; i++) {
			aux[i].addEventListener("click", function() {
				$('.header-desktop .menu-options .cart').removeClass('active');
				$('#mini-cart-desktop-wrapper').css("max-height","0");
				$('#mini-cart-mobile-shadow').css("display","none");
			});
		}
	}

	var applyWIMCart = function(){
        $(window).on('orderFormUpdated.vtex', function(evt, orderForm) {
            drawMiniCart(orderForm);
        });
        vtexjs.checkout.getOrderForm()
        .done(function(orderForm) {
            drawMiniCart(orderForm);
        });
    }

	var drawMiniCart = function(orderForm) {
		var wrapper = $('.mini-cart-content');
		var total_qty = 0;
		var total = 0;

		if(typeof orderForm !== "undefined" && orderForm.items.length > 0){
			wrapper.empty();
			orderForm.items.forEach(function(sku,i){
                var categories = sku.productCategoryIds.split('/');
                var n_categories = sku.productCategoryIds.split('/').length;
                var data_sku = sku.id;
                var data_sku_index = i;
                var data_department = categories[1];
                var data_category = categories[n_categories - 2];
				var sku_img = sku.imageUrl;
				/*var sku_name = sku.name === sku.skuName ? sku.skuName : sku.name + " - " + sku.skuName;*/
				var sku_name = sku.name;
				var sku_link = sku.detailUrl;
				var price = currencyFormat(sku.sellingPrice/100);
				var discount = null;
				var bestPrice = null;
				if(typeof sku.priceTags[0] !== "undefined") {
					discount = currencyFormat(sku.priceTags[0].value/100);
					bestPrice = currencyFormat(sku.price/100)
				}
                total_qty += sku.quantity;
				var available = sku.availability;
				var content = 	'<div class="mini-cart-product-tag">'+
									'<div class="mini-cart-product-image-container">'+
										'<a class="mini-cart-product-link" href="'+sku_link+'">'+
											'<img src="'+sku_img+'" class="mini-cart-product-image" />'+
										'</a>'+
									'</div>'+
									'<div class="mini-cart-product-main">'+
										'<div class="mini-cart-product-header">'+
											'<div class="mini-cart-product-name">'+
												'<a class="mini-cart-product-link" href="'+sku_link+'">'+
													'<span>'+sku_name+'</span>'+
												'</a>'+
											'</div>'+
											'<div class="delete-product-container">'+
												'<a href="#" class="" data-sku="'+data_sku+'" data-sku-index="'+data_sku_index+'"></a>'+
												'<img class="delete-item-img" src="/arquivos/CrossIcon.png">'+
											'</div>'+
										'</div>'+
										'<div class="mini-cart-product-footer">'+
											'<div class="mini-cart-input-container">'+
												/*'<div class="mini-cart-loader"></div>'+*/
												'<div class="mini-cart-input-qty">'+
													'<a href="#" class="" data-action="minus" data-sku="'+data_sku+'" data-sku-index="'+data_sku_index+'"></a>'+
													'<img class="" src="/arquivos/LessGreyIcon.png">'+
												'</div>'+
												'<div class="mini-cart-input-number">'+
													'<input type="text" class="" value="'+sku.quantity+'" data-sku="'+data_sku+'" data-sku-index="'+data_sku_index+'"/>'+
												'</div>'+
												'<div class="mini-cart-input-qty">'+
													'<a href="#" class="" data-action="plus" data-sku="'+data_sku+'" data-sku-index="'+data_sku_index+'"></a>'+
													'<img class="" src="/arquivos/MoreGreyIcon.png">'+
												'</div>'+
											'</div>'+
											'<div class="mini-cart-product-price">'+ (price == currencyFormat(0) ? (
													'<span>Gratis</span>'
												) : (
													'<span>'+price+'</span>'
												)) +
											'</div>'+ (discount != null && bestPrice != null && bestPrice != price ? (
													'<div class="mini-cart-product-discount">'+
														'<span>'+bestPrice+'</span>'+
													'</div>'
												) : (
													'<div class="mini-cart-product-discount">'+
														'<span></span>'+
													'</div>'
												)) +
										'</div>'+
									'</div>'+
								'</div>';
				wrapper.append(content);
			});
			
			$('.mini-cart-input-qty a').click(updateQuantity);
			$('.delete-product-container a').click(removeProduct);
			$('.summary-quantity-value').text(total_qty);
			if(orderForm.totalizers.length > 1) {
				//console.log('totalizers apply',currencyFormat(orderForm.totalizers[0].value/100),currencyFormat(orderForm.totalizers[1].value/100));
				var totalize = currencyFormat((orderForm.totalizers[0].value/100) + (orderForm.totalizers[1].value/100));
				$('.summary-total-value').text(totalize);
			} else {
				$('.summary-total-value').text(currencyFormat(orderForm.totalizers[0].value/100));
			}
            $('.cart-qty').text(total_qty);
			total = orderForm.value/100;
            $('span.cart-qty').text(total_qty);
		} else {
			$('.mini-cart-content').empty();
            $('.summary-quantity-value').text("0");
            $('.summary-total-value').text("$ 0");
            $('.cart-qty').text("0");
			$('#mini-cart-mobile-wrapper').addClass('no-items');
			
			var content = 	'<div class="mini-cart-product-empty">'+
								'<span class="mini-cart-empty-title">tu bolsa está vacía</span>'+
							'</div>';

			wrapper.append(content);
		}

        var porcentaje = ( parseInt(total) / 99900 )*100;

        $('.free-shipping-bar-progress').animate({
            width: porcentaje+'%'
        }, 500, function(){
            $('.free-shipping-bar-progress').fadeIn(500);
        });
        totalPendiente = 99900-parseInt(total);

        if (parseInt(total) >= 99900) {
            $('.free-shipping-title-success').css('display','block');
            $('.free-shipping-title-failure').css('display','None');
        }else{
            $('.free-shipping-title-success').css('display','none');
            $('.free-shipping-title-failure').empty().append('faltan $'+(totalPendiente/1000).toFixed(3)+' para que tu envío sea gratis');
            $('.free-shipping-title-failure').css('display','block');
        }   
	}

	var currencyFormat = function(value){
        var num = value;
        if(!isNaN(num)){
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/,'');
            return ('$ '+num);
        }
	}
	
	var updateQuantity = function(event){
        var operacion=event.target.dataset.action;
        var indexObtenido=event.target.dataset.skuIndex;
        var precioTotalPrev=null;
        var cantidad=null;
		var esteElemento=$(this);

        if(operacion==="plus"){
            cantidad = parseInt($(this).parent().parent().find('.mini-cart-input-number input').val())+1;
        }else{
            cantidad = parseInt($(this).parent().parent().find('.mini-cart-input-number input').val())-1;
            if(cantidad==0){
                $(".mini-cart-product-tag").get(indexObtenido).remove();
            }
		}

        vtexjs.checkout.getOrderForm().then(function(orderForm) {
			/*$('.mini-cart-input-container').addClass('active');*/
            precioTotalPrev=orderForm.value;
            var updateItem = {
                index: indexObtenido.toString(),
                quantity: cantidad.toString()
            };
            return vtexjs.checkout.updateItems([updateItem], null, false);
        })
        .done(function (orderForm) {
			/*$('.mini-cart-input-container').remove('active');*/
            if(precioTotalPrev!=orderForm.value){
                esteElemento.parent().find('.mini-cart-input-number input').val(cantidad);
            }else{
                var parrafoErrorCantidad=$("<div>").attr("class","parrafoErrorCantidad qd-ddc-prodCell qd-ddc-column6").text("Cantidad no disponible").appendTo($(".qd-ddc-prodRow").get(indexObtenido));
                setTimeout(function(){
                    $('.parrafoErrorCantidad').remove();
                }, 2000);
            }
			$(".summary-total-value").text(currencyFormat(orderForm.value/100));
			//console.log("Value obj: ",orderForm.value);
        });
	}
	
	var removeProduct = function(event){
        var itemIndex = event.target.dataset.skuIndex;
        var quantity = parseInt($(this).parent().parent().parent().find('.mini-cart-input-number input').val());
        vtexjs.checkout.getOrderForm().then(function (orderForm) {
            var itemsToRemove = [
                {
                    "index": itemIndex,
                    "quantity": quantity
                }
            ]
            return vtexjs.checkout.removeItems(itemsToRemove);
        })
        .done(function (orderForm) {
            $(".summary-total-value").text(currencyFormat(orderForm.value/100));
        });
    }

	var nameTallaConfig = function () {
		$('.sku-tallas-1 .insert-sku-name').each(function () {
			var cadena = $(this).html().trim();
			if(cadena.indexOf(" ") != -1){
				//console.log("si hay espacios: ",cadena);				
				var numeros = cadena.split(" ");
				var dato = numeros[1];
				$(this).html(dato);
			}else{
				//console.log("no hay espacios:",cadena);
				if(cadena.match(/\d+/) > -1 && cadena.match(/\d+/) != null ){
					//console.log("Si hay numeros:",cadena.match(/\d+/));
					var separador =  /[^0-9,\W+]/g;
					var numeros = cadena.split(separador);	
					$(this).html(numeros);
				}
			}
		});
	
		$('.sku-tallas-2 .insert-sku-name').each(function () {
			var cadena = $(this).html().trim();
			if(cadena.indexOf(" ") != -1){
				//console.log("si hay espacios: ",cadena);				
				var numeros = cadena.split(" ");
				var dato = numeros[1];
				$(this).html(dato);
			}else{
				//console.log("no hay espacios:",cadena);
				if(cadena.match(/\d+/) > -1 && cadena.match(/\d+/) != null ){
					//console.log("Si hay numeros:",cadena.match(/\d+/));
					var separador =  /[^0-9,\W+]/g;
					var numeros = cadena.split(separador);	
					$(this).html(numeros);
				}
			}
		});
	}	

	var buttonFlotante = function() {
		$('.call-flotante .objetoflot').click(function(){
			var boton = $(this);
			boton.toggleClass('active');
			boton.siblings('.desplegable').toggleClass('active');
		})
	}

	var confignumberPrice = function () {
		$('.attribute-product .price .best-price').each(function () {
			var cadena = $(this).text();
			var color = cadena.split(",");
			var valor = color[0];
			$(this).html(valor);
		});
		$('.attribute-product .price .old-price').each(function () {
			var cadena = $(this).text();
			var color = cadena.split(",");
			var valor = color[0];
			$(this).html(valor);
		});
	}

	var bannerDescuento = function () {
		$(document).on("click", ".banner-descuento .exit-descuento", function() {
			var button1 = $(this).parents(".banner-descuento-desktop");
			button1.addClass('inactive');
		});
		$(document).on("click", ".banner-descuento .exit-descuento", function() {
			var button2 = $(this).parents(".banner-descuento-mobile");
			button2.addClass('inactive');
			setCookie('mic-descuento',true,1);
		});		
	}

	var logueado = function() {
		setTimeout(function(){
			if(dataLayer[2].visitorLoginState){
				$('.header-movies .menu-options .user span').html(dataLayer[2].visitorContactInfo[1]);
				$('.menu-mobile-item .text-container .user').html(dataLayer[2].visitorContactInfo[1]);					
			} else if(dataLayer[3].visitorLoginState){
				$('.header-movies .menu-options .user span').html(dataLayer[3].visitorContactInfo[1]);
				$('.menu-mobile-item .text-container .user').html(dataLayer[3].visitorContactInfo[1]);
			} else {
				$('.header-movies .menu-options .user span').html("Entrar");
				$('.menu-mobile-item .text-container .user').html("Mi cuenta");
			}		
		}, 2000);
		
		$("#femenino-tab").click(function(e){
			$(this).css('background','#E20613');
			$('#masculino-tab').css('background','transparent');
		});
		$("#masculino-tab").click(function(e){
			$(this).css('background','#E20613');
			$('#femenino-tab').css('background','transparent');
		});
		if(window.location.href.indexOf("hombre") > -1){
			$('#masculino-tab').css('background','#E20613');
		}else{
			$('#femenino-tab').css('background','#E20613');
		}
	}

	var porcentajeDescuento = function() {
		$(".image-product .discount-percent").each(function () {
			var precio1 = $(this).find(".flag-old-price").text().replace("$", "").replace(",", "").replace(".", ""),
				precio2 = $(this).find(".flag-best-price").text().replace("$", "").replace(",", "").replace(".", ""),
				tagContenedor = $(this).find(".tag-discount"),
				descuento = precio1 - precio2,
	            porcentaje = 100 * descuento / precio1;
			porcentaje = Math.round(porcentaje), precio1 != precio2 && $(this).find(".tag-discount").empty().append(porcentaje + "%");
		});
	}

	var changeBuyButtonText = function() {
		var buttonUrl1 = $('#category-page .wrapper-buy-button-asynchronous .add > a');
		var buttonUrl2 = $('#category-page .wrapper-buy-button-asynchronous .add > a');
		var buttonUrl3 = $('#product-page .wrapper-buy-button-asynchronous .add > a');
		var buttonUrl4 = $('#home .wrapper-buy-button-asynchronous .add > a');
		buttonUrl1.text("AGREGAR AL CARRITO");
		buttonUrl2.text("AGREGAR AL CARRITO");
		buttonUrl3.text("AGREGAR AL CARRITO");
		buttonUrl4.text("AGREGAR AL CARRITO");
	}

	var clicktallas = function () {
		$(".button-talla-1").unbind().click(function(e){
			//$(document).on("click", ".button-talla-1", function() {					
			//e.stopImmediatePropagation();
			//e.preventDefault();
			var button1 = $(this);
			button1.toggleClass('active');
		});
		$(".button-talla-2").unbind().click(function(e){
			//$(document).on("click", ".button-talla-2", function() {			
			//e.stopImmediatePropagation();
			//e.preventDefault();
			var button2 = $(this);
			button2.toggleClass('active');
		});
	}

	var dispHover = function () {						
		//var hover = $(".box-item")
		//var itemId = $(this).attr("id");
		
		$(".box-item").each(function () {
			var itemId = $(this).attr("id");
			var content_tallas = '';		
			var tallas = $(this).find('.sku-tallas-1');	
			var tallas2 = $(this).find('.sku-tallas-2');				
			vtexjs.catalog.getProductWithVariations(itemId).done(function(product) {
				var colors = product.dimensionsMap['Talla'];
				//console.log(product);
				var skus = product.skus;
				if ( colors !== undefined ){
					var cartaColor = colors.map( function(v,i){
					return skus.find( function(i){
						//console.log(i);
						if(i.dimensions['Talla'] == v && i.available == true){
							content_tallas += '<div class="selector-talla" id="'+i.sku+'">'+i.dimensions['Talla']+'</div>';
						}			
						return i.dimensions['Talla'] == v && i.available == true}) !== undefined && colors[i]
					}).filter( function(v){
						return v !== false
					});		
						
				}
				tallas.html(content_tallas);
				tallas2.html(content_tallas);
			});		
			
			var personaje = $(this).find('.marca-product');
			var element = $(this).find('.product-brand');
			$.ajax({
				url : '/api/catalog_system/pub/products/search/?fq=productId:'+itemId,
				success:function(data){

					var brand = data[0].brand;
					element.html(brand)
					if(typeof element !== "undefined" && element != null) {
						if(typeof brand !== "undefined" && brand != null) {
							var src = "/arquivos/brand_"+brand.replace(/ /g, "").toLowerCase()+".png" ;		
							$.get(src)
							.done(function() { 
								var output = '<img src="'+src+'" />';
								element.html(output);
							}).fail(function() { 
								console.log('Error brand image does not exist');
							});
						}
					}
					if(data[0].Personaje[0] !== undefined){
						personaje.html(data[0].Personaje[0]);
					}					

					//brand.html('<img src="/arquivos/brand_'+data[0].brand.replace(/ /g, "").toLowerCase()+'.png">');
				}
			})
			
		});		

		//$(".insert-sku-checklist .is-checklist-item").click(function(){
			$(document).on("click", ".selector-talla", function() {

				var buttontalla = $(this);
				buttontalla.addClass('select');
				//var buttonCheck = buttontalla.find('.insert-sku-checkbox');
				//var buttonCheckName = buttontalla.find('.insert-sku-checkbox');
				var idsku = buttontalla.attr("id");
				var nameTalla = buttontalla.html();
				var buttonUrl1 = buttontalla.parents('.button-product').find('.wrapper-buy-button-asynchronous .add > a');
				var buttonUrl2 = buttontalla.parents('.button-product-2').find('.wrapper-buy-button-asynchronous .add > a');
				var buttonactive = buttontalla.parents('.button-talla-1');
				var buttonactive2 = buttontalla.parents('.button-talla-2');
				if (buttonactive.hasClass('active')){
					buttonactive.removeClass('active');	
				}
				if (buttonactive2.hasClass('active')){
					buttonactive2.removeClass('active');	
				}
				if(buttontalla.hasClass('select')){
					var nameReplace = buttontalla.parents('.talla-produc');
					nameReplace.find('.talla-elegida').html(nameTalla);
					var idskuFinal = {response: true, sku: idsku, error:""};
					var qty = 1;
					var seller = 1;
					var sc = 1;
					buttonUrl1.click(function(){						
						poupSelectedSku(idskuFinal, qty , seller, sc);
					});
					buttonUrl2.click(function(){					
						poupSelectedSku(idskuFinal, qty , seller, sc);
					});		
				}else{
					buttontalla.removeClass('select');
				}
	
				var buttonCheckSiblings = buttontalla.siblings();
				if(buttonCheckSiblings.hasClass('select')){
					buttonCheckSiblings.removeClass('select');
				}	
			});

		
	}

	// Funciones públicas.
	return {
		init: init,
		toggleAccordion: toggleAccordion,
		setStoreRedirect: setStoreRedirect,
		ajustarPrecios: ajustarPrecios,
		formatearMoneda: formatearMoneda,
		ajustarPrecioVitrinas: ajustarPrecioVitrinas,
		calcularDescuentoVitrina: calcularDescuentoVitrina,
		getTypeMovil: getTypeMovil,
		getCookie : getCookie,
		setCookie : setCookie,
		headerFixed : headerFixed,
		applySlick: applySlick,
		poupSelectedSku: poupSelectedSku,
		clearSearchbar: clearSearchbar,
		clicktallas: clicktallas,
		dispHover: dispHover,
		confignumberPrice: confignumberPrice,
		porcentajeDescuento:porcentajeDescuento,
		changeBuyButtonText: changeBuyButtonText,
		nameTallaConfig: nameTallaConfig,
	};

}();

$jq(document).ready(function () {
	funcionalidadesGenerales.init();
	funcionalidadesGenerales.headerFixed();
	funcionalidadesGenerales.dispHover();
	funcionalidadesGenerales.clicktallas();
});

// Expone públicamente partes del módulo.
module.exports.funcionalidadesGenerales = funcionalidadesGenerales;

