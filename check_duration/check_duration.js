var fs = require('fs');
var path = require('path');
var dirToTime = process.argv[2];
const Rename = require("./shootprocessor").rename;

var shootFolders = [];


function checkForVideo(name){

    var result = '';
    var files = fs.readdirSync(name);
    var re = /.mov$/
    var re2 = /.MOV$/

    // console.log(files);

        for(var i=0;i<files.length;i++){
            var stat = fs.statSync(path.join(name,files[i]));
            // console.log(stat);
            if (stat.isDirectory()){
                result = result.concat(checkForVideo(path.join(name,files[i]))); //Why does this work???
            }
            else if (re.test(files[i]) || re2.test(files[i])) {
                // console.log('-- found: ', name);
                result = 'video found'
                // console.log("\n\n" + result + "\n\n");
                i=files.length+3;
            };

        };

      return result;

    };

function loopDir(folderPath) {

  var contents = fs.readdirSync(folderPath);

  contents.forEach(function(name) {
      name = dirToTime + '/' + name;

      if (fs.statSync(name).isDirectory()) {
        var lookForMov = checkForVideo(name);
        // console.log(checkForVideo(name));
        if (Boolean(checkForVideo(name))==true) {
        shootFolders.push(name);
        };
      };
    });
  };


var shootsToTime = new loopDir(dirToTime);
var sumDuration = 0;
var sumDurationTs = 0;
var sumSecondsFromDurationTs = 0;
var sumMcDuration = 0;
console.log("\n\nThese folders sent to shootprocessor: " + shootFolders + "\n\n");

for (var i = 0; i < shootFolders.length; i++) {

  var shootInfo = new Rename(shootFolders[i]);
  console.log("here!");
  var sumDuration = sumDuration + shootInfo.totalDuration;
  var sumDurationTs = sumDurationTs + shootInfo.totalDurationTs;
  var sumMcDuration = sumMcDuration + shootInfo.mcDuration;
  var sumSecondsFromDurationTs = sumSecondsFromDurationTs + (shootInfo.totalDurationTs/(24000));

}

var theOutput = "\n\n\nTotal footage duration in this directory: " + sumDuration + "\nTotal duration_ts: " + sumDurationTs + "\nEquivalent of duration_ts in seconds: " + sumSecondsFromDurationTs + "\nMC duration: " + sumMcDuration + "\n";

console.log(theOutput);
