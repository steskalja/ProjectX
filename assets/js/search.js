$(document).ready(function() {


/*
var config = {
  apiKey: "AIzaSyAoOmU1PF_eGmHcJq6eVy0ICMUHNrfvUJ0",
  authDomain: "gt-bootcamp-team1-projectx.firebaseapp.com",
  databaseURL: "https://gt-bootcamp-team1-projectx.firebaseio.com",
  projectId: "gt-bootcamp-team1-projectx",
  storageBucket: "gt-bootcamp-team1-projectx.appspot.com",
  messagingSenderId: "1075474460608"
};
*/
var config = {
  apiKey: "AIzaSyBuF6Kz4eJRfZiMq1Dh2DDjZTupTB-htW4",
  authDomain: "fsfproject-d2a39.firebaseapp.com",
  databaseURL: "https://fsfproject-d2a39.firebaseio.com",
  projectId: "fsfproject-d2a39",
  storageBucket: "fsfproject-d2a39.appspot.com",
  messagingSenderId: "819348342946"
};
firebase.initializeApp(config);
var database = firebase.database();
function ClearDB(){
  var dbRef = database.ref('flights/');
  dbRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
}

function GetData(){
  ClearDB();
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
          "Flight_number": response[i].flight_number,
          "Mission": response[i].mission_name,
          "Launch_Date" : response[i].launch_date_local,
          "Rocket_Name" : response[i].rocket.rocket_name,
          "Success" : response[i].launch_success
        }
        database.ref('flights/' + response[i].flight_number).set(response[i]);
        display(response[i],payload);
      }
    })
  
}  


function display (result,tip){

  var shuttleDiv=$("<div class ='card'>");
  var shuttletitle = $("<div class='card-header'>").text("Shuttle name: "+result.rocket.rocket_name+"   Launch date: "+ moment(result.launch_date_local).format("DDMMYY, h:mm:ss a"));
  var shuttleimage = $("<img class ='card-img-top mPatch'>");
  shuttleimage.attr('src', result.links.mission_patch);
  var tipinfo = ` Filght #: ${tip.Flight_number} \n Mission: ${tip.Mission} \n Launch Date: ${tip.Launch_Date} \n Rocket: ${tip.Rocket_Name} \n Success: ${tip.Success}` ;
  //console.log(tipinfo); 
  shuttleimage.attr('title',tipinfo );
  var shuttlinfoline = $("<div class = 'card-footer'>");
  var shuttlepdf = $("<button class='btn btn-primary getPDF'>");
  var shuttleqr = $("<a href='#' class ='btn btn-primary getQR' data-toggle='modal' data-target='#qrModal' >");
  shuttlepdf.text("Download PDF");
  shuttlepdf.attr('data-flight',result.flight_number);
  shuttleqr.text("QR-Code");
  shuttleqr.attr('data-video',result.links.video_link);
  var shuttlevideo = $("<a href='#' class ='btn btn-primary getYoutube' data-toggle='modal' data-target='#videoModal' >");
  shuttlevideo.text("Video");
  var vLink = result.links.video_link;
  vLink = vLink.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
  shuttlevideo.attr('data-theVideo',vLink);
  shuttlinfoline.append(shuttlepdf);
  shuttlinfoline.append(shuttlevideo);
  shuttlinfoline.append(shuttleqr);
  shuttleDiv.append(shuttletitle);
  shuttleDiv.append(shuttleimage);
  shuttleDiv.append(shuttlinfoline);
//alert("in display");

  $(".results").append(shuttleDiv);
  
}
$(document).on("click",".researchButton",function(){
  var first = document.getElementById("front-page");
  var second = document.getElementById("second_page");
  if(first.style.display === "block" && second.style.display === "none" )
  {
    first.style.display = "none";
    second.style.display = "block";
  }
  GetData();
})
  


$(document).on("click",".getYoutube",function(){
  var theModal = $(this).data("target"),
      videoSRC = $(this).attr("data-theVideo"),
      videoSRCauto = videoSRC + "?autoplay=1";
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal + ' button.close').click(function () {
      $(theModal + ' iframe').attr('src', videoSRC);
    });
});
  function GetRecord(id)
  {
    return new Promise(function(resolve,reject){
      database.ref('flights/' + id).once('value').then(function(snapshot) {
        var rData = JSON.stringify(snapshot.val(),null,"\n");
        resolve(rData);
        console.log(rData);
      });
    });
    
  }


  $(document).on("click",".getPDF", function(){
    var fID = $(this).attr('data-flight').trim();
    GetRecord(fID).then(function(res){ 
      var fData = res;
      console.log(fData);
      if(fData != null)
      {
        var doc = new jsPDF();
        doc.text(fData,10,10);
        doc.save(fID +'.pdf');
      }
    }); 
  });
  $(document).on("click",".getQR", function(){
    var theModal = $(this).data("target");
    var fVLink = $(this).attr('data-video').trim();
    $("#qrcode").empty();
    new QRCode(document.getElementById("qrcode"), fVLink);
  });
})
