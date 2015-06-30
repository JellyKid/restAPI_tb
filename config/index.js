var nconf = require('nconf')
    ,path = require('path');

nconf.env()

switch(nconf.get('NODE_ENV')){
    case 'prod':
        var configPath = path.join(__dirname, 'config-prod.json');
        break;
    case 'test':
        var configPath = path.join(__dirname, 'config-test.json');
        break;
    case 'dev':
        var configPath = path.join(__dirname, 'config-dev.json');
        break;
}

nconf.file(configPath);

module.exports = nconf;