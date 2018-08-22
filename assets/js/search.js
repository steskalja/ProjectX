$(document).ready(function() {

var myList = [];
function GetData(){

  var queryURL = "https://api.spacexdata.com/v2/launches?pretty=true&start=2017-01-01&end=2017-06-25"
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
      for(i=0; i < response.length; i++)
      {
        var payload = {
          "Flight#": response[i].flight_number,
          "Mission": response[i].mission_name,
          "Launch_Date" : response[i].launch_date_local,
          "Rocket_Name" : response[i].rocket.rocket_name,
          "Successs" : response[i].launch_success,
          "Video" : response[i].links.video_link
        }
        myList.push(payload);
      }
    })
  
}  
  

  
  
  // Builds the HTML Table out of myList.
  function buildHtmlTable(selector) {
    var columns = addAllColumnHeaders(myList, selector);
  
    for (var i = 0; i < myList.length; i++) {
      var row$ = $('<tr/>');
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var cellValue = myList[i][columns[colIndex]];
        if (cellValue == null) cellValue = "";
        row$.append($('<td/>').html(cellValue));
      }
      $(selector).append(row$);
    }
  }
  
  // Adds a header row to the table and returns the set of columns.
  // Need to do union of keys from all records as some records may not contain
  // all records.
  function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
  
    for (var i = 0; i < myList.length; i++) {
      var rowHash = myList[i];
      for (var key in rowHash) {
        if ($.inArray(key, columnSet) == -1) {
          columnSet.push(key);
          headerTr$.append($('<th/>').html(key));
        }
      }
    }
    $(selector).append(headerTr$);
  
    return columnSet;
  }
  $("#gData").on("click",function()
  {
    GetData();
    buildHtmlTable("#excelDataTable");
  });
})