
$(document).ready(function() {
        $("#btLogin").bind("click", function(e){
            e.stopPropagation();

                user=$("input[name='user']").val();
                passwd=$("input[name='passwd']").val();

                var params = {"action" : "login", "user": user, "passwd":passwd};

                $.ajax({
                        data:  params,
                        url:   'models/sessionManager.php',
                        type:  'post',
                        success:  function (response) {
                                if (response) {
                                        window.location = "admin.php";
                                } else{
                                        $("input[name='user']").css("background", "#aaaaaa");
                                        $("input[name='passwd']").css("background", "#aaaaaa");
                                  }
                                } // end success
                        });

                });


        $("#btDisconnect").bind("click", function(e){
                var params = {"action" : "logout"};
                $.ajax({
                    data:  params,
                    url:   'models/sessionManager.php',
                        type:  'post',
                        success:  function (response) {
                                window.location = "index.php";
                                } // end success
                        });


                });


});
