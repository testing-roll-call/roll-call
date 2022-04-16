-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rollcall
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rollcall
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `rollcall`;
CREATE SCHEMA IF NOT EXISTS `rollcall` DEFAULT CHARACTER SET utf8 ;
USE `rollcall` ;

-- -----------------------------------------------------
-- Table `rollcall`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rollcall`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_role` ENUM("TEACHER", "STUDENT") NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rollcall`.`classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rollcall`.`classes` (
  `class_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rollcall`.`teachers_classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rollcall`.`teachers_classes` (
  `class_teacher_id` INT NOT NULL AUTO_INCREMENT,
  `teacher_id` INT NOT NULL,
  `start_date_time` DATETIME NOT NULL,
  `class_id` INT NOT NULL,
  PRIMARY KEY (`class_teacher_id`),
  INDEX `class_idx` (`class_id` ASC) VISIBLE,
  INDEX `teacher_idx` (`teacher_id` ASC) VISIBLE,
  CONSTRAINT `class`
    FOREIGN KEY (`class_id`)
    REFERENCES `rollcall`.`classes` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `rollcall`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rollcall`.`attendance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rollcall`.`attendance` (
  `attendance_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `class_teacher_id` INT NOT NULL,
  `is_attending` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`attendance_id`),
  INDEX `student_idx` (`user_id` ASC) VISIBLE,
  INDEX `teacher_idx` (`class_teacher_id` ASC) VISIBLE,
  CONSTRAINT `student`
    FOREIGN KEY (`user_id`)
    REFERENCES `rollcall`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `class_teacher`
    FOREIGN KEY (`class_teacher_id`)
    REFERENCES `rollcall`.`teachers_classes` (`class_teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
