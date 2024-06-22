-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 22, 2024 at 06:10 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistema_gestor_incidentes`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_afectaciones`
--

DROP TABLE IF EXISTS `t_afectaciones`;
CREATE TABLE IF NOT EXISTS `t_afectaciones` (
  `cn_id_afectacion` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_afectacion` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id_afectacion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_afectaciones`
--

INSERT INTO `t_afectaciones` (`cn_id_afectacion`, `ct_descripcion_afectacion`) VALUES
(1, 'Alto'),
(2, 'Medio'),
(3, 'Bajo');

-- --------------------------------------------------------

--
-- Table structure for table `t_asignacion_incidencia_empleados`
--

DROP TABLE IF EXISTS `t_asignacion_incidencia_empleados`;
CREATE TABLE IF NOT EXISTS `t_asignacion_incidencia_empleados` (
  `cn_id_asignacion` int NOT NULL AUTO_INCREMENT,
  `ct_id_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_usuario` int NOT NULL,
  PRIMARY KEY (`cn_id_asignacion`),
  KEY `cn_id_usuario` (`cn_id_usuario`),
  KEY `ct_id_incidencia` (`ct_id_incidencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_bitacora_cambios_estado`
--

DROP TABLE IF EXISTS `t_bitacora_cambios_estado`;
CREATE TABLE IF NOT EXISTS `t_bitacora_cambios_estado` (
  `ct_cod_bitacora` int NOT NULL AUTO_INCREMENT,
  `cn_id_estado` int NOT NULL,
  `cn_id_usuario` int NOT NULL,
  `ct_referencia_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`ct_cod_bitacora`),
  KEY `cn_id_usuario` (`cn_id_usuario`),
  KEY `cn_id_estado` (`cn_id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_bitacora_cambios_general`
--

DROP TABLE IF EXISTS `t_bitacora_cambios_general`;
CREATE TABLE IF NOT EXISTS `t_bitacora_cambios_general` (
  `ct_id_bitacora_cambio` int NOT NULL AUTO_INCREMENT,
  `ct_id_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_estado_nuevo` int NOT NULL,
  `cn_id_usuario_del_cambio` int NOT NULL,
  `cf_fecha_hora_cambio` datetime DEFAULT NULL,
  PRIMARY KEY (`ct_id_bitacora_cambio`),
  KEY `cn_id_estado_nuevo` (`cn_id_estado_nuevo`),
  KEY `ct_id_incidencia` (`ct_id_incidencia`),
  KEY `cn_id_usuario_del_cambio` (`cn_id_usuario_del_cambio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_categorias`
--

DROP TABLE IF EXISTS `t_categorias`;
CREATE TABLE IF NOT EXISTS `t_categorias` (
  `cn_id_categoria` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_categoria` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_categorias`
--

INSERT INTO `t_categorias` (`cn_id_categoria`, `ct_descripcion_categoria`) VALUES
(1, 'Reparación'),
(2, 'Intervención por causa natural'),
(3, 'Atención al mobiliario');

-- --------------------------------------------------------

--
-- Table structure for table `t_departamentos`
--

DROP TABLE IF EXISTS `t_departamentos`;
CREATE TABLE IF NOT EXISTS `t_departamentos` (
  `ct_id_departamento` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_descripcion_departamento` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`ct_id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_departamentos`
--

INSERT INTO `t_departamentos` (`ct_id_departamento`, `ct_descripcion_departamento`) VALUES
('1', 'Planta');

-- --------------------------------------------------------

--
-- Table structure for table `t_estados`
--

DROP TABLE IF EXISTS `t_estados`;
CREATE TABLE IF NOT EXISTS `t_estados` (
  `cn_id_estado` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_estado` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_sistema` int NOT NULL,
  PRIMARY KEY (`cn_id_estado`),
  KEY `cn_id_sistema` (`cn_id_sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_estados`
--

INSERT INTO `t_estados` (`cn_id_estado`, `ct_descripcion_estado`, `cn_id_sistema`) VALUES
(1, 'Registrado', 1),
(2, 'Asignado', 1),
(3, 'En revisión', 1),
(4, 'En reparación', 1),
(5, 'Pendiente de compra', 1),
(6, 'Terminado', 1),
(7, 'Aprobado', 1),
(8, 'Rechazado', 1),
(9, 'Cerrado', 1);

-- --------------------------------------------------------

--
-- Table structure for table `t_imagenes`
--

DROP TABLE IF EXISTS `t_imagenes`;
CREATE TABLE IF NOT EXISTS `t_imagenes` (
  `cn_id_imagen` int NOT NULL AUTO_INCREMENT,
  `ct_direccion_imagen` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cb_imagen` longblob NOT NULL,
  PRIMARY KEY (`cn_id_imagen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_imagenes_por_diagnosticos`
--

DROP TABLE IF EXISTS `t_imagenes_por_diagnosticos`;
CREATE TABLE IF NOT EXISTS `t_imagenes_por_diagnosticos` (
  `cn_id_imagenes_por_diagnosticos` int NOT NULL AUTO_INCREMENT,
  `cn_id_diagnostico` int NOT NULL,
  `cn_id_imagen` int DEFAULT NULL,
  PRIMARY KEY (`cn_id_imagenes_por_diagnosticos`),
  KEY `cn_id_diagnostico` (`cn_id_diagnostico`),
  KEY `cn_id_imagen` (`cn_id_imagen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_imagenes_por_incidencias`
--

DROP TABLE IF EXISTS `t_imagenes_por_incidencias`;
CREATE TABLE IF NOT EXISTS `t_imagenes_por_incidencias` (
  `cn_id_imagenes_por_incidencias` int NOT NULL AUTO_INCREMENT,
  `ct_id_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_imagen` int DEFAULT NULL,
  PRIMARY KEY (`cn_id_imagenes_por_incidencias`),
  KEY `ct_id_incidencia` (`ct_id_incidencia`),
  KEY `cn_id_imagen` (`cn_id_imagen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_incidencias`
--

DROP TABLE IF EXISTS `t_incidencias`;
CREATE TABLE IF NOT EXISTS `t_incidencias` (
  `ct_id_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_titulo_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ct_descripcion_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_lugar` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cf_fecha_completa_incidencia` datetime DEFAULT NULL,
  `cn_id_estado` int DEFAULT NULL,
  `ct_justificacion_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `cn_id_prioridad` int DEFAULT NULL,
  `cn_id_riesgo` int DEFAULT NULL,
  `cn_id_afectacion` int DEFAULT NULL,
  `cn_id_categoria` int DEFAULT NULL,
  `cn_monto_compra_materiales` int DEFAULT NULL,
  `cn_duracion_reparacion` int DEFAULT NULL,
  `cn_id_usuario_registro` int DEFAULT NULL,
  PRIMARY KEY (`ct_id_incidencia`),
  KEY `cn_id_estado` (`cn_id_estado`),
  KEY `cn_id_prioridad` (`cn_id_prioridad`),
  KEY `cn_id_categoria` (`cn_id_categoria`),
  KEY `cn_id_riesgo` (`cn_id_riesgo`),
  KEY `cn_id_afectacion` (`cn_id_afectacion`),
  KEY `cn_id_usuario_registro` (`cn_id_usuario_registro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_pantallas`
--

DROP TABLE IF EXISTS `t_pantallas`;
CREATE TABLE IF NOT EXISTS `t_pantallas` (
  `cn_id_pantalla` int NOT NULL AUTO_INCREMENT,
  `ct_titulo_pantalla` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_sistema` int NOT NULL,
  PRIMARY KEY (`cn_id_pantalla`),
  KEY `cn_id_sistema` (`cn_id_sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_pantallas`
--

INSERT INTO `t_pantallas` (`cn_id_pantalla`, `ct_titulo_pantalla`, `cn_id_sistema`) VALUES
(1, 'Inicio de sesión', 1),
(2, 'Gestión de usuarios', 1),
(3, 'Pantalla de inicio', 1),
(4, 'Asignación de Incidencias', 1),
(5, 'Registro de incidencias', 1),
(6, 'Diagnóstico de incidencias', 1),
(7, 'Reportes por carga de Trabajo', 1),
(8, 'Reportes de Trabajo por Categoria', 1),
(9, 'Reportes de Trabajo por bitácoras', 1);

-- --------------------------------------------------------

--
-- Table structure for table `t_prioridades`
--

DROP TABLE IF EXISTS `t_prioridades`;
CREATE TABLE IF NOT EXISTS `t_prioridades` (
  `cn_id_prioridad` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_prioridad` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id_prioridad`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_prioridades`
--

INSERT INTO `t_prioridades` (`cn_id_prioridad`, `ct_descripcion_prioridad`) VALUES
(1, 'Alto'),
(2, 'Medio'),
(3, 'Bajo');

-- --------------------------------------------------------

--
-- Table structure for table `t_registro_diagnosticos`
--

DROP TABLE IF EXISTS `t_registro_diagnosticos`;
CREATE TABLE IF NOT EXISTS `t_registro_diagnosticos` (
  `cn_id_diagnostico` int NOT NULL AUTO_INCREMENT,
  `cf_fecha_hora_diagnostico` datetime DEFAULT NULL,
  `ct_diagnostico` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_tiempo_estimado_reparacion` int DEFAULT NULL,
  `ct_observaciones` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ct_id_incidencia` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_usuario` int NOT NULL,
  PRIMARY KEY (`cn_id_diagnostico`),
  KEY `cn_id_usuario` (`cn_id_usuario`),
  KEY `ct_id_incidencia` (`ct_id_incidencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_riesgos`
--

DROP TABLE IF EXISTS `t_riesgos`;
CREATE TABLE IF NOT EXISTS `t_riesgos` (
  `cn_id_riesgo` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_riesgo` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id_riesgo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_riesgos`
--

INSERT INTO `t_riesgos` (`cn_id_riesgo`, `ct_descripcion_riesgo`) VALUES
(1, 'Muy Alto'),
(2, 'Alto'),
(3, 'Medio'),
(4, 'Bajo'),
(5, 'Muy Bajo');

-- --------------------------------------------------------

--
-- Table structure for table `t_roles`
--

DROP TABLE IF EXISTS `t_roles`;
CREATE TABLE IF NOT EXISTS `t_roles` (
  `cn_id_rol` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_rol` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cn_id_sistema` int NOT NULL,
  PRIMARY KEY (`cn_id_rol`),
  KEY `cn_id_sistema` (`cn_id_sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_roles`
--

INSERT INTO `t_roles` (`cn_id_rol`, `ct_descripcion_rol`, `cn_id_sistema`) VALUES
(1, 'Administrador', 1),
(2, 'Usuario', 1),
(3, 'Encargado', 1),
(4, 'Técnico', 1),
(5, 'Supervisor', 1);

-- --------------------------------------------------------

--
-- Table structure for table `t_roles_por_usuario`
--

DROP TABLE IF EXISTS `t_roles_por_usuario`;
CREATE TABLE IF NOT EXISTS `t_roles_por_usuario` (
  `cn_id_rol_por_usuario` int NOT NULL AUTO_INCREMENT,
  `cn_id_usuario` int NOT NULL,
  `cn_id_rol` int NOT NULL,
  PRIMARY KEY (`cn_id_rol_por_usuario`),
  KEY `cn_id_usuario` (`cn_id_usuario`),
  KEY `cn_id_rol` (`cn_id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_roles_por_usuario`
--

INSERT INTO `t_roles_por_usuario` (`cn_id_rol_por_usuario`, `cn_id_usuario`, `cn_id_rol`) VALUES
(1, 1, 2),
(2, 2, 2),
(3, 2, 3),
(4, 3, 2),
(5, 3, 4),
(6, 4, 2),
(7, 4, 5),
(8, 5, 1),
(9, 5, 2),
(10, 5, 3),
(11, 5, 4),
(12, 5, 5),
(13, 6, 1),
(14, 6, 2),
(15, 6, 3),
(16, 6, 4),
(17, 6, 5);

-- --------------------------------------------------------

--
-- Table structure for table `t_sistemas`
--

DROP TABLE IF EXISTS `t_sistemas`;
CREATE TABLE IF NOT EXISTS `t_sistemas` (
  `cn_id_sistema` int NOT NULL AUTO_INCREMENT,
  `ct_descripcion_sistema` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id_sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_sistemas`
--

INSERT INTO `t_sistemas` (`cn_id_sistema`, `ct_descripcion_sistema`) VALUES
(1, 'SGI'),
(2, 'SGI');

-- --------------------------------------------------------

--
-- Table structure for table `t_usuarios`
--

DROP TABLE IF EXISTS `t_usuarios`;
CREATE TABLE IF NOT EXISTS `t_usuarios` (
  `cn_id_usuario` int NOT NULL AUTO_INCREMENT,
  `ct_nombre_completo` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_cedula` varchar(15) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_descripcion_puesto` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_celular` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_id_departamento` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_correo_institucional` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_contrasena` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ct_token` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cn_id_usuario`),
  KEY `ct_id_departamento` (`ct_id_departamento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `t_usuarios`
--

INSERT INTO `t_usuarios` (`cn_id_usuario`, `ct_nombre_completo`, `ct_cedula`, `ct_descripcion_puesto`, `ct_celular`, `ct_id_departamento`, `ct_correo_institucional`, `ct_contrasena`, `ct_token`) VALUES
(1, 'Usuario demo', '11223344', 'Demo', '88888888', '1', 'demo@gmail.com', '$2b$10$Qvk2BqQuF.LuO6hU2XLP9uWdDNLkIOI43NQIVN.0E5j17maZHaQNy', NULL),
(2, 'Usuario Encargado', '11223344', 'Encargado', '88888888', '1', 'encargado@gmail.com', '$2b$10$GRc91xoQLKV6FlpNkNLEg.q/0TgKgzd4HoRJ3DHAi1rSGMaxndC52', NULL),
(3, 'Usuario Tecnico', '11223344', 'Tecnico', '88888888', '1', 'tecnico@gmail.com', '$2b$10$kl4iBiamKTepUzRNvWe/auP44eJrXp00gkDYyHNPnEAXD3l0MCTna', NULL),
(4, 'Usuario Supervisor', '11223344', 'Supervisor', '88888888', '1', 'Supervisor@gmail.com', '$2b$10$IFuL0RHJ00wjd2JA8AuFI.7w0s3UtQT0bOHSot6l/SnrURqo0R9za', NULL),
(5, 'Usuario admin', '11223344', 'admin', '88888888', '1', 'admin@gmail.com', '$2b$10$k9TkbsYuXgoE8Xopt9XZdOoiunBaDzxEGgbI3yj0a3eTFZWKs/xc.', NULL),
(6, 'Patrick Lisby Córdoba', '702830927', 'Admin Correo', '83582141', '1', 'lisby2103@gmail.com', '$2b$10$1ES0wobVVTU6zW6KmAfEH.8VFzcMA3h4bP64/6r3TZ11ruT.NBdIW', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `t_asignacion_incidencia_empleados`
--
ALTER TABLE `t_asignacion_incidencia_empleados`
  ADD CONSTRAINT `t_asignacion_incidencia_empleados_ibfk_1` FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios` (`cn_id_usuario`),
  ADD CONSTRAINT `t_asignacion_incidencia_empleados_ibfk_2` FOREIGN KEY (`ct_id_incidencia`) REFERENCES `t_incidencias` (`ct_id_incidencia`);

--
-- Constraints for table `t_bitacora_cambios_estado`
--
ALTER TABLE `t_bitacora_cambios_estado`
  ADD CONSTRAINT `t_bitacora_cambios_estado_ibfk_1` FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios` (`cn_id_usuario`),
  ADD CONSTRAINT `t_bitacora_cambios_estado_ibfk_2` FOREIGN KEY (`cn_id_estado`) REFERENCES `t_estados` (`cn_id_estado`);

--
-- Constraints for table `t_bitacora_cambios_general`
--
ALTER TABLE `t_bitacora_cambios_general`
  ADD CONSTRAINT `t_bitacora_cambios_general_ibfk_1` FOREIGN KEY (`cn_id_estado_nuevo`) REFERENCES `t_estados` (`cn_id_estado`),
  ADD CONSTRAINT `t_bitacora_cambios_general_ibfk_2` FOREIGN KEY (`ct_id_incidencia`) REFERENCES `t_incidencias` (`ct_id_incidencia`),
  ADD CONSTRAINT `t_bitacora_cambios_general_ibfk_3` FOREIGN KEY (`cn_id_usuario_del_cambio`) REFERENCES `t_usuarios` (`cn_id_usuario`);

--
-- Constraints for table `t_estados`
--
ALTER TABLE `t_estados`
  ADD CONSTRAINT `t_estados_ibfk_1` FOREIGN KEY (`cn_id_sistema`) REFERENCES `t_sistemas` (`cn_id_sistema`);

--
-- Constraints for table `t_imagenes_por_diagnosticos`
--
ALTER TABLE `t_imagenes_por_diagnosticos`
  ADD CONSTRAINT `t_imagenes_por_diagnosticos_ibfk_1` FOREIGN KEY (`cn_id_diagnostico`) REFERENCES `t_registro_diagnosticos` (`cn_id_diagnostico`),
  ADD CONSTRAINT `t_imagenes_por_diagnosticos_ibfk_2` FOREIGN KEY (`cn_id_imagen`) REFERENCES `t_imagenes` (`cn_id_imagen`);

--
-- Constraints for table `t_imagenes_por_incidencias`
--
ALTER TABLE `t_imagenes_por_incidencias`
  ADD CONSTRAINT `t_imagenes_por_incidencias_ibfk_1` FOREIGN KEY (`ct_id_incidencia`) REFERENCES `t_incidencias` (`ct_id_incidencia`),
  ADD CONSTRAINT `t_imagenes_por_incidencias_ibfk_2` FOREIGN KEY (`cn_id_imagen`) REFERENCES `t_imagenes` (`cn_id_imagen`);

--
-- Constraints for table `t_incidencias`
--
ALTER TABLE `t_incidencias`
  ADD CONSTRAINT `t_incidencias_ibfk_1` FOREIGN KEY (`cn_id_estado`) REFERENCES `t_estados` (`cn_id_estado`),
  ADD CONSTRAINT `t_incidencias_ibfk_2` FOREIGN KEY (`cn_id_prioridad`) REFERENCES `t_prioridades` (`cn_id_prioridad`),
  ADD CONSTRAINT `t_incidencias_ibfk_3` FOREIGN KEY (`cn_id_categoria`) REFERENCES `t_categorias` (`cn_id_categoria`),
  ADD CONSTRAINT `t_incidencias_ibfk_4` FOREIGN KEY (`cn_id_riesgo`) REFERENCES `t_riesgos` (`cn_id_riesgo`),
  ADD CONSTRAINT `t_incidencias_ibfk_5` FOREIGN KEY (`cn_id_afectacion`) REFERENCES `t_afectaciones` (`cn_id_afectacion`),
  ADD CONSTRAINT `t_incidencias_ibfk_6` FOREIGN KEY (`cn_id_usuario_registro`) REFERENCES `t_usuarios` (`cn_id_usuario`);

--
-- Constraints for table `t_pantallas`
--
ALTER TABLE `t_pantallas`
  ADD CONSTRAINT `t_pantallas_ibfk_1` FOREIGN KEY (`cn_id_sistema`) REFERENCES `t_sistemas` (`cn_id_sistema`);

--
-- Constraints for table `t_registro_diagnosticos`
--
ALTER TABLE `t_registro_diagnosticos`
  ADD CONSTRAINT `t_registro_diagnosticos_ibfk_1` FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios` (`cn_id_usuario`),
  ADD CONSTRAINT `t_registro_diagnosticos_ibfk_2` FOREIGN KEY (`ct_id_incidencia`) REFERENCES `t_incidencias` (`ct_id_incidencia`);

--
-- Constraints for table `t_roles`
--
ALTER TABLE `t_roles`
  ADD CONSTRAINT `t_roles_ibfk_1` FOREIGN KEY (`cn_id_sistema`) REFERENCES `t_sistemas` (`cn_id_sistema`);

--
-- Constraints for table `t_roles_por_usuario`
--
ALTER TABLE `t_roles_por_usuario`
  ADD CONSTRAINT `t_roles_por_usuario_ibfk_1` FOREIGN KEY (`cn_id_usuario`) REFERENCES `t_usuarios` (`cn_id_usuario`),
  ADD CONSTRAINT `t_roles_por_usuario_ibfk_2` FOREIGN KEY (`cn_id_rol`) REFERENCES `t_roles` (`cn_id_rol`);

--
-- Constraints for table `t_usuarios`
--
ALTER TABLE `t_usuarios`
  ADD CONSTRAINT `t_usuarios_ibfk_1` FOREIGN KEY (`ct_id_departamento`) REFERENCES `t_departamentos` (`ct_id_departamento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
