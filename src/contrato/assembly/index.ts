import {Alumnos, messages, Sala, salas} from "./model";
import {context, PersistentVector} from 'near-sdk-as'

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */

export function setSala(profesor: string): void{
  //const profesor = context.sender;
  //const fecha = new Date();
  let sala = new Sala(1, profesor);
  salas.push(sala)
}

export function getSalas(): u32{
  return salas.length
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