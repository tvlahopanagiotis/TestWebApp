

var database = firebase.database();
var Header1 = document.getElementById('Header1');
var search_field = document.getElementById('search_field');
// var check = document.getElementById("check");
// $("table_body").innerHTML = null;
// var check.innerHTML = '<label class="form-check-label> \n <input class="form-check-input" type="checkbox" checked=""> \n <span class="form-check-sign"></span> \n </label>'

// var htmlsnippet = '<div id="check" class="form-check">'+
// '<label class="form-check-label">'+
// '<input class="form-check-input" type="checkbox" checked="">'+
// '<span class="form-check-sign"></span>'+
// '</label>'+
// '</div>';

const app =  firebase.app();
// console.log(app);
// var firebaseHeadingRef = firebase.database().ref().child("Users").child("user_01").child('Email');
// var firebaseHeadingRef = firebase.database().ref().child("Fines").child("Rhoe Administration").child("2018-03-14T22:34:52:045+0200").child('CarColor');

// firebaseHeadingRef.on('value', function(datasnapshot) {
//   Header1.innerText = datasnapshot.val();
// });


function submitClick() {

  var firebaseRef = firebase.database().ref();

  var messageText = mainText.value;

  firebaseRef.push().set(messageText);
};

var rootRef = firebase.database().ref().child("Fines").child("0000");


var completearray = new Array;
// var finedat = [];
rootRef.orderByChild('Time').on("child_added", snap => {
  var Address = snap.child("Address").val();
  var CarBrand = snap.child("CarBrand").val();
  var CarColor = snap.child("CarColor").val();
  var Carplate = snap.child("CarPlate").val();
  var CarType = snap.child("CarType").val();
  var Date = snap.child("Date").val();
  var Day = snap.child("Day").val();
  var FineAmount = snap.child("FineAmount").val();
  var FineType = snap.child("FineType").val();
  var Time = snap.child("Time").val();


//  $("table_body").append("<tr><td>" + name + "</td></tr>" + email + "</td></tr>");
//  $("#table_body").append("<tr><td>" + htmlsnippet + "</td><td>" + Carplate + "</td><td>" + CarType + "</td><td>" + FineType + "</td><td>" + Time + "</td><td>" + FineAmount + "</td></tr>");

  // finedat = [];
  // finedat.push(Carplate,CarType,FineType,Time,Date,FineAmount);
  completearray.push([Carplate,CarType,FineType,Time,Date,FineAmount]);

  // completearray = completearray.push(finedat);
});
var testarray = [
  ["2","test","test","test","test", "ΝΑΙ"],
  ["1","test","test","test","test", "ΟΧΙ"]
];

$(document).ready(function() {
  console.log(completearray);
  $('#datatable').DataTable( {
      data: completearray,
      columns: [
          { title: "Αρ. Κυκλοφορίας" },
          { title: "Ημερομηνία" },
          { title: "Ώρα" },
          { title: "Παράβαση" },
          { title: "Ποσό προστίμου" },
          { title: "Εξοφλημένη" }
      ]
  } );
} );


// if(search_field = null) {
//   $("#table_body").append("<tr><td>" + htmlsnippet + "</td><td>" + Carplate + "</td><td>" + CarType + "</td><td>" + FineType + "</td><td>" + Time + "</td><td>" + FineAmount + "</td></tr>");
// } else {
//   var search_query = rootref.orderByValue().equalTo(search_field);

// }
