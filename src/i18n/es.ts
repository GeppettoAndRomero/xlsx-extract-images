import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Extraer imágenes de Excel (.xlsx/.xlsm), sin subir archivos | runlocally',
    description:
      'Extrae las imágenes incrustadas en un libro de Excel .xlsx o .xlsm y descárgalas en un ZIP. El archivo se procesa en el navegador.',
    ogTitle: 'Extraer imágenes de libros de Excel en el navegador',
    ogDescription:
      'Reúne en un ZIP las imágenes guardadas en un archivo .xlsx o .xlsm sin subir el libro.',
  },

  hero: {
    h1: 'Extraer imágenes de Excel',
    tagline:
      'Reúne las imágenes guardadas en un libro .xlsx o .xlsm y descárgalas en un ZIP. No se sube ningún archivo.',
  },

  intro: {
    h2: 'Descargar las imágenes incluidas en un libro de Excel',
    paras: [
      'Los libros de Excel con formato .xlsx y .xlsm son paquetes OOXML formados por varios archivos. Las imágenes incrustadas suelen almacenarse en xl/media/. Esta herramienta lee esa carpeta y coloca sus archivos en un ZIP aparte.',
      'Los datos de cada imagen se copian tal como están guardados. No se cambia el tamaño ni el formato y tampoco se vuelven a comprimir. La herramienta no lee celdas ni modifica el libro.',
    ],
  },

  privacy: {
    h2: 'Por qué el libro permanece en tu dispositivo',
    lead:
      'El libro se abre mediante código que se ejecuta en el navegador. La extracción no tiene un componente de servidor:',
    points: [
      'El paquete de entrada se lee en la memoria del navegador.',
      'Solo se copian al ZIP de salida los archivos situados en xl/media/.',
      'Ninguna petición de red contiene el libro ni las imágenes extraídas.',
      'El código fuente está disponible con licencia MIT.',
    ],
    note:
      'Durante la extracción puedes consultar el panel de Red del navegador: no se envían los datos del libro.',
    sourceLinkText: 'Leer el código fuente.',
  },

  howto: {
    h2: 'Cómo extraer las imágenes de un libro',
    steps: [
      {
        h3: 'Elige un libro',
        p: 'Selecciona o suelta un archivo .xlsx o .xlsm. No se aceptan archivos de más de 100 MB.',
      },
      {
        h3: 'Deja que el navegador lea el paquete',
        p: 'La herramienta busca los archivos guardados en xl/media/. No ejecuta las macros de los libros .xlsm.',
      },
      {
        h3: 'Descarga el ZIP',
        p: 'Si hay imágenes, se descarga un ZIP con el nombre del libro. Si no se encuentra ninguna, la página muestra el resultado y no crea una descarga.',
      },
    ],
  },

  faqHeading: 'Preguntas sobre la extracción de imágenes de Excel',
  faq: [
    {
      q: '¿Se sube mi archivo de Excel?',
      a: 'No. El libro se lee en el navegador y no se envía a un servidor. El ZIP de salida también se crea en el navegador.',
    },
    {
      q: '¿Qué formatos de Excel se admiten?',
      a: 'Se admiten archivos .xlsx y .xlsm de hasta 100 MB. El formato binario antiguo .xls no está incluido.',
    },
    {
      q: '¿Puede abrir un libro protegido con contraseña?',
      a: 'No. Los archivos de Excel protegidos con contraseña no se pueden abrir como un paquete OOXML ZIP normal, por lo que la página indica que no pudo abrir el archivo.',
    },
    {
      q: '¿La extracción cambia la calidad de las imágenes?',
      a: 'No. Cada imagen se copia byte por byte desde el paquete. Se conservan su formato y el nombre de archivo que Excel utiliza dentro del libro.',
    },
    {
      q: '¿Incluye imágenes vinculadas, gráficos y formas?',
      a: 'Solo incluye archivos almacenados físicamente en xl/media/. Las imágenes vinculadas desde una ubicación externa no forman parte del paquete. Los gráficos y las formas solo se incluyen si Excel guardó para ellos un archivo de imagen separado en esa carpeta.',
    },
    {
      q: '¿Qué ocurre si el libro no contiene imágenes incrustadas?',
      a: 'La página indica que no encontró imágenes incrustadas y no inicia una descarga. Se trata como un resultado normal, no como un error.',
    },
    {
      q: '¿Lee las celdas o ejecuta macros?',
      a: 'No. Solo lee la estructura ZIP y copia archivos multimedia. No extrae el contenido de las celdas, no cambia las hojas y no ejecuta macros VBA de los archivos .xlsm.',
    },
    {
      q: '¿Se puede usar sin conexión?',
      a: 'Sí. Cuando el Service Worker ha guardado en caché los archivos del sitio, el código de extracción puede ejecutarse sin conexión de red.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones corresponden al responsable del proyecto.',
    securityText: 'Seguridad',
  },
};
