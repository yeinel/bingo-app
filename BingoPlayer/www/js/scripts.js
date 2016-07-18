// JS para Acciones generales

/**
 * Funcion para generar un id aleatorio
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * Funcion que se ejecuta cuando se levanta el modal de crear nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$('#modal-new-carton').on('show.bs.modal', function (e) {
    // do something...
    $("#alert-new-carton").hide();//ocultar mensajes de error

});

/**
 * Funcion a ejecutar en el onchange de los tipos de gane
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$(document).on("click", '#content-tipo-gane li', function (e) {
    var $this = this;
    $("#ModalMensaje").modal('show');
    $("#ModalMensaje .modal-body").html("Si cambia el tipo de juego se limpiaran todos los cartones.");
    $("#ModalMensaje #mensaje_aceptar").unbind('click').click(function () {
        var refrescar_pagina = actualizar_tipo_gane($this);//actualiza el cookie con el tipo de gane
        limpiar_todos_cartones("");
        $("#ModalMensaje").modal('hide');
        $('#cartones-content').html("");
        init();
        //location.reload();
    });

});

/**
 * Funcion a ejecutar con el click del limpiar todos los cartones
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$('#btnLimpiarCartones').click(function (e) {
    $("#ModalMensaje").modal('show');
    $("#ModalMensaje .modal-body").html("Seguro que desea limpiar todos los cartones?");
    $("#ModalMensaje #mensaje_aceptar").unbind('click').click(function () {
        limpiar_todos_cartones("");
        $('#ModalMensaje').modal('hide');
        closeMenu();
        $('#cartones-content').html("");
        init();
        //location.reload();
    });
});



/**
 * Funcion a ejecutar con el click del eliminar cartones
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$('#btnEliminarCartones').click(function (e) {
    $("#ModalMensaje").modal('show');
    $("#ModalMensaje .modal-body").html("Seguro que desea eliminar todos los cartones?");
    $("#ModalMensaje #mensaje_aceptar").unbind('click').click(function () {
        localStorage.clear();
        $('#ModalMensaje').modal('hide');
        $('#cartones-content').html("");
        closeMenu();
        init();
        //location.reload();
    });
});


/**
 * Funcion a ejecutar en el onchange del combo gale linea especifico
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$(document).on("click", '#content-text_gane-linea-columna li', function (e) {
    var self = this;
    $("#ModalMensaje .modal-body").html("Si cambia el tipo de juego se limpiaran todos los cartones.");
    $("#ModalMensaje").modal('show');
    $("#ModalMensaje #mensaje_aceptar").unbind('click').click(function () {
        actualizar_tipo_gane_especifico(self);//actualiza el cookie con el tipo de gane
        limpiar_todos_cartones("");
        $('#ModalMensaje').modal('hide');
        init();
        //location.reload();
    });

});

function closeMenu() {
    // close the drawer the button is clicked
    if ($('.mdl-layout__drawer').hasClass('is-visible')) {
        $('.mdl-layout__drawer').toggleClass('is-visible');
        jQuery(".mdl-layout__obfuscator").removeClass("is-visible");
    }
}


/**
 * Funcion de llamada general para graficar los cartones
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$(document).ready(function () {
    init();
    isNotBoards();
    resizeTabs();
    onKeyboard();
});


function init() {
    //marcar el tipo de gane seleccionado si se refresca la pagina
    marcar_tipo_gane();

    var bingo_storage = JSON.parse(localStorage.getItem('bingo'));
//    console.log(bingo_storage);
    graficar_cartones();//graficar los cartones que estan en session

    call_onchange_number();//llamar a la funcion del onchange

    graficar_lista_nummeros();//llama a la funcion para agregar de forma visual los numeros que ya han salido

    validar_gane();

//    recognize_image();
}

function recognize_image() {
    OCRAD(document.getElementById("pic"), {
        numeric: true
    }, function (text) {
        console.log(text);
        document.getElementById('transcription').innerText = text;
    });
}

function test_comunication(text) {
    document.getElementById('transcription').innerText = text;
}

/**
 * Funcion a ejecutar en el onchange del input del carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function call_onchange_number() {
    $(document).on("change", ".carton-content td input[type='number']", function () {
        var id_carton = $(this).data("carton_id");
        var fila = $(this).data("fila");
        var columna = $(this).data("columna");
        var valor_num = $(this).val();
//        messages.showSnackbar("El N&uacute;mero ya existente en el cartón", 3000, "Ok", function (event) {});
        update_value(id_carton, fila, columna, valor_num);
    });
}


/**
 * Funcion de llamada a la busqueda de numero en los cartones
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function add_new_number() {
    var num = $("#inputNumber").val();
    if (num != "") {
        add_cartones_num(num);//llama a la funcion para buscar los numeros en los cartones
        add_num(num);//Agrega el numero a la matriz y en la lista de numeros grafica
        $("#inputNumber").val("");
        $("#contentAlertGeneral").html("");
        validar_gane();

    }

}

/**
 * Funcion de llamada a la busqueda de numero en los cartones
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
$("#inputNumber").keypress(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        add_new_number();
    }


});


function isNotBoards() {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (bingo_cookie) {
        if (!bingo_cookie.cartones.length) {//si hay cartones
            createFirstBoard();
        }
    } else {
        createFirstBoard();
    }
}

function createFirstBoard() {
    var name = "cart&oacute;n #1";
    var tipo_gane = $("#btn-gane").data("tipo_gane");
    var tipo_gane_especifico = $("#text_gane-linea-columna").data("tipo_gane_especifico");
    var num_filas = $("#new-num-filas").val();
    var num_columnas = $("#new-num-columnas").val();

    var carton = new_carton(name, tipo_gane, tipo_gane_especifico, num_filas, num_columnas);
    var carton_template = graficar_carton(carton);//graficar el carton

    $("#cartones-content").prepend(carton_template);
    poner_carton_modo_edicion(carton.id);
}

function resizeTabs() {
    var withFrame = jQuery(window).width();
    jQuery(".tab-divider").width(withFrame);
}

function onKeyboard() {

//    $(document).on("focusin", ".carton-content", function () {
//        console.log("input entra");
//
//        $(".float-button").hide("slow");
//        $("header").hide("slow");
//        $("main").css("top","0px");
//        
//        var focused = document.activeElement;
//        if(focused.id && focused.id != "inputNumber"){
//            
//        }
//
//    });
//    $(document).on("blur", ".carton-content", function () {
//        console.log("input sale");
//        $("header").show("slow");
//        $(".float-button").show("slow");
//        $("main").css("top","110px");
//    });

}