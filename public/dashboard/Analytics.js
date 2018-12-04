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
var FineAmountArray = [];
var FineTypeArray = [];
var FineDayArray = [0,0,0,0,0,0];
var FineDayArrayR = [];
var DateArrayR = [];
var MonthArray = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μαϊος', 'Ιούνιος', 'Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
var MonthFineArray = [0,0,0,0,0,0,0,0,0,0,0,0];
var TotalFineAmountperMonthArray = [0,0,0,0,0,0,0,0,0,0,0,0];
var AverageFineAmountArray = [0,0,0,0,0,0,0,0,0,0,0,0];


//Date Counting
d = new Date();
var DateArray = []
for (i=0;i<6;i++) {
  var days = i;
  var datee = new Date();
  var last = new Date(datee.getTime() - (days * 24 * 60 * 60 * 1000));
  var day =last.getDate();
  var month=last.getMonth()+1;
  var year=last.getFullYear();
  if (day<10) {
    day = '0' + day.toString();
  }
  var dates = day.toString() + '/' + month.toString() + '/' + year.toString();
  DateArray.push(dates);
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
    var rootRefUser = dbRef.ref("Users").child(uid);
    rootRefUser.once('value').then(function(snapshot) {
      MunicipalID = snapshot.child("MID").val();
      Municipality = snapshot.child("Municipality").val();
      Fname = snapshot.child("Fname").val();
      Lname = snapshot.child("Lname").val();


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
        getFineData();
        // var testarray = {[hey:1],[ho:8],[ai:56],[au:3]};
        // console.log(testarray.length);
    })
};


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

        //Διάγραμμα κλήσεων/ημέρα
        if (date == DateArray [0]) {
          FineDayArray[0] += 1;
        } else if (date == DateArray[1]) {
          FineDayArray[1] += 1;
        } else if (date == DateArray[2]) {
          FineDayArray[2] += 1;
        } else if (date == DateArray[3]) {
          FineDayArray[3] += 1;
        } else if (date == DateArray[4]) {
          FineDayArray[4] += 1;
        } else if (date == DateArray[5]) {
          FineDayArray[5] += 1;
        } else if (date == DateArray[6]) {
          FineDayArray[6] += 1;
        };

        //Διάγραμματα για μήνες
        if (date.substring(3,5) == '01') {
          MonthFineArray[0] += 1;
          TotalFineAmountperMonthArray[0] += Number(FineAmount);
          AverageFineAmountArray[0] = TotalFineAmountperMonthArray[0] / MonthFineArray[0];
        } else if (date.substring(3,5) == '02') {
          MonthFineArray[1] += 1;
          TotalFineAmountperMonthArray[1] += Number(FineAmount);
          AverageFineAmountArray[1] = TotalFineAmountperMonthArray[1] / MonthFineArray[1];
        } else if (date.substring(3,5) == '03') {
          MonthFineArray[2] += 1;
          TotalFineAmountperMonthArray[2] += Number(FineAmount);
          AverageFineAmountArray[2] = TotalFineAmountperMonthArray[2] / MonthFineArray[2];
        } else if (date.substring(3,5) == '04') {
          MonthFineArray[3] += 1;
          TotalFineAmountperMonthArray[3] += Number(FineAmount);
          AverageFineAmountArray[3] = TotalFineAmountperMonthArray[3] / MonthFineArray[3];
        } else if (date.substring(3,5) == '05') {
          MonthFineArray[4] += 1;
          TotalFineAmountperMonthArray[4] += Number(FineAmount);
          AverageFineAmountArray[4] = TotalFineAmountperMonthArray[4] / MonthFineArray[4];
        } else if (date.substring(3,5) == '06') {
          MonthFineArray[5] += 1;
          TotalFineAmountperMonthArray[5] += Number(FineAmount);
          AverageFineAmountArray[5] = TotalFineAmountperMonthArray[5] / MonthFineArray[5];
        } else if (date.substring(3,5) == '07') {
          MonthFineArray[6] += 1;
          TotalFineAmountperMonthArray[6] += Number(FineAmount);
          AverageFineAmountArray[6] = TotalFineAmountperMonthArray[6] / MonthFineArray[6];
        } else if (date.substring(3,5) == '08') {
          MonthFineArray[7] += 1;
          TotalFineAmountperMonthArray[7] += Number(FineAmount);
          AverageFineAmountArray[7] = TotalFineAmountperMonthArray[7] / MonthFineArray[7];
        } else if (date.substring(3,5) == '09') {
          MonthFineArray[8] += 1;
          TotalFineAmountperMonthArray[8] += Number(FineAmount);
          AverageFineAmountArray[8] = TotalFineAmountperMonthArray[8] / MonthFineArray[8];
        } else if (date.substring(3,5) == '10') {
          MonthFineArray[9] += 1;
          TotalFineAmountperMonthArray[9] += Number(FineAmount);
          AverageFineAmountArray[9] = TotalFineAmountperMonthArray[9] / MonthFineArray[9];
        } else if (date.substring(3,5) == '11') {
          MonthFineArray[10] += 1;
          TotalFineAmountperMonthArray[10] += Number(FineAmount);
          AverageFineAmountArray[10] = TotalFineAmountperMonthArray[10] / MonthFineArray[10];
        } else if (date.substring(3,5) == '12') {
          MonthFineArray[11] += 1;
          TotalFineAmountperMonthArray[11] += Number(FineAmount);
          AverageFineAmountArray[11] = TotalFineAmountperMonthArray[11] / MonthFineArray[11];
        };

        //Array Creation
        FineTable.push([FineID, '', CarPlate, date, Time, FineAmount + "€", Paid, '', CarCountry]);
        FineAmountArray.push(FineAmount);
        FineTypeArray.push(FineType);
        FineCarDetails.push([CarPlate + " (" + CarCountry + ")", CarColor, CarBrand, CarType]);
        FineTypeDetails.push([FineType, FineAmount + "€", Day + " " + date + " " + Time, Address, Day, date, Time]);
        FineLatLong.push([CarPlate, Lat, Lon]);

    });
    FineDayArray.reverse()
    DateArray.reverse()
    bargraph_ticketsperday();
    bargraph_ticketspermonth();
    bargraph_fineamountspermonth()
    
    return FineTable;
  })
};

