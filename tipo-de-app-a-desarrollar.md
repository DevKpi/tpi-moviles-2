Opción 3: Reporte de Incidentes / Reclamos Urbanos                                                                                  
                                                                                                                                             
  │ Muy valorada en defensas de proyectos porque resuelve una problemática real y tangible.                                                  
                                                                                                                                             
  • Idea: App comunitaria para registrar incidentes urbanos (baches, luminarias rotas, semáforos fuera de servicio, basura acumulada).       
  • Entidad principal en Firestore (reportes):                                                                                               
      • titulo, categoria, estado ("Pendiente", "En revisión", "Resuelto"), coordenadas, fotoUri, userId, fechaCreacion.                     
  • Funcionalidades MVP:                                                                                                                     
      • Formulario de nuevo reclamo: captura automática del GPS actual + foto del problema.                                                  
      • Mis reportes: listado y detalle con posibilidad de editar o cancelar el reclamo.                                                     
      • Mapa de reclamos activos.