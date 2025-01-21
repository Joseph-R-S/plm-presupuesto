const div = document.querySelector('.contenedor')
const ul = document.querySelector(".lista-presupuesto");
const cerrar = document.createElement("span");
const sectionBtn = document.getElementById("options");
const previewContainer = document.getElementById("pdf-preview");
const imgData = './assets/logo.png';
const subTotal = document.getElementById("sub-total");
const iva = document.getElementById("iva");
const totalPresupuest = document.getElementById("suma-total");
const btnVistaPrevia = document.getElementById("previewPDF");

const tasaIvaSinIva = 1 + (16 / 100);
const tasaMasIva = 1 * (16 / 100);

dayName = new Array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado");
monName = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
now = new Date;
const fecha = (dayName[now.getDay()] + ", " + now.getDate() + " de " + monName[now.getMonth()] + " de " + now.getFullYear());

//funciones
function editarIva() {
  const valor1 = subTotal.textContent;
  const valor2 = iva.value;
  const tot = valor1 + valor2;
  totalPresupuest.innerText = tot;
}

function operadorTernario() {
  const btnIva = document.getElementById("monto");

  if (btnIva.textContent === "Monto sin IVA") {
    btnIva.textContent = "Monto con IVA";
    montoComIva();//
  } else {
    btnIva.textContent = "Monto sin IVA";
    montoSinIva();
  }
}

function sumaValores(subTotal, iva) {
  const totalTodo = Number(subTotal) + Number(iva);

  totalPresupuest.textContent = totalTodo.toFixed(2);

  return totalTodo;
}

function alterarColor() {
  const list = document.querySelectorAll(".lista-presupuesto li");
  list.forEach((item, index) => {
    if (index % 2 === 0) {
      item.style.backgroundColor = "#CDD5E0";
    } else {
      item.style.backgroundColor = "#fff";
    }
  });
}

function sumarTotal() {
  const totalElementos = document.querySelectorAll("span.totales");
  const sum = Array.from(totalElementos).reduce((acc, span) => {
    const valor = Number(span.textContent);

    let lol = acc + valor;
    return lol;
  }, 0);

  const subTotalTela = Math.floor(sum * 100) / 100;
  subTotal.innerText = Number(subTotalTela).toFixed(2);
  return sum;
}

function formato(numero) {
  let Formatado = numero.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return Formatado;
}

function eliminarServicio(e) {
  e.target.offsetParent.remove();
  const subTotal = sumarTotal();
  calcularIva(subTotal);
  //verficarLista();
  alterarColor();
}

function sumarIva(total) {
  const ivaCalculado = Number(total) * tasaMasIva;

  sumaValores(total, ivaCalculado);
  iva.value = ivaCalculado.toFixed(2);
}

function calcularIva(subTotalNuevo, subTotalAntes) {
  const ivaCalculado = Number(subTotalNuevo) * tasaMasIva;
  const subTotalAntesNumero = Number(subTotalAntes);
  const suma = ivaCalculado + subTotalNuevo;

  if (suma > subTotalAntesNumero) {
    resultado = Math.floor(ivaCalculado * 100) / 100;
  } else {
    resultado = Math.ceil(ivaCalculado * 100) / 100;
  }
  totalPresupuest.textContent = (subTotalNuevo + resultado).toFixed(2);
  iva.value = resultado;
  return resultado;
}

//sumar iva al valor actual
function montoSinIva() {
  const precioUnit = document.querySelectorAll("span.precios");
  const totalElementos = document.querySelectorAll("span.totales");

  precioUnit.forEach(span => {
    const value = span.textContent;
    const ivaElemento = value * tasaIvaSinIva;
    let parteDecimal = Math.floor((ivaElemento * 100) % 100);
    if (parteDecimal >= 50) {
      span.textContent = Math.ceil(ivaElemento * 100) / 100;
    } else {
      span.textContent = Math.floor(ivaElemento * 100) / 100;
    }

  });

  totalElementos.forEach(span => {
    const value = span.textContent;
    const ivaElemento = value * tasaIvaSinIva;

    let parteDecimal = Math.floor((ivaElemento * 100) % 100);
    if (parteDecimal >= 50) {
      span.textContent = Math.ceil(ivaElemento * 100) / 100;
    } else {
      span.textContent = Math.floor(ivaElemento * 100) / 100;
    }
  });
  const subTotalAntes = subTotal.textContent;
  const sumaSubTotal = sumarTotal();
  subTotal.textContent = Math.floor(sumaSubTotal * 100) / 100;
  calcularIva(sumaSubTotal, subTotalAntes);

}

