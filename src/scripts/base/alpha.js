const alpha = (function () {

    var instance;

    function init(conf, idProd) {

        var _conf = {}
        var _source = {}
        var _skuJson = null
        var _html = ''
        var _container = ''
        var _radios = null
        var _labels = null
        var _actives = []
        var _templates = {}
        var _activeClassName = 'checked'
        var _inactiveClassName = 'stock_unavailable'
        //estado que no existe
        var _idProduct = null
        var _urlSite = window.location.protocol + "//" + window.location.host
        var _endpoint = '/api/catalog_system/pub/products/search/?fq=productId:'
        var _variations = {}
        var _images = {}
        var _cache = {}

        // Private
        function __construct(conf, idProd) {
            _conf      = conf
            _idProduct = idProd
            _container = _conf.product.variantsContainer

            _getProductData()
        }

        function _getProductData() {

            if (_conf.environment == 'dev'){
                _source = dummy[0]
                _buildDimension()
                _setTemplatesByDefault()
                _loadDefault()
            }else {

                $.getJSON(_urlSite + _endpoint + _getProductId(), function (data) {
                    _source = data[0]
                })
                .done(function(){

                    if (Object.keys(_source).length > 0) {
                        _buildDimension()
                    }

                    _setTemplatesByDefault()
                    _loadDefault()
                })
                .fail(function() {
                    console.error( "error loading data product" );
                    _source = {}
                })
            }
        }

        function _buildDimension() {

            $.each(_source.items, function (index, obj) {
                $.each(obj.variations, function(i, variation) {
                    if (_variations[variation] == undefined) {
                        _variations[variation] = []
                    }

                    if (_variations[variation].indexOf(obj[variation][0]) == -1) {
                        _variations[variation].push(obj[variation][0])
                    }
                })
            })

        }

        function _loadDefault() {
            _drawVariants()

            var sku = _searchSku(true)

            _updateName()

            _updatePrice(sku)

            _updateReference(sku)

            _buildImages(sku.images)
        }

        function _searchSku(searchAvailable, searchWithActive) {
            searchWithActive = searchWithActive || false
            if (searchAvailable && !searchWithActive) {
                var itemSelected;
                $.each(_source.items, function(i, item){
                    if (item.sellers[0].commertialOffer.AvailableQuantity > 0) {
                        itemSelected = item;
                        return false
                    }
                })

                if (itemSelected){
                    return itemSelected
                }
            }

            if (searchWithActive) {
                //search based on dimensions selected
                var skuGroup = _source.items

                $.each(_actives, function(i, el) {
                    skuGroup = skuGroup.filter(function(sku){
                        if (typeof sku[el.data('dimension')] != 'undefined' && sku[el.data('dimension')] == el.val()){
                            return true
                        }
                    })
                })

                if (skuGroup.length > 0) {
                    return skuGroup[0]
                }

            }

            return _source.items[0]

        }

        function _buildImages(images) {

            var result = {}
            var tmp = []
            var bigImage = []
            var smallImage = []
            var zoom = false

        //build images
        $.each(_conf.product.images.dimensions, function(i, tamanio) {

            $.each(images, function(index, image) {

                if (result[i] == undefined) {
                    result[i] = {}
                }

                tmp = image.imageUrl
                result[i][image.imageId] = { 'imageUrl' :  image.imageUrl, 'imageText' : image.imageText}

                /*tmp = image.imageUrl.split('/' + image.imageText)*/
                /*result[i][image.imageId] = {'imageUrl' : tmp[0].replace(image.imageId,image.imageId+'-'+tamanio.replace('x', '-')) + tmp[1], 'imageText' : image.imageText }*/
            })
        })

        //draw images
        $.each(result, function(type, image) {
            $.each(image, function(id, dataImage) {

                switch (type) {
                    case 'big':

                    if (typeof result['zoom'] != 'undefined') {
                        zoom = (result['zoom'][id]) ? result['zoom'][id]['imageUrl'] : ''
                    }

                    bigImage.push(_getImageTemplate(dataImage, zoom))
                    break;
                    case 'small':
                    smallImage.push(_getImageTemplate(dataImage, ''))
                    break;
                }
            })
        })

        $(document).trigger('alpha.before.load.images', {'big': bigImage, 'small' : smallImage })

        }

        function _getImageTemplate(dataImage, urlZoom) {

            var data = {
                'src' : dataImage.imageUrl,
                'alt' : dataImage.imageText,
                'class' : '',
                'data' : '',
                'template' : 'image'
            }

            if (urlZoom != '') {
                data['class'] = 'easyzoom zoomFly'
                data['data'] = 'data-zoomimage="'+urlZoom+'"'
            }

            return _renderTemplate(data)
        }

        function _setTemplatesByDefault() {
            _templates['without_image'] = '<label for="{{id_producto}}_{{dimension}}_{{counter}}" class="dimension-{{dimension}}" style="background-color: rgb({{rgb}});">{{value}}</label>'
            _templates['with_image']    = '<label for="{{id_producto}}_{{dimension}}_{{counter}}" class="dimension-{{dimension}}">{{value}}<img loading="lazy" src="/arquivos/{{value_lowercase}}" class="{{value_lowercase}}" alt="{{value}}"></label>'
            _templates['image'] = '<div class="{{class}}"><a {{data}}><img loading="lazy" src="{{src}}" alt="{{alt}}" width="10%"/></a></div>'
        }

        function _drawVariants() {
            var counter = 0;

            Object.keys(_variations).forEach(function(el) {
                _html += '<div class="' + el + '" >'
                _html += '<span>' + el + '</span>'
                _html += '<div class="content_skus">'

                _variations[el].forEach(function(value) {
                    _html += '<div class="item">'
                    _html += _getInput(el, value, counter)
                    _html += _getLabel(el, value, counter)
                    _html += '</div>'
                    counter++
                })

                _html += '</div>'
                _html += '</div>'
            })

            element = $(_container).html(_html);

            _html = ''
            _radios = $(_container + ' input[type="radio"]')
            _labels = $(_container + ' label')

            _defineChangeEvent()

        }

        function _renderTemplate(data) {
            var template = data['template'] || 'without_image'
            var templateResult = _templates[template]
            $.each(data, function(index, value){
                templateResult = templateResult.replace(new RegExp('{{'+index+'}}', 'g'), value)
            })

            return templateResult
        }

        function setTitle(name) {
            _source.name = name
            return _source.name
        }

        function _getInput(el, value, counter) {
            var inputType = 'radio'

            if (typeof _conf.product.inputType[el] != 'undefined') {
                inputType = _conf.product.inputType[el]
            }

            switch (inputType.toLowerCase()) {
                case 'radio':
                return '<input type="radio" name="' + _getProductId() + '_' + el + '" dimension="' + el + '" data-value="' + value + '" data-dimension="' + el + '" class="skuselector-specification-label input-dimension-' + el +' sku-selector skuespec_' + value.toLowerCase() + ' change-image" id="' + _getProductId() + '_' + el + '_' + counter + '" value="' + value + '" specification="' + value.toLowerCase() + '">'
                break;
                case 'select':
                return ''
                break;
            }
        }

        function _getLabel(el, value, counter) {
            var data = {}
            var rgb  = '255,255,255'
            var template = 'without_image'

            switch(_getColorType(value)) {
                case 'COLOR':
                rgb = _hexToRgb(value.split('_')[1].toLowerCase())
                break;
                case 'HEX':
                rgb = _hexToRgb('#' + value.split('_')[0].toLowerCase())
                break;
                case 'TEXT':
                template = 'with_image'
                break;
            }

            data = {
                'id_producto' : _getProductId(),
                'dimension' : el,
                'counter' : counter,
                'value' : value,
                'value_lowercase' :value.toLowerCase(),
                'rgb' : rgb,
                'template' : template
            }


            return _renderTemplate(data)
        }

        function _getColorType(value) {

            if (value.indexOf('HEX') >= 0) {
                return 'HEX'
            }

            if (value.indexOf('_#') >= 0){
                return 'COLOR'
            }

            if (value.indexOf('TEXT') >= 0) {
                return 'TEXT'
            }
        }

        function _validImageVariant(el) {
            return (_imageVariants.indexOf(el) >= 0)
        }

        function _getProductId() {
            return _idProduct
        }

        function _hexToRgb(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? (parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16)) : '255,255,255';
        }

        function _numberFormat(numero, numDecimales, separadorMiles, separadorDecimales) {
            var n = numero,
            numDecimales = isNaN(numDecimales = Math.abs(numDecimales)) ? 2 : numDecimales,
            separadorDecimales = separadorDecimales == undefined ? "." : separadorDecimales,
            separadorMiles = separadorMiles == undefined ? "," : separadorMiles,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(numDecimales)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + separadorMiles : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + separadorMiles) + (numDecimales ? separadorDecimales + Math.abs(n - i).toFixed(numDecimales).slice(2) : "");
        }

        function _defineChangeEvent(){
            _radios.off('change').change(function() {
                _refreshRadioStatus()
                _searchStock(this)
            })
        }

        function _refreshRadioStatus(){
            _actives = []
            var el;
            _radios.each(function() {
                el = $(this)
                if (el.is(':checked')) {
                    _actives.push(el)
                    el.next().addClass(_activeClassName)
                } else {
                    el.next().removeClass(_activeClassName)
                }
            })
        }

        function _searchStock(el) {
            el = $(el)
            var dimension = el.data('dimension')
            var value = el.val()
            var availableDimensions = []
            var objTmp= {}

            $.each(_source.items, function (i,v) {
                if(v.variations.length > 1){
                    if (v[dimension][0] == value && v.sellers[0].commertialOffer.AvailableQuantity > 0) {
                        //clon object , search dimensions != to value
                        availableDimensions.push($.map(v.variations, function(val, index){
                            if (v[val] != value) return {dimension : val, value : v[val][0]}
                        })[0]);
                    }
                }else{
                    if (v.sellers[0].commertialOffer.AvailableQuantity > 0) {
                        availableDimensions.push($.map(v.variations, function(val, index){
                            return {dimension : val, value : v[val][0]}
                        })[0]);
                    }
                }
            })
            //set disabled
            $.each(availableDimensions, function(i, data) {
                _disableDimension(data.dimension, data.value)
            })

            //enable only stock true
            $.each(availableDimensions, function(i, data) {
                _enableDimension(data.dimension, data.value)
            })

            var sku = _searchSku(true, true)

            if (sku) {
                _updateName(sku)
                _updatePrice(sku)
                _updateReference(sku)
                _buildImages(sku.images)
            } else {
                _buildImages(_searchSku(true, true)['images'])
            }
        }

        function _disableDimension(dimension) {
            $(_container + ' label.dimension-'+dimension).addClass(_inactiveClassName)
            $(_container + ' input[data-dimension="'+dimension+'"]').addClass(_inactiveClassName)

        }

        function _enableDimension(dimension, value) {
            var radio = $(_container + ' input[data-dimension="'+dimension+'"][value="'+value+'"]')
            radio.removeClass(_inactiveClassName)
            $(_container + ' label.dimension-'+dimension+'[for="'+radio.attr('id')+'"]').removeClass(_inactiveClassName)
        }

        function _getSelectedSku() {
            //esto se puede mejorar con map buscando una a una las dimensiones cada vez reduciendo los resultados
            var cantDimensions = Object.keys(_variations).length
            var counter = 0
            var skuSelected;
            $.each(_source.items, function(i, sku) {
                $.each(_actives, function(key, el) {
                    if (typeof sku[el.data('dimension')] != 'undefined' && sku[el.data('dimension')] == el.val()){
                        counter++
                    }
                })

                if (counter == cantDimensions) {
                    skuSelected = sku
                }
                counter = 0

            })

            return skuSelected
        }

        function _updateName(sku) {
            var name = ''
            if (sku) {
                name = _source.productName + ' ' + sku.nameComplete.replace(_source.productName, '')
            }else {
                name = _source.productName
            }


            $(_conf.product.titleContainer).html(name)

        }

        function _updatePrice(sku) {

            if (sku){
                var infoPrice = null
                $(_conf.product.priceContainer).css('display', 'none')
                $(_conf.msjErrorPriceContainer).hide()

                infoPrice = sku.sellers[0].commertialOffer

                var tax = infoPrice.Tax
                var listPrice = infoPrice.PriceWithoutDiscount
                var bestPrice = infoPrice.Price

                if (_conf.calculeTax) {
                    listPrice = Math.round(((tax) / (bestPrice) + 1)*(listPrice));
                    bestPrice = Math.round((bestPrice) + (tax));
                }

                $(_conf.product.bestPriceContainer).show().html('$' + _numberFormat(bestPrice, _conf.decimal_number, '.', ','))

                if (listPrice > bestPrice){
                    $(_conf.product.priceContainer).html('$' + _numberFormat(listPrice, _conf.decimal_number, '.', ',')).addClass('hasBestPrice').css('display', 'block');
                    _updateDiscount(listPrice,bestPrice);
                }else{
                    $(_conf.product.discountContainer).css('display','none');
                }

                if (bestPrice <= 0) {
                    $(_conf.product.bestPriceContainer).css('display', 'none');
                    $(_conf.msjErrorPriceContainer).html(_conf.msjErrorPrice).show();
                }
            }

        }

        function _updateDiscount(listPrice,bestPrice){
            var discount = (100 - Math.floor(bestPrice*100/listPrice));
            $(_conf.product.discountContainer).html(discount+"%").css('display','block');
        }

        function _updateReference(sku) {

            var reference = ''

            if (_conf.product.enableReferenceBySku) {
                reference = sku.referenceId[0]['Value']
            } else {
                reference = _source.productReference
            }

            $(_conf.product.referenceContainer).html(reference)
        }

        function _getErrors() {
            var msg = ''
            var actual = []
            $.each(_actives, function(i, element){
                actual.push($(element).data('dimension'))
            })

            $.each(Object.keys(_variations), function(i, dimension){
                if ($.inArray(dimension, actual) == -1){
                    msg += '<li> Debes seleccionar ' + dimension + '</li>'
                }
            })

            if (msg != ''){
                msg = '<ul>' + msg + '</ul>'
            }

            return msg
        }

        __construct(conf, idProd)

        return {
            getSelectedSku: function() {
                if (_actives.length == Object.keys(_variations).length) {
                    var sku = _getSelectedSku()
                    return {
                        response:true,
                        sku:sku.itemId,
                        error:''
                    }
                } else {
                    return {
                        response:false,
                        sku:null,
                        error: _getErrors()
                    }
                }
            }
        }
    }

    return {
        getInstance: function (conf, idProd) {

            if ( !instance ) {
                instance = init(conf, idProd);
            }

            return instance;
        }
    };
  })();

  module.exports.alpha = alpha;