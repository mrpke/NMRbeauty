var all;

$(function(){

$.getJSON("/getBallots", setBallots);

$("#loadBallot").on("click",function(){  $.getJSON("/loadBallot/"+$("#ballot").val(), loadBallots);})
$("#openBallot").on("click", createBallot);
$("#names :last").on("keydown", function(e){var keyCode = e.keyCode || e.which;
                                            if (keyCode == 13) {
                                                e.preventDefault();
                                                $("#names :last").off();
                                                addInput();


                                            }});

});

function setBallots(data){
    $("#ballot").empty().append(data);

}

function loadBallots(data){
    $("#names").empty();
    $("#bname").val($("#ballot option:selected").text());
    var index = 1;
    all = data;
    bid = data[1];
    data = data[0];

    for (i of data){

        $("#names").append('<input class="u-full-width u-pull-left" type="text" placeholder="Name" id="name'+index+'" value="'+i.candidate+'">');
        index++;
    }
    $("#openBallot").off();
    $("#openBallot").removeClass("button-primary");
    $("#openBallot").addClass("button-deactivated");
    $("#closeandcount").addClass("button-primary");
    $("#closeandcount").removeClass("button-deactivated");
    $("#closeandcount").on("click",{id: bid},
            function(event){window.location.href = "/closeBallot/"+event.data.id;
                                         });
    $("#bname").off().on("change", function(){
                                                    $("#openBallot").addClass("button-primary");
                                                    $("#openBallot").removeClass("button-deactivated");
                                                    $("#closeandcount").removeClass("button-primary");
                                                    $("#closeandcount").addClass("button-deactivated");
                                                    $("#closeandcount").off();
                                                    $("#openBallot").on("click", createBallot);
                                                })
}

function createBallot(){
    if ($("#bname").val().length === 0){
        $("#message").empty();
        $("#message").append("You have to enter a ballot name!");
        return;
    }
    var data = Object();
    data.candidates = getAllValues();
    data.bname = $("#bname").val();

    var req = "/openBallot"
        $.ajax({
            url: req,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                console.log(data);
                all = data;
                $("#message").empty();
                $("#message").append("Ballot "+$("#bname").val()+" opened!");
                $("#openBallot").off();
                $("#openBallot").removeClass("button-primary");
                $("#openBallot").addClass("button-deactivated");
                $("#closeandcount").addClass("button-primary");
                $("#closeandcount").removeClass("button-deactivated");
                $("#closeandcount").on("click",{id: data[1]},
                                            function(event){window.location.href = "/closeBallot/"+event.data.id;
                                         });
                $("#bname").off().on("change", function(){
                                                    $("#openBallot").addClass("button-primary");
                                                    $("#openBallot").removeClass("button-deactivated");
                                                    $("#closeandcount").removeClass("button-primary");
                                                    $("#closeandcount").addClass("button-deactivated");
                                                    $("#closeandcount").off();
                                                    $("#openBallot").on("click", createBallot);
                                                })


            },
            error: function(error) {
                $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
             }

            });

}

function getAllValues() {
    var inputValues = [];
    $('#names input').each(function() {
        if ($(this).val().length != 0 ){
            inputValues.push($(this).val());
        }

    })
    return inputValues.join(',-?-,');
}

function addInput() {
    num = $("#names").find('.u-pull-left').length;
    $("#names").append('<input class="u-full-width u-pull-left" type="text" placeholder="Name" id="name'+(num+1)+'" style="cursor: auto;">')
    $("#names :last").on("keydown", function(e){var keyCode = e.keyCode || e.which;
                                            if (keyCode == 13) {
                                                e.preventDefault();
                                                $("#names :last").off();
                                                addInput();


                                            }});
}

// JavaScript Document
