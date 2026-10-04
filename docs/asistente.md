# Asistente integrado

El sitio incorpora `assistant.js`, `assistant.css` y `/api/assistant`. El botón flotante y los botones existentes de Preguntar abren un diálogo en la misma página. La interfaz es compatible con la política CSP actual: no requiere scripts ni estilos inline.

## Consulta en vivo

Cada envío consulta las fuentes, sin caché de aplicación. Se reutilizan los endpoints públicos de la base del sitio, su catálogo de Drive, los horarios catalogados y el contenido público de la portada. Se distingue entre momento de consulta, verificación registrada y vigencia. No hay sincronización automática ni lectura de PDFs oficiales: un enlace a un horario se presenta como referencia, no como aula confirmada. El acceso al material es al catálogo, no una lectura de su contenido.

## Activación

La IA está desactivada hasta configurar en Vercel `OPENAI_API_KEY`, `OPENAI_MODEL` y `AGENT_ENABLED=true`. Antes, el mismo chat funciona como búsqueda por tema, sin generar respuestas ni prometer memoria conversacional. Activar inicialmente solo en Preview y probar preguntas reales con el modelo.

El código incluye validación de entradas, timeout, límite de mensajes y 12 peticiones por minuto por IP y por instancia. Ese límite local no es un control distribuido ni un tope de gasto. Antes de activar IA públicamente configurar un control persistente o WAF para `/api/assistant`, presupuesto del proveedor y aviso de privacidad aplicable al envío a OpenAI. No compartir claves en GitHub ni en el navegador.

Solo operaciones de lectura. El historial queda en memoria de la pestaña; se envían como máximo diez mensajes recientes al servidor. OpenAI recibe `store:false`; esto no elimina necesariamente todos los registros del proveedor. No se envía el texto de consultas a analítica.

## Verificar

`npm test` ejecuta pruebas del agente, validación, fuentes, vigencias y selección de herramientas. `npm run dev` sirve el sitio con la política CSP y endpoint real. El modelo real no está verificado sin credencial.
