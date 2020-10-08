var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var globales = require("../base/globales");
var funcionalidadesInicio = function() {
    const emailRegexp = /\S+@\S+\.\S+/;
    var init = function() {
        bannerPrincipal();
        carruselTabs();
        carruselProductos();
        carruselCategorias();
        slickArrowEffect();
        newsletter();
        $jq(window).on('resize',function(){
            carruselTabs();
        });
    };
    var bannerPrincipal = function() {
        // slider principal home
        var dotsLeft = $jq('.bannerPrincipal #bannerPrincipal picture').length;
        $jq('.bannerPrincipal #bannerPrincipal').slick({
            autoplay: false,
            arrows: true,
            infinite: true,
            speed: 500,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            prevArrow: '<img class="slick-prev" src="/arquivos/ArrowLeft.png" />',
            nextArrow: '<img class="slick-next" src="/arquivos/ArrowRight.png" />',
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
            ]
        });
        /*$jq('.bannerPrincipal #bannerPrincipal .slick-dots').css('left',($jq(window).width()-$jq('.slick-dots').width())/2+'px');
        $.each($jq('.bannerPrincipal #bannerPrincipal .bannerTexts'),function(){
            $jq(this).css('left',($jq(window).width()-$jq(this).width())/2+'px');
        });*/
    }

    var carruselProductos= function(){
        var optionsCaruselProductos = {
            autoplay: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: '<img class="slick-prev" src="/arquivos/ArrowLeft.png" />',
            nextArrow: '<img class="slick-next" src="/arquivos/ArrowRight.png" />',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
            ]
        };
        $jq(document).on('click','.productos .tabs .content_tab',function(e){
            var _ = $jq(this).find('a');
            e.preventDefault();
            if(!_.is('.active')){
                $jq('.productos .content_tab.active a.active').removeClass('active');
                $jq('.productos .content_tab.active').removeClass('active');
                $jq(this).addClass('active');
                var tab = _.attr('href');
                //_.closest('.content_tabs').find('.content_container').height(_.closest('.content_tabs').find(tab).outerHeight());
                _.parent().parent().find('a').removeClass('active');
                _.addClass('active');
                _.closest('.content_tabs').find('.item').removeClass('active');
                _.closest('.content_tabs').find(tab).addClass('active');
                /*_.closest('.content_tabs').find('.item').fadeOut();
                _.closest('.content_tabs').find(tab).fadeIn();*/
                if($jq(tab).find('.slick-track').width() == 0)
                    globales.funcionalidadesGenerales.applySlick($jq(tab).find('ul').first().slick('unslick'),optionsCaruselProductos);
                /*setTimeout(function(){
                    $jq('.content_tabs .content_container').height($jq(tab).outerHeight());
                },100);*/
            }
        });
        $jq('.helperComplement').remove();
        $jq('.prateleira > h2').remove();
        globales.funcionalidadesGenerales.applySlick($jq('.prateleira ul:not(.insert-sku-checklist)'),optionsCaruselProductos);
    }

    var carruselTabs = function(){
        var optionsCaruselTabs = {
            autoplay: true,
            arrows: false,
            infinite: true,
            speed: 500,
            autoplaySpeed: 2500,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 331,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                    }
                },
            ]
        };
        if($jq(window).width() < 993){
            if(!$jq('.productos .tabs').find('.slick-track').length)
                globales.funcionalidadesGenerales.applySlick($jq('.productos .tabs'),optionsCaruselTabs);
        }else{
            if($jq('.productos .tabs').find('.slick-track').length)
                $jq('.productos .tabs').slick('unslick');
        }
    }

    var carruselCategorias = function(){
        var optionsCarusel = {
            autoplay: true,
            arrows: true,
            dots: true,
            infinite: true,
            speed: 500,
            autoplaySpeed: 2000,
            slidesToShow: 5,
            slidesToScroll: 5,
            prevArrow: '<img class="slick-prev" src="/arquivos/ArrowLeft.png" />',
            nextArrow: '<img class="slick-next" src="/arquivos/ArrowRight.png" />',
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                    }
                },
                {
                    breakpoint: 769,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        dots: false,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 450,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                        centerMode: true,
                    }
                },
            ]
        };
        $jq('.carousel-categorias .tabs .content_tab').click(function(e){
            var _ = $jq(this).find('a');
            e.preventDefault();
            if(!_.is('.active')){
                $jq('.carousel-categorias .content_tab.active').removeClass('active');
                $jq(this).addClass('active');
                var tab = _.attr('href');
                //_.closest('.content_tabs').find('.content_container').height(_.closest('.content_tabs').find(tab).outerHeight());
                _.parent().parent().find('a').removeClass('active');
                _.addClass('active');
                _.closest('.content_tabs').find('.item').removeClass('active');
                _.closest('.content_tabs').find(tab).addClass('active');
                /*_.closest('.content_tabs').find('.item').fadeOut();
                _.closest('.content_tabs').find(tab).fadeIn();*/
                if($jq(tab).find('.slick-track').width() == 0)
                    globales.funcionalidadesGenerales.applySlick($jq(tab).find('ul').first().slick('unslick'),optionsCarusel);
                /*setTimeout(function(){
                    $jq('.content_tabs .content_container').height($jq(tab).outerHeight());
                },100);*/
            }
        });
        globales.funcionalidadesGenerales.applySlick($jq('.carousel-categorias ul'),optionsCarusel);
    }

    var slickArrowEffect = function() {
        $('.slick-arrow').click(function(){
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
            removeActiveTime($(this));
        });
    }

    var removeActiveTime = function(element) {
        setTimeout(function(){
            element.removeClass('active');
        }, 300);
    }

    var newsletter = function(){
        $jq('#form-button').click(function(e){
            var form = $jq(this).closest('form').first();
            e.preventDefault();
            var client = validateForm(form);
            if(client){
                saveNewsletter(client,form);
                form.find('#news-message').empty();
            }else
                form.find('#news-message').html('<span class="error-message">Debes rellenar correctamente todos los campos</span>');
        });
    }

    var validateForm = function(form){
        var client = {
            'email' : $jq(form).find('#email').val(),
            'phone' : parseInt($jq(form).find('#phone').val()),
            'child' : $jq(form).find('input[name=genre]:checked').val(),
            'policies' : $jq(form).find('#politica')[0].checked,
        }
        if( client.email == "" || !emailRegexp.test(client.email) || client.phone == "" || !Number.isInteger(client.phone) || client.phone.toString().length < 7 || client.child == undefined || !client.policies)
            return false;
        else
            return client;
    }

    var saveNewsletter = function(client,form){
        var searchURL = '/api/dataentities/NW/search?_where=email='+client.email+'&_fields=email&v='+getRandomVersion();
        $jq.ajax({
            'url': searchURL,
            success: function(data){
                if(data.length == 0){
                    var url = '/api/dataentities/NW/documents';
                    $jq.ajax({
                        'url' : url,
                        'type' : 'PATCH',
                        'headers' : {
                            'Accept' : 'application/vnd.vtex.ds.v10+json',
                            'Content-Type' : 'application/json'
                        },
                        'data' : JSON.stringify(client),
                        success : function(datos){
                            delete client.child;
                            delete client.policies;
                            saveClient(client,form);
                        }
                    });
                }else{
                    form.find('#news-message').html('<span class="error-message">El correo ya está registrado en nuestro newsletter</span>');
                }
            }
        });
    }

    var saveClient = function(client,form){
        client.isNewsletterOptIn = true;
        var url = '/api/dataentities/CL/documents';
        $jq.ajax({
            'url' : url,
            'type' : 'PATCH',
            'headers' : {
                'Accept' : 'application/vnd.vtex.ds.v10+json',
                'Content-Type' : 'application/json'
            },
            'data' : JSON.stringify(client),
            success : function(datos){
                console.warn("Success Client");
                form[0].reset();
                form.find('#news-message').html('<span class="success-message">Se ha registrado correctamente.</span>');
            }
        });
    }

    var getRandomVersion = function() {
        var min = 0;
        var max = 1000;
        min = Math.ceil(min);
        max = Math.floor(max);
        var version = Math.floor(Math.random() * (max - min + 1)) + min;
        return '&v=' + version;
    }

    // Funciones públicas.
    return {
        init: init
    };
}();
$jq(document).ready(function() {
    funcionalidadesInicio.init();
});