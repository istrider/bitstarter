#! /usr/bin/env node

var sys = require('util');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile)
			{
				console.log("Checking file - " + infile);

				var instr = infile.toString();
				
				if(!fs.existsSync(instr)) 
				{
				        console.log("%s does not exist. Exiting.", instr);
				        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
				}
				else
				{
					console.log("File found - " + instr);
				}
			}

var cheerioHtmlFile = function(htmlfile)
{
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) 
{
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) 
{
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) 
    {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkHtml = function(html, checksfile)
{
    $ = cheerio.load(html);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks)
    {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) 
{
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) 
{
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'URL to index.html')
    	.parse(process.argv);

    console.log(program.checks);
    console.log(program.file);
    console.log(program.url);

    var checkJson;

    if (program.url != null)
    {
	console.log('Using URL - ' + program.url);

	restler.get(program.url)
		.on('complete', function(result)
				{
					checkJson = checkHtml(result, program.checks);

	       			        var outJson = JSON.stringify(checkJson, null, 4);

 					console.log(outJson);

				});
    }
    else
    {
	console.log('Using File - ' + program.file);

	checkJson = checkHtmlFile(program.file, program.checks);

	var outJson = JSON.stringify(checkJson, null, 4);

	console.log(outJson);
    }
}
else 
{
    exports.checkHtmlFile = checkHtmlFile;
}
