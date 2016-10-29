var all;
var selected = 0;
var bid;
var code;

$(function(){

$("#ballot").on('change', function(){$.getJSON("/handcountBallot/"+$("#ballot").val(),loadCandidates);});
$.getJSON("/getOpenBallots", setBallots);
});
function castTheVote(event){
    if ($("#code").val().length === 0){
        $("#message").empty().append("Enter a code!")
    }else{
        data = Object();
        data.cid = event.data.id;
        data.bid = $("#ballot").val();
        data.code = $("#code").val();
        var req = "/castVote"
        $.ajax({
            url: req,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                    if (data == 0){
                       $("#message").empty().append("Voted! "+$("#code").val())
                     }else{
                        $("#message").empty().append("Something went wrong with your code!");
                     }
            },
            error: function(error) {
                $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
             }

            });

 }
}

function setBallots(data){
    value = $("#ballot").val()
    $("#ballot").empty().append(data);
    $("#ballot").val(value)
   ;
}

function loadCandidates(data){
    all = data
    $("#cand").empty();
    $("#cand").append(data[0]);
    for (i of data[1]){
        $("#cast"+i).off().on("click", {id: i}, castTheVote);
    }


}


// JavaScript Document
