var $jq = require("jquery");
window.jq = $jq; // Para ser usado por el código de Fancybox 3. Ver string-replace-loader en webpack.config.
var globales = require("../base/globales");
var funcionalidadesInicioLogin = function() {
    var init = function() {
        logoDiv();
    };
    var logoDiv = function() {
        //console.log("Hola-Login");
        if ($('body.login-page')) {
            
            $('#vtexIdContainer .vtexIdUI .vtexIdUI-page-active').before('<div class="Logo-login"><img class="img-login" src="/arquivos/logo-movies-email.png"></div>');
        }
    };

    return {
        init: init
    };
}();
$jq(document).ready(function() {
    setTimeout(function() {
        funcionalidadesInicioLogin.init();
    }, 3000)
});