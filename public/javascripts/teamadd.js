$(function(){
    $(document).ready(function () {
       $('#teamname').keyup(function (){ 
            console.log($('#teamname')[0].value)
            
            $.post("/checkteam", {teamname: $('#teamname')[0].value }, function(data) {
                console.log(data)
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