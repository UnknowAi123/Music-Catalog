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

  generarVistasIniciales();
}

function detectarTipos(json) {
  if (!json.length) return {};
  const ejemplo = json[0];
  const tipos = {};

  for (const col in ejemplo) {
    const valor = ejemplo[col];

    if (valor === null || valor === undefined) {
      tipos[col] = "texto";
      continue;
    }

    const num = Number(valor);
    if (!isNaN(num) && valor !== "") {
      tipos[col] = "numero";
    } else if (!isNaN(Date.parse(valor))) {
      tipos[col] = "fecha";
    } else {
      tipos[col] = "texto";
    }
  }

  return tipos;
}

