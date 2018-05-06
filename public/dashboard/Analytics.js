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

/*
// User Status
var user = firebase.auth().currentUser();
if (user != null) {
  var uid = user.uid;
  var rootRefUser = firebase.database().ref().child(uid);
  rootRefUser.on("child_added", snap => {
    var MunicipalID = snap.child("MID").val();
  });
} else {
  window.location.href = "../index.html";
}*/


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

var dbRef = firebase.database();
var rootRef = dbRef.ref('Fines').child('0000').orderByKey();

var FineTable = [];
var FineCarDetails = [];
var FineTypeDetails = [];

rootRef.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time

      // childData will be the actual contents of the child
      var Address = childSnapshot.child("Address").val();
      var CarBrand = childSnapshot.child("CarBrand").val();
      var CarColor = childSnapshot.child("CarColor").val();
      var CarCountry = childSnapshot.child("CarCountry").val();
      var CarPlate = childSnapshot.child("CarPlate").val();
      var CarType = childSnapshot.child("CarType").val();
      var date = childSnapshot.child("Date").val();
      var Day = childSnapshot.child("Day").val();
      var FineAmount = childSnapshot.child("FineAmount").val();
      var FinePoints = childSnapshot.child("FinePoints").val();
      var FineType = childSnapshot.child("FineType").val();
      var Lat = childSnapshot.child("Lat").val();
      var Lon = childSnapshot.child("Lon").val();
      var Paid = childSnapshot.child("Paid").val();
      var Time = childSnapshot.child("Time").val();
      var UserID = childSnapshot.child("UserID").val();

      if (Paid == "No") {
        Paid = "Πληρωμή";
      } else {
        Paid = "Πληρώθηκε";
      }

      FineTable.push(['', CarPlate, date, Time, FineAmount, Paid, '', CarCountry]);
      FineCarDetails.push([CarPlate + " (" + CarCountry + ")", CarColor, CarBrand, CarType]);
      FineTypeDetails.push([FineType, FineAmount, Day + " " + date + " " + Time, Address]);
  });
  $(document).ready(function() {
      var table = $('#datatable').DataTable( {
          data : FineTable,

          "columns": [
              {
                  "className":      'details-control ',
                  "orderable":      false,
                  "data":           null,
                  "defaultContent": 'Πληροφορίες'
              },
              {
                 title: "Αρ. Κυκλοφορίας",
                 "className": "dt-center",
              },
              { title: "Ημερομηνία",
              "className": "dt-center",
              },
              { title: "Ώρα",
              "className": "dt-center",
              },
              { title: "Παράβαση",
              "className": "dt-center",
              },
              { title: "Εξόφληση",
                  "className":      'pay-control',
                  "orderable":      true
                },
              {
                  "className":      'print-control',
                  "orderable":      false,
                  "data":           null,
                  "defaultContent": 'Εκτύπωση'
              },
              { title: "Χώρα"},
          ],

          "columnDefs": [
            {
                "targets": [1],
                "render": function ( data, type, row ) {
                    return data +' ('+ row[7]+')';
                }
            },
            {
                "targets": [7],
                "visible": false,
                "searchable": false
            },
          ],

          "order": [[1, 'asc']]
      } );

      // Pay Button
      $('#datatable tbody').on('click', 'td.pay-control', function () {
        var cell = table.cell( this );

        if ( cell == "Πληρωμή" ) {
          tr.removeClass('pay-control')
            tr.addClass('pay-control-paid');
        }
        else {
          tr.removeClass('pay-control-paid')
            tr.addClass('pay-control');
        }
      } );

      // Add event listener for opening and closing details
      $('#datatable tbody').on('click', 'td.details-control', function () {
          var tr = $(this).closest('tr');
          var row = table.row( tr );

          if ( row.child.isShown() ) {
              // This row is already open - close it
              row.child.hide();
              tr.removeClass('shown');
          }
          else {
              // Open this row
              row.child( format(row.index()) ).show();
              tr.addClass('shown');
          }
      } );


      // Print Button
      $('#datatable tbody').on('click', 'td.print-control', function () {

      } );
  } );
  return FineTable;
});

/*
var completearray = new Array;
// var finedat = [];
rootRef.on("child_added", function(data) {
  console.log(data.val())
  data.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    var childData = childSnapshot.val();
  });
});
*/

function format ( d ) {
  var fineCarTable = FineCarDetails
  var fineTypeTable = FineTypeDetails
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td><b>Στοιχεία Οχήματος:</b></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td><b>Στοιχεία Παράβασης:</b></td>'+
            '<td></td>'+
        '</tr>'+
        '<tr>'+
            '<td>Αρ. Κυκλοφορίας:</td>'+
            '<td>' + fineCarTable [d][0] + '</td>'+
            '<td></td>'+
            '<td>Τύπος Παράβασης:</td>'+
            '<td>' + fineTypeTable [d][0] + '</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Χρώμα:</td>'+
            '<td>' + fineCarTable [d][1] + '</td>'+
            '<td></td>'+
            '<td>Πρόστιμο:</td>'+
            '<td>' + fineTypeTable [d][1] + '</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Κατασκευαστής:</td>'+
            '<td>' + fineCarTable [d][2] + '</td>'+
            '<td></td>'+
            '<td>Ημερομηνία:</td>'+
            '<td>' + fineTypeTable [d][2] + '</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Τύπος:</td>'+
            '<td>' + fineCarTable [d][3] + '</td>'+
            '<td></td>'+
            '<td>Διεύθυνση:</td>'+
            '<td>' + fineTypeTable [d][3] + '</td>'+
        '</tr>'+
    '</table>';
};

document.getElementById('logout').addEventListener('click', function(event) {
  firebase.auth().signOut();
  window.location.replace("../index.html");
});
