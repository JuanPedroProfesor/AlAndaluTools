
//let enviadoTexto = document.querySelector('div.submissionstatussubmitted');
//let calificadoTexto = document.querySelector('div.submissiongraded');
//let inputNombre = document.querySelector('input[id^="form_autocomplete_suggestions"]');
 resultados = "";

 //Obtener el tipo de puesta a cero que tenemos que hacer:
 // 1 --> Solo un alumno
 // 2 --> Todos los alumnos
 // 3 --> Todos los alumnos que no hayan hecho ninguna entrega
 
 //alert("Valor de configuracion: " + configuracion);
 
 if(configuracion == "1")
 {
    if(ponerTodoACero())
    {
        resultados='Todas las operaciones se han completado con éxito.';
        browser.runtime.sendMessage({ resultados });
    }
 }
 else if(configuracion == "2")
 {
    //Obtener el número de alumnos:   
    numeroAlumnosSpan = document.querySelector('span[data-region^="user-count-summary"]'); 
    temp=""
    numeroAlumnos=0;
    if(numeroAlumnosSpan)
    {
        temp=numeroAlumnosSpan.innerText;
        position=temp.indexOf('d');
        temp=(temp.substring((position+2), temp.length)).trim();
        numeroAlumnos=parseInt(temp);
    }

    // Obtener referencia al botón por su id
    btnGuardar = document.querySelector('button[name^="saveandshownext"]'); 

    contador = 0;

    function operacion() 
    {  
        contador++;
        console.log(`Operación ${contador}`);

        if(ponerTodoACero())
        {
            if (contador < (numeroAlumnos + 1)) 
            {
                // Simular clic en el botón
                btnGuardar.click();
                // Esperar 2 segundos y luego recargar la página
                setTimeout(() => {
                operacion();
                }, 4000);
            } 
            else 
            {
                resultados='Todas las operaciones se han completado con éxito.';
                browser.runtime.sendMessage({ resultados });
            }
        }
    }

        //Llamar a la función operacion para iniciar el proceso
        operacion();
}

function ponerTodoACero()
{
    //Poner a cero la calificación sobre 10:
    inputNotaGlobal = document.getElementById("id_grade");
    if(inputNotaGlobal)
    {
        inputNotaGlobal.value = 0;
    }
    else
    {
        resultados='No hemos encontrado ninguna web abierta de Moodle donde calificar.';
        browser.runtime.sendMessage({ resultados });
        return false;
    }

    //Poner a cero todos los selectores:
    selectoresNotasCriterios = document.querySelectorAll('select[id^="menuoutcome_"]');
    if(selectoresNotasCriterios)
        selectoresNotasCriterios.forEach(selector => selector.value = "1");

    return true;
}







