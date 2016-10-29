
var margin = {top: 30, right: 12, bottom: 20, left: 16},
    width = 384 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

var fields = [
    {field: "CH", art: "used", num: 110},
    {field: "CH", art: "unused", num: 120},
    {field: "LC", art: "used", num: 130},
    {field: "LC", art: "unused", num: 130},
    {field: "CIW", art: "used", num: 150},
    {field: "CIW", art: "unused", num: 100},
    {field: "BC", art: "used", num: 80},
    {field: "BC", art: "unused", num: 100}
];

$.getJSON("/adduser/datanormus/", prepare);
$.getJSON("/adduser/datanormus/2011", prepare);
$.getJSON("/adduser/datanormus/years/", prepare);

function prepare(data)
{
    fields = data.data;
    id = data.id;
    year = data.year;
    cardid = data.cardid;
    backid = data.backid;
    if (id == "#timeline"){
        margin.left = 40;
        width = 868 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;
        $("#loading").remove()
    }else{
        margin.left = 16;
        width = 384 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;
    }
    $(document).off("click", backid).on("click", backid, {card: cardid, id: id, year: year }, function(event){flipping(event.data.card, event.data.id, 'undefined', event.data.year);});
    $(id).empty();
    drawGraph(fields, id, year, cardid);
}

