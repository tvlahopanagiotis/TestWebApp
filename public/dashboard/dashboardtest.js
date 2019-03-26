const app =  firebase.app();
var database = firebase.database();
var Header1 = document.getElementById('Header1');
var search_field = document.getElementById('search_field');

var dbRef = firebase.database();
var rootRefUser;
var rootRef;
var fineRef;
var municipalityRef;
var MunicipalID, Municipality, Fname, Lname;
var munAddress, munBank, munBankIBAN, munDepartment, munEmail, munName, munPayAddress1, munPayAddress2, munPayAddress3, munPayName, munPostNum, munRegion, munTel1, munTel2;
var FineTable = [];
var FineCarDetails = [];
var FineTypeDetails = [];
var FineLatLong = [];

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
      //document.getElementById("printMunicipality").innerHTML = Municipality;
      //document.getElementById("printMunicipality1").innerHTML = Municipality;
      //document.getElementById("printMID").innerHTML = MunicipalID;
      document.getElementById("printFname").innerHTML = Fname;
      document.getElementById("printLname").innerHTML = Lname;
      ///////////////////////

      $(document).ready(function(){
        $(".municipality_name").html(Municipality);
      });

      //document.getElementById("navbarDropdownMenuLink").childNodes[1].nodeValue=Fname + " " + Lname;
      $(document).ready(function(){
        $(".municipal_officer").html(Fname + " " + Lname);
      });

      rootRef = dbRef.ref('Fines').child(MunicipalID).child('VehicleFines').orderByKey();
      municipalityRef = dbRef.ref('Municipalities').child(MunicipalID);
      getMunicipalityData();
    });
  } else {
    window.location.href = "../index.html";
  }
})

function getMunicipalityData () {
  municipalityRef.once('value').then(function(snapshot) {
        munAddress = snapshot.child("MunAddress").val();
        munBank = snapshot.child("MunBank").val();
        munBankIBAN = snapshot.child("MunBankIBAN").val();
        munDepartment = snapshot.child("MunDepartment").val();
        munEmail = snapshot.child("MunEmail").val();
        munName = snapshot.child("MunName").val();
        munPayAddress1 = snapshot.child("MunPayAddress1").val();
        munPayAddress2 = snapshot.child("MunPayAddress2").val();
        munPayAddress3 = snapshot.child("MunPayAddress3").val();
        munPayName = snapshot.child("MunPayName").val();
        munPostNum = snapshot.child("MunPostNum").val();
        munRegion = snapshot.child("MunRegion").val();
        munTel1 = snapshot.child("MunTel1").val();
        munTel2 = snapshot.child("MunTel2").val();

        document.getElementById("mRegion").innerHTML = munRegion;
        document.getElementById("mName").innerHTML = munName;
        document.getElementById("mDepartment").innerHTML = munDepartment;
        document.getElementById("mAddress").innerHTML = munAddress;
        document.getElementById("mTel1").innerHTML = munTel1;
        document.getElementById("mTel2").innerHTML = munTel2;
        document.getElementById("mEmail").innerHTML = munEmail;
        document.getElementById("mPay").innerHTML = munPayName;
        document.getElementById("mPayAddress1").innerHTML = munPayAddress1;
        document.getElementById("mPayAddress2").innerHTML = munPayAddress2;
        document.getElementById("mPayAddress3").innerHTML = munPayAddress3;
        document.getElementById("mBank").innerHTML = munBank;
        document.getElementById("mIBAN").innerHTML = munBankIBAN;
        getFineData();
    });
}

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


        FineTable.push([FineID, '', CarPlate, date, Time, FineAmount + "€", Paid, '', CarCountry]);
        FineCarDetails.push([CarPlate + " (" + CarCountry + ")", CarColor, CarBrand, CarType]);
        FineTypeDetails.push([FineType, FineAmount + "€", Day + " " + date + " " + Time, Address, Day, date, Time]);
        FineLatLong.push([CarPlate, Lat, Lon]);
    });
    populateDatatable();

    // Create workbook
    var wb= XLSX.utils.book_new();
    wb.Props= {
      Title: "Information"
    };
    wb.SheetNames.push("Πληροφορίες");
    var ws = XLSX.utils.aoa_to_sheet(FineTable);
    wb.Sheets["Πληροφορίες"]= ws;
    // Exporting workbook for download
    var wbout= XLSX.write(wb, {booktype: 'xlsx', type: 'binary'});
    function s2ab(s) {
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;
    }
    $("#xlsx").click(function(){
       saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Information.xlsx');
    });
    //
    return FineTable;
  });
}
JsBarcode("#barcode", "]1007608[1504174[16]", {
  width: 2.5,
  height: 40
});

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
              FineTypeDetails= [];
              window.location.href = "dashboardtest.html";
            }
          });
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
        var tr = $(this).closest('tr');
        var row = table.row( tr );

        document.getElementById("printCarPlate").innerHTML = FineCarDetails[row.index()][0];
        document.getElementById("printCarType").innerHTML = FineCarDetails[row.index()][3];
        document.getElementById("printCarBrand").innerHTML = FineCarDetails[row.index()][2];
        document.getElementById("printCarColor").innerHTML = FineCarDetails[row.index()][1];
        document.getElementById("printFineAmount").innerHTML = FineTypeDetails[row.index()][1];
        document.getElementById("printFineAmountP").innerHTML = FineTypeDetails[row.index()][1];
        document.getElementById("printDateP").innerHTML = FineTypeDetails[row.index()][5];
        document.getElementById("printDate").innerHTML = FineTypeDetails[row.index()][5];
        document.getElementById("printDay").innerHTML = FineTypeDetails[row.index()][4];
        document.getElementById("printTime").innerHTML = FineTypeDetails[row.index()][6]
        document.getElementById("printAddress").innerHTML = FineTypeDetails[row.index()][3];
        document.getElementById("printFineType").innerHTML = FineTypeDetails[row.index()][0];
        ///////////////////////


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
