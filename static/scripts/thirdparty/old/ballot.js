var all;
var selected = 0;
var bid;
var code;

$(function(){

$.getJSON("/getOpenBallots", setBallots);

$("#participate").on("click",function(){
        data = Object();
        data.code = $("#code").val();
        code = data.code;
        data.bid  = $("#id").val();
        bid = data.bid;
        var req = "/checkCode"
        $.ajax({
            url: req,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                    console.log(data)
                    getBallotPaper(data)


            },
            error: function(error) {
                $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
             }

            });
                            });


$("#ballot").on("change", function(){$("#id").val($("#ballot").val());});



});

function setBallots(data){
    $("#ballot").empty().append(data);
    $("#id").val($("#ballot").val());

}

function getBallotPaper(data){
    all = data;
    $("#ballotContainer").empty().append(all[0]);
    for (i of all[1]){
        $("#row"+i[1]).off().on("click", {id: i[1], ids: all[1]}, selectCandidate);
    }
    $("#cast").on("click", castTheVote);
}

function selectCandidate(event){
    $("#box"+event.data.id).empty().append("&#9745;");
    $("#row"+event.data.id).off().on("click", {id: event.data.id}, unselectCandidate);
    for (i of all[1]){
        if (i[1] != event.data.id){
            $("#box"+i[1]).empty().append("&#9744;");
            $("#row"+i[1]).off().on("click", {id: i[1], ids: all[1]}, selectCandidate);
        }
    }
    selected = event.data.id;
}

function unselectCandidate(event){
    $("#box"+event.data.id).empty().append("&#9744;")
    $("#row"+event.data.id).off().on("click", {id: event.data.id, ids: event.data.id}, selectCandidate);
    selected = 0;
}

function castTheVote(){
    if (selected != 0){
        data = Object();
        data.cid = selected;
        data.bid = bid;
        data.code = code;
        var req = "/castVote"
        $.ajax({
            url: req,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                    if (data == 0){
                        $("#ballotContainer").empty().append("<h5>Thank you for your vote.</h5> <br /> <a href=\".\">Reload</a>");
                     }else{
                        $("#ballotContainer").empty().append("<h5>Something went wrong with your code!</h5>");
                     }
            },
            error: function(error) {
                $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
             }

            });
  }
  selected = 0;
  bid = 0;
    }


// JavaScript Document
