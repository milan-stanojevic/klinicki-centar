# klinicki-centar

Instrukcije za podesavanje MongoDB baze podataka

Pokrenite: 
C:\Program Files\MongoDB\Server\4.2\bin>mongo

Selektujte bazu:

use klinicki_centar_db

Kreirajte korisnika za bazu:

db.createUser(
  {
    user: "root",
    pwd: "31fi$gyfai2k",
    roles: [ { role: "readWrite", db: "klinicki_centar_db" } ]
  }
)


Kreirajte predefinisanog admina klinickog centra (username: admin, password: admin):

db.admins.insertOne({username: 'admin', pk: '$2b$10$aAdxTYM3XSa5XpqsDTgT1uXNJ3gbOBNzVhC4/9TX55dCUllAyAKfy'});