var mainText = document.getElementById('mainText');
var submitBtn= document.getElementById("submitBtn");
var fireHeading = document.getElementById("fireHeading");
var table_element = document.getElementById("table_element");
var table_body = document.getElementById("table_body");

//var firebaseHeadingRef = firebase.database().ref().child("Users").child("user_01").child('Email');
var firebaseHeadingRef = firebase.database().ref().child("Heading");

firebaseHeadingRef.on('value', function(datasnapshot) {
  fireHeading.innerText = datasnapshot.val();
});



function submitClick() {

  var firebaseRef = firebase.database().ref();

  var messageText = mainText.value;

  firebaseRef.push().set(messageText);
};

var rootRef = firebase.database().ref().child("Users");

rootRef.on("child_added", snap => {

  var name = snap.child("Name").val();
  var email = snap.child("Email").val();

//  $("table_body").append("<tr><td>" + name + "</td></tr>" + email + "</td></tr>");
  table_element.innerText = name;
  $("#table_body").append("<tr><td>" + email + "</td><td>" + name + "</td></tr>");
});
