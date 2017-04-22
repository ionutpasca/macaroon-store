module.exports = {
    port: 8081,
    host: '<HOST>',
    app: {
        name: 'Macaroon Store'
    },
	//SALT_FACTOR:
    database: {
        client: 'mysql',
        connection: {
            host: '<DB HOST>',
            user: '<DB USER>',
            password: '<DB PASS>',
            database: '<DATABASE>'
        },
        pool: {
            min: 2,
            max: 20
        },
        acquireConnectionTimeout: 10000,
        migrations: {
            tableName: 'migrations'
        }
    }
};