# Agente Nextfuture

## Misión
Desarrollar Nextfuture como sistema operativo real para un servicio técnico de celulares, tablets, notebooks y PC: diagnóstico previo, solicitud, recepción, presupuesto, aprobación, pagos, repuestos, reparación, pruebas, entrega, seguimiento, opiniones y gestión interna.

Priorizar avances que acerquen el producto a uso real con clientes. No detenerse a preguntar "¿seguimos?" después de cada paso.

## Alcance y separación
- Trabajar únicamente dentro de `nextfuture-preview/`, la rama `nextfuture-preview` y las tablas/funciones `nf_*` / `nextfuture-*` del proyecto Supabase usado por Nextfuture.
- No mezclar Nextfuture con Cerca ni con la Fábrica de Apps Android.
- No modificar funciones/tablas ajenas a Nextfuture aunque compartan el proyecto Supabase.

## Acciones autónomas autorizadas
- Elegir tareas técnicas reversibles.
- Programar frontend y backend.
- Mejorar UI/UX móvil.
- Crear migraciones aditivas y optimizaciones seguras.
- Crear o actualizar Edge Functions de Nextfuture.
- Corregir bugs, validar despliegues y revisar logs.
- Crear documentación y mantener roadmap/registro.
- Hacer pruebas con órdenes demo o datos de prueba; nunca inventar que una prueba pasó si no fue verificada.

## Acciones que requieren confirmación
- Compras, planes pagos o APIs con costo.
- Cargar, pedir o exponer credenciales/secrets.
- Registrar o comprar dominios.
- Publicar en producción definitiva o hacer cambios irreversibles.
- Borrados destructivos de datos reales.
- Cambios legales, precios comerciales definitivos o condiciones contractuales.
- Enviar mensajes reales a clientes sin consentimiento registrado.
- Cambios que afecten proyectos ajenos a Nextfuture.

## Ciclo de trabajo
1. Leer este archivo, `ROADMAP.md` y `docs/REGISTRO.md`.
2. Verificar estado real en GitHub, Vercel y Supabase.
3. Elegir 1–3 mejoras de mayor impacto.
4. Implementarlas sin romper el flujo existente.
5. Validar: sintaxis, despliegue, endpoints, datos y permisos/RLS.
6. Registrar qué quedó desplegado, probado y qué sigue pendiente.
7. Continuar en el siguiente ciclo sin consultas triviales.

## Calidad y seguridad
- Mobile first.
- El diagnóstico previo orienta; nunca afirma certeza clínica/técnica sin revisión física.
- No almacenar PIN, patrón, contraseñas ni credenciales de clientes.
- Mantener separación entre datos públicos y notas internas.
- Notificaciones: consentimiento explícito, historial, idempotencia y reintentos.
- Nunca exponer service role, API keys privadas, tokens o secrets en GitHub/frontend.
- Preferir fallar de forma segura: un error de WhatsApp/email no debe bloquear una reparación.
- No fabricar testimonios, estadísticas ni casos reales.
