
document.addEventListener('DOMContentLoaded', function() 
{
    let colores=["bg-green-100", "bg-yellow-100", "bg-pink-100" , "bg-purple-100", "bg-red-100"];
    const URL_OBJETIVO = 'https://educacionadistancia.juntadeandalucia.es/formacionprofesional/my/';
    let tabId;
    const tareasButton = document.getElementById('tareas-button');
    tareasButton.addEventListener('click', obtenerTareas);
    
    let spinner = document.getElementById('spinner');
  
    function obtenerTareas() 
    {
        spinner.classList.remove("invisible"); //Mostrar el spinner al hacer clic

        browser.tabs.query({ url: URL_OBJETIVO }).then(tabs => {
           
            if (tabs.length > 0) 
            {
              tabId = tabs[0].id;
              browser.tabs.executeScript(tabId, { file: 'obtenerTareasBackground.js' });
            } 
            else 
            {
                spinner.style.display = 'none'; // Mostrar el spinner al hacer clic
                alert("La página principal de Moodle a Distancia debe de estar abierta previamente");
            }
        });
    }
  
    function mostrarResultados() 
    {
        browser.runtime.onMessage.addListener(function(message, sender) 
        {
          if (sender.tab.id === tabId && message.resultados) 
          {
            const resultadosContainer = document.getElementById('resultados');
            resultadosContainer.innerHTML = '';
      
            if (message.resultados.length === 0 ) 
            {
              const mensajeSinResultados = document.createElement('p');
              mensajeSinResultados.textContent = 'No se encontraron resultados.';
              resultadosContainer.appendChild(mensajeSinResultados);
            } 
            else if(message.resultados[0] == null)
            {
              const mensajeSinResultados = document.createElement('p');
              mensajeSinResultados.textContent = 'Puede ser que su ventana principal de Moodle esté abierta pero la sesión esté cadudaca.';
              resultadosContainer.appendChild(mensajeSinResultados);
            }
            else 
            {
              message.resultados.forEach(resultado => {
                if(resultado != null && resultado.length > 0)
                {
                  generarFilasTabla(resultado[0].nombreAsignatura, resultado[0].tarea, resultado[0].quintaColumna);
                }
              });
            }
          }
          spinner.classList.add("invisible");

        });
    }


    function generarFilasTabla(nombre, tarea, numero)
    {
        //Vaciamos la tabla:
        let table = document.querySelector("table");
        table.querySelector("tbody").innerHTML="";

        // Crear el elemento <tr>
        let tr = document.createElement("tr");

        let colorAleatorio = colores[ Math.floor( Math.random() * colores.length) ];

        // Asignar clases al elemento <tr>
        tr.classList.add( colorAleatorio, "border-b", "border-secondary-200", "text-neutral-800");

        // Crear y añadir los elementos <td> dentro del elemento <tr>
        let td1 = document.createElement("td");
        td1.classList.add("whitespace-nowrap", "px-6", "py-4", "font-light");
        td1.textContent = nombre;
        tr.appendChild(td1);

        let td2 = document.createElement("td");
        td2.classList.add("whitespace-nowrap", "px-6", "py-4");
        td2.textContent = tarea;
        tr.appendChild(td2);

        let td3 = document.createElement("td");
        td3.classList.add("whitespace-nowrap", "px-6", "py-4");
        td3.textContent = numero;
        tr.appendChild(td3);

        // Añadir el elemento <tr> al documento
        table.querySelector("tbody").appendChild(tr);
    }
      
    mostrarResultados();

  });