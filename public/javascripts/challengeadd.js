$(function(){
    console.log("here")
    window.dateinput = $("#input");
    console.log(window.dateinput);
    window.dateinput.datepicker();//{minDate:0});
    $(document).ready(function () {
       $('#name').keyup(function (){ 
            
            console.log($('#name')[0].value)
            
            $.post("/checkchallenge", {challengename: $('#name')[0].value }, function(data) {
                if ($("#warning").length == 0){
                    if (!data){
                        $("#badname").append('<p style="color:red;" id="warning">This name is taken</p>')
                    }   
                }
                if (data){
                    $("#warning").remove()
                }
            });
        }) 
    });
           
})