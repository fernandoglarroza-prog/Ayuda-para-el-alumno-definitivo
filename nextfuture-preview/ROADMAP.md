# Nextfuture — Roadmap autónomo

## Prioridad inmediata
- [ ] Cerrar email automático al cliente: consentimiento → cola → Resend → historial enviado/fallido, sin acción manual.
- [ ] Verificar un remitente/dominio propio para emails reales.
- [ ] Integrar WhatsApp Business Cloud API cuando existan credenciales y plantillas aprobadas.
- [ ] Mantener fallback manual de WhatsApp desde Centro de avisos.
- [ ] Probar circuito real completo: solicitud → presupuesto → aceptación/rechazo → seña → repuesto → reparación → pruebas → entrega → opinión.

## Operación diaria
- [x] Panel privado.
- [x] Clientes, caja, stock y rentabilidad.
- [x] Agenda, tareas y cierre de caja.
- [x] Centro de avisos.
- [ ] Alertas por demoras: presupuestos sin respuesta, repuestos atrasados, equipos listos sin retirar y tareas vencidas.
- [x] Reporte operativo mensual de órdenes con descarga CSV (alcance: últimas 200 órdenes cargadas).
- [ ] Reporte contable mensual exhaustivo: conciliación de pagos/egresos por fecha y paginación completa.

## Diagnóstico
- [x] Integración en la rama de panel de diagnóstico diferencial, riesgo, biblioteca técnica y resguardo para modelos desconocidos (V5.3); requiere prueba de navegador.
- [x] Diagnóstico ampliado y adaptativo.
- [x] Síntomas múltiples y respuestas Sí/No/No sé.
- [x] Familias/modelos.
- [x] Aprendizaje contra causa técnica confirmada.
- [ ] Continuar ampliando cobertura por modelo/familia con evidencia real.
- [ ] Medir preguntas que aportan señal diagnóstica con muestras mínimas.

## Cliente y confianza
- [x] Comprobante privado.
- [x] Aceptar/rechazar presupuesto.
- [x] Opinión verificada y consentimiento de publicación.
- [x] Casos reales sin testimonios ficticios.
- [ ] Mejorar comunicaciones y recordatorios.
- [ ] Términos, privacidad y garantía revisados para lanzamiento.

## Infraestructura
- [x] V4.7 desplegada en Vercel staging, sin pasar a producción (9/10/2026).
- [ ] Verificar V5.3 integrado en Vercel staging y completar prueba de cliente-panel con cuenta real.
- [ ] URL permanente e independiente para Nextfuture.
- [ ] Restringir CORS al dominio definitivo.
- [ ] Configurar SMTP/Auth de producción.
- [ ] Revisar security/performance advisors de Supabase después de cambios.
- [ ] Consolidar archivos/versiones antiguas cuando el flujo esté estable.

## Regla de lanzamiento
No considerar Nextfuture listo para producción hasta completar un circuito real de punta a punta y verificar manualmente cliente + panel + notificaciones.
