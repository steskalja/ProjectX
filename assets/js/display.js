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
var shuttlevideo = $("<a class ='getYotube'>");
shuttlevideo.text("watch the video");

shuttlinfoline.append(shuttlepdf);
shuttlinfoline.append(shuttlevideo);
shuttleDiv.append(shuttletitle);
shuttleDiv.append(shuttleimage);
shuttleDiv.append(shuttlinfoline);

//alert("in display");
$(".results").append(shuttleDiv);

}

$(document).on("click","#researchButton",function(){
    GetData();
   })