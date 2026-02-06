
// Aquí defines tú los nombres EXACTOS de las columnas del Excel
const COLUMNAS = {
  id: "id",
  artist: "nombre",
  cancion: "titulo",
  album: "album",
  duration: "duracion",
  imagen: null
};

let datosBrutos = [];
let tiposColumnas = {};

function cargarArchivo(file) {
  const reader = new FileReader();

  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    datosBrutos = json;
    procesarDatos(json);
  };

  reader.readAsArrayBuffer(file);
}

function procesarDatos(json) {
  alasql("DROP TABLE IF EXISTS musica");
  alasql("CREATE TABLE musica");
  alasql("INSERT INTO musica SELECT * FROM ?", [json]);

  tiposColumnas = detectarTipos(json);

window.DATA = json;
  
  generarVistasIniciales();
}

function detectarTipos(json) {
  if (!json.length) return {};
  const ejemplo = json[0];
  const tipos = {};

  for (const col in ejemplo) {
    const valor = ejemplo[col];

    if (valor === null || valor === undefined || valor === "") {
      tipos[col] = "texto";
      continue;
    }

    // Detectar números reales (no strings numéricos raros)
    if (typeof valor === "number") {
      tipos[col] = "numero";
      continue;
    }

    // Detectar números escritos como texto
    if (!isNaN(Number(valor)) && valor.trim() !== "") {
      tipos[col] = "numero";
      continue;
    }

    // Detectar fechas SOLO si tienen formato claro
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor) || /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      tipos[col] = "fecha";
      continue;
    }

    // Todo lo demás es texto
    tipos[col] = "texto";
  }

  return tipos;
}
