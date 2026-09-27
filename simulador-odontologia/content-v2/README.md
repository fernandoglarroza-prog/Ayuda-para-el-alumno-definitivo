# Corpus académico V2 · Anatomía Odontológica

Este directorio contiene el corpus académico profundo del simulador. **La V2 todavía no se integra a la interfaz pública.** La prioridad actual es completar, revisar y normalizar el contenido antes de diseñar la experiencia visual definitiva.

## Fuente de verdad actual
Los archivos Markdown de este directorio conservan el desarrollo largo, la trazabilidad temática y las capas de profundización. Desde esta etapa, la **fuente estructurada que consumirá la futura interfaz** es `content-v2/data/`.

### `data/`
- `index.json`: manifiesto único del corpus estructurado.
- `schema-v2.json`: contrato de datos obligatorio para cada ficha.
- `osteology-topography.json`: mandíbula, maxilar, temporal, esfenoides y fosas profundas.
- `neurovascular-atm.json`: V2, V3, arteria maxilar, ATM y pterigoideo lateral.
- `oral-salivary.json`: piso de boca, lengua, parótida y submandibular.
- `dentition-radiology.json`: primeros molares superior/inferior y correlaciones radiográficas de conducto mandibular/seno maxilar.
- `terminology-map.json`: términos actuales, sinónimos y denominaciones clásicas aceptables.
- `oral-bank.json`: preguntas técnicas enlazadas por ID a las fichas.
- `validate-content.mjs`: control de integridad, referencias cruzadas, mínimos de profundidad y preguntas.
- `compile-content.mjs`: generador futuro de `compiled-v2.json` para la interfaz.

El archivo compilado será un **derivado**, no una fuente editable manualmente.

## Cuatro niveles de lectura
Cada ficha estructurada contiene cuatro niveles, todos derivados del mismo contenido de fondo:

1. **Repaso (`review`)**: reconocimiento rápido y relaciones imprescindibles.
2. **Desarrollo (`development`)**: descripción anatómica universitaria ordenada.
3. **Técnico (`technical`)**: terminología formal, planos, trayectos, inserciones, variaciones y correlación odontológica/radiográfica.
4. **Oral (`oral`)**: orden de exposición, preguntas, elementos obligatorios, repreguntas y errores críticos.

Esto evita mantener cuatro explicaciones independientes que puedan contradecirse.

## Criterio de profundidad
Cada tema debe permitir estudiar para reconocimiento práctico y para examen oral/escrito. Cuando corresponda, debe cubrir:

1. Denominación anatómica formal y sinónimos clásicos útiles.
2. Definición, clasificación y situación.
3. Orientación anatómica tridimensional.
4. Partes, caras, bordes, ángulos y procesos.
5. Accidentes anatómicos.
6. Articulaciones y medios de unión.
7. Inserciones musculares y ligamentosas.
8. Relaciones topográficas.
9. Contenido y comunicaciones de espacios/regiones.
10. Trayectos neurovasculares, ramas y modalidad de fibras.
11. Irrigación, drenaje venoso/linfático e inervación.
12. Función o biomecánica.
13. Importancia odontológica y anestésica anatómica.
14. Correlación panorámica/CBCT cuando corresponda.
15. Variaciones anatómicas relevantes.
16. Diferenciales y errores frecuentes de examen.
17. Preguntas de desarrollo/oral y respuesta modelo.

Los temas mayores deben tener al menos **seis bloques técnicos sustantivos** en la base estructurada.

## Terminología
La interfaz futura mostrará primero Terminologia Anatomica contemporánea y conservará como sinónimos buscables/aceptables las denominaciones clásicas que todavía aparecen en cátedra o bibliografía, por ejemplo:

- mandíbula / maxilar inferior;
- língula mandibular / espina de Spix;
- nervio alveolar inferior / dentario inferior;
- arteria maxilar / maxilar interna;
- pterigoideo medial/lateral / interno/externo;
- fosa mandibular / cavidad glenoidea;
- disco articular / menisco articular.

No se normalizan como equivalentes conceptos que no sean verdaderos sinónimos.

## Banco oral
Las preguntas abiertas ya no se corrigen solo por una palabra clave. El sistema estructurado evalúa:

- orden anatómico;
- precisión terminológica;
- partes/límites;
- relaciones y comunicaciones;
- trayectos;
- integración odontológica;
- errores críticos.

La escala interna `Inicial → Intermedia → Avanzada → Oral sólido` es pedagógica y **no representa una calificación oficial de la cátedra**.

## Marco académico
El orden sigue el Programa Analítico de Anatomía Normal de Odontología de la UNO ya recuperado para el proyecto: Osteología, Artrología, Miología, Angiología, Neurología, Topografía, Estesiología, Anatomía Dentaria y Cavidad Bucal.

La redacción es material educativo original del simulador y no reproduce páginas de bibliografía protegida. Bibliografía de referencia del proyecto/cátedra a contrastar progresivamente: Figún y Garino; Latarjet y Ruiz Liard; Snell; Testut/Latarjet; Velayos/Santana. Para verificación puntual se utilizan además fuentes anatómicas abiertas y literatura biomédica accesible.

## Estado actual de migración
Ya están estructurados los núcleos de mayor rendimiento para testear el modelo de profundidad:

- mandíbula, maxilar, temporal y esfenoides;
- fosa infratemporal y pterigopalatina;
- V2 y V3;
- arteria maxilar;
- ATM y pterigoideo lateral;
- piso de boca y lengua;
- parótida y submandibular;
- primer molar superior e inferior;
- conducto mandibular y seno maxilar en correlación radiográfica.

El resto del corpus profundo permanece disponible en Markdown y se migrará progresivamente a la misma estructura antes de habilitar la V2 visible.

## Pendientes antes de la interfaz
1. Migrar el resto de huesos, músculos, pares craneales, glándulas y piezas dentarias al esquema estructurado.
2. Ejecutar y dejar en cero los errores del validador.
3. Confirmar cronología eruptiva utilizada por la cátedra.
4. Confirmar nomenclatura clásica prioritaria de los docentes.
5. Definir la terminología docente para relación céntrica/oclusión céntrica.
6. Definir profundidad de anatomía interna/endodóntica esperada.
7. Contrastar ediciones/páginas bibliográficas concretas cuando sea posible.
8. Hacer una nueva revisión con estudiantes/docentes antes de marcar contenido como `validated`.

## Regla de integración
No crear una nueva preview académica solo porque los archivos existen. Primero se completa la migración, se valida la base y recién después la interfaz consumirá `compiled-v2.json` para ofrecer **Repaso / Desarrollo / Técnico / Oral** sin duplicar contenido.
