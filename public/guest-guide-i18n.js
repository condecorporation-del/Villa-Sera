/**
 * Villa Sera guest guide — bilingual copy (default: English).
 */
(function () {
  'use strict';

  var DICT = {
    en: {
      meta_title: 'Villa Sera · Guest Guide',
      meta_description: 'Your private welcome guide to Villa Sera, Los Cabos.',
      nav_menu_aria: 'Menu',
      nav_menu_btn: 'Menu',
      nav_bienvenida: 'Welcome',
      nav_esencial: 'Essentials',
      nav_mantenimiento: 'Scheduled visits',
      nav_staff: 'Your team',
      nav_villa: 'The villa',
      nav_servicios: 'Add-ons',
      nav_guia: 'Local guide',
      nav_reglas: 'House rules',
      hero_eyebrow: 'Welcome to',
      hero_subtitle: 'Your private guest guide · Los Cabos, Mexico',
      welcome_eyebrow: 'Personal note',
      welcome_title: 'A welcome from Marlon Alexis Herrera',
      welcome_quote:
        '"It is an honor to host you at Villa Sera. This is your home for your stay — every space, every service, and every sunset is here for you to enjoy. Please reach out for anything at all. We are here to make this an experience you will never forget."',
      welcome_note:
        'Our team is available 24/7 — from restaurant recommendations to coordinating a private Arch tour.',
      welcome_card_title: 'Your stay at a glance',
      welcome_checkin: 'Check-in',
      welcome_checkout: 'Check-out',
      welcome_early_label: 'Early / late',
      welcome_early_val: 'Ask the team',
      welcome_capacity_label: 'Max. occupancy',
      welcome_capacity_val: '8 guests',
      welcome_emergency: 'Emergency contact: +52 624 217 5935',
      esencial_eyebrow: 'Good to know',
      esencial_title: 'Essential information',
      card_wifi_net: 'Network: VillaSera_Guest',
      card_ac_t: 'Air conditioning',
      card_ac_b:
        'The villa has <strong>two control displays</strong>. The display <strong>at the bar</strong> controls air conditioning for the <strong>living room, kitchen, bar, entrance</strong>, and other shared areas. The second display is in the <strong>master bedroom</strong>. You can adjust temperature <strong>from each display or from your phone</strong>. Recommended: 22°C. Please switch off when leaving.',
      card_tv_t: 'Entertainment',
      card_tv_b:
        'Smart TVs in the living room and bedrooms with Netflix and Apple TV. Sonos on the terrace — ask the Villa Sera team to help you connect.',
      card_park_t: 'Parking',
      card_park_b:
        'Private space for 2 vehicles in front of the villa. The gate opens with the remote at reception.',
      card_loc_t: 'Location',
      card_loc_b:
        'Villa Sera is in Cabo San Lucas, Baja California Sur. Use the link below for turn-by-turn directions.',
      card_loc_link: 'Open in Google Maps',
      card_housekeeping_t: 'Housekeeping',
      card_housekeeping_b:
        'During your stay, the villa is cleaned only when you request the service. Cleaning is $60 USD per service. Please request at least 24 hours in advance.',
      card_trash_t: 'Trash',
      card_trash_b:
        'Pickup on Mondays, Wednesdays, and Fridays. We separate organic and recycling — thank you for helping us care for Los Cabos.',
      maint_eyebrow: 'Property access',
      maint_title: 'Scheduled maintenance',
      maint_intro:
        'For your comfort and security, we will notify you in advance whenever authorized staff need to be on the property.',
      maint_tue_day: 'Tuesday',
      maint_tue_t: 'Landscaping',
      maint_tue_b:
        'The gardener enters on Tuesdays to care for gardens and outdoor areas. <strong style="color:#F8F4EF">You will be notified in advance</strong> before each visit.',
      maint_fri_day: 'Friday',
      maint_fri_t: 'Pool & hot tub service',
      maint_fri_b:
        'On Fridays, pool and hot tub maintenance ensures water quality and equipment are in top condition. We will also let you know ahead of time when this service takes place.',
      staff_eyebrow: 'Your hosts',
      staff_title: 'Your dedicated team',
      staff_intro: 'We are here to make your stay perfect — 24 hours a day.',
      staff_vs_name: 'Marlon Alexis Herrera',
      staff_vs_role: 'House manager',
      staff_vs_desc:
        'Your on-site house manager and main contact around the clock: reservations, general questions, and coordinating add-on services.',
      staff_ch_name: 'Private chef',
      staff_ch_role: 'Chef de cuisine',
      staff_ch_desc:
        'Available for breakfast, lunch, and private dinners. Please share dietary preferences and restrictions in advance.',
      staff_hk_name: 'Cecilia Velazques',
      staff_hk_role: 'Housekeeper',
      staff_hk_desc:
        'Keeps Villa Sera immaculate during your stay — daily tidying, linens, and details. Share preferred times or special requests.',
      wa_btn: 'WhatsApp',
      esp_eyebrow: 'Private tour',
      esp_title: 'Explore your villa',
      esp_intro:
        'A curated visual tour of the residence — terraces, ocean, and interior living.',
      photo_alt: 'Villa Sera, Los Cabos — property photography',
      acc1_t: 'Pool, hot tub & main terrace',
      acc1_b:
        'The main terrace faces the Sea of Cortez and the Arch of Cabo San Lucas. The pool and hot tub are available 24/7. Water temperature: 28°C. Loungers and towels are always ready.',
      acc2_t: 'Private beach',
      acc2_b:
        'From the villa, take the private stone staircase on the right — your exclusive path down to the sand. The beach is fully private and swimmable. Snorkel gear, kayaks, and paddleboards — ask the Villa Sera team. Tide times at reception.',
      acc3_t: 'Outdoor dining',
      acc3_b:
        'Under the colonial arches with ocean views. Seats up to 8. Perfect for sunset dinners with a private chef. Please book at least 4 hours ahead.',
      acc4_t: 'Main living room',
      acc4_b:
        'Double-height lounge with a full bar. Minibar restocked daily. Premium spirits are charged separately — ask the concierge for the price list.',
      acc5_t: 'Bedrooms (4 suites)',
      acc5_b:
        'Four private suites, each with individual AC, premium linens (400 thread count), luxury amenities, and terrace access. Turndown service every evening.',
      acc6_t: 'Bathrooms (4)',
      acc6_b:
        'Marble soaking tubs in the master suite. Luxury bath products restocked daily. There is no spa facility at the villa. In-villa massages can be arranged through the concierge with 24 hours’ notice (optional add-on).',
      serv_eyebrow: 'Optional services · Booked separately',
      serv_title: 'Elevate your stay',
      serv_intro: 'Add-on services on request. Pricing upon inquiry with concierge.',
      s1_t: 'Private chef',
      s1_b:
        'Custom menus with fresh local ingredients. Breakfast, lunch, dinner, and wine pairings. Share preferences in advance.',
      s2_t: 'Private yacht',
      s2_b:
        'Arch tours, snorkeling, sport fishing, and sunsets from the sea. Depart from our private beach.',
      s3_t: 'Massage & wellness',
      s3_b:
        'Certified therapists at the villa. Massages on the terrace with ocean views, facials, and wellness rituals — by appointment.',
      s4_t: 'Activities',
      s4_b:
        'Paddleboard, kayak, snorkeling, whale watching (season), golf, ATVs, and guided Los Cabos excursions.',
      s5_t: 'Luxury transport',
      s5_b:
        'Private SUV transfers, helicopter to the airport, private jets, and access to exclusive events.',
      s6_t: 'Private events',
      s6_b:
        'Weddings, birthdays, proposals, corporate gatherings. Full coordination of décor, catering, and entertainment.',
      wa_cta: 'Request via WhatsApp →',
      rec_eyebrow: 'Curated picks',
      rec_title: 'Recommendations',
      rec_intro: 'Hand-picked places to make your Los Cabos visit unforgettable.',
      tab_rest: 'Restaurants',
      tab_ex: 'Excursions',
      tab_things: 'Things to do',
      tab_em: 'Emergencies',
      cabo_intro:
        'The destination of <em>Los Cabos</em> is named for its <strong>two municipal districts</strong> (<em>delegaciones</em>): <strong>Cabo San Lucas</strong> and <strong>San José del Cabo</strong>. That pairing—two towns at the tip of Baja—is what people mean when they say Los Cabos.',
      cabo_sl_title: 'Cabo San Lucas',
      cabo_sl_body:
        '<strong>Friday plaza</strong> — weekly gathering with food, crafts, and music around <strong>Plaza Amelia Wilkes</strong> (confirm the day and time with concierge).<br><br><strong>Museo de Cabo San Lucas</strong> — at Plaza Amelia Wilkes; exhibits on the natural and human history of the cape.<br><br><strong>El Arco &amp; the marina</strong> — water taxis and tours from the marina to Land’s End, Lover’s Beach, and the Pacific.',
      cabo_sj_title: 'San José del Cabo',
      cabo_sj_body:
        '<strong>Thursday Art Walk</strong> — peak season: galleries open late in the historic district, street art, wine, and live music.<br><br><strong>Chocolate downtown</strong> — visit a San José chocolate atelier for tastings and the story of cacao—known to Indigenous peoples of Mesoamerica for millennia—and how it reached Baja California long before today’s resort towns.',
      cabo_highlights_title: 'More ideas',
      cabo_hi_arco:
        '<strong>El Arco by sea</strong> — allow about 2–3 hours round trip from the marina; concierge can book private or shared boats.',
      cabo_hi_plaza:
        '<strong>Plaza Amelia Wilkes</strong> — Cabo San Lucas’s civic heart: kiosk, gardens, and the museum—easy to combine with a marina stroll.',
      cabo_hi_whale:
        '<strong>Whale watching</strong> — roughly December–April; private outings through the Villa Sera team.',
      cabo_hi_snorkel:
        '<strong>Snorkeling</strong> — Pelican Rock or Chileno Bay; gear and boats coordinated from the villa.',
      cabo_hi_ts:
        '<strong>Todos Santos</strong> — Pueblo Mágico day trip: art, food, and Pacific beaches—about an hour by car.',
      r_manta_type: 'Signature seafood',
      r_manta_d: "Los Cabos' most acclaimed restaurant. Book weeks ahead.",
      r_manta_m: '🚗 15 min · Ask concierge to reserve',
      r_acre_type: 'Farm to table',
      r_acre_d: 'Lush tropical garden, craft cocktails, seasonal cuisine.',
      r_acre_m: '🚗 20 min',
      r_sunset_type: 'Italian · Arch views',
      r_sunset_d: 'Legendary sunsets over the Arch. Ideal for romantic dinners.',
      r_sunset_m: '🚗 10 min',
      r_flora_name: "Flora's Farm",
      r_flora_type: 'Farm to table',
      r_flora_d: 'Sunday brunch at a colonial hacienda. Authentic Mexican charm.',
      r_flora_m: '🚗 25 min',
      cat_seafood: 'Seafood',
      cat_steak: 'Steakhouse',
      cat_mexican: 'Mexican food',
      cat_japanese: 'Japanese food',
      badge_tripadvisor: 'TripAdvisor #1',
      badge_luxury: 'Luxury Pick',
      badge_local: 'Local Icon',
      badge_celeb: 'Celebrity Spot',
      badge_world: 'World-famous',
      see_on_maps: 'See on Google Maps →',
      r_farallon_type: 'Luxury cliffside seafood',
      r_farallon_d: 'Choose your fish from a live tank; chefs prepare it tableside above the Pacific.',
      r_farallon_m: '🚗 20 min · Waldorf Astoria Pedregal',
      r_ediths_type: 'Cabo classic · Grilled meats',
      r_ediths_d: 'A Cabo institution since 1988. Mesquite-grilled meats, freshly baked tortillas, live music under the stars.',
      r_ediths_m: '🚗 15 min',
      r_bourbon_type: 'American steakhouse',
      r_bourbon_d: 'Classic cuts, full bar, and a lively atmosphere in the heart of the marina district.',
      r_bourbon_m: '🚗 20 min',
      r_peregrino_type: 'Fine dining · Wood-fire grill',
      r_peregrino_d: "Exceptional cuts cooked over open fire in an intimate setting. One of Los Cabos' best-kept secrets.",
      r_peregrino_m: '🚗 20 min',
      r_chambao_type: 'Mediterranean · Beachfront',
      r_chambao_d: 'Barefoot-luxury dining steps from the sand. Premium meats, fresh seafood, and signature cocktails at sunset.',
      r_chambao_m: '🚗 15 min · Medano Beach',
      r_rosanegra_type: 'Latin cuisine · Lively atmosphere',
      r_rosanegra_d: "Mexico City's iconic restaurant, now in Los Cabos. Bold Latin flavors, DJ nights, and a scene made for celebration.",
      r_rosanegra_m: '🚗 15 min · Marina district',
      r_micasa_type: 'Traditional Mexican · Award-winning',
      r_micasa_d: 'Most beloved Mexican restaurant in Los Cabos. Colonial hacienda, live music, extraordinary mole.',
      r_micasa_m: '🚗 15 min · Reserve through concierge',
      r_gallos_type: 'Traditional Mexican · Hacienda style',
      r_gallos_d: 'Award-winning mole negro, hand-pressed tortillas, and mezcal by the glass in a charming pueblo setting.',
      r_gallos_m: '🚗 15 min',
      r_nicksan_type: 'Best Japanese in Mexico · Celebrity spot',
      r_nicksan_d: 'Chef Ángel Carbajal trained under Nobu Matsuhisa. Iconic sashimi, creative rolls, unforgettable omakase.',
      r_nicksan_m: '🚗 10 min · Downtown & Marina locations',
      r_nobu_type: 'Japanese-Peruvian fusion',
      r_nobu_d: "Chef Nobu Matsuhisa's legendary restaurant at One&Only Palmilla. Black cod miso on the Sea of Cortez.",
      r_nobu_m: '🚗 25 min · Advance reservation essential',
      e_arco_type: 'Los Cabos icon',
      e_arco_d: 'The classic postcard. Boat tour from the marina, ~45 minutes.',
      e_arco_m: '📍 Coordinate with concierge',
      e_whale_name: 'Whale watching',
      e_snorkel_name: 'Pelican Rock snorkeling',
      em_police_name: 'Police / Emergencies',
      e_whale_type: 'Seasonal · Unique',
      e_whale_d: 'December–April. Humpback whales from a private yacht.',
      e_whale_m: '🐋 Seasonal only (Dec–Apr)',
      e_snorkel_type: 'Marine life · Direct access',
      e_snorkel_d: "Los Cabos' best snorkel spot. From our beach or by boat.",
      e_snorkel_m: '🤿 Gear at the villa',
      e_ts_type: 'Pueblo Mágico',
      e_ts_d: 'Art, food, Hotel California, Pacific beaches.',
      e_ts_m: '🚗 1 hour drive',
      em_h_note: 'Recommended private hospital',
      em_f_note: '24/7 · Delivery available',
      em_p_note: 'General emergencies',
      em_c_note: 'Ambulance',
      reg_eyebrow: 'With your help',
      reg_title: 'Caring for your temporary home',
      rule1:
        'No smoking inside the villa. Designated smoking area on the outdoor terrace.',
      rule2: 'No pets without prior approval.',
      rule3: 'Maximum 8 guests. Outside visitors — please coordinate with concierge.',
      rule4: 'Large events require prior approval and may incur additional fees.',
      rule5: 'The private beach is for Villa Sera guests only.',
      rule6:
        'Please report any damage to the Villa Sera team right away — accidents happen.',
      rule7: 'Quiet outdoors from 11:00 PM out of respect for neighbors.',
      rule8:
        'Check-out: 12:00 PM. Late check-out subject to availability — ask 24 hours ahead.',
      footer_holding: 'A Sera Holding property',
      footer_wa: 'Need anything? Message us →',
      footer_private: 'This page is private and for Villa Sera guests only.',
      footer_social_title: 'Social',
      footer_google: 'Google · Villa Sera Los Cabos',
      floating_wa_aria: 'WhatsApp',
    },
    es: {
      meta_title: 'Villa Sera · Guía de huéspedes',
      meta_description: 'Su guía privada de bienvenida a Villa Sera, Los Cabos.',
      nav_menu_aria: 'Menú',
      nav_menu_btn: 'Menú',
      nav_bienvenida: 'Bienvenida',
      nav_esencial: 'Esencial',
      nav_mantenimiento: 'Mantenimiento',
      nav_staff: 'Su equipo',
      nav_villa: 'La villa',
      nav_servicios: 'Servicios',
      nav_guia: 'Guía local',
      nav_reglas: 'Reglas',
      hero_eyebrow: 'Bienvenidos a',
      hero_subtitle: 'Su guía privada de huéspedes · Los Cabos, México',
      welcome_eyebrow: 'Mensaje personal',
      welcome_title: 'Una bienvenida de parte de Marlon Alexis Herrera',
      welcome_quote:
        '"Es un honor recibirlos en Villa Sera. Esta es su casa durante su estancia — cada espacio, cada servicio y cada atardecer está aquí para que los disfruten al máximo. No duden en contactarnos para cualquier cosa. Estamos aquí para hacer de esta experiencia algo que nunca olvidarán."',
      welcome_note:
        'Nuestro equipo está disponible las 24 horas para cualquier necesidad — desde una recomendación de restaurante hasta coordinar una excursión privada al Arco.',
      welcome_card_title: 'Información de su estadía',
      welcome_checkin: 'Check-in',
      welcome_checkout: 'Check-out',
      welcome_early_label: 'Entrada / salida (horario)',
      welcome_early_val: 'Consultar con el equipo',
      welcome_capacity_label: 'Capacidad máx.',
      welcome_capacity_val: '8 huéspedes',
      welcome_emergency: 'Contacto de emergencia: +52 624 217 5935',
      esencial_eyebrow: 'Lo que necesita saber',
      esencial_title: 'Información esencial',
      card_wifi_net: 'Red: VillaSera_Guest',
      card_ac_t: 'Aire acondicionado',
      card_ac_b:
        'La casa tiene <strong>dos displays de control</strong>. El display <strong>en el bar</strong> controla el aire de la <strong>sala, cocina, bar, entrada</strong> y demás zonas comunes. El segundo está en la <strong>habitación principal (master)</strong>. Puede configurar la temperatura <strong>desde cada display o desde su celular</strong>. Temperatura recomendada: 22°C. Apague al salir.',
      card_tv_t: 'Entretenimiento',
      card_tv_b:
        'Smart TV en sala y habitaciones con Netflix y Apple TV. Bocinas Sonos en terraza — pida al equipo de Villa Sera que las configure.',
      card_park_t: 'Estacionamiento',
      card_park_b:
        'Espacio privado para 2 vehículos frente a la villa. El portón se abre con control remoto en recepción.',
      card_loc_t: 'Ubicación',
      card_loc_b:
        'Villa Sera se ubica en Cabo San Lucas, Baja California Sur. Use el enlace para indicaciones paso a paso en Google Maps.',
      card_loc_link: 'Abrir en Google Maps',
      card_housekeeping_t: 'Limpieza',
      card_housekeeping_b:
        'Durante su estancia la casa solo se limpia cuando usted solicita el servicio. El servicio de limpieza tiene un costo de 60 USD. Debe solicitarse con 24 horas de anticipación.',
      card_trash_t: 'Basura',
      card_trash_b:
        'Recolección los días lunes, miércoles y viernes. Separamos orgánico y reciclable. Gracias por ayudarnos a cuidar Los Cabos.',
      maint_eyebrow: 'Visitas al predio',
      maint_title: 'Mantenimiento programado',
      maint_intro:
        'Para su comodidad y seguridad, le avisaremos con anticipación cuando haya personal autorizado en la propiedad.',
      maint_tue_day: 'Martes',
      maint_tue_t: 'Jardinería',
      maint_tue_b:
        'El jardinero ingresa a la propiedad los martes para el cuidado de jardines y áreas exteriores. <strong style="color:#F8F4EF">Se le notificará con anticipación</strong> antes de su visita para que esté informado.',
      maint_fri_day: 'Viernes',
      maint_fri_t: 'Alberca y jacuzzi',
      maint_fri_b:
        'Los viernes acude el personal de mantenimiento de la alberca y el jacuzzi para asegurar agua y equipos en óptimas condiciones. También le avisaremos con tiempo cuando deban realizar el servicio.',
      staff_eyebrow: 'Su equipo personal',
      staff_title: 'Su equipo dedicado',
      staff_intro: 'Estamos aquí para hacer su estancia perfecta, las 24 horas.',
      staff_vs_name: 'Marlon Alexis Herrera',
      staff_vs_role: 'Gerente de casa',
      staff_vs_desc:
        'Su gerente de casa en sitio y contacto principal las 24 horas: reservaciones, preguntas generales y coordinación de servicios adicionales.',
      staff_ch_name: 'Chef privado',
      staff_ch_role: 'Chef de cuisine',
      staff_ch_desc:
        'Disponible para desayunos, comidas y cenas privadas. Comparta sus preferencias y restricciones alimenticias con anticipación.',
      staff_hk_name: 'Cecilia Velazques',
      staff_hk_role: 'Camarista',
      staff_hk_desc:
        'Mantiene Villa Sera impecable durante su estancia — arreglo diario, blancos y detalles. Coméntenos horarios preferidos o peticiones especiales.',
      wa_btn: 'WhatsApp',
      esp_eyebrow: 'Tour privado',
      esp_title: 'Conozca su villa',
      esp_intro:
        'Un recorrido visual de la residencia — terrazas, mar y espacios interiores.',
      photo_alt: 'Villa Sera, Los Cabos — fotografía de la propiedad',
      acc1_t: 'Alberca, jacuzzi y terraza principal',
      acc1_b:
        'La terraza principal tiene vista al Mar de Cortés y al Arco de Cabo San Lucas. La alberca y el jacuzzi están disponibles las 24 horas. Temperatura del agua: 28°C. Camastros y toallas siempre listos.',
      acc2_t: 'Playa privada',
      acc2_b:
        'Desde la villa, baja por la escalinata de piedra privada al lado derecho — tu acceso exclusivo a la arena. La playa es completamente privada y nadable. Equipos de snorkel, kayaks y paddleboards — solicítelos al equipo de Villa Sera. Horarios de marea en recepción.',
      acc3_t: 'Comedor exterior',
      acc3_b:
        'Bajo los arcos coloniales con vista al mar. Capacidad para 8 personas. Ideal para cenas al atardecer con chef privado. Reserve con mínimo 4 horas de anticipación.',
      acc4_t: 'Sala principal',
      acc4_b:
        'Sala de estar de doble altura con bar completo. Minibar reabastecido diariamente. Los licores del bar tienen costo adicional — pregunte al concierge por la lista de precios.',
      acc5_t: 'Habitaciones (4 suites)',
      acc5_b:
        '4 suites privadas, todas con AC individual, ropa de cama premium (400 hilos), amenidades de lujo y acceso a terraza. Servicio de cama incluido cada noche.',
      acc6_t: 'Baños (4)',
      acc6_b:
        'Tinas de mármol en la suite principal. Productos de baño de lujo reabastecidos diariamente. La villa no cuenta con spa. Masajes en villa se pueden coordinar con el concierge con 24 horas de anticipación (servicio opcional).',
      serv_eyebrow: 'Servicios opcionales · Se coordinan por separado',
      serv_title: 'Eleve su experiencia',
      serv_intro: 'Servicios adicionales a solicitud. Precios al consultar con el concierge.',
      s1_t: 'Chef privado',
      s1_b:
        'Menús personalizados con ingredientes frescos locales. Desayunos, comidas, cenas y maridajes de vino. Comunique sus preferencias con anticipación.',
      s2_t: 'Yate privado',
      s2_b:
        'Tours al Arco, snorkel, pesca deportiva y atardeceres desde el mar. Salida desde nuestra playa privada.',
      s3_t: 'Masajes y bienestar',
      s3_b:
        'Terapeutas certificados en la villa. Masajes en terraza con vista al mar, faciales y rituales de bienestar — con cita previa.',
      s4_t: 'Actividades',
      s4_b:
        'Paddleboard, kayak, snorkel, ballenas (temporada), golf, ATV y excursiones guiadas por Los Cabos.',
      s5_t: 'Transporte de lujo',
      s5_b:
        'Traslados en SUV, helicóptero al aeropuerto, jets privados y acceso a eventos exclusivos.',
      s6_t: 'Eventos privados',
      s6_b:
        'Bodas, cumpleaños, propuestas, corporativos. Coordinación de decoración, catering y entretenimiento.',
      wa_cta: 'Solicitar por WhatsApp →',
      rec_eyebrow: 'Guía local',
      rec_title: 'Recomendaciones',
      rec_intro: 'Lugares seleccionados para una visita inolvidable a Los Cabos.',
      tab_rest: 'Restaurantes',
      tab_ex: 'Excursiones',
      tab_things: 'Cosas que hacer',
      tab_em: 'Emergencias',
      cabo_intro:
        'El destino de <em>Los Cabos</em> toma su nombre de sus <strong>dos delegaciones municipales</strong>: <strong>Cabo San Lucas</strong> y <strong>San José del Cabo</strong>. Ese binomio—dos ciudades en el extremo de Baja—es lo que la gente llama Los Cabos.',
      cabo_sl_title: 'Cabo San Lucas',
      cabo_sl_body:
        '<strong>Viernes de plaza</strong> — convivencia semanal con comida, artesanías y música en torno a la <strong>Plaza Amelia Wilkes</strong> (confirme día y hora con el concierge).<br><br><strong>Museo de Cabo San Lucas</strong> — en la Plaza Amelia Wilkes; historia natural y humana del cabo.<br><br><strong>El Arco y la marina</strong> — taxis acuáticos y tours desde la marina hasta el fin de la península, Playa del Amor y el Pacífico.',
      cabo_sj_title: 'San José del Cabo',
      cabo_sj_body:
        '<strong>Art Walk (jueves)</strong> — en temporada alta, galerías abiertas tarde en el centro histórico, arte en la calle, vino y música en vivo.<br><br><strong>Chocolate en el centro</strong> — visite un taller de chocolate artesanal en San José: degustaciones y la historia del cacao, conocido por los pueblos originarios de Mesoamérica durante milenios, y cómo llegó a Baja California mucho antes de los resorts de hoy.',
      cabo_highlights_title: 'Más ideas',
      cabo_hi_arco:
        '<strong>El Arco en lancha</strong> — calcule unas 2–3 horas ida y vuelta desde la marina; el concierge reserva lancha privada o compartida.',
      cabo_hi_plaza:
        '<strong>Plaza Amelia Wilkes</strong> — corazón cívico de Cabo San Lucas: quiosco, jardines y museo; combina bien con un paseo por la marina.',
      cabo_hi_whale:
        '<strong>Ballenas</strong> — aproximadamente diciembre–abril; salidas privadas con el equipo de Villa Sera.',
      cabo_hi_snorkel:
        '<strong>Snorkel</strong> — Pelican Rock o Bahía Chileno; equipo y embarcaciones desde la villa.',
      cabo_hi_ts:
        '<strong>Todos Santos</strong> — escapada a Pueblo Mágico: arte, gastronomía y playas del Pacífico—a una hora en auto.',
      r_manta_type: 'Mariscos de autor',
      r_manta_d: 'El restaurante más aclamado de Los Cabos. Reserva con semanas de anticipación.',
      r_manta_m: '🚗 15 min · Pida al concierge que reserve',
      r_acre_type: 'Granja a la mesa',
      r_acre_d: 'Jardín tropical, coctelería artesanal y cocina de temporada.',
      r_acre_m: '🚗 20 min',
      r_sunset_type: 'Italiano con vista al Arco',
      r_sunset_d: 'Atardeceres legendarios sobre el Arco. Cenas románticas.',
      r_sunset_m: '🚗 10 min',
      r_flora_name: "Flora's Farm",
      r_flora_type: 'Farm to table',
      r_flora_d: 'Brunch dominical en hacienda colonial. México auténtico.',
      r_flora_m: '🚗 25 min',
      cat_seafood: 'Mariscos',
      cat_steak: 'Cortes de carne',
      cat_mexican: 'Cocina mexicana',
      cat_japanese: 'Cocina japonesa',
      badge_tripadvisor: 'TripAdvisor #1',
      badge_luxury: 'Selección de lujo',
      badge_local: 'Ícono local',
      badge_celeb: 'Favorito de celebridades',
      badge_world: 'Fama mundial',
      see_on_maps: 'Ver en Google Maps →',
      r_farallon_type: 'Mariscos en acantilado de lujo',
      r_farallon_d: 'Elige tu pescado en vivo; el chef lo prepara junto a tu mesa sobre el Pacífico.',
      r_farallon_m: '🚗 20 min · Waldorf Astoria Pedregal',
      r_ediths_type: 'Clásico de Cabo · Carnes a la parrilla',
      r_ediths_d: 'Ícono de Cabo desde 1988. Carnes al mezquite, tortillas recién hechas y música en vivo bajo las estrellas.',
      r_ediths_m: '🚗 15 min',
      r_bourbon_type: 'Steakhouse americano',
      r_bourbon_d: 'Cortes clásicos, bar completo y ambiente vibrante en la zona del marina.',
      r_bourbon_m: '🚗 20 min',
      r_peregrino_type: 'Fine dining · Parrilla de leña',
      r_peregrino_d: 'Cortes excepcionales cocinados a fuego abierto en un ambiente íntimo. Uno de los mejores secretos de Los Cabos.',
      r_peregrino_m: '🚗 20 min',
      r_chambao_type: 'Mediterráneo · Frente a la playa',
      r_chambao_d: 'Lujo desenfadado a pasos de la arena. Carnes premium, mariscos frescos y cócteles al atardecer.',
      r_chambao_m: '🚗 15 min · Playa Médano',
      r_rosanegra_type: 'Cocina latina · Ambiente vibrante',
      r_rosanegra_d: 'El icónico restaurante de Ciudad de México, ahora en Los Cabos. Sabores latinos, noches con DJ y ambiente de celebración.',
      r_rosanegra_m: '🚗 15 min · Zona marina',
      r_micasa_type: 'Mexicano tradicional · Premiado',
      r_micasa_d: 'El restaurante mexicano más querido de Los Cabos. Hacienda colonial, música en vivo, mole extraordinario.',
      r_micasa_m: '🚗 15 min · Reservar con el concierge',
      r_gallos_type: 'Mexicano tradicional · Estilo hacienda',
      r_gallos_d: 'Mole negro premiado, tortillas hechas a mano y mezcal de copa en un encantador ambiente de pueblo.',
      r_gallos_m: '🚗 15 min',
      r_nicksan_type: 'Mejor japonés de México · Favorito de celebridades',
      r_nicksan_d: 'Chef Ángel Carbajal, formado con Nobu Matsuhisa. Sashimi icónico, rolls creativos, omakase inigualable.',
      r_nicksan_m: '🚗 10 min · Dos ubicaciones (Centro y Marina)',
      r_nobu_type: 'Fusión japonesa-peruana',
      r_nobu_d: 'El legendario restaurante del chef Nobu Matsuhisa en One&Only Palmilla. Bacalao negro al miso sobre el Mar de Cortés.',
      r_nobu_m: '🚗 25 min · Reserva con anticipación indispensable',
      e_arco_type: 'Icono de Los Cabos',
      e_arco_d: 'La postal clásica. Tour en lancha desde el marina, ~45 min.',
      e_arco_m: '📍 Coordinar con concierge',
      e_whale_name: 'Avistamiento de ballenas',
      e_snorkel_name: 'Snorkel en Pelican Rock',
      em_police_name: 'Policía / Emergencias',
      e_whale_type: 'Experiencia única · Temporada',
      e_whale_d: 'Diciembre–abril. Ballenas jorobadas desde yate privado.',
      e_whale_m: '🐋 Solo temporada (dic–abr)',
      e_snorkel_type: 'Vida marina · Acceso directo',
      e_snorkel_d: 'La mejor zona de snorkel. Desde nuestra playa o en lancha.',
      e_snorkel_m: '🤿 Equipo en la villa',
      e_ts_type: 'Pueblo Mágico',
      e_ts_d: 'Arte, gastronomía, Hotel California, playas del Pacífico.',
      e_ts_m: '🚗 1 hora en auto',
      em_h_note: 'Hospital privado recomendado',
      em_f_note: '24 horas · Entrega a domicilio',
      em_p_note: 'Emergencias generales',
      em_c_note: 'Ambulancia',
      reg_eyebrow: 'Con su colaboración',
      reg_title: 'Para cuidar su hogar temporal',
      rule1:
        'No fumar dentro de la villa. Área de fumadores en terraza exterior.',
      rule2: 'No mascotas sin autorización previa.',
      rule3: 'Máximo 8 huéspedes. Visitas externas — coordinar con concierge.',
      rule4: 'Eventos grandes requieren autorización y pueden tener costo adicional.',
      rule5: 'La playa privada es exclusiva para huéspedes de Villa Sera.',
      rule6:
        'Reporte cualquier daño al equipo de Villa Sera de inmediato — los accidentes ocurren.',
      rule7: 'Silencio en exteriores a partir de las 23:00 por respeto a vecinos.',
      rule8:
        'Check-out: 12:00. Late check-out sujeto a disponibilidad — consultar con 24 h de anticipación.',
      footer_holding: 'Una propiedad de Sera Holding',
      footer_wa: '¿Necesita algo? Escríbanos →',
      footer_private: 'Esta página es privada y exclusiva para huéspedes de Villa Sera.',
      footer_social_title: 'Redes sociales',
      footer_google: 'Google · Villa Sera Los Cabos',
      floating_wa_aria: 'WhatsApp',
    },
  };

  function t(lang, key) {
    var pack = DICT[lang] || DICT.en;
    return pack[key] !== undefined ? pack[key] : DICT.en[key] || '';
  }

  function setGuestGuideLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'en';
    document.documentElement.lang = lang;
    var md = document.getElementById('meta-desc');
    if (md) md.setAttribute('content', t(lang, 'meta_description'));
    document.title = t(lang, 'meta_title');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var val = t(lang, key);
      if (el.tagName === 'IMG') el.setAttribute('alt', val);
      else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(lang, key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      var parts = raw.split(':');
      var attr = parts[0];
      var key = parts.slice(1).join(':');
      if (attr && key) el.setAttribute(attr, t(lang, key));
    });

    document.querySelectorAll('[data-wa-en][data-wa-es]').forEach(function (a) {
      a.href = lang === 'es' ? a.getAttribute('data-wa-es') : a.getAttribute('data-wa-en');
    });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try {
      localStorage.setItem('guestGuideLang', lang);
    } catch (e) {}
  }

  window.setGuestGuideLang = setGuestGuideLang;

  document.addEventListener('DOMContentLoaded', function () {
    var saved = null;
    try {
      saved = localStorage.getItem('guestGuideLang');
    } catch (e) {}
    var lang = saved === 'es' || saved === 'en' ? saved : 'en';
    setGuestGuideLang(lang);
    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setGuestGuideLang(btn.getAttribute('data-lang'));
      });
    });
  });
})();
