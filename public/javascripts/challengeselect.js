$(function(){
     $(".challengeselect").click( function (evt) {
        $.get("/selectchallenge", {projectname: this.value})
     })
     $(".challenge").mouseover( function (evt) {
     	$(evt.target).find(".hidden").show()
     })
     // $(".challenge").mouseout( function (evt) {
     // 	$(evt.target).find(".hidden").hide()
     // })
})

