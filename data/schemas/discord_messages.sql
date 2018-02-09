/*
 Navicat MySQL Data Transfer

 Source Server         : Jupiter
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : 147.135.193.9
 Source Database       : hopline

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : utf-8

 Date: 02/09/2018 09:33:57 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `discord_messages`
-- ----------------------------
DROP TABLE IF EXISTS `discord_messages`;
CREATE TABLE `discord_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) DEFAULT NULL,
  `discord_author_id` varchar(50) DEFAULT NULL,
  `discord_author_username` varchar(50) DEFAULT NULL,
  `discord_channel_id` varchar(50) DEFAULT NULL,
  `discord_channel_name` varchar(50) DEFAULT NULL,
  `discord_content` mediumtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13630 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
