-- [TABLE CREATE SQL] inspect_result
CREATE TABLE `inspect_result` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `age` varchar(100) DEFAULT NULL,
  `first` varchar(100) DEFAULT NULL,
  `second` varchar(100) DEFAULT NULL,
  `third` varchar(100) DEFAULT NULL,
  `total` varchar(100) DEFAULT NULL,
  `addedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

