# Corrección de mala práctica en ClimApp

## ¿Qué mala práctica identificaste?

Identificamos que la API Key de OpenWeatherMap estaba expuesta directamente en el código HTML del proyecto, específicamente en una etiqueta `<script>` dentro del archivo HTML principal.

## ¿Por qué es considerada una mala práctica?

Exponer claves API directamente en el código fuente es una mala práctica por varias razones:

1. **Seguridad**: Las claves API son credenciales sensibles que pueden ser utilizadas por terceros para acceder a servicios pagos o limitados.
2. **Control de costos**: Si la clave es utilizada por personas no autorizadas, puede generar costos inesperados si el servicio tiene un límite de uso o es de pago.
3. **Gestión de configuración**: Dificulta la gestión de diferentes entornos (desarrollo, pruebas, producción) que podrían requerir diferentes claves.
4. **Control de versiones**: Al estar en el código fuente, la clave API podría ser compartida accidentalmente en repositorios públicos.

## ¿Cómo la solucionaste?

La solución implementada consistió en:

1. **Separación de configuración**: Creamos un archivo `config.js` separado que contiene la clave API.
2. **Inclusión en .gitignore**: Agregamos este archivo al `.gitignore` para evitar que se suba a repositorios de control de versiones.
3. **Modularización**: Separamos el código JavaScript en un archivo aparte (`app.js`) que utiliza la configuración del archivo `config.js`.
4. **Referencia externa**: Modificamos el HTML para cargar estos archivos por separado, asegurándome de que `config.js` se cargue antes que `app.js`.

## ¿Qué beneficios aporta tu solución?

Los beneficios de esta solución son:

1. **Mayor seguridad**: La clave API ya no está expuesta directamente en el código fuente principal.
2. **Mejor mantenibilidad**: Es más fácil actualizar o cambiar la clave API sin modificar el código de la aplicación.
3. **Facilita múltiples entornos**: Permite tener diferentes archivos de configuración para diferentes entornos (desarrollo, pruebas, producción).
4. **Previene fugas de información**: Al estar en `.gitignore`, se reduce el riesgo de compartir accidentalmente la clave en repositorios públicos.
5. **Mejores prácticas de desarrollo**: Sigue el principio de separación de configuración y código, lo que es una práctica recomendada en el desarrollo de software.
6. **Modularidad**: El código es más modular y sigue mejor las prácticas de organización de archivos.



## OTRAS CORRECCIONES:

Renombrar adecuadamente los archivos, y agruparlos en carpeta raiz.
Comentar más lineas de código, en función a lo que considerábamos necesario.
Modificar algunos estilos en el archivo CSS.
Implementación de una API KEY propia de un integrante del grupo, con el fin de probar su funcionamiento.
