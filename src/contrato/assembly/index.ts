import {Alumnos, messages, Sala, salas} from "./model";
import {context, logging} from 'near-sdk-as'

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

/**
 * Método de ESCRITURA para inicializar una sala, tomando como profesor al que este llamando al metodo.
 *  >> near call dev-1654198617102-40626897569944 setSala '{"fecha":"2022-01-06"}' --accountId mmoreira.testnet --amount 1
 *
 * @param fecha en la cual se dio la clase
 * @returns string: Responde con un mensaje en caso exitoso.
 */
export function setSala(fecha: string): string{
  assert(validarFecha(fecha), "El campo fecha se ingreso incorrectamente. Por favor respete el formato aaaa-MM-dd");
  const profesor = context.sender;
  let sala = new Sala(fecha, profesor);

  for (let i = 0; i < salas.length; i++) {
    if (salas[i].profesor == profesor && salas[i].fecha == fecha){
      assert(false,"El profesor ya esta asignado a una sala para el dia seleccionado.")
    }
  }
  salas.push(sala)
  return "¡La sala fue dada de alta correctamente!"

}

/**
 * Método de Lectura que retorna un listado de todas las salas con sus alumnos y fechas.
 *  >> near view dev-1654198617102-40626897569944 getSalas
 *
 * @returns salas
 */
export function getSalas(): Sala[]{
  const numMessages = min(MESSAGE_LIMIT, salas.length);
  const startIndex = salas.length - numMessages;
  const result = new Array<Sala>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = salas[i + startIndex];
  }
  return result;
}

/**
 * Método de ESCRITURA para inicializar la relacion entre un alumno y su clase/sala
 *  >> near call dev-1654198617102-40626897569944 setAlumnoSala '{"profesor":"mmoreira.testnet", "fecha":"2022-06-02"}' --accountId mmoreira.testnet --amount 1
 *
 * @param fecha en la cual se dio la clase
 * @param profesor que dio la clase
 * @returns string: Responde con un mensaje en caso exitoso.
 */
export function setAlumnoSala(profesor: string, fecha: string): string{
  assert(validarFecha(fecha), "El campo fecha se ingreso incorrectamente. Por favor respete el formato aaaa-MM-dd");
  let persona = context.sender;
  let alumno = new Alumnos();
  for (let i = 0; i < salas.length; i++) {
    if (salas[i].profesor == profesor && salas[i].fecha == fecha){
      for (let j = 0; j < salas[i].alumnos.length; j++) {
        if (salas[i].alumnos[j].sender == persona){
          assert(false,"El alumno ya fue dado de alta para la clase seleccionada")
        }
      }
      let sala = salas[i]
      sala.alumnos.push(alumno)
      salas.replace(i, sala);
      return "¡Se dio de alta al alumno en la clase seleccionada!"
    }
  }
  assert(false,"El profesor no dio clases en el dia seleccionado.")
  return ""
}

function validarFecha(fecha: string): boolean {
  let fechaSplit = fecha.split("-")
  if(fechaSplit.length != 3){
    return false;
  }
  if(parseInt(fechaSplit[0]) < 2021){
    return false;
  }
  if(parseInt(fechaSplit[1]) < 1 || parseInt(fechaSplit[1]) > 12){
    return false;
  }
  if(parseInt(fechaSplit[2]) < 1 || parseInt(fechaSplit[1]) > 31){
    return false;
  }
  return true;
}

/**
 * Método de ESCRITURA para dar aviso de covid positivo de un alumno o profesor
 *  >> near call dev-1654198617102-40626897569944 setCovid '{"fecha":"2020-08-05"}' --accountId mmoreira.testnet
 *
 * @param fecha en la cual se dio de positivo covid
 * @returns string: Responde con un mensaje en caso exitoso.
 */
export function setCovid(fecha:string): string{
  assert(validarFecha(fecha), "El campo fecha se ingreso incorrectamente. Por favor respete el formato aaaa-MM-dd");

  const persona = context.sender;
  var avisoEnviado = false;
  for (let i = 0; i < salas.length; i++) {
    var fechas = obtenerFechasCercanas(fecha)
    if (fechas.has(salas[i].fecha)){
      //Se checkea si la persona con covid es el profesor de la clase.
      if(salas[i].profesor == persona) {
        avisoCovid(i)
        avisoEnviado = true;
      }

      //Se checkea si la persona con covid es alumno de la clase
      for (let j = 0; j < salas[i].alumnos.length; j++) {
        if (salas[i].alumnos[j].sender == persona){
          avisoCovid(i)
          avisoEnviado = true;
        }
      }
    }
  }
  if(avisoEnviado){
    return "Se dara aviso urgente a todos los integrantes de las clases a la que fuiste."
  }
  return "¡Que suerte! Ningun otro alumno o profesor tuvo contacto contigo en los dias cercanos a tu contagio. ¡Que te mejores!"
}

function obtenerFechasCercanas(fecha:string): Map<string, string> {
  let fechaSplit = fecha.split("-");
  var fechasCercanas = new Map<string, string>()
  fechasCercanas.set(fecha, fecha);
  let diaNuevo = parseInt(fechaSplit[2])
  let mesNuevo = parseInt(fechaSplit[1])
  let yearNuevo = parseInt(fechaSplit[0])
  for(let i=0;i<5; i++) {
    if (diaNuevo == 1) {
      if (mesNuevo == 1) {
        mesNuevo = 12
        yearNuevo = yearNuevo - 1;
      } else {
        mesNuevo = mesNuevo - 1;
      }
      if(mesLargo(mesNuevo)){
        diaNuevo = 31
      }else{
        if(mesNuevo == 2){
          diaNuevo = 28
        }else{
          diaNuevo = 30
        }
      }
    } else {
      diaNuevo = diaNuevo - 1;
    }
    var fechaNueva = i32(yearNuevo).toString()+"-"+i32(mesNuevo).toString().padStart(2, "0")+"-"+i32(diaNuevo).toString().padStart(2, "0");
    fechasCercanas.set(fechaNueva, fechaNueva);
  }
  return fechasCercanas
}

function mesLargo(mes:f64): boolean{
  if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12 ) {
    return true;
  }
  return false;
}

export function avisoCovid(i: i32): void{
  let sala = salas[i]
  sala.covid = true
  salas.replace(i, sala);
}


//export function setAyuda(): void{

//}