$(function(){
     $(".loginbutton").click( function (evt) {
        $.post("/login", {teamdata: [teamname, pwd]}, function (data) {
        	console.log("meow");
        	window.location = data.redirect;
        });
     });
});