console.log(MonthFineArray);


function LastWeekDays () {
  var result = [];
  var d = new Date();
  console.log(d.getDay());
  if (d.getDay() == 0) {
    result = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
  } else if (d.getDay() == 1) {
    result = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday","Monday"];
  } else if (d.getDay() == 2) {
    result = ["Wednesday", "Thursday", "Friday", "Saturday","Sunday","Monday", "Tuesday"];
  } else if (d.getDay() == 3) {
    result = ["Thursday", "Friday", "Saturday","Sunday","Monday", "Tuesday","Wednesday"];
  } else if (d.getDay() == 4) {
    result = ["Friday", "Saturday","Sunday","Monday", "Tuesday","Wednesday", "Thursday"];
  } else if (d.getDay() == 5) {
    result = ["Saturday","Sunday","Monday", "Tuesday","Wednesday", "Thursday","Friday"];
  } else if (d.getDay() == 6) {
    result = ["Sunday","Monday", "Tuesday","Wednesday", "Thursday","Friday","Saturday"];
  }
  return(result);
};
Chart.defaults.global.defaultFontFamily = 'Roboto';

function bargraph_ticketsperday() {
  var ctx=document.getElementById('Chart');
  var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: DateArray,
      datasets: [
        {
          data: FineDayArray,
          label: 'Αριθμός παραβάσεων',
          backgroundColor: '#39C0BA'
        }
      ]
    },
  options: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: "Αριθμός βεβαιώσεων παραβάσεων την τελευταία εβδομάδα",
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }]
    }
  }
  })
};

function bargraph_ticketspermonth() {
  var ctx=document.getElementById('Chart2');
  var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: MonthArray,
      datasets: [
        {
          data: MonthFineArray,
          label: 'Αριθμός παραβάσεων',
          backgroundColor: '#39C0BA'
        }
      ]
    },
  options: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: "Αριθμός βεβαιώσεων παραβάσεων ανά μήνα",
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }]
    }
  }
  })
};

function bargraph_fineamountspermonth() {
  var ctx=document.getElementById('Chart3');
  var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: MonthArray,
      datasets: [
        {
          data: AverageFineAmountArray,
          type: 'line',
          label: 'Μέση τιμή βεβαιωμένων παραβάσεων (€)',
          borderColor: '#1f1f1f',
          fill: true
        },
        {
          data: TotalFineAmountperMonthArray,
          label: 'Σύνολο βεβαιωμένων παραβάσεων (€)',
          backgroundColor: 'rgba(57,192,186,1)',
        }
      ]
    },
  options: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: "Αριθμός βεβαιώσεων παραβάσεων ανά μήνα (€)",
    },
  }
  })
};


var appBanners = document.getElementsByClassName('print'), i;
for (i = 0; i < appBanners.length; i += 1) {
    appBanners[i].style.display = 'none';
  };
document.getElementById('logout').addEventListener('click', function(event) {
  firebase.auth().signOut();
  window.location.replace("../index.html");
});