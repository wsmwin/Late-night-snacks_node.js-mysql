CREATE TABLE category (
  cId int(11) NOT NULL AUTO_INCREMENT,
  cName varchar(20) NOT NULL,
  PRIMARY KEY(cId)
);
 
INSERT INTO category VALUES (1, 'chicken');
INSERT INTO category VALUES (2, 'pizza');
INSERT INTO category VALUES (3, 'side menu');


CREATE TABLE menu (
  mId int(11) NOT NULL AUTO_INCREMENT,
  cId int(11) NOT NULL,
  mName varchar(30) NOT NULL,
  mPrice int(20) NOT NULL,
  mDescription text,
  mPicture text,
  PRIMARY KEY(mId),
  FOREIGN KEY(cId) REFERENCES category(cId) ON UPDATE CASCADE
);

INSERT INTO menu VALUES (1, 1, 'Fried Chicken', 15000, '국내산 싱싱닭을 해바라기유로 튀겨 바삭하고 고소한 맛의 절정', 'http://kookmingps.cafe24.com/diary/chicken1.png');
INSERT INTO menu VALUES (2, 1, 'Seasoned Chicken', 16000, '매콤달콤한 맛의 감동이 몰려오는 양념치킨을 즐겨보세요~', 'http://kookmingps.cafe24.com/diary/chicken2.png');
INSERT INTO menu VALUES (3, 1, 'BBuringcle Chicken', 17000, '크런치한 식감의 스프링클 후라이드 치킨에 딥소스까지!', 'http://kookmingps.cafe24.com/diary/chicken3.png');
INSERT INTO menu VALUES (4, 2, 'Shrimp Steak All In Pizza', 20000, '탱글한 쉬림프와 부드러운 안창살 스테이크를 한 판에 즐길 수 있는 일석 이조 피자', 'http://kookmingps.cafe24.com/diary/pizza1.png');
INSERT INTO menu VALUES (5, 2, 'Garlic Marble Steak Pizza', 19000, '프리미엄 마블링의 안창살 스테이크를 부드럽게 숙성하여 풍성한 육즙과 살살 녹는 식감', 'http://kookmingps.cafe24.com/diary/pizza2.png');
INSERT INTO menu VALUES (6, 2, 'Bacon Potato Pizza', 18000, '담백한 포테이토 큐브 위에 육즙 가득한 훈연 베이컨을 얹어 화르륵 구어낸 후, 새콤한 소스로 마무리!', 'http://kookmingps.cafe24.com/diary/pizza3.png');
INSERT INTO menu VALUES (7, 3, 'Cheese Ball', 5000, '겉은 블루치즈와 체다치즈 속은 쫄깃한 모짜렐라 치즈가 쭈욱', 'http://kookmingps.cafe24.com/diary/side1.png');
INSERT INTO menu VALUES (8, 3, 'Sausage Dduk', 3000, '매콤달콤한 빨간 비엔나 소세지와 가래떡의 찰떡궁합!', 'http://kookmingps.cafe24.com/diary/side2.png');


CREATE TABLE diary (
  dId int(11) NOT NULL AUTO_INCREMENT,
  dTime datetime NOT NULL,
  dTitle varchar(30) NOT NULL,
  dDesc text,
  mId int(11) NOT NULL,
  mMany int(3) NOT NULL,
  oPrice int(20) NOT NULL,
  PRIMARY KEY(dId),
  FOREIGN KEY(mId) REFERENCES menu(mId) ON UPDATE CASCADE
);
 
INSERT INTO diary VALUES (1, now(), 'testTitle', 'testDescription', 1, 10, 100000);
INSERT INTO diary VALUES (2, now(), 'testTitle2', 'testDescription2', 2, 20, 200000);