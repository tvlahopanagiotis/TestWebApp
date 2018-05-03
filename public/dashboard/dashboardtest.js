

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
var rootRef = dbRef.ref('Fines').child('0000');
/*
var rootRef = firebase.database().ref().child("Fines").child("0000").orderByKey();
rootRef.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
  });
});
*/


var completearray = new Array;
// var finedat = [];
rootRef.on("child_added", function(snap) {
  console.log(snap.val())
  snap.forEach(function(childSnapshot) {
    var key = childSnapshot.key();
    var childData = childSnapshot.val();
  });
});


/*
rootRef.on("child_added", snap => {
  var Address = snap.child("Address").val();
  var CarBrand = snap.child("CarBrand").val();
  var CarColor = snap.child("CarColor").val();
  var CarPlate = snap.child("CarPlate").val();
  var CarType = snap.child("CarType").val();
  var date = snap.child("Date").val();
  var Day = snap.child("Day").val();
  var FineAmount = snap.child("FineAmount").val();
  var FineType = snap.child("FineType").val();
  var Time = snap.child("Time").val();
  var Paid = snap.child("Paid").val();


//  $("table_body").append("<tr><td>" + name + "</td></tr>" + email + "</td></tr>");
//  $("#table_body").append("<tr><td>" + htmlsnippet + "</td><td>" + Carplate + "</td><td>" + CarType + "</td><td>" + FineType + "</td><td>" + Time + "</td><td>" + FineAmount + "</td></tr>");

  // finedat = [];
  // finedat.push(Carplate,CarType,FineType,Time,Date,FineAmount);
  var singleArray = {
    blank : "",
    carPlate : CarPlate,
    paid : Paid,
    fineType : FineType,
    time : Time,
    dat : date,
    fineAmount : FineAmount

  }
  completearray.push(singleArray);

  // completearray = completearray.push(finedat);
});
*/
/*
var testarray = [
  [blank:"",carPlate:"2",fineAmount:"test",fineType:"test",time:"test",dat:"test",paid: "ΝΑΙ"],
  [blank:"",carPlate:"1",fineAmount:"test",fineType:"test",time:"test",dat:"test",paid: "ΟΧΙ"],
  [blank:"",carPlate:"3",fineAmount:"test",fineType:"test",time:"test",dat:"test",paid: "ΟΧΙ"]
];
*/

function format ( d ) {
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
            '<td>Test</td>'+
            '<td></td>'+
            '<td>Τύπος Παράβασης:</td>'+
            '<td>Test</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Χρώμα:</td>'+
            '<td>Test</td>'+
            '<td></td>'+
            '<td>Πρόστιμο:</td>'+
            '<td>35</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Κατασκευαστής:</td>'+
            '<td>Test</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Τύπος:</td>'+
            '<td>Test</td>'+
        '</tr>'+
    '</table>';
}

$(document).ready(function() {
    var table = $('#datatable').DataTable( {
        //"ajax": "../ajax/data/objects.txt",
        //"data" : completearray,
        data : snap,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '',
            },
            /*{ title: "Αρ. Κυκλοφορίας",
              "data" : "carType"},
            { title: "Ημερομηνία",
              "data" : "dat"},
            { title: "Ώρα",
              "data" : "time"},
            { title: "Παράβαση",
              "data" : "fineType"},
            { title: "Ποσό προστίμου",
              "data" : "fineAmount"},
            { title: "Εξοφλημένη",
              "data" : "paid"},
              */
              {"data":"CarPlate"},
              {"data":"Date"},
              {"data":"Time"},
              {"data":"FineType"},
              {"data":"FineAmount"},
              {"data":"Paid"},
        ],
        "order": [[1, 'asc']]
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
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
} );


// if(search_field = null) {
//   $("#table_body").append("<tr><td>" + htmlsnippet + "</td><td>" + Carplate + "</td><td>" + CarType + "</td><td>" + FineType + "</td><td>" + Time + "</td><td>" + FineAmount + "</td></tr>");
// } else {
//   var search_query = rootref.orderByValue().equalTo(search_field);

// }
