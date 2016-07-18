//Variables globales
var contentAlertGeneral = $("#contentAlertGeneral");

// // JS  para funciones generales  del bingo
//---------- Funciones del Bingo ----------------------------------------------

/**
 * Funcion para crear el carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function new_carton(name, tipo_gane, tipo_gane_especifico, num_filas, num_columnas) {

    var id_carton = guidGenerator();

    var carton = {//objeto carton
        modo: "juego", //edicion = modo edicion del carton
        id: id_carton,
        name: name,
        num_filas: num_filas,
        num_columnas: num_columnas,
        matriz_num: []
    };

    var bingo = {//objeto con los atributos y funciones del bingo 
        name: "nuevo_bingo",
        tipo_gane: tipo_gane,
        tipo_gane_especifico: tipo_gane_especifico,
        cartones: [],
        lista_numeros: []
    };

    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie === 'undefined' || bingo_cookie == null || bingo_cookie == "null") {//pregunta si existe la cookie
        carton = llenar_carton(carton);
        bingo.cartones.push(carton);
        bingo_cookie = bingo;
        localStorage.setItem('bingo', JSON.stringify(bingo_cookie));
    } else {
        carton = llenar_carton(carton);
        bingo_cookie.tipo_gane = tipo_gane;
        bingo_cookie.tipo_gane_especifico = tipo_gane_especifico;
        bingo_cookie.cartones.push(carton);
        localStorage.setItem('bingo', JSON.stringify(bingo_cookie));
    }

    return carton;

}

/**
 * Funcion para tomar las variables de html y llamar a la funcion para crear un 
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function llenar_carton(carton) {

    var carton = carton;

    for (var fila = 0; fila < parseInt(carton.num_filas); fila++) {
        var carton_fila = new Array();
        for (var columna = 0; columna < parseInt(carton.num_columnas); columna++) {
            var id_carton = guidGenerator();
            var numero_carton = {
                id: "num-" + id_carton,
                estado: "", //active or "" 
                value: ""
            };
            var formula_fila_carton = ((parseInt(carton.num_filas) / 2) - 0.5);
            var formula_columna_carton = ((parseInt(carton.num_columnas) / 2) - 0.5);
            if ((formula_fila_carton == fila) && (formula_columna_carton == columna)) {//si es la mitad del carton
                numero_carton.estado = "active";
            }
            carton_fila.push(numero_carton);
        }
        carton.matriz_num.push(carton_fila);
    }

    return carton;
}

/**
 * Funcion para tomar las variables de html y llamar a la funcion para crear un 
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function create_new_carton() {
//    Cookies.remove('bingo');

    $("#alert-new-carton").hide();

    var name = $("#new-nombre").val();
    var tipo_gane = $("#btn-gane").data("tipo_gane");
    var tipo_gane_especifico = $("#text_gane-linea-columna").data("tipo_gane_especifico");
    var num_filas = $("#new-num-filas").val();
    var num_columnas = $("#new-num-columnas").val();



    if ((name == "") || (tipo_gane == "") || (num_filas == "") || (num_columnas == "")) {

        $("#alert-new-carton").show();

        $("#alert-new-carton .alert-content").html("Llene todos los campos");
    } else {
        var carton = new_carton(name, tipo_gane, tipo_gane_especifico, num_filas, num_columnas);
        var carton_template = graficar_carton(carton);//graficar el carton
        
        var bingo_cookie3 = JSON.parse(localStorage.getItem('bingo'));

        $("#cartones-content").prepend(carton_template);
        poner_carton_modo_edicion(carton.id);

        $('#modal-new-carton').modal('hide');
        $('#new-nombre').val("");
        closeMenu();
    }

}

/**
 * Funcion que actualiza el tipo de gane del bingo
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function actualizar_tipo_gane(element) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var tipo_gane = $(element).attr("id");
        $("#content-text_gane-linea-columna").hide();

        bingo_cookie.tipo_gane = tipo_gane;
        bingo_cookie.tipo_gane_especifico = "tipogane-especifico-1";

        $("#text_gane-linea-columna").html($("#tipogane-especifico-1").html() + " <span class='caret'></span>");
        $("#text_gane-linea-columna").data("tipo_gane_especifico", "tipogane-especifico-1");
        $("#btn-gane").html($(element).data("name"));
        $("#btn-gane").data("tipo_gane", tipo_gane);
        localStorage.setItem('bingo', JSON.stringify(bingo_cookie));

        if ((tipo_gane === "tipogane-linea") || (tipo_gane === "tipogane-columna")) {
            $("#content-text_gane-linea-columna").show();
            return false;
        }
        return true;
    }
}
/**
 * Funcion que actualiza el tipo de gane  especifico
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function actualizar_tipo_gane_especifico(element) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (bingo_cookie) {//pregunta si existe la cookie
        var tipo_gane_especifico = $(element).attr("id");
        bingo_cookie.tipo_gane_especifico = tipo_gane_especifico;
        $("#btn-gane").html($(element).data("name"));
        localStorage.setItem('bingo', JSON.stringify(bingo_cookie));
    }
}

/**
 * Funcion actualiza el tipo de gane cuando se refresca la pagina
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function marcar_tipo_gane() {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var tipo_gane = bingo_cookie.tipo_gane;
        $("#content-text_gane-linea-columna").hide();
        if ((tipo_gane === "tipogane-linea") || (tipo_gane === "tipogane-columna")) {
            $("#content-text_gane-linea-columna").show();
            var name_gane_especifico = $("#" + bingo_cookie.tipo_gane_especifico).data("name");
            $("#text_gane-linea-columna").html(name_gane_especifico);
            if (tipo_gane === "tipogane-linea") {
                update_tipo_gane("Linea ");
//                $("#" + bingo_cookie.tipo_gane_especifico).html("Linea " + name_gane_especifico);
            }
            if (tipo_gane === "tipogane-columna") {
                update_tipo_gane("Columna ");
//                $("#" + bingo_cookie.tipo_gane_especifico).html("Columna " + name_gane_especifico);
            }

        }
        $("#btn-gane").html($("#" + bingo_cookie.tipo_gane).data("name"));
    }
}

function update_tipo_gane(tipo) {
    $("#content-text_gane-linea-columna ul li").each(function () {
        $(this).html(tipo + $(this).data("name"));
    });
}

//---------- Funciones de graficar ----------------------------------------------

/**
 * Funcion que grafica  un carton
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function graficar_carton(carton) {
    var html_carton = "";
    var matriz_num = carton.matriz_num;

    html_carton += '<div id="carton-' + carton.id + '" class="carton-content col-md-6">' +
            '<fieldset>' +
            '<div class="row toolbar">' +
            '<div class="col-md-12 content-carton-option">' +
            '<span class="mdl-layout-title center pull-left">' + carton.name + '</span>' +
            '<div class="btn-group pull-right" role="group" aria-label="...">' +
            '<button type="button" class="btn btn-default" onclick="poner_carton_modo_edicion(\'' + carton.id + '\');"><img src="img/icons/ic_edit_black_24px.svg"/></button>' +
            '<button type="button" class="btn btn-default" onclick="varlidar_limpiar_carton(\'' + carton.id + '\');"><img src="img/icons/ic_clear_black_24px.svg"/></button>' +
            '<button type="button" class="btn btn-default" onclick="varlidar_eliminar_carton(\'' + carton.id + '\');"><img src="img/icons/ic_delete_forever_black_24px.svg"/></button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div id="alert-' + carton.id + '" class="carton-alert alert alert-warning alert-dismissible" role="alert" style="display:none">' +
            '<div class="alert-content"></div>' +
            '</div>' +
            '</div>' +
            '</div>';

    html_carton +=
            '<table class="table table-bordered table-hover">' +
            '<tbody>';

    for (var fila = 0; fila < parseInt(carton.num_filas); fila++) {
        html_carton += '<tr>';
        for (var columna = 0; columna < parseInt(carton.num_columnas); columna++) {
            var carton_numero = matriz_num[fila][columna];
            var formula_fila_carton = ((parseInt(carton.num_filas) / 2) - 0.5);
            var formula_columna_carton = ((parseInt(carton.num_columnas) / 2) - 0.5);

            if ((formula_fila_carton == fila) && (formula_columna_carton == columna)) {//si es la mitad del carton
                html_carton += '<td data-carton_id="' + carton.id + '" data-fila="' + fila + '" data-columna="' + columna + '"  id="td-' + carton_numero.id + '"  class="success center-star">';
                html_carton += '<img src = "star.png">';
            } else {
                html_carton += '<td data-carton_id="' + carton.id + '" data-fila="' + fila + '" data-columna="' + columna + '" id="td-' + carton_numero.id + '"  class="' + carton_numero.estado + '">';
                html_carton += '<input type="number" disabled data-carton_id="' + carton.id + '" data-fila="' + fila + '" data-columna="' + columna + '"  id="' + carton_numero.id + '"  value="' + carton_numero.value + '"/>';
            }
            html_carton += '</td>';
        }
        html_carton += '</tr>';
    }

    html_carton +=
            '</tbody>' +
            '</table>';


    return html_carton;
}

/**
 * Funcion que grafica los cartones al refrescar la pagina
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function graficar_cartones() {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));


    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var cartones = bingo_cookie.cartones;
//        for (var carton_num = cartones.length - 1; carton_num >= 0; --carton_num) {
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
//            console.log(cartones[carton_num]);
            var carton = cartones[carton_num];
            var carton_template = graficar_carton(carton);//graficar el carton

            $("#cartones-content").prepend(carton_template);

            //Verificar si el carton esta en modo edicion
            if (carton.modo === "edicion") {
                poner_carton_modo_edicion(carton.id);
            }

        }
    }

}

/**
 * Funcion que agrega la clase active al td de un numero encontrado
 * @param {String} id_num id del numero en la matriz
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function set_active(id_num) {
    $("#td-" + id_num).removeClass("success");
    $("#td-" + id_num).removeClass("warning");
    $("#td-" + id_num).addClass("active");
}

/**
 * Funcion que agrega la clase success al td de un numero encontrado
 * @param {String} id_num id del numero en la matriz
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function set_success(id_num) {
    $("#td-" + id_num).removeClass("active");
    $("#td-" + id_num).removeClass("warning");
    $("#td-" + id_num).addClass("success");
}

/**
 * Funcion que agrega la clase warning al td de un numero encontrado
 * @param {String} id_num id del numero en la matriz
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function set_warning(id_num) {
    $("#td-" + id_num).removeClass("success");
    $("#td-" + id_num).removeClass("active");
    $("#td-" + id_num).addClass("warning");
}

/**
 * Funcion que muestra mensaje de alert preguntando si se desea limpiar el carton
 * @param {String} id_carton id del carton para llamar a la funcion de limpiar en el boton de aceptar
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function varlidar_limpiar_carton(id_carton) {
//muestra el mensaje del warning con el mensaje de finalizar edicion
    $("#alert-" + id_carton).addClass("alert-warning");
    $("#alert-" + id_carton).show();
    var html_alert = $("#alert-" + id_carton + " .alert-content").html();
    var warning_alert = $("#alert-" + id_carton + " .alert-content .warning-limpiar");
//    console.log(warning_alert.length);
    if (!warning_alert.length) {
        $("#alert-" + id_carton + " .alert-content").html(html_alert + '<div class="warning-limpiar"><br> &#191;Seguro que desea eliminar todos los n&uacute;meros del carton&#63;   ' + '<button onclick="cancelar_limpiar(\'' + id_carton + '\');" type="button" class="btn btn-default">Cancelar</button><button onclick="limpiar_eliminar_carton(\'' + id_carton + '\',\'' + "" + '\',\'' + "limpiar" + '\')" type="button" class="btn btn-primary">Aceptar</button></div>');
    }
}

function cancelar_limpiar(id_carton) {
    $("#alert-" + id_carton + " .alert-content .warning-limpiar").remove();
    var html_alert = $("#alert-" + id_carton + " .alert-content").html();
    if (html_alert == "" || html_alert == "<br>") {//si queda vacio hay que ocultarlo
        $("#alert-" + id_carton).hide();
    }
}

/**
 * Funcion que muestra mensaje de alert preguntando si se desea limpiar el carton
 * @param {String} id_carton id del carton para llamar a la funcion de limpiar en el boton de aceptar
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function varlidar_eliminar_carton(id_carton) {
//muestra el mensaje del warning con el mensaje de finalizar edicion
    $("#alert-" + id_carton).addClass("alert-warning");
    $("#alert-" + id_carton).show();
    var html_alert = $("#alert-" + id_carton + " .alert-content").html();
    var warning_alert = $("#alert-" + id_carton + " .alert-content .warning-eliminar");
//    console.log(warning_alert.length);
    if (!warning_alert.length) {
        $("#alert-" + id_carton + " .alert-content").html(html_alert + '<div class="warning-eliminar"><br> &#191;Seguro que desea eliminar el carton&#63;   ' + '<button onclick="cancelar_eliminar(\'' + id_carton + '\');" type="button" class="btn btn-default">Cancelar</button><button onclick="limpiar_eliminar_carton(\'' + id_carton + '\',\'' + "" + '\',\'' + "eliminar" + '\')" type="button" class="btn btn-primary">Aceptar</button></div>');
    }
}

function cancelar_eliminar(id_carton) {
    $("#alert-" + id_carton + " .alert-content .warning-eliminar").remove();
    var html_alert = $("#alert-" + id_carton + " .alert-content").html();
    if (html_alert == "" || html_alert == "<br>") {//si queda vacio hay que ocultarlo
        $("#alert-" + id_carton).hide();
    }
}

//----------  Funciones  Opciones del carton ----------------------------------------------

/**
 * Funcion que modifica el atributo modo del carton (juego o edicion)
 * @param {String} id_content_carton es el id del contenedor de la estructura del carton
 * @param {String} modo_carton es el modo en el que esta el carton (juego o edicion)
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function set_carton_modo(id_content_carton, modo_carton) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));


    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var cartones = bingo_cookie.cartones;
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
//            console.log(cartones[carton_num]);
            var carton = cartones[carton_num];

            if (carton.id == id_content_carton) {
                bingo_cookie.cartones[carton_num].modo = modo_carton;
            }
        }
    }

    localStorage.setItem('bingo', JSON.stringify(bingo_cookie));//guarda nuevamente el bingo actualizado el carton

    return bingo_cookie;
}
/**
 * Funcion que se encarga de poner el carton en modo edición
 * nuevo carton
 * @param {String} id_content_carton es el id del contenedor de la estructura del carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function poner_carton_modo_edicion(id_content_carton) {
    //pone el carton en modo edicion
    $("#carton-" + id_content_carton + " td input").removeAttr("disabled");
    $("#carton-" + id_content_carton + " td input").prop('disabled', false);

    //muestra el mensaje del warning con el mensaje de finalizar edicion
    $("#alert-" + id_content_carton).addClass("alert-warning");
    $("#alert-" + id_content_carton).show();
    var html_alert = $("#alert-" + id_content_carton + " .alert-content").html();

    var warning_alert = $("#alert-" + id_content_carton + " .alert-content .warning-edicion");
//    console.log(warning_alert.length);
    if (!warning_alert.length) {
        $("#alert-" + id_content_carton + " .alert-content").html(html_alert + '<div class="warning-edicion">' + '<button onclick="finalizar_carton_modo_edicion(\'' + id_content_carton + '\')" type="button" class="btn btn-primary">Finalizar modo  edici&oacute;n</button></div>');
    }
//actualizar el modo del carton (juego o edicion)
    set_carton_modo(id_content_carton, "edicion");

}

/**
 * Funcion que se encarga de guardar los datos del carton y ponerlo desibled 
 * nuevo carton
 * @param {String} id_content_carton es el id del contenedor de la estructura del carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function finalizar_carton_modo_edicion(id_content_carton) {
    $("#carton-" + id_content_carton + " td input").prop('disabled', true);
    $("#carton-" + id_content_carton + " td input").attr('disabled', "disabled");

    //ocultar y limpiar alert

    $("#alert-" + id_content_carton + " .alert-content .warning-edicion").remove();
    var html_alert = $("#alert-" + id_content_carton + " .alert-content").html();
    if (html_alert == "" || html_alert == "<br>") {//si queda vacio hay que ocultarlo
        $("#alert-" + id_content_carton).hide();

    }


//actualizar el modo del carton (juego o edicion)
    set_carton_modo(id_content_carton, "juego");

}

/**
 * Funcion que se encarga de limpiar el carton
 * nuevo carton
 * @param {String} id_content_carton es el id del contenedor de la estructura del carton
 * @param {String} opcion si es limpiar o eliminar el carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function limpiar_eliminar_carton(id_carton, id_numero, opcion) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var cartones = bingo_cookie.cartones;
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
//            console.log(cartones[carton_num]);
            var carton = cartones[carton_num];

            if (carton.id == id_carton && opcion == "limpiar") {
                for (var fila = 0; fila < parseInt(carton.num_filas); fila++) {
                    for (var columna = 0; columna < parseInt(carton.num_columnas); columna++) {
                        var formula_fila_carton = ((parseInt(carton.num_filas) / 2) - 0.5);
                        var formula_columna_carton = ((parseInt(carton.num_columnas) / 2) - 0.5);

                        if ((formula_fila_carton == fila) && (formula_columna_carton == columna)) {//si es la mitad del carton
                            carton.matriz_num[fila][columna].estado = "active";
                        } else if (id_numero != "") {
                            if ((id_numero == carton.matriz_num[fila][columna].value)) {
                                carton.matriz_num[fila][columna].estado = "";
                            }
                        } else {
                            carton.matriz_num[fila][columna].estado = "";
                        }
//                        carton.matriz_num[fila][columna].value = "";
                    }
                }
                bingo_cookie.cartones[carton_num] = carton;
                cancelar_limpiar(id_carton);
                break;
            }
            if (carton.id == id_carton && opcion == "eliminar") {
                console.log(bingo_cookie.cartones[carton_num]);
                cancelar_eliminar(id_carton);
                bingo_cookie.cartones.splice(carton_num, 1);//eliminar el carton de la lista
                $("#carton-" + id_carton).remove();//se elimina graficamente
            }

        }
    }
    $("#carton-" + id_carton + " td").attr("class", "limpiar");//limpia los valores

    localStorage.setItem('bingo', JSON.stringify(bingo_cookie));//guarda nuevamente el bingo actualizado el carton

    return bingo_cookie;
}

/**
 * Funcion que limpia todos los cartones
 * nuevo carton
 * @param {String} num_value recibe un numero a limpiar o "" para limpiar todos
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function limpiar_todos_cartones(num_value) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie

        var cartones = bingo_cookie.cartones;
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
            var carton = cartones[carton_num];
            bingo_cookie = limpiar_eliminar_carton(carton.id, num_value, "limpiar");
        }
        if (num_value == "") {
            bingo_cookie.lista_numeros = [];
        } else {
            bingo_cookie.lista_numeros.splice(bingo_cookie.lista_numeros.indexOf('' + num_value), 1);
        }
    }
    localStorage.setItem('bingo', JSON.stringify(bingo_cookie));//guarda nuevamente el bingo actualizado el carton
}

/**
 * Funcion que limpia todos los cartones de un numero especifico
 * nuevo carton
 * @param {String} numero_element input del numero a eliminar
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function limpiar_todos_cartones_num(numero_element, id_parent) {
    var numero = $(numero_element).data("value");
    limpiar_todos_cartones(numero);
    $("#" + id_parent).remove();
    location.reload();
}

//---------- Fin Funciones  Opciones del carton  ----------------------------------------------

//---------- Fin Funciones de graficar --------------------------------------------------------

/**
 * Funcion que actualiza el valor de un numero en un carton
 * nuevo carton
 * @param {String} id_carton es el id  del carton
 * @param {int} fila fila en la que esta el numero a actualizar
 * @param {int} columna en la que esta el numero a actualizar
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function update_value(id_carton, fila, columna, valor_num) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));


    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var cartones = bingo_cookie.cartones;
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
//            console.log(cartones[carton_num]);
            var carton = cartones[carton_num];

            if (carton.id == id_carton) {
                carton.matriz_num[fila][columna].value = valor_num;
                bingo_cookie.cartones[carton_num] = carton;
            }
        }
    }

    localStorage.setItem('bingo', JSON.stringify(bingo_cookie));//guarda nuevamente el bingo actualizado el carton

    return bingo_cookie;
}

//---------- Funciones del juego -------------------------------------------
/**
 * Funcion que agrega el nuevo numero a la cola en el bingo
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function add_num(num) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie

        if (bingo_cookie.lista_numeros.indexOf(num) === -1) {
            bingo_cookie.lista_numeros.push(num);
            localStorage.setItem('bingo', JSON.stringify(bingo_cookie));

            var id_num = guidGenerator();
            graficar_lista_numero(num, id_num);
        }

    }
    return bingo_cookie;
}

/**
 * Funcion que agrega el nuevo numero a la lista grafica
 * @argument {String} num numero a graficar
 * @argument {String} id_num id del numero en el grafico
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */

