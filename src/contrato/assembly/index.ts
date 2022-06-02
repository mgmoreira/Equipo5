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

export function setSala(fecha: string): void{
  const profesor = context.sender;
  let sala = new Sala(fecha, profesor);
  salas.push(sala)
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

export function setAlumnoSala(profesor: string, fecha: string): void{
  let alumno = new Alumnos("");
  for (let i = 0; i < salas.length; i++) {
    if (salas[i].profesor == profesor && salas[i].fecha == fecha){
      let sala = salas[i]
      sala.alumnos.push(alumno)
      salas.replace(i, sala);
      logging.log("Se registro al alumno correctamente.");
      break
    }
  }
}

export function setCovid(fecha:string): boolean{
  const alumno = context.sender;

  for (let i = 0; i < salas.length; i++) {
    if (salas[i].fecha == fecha){
      for (let j = 0; j < salas[i].alumnos.length; j++) {
        if (salas[i].alumnos[j].sender == alumno){
          let sala = salas[i]
          sala.covid = true
          salas.replace(i, sala);
          return true
        }
      }
    }
  }
  return false
}

export function setAlumno(sala: string): void {
  // Creating a new message and populating fields with our data
  const message = new Alumnos(sala);
  // Adding the message to end of the the persistent collection
  messages.push(message);
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