//para restar el iva al valor actual
function montoComIva() {
  const precioUnit = document.querySelectorAll("span.precios");
  const totalElementos = document.querySelectorAll("span.totales");
  precioUnit.forEach(span => {
    const value = Number(span.textContent);
    const ivaElemento = value / tasaIvaSinIva;
    const valorSinIvaDosDecimales = ivaElemento;
    span.textContent = valorSinIvaDosDecimales.toFixed(2);
  });

  totalElementos.forEach(span => {
    const value = Number(span.textContent);
    const ivaElemento = value / tasaIvaSinIva;
    span.textContent = ivaElemento.toFixed(2);
  });

  const subTotalAntes = Number(subTotal.textContent);
  const sumaSubTotal = sumarTotal();
  subTotal.textContent = Math.floor(sumaSubTotal * 100) / 100;
  const corregirIva = calcularIva(sumaSubTotal, subTotalAntes);

  let corregirvalor = Number(totalPresupuest.textContent);
  const diferecia = (corregirvalor - subTotalAntes).toFixed(2);
  const nuevoIva = (corregirIva - diferecia);
  
  if (subTotalAntes < corregirvalor) {
    iva.value = nuevoIva.toFixed(2);
    totalPresupuest.textContent = Number(iva.value) + Number(subTotal.textContent);

  } else if (subTotalAntes > corregirvalor) {
    iva.value = nuevoIva.toFixed(2);
    totalPresupuest.textContent = Number(iva.value) + Number(subTotal.textContent);
  }
}

function newItem() {
  let cantInput = document.getElementById("cant").value;
  const cantSpan = document.createElement("span");
  let descriptionInput = document.getElementById("description");
  const descriptionSpan = document.createElement("span");
  let precioUnit = document.getElementById("precio").value;
  const precioSpan = document.createElement("span");
  let dolar = document.getElementById("dolar").value;
  const totalSpan = document.createElement("span");
  const spanRemover = document.createElement("span");
  const txt = document.createTextNode("x");

  if (cantInput === "") {
    alert("Cual es la cantidad?");
  } else {
    const li = document.createElement("li");

    cantSpan.className = "cant";
    precioSpan.className = "precios montos";
    totalSpan.className = "totales montos";
    descriptionSpan.className = "description";
    spanRemover.className = "close";
    cantSpan.innerText = cantInput;
    descriptionSpan.innerText = descriptionInput.value;
    const varPrecio = precioUnit * dolar;
    precioSpan.innerText = varPrecio.toFixed(2);

    const tot = (precioUnit * dolar) * cantInput;
    totalSpan.innerText = tot.toFixed(2);

    spanRemover.appendChild(txt);
    li.appendChild(cantSpan);
    li.appendChild(descriptionSpan)
    li.appendChild(precioSpan);
    li.appendChild(totalSpan);
    li.appendChild(spanRemover);
    spanRemover.addEventListener('click', eliminarServicio);
    ul.appendChild(li);
    //verficarLista();
    const sumaTotal = sumarTotal();
    //calcularIva(sumaTotal);
    sumarIva(sumaTotal);
    descriptionInput.value = "";
  }
  
}

