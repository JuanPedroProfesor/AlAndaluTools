
document.addEventListener('DOMContentLoaded', function() 
{
    const tareasButton = document.getElementById('cero-button');
    tareasButton.addEventListener('click', ponerACero);
    let spinner = document.getElementById('spinnerAcero');
    let idCurrentTab = 0;
    let opcionRadioButtons = document.querySelectorAll('input[id^="list-radio-"]');
    let opcionSeleccionada = 1;  //1 --> solo uno / 2 --> todos / 3 --> todos menos los que tienen entrega
   
    //Registramos listener:
    mostrarResultadosListener();

    function ponerACero() 
    {
        spinner.classList.remove("invisible"); //Mostrar el spinner al hacer clic

        opcionRadioButtons.forEach( (radio, index) => { 
          if(radio.checked)
            opcionSeleccionada = (index + 1);
        });

        browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
        .then(tabs => {
            idCurrentTab = tabs[0].id;
            return browser.tabs.get(tabs[0].id)
        }).then(tab => {
          if(tab.url.includes("educacionadistancia.juntadeandalucia.es"))
          {
            browser.tabs.executeScript(tab.id, {
                code: 'configuracion = '+opcionSeleccionada+';'
                    }, function() {
                        browser.tabs.executeScript(tab.id, {file: 'ponerACeroBackground.js'});
              });
          }
          else
          {
            alert("No hemos encontrado ninguna web abierta de Moodle donde calificar.");
            spinner.classList.add("invisible");
          }
        });
    }
  
    function mostrarResultadosListener() 
    {
        browser.runtime.onMessage.addListener(function(message, sender) 
        { 
          if (sender.tab.id === idCurrentTab && message.resultados) 
          {
            if (message.resultados) 
            {
                alert(message.resultados);
            }
          }
          spinner.classList.add("invisible");
        });
    }
});