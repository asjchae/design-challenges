$(function(){
     $(".challengedrop").click( function (evt) {
        $.post("/drop", {projectname: this.value}, function (data) {
        	console.log("meow");
        	window.location = data.redirect;
        });
     });
});
