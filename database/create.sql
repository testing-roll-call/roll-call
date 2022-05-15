-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema heroku_f94932c1d70fb93
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema heroku_f94932c1d70fb93
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `heroku_f94932c1d70fb93` DEFAULT CHARACTER SET utf8 ;
USE `heroku_f94932c1d70fb93` ;

-- -----------------------------------------------------
-- Table `heroku_f94932c1d70fb93`.`courses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_f94932c1d70fb93`.`courses` (
  `course_id` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `heroku_f94932c1d70fb93`.`classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_f94932c1d70fb93`.`classes` (
  `class_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE INDEX `class_id_UNIQUE` (`class_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_f94932c1d70fb93`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_f94932c1d70fb93`.`users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_role` ENUM('TEACHER', 'STUDENT') NOT NULL,
  `email` VARCHAR(127) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `class_id` INT(11) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `part_of_class_idx` (`class_id` ASC),
  CONSTRAINT `part_of_class`
    FOREIGN KEY (`class_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`classes` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 35
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `heroku_f94932c1d70fb93`.`lectures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_f94932c1d70fb93`.`lectures` (
  `lecture_id` INT(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` INT(11) NOT NULL,
  `start_date_time` DATETIME NOT NULL,
  `course_id` INT(11) NOT NULL,
  `class_id` INT(11) NOT NULL,
  PRIMARY KEY (`lecture_id`),
  INDEX `class_idx` (`course_id` ASC),
  INDEX `teacher_idx` (`teacher_id` ASC),
  INDEX `class_idx1` (`class_id` ASC),
  CONSTRAINT `course`
    FOREIGN KEY (`course_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`courses` (`course_id`),
  CONSTRAINT `teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`users` (`user_id`),
  CONSTRAINT `class`
    FOREIGN KEY (`class_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`classes` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 145
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `heroku_f94932c1d70fb93`.`attendance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_f94932c1d70fb93`.`attendance` (
  `attendance_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `lecture_id` INT(11) NOT NULL,
  `is_attending` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attendance_id`),
  INDEX `student_idx` (`user_id` ASC),
  INDEX `teacher_idx` (`lecture_id` ASC),
  CONSTRAINT `lecture`
    FOREIGN KEY (`lecture_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`lectures` (`lecture_id`),
  CONSTRAINT `student`
    FOREIGN KEY (`user_id`)
    REFERENCES `heroku_f94932c1d70fb93`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3025
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
