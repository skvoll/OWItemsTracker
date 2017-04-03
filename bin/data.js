#!/usr/bin/env node

"use strict";

const fs = require('fs');
const parser = require('./parser');

let commands = ['help', 'import', 'server',];
let args = {}, command = help;

process.argv.map((arg, index) => {
    if (index < 2) {
        return;
    }

    if (commands.indexOf(arg) !== -1) {
        switch (arg) {
            case 'help':
                command = help;
                break;
            case 'import':
                command = importItems;
                break;
            case 'server':
                command = server;
                break;
        }
    }

    if (arg.indexOf('-') === 0) {
        args[arg[1]] = arg.slice(2);
        if (args[arg[1]] === '') {
            args[arg[1]] = true;
        }
    }
});

command(args);

function error(error, exit = true) {
    console.log(`error: ${error}`);

    if (exit) {
        process.exit();
    }
}

function help(args = null) {
    console.log(``);
    console.log(`commands:`);
    console.log(`  help: show this message`);
    console.log(`  import: import items from OverTool`);
    console.log(`  server: run web server`);
    console.log(`params:`);
    console.log(`  help:`);
    console.log(`    -c: help message for command`);
    console.log(`  import:`);
    console.log(`    -p: path to sources from OverTool`);
    console.log(`    -t: import translations`);
    console.log(`    -l: translations locale (if not setted then translations will be sent to output)`);
    // console.log(`  server:`);
    // console.log(`    -p: port (default 8080)`);
    console.log(``);
}

function importItems(args) {
    parser(args['p'], (args['t'] !== undefined), args['l']);
}

function server(args = null) {
    const http = require('http');

    fs.readFile('./database.html', function (err, html) {
        if (err) {
            throw err;
        }

        http.createServer(function (request, response) {
            let headers = request.headers;
            let method = request.method;
            let url = request.url;
            let body = [];

            request.on('error', function (err) {
                console.error(err);
            }).on('data', function (chunk) {
                body.push(chunk);
            }).on('end', function () {
                body = Buffer.concat(body).toString();

                response.writeHeader(200, {"Content-Type": "text/html"});
                response.write(html);
                response.end();
            });
        }).listen(args['p'] || 8080);

        console.log(`server started on port ${args['p'] || 8080}`);
    });
}
