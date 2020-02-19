function getData(){
  var x = document.getElementById("uniqueid");
  var y = document.getElementById("sheetname");
  var uid = "";
  var sn = "";
  uid = x.value;
  sn = y.value;
  if(x.value.length == 0){
    alert("Please Enter Google Sheet ID");
  }
  else if(y.value.length == 0){
    alert("Please Enter Google Sheet Name");
  }
  else{
    makeApiCall(uid,sn);
  }
}
function showElement() {
  document.getElementById("hc").style.display = "block";
  document.getElementById("signout").style.display = "block";
  document.getElementById("signin").style.display = "none";
}
function hideElement() {
  document.getElementById("hc").style.display = "none";
  document.getElementById("signout").style.display = "none";
  document.getElementById("signin").style.display = "block";
}
function makeApiCall(uid,sn) {
  var params = {
  // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: uid,  // TODO: Update placeholder value.

  // The A1 notation of the values to retrieve.
    range: sn,  // TODO: Update placeholder value.

  // How values should be represented in the output.
  // The default render option is ValueRenderOption.FORMATTED_VALUE.
  //valueRenderOption: '',  // TODO: Update placeholder value.

  // How dates, times, and durations should be represented in the output.
  // This is ignored if value_render_option is
  // FORMATTED_VALUE.
  // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
  //dateTimeRenderOption: '',  // TODO: Update placeholder value.
    majorDimension: "COLUMNS"
};

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
  // TODO: Change code below to process the `response` object:
    console.log(response.result.values);
    processing(response.result.values,response.result.values.length);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    var string = reason.result.error.message;
    var out = document.getElementById('output');
    out.innerHTML = string;
  });
}

function initClient() {
  var API_KEY = 'AIzaSyDCjYvW_klrtZDV4PnubDeBUPMI6oD0dUo';  // TODO: Update placeholder with desired API key.

  var CLIENT_ID = '601726838575-vp1ba2uf7td085vecagi88bjfp29b7q0.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    showElement();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  hideElement();
}

function processing(values,len){
  var i,j,tlen,sum,name;
  var tot={};
  for(i=0;i<len;i++){
    tlen = values[i].length;
    if(!isNaN(values[i][tlen-1])){
      sum=0
      for(j=1;j<tlen;j++){
        if(!isNaN(values[i][j])){
          sum+=parseInt(values[i][j]);
        }
      }
      name = values[i][0]
      tot[name] = sum;
    }
  }
  console.log(tot);

  var out = document.getElementById('output');
  var string = ''; 

  for(var prop in tot) { 
        string+= prop + ': ' + tot[prop] + '</br>'; 
      } 
  out.innerHTML = string;
}