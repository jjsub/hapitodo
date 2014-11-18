var port = process.env.PORT;
var Hapi = require('hapi');
var db   = process.env.DB;
var joi  = require('joi');
var server = new Hapi.Server(port);

var mongoose = require('mongoose');
mongoose.connect(db);
var Schema = mongoose.Schema;

var Priority = mongoose.model('Priority', { name: String, color: String });

var Task = mongoose.model('Task', { name: String, date: Date, priority: Schema.Types.ObjectId });



server.route({
    config:{
        description: 'This is the Home route',
        notes:'Feel like in home',
        tags: ['nice','calida','Yea']
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Home!');
    }
});

server.route({
    config:{
        description: 'This is the about',
        notes:'About this great to do list',
        tags: ['bla']
    },
    method: 'GET',
    path: '/about',
    handler: function (request, reply) {
        reply('About');
    }
});


server.route({
    method: 'POST',
    path: '/priorities',
    handler: function (request, reply) {
        var prio = new Priority(request.payload);
        prio.save(function () {
            reply(prio);
        });
    }
});
server.route({
    method: 'GET',
    path: '/priorities/{param*}',// this show everthing on the dir
    handler: function(request, reply){
        Priority.find(function(err, priorities){
          reply(priorities);
        });
    }
});

/*server.route({
    method: 'GET',
    path: '/task/{param*}',// this show everthing on the dir
    handler: function(request, reply){
        Task.find(function(err, tasks){
            reply(tasks);
            Task.all
        });
    }
});*/





// ********    Task    ********* //




server.route({
   method: 'POST',
    path:'/tasks',
    handler: function(request, replay){
     var t = new Task(request.payload);
        t.save(function(){
           replay(t);

        });
    }
});

server.route({
    method:'GET',
    path:'tasks/{param*}',
    handler: function(request, replay){
        Task.find(function(err, tasks){
           replay(tasks);
        });
    }
});


server.pack.register(

    [
        {
            plugin: require('good'),
            options: {

                reporters: [{
                    reporter: require('good-console'),
                    args: [{log: '*', request: '*'}]
                }]
            }
        },
        { plugin: require('lout') }
    ], function(err){
        if (err){
            throw err; // something bad happened loading the plugin
        }



        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });
