// Importa las funciones necesarias de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA5jOBbot-TCi8u8F6jZKpl32CNMB3pBfs",
    authDomain: "menu-bar-ae6a6.firebaseapp.com",
    projectId: "menu-bar-ae6a6",
    storageBucket: "menu-bar-ae6a6.appspot.com",
    messagingSenderId: "769889452897",
    appId: "1:769889452897:web:316c9d131603cc561c3b20"
  };


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);


let productosSeleccionados = {};

window.seleccionarProducto = function(nombre, precio, spanId) {
    const cantidad = productosSeleccionados[spanId]?.cantidad || 1;
    const presio = precio; // Puedes ajustar esto si es necesario

    const productoExistente = productosSeleccionados[spanId];

    // Verificar si el producto ya está seleccionado
    if (productoExistente) {
        // Deseleccionar el producto (eliminarlo)
        delete productosSeleccionados[spanId];
        // Restablecer la cantidad visualizada a 0
        const cantidadSpan = document.getElementById(spanId);
        cantidadSpan.textContent = 0;
    } else {
        // Seleccionar el producto
        const producto = {
            nombre: nombre,
            presio: presio,
            cantidad: cantidad,
            precioTotal: presio * cantidad,
            spanId: spanId // Añadir el spanId al objeto del producto
        };
        productosSeleccionados[spanId] = producto;
        // Actualizar la cantidad visualizada a 1
        const cantidadSpan = document.getElementById(spanId);
        cantidadSpan.textContent = 1;
    }

    console.log(productosSeleccionados);
}




window.eliminarProducto = function(spanId) {
    delete productosSeleccionados[spanId];
    mostrarProductos(); // Actualiza la vista después de la eliminación
}


window.incrementarCantidad = function(spanId) {
    const producto = productosSeleccionados[spanId];
    if (producto) {
        producto.cantidad += 1;
        producto.precioTotal = producto.presio * producto.cantidad;

        // Actualizar la cantidad visualizada
        const cantidadSpan = document.getElementById(spanId);
        cantidadSpan.textContent = producto.cantidad;

        console.log(producto);
    }
}

window.decrementarCantidad = function(spanId) {
    const producto = productosSeleccionados[spanId];
    if (producto && producto.cantidad > 1) {
        producto.cantidad -= 1;
        producto.precioTotal = producto.presio * producto.cantidad;

        // Actualizar la cantidad visualizada
        const cantidadSpan = document.getElementById(spanId);
        cantidadSpan.textContent = producto.cantidad;

        console.log(producto);
    }
}


// Función para seleccionar la mesa
function seleccionarMesa(numeroMesa) {
    // Puedes realizar acciones relacionadas con la selección de la mesa aquí
    console.log("Mesa seleccionada:", numeroMesa);
}

// Función para mostrar productos
function mostrarProductos() {
    // Puedes agregar el código para mostrar productos aquí
    console.log("Mostrar productos");
}

document.addEventListener("DOMContentLoaded", function() {
    // Definir la función enviarPedido en el ámbito global
    window.enviarPedido = async function() {
        // Obtener el número de mesa seleccionado
     // Obtener el número de mesa seleccionado
     const mesaButtons = document.querySelectorAll(".mesa-btn:checked");
     let numeroMesa;

     mesaButtons.forEach((button) => {
         numeroMesa = button.value;
     });

     // Verificar si se ha seleccionado un número de mesa
     if (!numeroMesa) {
        Swal.fire({
            icon: 'error',
            title: '¡seleccione el Nº de Mesa!',
          
        });
        return;
     }

     const botonPedir = document.getElementById("botonPedir");

        // Mostrar u ocultar el botón "Pedir" según si hay productos seleccionados
        if (Object.keys(productosSeleccionados).length > 0) {
            botonPedir.style.display = "block";  // Mostrar el botón
        } else {
            botonPedir.style.display = "none";   // Ocultar el botón
        }


        try {
            // Calcular el precio total del pedido sumando los precios totales de cada producto
            const precioTotalPedido = Object.values(productosSeleccionados).reduce((total, producto) => {
                return total + producto.precioTotal;
            }, 0);

            // Crear una referencia a la colección 'pedidos'
            const pedidosCollection = collection(db, 'pedidos');

            // Crear un documento con los productos seleccionados, precio total, número de mesa y otros detalles
            const pedidoDoc = await addDoc(pedidosCollection, {
                productos: productosSeleccionados,
                precioTotal: precioTotalPedido,
                numeroMesa: numeroMesa,
                timestamp: new Date(),
                // Puedes agregar más campos según tus necesidades
            });

            console.log('Pedido enviado con ID:', pedidoDoc.id);

            // Limpiar productos seleccionados después de enviar el pedido
            productosSeleccionados = {};

            // Mostrar el precio total del pedido
            console.log('Precio Total del Pedido:', precioTotalPedido);

            // Mostrar mensaje de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Tu pedido se realizó correctamente!',
                text: `En breve te lo traeremos a la mesa ${numeroMesa}`,
                timer: 3000,
                showConfirmButton: false
            })
            .then(() => {
                // Recargar la página después de 3 segundos
                location.reload();
            });

        } catch (error) {
            console.error('Error al enviar el pedido:', error);

            // Mostrar mensaje de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar el pedido',
                text: 'Por favor, inténtalo de nuevo.',
            });
        }

    }
});

function mostrarOcultarBotonPedir() {
    const botonPedir = document.getElementById("botonPedir");

    if (Object.keys(productosSeleccionados).length > 0) {
        botonPedir.style.display = "block";  // Mostrar el botón
    } else {
        botonPedir.style.display = "none";   // Ocultar el botón
    }
}

// Obtén todos los elementos con la clase "checkIcon"
const checkIcons = document.querySelectorAll(".checkIcon");

// Itera sobre cada elemento y asigna el evento
checkIcons.forEach(function(icon) {
    icon.addEventListener("click", function() {
        // Obtén el producto desde el atributo de datos
        const producto = icon.getAttribute("data-producto");
        console.log("Producto seleccionado:", producto);

        // Tu lógica para cambiar el color o hacer otras acciones aquí
        this.classList.toggle("active");
        mostrarOcultarBotonPedir();
    });
});








  





