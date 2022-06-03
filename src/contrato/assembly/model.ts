import { context, u128, PersistentVector } from "near-sdk-as";

/**
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class Alumnos {
    sender: string;
    constructor() {
        this.sender = context.sender;
    }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<Alumnos>("m");

@nearBindgen
export class Sala {
    public profesor: string;
    public fecha: string;
    public alumnos: Array<Alumnos>;
    public covid: boolean;

    constructor(fecha: string, profesor: string) {
        this.profesor = profesor;
        this.fecha = fecha;
        this.alumnos = [];
        this.covid = false;
    }
}

export let salas = new PersistentVector<Sala>("s");

@nearBindgen
export class Covid {
    public persona: string;
    public donacion: boolean;

    constructor(persona: string) {
        this.persona = persona;
        this.donacion = false;
    }
}

export let covid = new PersistentVector<Covid>("c");