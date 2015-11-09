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

CREATE TABLE drustvena_mreza.profile (
  id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(45),
  last_name varchar(45),
  profile_image_id	int(11),
  relationship_status_id	int(4),
  country	varchar(45),
  city	varchar(45),
  adress	varchar(45),
  job	varchar(45),
  
  PRIMARY KEY (`id`),
  foreign key(`relationship_status_id`) references drustvena_mreza.relationship_status(`id`)
);

CREATE TABLE drustvena_mreza.user (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(45) NOT NULL,
  password_hash varchar(60) NOT NULL,
  email varchar(45) NOT NULL,
  registration_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  profile_id	int(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `profile_UNIQUE` (`profile_id`),
  FOREIGN KEY(`profile_id`) REFERENCES `drustvena_mreza`.`profile` (`id`)
);

CREATE TABLE drustvena_mreza.relationship(
	relationship_id	int(11) NOT NULL AUTO_INCREMENT,
    relationship_type_id	int(11),
    user_id1	int(11) NOT NULL,
    user_id2	int(11) NOT NULL,
    
	primary key(`relationship_id`),
    foreign key(`relationship_type_id`) 
		references drustvena_mreza.relationship_type(`id`),
	foreign key(`user_id1`) 
		references drustvena_mreza.user(`id`),
	foreign key(`user_id2`) 
		references drustvena_mreza.user(`id`)
);


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
