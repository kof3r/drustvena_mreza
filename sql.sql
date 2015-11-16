drop database drustvena_mreza;

CREATE schema drustvena_mreza;

CREATE TABLE drustvena_mreza.relationship_status(
	id	int(11) NOT NULL AUTO_INCREMENT,
    description	varchar(100),
    
	primary key(`id`)
);

CREATE TABLE drustvena_mreza.relationship_type(
	id	int(11) NOT NULL AUTO_INCREMENT,
    description	varchar(100),
    
	primary key(`id`)
);

CREATE TABLE drustvena_mreza.content_info(
	id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(200),
    description text,
    mime_type	varchar(50),
    
    primary key(`id`)
);

CREATE TABLE drustvena_mreza.bubble(
	id	int(11) NOT NULL AUTO_INCREMENT,
    user_id	int(11) NOT NULL,
    content_info_id	int(11),
    
	primary key(`id`),
	foreign key(`content_info_id`) 
		references drustvena_mreza.content_info(`id`)
);

CREATE TABLE drustvena_mreza.picture(
	id	int(11) NOT NULL AUTO_INCREMENT,
    bubble_id	int(11) NOT NULL,
    content_info_id	int(11),
    embed_src	varchar(1000) NOT NULL,
    
	primary key(`id`),
	foreign key(`bubble_id`) 
		references drustvena_mreza.bubble(`id`),
	foreign key(`content_info_id`) 
		references drustvena_mreza.content_info(`id`)
);

CREATE TABLE drustvena_mreza.profile (
  id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(45),
  middle_name varchar(45),
  last_name varchar(45),
  profile_image_id	int(11),
  relationship_status_id	int(4),
  country	varchar(45),
  city	varchar(45),
  adress	varchar(45),
  job	varchar(45),
  
  PRIMARY KEY (`id`),
  foreign key(`relationship_status_id`) references drustvena_mreza.relationship_status(`id`),
  foreign key(`profile_image_id`) references drustvena_mreza.picture(`id`)
);

CREATE TABLE drustvena_mreza.user (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(45) NOT NULL,
  password_hash varchar(60) NOT NULL,
  email varchar(45) NOT NULL,
  first_name varchar(45) NOT NULL,
  last_name varchar(45) NOT NULL,
  middle_name varchar(45) NOT NULL,
  confirmed varchar(20) NOT NULL,
  registration_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  profile_id	int(11),

  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `profile_UNIQUE` (`profile_id`),
  FOREIGN KEY(`profile_id`) REFERENCES `drustvena_mreza`.`profile` (`id`)
);

CREATE TABLE drustvena_mreza.relationship(
	id	int(11) NOT NULL AUTO_INCREMENT,
    relationship_type_id	int(11),
    user_id1	int(11) NOT NULL,
    user_id2	int(11) NOT NULL,
    
	primary key(`id`),
    foreign key(`relationship_type_id`) 
		references drustvena_mreza.relationship_type(`id`),
	foreign key(`user_id1`) 
		references drustvena_mreza.user(`id`),
	foreign key(`user_id2`) 
		references drustvena_mreza.user(`id`)
);


CREATE TABLE drustvena_mreza.video(
	id	int(11) NOT NULL AUTO_INCREMENT,
    bubble_id	int(11) NOT NULL,
    content_info_id	int(11),
    embed_src	varchar(1000) NOT NULL,
    
	primary key(`id`),
	foreign key(`bubble_id`) 
		references drustvena_mreza.bubble(`id`),
	foreign key(`content_info_id`) 
		references drustvena_mreza.content_info(`id`)
);

CREATE TABLE drustvena_mreza.post(
	id	int(11) NOT NULL AUTO_INCREMENT,
    bubble_id	int(11) NOT NULL,
    content_info_id	int(11),
    
	primary key(`id`),
	foreign key(`bubble_id`) 
		references drustvena_mreza.bubble(`id`),
	foreign key(`content_info_id`) 
		references drustvena_mreza.content_info(`id`)
);


alter table drustvena_mreza.bubble	
	add constraint foreign key(`user_id`) 
		references drustvena_mreza.user(`id`);


insert into drustvena_mreza.relationship_status(`description`)
	values("Single");
insert into drustvena_mreza.relationship_status(`description`)
	values("In a relationship");
insert into drustvena_mreza.relationship_status(`description`)
	values("Complicated");
insert into drustvena_mreza.relationship_status(`description`)
	values("Other");
    

insert into drustvena_mreza.relationship_type(`description`)
	values("Friend");
insert into drustvena_mreza.relationship_type(`description`)
	values("Contact");
insert into drustvena_mreza.relationship_type(`description`)
	values("Colleague");
insert into drustvena_mreza.relationship_type(`description`)
	values("Associate");
insert into drustvena_mreza.relationship_type(`description`)
	values("Employee");
insert into drustvena_mreza.relationship_type(`description`)
	values("Employer");
insert into drustvena_mreza.relationship_type(`description`)
	values("Following");
insert into drustvena_mreza.relationship_type(`description`)
	values("Other");
