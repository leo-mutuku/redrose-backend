var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'Hello World',
    description: 'The nodejs.org example web server.',
    script: 'D:\\Felex\\personal\\redrose-backend\\src\\index.ts',
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
    //, workingDirectory: '...'
    , allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

svc.install();