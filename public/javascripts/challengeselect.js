$(function(){
     $(".challengeselect").click( function (evt) {
        $.post("/selectchallenge", {projectname: this.value})
     })
})