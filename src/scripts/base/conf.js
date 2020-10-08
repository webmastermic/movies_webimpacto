module.exports = {
    'environment'             : 'produccion',
    'decimal_number'          : 0,
    'msjErrorPriceContainer'  : '.movies-produto .info_product .msjPrice',
    'msjErrorPrice'           : 'Producto en talla no disponible',
    'complementaryPriceText'  : 'COP',
    'calculeTax'              : true,
    'product' : {
        'inputType'             : {'Talla' : 'radio'},
        'imageFormat'           : '.jpg',
        'variantsContainer'     : '.sku_container',
        'titleContainer'        : '.movies-produto .info_product .productName',
        'bestPriceContainer'    : '.movies-produto .info_product .bestPrice',
        'enableReferenceBySku'  : false,
        'referenceContainer'    : '.ref',
        'priceContainer'        : '.movies-produto .info_product .listPrice',
        'discountContainer'     : '.movies-produto .images_product .discount',
        'images': {
        'dimensions' : {
            'big'   : '1000x1000',
            'small' : '100x100',
            'zoom'  : '2000x2000'
        },
        'imageBigContainer'   : '.images_big',
        'imageSmallContainer' : '.images_thumbs'
        }
    },
    'category' : {
        'containerProduct'      : '.vitrine_especific',
        'inputType'             : {'Talla': 'select'},
        'containerImage'        : '.image_vitrine',
        'titleContainer'        : '.nameProduct',
        'mainVariantsContainer' : '.colors_general',
        'bestPrice'             : '.bestPrice',
        'price'                 : '.listPrice',
        'containerVariation'    : '.selector_sku_container',
        'containerByVariation'  : '.content_sku_{{dimension}}',
    },
    'modal': {
        'containerModal'        : '.fast_shop_product',
        'inputType'             : {'Talla' : 'select'},
        'titleContainer'        : '.productName',
        'bestPrice'             : '.bestPrice',
        'price'                 : '.listPrice',
        'enableReferenceBySku'  : true,
        'referenceContainer'    : '.ref',
        'descriptionContainer'  : '.description',
        'containerImage'        : '.images_big',
        'variantsContainer'     : '.sku_container',
        'containerByVariation'  : '.content_sku_{{dimension}}',
        'viewMoreDetails'       : '.viewDetailsProducto',
        'containerMsgModal'     : '.buttons_buy ul',
        'msgNoAvailable'        : 'Producto en talla o color no disponible',
        'msjErrorPriceContainer'  : '.msjPrice',
        'msjErrorPrice'           : 'Producto en talla o color no disponible',
    },
    'wishlist': {
        'selector'              : '.btn_wishlist',
        'activeClass'           : 'active',
        'productContainer'      : '.vitrine_especific',
        'counterSelector'       : '.wishlist .qty'
    }
}