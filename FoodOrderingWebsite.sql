CREATE DATABASE  IF NOT EXISTS `foodorderingwesitedb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `foodorderingwesitedb`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: foodorderingwesitedb
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(45) NOT NULL,
  `admin_email` varchar(45) NOT NULL,
  `admin_password` varchar(45) NOT NULL,
  `admin_mobile` varchar(45) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin_fury','admin_fury@gmail.com','123456789','7563259210');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(45) NOT NULL,
  `item_type` varchar(45) NOT NULL,
  `item_category` varchar(45) NOT NULL,
  `item_serving` varchar(45) NOT NULL,
  `item_calories` int NOT NULL,
  `item_price` int NOT NULL,
  `item_rating` varchar(45) NOT NULL,
  `item_img` varchar(255) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Omelette','Non-Veg','breakfast','1',60,60,'4.3','Omelette.jpg'),(2,'Vegetable Sandwich','Veg','breakfast','1',60,40,'5.0','Vegetable Sandwich.jpg'),(4,'Fruit Salad','Veg','breakfast','1',80,80,'5.0','FriutSalad.jpg'),(5,'Egg Briyani','Non-Veg','lunch','1',180,120,'4.5','Egg Briyani.jpg'),(6,'Fish Curry','Non-Veg','lunch','1',180,200,'4.8','Fish Curry.jpg'),(7,'Masala Dosa','Veg','lunch','1',100,100,'4.6','MasalaDosa.jpg'),(8,'Veg Platter','Veg','dinner','1',120,200,'4.3','Thaali.jpg'),(9,'Chicken Roti','Non-Veg','dinner','1',180,200,'4.5','Chicken Roti.jpg'),(10,'Fried Rice','Veg','dinner','1',150,120,'4.0','Fried Rice.jpg'),(11,'Oreo Shake','Veg','beverages','1',80,90,'4.1','Oreao Shake.jpg'),(12,'Pineapple Juice','Veg','beverages','1',50,60,'4.4','Pineapple Juice.jpg'),(13,'Lemonade','Veg','beverages','1',50,60,'5.0','Lemonade.jpg'),(14,'Strawberry Icecream','Veg','desserts','2',80,90,'4.8','Icecream.jpg'),(15,'CupCake','Non-Veg','desserts','2',100,60,'4.2','Cupcake.jpg'),(16,'Gulab Jammun','Veg','desserts','2',100,90,'5.0','Gulabjammun.jpg'),(18,'Khaman-Dhokla With Pudina Chutney','Veg','breakfast','1',110,100,'5.0','Khaman-Dhokla.jpg');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_dispatch`
--

DROP TABLE IF EXISTS `order_dispatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_dispatch` (
  `order_id` varchar(500) NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_dispatch`
--

LOCK TABLES `order_dispatch` WRITE;
/*!40000 ALTER TABLE `order_dispatch` DISABLE KEYS */;
INSERT INTO `order_dispatch` VALUES ('01434da8-d937-41e7-a763-c3521fd33d7c',2,6,1,200,'2022-06-24 15:34:11'),('9c059a01-adda-47e8-aefa-464f81e8842a',2,13,1,60,'2022-06-24 15:46:55');
/*!40000 ALTER TABLE `order_dispatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(500) NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('70350c30-73ff-4968-b3dc-92910f498bfd',2,6,1,200,'2022-06-24 15:42:16'),('88cec9b5-6281-4cf5-b280-221672c696a0',2,9,1,200,'2022-06-24 13:17:46'),('d6d48ec1-ab9b-4007-bd0e-44f681681c3d',2,6,1,200,'2022-06-24 13:21:37');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) NOT NULL,
  `user_address` varchar(255) NOT NULL,
  `user_email` varchar(45) NOT NULL,
  `user_password` varchar(1000) NOT NULL,
  `user_mobileno` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Tom Holland','B-54, Downtown, Queens, Newyork','iamspiderman@gmail.com','123456789','9632012542'),(2,'Ironman','LA','iamironman@gmail.com','123456789','7854120365');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-24 17:02:16
