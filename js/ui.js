function limpiarContenido() {
  document.getElementById("contenido-principal").innerHTML = "";
}

function generarVistasIniciales() {
  const menu = document.getElementById("menu-vistas");
  menu.innerHTML = "";

  // Crear una vista por cada columna
  for (const col in tiposColumnas) {
    const tipo = tiposColumnas[col];

    menu.innerHTML += `
      <a class="mdl-navigation__link" onclick="mostrarVista('${col}', '${tipo}')">
        ${col}
      </a>
    `;
  }

  // Vista principal: tabla completa
  mostrarTablaCompleta();
}

function mostrarTablaCompleta() {
  const datos = alasql("SELECT * FROM musica");
  renderTabla(datos);
}

function mostrarVista(columna, tipo) {
  if (tipo === "numero") {
    mostrarStats(columna);
  } else {
    mostrarLista(columna);
  }
}

function mostrarLista(columna) {
  const datos = alasql(`SELECT ${columna} FROM musica`);
  limpiarContenido();

  const cont = document.getElementById("contenido-principal");

  datos.forEach(item => {
    cont.innerHTML += `
      <div class="list-item">
        <i class="material-icons">music_note</i>
        <span>${item[columna]}</span>
        <i class="material-icons arrow">chevron_right</i>
      </div>
    `;
  });
}


function mostrarStats(columna) {
  const stats = alasql(`
    SELECT 
      COUNT(*) AS total,
      AVG(${columna}) AS promedio,
      MIN(${columna}) AS minimo,
      MAX(${columna}) AS maximo
    FROM musica
  `)[0];

  limpiarContenido();

  const cont = document.getElementById("contenido-principal");

  cont.innerHTML = `
    <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Estadísticas de ${columna}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        Total: ${stats.total}<br>
        Promedio: ${stats.promedio}<br>
        Mínimo: ${stats.minimo}<br>
        Máximo: ${stats.maximo}
      </div>
    </div>
  `;
}

function renderTabla(datos) {
  limpiarContenido();
  const cont = document.getElementById("contenido-principal");

  if (!datos.length) {
    cont.innerHTML = "<p>No hay datos.</p>";
    return;
  }

  const columnas = Object.keys(datos[0]);

  let html = `
    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
      <thead>
        <tr>
  `;

  columnas.forEach(c => {
    html += `<th>${c}</th>`;
  });

  html += `
        </tr>
      </thead>
      <tbody>
  `;

  datos.forEach(row => {
    html += `<tr>`;
    columnas.forEach(c => {
      html += `<td>${row[c]}</td>`;
    });
    html += `</tr>`;
  });

  html += `
      </tbody>
    </table>
  `;

  cont.innerHTML = html;
}

