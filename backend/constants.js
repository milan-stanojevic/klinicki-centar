const dbAuth = {
    username: 'root',
    password: '31fi$gyfai2k',
    dbName: 'klinicki_centar_db',
    server: '127.0.0.1:27017'
}

const dbAuthTest = {
    username: 'root',
    password: '31fi$gyfai2k',
    dbName: 'klinicki_centar_test_db',
    server: '127.0.0.1:27017'
}

//db.createUser( { user: "root", pwd: "31fi$gyfai2k", roles: [ { role: "readWrite", db: "klinicki_centar_test_db" } ] } )



var isInTest = typeof global.it === 'function';


module.exports = {
    dbAuth: isInTest ? dbAuthTest : dbAuthTest
}