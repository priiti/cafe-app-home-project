const cluster = require('cluster');

if (cluster.isMaster) {
    const numCPUs = require('os').cpus().length;

    console.log(`Setting up workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        console.log(`Worker ${worker.process.pid} is online.`);
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker} died, code: ${code}, signal: ${signal}.`);
        cluster.fork();
    });
} else {
    require('./index');
}