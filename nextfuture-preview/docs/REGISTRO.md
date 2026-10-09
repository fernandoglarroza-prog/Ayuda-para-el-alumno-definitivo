# Registro de ejecución — Nextfuture

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
