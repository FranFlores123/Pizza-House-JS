let todasLasPizzas = [];

const contenedorPizzas = document.querySelector("#contenedor-pizzas");
const selectorPizzas = document.querySelectorAll(".boton-selector");
const titulo = document.querySelector("#titulo");
const cantidadCarrito = document.querySelector("#cantidad");
let botonAgregar = document.querySelectorAll(".boton-agregar");

fetch("./js/pizzas.json")
  .then(response => response.json())
  .then(data =>{
    todasLasPizzas = data;
    cargarPizzas(todasLasPizzas);
  });

function cargarPizzas (pizzaCategoria) {
  contenedorPizzas.innerHTML = "";
  pizzaCategoria.forEach((pizza) => {
      const div = document.createElement("div");
      div.classList.add("pizza");
      div.innerHTML = `
      <img class="pizza-imagen" src="${pizza.imagen}" alt="${pizza.nombre}">
      <div class="pizza-info">
          <h3>${pizza.nombre}</h3>
          <p>$${pizza.precio}</p>
          <button id="${pizza.id}" class="boton-agregar">Agregar</button>
      </div>
      `
      contenedorPizzas.append(div);
  })

  actualizarBotones();
}


selectorPizzas.forEach(selector => {
  selector.addEventListener("click", (e) => {
    selectorPizzas.forEach((selector) => selector.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id != "pizzas-todas") {
    const encontrarPizza = todasLasPizzas.find((pizza) => pizza.categoria === e.currentTarget.id);
    titulo.innerText = encontrarPizza.categoria;

    const pizzasCat = todasLasPizzas.filter((pizza) => pizza.categoria === e.currentTarget.id);
    cargarPizzas(pizzasCat);
  } else {
    titulo.innerText = "Todas las Pizzas";
    cargarPizzas(todasLasPizzas);
  }
  })
})


function actualizarBotones() {
  botonAgregar = document.querySelectorAll(".boton-agregar");

  botonAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

/*        Carrito       */
let carrito;
let carritoLocalStorage = localStorage.getItem("pizzasEnCarrito");

if (carritoLocalStorage) {
  carrito = JSON.parse(carritoLocalStorage);
  actualizarCantidad();
} else {
  carrito = [];
}

function agregarAlCarrito(e){
  const idPizza = e.currentTarget.id;
  const agregar = todasLasPizzas.find((pizza) =>pizza.id === idPizza);

  Toastify({
  text: "Pizza agregada",
  duration: 1500,
  destination: `./carrito.html`,
  newWindow: false,
  close: false,
  gravity: "top",
  position: "right",
  stopOnFocus: true,
  style: {
    background: "#633206",
    borderRadius: "1rem",
    fontSize: "1rem",
    color: "#e6e0db",
    textTransform: "uppercase"
  },
  offset: {
    x: "1.5rem",
    y: "1.2rem"
  },

  onClick: function(){}

  }).showToast();

  if(carrito.some((pizza)=> pizza.id === idPizza)) {
    const index = carrito.findIndex(pizza => pizza.id === idPizza);
    carrito[index].cantidad++;

  } else {
    agregar.cantidad = 1;
    carrito.push(agregar);
  }

  localStorage.setItem("pizzasEnCarrito", JSON.stringify(carrito));

  actualizarCantidad();
}

function actualizarCantidad() {
  let nuevaCantidad = carrito.reduce((acc, pizza) => acc + pizza.cantidad, 0);
  cantidadCarrito.innerText = nuevaCantidad;
  localStorage.setItem("cantidad", JSON.stringify(nuevaCantidad));
}
