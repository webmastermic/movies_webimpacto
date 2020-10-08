var globales  = require("../base/globales");
var conf      = require("../base/conf");
var $jq       = require("jquery");
window.jq     = $jq;
var alpha     = require("../base/alpha");
var easyzoom  = require("../vendor/easyzoom");
var pinchZoom = require("../vendor/pinch-zoom-umd");

var optionsShare,
networks = {
    "facebook": {
        url: "https://www.facebook.com/sharer/sharer.php?u={url}&t={title}"
    },
    "twitter": {
        url: "https://twitter.com/intent/tweet?text={title}&url={url}"
        //url: "https://twitter.com/home?status={title} - {url}"
    },
    "google": {
        url: "https://plus.google.com/share?url={url}"
    },
    "linkedin": {
        url: "https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={description}"
    },
    "pinterest": {
        url: "http://pinterest.com/pin/create/button/?url={url}&media={media}&description={description}"
    },
    "whatsapp": {
        url: "https://api.whatsapp.com/send?text={title} - {url}"
    },
    "instagram": {
        url: "https://api.instagram.com/send?text={title} - {url}"
    }
};

var funcionalidadesProducto = function () {

    var init = function () {
        tabsEspec();
        putSliderVitrinesDynamic();
        putSpecifications();
        setQty();
        setProductModal();
        hackOutStock();
        $(document).on("alpha.before.load.images", function(e,images) {
            if ($jq('.images_big').hasClass('slick-initialized')) {
                $jq('.images_big').slick('unslick');
            }
            $jq('.images_big').empty().append(images.big);
            $jq('.images_big').on('init', function (event, slick) {
                $jq('.images_big').addClass('active');
            }).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                autoplay: true,
                lazyLoad: "ondemand",
                autoplaySpeed: 10000,
                asNavFor: ".images_product .images_thumbs",
                responsive: [
                    {
                        breakpoint: 993,
                        settings: {
                            arrows:false,
                            adaptiveHeight: true,
                            dots:true
                        }
                    }
                ]
            });

            setTimeout(function(){
                $jq('.images_big').slick('setPosition');
            },500);

            if ($jq('.images_thumbs').hasClass('slick-initialized')) {
                $jq('.images_thumbs').slick('unslick');
            }
            $jq('.images_thumbs').empty().append(images.small);
            $jq('.images_thumbs').on('init', function (event, slick) {
                $jq('.images_thumbs').addClass('active');
            }).slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                arrows: false,
                lazyLoad: "ondemand",
                dots: false,
                vertical: true,
                focusOnSelect: true,
                arrows: false,
                verticalSwiping: true,
                adaptiveHeight: true,
                asNavFor: ".images_product .images_big"
            });

            setTimeout(function(){
                $jq('.images_thumbs').slick('setPosition');
            },500);
            if (window.innerWidth > 992) {
                var $easyzoom = $(".images_product .easyzoom").easyZoom({
                    linkAttribute: "data-zoomimage",
                    errorNotice: "Lo sentimos ha ocurrido un error al intentar cargar la imagen",
                    loadingNotice: "Cargando la imagen"
                });
            }else{
                $jq(".images_product .easyzoom").each(function(){
                    new pinchZoom(this, {});
                })
            }
        });

        var obj = alpha.alpha.getInstance(conf, skuJson.productId);

        $jq('.content_buy').click(function(){
            var responseSkuSelected = obj.getSelectedSku();
            var qty = parseInt($jq(this).closest('.info_product').find('.field_qty .amounts span.active').text());
            var seller = skuJson.skus[0].sellerId;
            var salesChannel = skuJson.salesChannel;
            //console.log(responseSkuSelected);
            globales.funcionalidadesGenerales.poupSelectedSku(responseSkuSelected, qty,seller,salesChannel);
        });
        var interval = setInterval(function(){
            if($jq('.sku_container >').length > 0){
                if($jq('.Talla .content_skus .item label').length > 0){
                    $jq('.Talla .content_skus .item label:not(".stock_unavailable")').first().trigger('click');
                }
                clearInterval(interval);
            }
        },100);
		optionsShare = {
			url: encodeURIComponent(window.location),
			title: encodeURIComponent(document.title),
			description: fnGetMetaContent('description')
		}
        fnSocialShare();
    };

    var getHeightEspec = function () {
        return $jq('.tabs_especifications .content_tab.active').outerHeight();
    };

    var putSliderVitrinesDynamic = function () {
        $jq('.vitrines_related .prateleira li.helperComplement').remove();
        var amount = $jq('.vitrines_related .prateleira > ul > li').length;
        var options = {
            arrows:true,
            dots: false,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: '<img class="slick-prev" src="/arquivos/ArrowLeft.png" />',
            nextArrow: '<img class="slick-next" src="/arquivos/ArrowRight.png" />',
            responsive: [
                {
                    breakpoint: 769,
                    settings: {
                        arrows: ( amount > 3 ? true : false ),
                        slidesToShow: 2,
                        dots: ( amount > 3 ? false : true )
                    }
                },
                {
                    breakpoint: 450,
                    settings: {
                        arrows: ( amount > 3 ? true : false ),
                        slidesToShow: 1,
                        dots: ( amount > 3 ? false : true )
                    }
                }
            ]
        };
        globales.funcionalidadesGenerales.applySlick($jq('.vitrines_related .prateleira > ul'),options);
    };

    var putSpecifications = function () {
        $jq.ajax({
            url: "/api/catalog_system/pub/products/search/?fq=productId:" + skuJson.productId,
            method: "get"
        }).done(function (data) {
            drawDescripcion(data[0]);
            drawCuidado(data[0]);
            drawCaracteristicas(data[0]);
            drawMarca(data[0]);
            //drawCuidado_producto(data[0]);

            getHeightEspec();
        }).fail(function (error) {

        });
    };

    var drawDescripcion = function (data) {
        if (typeof data['description'] !== "undefined" && data['description'].length > 0) {
            $jq('#description_espec .container_general').append('<ul></ul>');
            description = data['description'].replace(/\s{2,}/g, ' ');
            $jq('#description_espec .container_general ul').append('<li>'+data['description']+'</li>');
            $jq('.tabs_especifications .content_especification').height(getHeightEspec());
        } else{
            $jq('.buttons_especifications a[href="#description_espec"], #description_espec').remove();
        }
        if(data['metaTagDescription']!= undefined && data['metaTagDescription'] != "")
            $jq('#description_short').append(data['metaTagDescription']);
        else
            $jq('#description_short').remove();
    };

    var drawCuidado = function(data) {
        if (typeof data['Cuidado de la prenda'] !== "undefined" && data['Cuidado de la prenda'].length > 0) {
            $jq('.tabs_especifications .content_especification').height(getHeightEspec());
            var caractSrting = data['Cuidado de la prenda'];
            var caractArray = caractSrting[0].split("/n");
            $jq('#cuidado_espec .container_general').append('<ul></ul>');
            $.each(caractArray, function(i) {
                $('#cuidado_espec .container_general ul').append('<li>'+caractArray[i]+'</li');
            });
        } else {
            var element = $jq('.buttons_especifications a[href="#cuidado_espec"]');
            element.parent().addClass('inactive');
            $jq('.buttons_especifications a[href="#cuidado_espec"] + img').remove();
        }
    };

    var drawCaracteristicas = function(data) {
        if (typeof data['Características de producto'] !== "undefined" && data['Características de producto'].length > 0) {
            $jq('.tabs_especifications .content_especification').height(getHeightEspec());
            var caractSrting = data['Características de producto'];
            var caractArray = caractSrting[0].split("/n");
            $jq('#caracteristicas_espec .container_general').append('<ul></ul>');
            $.each(caractArray, function(i) {
                $('#caracteristicas_espec .container_general ul').append('<li>'+caractArray[i]+'</li');
            });
        } else {
            var element = $jq('.buttons_especifications a[href="#caracteristicas_espec"]');
            element.parent().addClass('inactive');
            $jq('.buttons_especifications a[href="#caracteristicas_espec"] + img').remove();
        }
    };

    var drawMarca = function(data) {
        $jq('.images_product').append('<p class="product_brand">'+data.brand.toLowerCase()+'</p>');

        var brand = data.brand;
        var element = $('.product_brand');

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
    }

    var tabsEspec = function () {
        $jq('.tabs_especifications .buttons_especifications').click(function(e){
            if(!$(this).hasClass("inactive")) {
                var _ = $jq(this).find('a');
                e.preventDefault();
                var tab = _.attr('href');
                if(!_.is('.active')){
                    _.closest('.tabs_especifications').find('.content_especification').height(_.closest('.tabs_especifications').find(tab).outerHeight());
                    _.parent().parent().find('a').removeClass('active');
                    _.addClass('active');
                    _.closest('.tabs_especifications').find('.content_tab').fadeOut();
                    _.closest('.tabs_especifications').find(tab).fadeIn();
                    $jq('.tabs_especifications .content_especification').height($jq(tab).outerHeight());
                }else{
                    _.removeClass('active');
                    _.closest('.tabs_especifications').find(tab).fadeOut();
                    $jq('.tabs_especifications .content_especification').height($jq(tab).outerHeight());
                }
            }
        });
    };

    var setQty = function(){
        $jq('.field_qty').off('click').click(function(){
            var clicked = $jq(this);
            clicked.toggleClass('active');
            clicked.find('.amounts').toggleClass('active');
        });
        $jq(document).on('click','.field_qty span:not(.active)',function(){
            var clicked = $jq(this);
            $jq('.field_qty span.active').removeClass('active');
            clicked.addClass('active');
        });
    }

	var fnGetMetaContent = function (propName) {
		var metas = document.getElementsByTagName('meta');
		for (var i = 0; i < metas.length; i++) {
			var name = metas[i].getAttribute("name");
			if (name == propName) {
				return metas[i].getAttribute("content");
			}
		}
		return "";
    }

    var fnSocialShare = function () {
		var containerSocialShare = $jq('.share_social_network');

		$jq(containerSocialShare).find('a').click(function (event) {
			event.preventDefault();
			var productImage = $jq('.images_big img').length ? $jq('.images_big img:eq(0)').attr('src') : '',
				network = $jq(this).attr('data-share');

			helperProductShare(network, productImage);

		})
    }

    var helperProductShare = function (network, media) {

		var width = height = 550,
			w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
			h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
			left = ((w / 2) - (width / 2)) + 10,
			top = ((h / 2) - (height / 2)) + 50,
			_url;

		switch (network) {
			case 'facebook':
				_url = networks.facebook.url.replace('{url}', optionsShare.url).replace('{title}', optionsShare.title)
				break;
			case 'twitter':
				_url = networks.twitter.url.replace('{url}', optionsShare.url).replace('{title}', optionsShare.title)
				break;
			case 'google':
				_url = networks.google.url.replace('{url}', optionsShare.url)
				break;
			case 'linkedin':
				_url = networks.linkedin.url.replace('{url}', optionsShare.url).replace('{title}', optionsShare.title).replace('{description}', optionsShare.description)
				break;
			case 'pinterest':
				_url = networks.pinterest.url.replace('{url}', optionsShare.url).replace('{media}', media).replace('{description}', optionsShare.description)
				break;
			case 'whatsapp':
				_url = networks.whatsapp.url.replace('{url}', optionsShare.url).replace('{title}', optionsShare.title)
                break;
            case 'instagram':
            _url = networks.instagram.url.replace('{url}', optionsShare.url).replace('{title}', optionsShare.title)
            break;
		}

		if (_url)
			window.open(_url, optionsShare.title, 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);

    }
    
    var setProductModal = function() {
        var modal = document.getElementById("measure-modal");
        var btn = document.getElementsByClassName("measure-modal-btn");
        var span = document.getElementsByClassName("measure-modal-close")[0];

        var setModalStyle = function() {
            /*modal.style.display = "block";*/
            $('#measure-modal').fadeIn(300);
        };
        
        for (var i = 0; i < btn.length; i++) {
            btn[i].addEventListener('click', setModalStyle, false);
        }

        span.onclick = function() {
            /*modal.style.display = "none";*/
            $('#measure-modal').fadeOut(300);
        }

        window.onclick = function(e) {
            if (e.target == modal) {
                /*modal.style.display = "none";*/
                $('#measure-modal').fadeOut(300);
            }
        }
    }

    var hackOutStock = function() {
        if($('#native-buy-btn').length > 0) {
            var getStyle = $('#native-buy-btn > a').css("display");
            if(getStyle == "none") {
                $('.sku_container').remove();
                $('.container_qty_buy').remove();
                $('.msjPrice').remove();
                $('#description_short').after('<p class="out-stock-title">Producto agotado temporalmente</p>');
                $('h2.productName').after('<div class="out-stock-flag">AGOTADO</div>');
            }
            $('#native-buy-btn').remove();
        }
    }

    var putSliderImagesSmallProduct = function () {
        var options = {
        };

        globales.funcionalidadesGenerales.applySlick($jq('.images_product .images_thumbs'),options);
    };

    return { init: init };
}();

$jq(document).ready(function () {
    funcionalidadesProducto.init();
});