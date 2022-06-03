import {Alumnos, messages, Sala, salas} from "./model";
import {context, logging} from 'near-sdk-as'

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
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

export function getSalas(): Sala[]{
  const numMessages = min(MESSAGE_LIMIT, salas.length);
  const startIndex = salas.length - numMessages;
  const result = new Array<Sala>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = salas[i + startIndex];
  }
  return result;
}

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

export function setCovid(fecha:string): string{
  assert(validarFecha(fecha), "El campo fecha se ingreso incorrectamente. Por favor respete el formato aaaa-MM-dd");

  const persona = context.sender;

  for (let i = 0; i < salas.length; i++) {
    if (salas[i].fecha == fecha){

      //Se checkea si la persona con covid es el profesor de la clase.
      if(salas[i].profesor == persona) {
        avisoCovid(i)
        return "Se dara aviso urgente a todos los integrantes de las clases que diste."
      }

      //Se checkea si la persona con covid es alumno de la clase
      for (let j = 0; j < salas[i].alumnos.length; j++) {
        if (salas[i].alumnos[j].sender == persona){
          avisoCovid(i)
          return "Se dara aviso urgente a todos los integrantes de las clases a las que asististe."
        }
      }
    }
  }
  return "¡Que suerte! Ningun otro alumno o profesor tuvo contacto contigo en los dias cercanos a tu contagio. ¡Que te mejores!"
}

export function avisoCovid(i: i32): void{
  let sala = salas[i]
  sala.covid = true
  salas.replace(i, sala);
}

export function setAlumno(sala: string): void {
  // Creating a new message and populating fields with our data
  //const message = new Alumnos(sala);
  // Adding the message to end of the the persistent collection
  //messages.push(message);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getPersonas(): Alumnos[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<Alumnos>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}