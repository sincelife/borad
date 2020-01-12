CREATE TABLE `board` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '글개수',
	`title` VARCHAR(255) NOT NULL COMMENT '글제목' COLLATE 'utf8mb4_unicode_ci',
	`writer` VARCHAR(255) NOT NULL COMMENT '작성자' COLLATE 'utf8mb4_unicode_ci',
	`wdate` DATETIME NOT NULL COMMENT '작성날짜',
	`rnum` INT(11) NOT NULL DEFAULT '0' COMMENT '조회수',
	`content` TEXT NULL COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=21
;
