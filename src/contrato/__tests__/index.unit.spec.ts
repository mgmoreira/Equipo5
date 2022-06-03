import {
  setSala,
  getSalas,
} from "../assembly";
import { VMContext, PersistentVector } from "near-sdk-as";
import { Alumnos, Sala } from "../assembly/model";

const FECHA = "2022-06-02";

const setContext = (): void => {
  //Variables del contexto
  VMContext.setSigner_account_id("profesor");
};


describe("SetSalaInicial", () => {
  it("Registra una sala con un profesor asociado sin alumnos porque estÃ¡ dando de alta la sala.", () => {

    setContext();

    setSala(FECHA);
    // let v = new PersistentVector<Sala>("s")
    var salitas: Sala[] = getSalas();
    var alumnos = new Array<Alumnos>();
    for (let index = 0; index < salitas.length; index++) {
      const element = salitas[index];
      // console.log(element.profesor)
      expect(element.profesor).toBe("profesor");
      expect(element.fecha).toBe(FECHA);
      expect(element.alumnos.length).toBe(0);
      expect(element.covid).toBe(false);
    }
    // if (salitas) {
    //   expect(salita[0].profesor).toBe("profesor");
    //   expect(salita[0].fecha).toBe(FECHA);
    //   expect(salita[0].alumnos).toBe([]);
    //   expect(salita[0].covid).toBe(false);
    // }

  });
})