function drawGraph(fields, id, year, cardid)
{
var nest = d3.nest()
            .key(function(d){return d.field;})
            .entries(fields);


main_x0 = d3.scale.ordinal().rangeRoundBands([0, width], 0.2);
main_x1 = d3.scale.ordinal();
main_y = d3.scale.linear().range([height, 0]);

main_x0.domain(fields.map(function(d){return d.field;}));
main_x1.domain(fields.map(function(d){return d.art;}))
                .rangeRoundBands([0, main_x0.rangeBand()], 0);
main_y.domain([0, d3.max(fields, function(d){return d.num;})]);

colorpicker = d3.scale.category20()
                .domain(fields.map(function(d){return d.art;}));

var xAxis = d3.svg.axis()
    .scale(main_x0)
    .orient("bottom");
var yAxis = d3.svg.axis()
     .scale(main_y)
     .orient("left");
var svg  = d3.select(id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var bar = svg.selectAll(".bars")
            .data(nest)
            .enter().append("g")
            .attr("class", function(d) {return d.key;})
            //.style("fill", function(d) {return "#DF7401";})
            ;

bar.selectAll("rect").append("rect")
            .data(function(d) {return d.values;})
            .enter().append("rect")
            .attr("class", function(d){return d.art;})
            .attr("transform", function(d){
                            return "translate("+main_x0(d.field)+",0)";
                            })
            .attr("x", function(d){return main_x1(d.art);})
            .attr("y", function(d){return main_y(d.num);})
            .attr("width", main_x1.rangeBand())
            .attr("height", function(d){
                            return height-main_y(d.num);
                            })
            .on("click", function(d){ flipping(cardid, id, d.field, year);} )
            .attr("fill", function(d){ return colorpicker(d.art);});
if (id != '#timeline'){

    bar.selectAll("text")
                .append("text")
                .data(function(d) {return d.values;})
                .enter().append("text")
                .attr("x", function(d){return main_x1(d.art)+(main_x1.rangeBand()/2.);})
                .attr("transform", function(d){
                                    return "translate("+main_x0(d.field)+",0)";
                               })
                .attr("y", function(d){ 
                                if (main_y(d.num)+20 < height-10){
                                   return main_y(d.num)+20;
                                }else{
                                   return main_y(d.num)+15;
                                }
                               
                })
                .attr("class", "nottoosmall")
                .style("text-anchor", "middle")
                .on("click", function(d){ flipping(cardid, id, d.field, year);} )
                .text(function(d) {return d.num;})
                ;
            
    bar.selectAll("text").filter(function (d){ return d.num < 20;})
                .attr("y", function(d){ 
                             return height-20;
                })
                .attr("class", "toosmall");

    bar.selectAll("text").filter(function (d){ return d.num == 0 && d.art == 'unused';})
                .text("+")
                .attr("class", "plus")
                .attr("x", function(d){return main_x1(d.art)+(main_x1.rangeBand());})
                .on("click", function(d){ flipping(cardid, id, d.field, year);} );


    bar.selectAll("text").filter(function (d){ return d.num == 0 && d.art == 'used';})
                .text("");

    svg.append("text")
                .attr("class", "title")
                .attr("x", width/2)
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .text(year);
     $(id+" rect").tipsy({
                gravity: 's',
                html: true,
                title: function(){
                        var d = this.__data__;
                        return '<span>'+d.art+'</span>';
                }
                });
}else{
     svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
     $("#timeline rect").tipsy({
                gravity: 's',
                html: true,
                title: function(){
                        var d = this.__data__;
                        return '<span>Year: '+d.art+', Students: '+d.num+'</span>';
                }
                });
}   
}

function flipping(cardid, id, field, year)
{
    if (id == '#chartNew'){ 
        $("#group").val(field).change();   
    }
    if (id  == '#timeline'){
        $('#resultCard').removeClass('flip');
        $('#results').empty();
        $('#searchString').val("");
        $('#searchMiddle').empty();
    }
    var req = "/adduser/datanormus/"+year;
    $.getJSON(req, prepare);
    $(cardid).toggleClass('flip');
    if (id == '#chartNew') {
        $("#year").val(year);
    }
}

function fliponclick(event)
{
    var req = "/adduser/datanormus/"+event.data.year;
    $.getJSON(req, prepare);
    $(event.data.card).toggleClass('flip');
}

function flipback(event){
    $("#confirmDelete").css("visibility","hidden")
    $(event.data.card).toggleClass('flip');
}

function searchResult(data)
{
    $("#searchMiddle").html("")
    $("#results").empty();
    $("#resultCard").removeClass('flip');
    var index;
    if (data.length == 0){
        $("#searchMiddle").html("Ay sir, we have nobody by this name!")
    }
    for (index = 0; index < data.length; index++) {
        $("#results").append(data[index].li);
        $(document).off("click", "#"+data[index].id).on("click", "#"+data[index].id, {uid: data[index].id}, searchDetails);
    }
    
}

function searchDetails(event){
    var req = "/adduser/searchDetails/"+event.data.uid;
    $.getJSON(req, displayResults);    
}

function displayResults(data) {
    $("#displayUid").text(data.uid);
    $("#uid").val(data.uid);
    $("#yearsAvailable").val(data.year);
    $("#yearsAvailable").prop("disabled", true);
    $("#fieldsAvailable").val(data.field);
    $("#fieldsAvailable").prop("disabled", true);
    $("#birthDate").val(data.birthDate)
    $("#name").val(data.name);
    $("#surname").val(data.sn);
    $("#mail").val(data.mail);
    $("#address").val(data.homePostalAddress);
    $("#zip").val(data.postalCode);
    $.get("/adduser/plz/"+data.postalCode, function(res){
    $("#city").val(res);
    });
    $(document).off("click", "#saveUserChanges").on("click", "#saveUserChanges", {uid: data.uid}, saveUser);
    $(document).off("click", "#deleteUser").on("click", "#deleteUser", {uid: data.uid}, deleteUser);
    $("#resultCard").toggleClass('flip');
    
}

function saveUser(event) {
    if (!($("#birthDate").val() && 
          $("#name").val() && 
          $("#surname").val() &&
          $("#mail").val() && 
          $("#address").val() &&
          $("#zip").val())  
        ){
        $("#searchMiddle").html("Please complete all the data!");
        return ;
    }
    var req = "/adduser/searchDetails/"+event.data.uid;
    $.getJSON(req, saveUserChanges);    
}

function saveUserChanges(olddata) {


    var data = Object();
    data.data = Object();
    data.uid = olddata.uid;
    data.field = olddata.field;
    data.year = olddata.year;
    var yes = false;
    if($("#password").val() && $("#password").val() == $("#repass").val()){
        data.data.userPassword = $("#password").val()
        yes = true;
    }
    if(olddata.birthDate != $("#birthDate").val()){
        data.data.birthDate = $("#birthDate").val();
        yes = true;
    }
    if(olddata.name != $("#name").val()){
        data.data.cn = $("#name").val()+" "+$("#surname").val();
        yes = true;
    }
    if(olddata.sn != $("#surname").val()){
        data.data.cn = $("#name").val()+" "+$("#surname").val();
        data.data.sn = $("#surname").val();
        yes = true;
    }
    if(olddata.mail != $("#mail").val()){
        data.data.mail = $("#mail").val();
        yes = true;
    }
    if(olddata.homePostalAddress != $("#address").val()){
        data.data.homePostalAddress = $("#address").val();
        yes = true;
    }
    if(olddata.postalCode != $("#zip").val()){
        data.data.PostalCode = $("#zip").val();
        yes = true;
    }
    if (yes){
        var req = "/adduser/updateUser"
        $.ajax({
            url: req,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                if(data.description == "success"){
                    $("#searchMiddle").html("Modification on &lt;"+olddata.uid+"&gt; was successful, go get a coffee!")
                    $('#search').click();
                    
                    $("#resultCard").toggleClass('flip');
                }
            
            },
            error: function(error) {
                $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
             }  
        
            });
    }else{
        $("#searchMiddle").html("If you don't change anything, there is no need for saving!")
    }
    
}

