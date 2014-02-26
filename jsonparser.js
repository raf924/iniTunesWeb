
function parseJSON(filename){
	var fs = require('fs');
return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

exports.parseJSON = parseJSON;