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

  // Vista principal: tarjetas con todos los datos
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
  const datos = alasql(`SELECT [${columna}] AS valor FROM musica`);
  limpiarContenido();

  const cont = document.getElementById("contenido-principal");

  datos.forEach(item => {
    cont.innerHTML += `
      <div class="list-item">
        <i class="material-icons">music_note</i>
        <span>${item.valor}</span>
        <i class="material-icons arrow">chevron_right</i>
      </div>
    `;
  });
}

function mostrarStats(columna) {
  const stats = alasql(`
    SELECT 
      COUNT(*) AS total,
      AVG([${columna}]) AS promedio,
      MIN([${columna}]) AS minimo,
      MAX([${columna}]) AS maximo
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

  datos.forEach(row => {

    // Si tienes columna "imagen", úsala. Si no, icono por defecto.
    const imagen = row.imagen 
      ? `<img src="${row.imagen}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;">`
      : `<i class="material-icons" style="font-size:48px;color:#3f51b5;">album</i>`;

    cont.innerHTML += `
      <div class="list-item" style="display:flex; gap:12px;">

        <!-- Imagen o icono -->
        <div>${imagen}</div>

        <!-- Texto -->
        <div style="display:flex; flex-direction:column;">

          <!-- Canción + duración -->
          <span style="font-weight:600; font-size:16px;">
            ${row.titulo} 
            ${row.duracion ? `<span style="color:#666;font-size:14px;">— ${row.duracion}</span>` : ""}
          </span>

          <!-- Artista -->
          <span style="color:#444; font-size:14px;">
            ${row.nombre}
          </span>

          <!-- Álbum -->
          ${row.album ? `
            <span style="color:#777; font-size:13px;">
              ${row.album}
            </span>
          ` : ""}
        </div>

        <!-- Flecha -->
        <i class="material-icons arrow">chevron_right</i>
      </div>
    `;
  });
}
