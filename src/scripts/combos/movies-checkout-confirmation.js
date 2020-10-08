// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE.
// THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
$(document).ready(function(){
    setTimeout(function() {
        getData();
    }, 1000);

    function getData() {
        //var email = dataLayer[1].visitorContactInfo[0];
        if(dataLayer[1].transactionTotal != undefined){
            var total = dataLayer[1].transactionTotal;
        }else if(dataLayer[2].transactionTotal != undefined){
            var total = dataLayer[2].transactionTotal;
        }else if(dataLayer[3].transactionTotal != undefined){
            var total = dataLayer[3].transactionTotal;
        }

        /*$.ajax({
            url: '/api/dataentities/CL/search?_fields=email,document&_where=email='+ email,
            crossDomain: true,
            async: true,
            cache: false,
            type: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.vtex.ds.v10+json"
            },
            success: function(data) {
                console.log('data',data)
            }
        });*/

        $('.cconf-bank-invoice-description span').text('Ahora, efectúe el pago en el valor de $' + total +'.');
    }
});

$(window).load(function() {
    translations();

    function translations() {
        setTimeout(function(){
            $('.cconf-myorders-button').attr("href", "/_secure/account#/orders");
        }, 500);
    }
});