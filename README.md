-- Install the following command 

1- npm init
2- npm install express ts-node typescript @type/express nodemon body-parser mysql @type/mysql dotenv
3- tsc --init
4- npm init // start the program 



---- Created table using query

Oracle 
CREATE TABLE REPORTUSER.VOUCHER_CONVERSION
(
  ROW_ID        NUMBER GENERATED ALWAYS AS IDENTITY ( START WITH 1 MAXVALUE 9999999999999999999999999999 MINVALUE 1 CYCLE CACHE 20 ORDER KEEP) NOT NULL,
  VOU_SID       VARCHAR2(50 BYTE),
  VOU_NO        NUMBER,
  STORE_NO      NUMBER,
  PENDING       NUMBER                          DEFAULT 0,
  TOTAL_QTY     NUMBER                          DEFAULT 0
)

MYSQL 

CREATE DATABASE`voucher_conversions` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `voucher_conversions`;

CREATE TABLE `voucher_conversions` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `DATE_PAYLOAD` blob NOT NULL,
  `VOU_SID` varchar(40) DEFAULT NULL,
  `VOU_NO` varchar(20) DEFAULT NULL,
  `STORE_NO` int(20) DEFAULT 0,
  `PENDING` tinyint(1) DEFAULT 0,
  `TOTAL_QTY` int(40) DEFAULT 0,
  PRIMARY KEY (`row_id`)
)

ALTER TABLE `voucher_conversions`.`voucher_conversions`
  ADD UNIQUE INDEX `Uunique_value` (`VOU_SID`, `VOU_NO`);

voucher_conversions