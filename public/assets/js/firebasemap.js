

var rootRef = firebase.database().ref().child("Fines").child("Rhoé Administration");

// var latitude = document.getElementById("Latitude");
// var longitude = document.getElementById("Longitude");
//
// //Retrieving latitude and longitude from Firebase
// var latitudeRef = firebase.database().ref().child("Fines").child("Rhoé Administration");
// var longitudeRef = firebase.database().ref().child("Fines").child("Rhoé Administration");

rootRef.on("child_added", snap => {

  var lat = snap.child("Lat").val();
  var lon = snap.child("Lon").val();

  var locations = [{lat,lon}];
});
