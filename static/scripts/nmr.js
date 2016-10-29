Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addMinutes= function(h){
    this.setMinutes(this.getMinutes()+h);
    return this;
}
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
Date.prototype.fromDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() + this.getTimezoneOffset());
    return local;
});

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    return Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);
}

var d, weekday, day, dd;
var dd;
var legend;

weekday = new Array(7);
weekday[0]=  "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

function updateDateVals(){
  d_parts = $("#day").val().split("-");
  d = new Date(d_parts[0], d_parts[1]-1, d_parts[2]);
  d = d.fromDateInputValue();
  dd = daysBetween(new Date(), d);
  day = weekday[d.getDay()];
  return dd;
}

function reserveTimes(day, dd){
  var times =  []
  dd = updateDateVals()
  for (i in _.range(1, 8)){
    selInstr = d3.selectAll(".selected.instr"+i);
    console.log(selInstr)
    if(selInstr[0].length > 0){
      for (ii=0; ii < selInstr[0].length; ii++){
        //console.log(selInstr.data()[ii]["hour"])
        resdata = selInstr.data();

        times.push(Array([i, resdata[ii]["hour"].getHours(), resdata[ii]["hour"].getMinutes()]))
      }
    }

  }
  console.log("dd_"+dd)
  $.ajax({
       url: '/reserveTimes/'+day+'/'+dd,
       type: 'POST',
       data: JSON.stringify([times, $("#name").val(), $("#pass").val()]),
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       async: false,
       success: function() {

       }
   });
   updateBook(1, day);
   updateBook(2, day);
   updateBook(3, day);
   updateBook(4, day);
   updateBook(5, day);
   updateBook(6, day);
}

function cancelTimes(day, dd){
  var times =  []
  dd = updateDateVals()
  for (i in _.range(1, 8)){
    selInstr = d3.selectAll(".selected.instr"+i);
    //console.log(selInstr)
    if(selInstr[0].length > 0){
      for (ii=0; ii < selInstr[0].length; ii++){
        //console.log(selInstr.data()[ii]["hour"])
        resdata = selInstr.data();

        times.push(Array([i, resdata[ii]["hour"].getHours(), resdata[ii]["hour"].getMinutes()]))
      }
      console.log(times)
    }

  }
  console.log(times)
  $.ajax({
       url: '/cancelTimes/'+$("day").val()+'/'+dd,
       type: 'POST',
       data: JSON.stringify([times, $("#name").val(), $("#pass").val()]),
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       async: false,
       success: function() {

       }
   });
   updateBook(1, $("day").val());
   updateBook(2, $("day").val());
   updateBook(3, $("day").val());
   updateBook(4, $("day").val());
   updateBook(5, $("day").val());
   updateBook(6, $("day").val());
}

function getAllBookers(data){
  bookers = Array();
  for (i in data){
    if (!!$.inArray(data[i][0], bookers)){
      bookers.push(data[i][0]);
    }

  }
  return bookers;
}

function updateBook(instr, day){
  updateDateVals();
  allcards = d3.selectAll(".instr"+instr)

  allcards.classed("selected", false);
  //console.log(instr);
  //alert("/nmrTimes/"+instr+"/"+day);
  d3.json("/nmrTimes/"+instr+"/"+day+'/'+dd, function(error, json){
    var cards = d3.selectAll(".instr"+instr)
    cards.transition().duration(1)
        .style("fill", function(d, i) { return colorScale(0); });
    if (error) return console.warn(error);
      bookdata = json;
      bookers = getAllBookers(bookdata);
      c20 = d3.scale.category20()
        .domain(bookers);
    for (ib in bookdata){
      if (bookdata[ib][0] == "!Walk-On" || bookdata[ib][0] == "!Walk-on"){
        c = cards.filter(function (d,i) {return (i<=bookdata[ib][2]+1 && i>=bookdata[ib][1]+1);})
          .attr("title", bookdata[ib][0])
          .transition().duration(10)
          .style("fill", "orange");
            $(c[0]).tipsy();
      }else if (~bookdata[ib][0].indexOf($("#name").val())&& $("#name").val()){
        c = cards.filter(function (d,i) {return (i<=bookdata[ib][2]+1 && i>=bookdata[ib][1]+1);})
          .attr("title", bookdata[ib][0])
          .transition().duration(10)
          .style("fill", "green");
            $(c[0]).tipsy();
      }else{
        //console.log(bookdata[ib][0], $("#name").val())
        c = cards.filter(function (d,i) {return (i<=bookdata[ib][2]+1 && i>=bookdata[ib][1]+1);})
          .attr("title", bookdata[ib][0])
          .transition().duration(10)
          .style("fill", c20(bookdata[ib][0])); //"red");

          $(c[0]).tipsy();
      }
    }


  });
}