function graficar_lista_numero(num, id_num) {
    var template_num = '<li id="list-num-' + id_num + '">' +
            '<div class="btn-group">' +
            '<button class="btn btn-default" data-id="btn-num-' + id_num + '">' +
            num
            + '</button>' +
            '<button data-toggle="dropdown" class="btn btn-default dropdown-toggle">' +
            '<span class="caret"></span>' +
            '</button>' +
            '<ul  class="dropdown-menu">' +
            '<li>' +
            '<a href="#" data-value="' + num + '" onclick="limpiar_todos_cartones_num(this,\'list-num-' + id_num + '\');">Limpiar de Cartones</a>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</li>';
    $("#lista-numeros").prepend(template_num);//agregar numero a la lista en el panel grafico
}

/**
 * Funcion que agrega todos los numero que han salido en la parte grafica (llamar en el document ready)
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */

function graficar_lista_nummeros() {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie

        for (var cont_num = 0; cont_num < bingo_cookie.lista_numeros.length; cont_num++) {
            var id_num = guidGenerator();
            graficar_lista_numero(bingo_cookie.lista_numeros[cont_num], id_num);
        }
    }
    return bingo_cookie;
}

/**
 * Funcion que busca un numero en los cartones y actualiza el estado a active
 * nuevo carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function add_cartones_num(num) {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));


    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {//pregunta si existe la cookie
        var cartones = bingo_cookie.cartones;
        for (var carton_num = 0; carton_num < cartones.length; carton_num++) {
//            console.log(cartones[carton_num]);
            var carton = cartones[carton_num];

            for (var fila = 0; fila < parseInt(carton.num_filas); fila++) {
                var carton_fila = new Array();
                for (var columna = 0; columna < parseInt(carton.num_columnas); columna++) {
                    if (carton.matriz_num[fila][columna].value == num) {
                        carton.matriz_num[fila][columna].estado = "active";
                        set_active(carton.matriz_num[fila][columna].id);//marcar en los tableros
                    }

                }

            }
            bingo_cookie.cartones[carton_num] = carton;
        }
    }

    localStorage.setItem('bingo', JSON.stringify(bingo_cookie));//guarda nuevamente el bingo actualizado el carton

    return bingo_cookie;
}

/**
 * Funcion que valida gane  por carton
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function validar_gane() {
    var bingo_cookie = JSON.parse(localStorage.getItem('bingo'));

    if (typeof bingo_cookie !== 'undefined' && bingo_cookie != null && bingo_cookie != "null") {
        var cartones = bingo_cookie.cartones;
        var cartones_length = cartones.length;
        var tipo_gane = bingo_cookie.tipo_gane;
        var tipo_gane_especifico = bingo_cookie.tipo_gane_especifico;
        for (var carton_num = 0; carton_num < cartones_length; carton_num++) {
            var carton = cartones[carton_num];
            var validar_gane = false;
            switch (tipo_gane) {
                case "tipogane-completo":
                    validar_gane = gane_carton_completo(carton);
                    break;
                case "tipogane-4esquinas":
                    validar_gane = gane_cuatro_esquinas(carton);
                    break;
                case "tipogane-cualquier-linea":
                    gane_linea_horizontal(carton);
                    gane_linea_vertical(carton);
                    break;
                case "tipogane-linea":
                    var num = tipo_gane_especifico.match(/\d/g);
                    num = (parseInt(num[0]) - 1);
                    gane_linea(num, carton);
                    break;
                case "tipogane-columna":
                    var num = tipo_gane_especifico.match(/\d/g);
                    num = (parseInt(num[0]) - 1);
                    gane_columna(num, carton);
                    break;
                case "tipogane-linea-horizontal":
                    gane_linea_horizontal(carton);
                    break;
                case "tipogane-linea-vertical":
                    gane_linea_vertical(carton);
                    break;
                case "tipogane-cualquier-diagonal":
                    gane_cualquier_diagonal(carton);
                    break;
                case "tipogane-linea-diagonal-si-id":
                    validar_gane = gane_diagonal_superior_izquierda_a_inferior_derecha(carton, false);
                    break;
                case "tipogane-linea-diagonal-ii-sd":
                    validar_gane = gane_diagonal_inferior_izquierda_a_superior_derecha(carton, false);
                    break;
                case "tipogane-en-x":
                    validar_gane = gane_en_x(carton);
                    break;
            }
            if (validar_gane !== false) {
                if (validar_gane.resultado === "warning") {
                    graficar_warning(validar_gane.array_numeros);
                }
                if (validar_gane.resultado === "success") {
                    graficar_success(validar_gane.array_numeros);
                }
            }
        }
    }
}


/**
 * Funcion que valida gane de cartón completo
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */

