$(document).ready(function() {

var myList = [];

function nextPage() {
  var first = document.getElementById("front-page");
  var second = document.getElementById("second_page");
  if (first.style.display === "none") {
      first.style.display = "block";
  } else {
      first.style.display = "none";
      second.style.display = "block";
  }
}


function GetData(){

  var sDate = $(".dStart").val().trim();
  var eDate = $(".dEnd").val().trim();
  $("#ds2").val = sDate;
  $("#de2").val = eDate;
  var queryURL = "https://api.spacexdata.com/v2/launches?pretty=true&start=" + sDate + "&end=" +  eDate;
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
      $(".results").empty();
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
        display(response[i]);
      }
    })
  
}  


function display (result){



  var shuttleDiv=$("<div class ='card'>");
  
  var shuttletitle = $("<div class='card-header'>").text("Shuttle name: "+result.rocket.rocket_name+"  Launch date: "+ result.launch_date_local);
  
  var shuttleimage = $("<img class ='card-img-top'>");
  
  shuttleimage.attr('src', result.links.mission_patch);
  
  var shuttlinfoline = $("<div class = 'card-footer'>");
  
  var shuttlepdf = $("<button class='getPDF'>");
  
  shuttlepdf.text("Find out more in this PDF");
  shuttlepdf.attr("data-flight", result.flight_number);
  
  var shuttlevideo = $("<a href class ='btn btn-primary getYotube'>");

  shuttlevideo.text("watch the video");

  shuttlevideo.attr('src',result.links.video_link);
  
  
  
  shuttlinfoline.append(shuttlepdf);
  
  shuttlinfoline.append(shuttlevideo);
  
  shuttleDiv.append(shuttletitle);
  
  shuttleDiv.append(shuttleimage);
  
  shuttleDiv.append(shuttlinfoline);
  
  $(".results").append(shuttleDiv);
  
  
  
  }
$(document).on("click",".researchButton",function(){
  GetData();
})
  
  
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