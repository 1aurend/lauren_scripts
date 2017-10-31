var fs = require('fs');
var path = require('path');
var dirToTime = process.argv[2];
var shootFolders = [];
const Rename = require("./shootprocessor").rename;



function loopDir(folderPath) {

  var contents = fs.readdirSync(folderPath);
  contents.forEach(function(name) {
      name = dirToTime + '/' + name;
      if (fs.statSync(name).isDirectory()) {
        shootFolders.push(name);
      };
    });

    console.log(shootFolders + "\n");
  };

var shootsToTime = new loopDir(dirToTime);
var sumDuration = 0;
var sumDurationTs = 0;
var sumSecondsFromDurationTs = 0;
var sumMcDuration = 0;

for (var i = 0; i < shootFolders.length; i++) {
  // if (shootFolders[i]) {
  //
  // }
  var shootInfo = new Rename(shootFolders[i]);
  var sumDuration = sumDuration + shootInfo.totalDuration;
  var sumDurationTs = sumDurationTs + shootInfo.totalDurationTs;
  var sumMcDuration = sumMcDuration + shootInfo.mcDuration;
  var sumSecondsFromDurationTs = sumSecondsFromDurationTs + (shootInfo.totalDurationTs/(24000));

}

var theOutput = "\n\n\nTotal footage duration in this directory: " + sumDuration + "\nTotal duration_ts: " + sumDurationTs + "\nEquivalent of duration_ts in seconds: " + sumSecondsFromDurationTs + "\nMC duration: " + sumMcDuration + "\n";

console.log(theOutput);
