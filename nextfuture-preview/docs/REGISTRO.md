# Registro de ejecución — Nextfuture

## 2026-10-09 — Integración de diagnóstico V5.3 en rama de panel
- Se recuperaron módulos de diagnóstico técnico, riesgo, diferencial, cotización por modelo y resumen de solicitud desde `nextfuture-deploy` hacia `nextfuture-preview/ ` sin modificar esa rama ni `main`.
- Los módulos de aprendizaje y evidencia existentes en `nextfuture-preview/` se enlazaron a la página. Se conserva el agente público V4.3 y el panel V4.7.
- Seguridad: se escaparon marca, modelo, ubicación y problema de la solicitud antes de insertarlos en HTML; el cotizador escapa el texto del modelo. La detección de trabajo ya no depende del antiguo módulo V4.8.
- Se agregaron pruebas de integración; se comprobaron sintaxis JS de los scripts modificados, coincidencia por modelo y que la entrada HTML maliciosa se escapa. Las pruebas automáticas en CI y el recorrido real en navegador siguen pendientes.
- El primer despliegue de V4.7 en Vercel staging quedó en READY (commit `739d49f`). Esta integración todavía no se considera probada en producción.


## 2026-10-09 — V4.7 en GitHub, pendiente de desplegar y probar en navegador
- Reparados dos separadores `\\n` literales en `admin.html` que interferían con el parseo limpio de los assets del panel.
- Se agregó escape de datos en el resultado de solicitudes públicas y la identificación de una orden en el cotizador interno. Los mensajes de error ahora se dibujan como texto, no como HTML.
- Nuevo botón **Reportes** en el panel: conteos de órdenes ingresadas, entregadas y pendientes; suma de presupuestos de las órdenes ingresadas en el mes; desglose por orden y exportación CSV local sin nombre, email ni teléfono.
- Limitación declarada en interfaz: el dashboard sólo entrega las últimas 200 órdenes; no interpretar los presupuestos como ingreso mensual, ni los pagos por orden como cobros exclusivamente del mes.
- Verificaciones realizadas: sintaxis JavaScript para scripts intervenidos, 8 comprobaciones funcionales con datos simulados (fecha Argentina, conteos, presupuesto, protección CSV y ausencia de datos personales). Pruebas de navegador y despliegue Vercel aún **pendientes**.
- No se modificó Supabase ni se envió información a clientes. Cambios aislados a `nextfuture-preview/` en rama `nextfuture-preview`.


## 2026-10-09
- Se adoptó para Nextfuture el mismo patrón de autonomía de la Fábrica de Apps Android, manteniendo repositorios/proyectos separados.
- Estado heredado: página pública con diagnóstico adaptativo, solicitud y seguimiento; panel de órdenes, presupuesto, pagos, repuestos, stock, caja, agenda, tareas, casos reales y aprendizaje diagnóstico.
- Resend ya fue probado con un email interno.
- Existe cola `nf_notifications` y Centro de avisos.
- El cliente puede elegir WhatsApp/email/ambos/ninguno.
- Pendiente crítico: automatizar despacho de emails a clientes con consentimiento y remitente verificado.
- Pendiente externo: dominio/remitente Resend y WhatsApp Business Cloud API.
- Regla: no enviar a clientes sin consentimiento y no afirmar envío automático hasta verificarlo.

- Cron de notificaciones corregido: ahora usa publishable key para gateway + secreto interno en Supabase Vault.
- Verificación técnica: llamada del cron al dispatcher respondió HTTP 200.
- Seguridad: el cron no envía a clientes mientras `RESEND_FROM` no sea un remitente de dominio verificado.
- Se agregó V4.5 de alertas operativas: solicitudes sin coordinar, presupuestos sin respuesta, repuestos demorados, ETA de reparación vencida, equipos listos sin retirar y tareas vencidas.
- V4.5 desplegada en Vercel y estado READY.