function guardarPdf() {
  //variables
  const senhores = document.getElementById("srs");
  const nombreDif = document.getElementById("nombreDif");
  const titular = document.getElementById("titular");
  const telefono = document.getElementById("telefono");
  const items = document.querySelectorAll('.lista-presupuesto li');

  const { jsPDF } = window.jspdf;
  // Crear un nuevo documento PDF
  const doc = new jsPDF();
  const x = doc.internal.pageSize.width - 20;

  const tamanhoX = doc.internal.pageSize.width;
  let texto = "PRESUPUESTO";
  let anchoTexto = doc.getTextWidth(texto);
  let centro = (tamanhoX - anchoTexto) / 2;

  // Agregar contenido al PDF
  //agrego el logo
  doc.addImage(imgData, "JPEG", 10, 10, 50, 35);
  doc.setFontSize(20);
  doc.text("PREVISIONES LA MILAGROSA, C.A.", 68, 15);
  doc.text("PRELAMICA", 105, 25);
  doc.setFontSize(12);
  doc.text("Calle mariño #14 - 16B San Juan De Los Morros - Guárico", 68, 32,);
  doc.text("TELF (0246) 431.24.89 / 431.60.88 | FAX (0246) 431.67.55", 68, 37);
  doc.text("CEL (0414) 465.06.10 / (0414) 335.10.73 / (0412) 863.69.46", 68, 42);

  doc.text(fecha, 135, 50);

  doc.setFontSize(16);
  doc.text(texto, centro, 60);
  doc.setFontSize(12);
  doc.text("Señores:", 10, 65);
  doc.text(senhores.value, 10, 70);
  doc.text("SU DESPACHO:", 10, 75);

  doc.rect(9, 76, 60, 5, 'S');
  doc.text("Nombre del Difunto:", 10, 80);

  doc.rect(9, 81, 60, 5, 'S');
  doc.text(nombreDif.value, 10, 85);

  doc.rect(69, 76, 65, 5, 'S');
  doc.text("Titular o Familiar:", 70, 80);

  doc.rect(69, 81, 65, 5, 'S');
  doc.text(titular.value, 70, 85);

  doc.rect(134, 76, 55, 5, 'S');
  doc.text("Telefono:", 135, 80);

  doc.rect(134, 81, 55, 5, 'S');
  doc.text(telefono.value, 135, 85);

  doc.rect(9, 90, 15, 6, 'S');
  doc.text("CANT", 10, 95);

  doc.rect(24, 90, 100, 6, 'S');
  doc.text("DESCRIPCIÓN", 30, 95);

  doc.rect(124, 90, 30, 6, 'S');
  doc.text("PRECIO", 130, 95);

  doc.rect(154, 90, 35, 6, 'S');
  doc.text("TOTAL", 165, 95);

  let y = 102;

  // Recorrer todos los elementos <li> y agregar sus datos al PDF
  items.forEach((item) => {
    // Obtener el contenido de cada span dentro del <li>
    try {
      const cant = item.querySelector('.cant').textContent;
      const description = item.querySelector('.description').textContent;
      const precio = item.querySelector('.precios').textContent;
      const total = item.querySelector('.totales').textContent;

      doc.setFontSize(9);
      // Escribir los valores de los spans en el PDF, alineados horizontalmente
      doc.rect(9, y - 6, 15, 8, 'S');
      doc.text(cant, 10, y);

      doc.rect(24, y - 6, 100, 8, 'S');
      doc.text(description, 25, y);

      doc.rect(124, y - 6, 30, 8, 'S');
      doc.text(precio, x - 40, y, { align: 'right' });

      doc.rect(154, y - 6, 35, 8, 'S');
      doc.text(total, x - 5, y, { align: 'right' });

      // Incrementar la posición Y para la siguiente fila
      y += 8;
    } catch {
      alert(console.error("Error"));
    }
  });

  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("SUB-TOTAL:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  doc.text(subTotal.textContent, x - 5, y, { align: 'right' });

  y += 8;
  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("IVA 16,5%:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  doc.text(iva.value, x - 5, y, { align: 'right' });

  y += 8;
  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("TOTAL:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  doc.text(totalPresupuest.textContent, x - 5, y, { align: 'right' });

  //tamanhoX
  texto = "POR LA EMPRESA";
  anchoTexto = doc.getTextWidth(texto);
  y += 15;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);


  texto = "_____________________"
  anchoTexto = doc.getTextWidth(texto);
  y += 15;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  texto = "CARLOS CEBALLOS"
  anchoTexto = doc.getTextWidth(texto);
  y += 8;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  texto = "GERENTE"
  anchoTexto = doc.getTextWidth(texto);
  y += 8;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  doc.save('documento.pdf');
}

async function previewPDF() {
  //variables
  const senhores = document.getElementById("srs");
  const nombreDif = document.getElementById("nombreDif");
  const titular = document.getElementById("titular");
  const telefono = document.getElementById("telefono");
  const items = document.querySelectorAll('.lista-presupuesto li');

  const { jsPDF } = window.jspdf;
  // Crear un nuevo documento PDF
  const doc = new jsPDF();
  const x = doc.internal.pageSize.width - 20;

  const tamanhoX = doc.internal.pageSize.width;
  let texto = "PRESUPUESTO";
  let anchoTexto = doc.getTextWidth(texto);
  let centro = (tamanhoX - anchoTexto) / 2;

  // Agregar contenido al PDF
  //agrego el logo
  doc.addImage(imgData, "JPEG", 10, 10, 50, 35);
  doc.setFontSize(20);
  doc.text("PREVISIONES LA MILAGROSA, C.A.", 68, 15);
  doc.text("PRELAMICA", 105, 25);
  doc.setFontSize(12);
  doc.text("Calle mariño #14 - 16B San Juan De Los Morros - Guárico", 68, 32,);
  doc.text("TELF (0246) 431.24.89 / 431.60.88 | FAX (0246) 431.67.55", 68, 37);
  doc.text("CEL (0414) 465.06.10 / (0414) 335.10.73 / (0412) 863.69.46", 68, 42);

  doc.text(fecha, 135, 50);

  doc.setFontSize(16);
  doc.text(texto, centro, 60);
  doc.setFontSize(12);
  doc.text("Señores:", 10, 65);
  doc.text(senhores.value, 10, 70);
  doc.text("SU DESPACHO:", 10, 75);

  doc.rect(9, 76, 60, 5, 'S');
  doc.text("Nombre del Difunto:", 10, 80);

  doc.rect(9, 81, 60, 5, 'S');
  doc.text(nombreDif.value, 10, 85);

  doc.rect(69, 76, 65, 5, 'S');
  doc.text("Titular o Familiar:", 70, 80);

  doc.rect(69, 81, 65, 5, 'S');
  doc.text(titular.value, 70, 85);

  doc.rect(134, 76, 55, 5, 'S');
  doc.text("Telefono:", 135, 80);

  doc.rect(134, 81, 55, 5, 'S');
  doc.text(telefono.value, 135, 85);

  doc.rect(9, 90, 15, 6, 'S');
  doc.text("CANT", 10, 95);

  doc.rect(24, 90, 100, 6, 'S');
  doc.text("DESCRIPCIÓN", 30, 95);

  doc.rect(124, 90, 30, 6, 'S');
  doc.text("PRECIO", 130, 95);

  doc.rect(154, 90, 35, 6, 'S');
  doc.text("TOTAL", 165, 95);

  let y = 102;

  // Recorrer todos los elementos <li> y agregar sus datos al PDF
  items.forEach((item) => {
    // Obtener el contenido de cada span dentro del <li>
    try {
      const cant = item.querySelector('.cant').textContent;
      const description = item.querySelector('.description').textContent;
      const precio = item.querySelector('.precios').textContent;
      const total = item.querySelector('.totales').textContent;

      doc.setFontSize(9);
      // Escribir los valores de los spans en el PDF, alineados horizontalmente
      doc.rect(9, y - 6, 15, 8, 'S');

      doc.text(cant, 10, y);

      doc.rect(24, y - 6, 100, 8, 'S');
      doc.text(description, 25, y);

      doc.rect(124, y - 6, 30, 8, 'S');
      const precioFormatado = formato(Number(precio));
      doc.text(precioFormatado, x - 40, y, { align: 'right' });

      doc.rect(154, y - 6, 35, 8, 'S');
      const totalFormatado = formato(Number(total));
      doc.text(totalFormatado, x - 5, y, { align: 'right' });

      // Incrementar la posición Y para la siguiente fila
      y += 8;
    } catch {
      alert(console.error("Error"));
    }
  });

  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("SUB-TOTAL:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  const subTotalFormatado = formato(Number(subTotal.textContent));
  console.log(subTotalFormatado);
  doc.text(subTotalFormatado, x - 5, y, { align: 'right' });

  y += 8;
  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("IVA 16,5%:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  const ivaFormatado = formato(Number(iva.value));
  doc.text(ivaFormatado, x - 5, y, { align: 'right' });

  y += 8;
  doc.rect(124, y - 6, 30, 8, 'S');
  doc.text("TOTAL:", x - 40, y, { align: 'right' });
  doc.rect(154, y - 6, 35, 8, 'S');
  const totalPresupuestFormatado = formato(Number(totalPresupuest.textContent));
  doc.text(totalPresupuestFormatado, x - 5, y, { align: 'right' });

  //tamanhoX
  texto = "POR LA EMPRESA";
  anchoTexto = doc.getTextWidth(texto);
  y += 15;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);


  texto = "_____________________"
  anchoTexto = doc.getTextWidth(texto);
  y += 15;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  texto = "CARLOS CEBALLOS";
  anchoTexto = doc.getTextWidth(texto);
  y += 8;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  texto = "GERENTE"
  anchoTexto = doc.getTextWidth(texto);
  y += 8;
  centro = (tamanhoX - anchoTexto) / 2;
  doc.text(texto, centro, y);

  // Generar un Blob del PDF
  const pdfBlob = doc.output("blob");

  // Crear un objeto URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Mostrar en un iframe
  const iframe = document.createElement("iframe");
  iframe.src = pdfUrl;
  iframe.width = "100%";
  iframe.height = "500px";

  // Insertar el iframe en el cuerpo de la página
  const toolBar = document.createElement("div");
  cerrar.innerText = 'X';
  cerrar.classList.add("cerrar");
  toolBar.classList.add("toolBar");
  previewContainer.classList.remove('ocultar');
  previewContainer.innerHTML = ""; // Limpiar contenido previo

  previewContainer.appendChild(toolBar);
  toolBar.appendChild(cerrar);
  previewContainer.appendChild(iframe);
}

// Eventos
btnVistaPrevia.addEventListener("click", previewPDF);

cerrar.addEventListener('click', () => {
  previewContainer.classList.add('ocultar');
});

