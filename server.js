const config = require('./config/main');
const knex = require('knex');
const quark = require('quark')();

const ENV = process.env.NODE_ENV || 'development';
const knexInstance = knex(config.database);

['users'].forEach(service => {
    const s = require(`./services/${service}`);
    quark.use(s.initialize(knexInstance));
});

if (!module.parent) {
    quark.listen({ port: config.port, hostname: config.host }, (err, addr) => {
        if (err) {
            throw err;
        }
        console.log(`${config.app.name} is running, listening on port ${config.port}, environment: ${ENV.toLowerCase()}`);
    });
}

exports.quark = quark;