drop database if exists sistema_gestor_incidentes;
create database sistema_gestor_incidentes;

use sistema_gestor_incidentes;

CREATE TABLE `t_sistemas` (
  `cn_id_sistema`int auto_increment primary key not null,
  `ct_descripcion_sistema` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_roles` (
  `cn_id_rol` int auto_increment primary key not null,
  `ct_descripcion_rol` varchar(255) not null,
  `cn_id_sistema` int not null,
  foreign key(cn_id_sistema) references t_sistemas(cn_id_sistema)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_imagenes` (
  `cn_id_imagen`int primary key auto_increment not null,
  `ct_direccion_imagen` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_pantallas` (
  `cn_id_pantalla` int auto_increment primary key not null,
  `ct_titulo_pantalla` varchar(255) not null,
  `cn_id_rol` int not null,
  foreign key (cn_id_rol) references t_roles(cn_id_rol)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_estados` (
  `cn_id_estado`int auto_increment primary key not null,
  `ct_descripcion_estado` varchar(255) not null,
  `cn_id_sistema` int not null,
  foreign key(cn_id_sistema) references t_sistemas(cn_id_sistema)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_categorias` (
  `cn_id_categoria` int primary key auto_increment not null,
  `ct_descripcion_categoria` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_riesgos` (
  `cn_id_riesgo` int auto_increment not null primary key,
  `ct_descripcion_riesgo` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_afectaciones` (
  `cn_id_afectacion` int auto_increment not null primary key,
  `ct_descripcion_afectacion` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_departamentos` (
  `ct_id_departamento`varchar(255) not null primary key,
  `ct_descripcion_departamento` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_prioridades` (
  `cn_id_prioridad`int not null auto_increment primary key,
  `ct_descripcion_prioridad` varchar(255) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_usuarios` (
  `cn_id_usuario` int auto_increment not null primary key,
  `ct_nombre_completo` varchar(255) not null,
  `ct_cedula` varchar(15) not null,
  `ct_descripcion_puesto`varchar(255) not null,
  `ct_celular`varchar(255) not null,
  `ct_id_departamento` varchar(255) not null,
  `ct_correo_institucional` varchar(255) not null,
  `ct_contrasena` varchar(255) not null,
  `cn_id_rol` int,
  FOREIGN KEY (`ct_id_departamento`) REFERENCES `t_departamentos`(`ct_id_departamento`),
  FOREIGN KEY (`cn_id_rol`) REFERENCES `t_roles`(`cn_id_rol`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_incidencias` (
  `ct_id_incidencia` varchar(255) not null primary key,
  `ct_titulo_incidencia` varchar(255),
  `ct_descripcion_incidencia` varchar(255) not null,
  `ct_lugar` varchar(255) not null,
  `cf_fecha_completa_incidencia` datetime,
  `cn_id_estado` int,
  `ct_justificacion_incidencia` varchar(255),
  `cn_id_prioridad` int,
  `cn_id_riesgo` int,
  `cn_id_afectacion` int,
  `cn_id_categoria` int,
  `cn_monto_compra_materiales` int(10),
  `cn_duracion_reparacion` int(2),
  `cn_id_imagen` int,
  `cn_id_usuario_registro` int,
  FOREIGN KEY (`cn_id_estado`) REFERENCES `t_estados`(`cn_id_estado`),
  FOREIGN KEY (`cn_id_prioridad`) REFERENCES `t_prioridades`(`cn_id_prioridad`),
  FOREIGN KEY (`cn_id_categoria`)REFERENCES `t_categorias`(`cn_id_categoria`),
  FOREIGN KEY (`cn_id_riesgo`) REFERENCES `t_riesgos`(`cn_id_riesgo`),
  FOREIGN KEY (`cn_id_afectacion`) REFERENCES `t_afectaciones`(`cn_id_afectacion`),
  FOREIGN KEY (`cn_id_imagen`) REFERENCES `t_imagenes`(`cn_id_imagen`),
  FOREIGN KEY (`cn_id_usuario_registro`) REFERENCES `t_usuarios`(`cn_id_usuario`)
  
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_registro_diagnosticos` (
  `cn_id_diagnostico` int auto_increment primary key not null,
  `cf_fecha_hora_diagnostico` datetime,
  `ct_diagnostico`varchar(255) not null,
  `cn_tiempo_estimado_reparacion` int(2),
  `cn_id_imagen` int not null,
  `ct_observaciones` varchar(255),
  `ct_id_incidencia` varchar(255) not null,
  `cn_id_usuario` int not null,
  foreign key (cn_id_imagen) references t_imagenes(cn_id_imagen),
  FOREIGN KEY (cn_id_usuario) REFERENCES t_usuarios(cn_id_usuario),
  FOREIGN KEY (ct_id_incidencia) REFERENCES t_incidencias(ct_id_incidencia)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_asignacion_incidencia_empleados` (
  `cn_id_asignacion` int auto_increment not null primary key,
  `ct_id_incidencia` varchar(255) not null,
  `cn_id_usuario` int not null,
  FOREIGN KEY (`cn_id_usuario`)REFERENCES `t_usuarios`(`cn_id_usuario`),
  FOREIGN KEY (`ct_id_incidencia`)REFERENCES `t_incidencias`(`ct_id_incidencia`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_bitacora_cambios_general` (
  `ct_cod_bitacora_cambio` varchar(255) not null primary key,
  `ct_id_incidencia` varchar(255) not null,
  `cn_id_estado_nuevo` int not null,
  `cn_id_usuario_del_cambio` int not null,
  `cn_id_pantalla` int not null,
  `cf_fecha_hora_cambio` datetime,
  FOREIGN KEY (`cn_id_estado_nuevo`) REFERENCES `t_estados`(`cn_id_estado`),
  FOREIGN KEY (`ct_id_incidencia`) REFERENCES `t_incidencias`(`ct_id_incidencia`),
  FOREIGN KEY (`cn_id_usuario_del_cambio`) REFERENCES `t_usuarios`(`cn_id_usuario`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `t_roles_por_usuario` (
  `cn_id_rol_por_usuario`int not null primary key,
  `cn_id_usuario` int not null,
  `cn_id_rol` int not null,
  FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios`(`cn_id_usuario`),
  FOREIGN KEY (`cn_id_rol`) REFERENCES `t_roles`(`cn_id_rol`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `t_bitacora_cambios_estado` (
  `ct_cod_bitacora` int not null primary key,
  `cn_id_estado` int not null,
  `cn_id_usuario` int not null,
  `ct_referencia_incidencia` varchar(255) not null,
  FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios`(`cn_id_usuario`),
  FOREIGN KEY (`cn_id_estado`) REFERENCES `t_estados`(`cn_id_estado`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



