Use sistema_gestor_incidentes;

insert into t_sistemas (ct_descripcion_sistema) values ("SGI");
insert into t_afectaciones (ct_descripcion_afectacion) values ("Alto"),("Medio"),("Bajo");
insert into t_categorias (ct_descripcion_categoria) values ("Reparación"),("Intervención por causa natural"),("Atención al mobiliario");
insert into t_riesgos (ct_descripcion_riesgo) values ("Muy Alto"),("Alto"),("Medio"),("Bajo"),("Muy Bajo");
insert into t_prioridades (ct_descripcion_prioridad) values ("Alto"),("Medio"),("Bajo");
insert into t_estados (ct_descripcion_estado, cn_id_sistema) values ("Registrado",1),("Asignado",1),("En revisión",1),("En reparación",1),("Pendiente de compra",1),("Terminado",1),("Aprobado",1),("Rechazado",1),("Cerrado",1);
insert into t_roles (ct_descripcion_rol, cn_id_sistema) values ("Administrador",1),("Usuario",1),("Encargado",1),("Técnico",1),("Supervisor",1);
insert into t_departamentos (ct_id_departamento, ct_descripcion_departamento) values ("1","Planta");



#quitar
INSERT INTO `t_incidencias` (`ct_id_incidencia`, `ct_titulo_incidencia`, `ct_descripcion_incidencia`, `ct_lugar`, `cf_fecha_completa_incidencia`, `cn_id_estado`, `ct_justificacion_incidencia`, `cn_id_prioridad`, `cn_id_riesgo`, `cn_id_afectacion`, `cn_id_categoria`, `cn_monto_compra_materiales`, `cn_duracion_reparacion`, `cn_id_imagen`, `cn_id_usuario_registro`) 
VALUES ('2024-000001', 'Daño tubería', 'Se daño la madre mae', 'Donde su maire', '2024-05-23 11:53:42', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1');
INSERT INTO `t_imagenes` (`ct_direccion_imagen`) values ("example");
INSERT INTO `t_registro_diagnosticos` (`cn_id_diagnostico`, `cf_fecha_hora_diagnostico`, `ct_diagnostico`, `cn_tiempo_estimado_reparacion`, `cn_id_imagen`, `ct_observaciones`, `ct_id_incidencia`, `cn_id_usuario`) VALUES (NULL, '2024-05-23 14:30:05', 'Es una prueba', NULL, '1', NULL, '2024-000001', '1');