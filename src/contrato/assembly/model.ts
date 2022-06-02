import { context, u128, PersistentVector } from "near-sdk-as";

/**
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class Alumnos {
    premium: boolean;
    sender: string;
    constructor(public text: string) {
        this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
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
    public fecha: i64;
    public alumnos: Array<Alumnos>;
    public covid: boolean;

    constructor(fecha: i64, profesor: string) {
        this.profesor = profesor;
        this.fecha = fecha;
        this.alumnos = [];
        this.covid = false;
    }
}

export const salas = new PersistentVector<Sala>("s");