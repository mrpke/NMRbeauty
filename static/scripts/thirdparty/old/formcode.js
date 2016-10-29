
$(function(){
    $("#plz").change(function() {
        var plz = $("#plz").val();
        $.get('/adduser/plz/'+plz, function(result) {
            $('#ort').val(result);
        });
    });    
    $("#cre").click(function(event) {
        event.preventDefault();
        insertUser();
    });
function insertUser() {
    var data = Object();
    var yes = false;
    data.code = $("#code").val();
    data.pass = $("#pass").val();
    data.date = $("#date").val();
    data.vorn = $("#vorn").val();
    data.nach = $("#nach").val();
    data.mail = $("#mail").val();
    data.adres = $("#address").val();
    data.plz = $("#plz").val();
    var req = "/adduser/validatedata";
    $.ajax({
        url: req,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function(datas) {
            if(datas.succ == "1"){
               window.location.replace("/adduser/thanks/"+datas.uid);
            }
        },
        error: function(error) {
        }  
    });
    }
});
