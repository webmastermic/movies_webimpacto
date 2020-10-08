var script = document.createElement("script");
script.src = "https://www.mercadopago.com/v2/security.js";
script.setAttribute("output","vtex.deviceFingerprint");
script.setAttribute("view","checkout");
document.body.appendChild(script);

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

$(window).on("hashchange", function() {
    changeText();
    if(window.location.hash.indexOf('/cart') > -1){
        $('.contenedor-share').css('display','block');
        shareCart();
    }else{
        $('.contenedor-share').css('display','none');
    }
    if(location.hash.indexOf('profile') > 0){
        changeText();
        addField();
    }
    if(location.hash.indexOf('cart') > 0 || location.hash.indexOf('shipping') > 0 || location.hash.indexOf('payment') > 0){
        changeText();
        $('.ship-complement.text label').text('Piso o Apartamento (ej: Apto 2A)');
    }
});
$(document).ready(function(){
    changeText();
    shareCart();
    changeLogos();
    changeCheckbox();
    if(location.hash.indexOf('cart') > 0 || location.hash.indexOf('shipping') > 0 || location.hash.indexOf('payment') > 0){
        changeText();
        $('.ship-complement.text label').text('Piso o Apartamento (ej: Apto 2A)');
    }
});
$(document).on('ajaxComplete',function(){
    if(window.location.hash.indexOf('/cart') > -1){
        $('.contenedor-share').css('display','block');
        shareCart();
    }else{
        $('.contenedor-share').css('display','none');
    }
    if(location.hash.indexOf('cart') > 0 || location.hash.indexOf('shipping') > 0 || location.hash.indexOf('payment') > 0){
        changeText();
        $('.ship-complement.text label').text('Piso o Apartamento (ej: Apto 2A)');
    }
})
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function changeText(){
    if( location.hash.indexOf('cart') !== -1 ){
        $('.more-products a').text('< ELEGIR MÁS PRODUCTOS');
        $('.more-products a').attr('href','/');
    }else{
        $('.more-products a').text('< VOLVER AL RESUMEN');
        $('.more-products a').attr('href','/checkout/#/cart');
    }
    $('.vtex-omnishipping-1-x-leanShippingText .shp-option-text-package, .shp-summary-package .false.shp-summary-package-time').each(function(i,v){
        var nDays = $(v).text().match(/(\d+)/)[0];
        //console.log('nDays',nDays)
        if(nDays <= 1) {
            $(v).text( 'En 24 horas' );
        } else {
            if(nDays == 24) {
                $(v).text( 'En 24 horas' );
            } else {
                $(v).text( 'Hasta 7 días hábiles' );
            }
        }
        /*if(nDays > 1){
            $(v).text( 'Hasta '+nDays+' días hábiles' );
            if(nDays != 24){
                $(v).text( 'Hasta '+nDays+' días hábiles' );
            }else{
                $(v).text( 'En '+nDays+' horas' );
            }
        }else{
            $(v).text( 'En '+(parseInt(nDays)+23)+' horas' );
        }*/
    });
    /*$('.shipping-date .shipping-estimate-date:not(".shipping-estimate-detail")').each(function(i,v){
        var nDays = $(v).text().match(/(\d+)/)[0];
        if(nDays > 1){
            $(v).text( 'Hasta '+nDays+' días hábiles' );
            if(nDays != 24){
                $(v).text( 'Hasta '+nDays+' días hábiles' );
            }else{
                $(v).text( 'En '+nDays+' horas' );
            }
        }else{
            $(v).text( 'En '+(parseInt(nDays)+23)+' horas' );
        }
    });*/
    $('label[for=ship-street]').text('Calle / Carrera / Avenida');
}
function changeLogos() {
    setTimeout(function(){
        $('#payment-group-bankInvoicePaymentGroup .payment-group-item-text').css('background-size','31px');
        $('#payment-group-creditCardPaymentGroup > span').css({
            'background-image' : 'url(/arquivos/Icon-Payment-Checkout.png)',
            'background-size' : '30px'
        });
        $('#payment-group-customPrivate_501PaymentGroup > span').css({
            'background-image' : 'url(/arquivos/codensav-30px-.png)',
            'background-size' : '40px',
            'background-position-x' : 'calc(100% + 4px)'
        });
        $('.bank-invoice-icon.bank-invoice-efecty').text('');
        $('.bank-invoice-icon.bank-invoice-baloto').text('');
        $('.bank-invoice-icon.bank-invoice-efecty').append('<img src="/arquivos/efecty-30px-.png" style="min-width:40px;margin-left:5px" />');
        $('.bank-invoice-icon.bank-invoice-baloto').append('<img src="/arquivos/baloto-30px-.png" style="min-width:40px;margin-left:5px" />');
        $('.bank-invoice-list .label-vertical-group.bank-invoice-list-item').css({
            'height' : 'auto',
            'width' : '60px'
        });
        $('#payment-group-debitPaymentGroup > span').text('PSE');
        $('#payment-group-debitPaymentGroup > span').css({
            'background-image' : 'url(/arquivos/pse-30px-.png)',
            'background-size' : '40px',
            'background-position-x' : 'calc(100% + 4px)'
        });
        changeLogos();
    }, 3000);
}

