# WORKPLAN: VILLA SERA DIGITAL GUEST GUIDE
## Objetivo técnico para Cursor / Engine de IA
Transformar este documento en un único archivo de producción (`index.html`) con CSS embebido que emule un libro o revista editorial de lujo (Clean design, minimalista, tipografía serif, sin animaciones ni emojis). El diseño debe estar optimizado para pantallas web y configurado con reglas `@media print` para que, al exportarse a PDF, el salto de página sea limpio y profesional.

---

## FASE 1: ARQUITECTURA DE DISEÑO & CSS (Sistemas Estéticos)
* **Contenedor Editorial:** Centrado, ancho máximo de `800px`, márgenes laterales amplios (`60px 40px`).
* **Paleta de Colores:** Fondo `#ffffff`, texto principal `#1a1a1a`, textos secundarios / metadatos `#666666`, líneas divisorias `#e0e0e0` o `#1a1a1a`. Cero colores encendidos.
* **Tipografía:** Fuentes Serif clásicas (`"Times New Roman"`, `Times`, `Georgia`, `serif`) para el cuerpo y títulos. Tipografía Sans-serif limpia (`Arial`, `Helvetica`) únicamente para etiquetas técnicas o datos muy específicos.
* **Manejo de Imágenes (Media Placeholders):** Crear contenedores `<div>` con clases específicas para fotografía de arquitectura (`.photo-box`). Fondo gris ultra claro (`#f9f9f9`), bordes limpios o sutiles, y un texto en mayúsculas que indique qué foto va ahí (ej. `[ FOTO: ENTRADA PRINCIPAL Y FACHADA ]`). Esto permitirá arrastrar las fotos reales directamente al código después.
* **Reglas de Impresión (`@media print`):** * Forzar `page-break-before: always;` en secciones principales.
    * Evitar cortes a la mitad en tablas (`page-break-inside: avoid;`) y cajas de alerta.

---

## FASE 2: INYECCIÓN DE CONTENIDO REVISADO (Estructura de Texto)

### 00. AT A GLANCE (Ubicación y Logística Base)
* **Datos Críticos:** Casa 504, Vía de Cañadas. Comunidad con seguridad privada 24 hrs. Estacioamiento para 2 autos (se entrega control de garage). Entrada Principal y Entrada de Servicio.
* **Bloque Visual:** Insertar espacio para Foto 01 (Fachada / Entrada).

### 01. CONTACTS & GUEST SERVICES (El Equipo)
* **Marlon Alexis Herrera (House Manager):** Coordinación general y soporte técnico. Enfoque diurno/asistencia oportuna (eliminar el término "24/7" para acotar expectativas, pero mantener disponibilidad para prioridades).
* **Personal de Apoyo:** Chef de Cuisine (menús personalizados de Baja) y Cecilia Velázquez (Housekeeping).
* **Módulo Concierge Pre-Arrival:** Texto limpio sobre cómo gestionar súper (groceries pre-arrival a costo), transportación, yates, masajes, etc., a través de Marlon Alexis.

### 02. PROPERTY LAYOUT & SUITES (Distribución Real de Camas)
* **Piso Principal (Main Level):** Sala de doble altura, Comedor (8 personas), Cocina Principal (equipada para montaje profesional), Lavandería y la **Master Suite (Cama King Size)** con tina, regadera y walk-in closet.
* **Nivel Inferior (Suites & Media):**
    * Recámara 2: Cama King Size.
    * Recámara 3: Cama King Size.
    * Recámara 4: Cama Queen Size.
    * Cuarto de TV: Smart TV de 55" con Fire TV Stick (plataformas premium y canales en vivo). Cuenta con **Sofá Cama** (especificar que las sábanas y ropa de cama complementaria están en el clóset del lado izquierdo al entrar).
* **Restricción Técnica:** Al entrar de la cochera a la derecha está el Pantry de la casa. Explicar claramente que se mantiene cerrado con llave y no se da acceso a los clientes.
* **Bloque Visual:** Espacio para Foto 02 (Áreas Comunes / Estancia).

### 03. CLIMATE CONTROL (Uso del Aire Acondicionado)
* **Zona 01 (Áreas Comunes - Piso Principal):** Termostato digital al lado izquierdo del Bar (controla Cocina Principal, Sala, Comedor y Pasillo de Entrada). Sugerido: 22°C, modo *Cool*, ventilador en *Auto*.
* **Zona 02 (Master Suite):** Termostato en la pared frente a la cama (controla cuarto, baño y walk-in closet). Sugerido: 21°C.
* **Minisplits Independientes:** Controles en burós para Recámaras 2 y 3. Control de Recámara 4 dentro del cajón del buró (modo copo de nieve). Control del Cuarto de TV colgado en la pared junto a la puerta.
* **Nota de Confort:** Mencionar que todos los cuartos tienen mosquiteros por si prefieren apagar el AC y dormir escuchando las olas del mar.

