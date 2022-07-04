-- Install the following command 

1- npm init
2- npm install express ts-node typescript @type/express nodemon body-parser mysql @type/mysql dotenv
3- tsc --init
4- npm init // start the program 



---- Created table using query

CREATE TABLE REPORTUSER.VOUCHER_CONVERSION
(
  ROW_ID        NUMBER GENERATED ALWAYS AS IDENTITY ( START WITH 1 MAXVALUE 9999999999999999999999999999 MINVALUE 1 CYCLE CACHE 20 ORDER KEEP) NOT NULL,
  DATE_PAYLOAD  NCLOB                           NOT NULL,
  VOU_SID       VARCHAR2(50 BYTE),
  VOU_NO        NUMBER,
  STORE_NO      NUMBER,
  PENDING       NUMBER                          DEFAULT 0,
  TOTAL_QTY     NUMBER                          DEFAULT 0
)

voucher_conversions