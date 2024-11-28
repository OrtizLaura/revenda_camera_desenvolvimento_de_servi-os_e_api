-- CreateTable
CREATE TABLE `cameras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(10) NOT NULL,
    `marca` VARCHAR(20) NOT NULL,
    `ano` SMALLINT NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `classificacao` ENUM('DLSR', 'MIRROLEX', 'COMPACTA') NOT NULL DEFAULT 'DLSR',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
