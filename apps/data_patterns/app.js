const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3005;

app.use(express.static(__dirname));

app.all("/", function (req, res) {
    res.send(
        pageHTML("dp_data2.js")
    );
});

app.listen(port, function () {
    console.log('Server running on https://localhost:' + port);
});

function pageHTML(dataFile) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>DataPatterns</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
            ${headIncludes()}
            
            <script src="${dataFile}"></script>
            
        </head>
        <body>
            <div id="topnav">
                <div id="menutoggle" class="menu-collapsed" onclick="toggleMenu()">
                    <i class="fa fa-navicon"></i>
                </div>
                <div id="logowrapper">
                    <div id="logo"></div>
                    <div id="appname">DataPatterns</div>
                </div>
                <div id="searchbar"></div>
                <div id="rightoptions"></div>
            </div>
            <div id="leftnav" class="menu-collapsed"></div>
            <div id="content"></div>
            <script src="widget_config.js"></script>
            <script src="main.js"></script>
        </body>
    </html>`;
}
function headIncludes() {
    return `
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="main.css" />
    <script src="node_modules/@hpcc-js/util/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/common/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/api/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/map/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/comms/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/ddl-shim/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/phosphor/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/graph/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/chart/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/form/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/dgrid-shim/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/dgrid/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/layout/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/timeline/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/composite/dist/index.js"></script>
    <script src="node_modules/@hpcc-js/marshaller/dist/index.js"></script>
    `;
}