```sh
npm install
```

ó

```sh
yarn install
```

Una vez hecho esto, podemos compilar el código.

```sh
npm run build
```

ó

```sh
yarn build
```

El contrato compilado en WebAssembly se guarda en la carpeta `/build/release/`. Ahora solo es necesario desplegarlo en una cuenta de desarrollo.

```sh
near dev-deploy build/debug/contrato.wasm
```

### Usando variables de entorno

Una vez compilado y desplegado tu proyecto, vamos a requerir identificar la cuenta neardev. Esta la puedes encontrar en el archivo `/neardev/neardev`. Podemos almacenar este contrato en una variable de entorno ejecutando lo siguiente en la consola, y sustituyendo por tu cuenta de desarrollo:

```sh
export CONTRATO=dev-0000000000000-000000000
```

Haciendo esto, podemos comprobar que la variable `CONTRATO` tiene almacenada nuestra cuenta dev.

```sh
echo $CONTRATO
```
```

```sh
npm install
```

ó

```sh
yarn install
```

Una vez hecho esto, podemos compilar el código.

```sh
npm run build
```

ó

```sh
yarn build
```

El contrato compilado en WebAssembly se guarda en la carpeta `/build/release/`. Ahora solo es necesario desplegarlo en una cuenta de desarrollo.

```sh
near dev-deploy build/debug/contrato.wasm
```

### Usando variables de entorno

Una vez compilado y desplegado tu proyecto, vamos a requerir identificar la cuenta neardev. Esta la puedes encontrar en el archivo `/neardev/neardev`. Podemos almacenar este contrato en una variable de entorno ejecutando lo siguiente en la consola, y sustituyendo por tu cuenta de desarrollo:

```sh
export CONTRATO=dev-0000000000000-000000000
```

Haciendo esto, podemos comprobar que la variable `CONTRATO` tiene almacenada nuestra cuenta dev.

```sh
echo $CONTRATO
```

En este contrato tenemos las siguientes funciones:
- `setSala(fecha: string)`: esta función nos permite crear la sala de la clase con un profesor asociado a esta. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near call dev-0000000000000-000000000 setSala '{"fecha":"02/06/2022"}' --accountId account.testnet
```
La respuesta esperada a la ejecución de este comando debería ser:
```sh
'¡La sala fue dada de alta correctamente!'
```
- `getSalas()`: esta función nos permite ver las salas creadas hasta el momento con sus respectivo profesor, fecha, alumno, y si es que hubo alguien presente en ella con covid o no. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near view dev-0000000000000-000000000 getSalas
```
La respuesta esperada a la ejecución de este comando debería ser:
```
[
  {
    profesor: 'account.testnet',
    fecha: '02/06/2022',
    alumnos: [],
    covid: false
  }
]
```
- `setAlumnoSala`: esta función nos permite agregar un alumno a una sala con una determinada fecha y profesor. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near call dev-0000000000000-000000000 setAlumnoSala '{"profesor":"account.testnet", "fecha":"02/06/2022"}' --accountId account2.testnet
```
La respuesta esperada a la ejecución de este comando debería ser:
```
'¡Se dio de alta al alumno en la clase seleccionada!'
```
- Re-ejecución de `getSalas()`: esta función nos permite ver las salas creadas hasta el momento con sus respectivo profesor, fecha, alumno, y si es que hubo alguien presente en ella con covid o no. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near view dev-0000000000000-000000000 getSalas
```
La respuesta esperada a la ejecución de este comando `con el nuevo alumno` debería ser:
```
[
  {
    profesor: 'account.testnet',
    fecha: '02/06/2022',
    alumnos: [ { sender: 'account2.testnet' } ],
    covid: false
  }
]
```
- `setCovid(fecha:string)`: esta función nos permite que una persona diga en qué fechas estuvo presente en salas en caso de que presente covid. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near call dev-0000000000000-000000000 setCovid '{"fecha":"02/06/2022"}' --accountId account.testnet
```
La respuesta esperada a la ejecución de este comando `para un profesor` debería ser:
```
'Se dara aviso urgente a todos los integrantes de las clases que diste.'
```
La respuesta esperada a la ejecución de este comando `para un alumno` debería ser:
```
'Se dara aviso urgente a todos los integrantes de las clases a las que asististe.'
```
- Última ejecución de `getSalas()`: esta función nos permite ver las salas creadas hasta el momento con sus respectivo profesor, fecha, alumno, y si es que hubo alguien presente en ella con covid o no. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near view dev-0000000000000-000000000 getSalas
```
La respuesta esperada a la ejecución de este comando `ya sea con un profesor o alumno que avisó que tuvo covid ese día` debería ser:
```
[
  {
    profesor: 'account.testnet',
    fecha: '02/06/2022',
    alumnos: [ { sender: 'account2.testnet' } ],
    covid: true
  }
]
```
-`setAyuda()`: esta función nos permite mandar una donación a las personas afectadas con Covid. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near call dev-0000000000000-000000000 setAyuda '' --accountId account.testnet
```
La respuesta esperada a la ejecución de este comando debería ser:
```
'¡La ayuda esta en camino!'
```
-`getCovid()`: esta función nos permite ver a quien se envió o no la donación. Para poder ejecutarla tenemos que usar el siguiente comando:
```
near view dev-0000000000000-000000000 getCovid
```
