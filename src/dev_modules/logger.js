const winston = require('winston');


import env from "env";

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'warning',
            filename: './logs/warnings.log'
        })
    ]
});

const infoConsole = new winston.transports.Console({
    level: 'info'
});

const debugConsole = new winston.transports.Console({
    level: 'debug'
});
const warnConsole = new winston.transports.Console({
    level: 'warn'
});

//uncoment the following line to allow extensive logging
//env.name = "developmentBugChasing";

if (env.name === "development") {
    //development specific logic
    console.log('env is development');
    logger.level = 'debug';
    logger.add(infoConsole);
} else if (env.name === "developmentBugChasing") {
    //development specific logic
    console.log('env is development');
    logger.level = 'debug';
    logger.add(debugConsole);
}else if (env.name === "test") {
    //testing specific logic
    console.log('env is test');
    logger.level = 'debug';
    logger.add(debugConsole);
} else {
    //production specific logic
    console.log('env is production');
    logger.level = 'warn';
    logger.add(warnConsole);
}


module.exports = logger;