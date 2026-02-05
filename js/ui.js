
function convertirDuracion(valor) {
  if (!valor) return "";

  // Si ya viene como texto tipo "3:30", lo dejamos
  if (typeof valor === "string" && valor.includes(":")) return valor;

  // Si viene como número decimal (Excel)
  if (typeof valor === "number") {
    const totalSegundos = Math.round(valor * 24 * 60 * 60);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  }

  return valor;
}



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

    const cover = row.cover
      ? `<img src="${row.cover}" class="spotify-cover">`
      : `<div class="spotify-cover placeholder"></div>`;

    cont.innerHTML += `
      <div class="spotify-card">

        <div class="spotify-left">
          ${cover}
        </div>

        <div class="spotify-center">
          <div class="spotify-title">
            ${row.song || ""}
            ${row.duration ? `<span class="spotify-duration">• ${convertirDuracion(row.duration)}</span>` : ""}

          </div>

          <div class="spotify-artist">
            ${row.artist || ""}
          </div>

          <div class="spotify-album">
            ${row.album || ""} ${row.year ? `• ${row.year}` : ""}
          </div>
        </div>

        <div class="spotify-right">
          <i class="material-icons">chevron_right</i>
        </div>

      </div>
    `;
  });
}
