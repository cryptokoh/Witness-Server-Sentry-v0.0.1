//=============================================================================
//-----------------------------------------------------------------------------
//----- Witness Server Sentry v0.0.1 ----- Coded by: @KLYE ----- Open Source!
//----- Requires NodeJS + steemjs || Install with: npm install steem -u
//-----------------------------------------------------------------------------
//=============================================================================

// Load the steemjs library
var steem = require('steem');
// Modify for Smoke.IO Node
steem.api.setOptions({ url: 'wss://rpc.smoke.io' });

// Edit these 3 variables below with your own information!
var accountName = ""; // Witness Account Name
var wif = ""; // Posting Private Key
var blockSigningKey = ""; // Signing Key of Backup Witness

// No need to modify these variables!
var url;
var props;
var fee;
var initmissed;
var scanmissed;

// Start up Witness Server Sentry
console.log("NodeJS Witness Server Sentry v0.0.1 Starting...");
console.log("Design & Development by: @KLYE - Open Source");

// Retrieve total missed blocks of given witness & save to variables
steem.api.getWitnessByAccount(accountName, function(err, result) {
  if (err) { console.log("An Error Occured Fetching Init Missed Blocks!")};
  if (result) {
    url = result["url"];
    props = result["props"];
    fee = props["account_creation_fee"];
    initmissed = result["total_missed"];
  }
});

// Start up the real time Witness Server Sentry functionality
console.log("Firing Up Witness Server Sentry Block Detector");

// misswatcher function compares initial missed blocks to current
function misswatcher () {
  sleep(3000);
  steem.api.getWitnessByAccount(accountName, function(err, result) {
    if (err) { console.log("An Error Occured Fetching Missed Blocks!")
              console.log(err);
            };

    if (result) {
       console.log("SCAN - Total Missed by @" + accountName + " is " + result["total_missed"]);
       scanmissed = result["total_missed"];
       if (scanmissed > initmissed) {
         console.log("MISS - A Missed Block Was Detected!");
         steem.broadcast.witnessUpdate(wif, accountName, url, blockSigningKey, props, fee, function(err, result) {
           if (err){
             console.log("Error Switching to Backup Witness! Please Check Your Variables!");
             console.log(err);
           }
           if (result){
             console.log("Successfully Switched to Backup Witness!");
             console.log(result);
           }

          });
       }
         misswatcher();
    }
  });
}

// Call misswatcher() function again to loop
         misswatcher();

         // SLEEP Function to unfuck some nodeJS things - NO modify
         function sleep(milliseconds) {
         	var start = new Date().getTime();
         	for (var i = 0; i < 1e7; i++) {
         		if ((new Date().getTime() - start) > milliseconds) {
         			break;
         		}
         	}
         };