function gane_carton_completo(carton) {
    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    var contador_active = 0;
    var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
    for (var fila = 0; fila < carton_filas; fila++) {
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if (num_estado === "active") {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
    }
    if (contador_active === ((carton_filas * carton_columnas) - 1)) {//llamar graficar warning
        var result = {
            resultado: "warning",
            array_numeros: numeros_marcar
        };
        messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " Cartón completo", "cartonColumna": ""});
        messages.showMessageWarning(contentAlertGeneral, carton.id + "_completo_" + "warning");
        return result;
    }
    if (contador_active === (carton_filas * carton_columnas)) {//llamar graficar success
        var result = {
            resultado: "success",
            array_numeros: numeros_marcar
        };
        messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Cartón completo", "cartonColumna": ""});
        messages.showMessageSuccess(contentAlertGeneral, carton.id + "_completo_" + "success");
        return result;
    }

    var result = {
        resultado: ""
    };

    return result;

}

/**
 * Funcion que valida gane de cartón completo
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_cuatro_esquinas(carton) {
    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    var contador_active = 0;
    var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
    for (var fila = 0; fila < carton_filas; fila++) {
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active") && (validar_esquina(carton_filas, carton_columnas, fila, columna))) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
    }

    if (contador_active === 3) {//llamar graficar warning
        var result = {
            resultado: "warning",
            array_numeros: numeros_marcar
        };
        messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " 4 Esquinas", "cartonColumna": ""});
        messages.showMessageWarning(contentAlertGeneral, carton.id + "_4esquinas_" + "warning");
        return result;
    }
    if (contador_active === 4) {//llamar graficar success
        var result = {
            resultado: "success",
            array_numeros: numeros_marcar
        };
        messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " 4 Esquinas", "cartonColumna": ""});
        messages.showMessageSuccess(contentAlertGeneral, carton.id + "_4esquinas_" + "success");
        return result;
    }
    var result = {
        resultado: ""
    };
    return result;
}

/**
 * Funcion que valida que un número sea esquina
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function validar_esquina(carton_fila, carton_columna, num_fila, num_columna) {
    if (esquina_superior_izquierda(carton_fila, carton_columna, num_fila, num_columna) ||
            esquina_inferior_izquierda(carton_fila, carton_columna, num_fila, num_columna) ||
            esquina_superior_derecha(carton_fila, carton_columna, num_fila, num_columna) ||
            esquina_inferior_derecha(carton_fila, carton_columna, num_fila, num_columna)
            ) {
        return true;
    }

    return false;
}

/**
 * Funcion que valida que un número sea esquina superior izquierda
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function esquina_superior_izquierda(carton_fila, carton_columna, num_fila, num_columna) {
    if (num_fila + num_columna === 0) {
        return true;
    }

    return false;
}

/**
 * Funcion que valida que un número sea esquina inferior izquierda
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function esquina_inferior_izquierda(carton_fila, carton_columna, num_fila, num_columna) {
    if ((num_columna === 0) && ((num_fila + 1) === carton_fila)) {
        return true;
    }

    return false;
}

/**
 * Funcion que valida que un número sea esquina superior derecha
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function esquina_superior_derecha(carton_fila, carton_columna, num_fila, num_columna) {
    if ((num_fila === 0) && ((num_columna + 1) === carton_columna)) {
        return true;
    }

    return false;
}

/**
 * Funcion que valida que un número sea esquina inferior derecha
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function esquina_inferior_derecha(carton_fila, carton_columna, num_fila, num_columna) {
    if (((num_columna + 1) === carton_columna) && ((num_fila + 1) === carton_fila)) {
        return true;
    }

    return false;
}




/**
 * Funcion que valida gane de diagonal esquina superior izquierda - esquina inferior derecha
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_diagonal_superior_izquierda_a_inferior_derecha(carton, gane_x) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    var contador_active = 0;
    var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
    for (var fila = 0; fila < carton_filas; fila++) {
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active") && (fila === columna)) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
    }

    if (contador_active === (carton_filas - 1)) {//llamar graficar warning
        var result = {
            resultado: "warning",
            array_numeros: numeros_marcar
        };
        if (!gane_x) {
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " Diagonal", "cartonColumna": ""});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_diagonal_SI_ID_" + "warning");
        }
        return result;
    }
    if (contador_active === carton_filas) {//llamar graficar success
        var result = {
            resultado: "success",
            array_numeros: numeros_marcar
        };
        if (!gane_x) {
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Diagonal", "cartonColumna": ""});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_diagonal_SI_ID_" + "success");
        }
        return result;
    }
    var result = {
        resultado: ""
    };
    return result;
}

/**
 * Funcion que valida gane de diagonal esquina inferior izquierda - esquina superior derecha
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_diagonal_inferior_izquierda_a_superior_derecha(carton, gane_x) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    var contador_active = 0;
    var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
    for (var fila = 0; fila < carton_filas; fila++) {
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active") && (((fila + columna) + 1) === carton_filas)) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
    }

    if (contador_active === (carton_filas - 1)) {//llamar graficar warning
        var result = {
            resultado: "warning",
            array_numeros: numeros_marcar
        };
        if (!gane_x) {
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " Diagonal", "cartonColumna": ""});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_diagonal_ID_SD_" + "warning");
        }
        return result;
    }
    if (contador_active === carton_filas) {//llamar graficar success
        var result = {
            resultado: "success",
            array_numeros: numeros_marcar
        };
        if (!gane_x) {
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Diagonal", "cartonColumna": ""});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_diagonal_ID_SD_" + "success");
        }
        return result;
    }
    var result = {
        resultado: ""
    };
    return result;
}


/**
 * Funcion que valida gane en X
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_en_x(carton) {

    var validar_gane_superior = gane_diagonal_superior_izquierda_a_inferior_derecha(carton, true);
    var validar_gane_inferior = gane_diagonal_inferior_izquierda_a_superior_derecha(carton, true);
    if (((validar_gane_superior.resultado === "success") && validar_gane_inferior.resultado === "warning") ||
            ((validar_gane_inferior.resultado === "success") && validar_gane_superior.resultado === "warning")) {
        var result = {
            resultado: "warning",
            array_numeros: validar_gane_superior.array_numeros.concat(validar_gane_inferior.array_numeros)
        };
        messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " X ", "cartonColumna": ""});
        messages.showMessageWarning(contentAlertGeneral, carton.id + "_diagonal_X_" + "warning");
        return result;
    }
    if ((validar_gane_superior.resultado === "success") && (validar_gane_inferior.resultado === "success")) {
        var result = {
            resultado: "success",
            array_numeros: validar_gane_superior.array_numeros.concat(validar_gane_inferior.array_numeros)
        };
        messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " X ", "cartonColumna": ""});
        messages.showMessageSuccess(contentAlertGeneral, carton.id + "_diagonal_X_" + "success");
        return result;
    }
    var result = {
        resultado: ""
    };
    return result;
}
/**
 * Funcion que valida gane de cualquier diagonal
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_cualquier_diagonal(carton) {

    var validar_gane_SI = gane_diagonal_superior_izquierda_a_inferior_derecha(carton, false);
    if (validar_gane_SI !== false) {
        if (validar_gane_SI.resultado === "warning") {
            graficar_warning(validar_gane_SI.array_numeros);
        }
        if (validar_gane_SI.resultado === "success") {
            graficar_success(validar_gane_SI.array_numeros);
        }
    }
    var validar_gane_ID = gane_diagonal_inferior_izquierda_a_superior_derecha(carton, false);

    if (validar_gane_ID !== false) {
        if (validar_gane_ID.resultado === "warning") {
            graficar_warning(validar_gane_ID.array_numeros);
        }
        if (validar_gane_ID.resultado === "success") {
            graficar_success(validar_gane_ID.array_numeros);
        }
    }
}



/**
 * Funcion que valida gane linea horizontal
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_linea_horizontal(carton) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    for (var fila = 0; fila < carton_filas; fila++) {
        var contador_active = 0;
        var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active")) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
        if (contador_active === (carton_filas - 1)) {//llamar graficar warning            
            graficar_warning(numeros_marcar);
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " Fila " + (fila + 1), "cartonColumna": ""});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_lineahorizontal_" + (fila + 1) + "_" + "warning");
        }
        if (contador_active === carton_filas) {//llamar graficar success
            graficar_success(numeros_marcar);
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Fila " + (fila + 1), "cartonColumna": ""});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_lineahorizontal_" + (fila + 1) + "_" + "success");
        }
    }
}
/**
 * Funcion que valida gane en una linea especifica
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_linea(fila_gane, carton) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    for (var fila = 0; fila < carton_filas; fila++) {
        var contador_active = 0;
        var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
        for (var columna = 0; columna < carton_columnas; columna++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active") && (fila_gane === fila)) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
        if (contador_active === (carton_filas - 1)) {//llamar graficar warning
            graficar_warning(numeros_marcar);
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": " Fila " + (fila + 1), "cartonColumna": ""});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_linea_" + (fila + 1) + "_" + "warning");
        }
        if (contador_active === carton_filas) {//llamar graficar success
            graficar_success(numeros_marcar);
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Fila " + (fila + 1), "cartonColumna": ""});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_linea_" + (fila + 1) + "_" + "success");
        }
    }
}

/**
 * Funcion que valida gane linea Vertical
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_linea_vertical(carton) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    for (var columna = 0; columna < carton_filas; columna++) {
        var contador_active = 0;
        var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
        for (var fila = 0; fila < carton_columnas; fila++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active")) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
        if (contador_active === (carton_columnas - 1)) {//llamar graficar warning
            graficar_warning(numeros_marcar);
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": "", "cartonColumna": " Columna " + (columna + 1)});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_lineavertical_" + (columna + 1) + "_" + "warning");
        }
        if (contador_active === carton_columnas) {//llamar graficar success
            graficar_success(numeros_marcar);
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": "", "cartonColumna": " Columna " + (columna + 1)});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_lineavertical_" + (columna + 1) + "_" + "success");
        }
    }
}
/**
 * Funcion que valida gane linea Vertical
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function gane_columna(columna_gane, carton) {

    var carton_filas = parseInt(carton.num_filas);
    var carton_columnas = parseInt(carton.num_columnas);
    for (var columna = 0; columna < carton_filas; columna++) {
        var contador_active = 0;
        var numeros_marcar = new Array();//array de id con los numeros a marcar con warning o success
        for (var fila = 0; fila < carton_columnas; fila++) {
            var num_estado = carton.matriz_num[fila][columna].estado;
            var num_id = carton.matriz_num[fila][columna].id;
            if ((num_estado === "active") && (columna === columna_gane)) {
                numeros_marcar.push(num_id);
                contador_active++;
            }
        }
        if (contador_active === (carton_filas - 1)) {//llamar graficar warning
            graficar_warning(numeros_marcar);
            messages.setMessageWarning({"cartonName": carton.name, "cartonFila": "", "cartonColumna": "" + (columna + 1)});
            messages.showMessageWarning(contentAlertGeneral, carton.id + "_columna_" + (columna + 1) + "_" + "warning");
        }
        if (contador_active === carton_filas) {//llamar graficar success
            graficar_success(numeros_marcar);
            messages.setMessageSuccess({"cartonName": carton.name, "cartonFila": " Fila " + (columna + 1), "cartonColumna": ""});
            messages.showMessageSuccess(contentAlertGeneral, carton.id + "_columna_" + (columna + 1) + "_" + "success");
        }
    }
}

/**
 * Funcion genérica para graficar con la clase warning
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */

function graficar_warning(array_id_numeros) {
    var array_length = array_id_numeros.length;
    for (var fila = 0; fila < array_length; fila++) {
        set_warning(array_id_numeros[fila]);
    }
}

/**
 * Funcion genérica para graficar con la clase success
 * @author Yeinel Rodriguez Murillo
 * @version 1.0
 */
function graficar_success(array_id_numeros) {
    var array_length = array_id_numeros.length;
    for (var fila = 0; fila < array_length; fila++) {
        set_success(array_id_numeros[fila]);
    }
}

//---------- Fin Funciones del juego -------------------------------------------

//---------- Fin Funciones del Bingo -------------------------------------------