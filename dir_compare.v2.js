var dirComp = require('dir-compare');
var options = {compareSize: true, ignoreCase: true, excludeFilter: ".*"};
const cp = require("child_process");
const path = require("path");
const fs = require('fs');
var slack = require('slack');
require('dotenv').config();
var token = process.env.SLACK_TOKEN;

//grab directories to compare from command line
var directories = process.argv.slice(2);
 var dirPath1 = directories[0];
 var dirPath2 = directories[1];

//run comparison; output results to "res"
var res = dirComp.compareSync(dirPath1, dirPath2, options);
console.log('\nFile Matches: ' + res.equal);
console.log('File Mismatches: ' + res.distinct);
console.log('Files Missing ' + dirPath1 + ': ' + res.right);
console.log('Files Missing ' + dirPath2 + ': ' + res.left);
console.log('Total Issues: ' + res.differences);

var theMessage = '';

//if directories match log to console and do nothing else; can update this later if we want to create an ongoing record of results from each time this script is run.
if (res.same==true){

  var theMessage = dirPath1 + ' and ' + dirPath2 + ' match.'
  console.log('\n\n Directories match!');

}

//if there are mistakes, update the message accordingly.
else {

  var theMessage = dirPath1 + ' and ' + dirPath2 + ' do not match:\n\n'

//for each file in the directories, check if there is a discrepancy and update the message to include the specific issue.
  res.diffSet.forEach(function (entry) {

      if (entry.state=='left') {

        var name1 = entry.name1 ? entry.name1 : '';
        theMessage = (theMessage + '    ' + name1 + ' is missing from ' + dirPath2 + '.\n\n');
        // console.log(theMessage);
      }

      if (entry.state=='right') {

        var name2 = entry.name2 ? entry.name2 : '';
          theMessage = (theMessage + '    ' + name2 + ' is missing from ' + dirPath1 + '.\n\n');
      }

      if (entry.state=='distinct') {

        var name1 = entry.name1 ? entry.name1 : '';
          theMessage = (theMessage + '    ' + name1 + ' is missing from ' + dirPath2 + '.\n\n');
      }

  });

//write a text file on the desktop with above info.
    var desktop = path.join(process.env.HOME, '/Desktop');
    console.log(desktop);
    fs.writeFile(desktop + '/file_discrepancies.txt', theMessage, (err) => {
      if (err) throw err;
    });

    console.log('\nFiles to fix sent to Slack.');
}

//also send to slack.
var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@mlv-team>: ' + theMessage + ' ", "icon_emoji": ":desktop_computer:"}'
cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
