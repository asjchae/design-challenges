$(function(){

     $(".challenge").hover( function (evt) {
     	$(evt.target).find(".hidden").show()
     })
     $(".challenge").mouseover( function (evt) {
        $(evt.target).find(".hidden").show()
     })

     $(".challenge").mouseleave( function (evt) {
        $(evt.target).find(".hidden").hide()
     })

     $(".hidden").mouseleave( function (evt) {
        $(evt.target).find(".hidden").hide()
     })
})
