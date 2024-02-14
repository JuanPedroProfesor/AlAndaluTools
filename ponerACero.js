
document.addEventListener('DOMContentLoaded', function() 
{
    //Input con el valor de la nota:
    let valorNota = 0;
    const inputNota = document.getElementById('valor_nota');
    const txtAreComent = document.getElementById('valor_comentario');
    const tareasButton = document.getElementById('cero-button');
    tareasButton.addEventListener('click', ponerACero);
    let spinner = document.getElementById('spinnerAcero');
    let idCurrentTab = 0;
    let opcionRadioButtons = document.querySelectorAll('input[id^="list-radio-"]');
    let opcionSeleccionada = 1;  //1 --> solo uno / 2 --> todos / 3 --> todos menos los que tienen entrega
   
    //Registramos listener:
    mostrarResultadosListener();

    let regex=/^((\d|[1-9]\d+)(\.\d{1,2})?|\.\d{1,2})$/; //Para comprobar que sea un entero o con un decimal

    function ponerACero() 
    {
      spinner.classList.remove("invisible"); //Mostrar el spinner al hacer clic

      valorNota = inputNota.value;
      //alert(valorNota);

      if (!valorNota.match(regex)) 
      {
        alert("El valor introducido debe ser numérico");
        return false;
      }

      comentario = txtAreComent.value; 
      

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
                code: 'configuracion = '+opcionSeleccionada+';'+' var valorNota = '+valorNota+';'+' var valorComentario = '+comentario+';'
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