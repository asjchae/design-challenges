$(function(){
     $(".challengeselect").click( function (evt) {

        console.log("called!")
        $.post("/selectchallenge", {projectname: this.value}, function (data) {
        	window.location = data.redirect;
        });
     });
     $(".challenge").mouseover( function (evt) {
     	$(evt.target).find(".hidden").show()
     })
     // $(".challenge").mouseout( function (evt) {
     // 	$(evt.target).find(".hidden").hide()
     // })
})

