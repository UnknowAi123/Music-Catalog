function convertirDuracion(valor) {
  if (!valor) return "";

  if (typeof valor === "string" && valor.includes(":")) {
    return valor;
  }

  if (typeof valor === "number" && valor > 10) {
    const minutos = Math.floor(valor);
    const segundos = Math.round((valor - minutos) * 60);
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  }

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

  for (const col in tiposColumnas) {
    const tipo = tiposColumnas[col];

    menu.innerHTML += `
      <a class="mdl-navigation__link" onclick="mostrarVista('${col}', '${tipo}')">
        ${col}
      </a>
    `;
  }

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

/* ============================================================
   TARJETA DETALLADA (NUEVA) — RESPETA TU ESTILO ORIGINAL
   ============================================================ */

function renderTabla(datos) {
  limpiarContenido();
  const cont = document.getElementById("contenido-principal");

  datos.forEach(row => {

    cont.innerHTML += `
      <div class="deck-card">

        <img class="cover" src="${row['Album Cover'] || ''}">

        <div class="info">

          <div class="line1">
            <span class="title">${row['Track Name'] || ""}</span>
            <span class="duration">${convertirDuracion(row['Track Duration']) || ""}</span>
          </div>

          <div class="line2">${row['Track Artist'] || ""}</div>

          <div class="line3">
          ${row['Album Year'] || ""} / ${row['Track Album'] || ""}
          </div>

            
          </div>

        </div>

      </div>
    `;
  });
}

/* ============================================================
   BUSCADOR — ACTUALIZADO A TUS NUEVAS COLUMNAS
   ============================================================ */

document.getElementById("buscador").addEventListener("input", function () {
    const q = this.value.toLowerCase().trim();

    if (!window.DATA_ORIGINAL) {
        window.DATA_ORIGINAL = window.DATA;
    }

    if (q === "") {
        renderTabla(window.DATA_ORIGINAL);
        return;
    }

    const filtrado = window.DATA_ORIGINAL.filter(row =>
        (row['Track Name'] || "").toLowerCase().includes(q) ||
        (row['Track Artist'] || "").toLowerCase().includes(q) ||
        (row['Track Album'] || "").toLowerCase().includes(q) ||
        
        
        (row['Album Year'] || "").toString().includes(q)
    );

    renderTabla(filtrado);
});