function deleteUser(event){
    
    
    $(document).off("click", "#reallyDeleteUser").on("click", "#reallyDeleteUser", {uid: event.data.uid}, proveDeleteRequest);
    $(document).off("click", "#abortDelete").on("click", "#abortDelete", letItGo);
    $("#confirmDelete").css("visibility","visible")
    
}

function letItGo(){
    $("#confirmDelete").css("visibility","hidden")
}

function proveDeleteRequest(event){
    var req = "/adduser/searchDetails/"+event.data.uid;
    $.getJSON(req, sendDeleteRequest);    
}

function sendDeleteRequest(data){
    var deldata = Object();
    deldata.uid = data.uid;
    deldata.year = data.year;
    deldata.field = data.field;
    var req = "/adduser/deleteUser"
    $.ajax({
        url: req,
        type: "POST",
        data: JSON.stringify(deldata),
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            if(data.description == "success"){
                $("#searchMiddle").html("User &lt;"+deldata.uid+"&gt; deleted!");
                $("#results").empty();
                $("#confirmDelete").css("visibility","hidden")
                $('#search').click();
                $("#resultCard").toggleClass('flip');
            }
        },
        error: function(error) {
           $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
        }  
    });
}

function singleUserInsert() {
    $("#uid").val("");
    $("#yearsAvailable").prop("disabled", false);
    $("#fieldsAvailable").prop("disabled", false);
    $("#birthDate").val("")
    $("#name").val("");
    $("#surname").val("");
    $("#mail").val("");
    $("#address").val("");
    $("#zip").val("");
    $("#cardTimeline").addClass('flip');
    $("#resultCard").addClass('flip');
    $("#displayUid").text("New user"); 
    $(document).off("click", "#saveUserChanges").on("click", "#saveUserChanges", insertUser);
    $(document).off("click", "#deleteUser");

}

function insertUser() {
    if (!($("#birthDate").val() && 
          $("#name").val() && 
          $("#surname").val() &&
          $("#mail").val() && 
          $("#address").val() &&
          $("#password").val() && 
          $("#password").val() == $("#repass").val())
        ){
        $("#searchMiddle").html("Please complete all the data!");
        return ;
    }
    var data = Object();
    var yes = false;
    data.year = $("#yearsAvailable").val()
    data.field = $("#fieldsAvailable").val()
    data.userPassword = $("#password").val()
    data.birthDate = $("#birthDate").val();
    data.name = $("#name").val();
    data.sn = $("#surname").val();
    data.mail = $("#mail").val();
    data.homePostalAddress = $("#address").val();
    data.postalCode = $("#zip").val();
    var req = "/adduser/addUserAdmin"
    $.ajax({
        url: req,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function(datas) {
            if(datas.succ == "1"){
                $("#searchMiddle").html("User &lt;"+datas.uid+"&gt; added!");
                $("#results").empty();
                $("#confirmDelete").css("visibility","hidden")
                $('#search').click();
                $("#resultCard").toggleClass('flip');
            }
        },
        error: function(error) {
           $("#searchMiddle").html("Uhh, no! An error has occured, go get your IT department!")
        }  
    });
    
}
//$(document).ready(function() { $();
