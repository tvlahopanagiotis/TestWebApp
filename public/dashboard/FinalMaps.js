// window.alert()
const app =  firebase.app();
var database = firebase.database();

var map;
var marker, i;
var pointsTable= [];
var mapsRef;

login();
function login() {
  firebase.auth().signInWithEmailAndPassword("support@rhoe.gr", "19122016").catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);


  });
  mapsRef= firebase.database().ref("Fines").child("0000");
  getPoint();
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 40.6436100, lng: 22.9308600},
    zoom: 12
  });
};

function getPoint() {
  mapsRef.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      var pointID= childSnapshot.key;
      var CarPlate= childSnapshot.child("CarPlate").val();
      var Lat= childSnapshot.child("Lat").val();
      var Lon= childSnapshot.child("Lon").val();

      pointsTable.push([CarPlate, Lat, Lon]);
    });
    populatepointsTable();
    return pointsTable;
  });
};
function populatepointsTable () {
  console.log(pointsTable);
    for (i=0; i< pointsTable.length; i++) {
      marker= new google.maps.Marker({
        position: {lat: pointsTable[i][1], lng: pointsTable[i][2]},
        // position: new google.maps.LatLng(pointsTable[i][1], pointsTable[i][2]),
        map: map
      });
  }
};
