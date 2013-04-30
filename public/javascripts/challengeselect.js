$(function(){
     $(".challengeselect").click( function (evt) {
        $.post("/selectchallenge", {projectname: this.value}, function (data) {
        	window.location = data.redirect;
        });
     });
     $(".challenge").hover( function (evt) {
     	$(evt.target).find(".hidden").show()
     })

     $(".challenge").mouseleave( function (evt) {
        $(evt.target).find(".hidden").hide()
     })

     $(".hidden").mouseleave( function (evt) {
        $(evt.target).find(".hidden").hide()
     })
})

