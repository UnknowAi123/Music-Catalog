document.getElementById("file-input").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) cargarArchivo(file);
});

