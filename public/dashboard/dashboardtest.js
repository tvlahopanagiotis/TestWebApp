const app =  firebase.app();
var database = firebase.database();
var Header1 = document.getElementById('Header1');
var search_field = document.getElementById('search_field');

var dbRef = firebase.database();
var rootRefUser;
var rootRef;
var fineRef;
var MunicipalID, Municipality, Fname, Lname;
var FineTable = [];
var FineCarDetails = [];
var FineTypeDetails = [];


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
    var rootRefUser = dbRef.ref("Users").child(uid);
    rootRefUser.once('value').then(function(snapshot) {
      MunicipalID = snapshot.child("MID").val();
      Municipality = snapshot.child("Municipality").val();
      Fname = snapshot.child("Fname").val();
      Lname = snapshot.child("Lname").val();

      //print variables
      document.getElementById("Municipalityname").innerHTML = Municipality;
      document.getElementById("OTA").innerHTML = MunicipalID;
      document.getElementById("onoma_astynomou").innerHTML = Fname;
      document.getElementById("epitheto_astynomou").innerHTML = Lname;
      ///////////////////////

      $(document).ready(function(){
        $(".municipality_name").html(Municipality);
      });
      document.getElementById("navbarDropdownMenuLink").childNodes[0].nodeValue=Fname + " " + Lname;

      rootRef = dbRef.ref('Fines').child(MunicipalID).orderByKey();
      getFineData();
    });
  } else {
    window.location.href = "../index.html";
  }
})

function getFineData () {
  rootRef.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
        var FineID = childSnapshot.key;
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
        ///////////////////////

        FineTable.push([FineID, '', CarPlate, date, Time, FineAmount + "€", Paid, '', CarCountry]);
        FineCarDetails.push([CarPlate + " (" + CarCountry + ")", CarColor, CarBrand, CarType]);
        FineTypeDetails.push([FineType, FineAmount + "€", Day + " " + date + " " + Time, Address]);
    });
    populateDatatable();
    return FineTable;
  });
}

function populateDatatable () {
  $(document).ready(function() {
      var table = $('#datatable').DataTable( {
          data : FineTable,

          "columns": [
              { title: "Κωδικός Κλήσης"},
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
                "targets": [2],
                "render": function ( data, type, row ) {
                    return data +' ('+ row[8]+')';
                }
            },
            {
                "targets": [0, 8],
                "visible": false,
                "searchable": false
            },
          ],

          "createdRow": function ( row, data, index ) {
            if ( data[6] == "Πληρώθηκε" ) {
              $('td', row).eq(5).removeClass('pay-control');
                $('td', row).eq(5).addClass('pay-control1');
            }
        },

          "order": [[1, 'asc']]
      } );

      // Pay Button
      $('#datatable tbody').on('click', 'td.pay-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var cell = table.cell( this );

        if (FineTable [row.index()][6] == "Πληρωμή") {
          fineRef = dbRef.ref('Fines').child(MunicipalID).child(FineTable [row.index()][0])

          $('#exampleModalCenter').on('show.bs.modal', function (e) {
            var modal = $(this)
            modal.find('.modal-body').text("Αρ. Κυκλοφορίας: " + FineTable [row.index()][2]);

          });

          $('#exampleModalCenter').modal({
              keyboard: false
          });

          $('#payConfirmClick').on('click', function(evt) {
          document.getElementById("payConfirmClick").onclick = updatePaid();
            function updatePaid() {
              var d = new Date();
              var n = d.toISOString();
              fineRef.update({"Paid" : n});

              table.destroy();
              FineTable = [];
              FineCarDetails = [];
              FineTypeDetails = [];
              window.location.href = "dashboardtest.html";
            }
          });
        }
      } );

      // Add event listener for opening and closing details
      $('#datatable tbody').on('click', 'td.details-control', function () {
          var tr = $(this).closest('tr');
          var row = table.row( tr );
          //print variables p.2
          document.getElementById("printCarPlate").innerHTML = FineCarDetails[row.index()][0];
          document.getElementById("printCarType").innerHTML = CarType;
          document.getElementById("printCarBrand").innerHTML = CarBrand;
          document.getElementById("printCarColor").innerHTML = CarColor;
          document.getElementById("posoprostimou").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + FineAmount;
          document.getElementById("posopliromis").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + FineAmount;
          document.getElementById("imerominia").innerHTML = date;
          document.getElementById("imera").innerHTML = Day;
          document.getElementById("wra").innerHTML = Time;
          document.getElementById("dieuthinsi").innerHTML = Address;
          document.getElementById("paravasi").innerHTML = FineType;

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
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var prtContent = document.getElementById("print");
        var WinPrint = window.open('', '', 'left=0,top=0,width=1000,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      } );
  } );
}

var appBanners = document.getElementsByClassName('print'), i;
for (i = 0; i < appBanners.length; i += 1) {
    appBanners[i].style.display = 'none';
  };

function format (d) {
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
