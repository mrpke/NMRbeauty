function logon(instr, code){

  $.ajax({
       url: '/logon/'+instr,
       type: 'POST',
       data: JSON.stringify([instr, code]),
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       async: false,
       success: function() {

       }
   });

}

function logoff(code){

  $.ajax({
       url: '/logoff',
       type: 'POST',
       data: JSON.stringify([code]),
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       async: false,
       success: function() {

       }
   });

}

$(function() {

  $("#AV600 :checkbox").click(function(){
      console.log($(this).is(":checked"));
      if ($(this).is(":checked")){
            logon(1, $("#pass").val());
      }else{
            logoff($("#pass").val());
      }
    });
    $("#DRX500 :checkbox").click(function(){
        console.log($(this).is(":checked"));
        if ($(this).is(":checked")){
              logon(2, $("#pass").val());
        }else{
              logoff($("#pass").val());
        }
      });
      $("#AVQ400 :checkbox").click(function(){
          console.log($(this).is(":checked"));
          if ($(this).is(":checked")){
                logon(3, $("#pass").val());
          }else{
                logoff($("#pass").val());
          }
        });
        $("#AV300 :checkbox").click(function(){
            console.log($(this).is(":checked"));
            if ($(this).is(":checked")){
                  logon(4, $("#pass").val());
            }else{
                  logoff($("#pass").val());
            }
          });
          $("#AVB400 :checkbox").click(function(){
              console.log($(this).is(":checked"));
              if ($(this).is(":checked")){
                    logon(5, $("#pass").val());
              }else{
                    logoff($("#pass").val());
              }
            });
            $("#AV500 :checkbox").click(function(){
                console.log($(this).is(":checked"));
                if ($(this).is(":checked")){
                      logon(6, $("#pass").val());
                }else{
                      logoff($("#pass").val());
                }
              });





});