var svg = 0;
var cards = 0;
var colorScale = 0;
var selection = Object();
$(function() {
  $('#day').blur(updateDateVals());
  var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day_m = dtToday.getDate();
    var year = dtToday.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day_m < 10)
        day_m = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day_m;
    $('#day').attr('min', maxDate);
    $('#day').val(new Date().toDateInputValue());
    updateDateVals();
    console.log(dd);
    console.log(day);
    /* d3 drawing*/

  var margin = { top: 50, right: 0, bottom: 100, left: 150 },
         width = 2000 - margin.left - margin.right,

         gridSize = Math.floor(width / (24*6)),
         legendElementWidth = gridSize*2,
         height = gridSize*9 ,
         buckets = 9,
         colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
         days = ["AV-600", "DRX-500", "AVQ-400", "AV-300", "AVB-400", "AV-500"],
         times = ["0","1a", "2a", "3a", "4a", "5a", "6a", "7a",
                  "8a", "9a", "10a", "11a", "12a", "1p", "2p",
                   "3p", "4p", "5p", "6p", "7p", "8p", "9p",
                    "10p", "11p"];
         datasets = ["static/data.tsv", "data2.tsv"];

     svg = d3.select("#chart").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      timeLayer = svg.append('g');
      legendLayer = svg.append('g');
      legend = legendLayer.append("g")

     var dayLabels = svg.selectAll(".dayLabel")
         .data(days)
         .enter().append("text")
           .text(function (d) { return d; })
           .attr("x", 0)
           .attr("y", function (d, i) { return i * gridSize*2+gridSize*.5; })
           .style("text-anchor", "end")
           .attr("transform", "translate(-30," + gridSize / 1.5 + ")")
           .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

     var timeLabels = legendLayer.selectAll(".timeLabel")
         .data(times)
         .enter().append("text")
           .text(function(d) { return d; })
           .attr("x", function(d, i) {return ((i*6)-1) * gridSize; })
           .attr("y", 0)
           .style("text-anchor", "middle")
           .attr("transform", "translate(" + gridSize*0 / 2 + ", -6)")
           .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
      var timeLines = legendLayer.selectAll(".timeLine")
               .data(times)
               .enter().append("line")
                .attr("x1", function(d, i) {return ((i*6)-1) * gridSize; })
                .attr("x2", function(d, i) {return ((i*6)-1) * gridSize; })
                .attr("y", -10)
                .attr("y2", (gridSize*2)*6+10)
                .attr("transform", "translate(-0, 0)")
                .attr("class", "timeline");

     var format = d3.time.format("%H:%M")
     heatmapChart = function(tsvFile, instr) {
       var instrumentLayer = timeLayer.append('g')
                              .attr("class", "instr"+instr);
       d3.tsv(tsvFile,
       function(d) {
         return {
           day: 1,
           hour: format.parse(d.hour),
           value: +d.value
         };
       },
       function(error, data) {
         colorScale = d3.scale.quantile()
             .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
             .range(colors);

         var cards = instrumentLayer.selectAll(".hour "+".instr"+instr)
             .data(data, function(d) {return d.day+':'+d.hour;});

         cards.append("title");

         cards.enter().append("rect")
             .attr("x", function(d,i) { return (i - 1) * gridSize; })
             .attr("y", function(d) { return (1 - 1) * gridSize; })
             .attr("rx", 4)
             .attr("ry", 4)
             .attr("transform", "translate(0, " + gridSize*2*(instr-1) + ")")
             .attr("class", "hour bordered instr"+instr)
             .attr("width", gridSize)
             .attr("height", gridSize*2)
             /*.on( "click", function( d, i) {
                  var e = d3.event,
                  g = this,
                  isSelected = d3.select( g).classed( "selected");

                  if( !e.ctrlKey) {
                    d3.selectAll( 'g.selected').classed( "selected", false);
                  }

                  d3.select( g).classed( "selected", !isSelected);

                  // reappend dragged element as last
                  // so that its stays on top
                  g.parentNode.appendChild( g);
                })*/
             .on("mousedown", function(d, i, instr){
               //console.log("down")
               d3.selectAll( 'g.selected').classed( "preselected", false);
               var p = d3.mouse(this);
               instrument = this.className.baseVal.slice(14, 20);
              //console.log(this.className.baseVal, instrument)
               selection[0] = instrument;
               selection[1] = i;
               selection[3] = true;

             })
             .on("mouseup", function(d, i, instr){
               d3.selectAll(".preselected").classed("preselected", false);
             //console.log("up")
               var p = d3.mouse(this);
               selection[2] = i
               if (selection[2] < selection[1]){
                  var t = selection[1];
                  selection[1] = selection[2];
                  selection[2] = t;
               }
               var e = d3.event,
               g = this;
               allcards = d3.selectAll("."+selection[0])
                          .filter(function(d, i){ return i>=selection[1]+1 && i<=selection[2]+1;})
               //console.log(allcards)
               for (ii in _.range(selection[1], selection[2]+1)){
                 //console.log(ii)
                 var activeCard = allcards.filter(function(d,i){ console.log(ii, i);return ii==(i); })
                 isSelected = activeCard.classed( "selected");

                 if( !e.ctrlKey) {
                   d3.selectAll( 'g.selected').classed( "selected", false);
                 }

                 activeCard.classed( "selected", !isSelected);
               }
               allcards.classed("preselected", false);
               selection[3] = false;
             })
             .on("mousemove", function(d, i, instr){
               if (selection[3]){
                 allcards = d3.selectAll("."+selection[0])
                            .filter(function(d, i){ return i>=selection[1]+1 && i<=selection[2]+1;})

              allcards.classed("preselected", false);
               var p = d3.mouse(this);
               selection[2] = i
               if (selection[2] < selection[1]){
                  var t = selection[1];
                  selection[1] = selection[2];
                  selection[2] = t;
               }
               var e = d3.event,
               g = this;
               allcards = d3.selectAll("."+selection[0])
                          .filter(function(d, i){ return i>=selection[1]+1 && i<=selection[2]+1;})

               for (ii in _.range(selection[1], selection[2]+1)){

                 var activeCard = allcards.filter(function(d,i){ return ii==(i); })
                 isSelected = activeCard.classed( "selected");
                 activeCard.classed( "preselected", true);
               }
             }
             })
             .style("fill", colors[0]);

         cards.transition().duration(1000)
             .style("fill", function(d, i) { return colorScale(0); });

        //updateBook(instr, $("#day").val());
        d3.json("/nmrTimes/"+instr+"/"+day+"/0", function(error, json){
            if (error) return console.warn(error);
              bookdata = json;
            for (ib in bookdata){
              if (bookdata[ib][0] == "!Walk-On" || bookdata[ib][0] == "!Walk-on"){
                cards.filter(function (d,i) {return (i<=bookdata[ib][2] && i>=bookdata[ib][1]);})
                  .transition().duration(10)
                  .style("fill", "orange");

              }else if (~bookdata[ib][0].indexOf($("#name").val()) && $("#name").val()){
                cards.filter(function (d,i) {return (i<=bookdata[ib][2] && i>=bookdata[ib][1]);})
                  .transition().duration(10)
                  .style("fill", "green");
              }else{
                cards.filter(function (d,i) {return (i<=bookdata[ib][2] && i>=bookdata[ib][1]);})
                  .transition().duration(10)
                  .style("fill", "red");

              }
            }

          });

         cards.select("title").text(function(d) { return d.value; });

         /*instrumentLayer.on( "mousedown", function() {
                        if( !d3.event.ctrlKey) {
                              d3.selectAll( 'g.selected').classed( "selected", false);
                        }

                        var p = d3.mouse( this);

                        svg.append( "rect")
                        .attr({
                            rx      : 6,
                            ry      : 6,
                            class   : "selection",
                            x       : p[0],
                            y       : p[1],
                            width   : 0,
                            height  : 0
                          })
                        })
                      .on( "mousemove", function() {
                        var s = svg.select( "rect.selection");

                        if( !s.empty()) {
                            var p = d3.mouse( this),
                                d = {
                                    x       : parseInt( s.attr( "x"), 10),
                                    y       : parseInt( s.attr( "y"), 10),
                                    width   : parseInt( s.attr( "width"), 10),
                                    height  : parseInt( s.attr( "height"), 10)
                                },
                                move = {
                                    x : p[0] - d.x,
                                    y : p[1] - d.y
                                }
                            ;

                            if( move.x < 1 || (move.x*2<d.width)) {
                                d.x = p[0];
                                d.width -= move.x;
                            } else {
                                d.width = move.x;
                            }

                            if( move.y < 1 || (move.y*2<d.height)) {
                                d.y = p[1];
                                d.height -= move.y;
                            } else {
                                d.height = move.y;
                            }

                            s.attr( d);

                                // deselect all temporary selected state objects
                            d3.selectAll( 'g.state.selection.selected').classed( "selected", false);

                            d3.selectAll( 'g.state >circle.inner').each( function( state_data, i) {
                                if(
                                    !d3.select( this).classed( "selected") &&
                                        // inner circle inside selection frame
                                    state_data.x-radius>=d.x && state_data.x+radius<=d.x+d.width &&
                                    state_data.y-radius>=d.y && state_data.y+radius<=d.y+d.height
                                ) {

                                    d3.select( this.parentNode)
                                    .classed( "selection", true)
                                    .classed( "selected", true);
                                }
                            });
                        }
                    })
                    .on( "mouseup", function() {
                         // remove selection frame
                         svg.selectAll( "rect.selection").remove();

                          // remove temporary selection marker class
                          d3.selectAll( 'g.state.selection').classed( "selection", false);
                    })
                    .on( "mouseout", function() {
                          if( d3.event.relatedTarget.tagName=='HTML') {
                                // remove selection frame
                            svg.selectAll( "rect.selection").remove();

                                // remove temporary selection marker class
                            d3.selectAll( 'g.state.selection').classed( "selection", false);
                        }
                  });*/

         cards.exit().remove();
       });

     };


     for (i=1; i<7; i++){
       //console.log(i)
        heatmapChart(datasets[0], i);



      }
      //setInterval(function(){updateBook(1);}, 5000);
      //setInterval(function(){updateBook(2);}, 5000);
      //setInterval(function(){updateBook(3);}, 5000);
      //setInterval(function(){updateBook(4);}, 5000);
      //setInterval(function(){updateBook(5);}, 5000);
      //setInterval(function(){updateBook(6);}, 5000);

     var now = new Date().addHours(0);
     var active = now.getHours()*6+Math.floor(now.getMinutes()/10)+1;


     line = legendLayer.append("line")
                .attr("x1", (active-1)*gridSize)
                .attr("y1", -10)
                .attr("x2", (active-1)*gridSize)
                .attr("y2", (gridSize*2)*6+10)
                .attr("stroke-width", 2)
                .attr("stroke", "red");

     var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
       .data(datasets);

     datasetpicker.enter()
       .append("input")
       .attr("value", function(d){ return "Dataset " + d })
       .attr("type", "button")
       .attr("class", "dataset-button")
       .on("click", function(d) {
         heatmapChart(d);
       });

       setInterval(function(){
         var now = new Date().addHours(0);
         var active = now.getHours()*6+Math.floor(now.getMinutes()/10);
         active++;

          line.transition().duration(10)
          .attr("x1", (active-1)*gridSize)
          .attr("x2", (active-1)*gridSize);

    }, 5000);

    $("#refresh").on("click", function(){


      updateBook(1, day);
      updateBook(2, day);
      updateBook(3, day);
      updateBook(4, day);
      updateBook(5, day);
      updateBook(6, day);

    });
    $("#reserve").on("click", function(){
      reserveTimes(day);

    });
    $("#cancel").on("click", function(){
      cancelTimes(day);

    });
    /*$("#name").on("blur", function(){
      updateBook(1, day);
      updateBook(2, day);
      updateBook(3, day);
      updateBook(4, day);
      updateBook(5, day);
      updateBook(6, day);
    });*/





     });
