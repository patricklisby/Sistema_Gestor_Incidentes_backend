Use sistema_gestor_incidentes;

insert into t_sistemas (ct_descripcion_sistema) values ("SGI");
insert into t_afectaciones (ct_descripcion_afectacion) values ("Alto"),("Medio"),("Bajo");
insert into t_categorias (ct_descripcion_categoria) values ("Reparación"),("Intervención por causa natural"),("Atención al mobiliario");
insert into t_riesgos (ct_descripcion_riesgo) values ("Muy Alto"),("Alto"),("Medio"),("Bajo"),("Muy Bajo");
insert into t_prioridades (ct_descripcion_prioridad) values ("Alto"),("Medio"),("Bajo");
insert into t_estados (ct_descripcion_estado, cn_id_sistema) values ("Registrado",1),("Asignado",1),("En revisión",1),("En reparación",1),("Pendiente de compra",1),("Terminado",1),("Aprobado",1),("Rechazado",1),("Cerrado",1);
insert into t_roles (ct_descripcion_rol, cn_id_sistema) values ("Administrador",1),("Usuario",1),("Encargado",1),("Técnico",1),("Supervisor",1);
insert into t_departamentos (ct_id_departamento, ct_descripcion_departamento) values ("1","Planta");



