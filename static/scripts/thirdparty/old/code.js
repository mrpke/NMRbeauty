$(function(){
    $(document).on('click', "#create", function(event) {
        event.preventDefault();
        var group = $("#group").val();
        var number = $("#number").val();
        var year = $("#year").val();
        if (year && number){
            $("#newmiddle").load("/adduser/thecreation/"+group+"/"+number+"/"+year);
        }
    });    
    $("#group").change(function() {
        var group = $("#group").val();
        $("#newmiddle").load("/adduser/thecreation/"+group);
        $("#download").attr("href", "/adduser/thecreation/"+group+"/csv")
    });    
    $("#yearOld").change(function() {
        var year = $("#yearOld").val()
        $(document).off("click", '#backOld').on("click", '#backOld', {card: "#cardOld", id: "chartOld", year: year }, function(event){flipping(event.data.card, event.data.id, 'undefined', event.data.year);});
        /*var req = "/adduser/datanormus/"+year;
        $.getJSON(req, prepare);*/
        flipping("#cardOld", "#chartOld", "", year);
    });
    $("#delete").click(function(event) {
        event.preventDefault();
        var group = $("#group").val();
        $("#newmiddle").load("/adduser/thecreation/"+group+"/delete");
    });    
    $("#search").click(function (){
        var searchstr = $("#searchString").val()
        var req = "/adduser/search/"+searchstr
        $.getJSON(req, searchResult)
    });
    $("#searchString").keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            $('#search').click();
        }
    });
    $(document).off("click", "#backResult").on("click", "#backResult", {card: "#resultCard"}, flipback);
    $(document).off("click", "#createNewUser").on("click", "#createNewUser", singleUserInsert);
});
