// Nextfuture V3.1 — expansión amplia del diagnóstico previo
(function(){
  const C={
    power:'Energía y carga',display:'Pantalla y táctil',battery:'Batería',audio:'Audio',camera:'Cámaras',
    connect:'Conectividad',system:'Sistema y software',performance:'Rendimiento y almacenamiento',input:'Controles y periféricos',
    physical:'Daño físico',security:'Cuentas y acceso',data:'Datos',components:'Componentes',cooling:'Temperatura y refrigeración'
  };
  const ROUTE={
    software:['Probable software / configuración','Hay indicios que pueden resolverse con configuración, sistema o software antes de cambiar piezas.'],
    hardware:['Probable componente / repuesto','La falla es compatible con un componente físico, conector, módulo o repuesto.'],
    mixed:['Software o hardware','El síntoma puede tener origen lógico o físico; las respuestas ayudan a separar ambas posibilidades.'],
    inspection:['Requiere revisión física','Para confirmar la causa hace falta revisar el equipo, medir o probar componentes.'],
    urgent:['Revisión prioritaria','Hay un dato que aconseja dejar de usar el equipo y revisarlo cuanto antes.'],
    data:['Priorizar datos','Antes de reinstalar, formatear o forzar el equipo conviene proteger la información importante.']
  };
  const BRANDS={
    phone:['Samsung','Motorola','Apple','Xiaomi','Redmi','POCO','TCL','Huawei','Honor','Nokia / HMD','ZTE','Realme','Oppo','Vivo','OnePlus','Sony','LG','Alcatel','Infinix','Tecno'],
    tablet:['Samsung','Apple','Lenovo','Xiaomi','Redmi','TCL','Huawei','Honor','Amazon','Microsoft','Acer','Asus'],
    notebook:['Lenovo','HP','Dell','Asus','Acer','Samsung','MSI','Apple','Banghó','Positivo','EXO','Gigabyte','Razer','Microsoft','Huawei'],
    pc:['Armado / Custom','Dell','HP','Lenovo','Asus','Acer','Banghó','Positivo','EXO']
  };
  const q=(id,text,urgent=false)=>({id,text,yes:'Sí: es un dato importante y aumenta el peso de algunas causas posibles.',no:'No: esa posibilidad pierde peso, aunque no queda descartada.',urgentIfYes:urgent});
  const make=(key,label,category,route,causes,q1,q2,checks=[],urgent=false)=>({
    label,category,route,price:'Requiere revisión',inspection:true,causes,questions:[q(key+'_a',q1,urgent),q(key+'_b',q2,false)],safeChecks:checks
  });
  const E={
    phone:[
      ['restart_bootloop','Se reinicia o queda en el logo',C.system,'mixed',['Sistema dañado o actualización fallida','Batería o alimentación inestable','Almacenamiento o placa'], '¿Queda trabado en el logo o reinicia varias veces seguidas?','¿Empezó después de una actualización, instalación o caída?',['Probá un reinicio normal sin borrar datos.','Si se calienta mucho durante el bucle, apagalo y no lo fuerces.']],
      ['overheat','Se calienta demasiado',C.cooling,'mixed',['Aplicación o proceso consumiendo recursos','Batería degradada','Falla de carga, placa o disipación'], '¿Se calienta incluso sin usar juegos, cámara o carga rápida?','¿Se apaga, baja el brillo o muestra aviso de temperatura?',['Retirá funda y cargador y dejalo enfriar sin usar hielo ni freezer.']],
      ['touch','Táctil falla o toca solo',C.display,'hardware',['Módulo táctil dañado','Humedad o golpe','Cargador generando interferencia'], '¿Hay zonas de la pantalla que no responden?','¿El problema cambia al desconectar el cargador?',['Limpiá y secá la pantalla y probá sin cargador.']],
      ['camera','Cámara no abre, tiembla o enfoca mal',C.camera,'mixed',['Aplicación/permisos de cámara','Módulo de cámara','Golpe, suciedad o estabilizador'], '¿Falla tanto la cámara frontal como la trasera?','¿La imagen vibra, hace ruido o nunca logra enfocar?',['Reiniciá el equipo y probá la cámara desde la app original.']],
      ['flashlight','Flash o linterna no funciona',C.camera,'mixed',['Bloqueo de software o temperatura','LED/flash dañado','Módulo de cámara o placa'], '¿La linterna figura deshabilitada aun con batería suficiente?','¿El flash tampoco funciona al sacar fotos?',['Cerrá la cámara, dejá enfriar el equipo y volvé a probar.']],
      ['speaker','Parlante suena bajo, distorsiona o no suena',C.audio,'hardware',['Rejilla obstruida','Parlante dañado','Humedad o circuito de audio'], '¿El problema aparece también con tonos y videos locales?','¿Empezó después de humedad, caída o golpe?',['Probá volumen multimedia y llamada por separado; no introduzcas objetos en la rejilla.']],
      ['earpiece','No escucho al hablar por llamada',C.audio,'mixed',['Auricular superior obstruido o dañado','Audio enviado a Bluetooth','Falla de software o circuito'], '¿Con altavoz sí escuchás correctamente?','¿Pasa también con Bluetooth desactivado?',['Desactivá Bluetooth y probá una llamada con volumen alto.']],
      ['microphone','No me escuchan / micrófono falla',C.audio,'mixed',['Micrófono obstruido o dañado','Permisos de aplicación','Humedad o circuito de audio'], '¿Falla también al grabar una nota de voz?','¿Funciona mejor usando auriculares con micrófono?',['Grabá una nota de voz para comparar, sin limpiar orificios con agujas.']],
      ['headphones','No detecta auriculares o audio por cable',C.audio,'mixed',['Conector/adaptador dañado','Suciedad o humedad','Configuración o accesorio incompatible'], '¿Probaste otros auriculares o adaptador compatibles?','¿El equipo queda indicando auriculares aun después de desconectarlos?',['Probá otro accesorio conocido y revisá visualmente el conector sin forzarlo.']],
      ['wifi','Wi‑Fi no conecta o se corta',C.connect,'mixed',['Configuración/red guardada','Antena o módulo Wi‑Fi','Sistema o placa'], '¿Otros equipos navegan bien en la misma red?','¿El celular falla también en otra red Wi‑Fi?',['Olvidá y reconectá la red sólo si conocés la contraseña.','Probá otra red para separar router de teléfono.']],
      ['bluetooth','Bluetooth no conecta',C.connect,'mixed',['Emparejamiento/configuración','Accesorio incompatible','Módulo inalámbrico o sistema'], '¿Falla con más de un accesorio Bluetooth?','¿Podés activar Bluetooth normalmente o se apaga solo?',['Eliminá el emparejamiento y volvé a vincular un accesorio conocido.']],
      ['mobile_signal','Sin señal / llamadas o datos fallan',C.connect,'mixed',['Cobertura u operador','SIM/eSIM o configuración','Antena, lector o radiofrecuencia'], '¿Otra línea del mismo operador tiene señal en ese lugar?','¿La falla empezó después de un golpe o reparación?',['Activá y desactivá modo avión y reiniciá.','No manipules antenas internas.']],
      ['sim','No detecta SIM o dice sin tarjeta',C.connect,'hardware',['SIM dañada o mal asentada','Bandeja/lector SIM','Configuración o baseband'], '¿La SIM funciona en otro teléfono compatible?','¿Otra SIM es detectada por este equipo?',['Si la bandeja sale sin resistencia, revisá orientación; no la fuerces.']],
      ['gps','GPS ubica mal o pierde ubicación',C.connect,'mixed',['Permisos/ahorro de batería','Configuración de ubicación','Antena o sensor'], '¿Sucede en varias aplicaciones de mapas?','¿La ubicación mejora al estar al aire libre?',['Activá ubicación precisa y probá al aire libre.']],
      ['biometrics','Huella o reconocimiento facial falla',C.input,'mixed',['Sensor sucio/dañado','Protector o pantalla reemplazada','Configuración o actualización'], '¿El sensor permite registrar una huella/cara nueva?','¿Empezó después de cambiar pantalla o recibir un golpe?',['Limpiá el sensor y probá sin manos húmedas; no borres credenciales si no recordás el PIN.']],
      ['buttons','Botón de encendido o volumen falla',C.input,'hardware',['Flex o pulsador desgastado','Suciedad o golpe','Carcasa presionando el botón'], '¿El botón está hundido, duro o sin clic?','¿Funciona sólo al presionar fuerte o desde un ángulo?',['No fuerces el botón ni introduzcas líquidos limpiadores.']],
      ['sensors','Rotación, proximidad o vibración falla',C.input,'mixed',['Sensor o vibrador','Configuración/accesibilidad','Pantalla/protector o sistema'], '¿Falla más de un sensor a la vez?','¿Empezó después de una caída o cambio de pantalla?',['Reiniciá y revisá que la rotación automática esté habilitada.']],
      ['apps','Apps se cierran o muestran errores',C.system,'software',['Aplicación dañada o incompatible','Sistema desactualizado','Almacenamiento lleno'], '¿Falla una sola aplicación o varias?','¿Queda poco espacio libre en el teléfono?',['Reiniciá y actualizá la app desde la tienda oficial.','No borres datos de apps si necesitás conservar información.']],
      ['storage','Sin espacio / almacenamiento da errores',C.performance,'data',['Almacenamiento lleno','Archivos temporales o apps','Memoria interna degradada'], '¿El sistema marca menos de 10% de espacio libre?','¿Aparecen errores al guardar fotos o descargar archivos?',['Respaldá fotos y archivos importantes antes de limpiar o restablecer.']],
      ['account_lock','Problema con cuenta, PIN o activación',C.security,'software',['Credencial olvidada','Bloqueo de cuenta oficial','Restablecimiento/activación pendiente'], '¿Recordás la cuenta original asociada al equipo?','¿Tenés acceso al correo o teléfono de recuperación?',['Usá únicamente recuperación oficial de Google, Apple o fabricante.','No ofrecemos bypass de bloqueos de activación o antirrobo.']]
    ],
    tablet:[
      ['restart','Se reinicia o queda en el logo',C.system,'mixed',['Sistema o actualización','Batería/alimentación','Almacenamiento o placa'],'¿Reinicia varias veces antes de llegar al inicio?','¿Empezó después de actualizar o instalar algo?',['Probá reinicio normal; evitá restablecer si hay datos importantes.']],
      ['overheat','Se calienta demasiado',C.cooling,'mixed',['Apps/procesos','Batería degradada','Carga o placa'],'¿Se calienta incluso en reposo?','¿Se apaga o muestra aviso de temperatura?',['Desconectá el cargador y dejala enfriar naturalmente.']],
      ['touch','Táctil no responde o toca solo',C.display,'hardware',['Digitalizador/módulo','Golpe o humedad','Cargador/interferencia'],'¿Hay zonas específicas sin respuesta?','¿Pasa también sin estar cargando?',['Probá sin cargador y con pantalla limpia y seca.']],
      ['wifi','Wi‑Fi no conecta o se corta',C.connect,'mixed',['Red/configuración','Antena Wi‑Fi','Sistema o placa'],'¿Otros equipos funcionan bien en esa red?','¿La tablet falla también en otra red?',['Probá otra red y reiniciá antes de restablecer configuraciones.']],
      ['bluetooth','Bluetooth no conecta',C.connect,'mixed',['Emparejamiento','Accesorio','Módulo inalámbrico'],'¿Falla con distintos accesorios?','¿Bluetooth se puede activar y queda encendido?',['Eliminá y repetí el emparejamiento con un accesorio conocido.']],
      ['speaker','Parlante bajo, distorsionado o sin sonido',C.audio,'hardware',['Parlante','Rejilla/suciedad','Humedad o audio'],'¿Falla en videos y notificaciones?','¿Empezó después de líquido o golpe?',['Probá distintos volúmenes; no introduzcas objetos en la rejilla.']],
      ['microphone','Micrófono no funciona',C.audio,'mixed',['Micrófono','Permisos','Humedad/circuito'],'¿Falla al grabar audio?','¿Funciona con auriculares con micrófono?',['Grabá una nota de voz para comparar.']],
      ['camera','Cámara falla o no enfoca',C.camera,'mixed',['App/permisos','Módulo de cámara','Golpe o sistema'],'¿Falla frontal y trasera?','¿La imagen vibra o aparece negra?',['Reiniciá y probá desde la aplicación de cámara original.']],
      ['buttons','Botones físicos fallan',C.input,'hardware',['Flex/pulsadores','Carcasa o golpe','Suciedad'],'¿Algún botón quedó hundido o duro?','¿Funciona sólo presionando fuerte?',['No fuerces los pulsadores.']],
      ['apps','Apps se cierran o fallan',C.system,'software',['Aplicación','Sistema','Poco espacio'],'¿Falla una sola app o varias?','¿Hay poco espacio disponible?',['Actualizá desde tiendas oficiales y reiniciá.']],
      ['storage','Almacenamiento lleno o con errores',C.performance,'data',['Espacio agotado','Archivos temporales','Memoria interna'],'¿Está casi lleno el almacenamiento?','¿Falla al guardar o copiar archivos?',['Respaldá datos importantes antes de limpiar o restablecer.']],
      ['stylus','Lápiz / stylus no responde',C.input,'mixed',['Lápiz sin carga o punta','Compatibilidad/emparejamiento','Digitalizador de pantalla'],'¿El lápiz funciona en otra zona de la pantalla?','¿Es el lápiz original o compatible con el modelo?',['Cargá/emparejá el lápiz según el fabricante antes de asumir falla de pantalla.']],
      ['rotation','No gira la pantalla / sensores fallan',C.input,'mixed',['Rotación bloqueada','Sensor','Sistema'],'¿La rotación automática está habilitada?','¿Otras apps detectan la orientación?',['Revisá rotación automática y reiniciá.']],
      ['usb_accessory','No reconoce USB, teclado o accesorio',C.input,'mixed',['Puerto USB‑C/Lightning','Adaptador/OTG','Compatibilidad o sistema'],'¿El accesorio funciona en otro equipo?','¿La tablet carga normalmente por ese puerto?',['Probá otro cable/adaptador compatible sin forzar el puerto.']],
      ['account_lock','Problema con cuenta o activación',C.security,'software',['Credencial olvidada','Cuenta oficial bloqueada','Activación posterior a restablecimiento'],'¿Recordás la cuenta originalmente asociada?','¿Tenés acceso a recuperación de esa cuenta?',['Usá recuperación oficial del fabricante; no se realizan bypass antirrobo.']]
    ],
    notebook:[
      ['battery','Batería dura poco, no carga o se hincha',C.battery,'hardware',['Batería degradada','Cargador/gestión de energía','Batería hinchada'],'¿La batería baja muy rápido o se apaga al desconectar el cargador?','¿La carcasa, touchpad o base se está levantando?',['Si hay hinchazón, apagá y dejá de cargar el equipo.'],true],
      ['restart_bsod','Pantalla azul, reinicios o errores',C.system,'mixed',['Controladores/sistema','RAM','Disco, temperatura o hardware'],'¿Aparece pantalla azul o un código de error?','¿Pasa más al abrir programas pesados?',['Anotá o fotografiá el código de error; no formatees antes de revisar datos.']],
      ['storage_disk','Disco/SSD lento, no aparece o da errores',C.performance,'data',['SSD/HDD degradado','Conexión del disco','Sistema de archivos'],'¿Escuchás clics o ruidos mecánicos si tiene HDD?','¿BIOS o Windows a veces deja de detectar la unidad?',['Si hay ruidos o datos importantes, evitá seguir escribiendo en el disco.']],
      ['ram_freeze','Se congela o falla la memoria RAM',C.components,'mixed',['RAM defectuosa','Módulo mal asentado','Sistema/controlador'],'¿Se congela incluso haciendo tareas simples?','¿El problema apareció después de ampliar memoria?',['No abras el equipo si no estás habituado; registrá cuándo ocurre el congelamiento.']],
      ['wifi','Wi‑Fi no conecta o tiene poca señal',C.connect,'mixed',['Controlador/configuración','Antena','Módulo Wi‑Fi'],'¿Otros equipos funcionan bien en la misma red?','¿La notebook falla también cerca del router?',['Probá otra red y reiniciá router/notebook antes de reinstalar controladores.']],
      ['bluetooth','Bluetooth no detecta dispositivos',C.connect,'mixed',['Controlador','Emparejamiento','Módulo inalámbrico'],'¿Falla con más de un dispositivo?','¿Bluetooth aparece disponible en el sistema?',['Quitá y repetí el emparejamiento.']],
      ['audio','No hay sonido o distorsiona',C.audio,'mixed',['Salida/configuración','Parlantes','Controlador/circuito'],'¿Con auriculares sí hay sonido?','¿Windows muestra un dispositivo de audio?',['Revisá dispositivo de salida y volumen antes de instalar nada.']],
      ['webcam','Cámara web no funciona',C.camera,'mixed',['Privacidad/permisos','Controlador','Módulo/cable de cámara'],'¿Falla en todas las aplicaciones?','¿La notebook tiene obturador físico de privacidad cerrado?',['Revisá tapa de privacidad y permisos de cámara.']],
      ['microphone','Micrófono no funciona',C.audio,'mixed',['Permisos/nivel de entrada','Micrófono','Controlador'],'¿El medidor de entrada detecta sonido?','¿Funciona un micrófono externo?',['Revisá permisos y dispositivo de entrada.']],
      ['touchpad','Touchpad no responde o hace clic solo',C.input,'mixed',['Touchpad deshabilitado','Controlador','Cable/touchpad o batería hinchada'],'¿Funciona un mouse USB normalmente?','¿El touchpad está levantado o deformado?',['Si está levantado, apagá: puede haber batería hinchada.']],
      ['usb','Puertos USB no funcionan',C.input,'mixed',['Puerto físico','Controlador USB','Alimentación/placa'],'¿Falla un solo puerto o todos?','¿El dispositivo USB funciona en otra computadora?',['Probá un periférico simple conocido; no fuerces conectores doblados.']],
      ['hdmi','HDMI / salida de video no funciona',C.display,'mixed',['Cable/pantalla externa','Configuración de video','Puerto/GPU'],'¿Probaste otro cable o pantalla?','¿Windows detecta una segunda pantalla?',['Probá otro cable y la combinación de pantalla del sistema.']],
      ['fan_noise','Ventilador hace ruido',C.cooling,'hardware',['Suciedad','Ventilador desgastado','Objeto/rozamiento'],'¿El ruido cambia al inclinar la notebook?','¿También aumenta la temperatura?',['Apagá si hay roce fuerte; no soples con compresor a alta presión.']],
      ['hinge','Bisagra, carcasa o tapa rota',C.physical,'hardware',['Bisagra endurecida','Anclajes quebrados','Golpe/desgaste'],'¿La carcasa se separa al abrir la tapa?','¿La bisagra está muy dura o hace crujidos?',['Evitá seguir abriendo/cerrando si la carcasa se separa.']],
      ['liquid','Se derramó líquido',C.physical,'urgent',['Humedad/corrosión','Teclado/placa','Cortocircuito'],'¿La notebook estaba encendida o conectada al cargador al mojarse?','¿El líquido era azucarado, café o bebida?',['Apagala, desconectá cargador y no intentes encenderla para probar.'],true],
      ['malware','Virus, publicidad o ventanas extrañas',C.system,'software',['Adware/malware','Extensión o programa no deseado','Navegador/notificaciones'],'¿Aparecen anuncios aun sin abrir el navegador?','¿Se instalaron programas recientemente?',['No ingreses contraseñas sensibles hasta revisar el sistema.']],
      ['account_login','No puedo iniciar sesión en Windows/macOS',C.security,'software',['Contraseña/PIN','Cuenta Microsoft/Apple','Perfil o sistema'],'¿Tenés acceso al correo/teléfono de recuperación?','¿El equipo muestra opción oficial de recuperar contraseña?',['Usá recuperación oficial de la cuenta; no se realizan bypass de credenciales.']],
      ['sleep','No suspende o no despierta',C.system,'mixed',['Configuración de energía','Controlador','BIOS/firmware'],'¿La pantalla queda negra pero el equipo sigue encendido?','¿Pasa sólo después de cerrar la tapa?',['Forzá apagado sólo si no responde y no hay actividad de disco visible.']],
      ['ethernet','Red por cable no funciona',C.connect,'mixed',['Cable/router','Controlador Ethernet','Puerto de red'],'¿El mismo cable funciona en otro equipo?','¿El puerto muestra luces de enlace?',['Probá otro cable y puerto del router.']],
      ['bios_boot','No encuentra sistema / entra a BIOS',C.system,'data',['Orden de arranque','SSD/HDD no detectado','Sistema de arranque dañado'],'¿La unidad de almacenamiento aparece en BIOS?','¿Hay archivos importantes que necesitás conservar?',['No reinstales ni formatees si hay datos importantes.']]
    ],
    pc:[
      ['overheat','Se calienta demasiado',C.cooling,'hardware',['Suciedad/disipación','Pasta térmica','Ventiladores o flujo de aire'],'¿Las temperaturas suben sobre todo al jugar o renderizar?','¿Los ventiladores giran y expulsan aire?',['Apagá si hay temperatura extrema; no toques disipadores calientes.']],
      ['bsod','Pantalla azul / errores críticos',C.system,'mixed',['RAM/controladores','Disco','GPU, temperatura o placa'],'¿Aparece un código de pantalla azul?','¿Empezó después de instalar hardware o controladores?',['Fotografiá el código antes de reiniciar o formatear.']],
      ['freeze','Se congela',C.performance,'mixed',['RAM','Disco','Temperatura, sistema o fuente'],'¿El mouse y teclado también dejan de responder?','¿Ocurre más bajo carga?',['Registrá qué programa estaba abierto; evitá cortes de energía repetidos.']],
      ['gpu_artifacts','Rayas, cuadrados o fallas gráficas',C.display,'hardware',['GPU/VRAM','Cable/monitor','Temperatura o alimentación de GPU'],'¿Los artefactos aparecen también antes de entrar a Windows?','¿Pasan con otro monitor/cable?',['Si hay olor o temperatura anormal, apagá la PC.']],
      ['storage','Disco/SSD lento o con errores',C.performance,'data',['Unidad degradada','Sistema de archivos','Cable SATA/alimentación'],'¿Hay ruidos de clic en un HDD?','¿Aparecen errores al copiar archivos?',['Respaldá datos importantes; no desfragmentes un SSD ni fuerces un disco con ruidos.']],
      ['ram','RAM / memoria da errores',C.components,'mixed',['Módulo RAM','Compatibilidad/perfil XMP','Slot o placa'],'¿Los fallos empezaron después de cambiar o ampliar RAM?','¿Hay reinicios o pantallas azules aleatorias?',['No manipules módulos con la PC conectada a la red eléctrica.']],
      ['ethernet','Internet por cable no funciona',C.connect,'mixed',['Cable/router','Controlador','Puerto de red'],'¿El cable funciona en otro equipo?','¿Hay luces en el conector Ethernet?',['Probá otro cable y otro puerto del router.']],
      ['wifi','Wi‑Fi falla',C.connect,'mixed',['Adaptador/controlador','Antena','Configuración/red'],'¿Otros equipos navegan en esa red?','¿El adaptador Wi‑Fi aparece en el sistema?',['Probá otra red antes de reemplazar hardware.']],
      ['bluetooth','Bluetooth falla',C.connect,'mixed',['Adaptador','Controlador','Emparejamiento'],'¿Falla con varios accesorios?','¿Bluetooth aparece en configuración?',['Volvé a emparejar un dispositivo conocido.']],
      ['audio','Sin audio / audio distorsionado',C.audio,'mixed',['Salida seleccionada','Controlador','Jack/placa de sonido'],'¿Con auriculares también falla?','¿El sistema detecta el dispositivo de audio?',['Revisá salida predeterminada y volumen.']],
      ['usb','USB no reconoce dispositivos',C.input,'mixed',['Puerto','Controlador','Alimentación/placa'],'¿Falla un puerto o todos?','¿El periférico funciona en otra PC?',['Probá otro periférico simple; no fuerces puertos dañados.']],
      ['fan_noise','Ventiladores hacen ruido',C.cooling,'hardware',['Suciedad','Rodamiento gastado','Cable rozando aspas'],'¿El ruido aparece desde que encendés?','¿Cambia con la carga o temperatura?',['Apagá antes de inspeccionar visualmente; no introduzcas objetos con ventiladores girando.']],
      ['burning_smell','Olor a quemado, chispazo o humo',C.power,'urgent',['Fuente de alimentación','Cable/conector recalentado','Componente en corto'],'¿Sentiste olor a quemado, viste humo o un chispazo?','¿Ocurrió al conectar un periférico o después de un corte eléctrico?',['Desenchufá la PC de la pared y no vuelvas a encenderla hasta revisarla.'],true],
      ['malware','Virus, publicidad o comportamiento extraño',C.system,'software',['Malware/adware','Programa no deseado','Cuenta o navegador comprometido'],'¿Aparecen ventanas o publicidad sin abrir el navegador?','¿El antivirus muestra detecciones?',['No ingreses claves bancarias o sensibles hasta revisar el equipo.']],
      ['bios_boot','No inicia / entra a BIOS / no encuentra disco',C.system,'data',['Disco no detectado','Orden de arranque','Sistema dañado'],'¿El disco aparece listado en BIOS/UEFI?','¿Necesitás recuperar archivos antes de reinstalar?',['No formatees si necesitás datos.']],
      ['data_recovery','Archivos borrados o disco inaccesible',C.data,'data',['Borrado accidental','Sistema de archivos','Unidad con falla física'],'¿Los archivos fueron borrados recientemente?','¿El disco hace ruidos o se desconecta?',['Dejá de escribir datos en esa unidad para no sobrescribir información recuperable.']],
      ['peripherals','Teclado o mouse falla',C.input,'mixed',['Periférico','USB/Bluetooth','Controlador o sistema'],'¿El periférico funciona en otra PC?','¿Otro teclado/mouse funciona en esta PC?',['Probá otro puerto y un periférico conocido.']],
      ['upgrade','Quiero mejorar la PC / compatibilidad',C.components,'inspection',['RAM/SSD insuficiente','GPU o fuente','Compatibilidad placa/CPU'], '¿Buscás más velocidad general, juegos o trabajo pesado?','¿Sabés modelo de placa madre, procesador y fuente?',['No compres componentes sólo por formato físico: hay que verificar compatibilidad y potencia.']]
    ]
  };

  // Metadatos para las fallas que ya existían.
  const existing={
    phone:{no_power:[C.power,'inspection',['Probá otro cable/cargador conocido sin forzar el puerto.']],charge:[C.power,'hardware',['Probá otro cable y cargador compatibles.']],screen:[C.display,'hardware',['Si el vidrio está roto, evitá presionar el panel.']],battery:[C.battery,'hardware',['Si está hinchado, dejá de cargarlo.']],water:[C.physical,'urgent',['No lo cargues ni intentes encenderlo.']],slow:[C.performance,'mixed',['Revisá espacio libre y reiniciá antes de borrar datos.']]},
    tablet:{no_power:[C.power,'inspection',[]],charge:[C.power,'hardware',[]],screen:[C.display,'hardware',[]],battery:[C.battery,'hardware',[]],slow:[C.performance,'mixed',[]]},
    notebook:{no_power:[C.power,'inspection',[]],overheat:[C.cooling,'hardware',[]],slow:[C.performance,'mixed',[]],screen:[C.display,'hardware',[]],charge:[C.power,'hardware',[]],keyboard:[C.input,'hardware',[]]},
    pc:{no_power:[C.power,'inspection',[]],no_image:[C.display,'mixed',[]],slow:[C.performance,'mixed',[]],restart:[C.system,'mixed',[]],windows:[C.system,'software',[]]}
  };
  Object.entries(existing).forEach(([dev,defs])=>Object.entries(defs).forEach(([key,m])=>{const s=DIAG_DATA[dev].symptoms[key];if(s){s.category=m[0];s.route=m[1];s.safeChecks=m[2]||[];}}));

  Object.entries(E).forEach(([dev,list])=>{
    const symptoms=DIAG_DATA[dev].symptoms;
    const other=symptoms.other; if(other) delete symptoms.other;
    list.forEach(x=>{const [key,label,cat,route,causes,q1,q2,checks,urgent]=x;symptoms[key]=make(key,label,cat,route,causes,q1,q2,checks,urgent);});
    if(other){other.category='Otro';other.route='inspection';other.safeChecks=[];symptoms.other=other;}
  });

  const totalPredefined=Object.values(DIAG_DATA).reduce((n,d)=>n+Object.keys(d.symptoms).filter(k=>k!=='other').length,0);
  const totalQuestions=Object.values(DIAG_DATA).reduce((n,d)=>n+Object.entries(d.symptoms).filter(([k])=>k!=='other').reduce((a,[,s])=>a+(s.questions?.length||0),0),0);
  window.NF_DIAG_STATS={predefined:totalPredefined,routes:totalPredefined+Object.keys(DIAG_DATA).length,questions:totalQuestions};

  // Tarjetas con categoría y texto indexable.
  symptomButton=function(key,s){
    const cat=s.category||'Diagnóstico';
    const search=[s.label,cat,...(s.causes||[])].join(' ').toLowerCase();
    return `<button class="symptom-choice" data-diag-symptom="${key}" data-nf-key="${key}" data-nf-cat="${diagEsc(cat)}" data-nf-search="${diagEsc(search)}"><span class="nf-symptom-cat">${diagEsc(cat)}</span><b>${diagEsc(s.label)}</b><small>${s.inspection?'Diagnóstico orientativo · puede requerir revisión física.':`Referencia orientativa: ${diagEsc(s.price)}`}</small></button>`;
  };

  function setupBrandList(device){
    const input=document.getElementById('diagBrand'); if(!input)return;
    input.setAttribute('list','nfBrandList');
    let dl=document.getElementById('nfBrandList');
    if(!dl){dl=document.createElement('datalist');dl.id='nfBrandList';document.body.appendChild(dl);}
    dl.innerHTML=(BRANDS[device]||[]).map(x=>`<option value="${diagEsc(x)}"></option>`).join('');
    input.placeholder=`Ej: ${(BRANDS[device]||[]).slice(0,3).join(', ')}`;
  }
  function setupFilters(device){
    setupBrandList(device);
    document.getElementById('nfDiagTools')?.remove();
    const grid=document.getElementById('diagSymptoms'); if(!grid)return;
    const cats=[...new Set(Object.values(DIAG_DATA[device].symptoms).map(s=>s.category||'Diagnóstico'))];
    const tools=document.createElement('div');tools.id='nfDiagTools';tools.className='nf-diag-tools';
    tools.innerHTML=`<div class="nf-coverage"><b>${totalPredefined} problemas guiados</b><span>${totalQuestions} preguntas posibles · + consulta libre</span></div><div class="nf-search"><input id="nfSymptomSearch" placeholder="Buscar síntoma: cámara, Wi‑Fi, se apaga, USB, pantalla…" autocomplete="off"></div><div class="nf-chips"><button type="button" class="nf-chip active" data-cat="all">Todos</button>${cats.filter(x=>x!=='Otro').map(x=>`<button type="button" class="nf-chip" data-cat="${diagEsc(x)}">${diagEsc(x)}</button>`).join('')}</div><div id="nfFilterCount" class="nf-filter-count"></div>`;
    grid.parentNode.insertBefore(tools,grid);
    let cat='all',term='';
    const apply=()=>{
      let visible=0;
      grid.querySelectorAll('.symptom-choice').forEach(b=>{
        const isOther=b.dataset.nfKey==='other';
        const okCat=cat==='all'||b.dataset.nfCat===cat;
        const okTerm=!term||(b.dataset.nfSearch||'').includes(term);
        const show=isOther||(okCat&&okTerm);b.classList.toggle('hidden',!show);if(show&&!isOther)visible++;
      });
      const count=document.getElementById('nfFilterCount');if(count)count.textContent=`${visible} coincidencia${visible===1?'':'s'} + “Otro problema”`;
    };
    tools.querySelector('#nfSymptomSearch').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();apply();});
    tools.querySelectorAll('.nf-chip').forEach(b=>b.addEventListener('click',()=>{tools.querySelectorAll('.nf-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');cat=b.dataset.cat;apply();}));
    apply();
  }
  document.querySelectorAll('[data-diag-device]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>setupFilters(btn.dataset.diagDevice),0)));

  function decorateResult(){
    const root=document.querySelector('#diagResultCard .diag-result'); if(!root)return;
    const s=DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom];if(!s||diagState.symptom==='other')return;
    root.querySelector('.nf31-guidance')?.remove();
    const r=ROUTE[s.route]||ROUTE.inspection;
    const checks=(s.safeChecks||[]);
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const box=document.createElement('div');box.className='nf31-guidance';
    box.innerHTML=`<div><small>ORIENTACIÓN DEL DIAGNÓSTICO</small><strong>${diagEsc(r[0])}</strong><p>${diagEsc(r[1])}</p>${brand||model?`<span class="nf-equipment-tag">${diagEsc([brand,model].filter(Boolean).join(' '))}</span>`:''}</div><div><small>PRUEBAS SEGURAS ANTES DE TRAERLO</small>${checks.length?`<ul>${checks.map(x=>`<li>${diagEsc(x)}</li>`).join('')}</ul>`:'<p>En este caso no conviene hacer más pruebas caseras: coordiná una revisión.</p>'}<p class="nf-safety-note">Sólo pruebas externas y reversibles. No abras el equipo, no uses calor, no puentes contactos y no fuerces conectores.</p></div>`;
    const top=root.querySelector('.diag-result-top');if(top)top.insertAdjacentElement('afterend',box);else root.prepend(box);
  }
  document.getElementById('diagCalculate')?.addEventListener('click',()=>setTimeout(decorateResult,0));

  // Muestra la cobertura desde el primer paso sin ocupar demasiado espacio.
  const deviceStage=document.getElementById('diagDeviceStage');
  if(deviceStage&&!document.getElementById('nfDiagCoverageIntro')){
    deviceStage.insertAdjacentHTML('beforeend',`<div id="nfDiagCoverageIntro" class="nf-coverage-intro"><b>${totalPredefined} problemas guiados</b><span>${totalQuestions} preguntas de diagnóstico disponibles según el caso, además de “Otro problema”.</span></div>`);
  }
})();