function changeCheckbox() {
    setTimeout(function() {
        $('#opt-in-newsletter').prop('required',true);
        $('#opt-in-newsletter + span').empty();
        $('#opt-in-newsletter + span').append( 'Acepto los <a target="_blank" href="/paginas-corporativas/terminos-y-condiciones" style="color:inherit;text-decoration:none">términos y condiciones</a> y <a target="_blank" href="/paginas-corporativas/politicas-de-privacidad" style="color:inherit;text-decoration:none">políticas de privacidad</a> y <a target="_blank" href="/paginas-corporativas/aviso-de-privacidad" style="color:inherit;text-decoration:none">aviso de privacidad</a>');
        changeCheckbox();
    }, 3000);
}

function addField(){
    var html = '<div class="gender-box">\n'+
    '<p class="client-gender input pull-left text required mask"">\n'+
    '<label for="client-gender">Sexo</label>\n'+
    '<select type="tel" id="client-gender" class="gender-select" placeholder="">\n'+
    '<option value="" disabled="" selected="">Selecciona una opción</option>\n'+
    '<option value="F">Femenino</option\n>'+
    '<option value="M">Masculino</option>\n'+
    '</select></p></div>';
    $('.gender-box').remove();
    $(html).insertAfter($('.phone-box'));
    if( localStorage.getItem('gender') == null ){
        $('#client-gender').on('change',function(){
            localStorage.setItem('gender',$(this).val());
            $('#go-to-shipping,#go-to-payment').removeAttr('disabled');
            $(this).addClass('success');
            if( $('#client-email').val() !== "" ){
                localStorage.setItem('email',$('#client-email').val());
            }
        });
        $('#go-to-shipping,#go-to-payment').attr('disabled','disabled');
        $('#go-to-shipping,#go-to-payment').click(function(){
            if( $('#client-email').val() !== "" ){
                localStorage.setItem('email',$('#client-email').val());
            }
        });
    }else{
        if( $('#client-email').val() !== "" ){
            localStorage.setItem('email',$('#client-email').val());
        }
        $("#client-gender").val(localStorage.getItem('gender')).addClass('success');
        $('#go-to-shipping,#go-to-payment').removeAttr('disabled');
    }
}


function shareCart() {
    $('.cart-share-btn').click(function(){
        if(typeof vtexjs !== 'undefined'){
            var storeUrl= location.protocol + '//www.mic.com.co/';
            var storeCheckoutPath = storeUrl + 'checkout/';
            var cartParam = '?orderFormId=';
            var cartParamVal = vtexjs.checkout.orderFormId;
            var cartLastParam = '#/cart';
            var fieldInput = $('.share-link-field');
            var wapp = $('.image-whatsapp > a');
            var msj = $('.msj-copy');
            //console.log("cartParamVal:"+cartParamVal);
            if(typeof cartParamVal !== 'undefined'){
                var sharedCartUri = storeCheckoutPath + cartParam + cartParamVal +
                cartLastParam;
                fieldInput.empty().val(sharedCartUri);
                fieldInput.select();
                document.execCommand("copy");
                msj.css('display','block');
                wapp.attr('href',"https://api.whatsapp.com/send?text= Este es mi carrito de compras en Movies "+sharedCartUri);
            }
        }
        //var dataEmail = vtexjs.checkout.orderForm.clientProfileData.email;
    })
    $('.image-whatsapp > a img').click(function(){
        if(typeof vtexjs !== 'undefined'){
            var storeUrl= location.protocol + '//www.mic.com.co/';
            var storeCheckoutPath = storeUrl + 'checkout/';
            var cartParam = '?orderFormId=';
            var cartParamVal = vtexjs.checkout.orderFormId;
            var cartLastParam = '#/cart';
            var fieldInput = $('.share-link-field');
            var wapp = $('.image-whatsapp > a');
            var msj = $('.msj-copy');
            //console.log("cartParamVal:"+cartParamVal);
            if(typeof cartParamVal !== 'undefined'){
                var sharedCartUri = storeCheckoutPath + cartParam + cartParamVal +
                cartLastParam;
                fieldInput.empty().val(sharedCartUri);
                //fieldInput.select();
                //document.execCommand("copy");
                //msj.css('display','block');
                wapp.attr('href',"https://api.whatsapp.com/send?text= Este es mi carrito de compras en Movies "+sharedCartUri);
            }
        }
        //var dataEmail = vtexjs.checkout.orderForm.clientProfileData.email;
    })
}