/*=========================================
    CARGAR LA TABLA DINAMICA DE PRODUCTOS
  ========================================*/

 // $.ajax({

//    url:"ajax/datatable-productos.ajax.php",
//    success:function(respuesta){

//       console.log("respuesta", respuesta);
//    }

// })

var perfilOculto = $("#perfilOculto").val();

$('.tablaProductos').DataTable({
    "ajax": "ajax/datatable-productos.ajax.php?perfilOculto=" + perfilOculto,
    "deferender": true,
    "retrieve": true,
    "processing": true,
   


    "language": {


        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }       

    }
 });


/*=============================================
CAPTURANDO LA CATEGORIA PARA ASIGNAR CÓDIGO
=============================================*/
$("#nuevaCategoria").change(function(){

    var idCategoria = $(this).val();

    var datos = new FormData();
    datos.append("idCategoria", idCategoria);

    $.ajax({

        url:"ajax/productos.ajax.php",
        method: "POST",
        data: datos,
        cache: false,
        contentType: false,
        processData: false,
        dataType:"json",
        success:function(respuesta){

            if(!respuesta){

                var nuevoCodigo = idCategoria+"001";
                $("#nuevoCodigo").val(nuevoCodigo);

            }else{

            var nuevoCodigo = Number(respuesta["codigo"]) + 1 ;
            $("#nuevoCodigo").val(nuevoCodigo);
            
            }
        }

    })


})
/*=============================================
AGERGANDO PRECIO DE VENTA
=============================================*/
$("#nuevoPrecioCompra, #editarPrecioCompra").change(function(){

    if($(".porcentaje").prop("checked")){


    var valorPorcentaje = $(".nuevoPorcentaje").val();
    
    var porcentaje = Number(($("#nuevoPrecioCompra").val()*valorPorcentaje/100))+Number($("#nuevoPrecioCompra").val());
  
    var editarPorcentaje = Number(($("#editarPrecioCompra").val()*valorPorcentaje/100))+Number($("#editarPrecioCompra").val());
  

    $("#nuevoPrecioVenta").val(porcentaje.toFixed(2));
    $("#nuevoPrecioVenta").prop("readonly",true);

    $("#editarPrecioVenta").val(editarPorcentaje.toFixed(2));
    $("#editarPrecioVenta").prop("readonly",true);

        
    }

})
/*=============================================
CAMBIO DE PORCENTAJE
=============================================*/
$(".nuevoPorcentaje").change(function(){

    if($(".porcentaje").prop("checked")){


    var valorPorcentaje = $(this).val();
    
    var porcentaje = Number(($("#nuevoPrecioCompra").val()*valorPorcentaje/100))+Number($("#nuevoPrecioCompra").val());
    var editarPorcentaje = Number(($("#editarPrecioCompra").val()*valorPorcentaje/100))+Number($("#editarPrecioCompra").val());


    $("#nuevoPrecioVenta").val(porcentaje.toFixed(2));
    $("#nuevoPrecioVenta").prop("readonly",true);

    $("#editarPrecioVenta").val(editarPorcentaje.toFixed(2));
    $("#editarPrecioVenta").prop("readonly",true);

        
    }

})
 $(".porcentaje").on("ifUnchecked",function(){

    $("#nuevoPrecioVenta").prop("readonly",false);
    $("#editarPrecioVenta").prop("readonly",false);

})
 $(".porcentaje").on("ifChecked",function(){

    $("#nuevoPrecioVenta").prop("readonly",true);
     $("#editarPrecioVenta").prop("readonly",true);

})

/*=============================================
EDITAR PRODUCTO
=============================================*/

$(".tablaProductos tbody").on("click", "button.btnEditarProducto", function(){

    var idProducto = $(this).attr("idProducto");
    
    var datos = new FormData();
    datos.append("idProducto", idProducto);

     $.ajax({

      url:"ajax/productos.ajax.php",
      method: "POST",
      data: datos,
      cache: false,
      contentType: false,
      processData: false,
      dataType:"json",
      success:function(respuesta){
          
          var datosCategoria = new FormData();
          datosCategoria.append("idCategoria", respuesta["id_categoria"]);
 
          $.ajax({

              url:"ajax/categorias.ajax.php",
              method: "POST",
              data: datosCategoria,
              cache: false,
              contentType: false,
              processData: false,
              dataType:"json",
              success:function(respuesta){

                $("#editarCategoria").val(respuesta["id"]);
                $("#editarCategoria").html(respuesta["categoria"]);

                }

            })

            

           $("#editarCodigo").val(respuesta["codigo"]);

           $("#editarDescripcion").val(respuesta["descripcion"]);

           $("#editarStock").val(respuesta["stock"]);

           $("#editarPrecioCompra").val(respuesta["precio_compra"]);

           $("#editarPrecioVenta").val(respuesta["precio_venta"]);


        }

    })

})


/*=============================================
ELIMINAR PRODUCTO
=============================================*/

$(".tablaProductos tbody").on("click", "button.btnEliminarProducto", function(){

    var idProducto = $(this).attr("idProducto");
    var codigo = $(this).attr("codigo");
   
    swal({

        title: '¿Está seguro de borrar el producto?',
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar producto!'
        }).then(function(result) {
        if (result.value) {

            window.location = "index.php?ruta=productos&idProducto="+idProducto+"&codigo="+codigo;

        }


    });

})



/*=============================================
    REVISAR PRODUCTO YA REGISTRADOS
=============================================*/
$("#nuevaDescripcion").change(function(){

    $(".alert").remove();

    var producto = $(this).val();

    var datos = new FormData();
    datos.append("validarProducto", producto);

    $.ajax({
        url:"ajax/productos.ajax.php",
        method:"POST",
        data: datos,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success:function(respuesta){

         if(respuesta){

            $("#nuevaDescripcion").parent().after('<div class="alert alert-warning">Este producto ya existe en la base de datos</div>');

            $("#nuevaDescripcion").val("");

         }

        }


    });

})
