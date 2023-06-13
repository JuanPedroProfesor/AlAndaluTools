// Obtener todos los nodos <a> con atributo title="TAREAS"
tareasNodes = Array.from(document.querySelectorAll('a[title="TAREAS"]'));
// Obtener las URLs de los nodos de tareas
urlsTareas = tareasNodes.map(node => node.href);
//Obtener todos los títulos de asignaturas
asignaturas = document.querySelectorAll('span.p-t-1.p-b-1.text-center.coursename_ayesa');

// Realizar la solicitud a cada URL de tarea y buscar información
 resultadosPromises = urlsTareas.map( (url , indice) => {
  return fetch(url)
    .then(response => response.text())
    .then(data => 
        {
            // Buscar información en la página de la tarea
            parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');

            // Encontrar el nodo <table> con atributo class="generaltable"
            tabla = doc.querySelector('table.generaltable');
            if(!tabla)
                return null;

            // Obtener todas las filas <tr> de la tabla
            filas = Array.from(tabla.querySelectorAll('tr'));

            // Buscar si hay alguna fila en la quinta columna con valor diferente a 0
            resultados = filas.filter(fila => 
            {
                columnas = Array.from(fila.querySelectorAll('td'));
                if (columnas.length >= 5) 
                {
                    valorQuintaColumna = columnas[4].textContent.trim();
                    return valorQuintaColumna != '0';
                }
                return false;
            });

            // Obtener la información deseada de las filas encontradas
            informacionTareas = resultados.map(resultado => 
            {
                nombreAsignatura = asignaturas[indice].textContent.trim();
                columnas = Array.from(resultado.querySelectorAll('td'));

                unidadTrabajo = columnas[0].textContent.trim();

                tarea = unidadTrabajo + " - " + columnas[1].querySelector('a').textContent.trim();
                quintaColumna = parseInt(columnas[4].textContent.trim());
                return { tarea, quintaColumna, nombreAsignatura };
            });

            return informacionTareas;
    }).catch((error) => {
        //Posible problema de sesión expirada y no puede meterse en las tareas, a pesar de estar el dashboard abierto. 
        resultados=null;
        browser.runtime.sendMessage({ resultados })
    });
});

// Esperar a que se compen todas las solicitudes
Promise.all(resultadosPromises)
  .then(resultados => {
    // Enviar los resultados a popup.js
    if(resultados)
        browser.runtime.sendMessage({ resultados });
  });