### 04. PROPERTY SYSTEMS & INFRASTRUCTURE (Sistemas de la Casa)
* **Internet WiFi:** Red `VillaSera_Guest` / Contraseña `Villa Sera2025`. Ubicación física del router: En el mueble de la cocina principal, arriba de la cafetera Nespresso (instrucciones de reset de 30 segundos).
* **Audio Sonos:** Explicar métodos de conexión (App Sonos y AirPlay directo) y la distribución de bocinas.
* **Planta de Emergencia (Generador eléctrico):** Explicar que ante un apagón se activa solo y respalda todo el piso de arriba (Master, cocina, sala). **Restricción crítica:** Los aires acondicionados de los cuartos de abajo (2, 3, 4 y TV room) *no* se energizan con el generador para cuidar la carga.
* **Estación de Lavado:** Manual rápido para la torre vertical de lavado/secado LG (color negra, ubicada en lavandería).

### 05. KITCHEN & WATER MANAGEMENT (Operación de Servicios)
* **Plomería Sanitaria (Callout de Alerta):** Prohibido tirar toallitas húmedas (baby wipes) o productos higiénicos al toilet. Usar botes de basura obligatoriamente.
* **Agua e Insumos:** Recordar que el agua del grifo no es para beber. Uso del dispensador. Recolección de basura (Lunes, Miércoles y Viernes) usando bolsas negras obligatorias debajo del fregadero para los botes exteriores.

### 06. OUTDOOR LIVING, POOL & JACUZZI (Terraza y Descanso)
* **Alberca y Chapoteadero:** Profundidad de 1.2m a 1.8m. Regla de cero vidrio.
* **Alerta de Seguridad:** Disclaimer visual de tener cuidado al bajar las escaleras a la alberca por el cambio de nivel pronunciado.
* **Operación Obligatoria del Jacuzzi:** Explicar el apagado mandatorio. Al terminar de usarlo, el huésped debe ir al interior de la **Recámara 2**, y a mano derecha apagar la caldera (apagar tanto *Jets* como *Heater*).
* **Cocina de la Alberca (Cocina 2):** Detallar que la alberca tiene su propia cocina completa con refrigerador, tarja (sink) y trastes independientes. El carbón y aditamentos del asador Weber se guardan aquí dentro.

### 07. FITNESS & PRIVATE BEACH ACCESS (Gimnasio y Mar)
* **Caminadora:** Ubicada con vista al mar. Instrucciones estrictas de limpieza post-entrenamiento (solución especial de agua y jabón neutro en el atomizador del estante) y la **obligación** de colocarle la cubierta protectora impermeable inmediatamente después para protegerla del aire salino.
* **Playa Privada & Disclaimer:** Escaleras de piedra a la derecha, regadera de enjuague arriba. Añadir un *Beach Disclaimer* elegante: la playa es nadable pero el Mar de Cortés es complejo, el nado es bajo su propio riesgo y discreción.

### 08. LOCAL GUIDE & EXPERIENCES (Entorno)
* **Amenidades Incluidas:** Detallar la línea de jabón de baño, body wash, body lotion, shampoo y acondicionador provistos.
* **Comercios de Proximidad:** Distancias en auto a La Comer (Plaza Las Glorias - 12 min), Soriana 24 hrs (10 min), Costco (15 min), Farmacias del Ahorro 24 hrs con médico (8 min) y La Europea (12 min).
* **Restaurantes del Momento:** Comal, Helios, Rosa Negra, Jerry's, Nick-San, Manta, El Farallon y Sunset Monalisa.

### 09. CHECK-OUT CHECKLIST (Salida)
* Puntos ordenados de salida antes de las 12:00 PM: Devolución de controles (TVs, ACs, Reja alberca, Garage), cierre de sesiones de streaming en pantallas TCL, asegurar hermeticidad de ventanas y embolsado de basura.

---

## FASE 3: PROTOCOLO DE REVISIÓN Y GENERACIÓN (Instrucciones para Cursor)
1.  **Generación de Archivos:** Crea el archivo `index.html`. Coloca todo el CSS dentro de la etiqueta `<style>` en el `<head>`.
2.  **Validación de Bloques:** Revisa que cada advertencia crítica (`baby wipes`, `cubierta de caminadora`, `apagado de caldera en cuarto 2`, `restricción del generador`) use la clase `.notice-box.critical` para una separación limpia y elegante.
3.  **Marcadores de Imagen:** Asegúrate de dejar los divs `.photo-box` vacíos con su texto guía bien alineado para la posterior inserción de imágenes por ruta local o URLs estáticas.