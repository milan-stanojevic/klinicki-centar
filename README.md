# klinicki-centar

Potrebno je preuzeti node.js sa linka: https://nodejs.org/en/

Potrebno je preuzeti MongoDB server sa linka: https://www.mongodb.com/download-center/community

Instrukcije za podesavanje MongoDB baze podataka

Pokrenite: 
```
C:\Program Files\MongoDB\Server\4.2\bin>mongo
```

Selektujte bazu:

```
use klinicki_centar_db
```

Kreirajte korisnika za bazu:

```
db.createUser(
  {
    user: "root",
    pwd: "31fi$gyfai2k",
    roles: [ { role: "readWrite", db: "klinicki_centar_db" } ]
  }
)
```



Kreirajte predefinisanog admina klinickog centra (username: admin, password: admin):
```
db.admins.insertOne({username: 'admin', pk: '$2b$10$aAdxTYM3XSa5XpqsDTgT1uXNJ3gbOBNzVhC4/9TX55dCUllAyAKfy'});
```

Selektujte testnu bazu:
```
use klinicki_centar_test_db
```

Kreirajte korisnika za testnu bazu:

```
db.createUser(
  {
    user: "root",
    pwd: "31fi$gyfai2k",
    roles: [ { role: "readWrite", db: "klinicki_centar_test_db" } ]
  }
)
```

Instalirajte potrebne pakete za pokretanje backenda komandom u backend folderu
```
npm install
```

Instalirajte potrebne pakete za pokretanje frontenda komandom u frontend folderu
```
npm install
```

Pokretanje backenda vrsi se komandom u backend folderu
```
npm run dev
```


Pokretanja frontenda vrsi se komandom u frontend folderu
```
npm start
```


Pokretanje testova vrsi se komandom u backend folderu (fronted mora biti pokrenut prije pokretanja testova)
```
npm run test
```
