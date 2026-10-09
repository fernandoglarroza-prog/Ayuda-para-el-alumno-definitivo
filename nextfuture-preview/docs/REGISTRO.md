# Registro de ejecución — Nextfuture

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
