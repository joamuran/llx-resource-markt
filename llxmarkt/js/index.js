
function llxRscMarkt() { }


llxRscMarkt.prototype.getAndPaintAllApps = function getAndPaintAllApps(){
        // Creates a new Ajax call to getAllApps php function on server
        // The JSON list is painted in GUI

        var self=this;

        var params = {"action" : "getAllApps"};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        $("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                        self.Draw(response);
                }
        });

       // Getting categories and subjects
        var params = {"action" : "getMenus"};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        $("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                        self.fillMenuEntries(response);
                }
        });
}

llxRscMarkt.prototype.DrawStars=function DrawStars(popularity, count){
        var mark=Math.floor(popularity/count);
        var rest=(popularity/count)-mark;
        var extra_star="";

        if (rest<0.3) extra_star="fa-star-o";
        else if (rest>0.8) extra_star="fa-star-half-o";
        else extra_star="fa-star";

        var starslabel=$(document.createElement("div"));

        for (i=0;i<mark;i++){
                var star=$(document.createElement("i")).addClass("fa fa-star mystar");
                $(starslabel).append(star);
        }

        var star=$(document.createElement("i")).addClass("fa mystar").addClass(extra_star);
        $(starslabel).append(star);

        for (i=mark+1;i<5;i++){
                var star=$(document.createElement("i")).addClass("fa fa-star-o mystar");
                $(starslabel).append(star);
        }

        var votes=$(document.createElement("span")).addClass("appDeveloper").html("    ("+count+")");
        starslabel.append(votes);

        return starslabel;
}

llxRscMarkt.prototype.Draw=function Draw(data){
        var self=this;

        $("#appsDiv").empty();
        var apps=JSON.parse(data);
        //console.log(apps);
        //console.log(typeof(apps));
        for (i in apps){
                app=JSON.parse(apps[i]);
                // Check for empty icon
                if(app["icon"]==="") {
                        if (app["type"]==="flash" || app["type"]==="html" || app["type"]==="jclic")
                                app["icon"]="apps.icons/"+app["type"]+".png";
                        else app["icon"]="apps.icons/generic.png";
                }

                var img=$(document.createElement("img")).addClass("appIcon").attr("src", app["icon"]);
                var rscname=$(document.createElement("div")).html(app["name"]).addClass("appName");
                var item=$(document.createElement("div")).addClass("AppContainer").attr("rsc", app["id"]).attr("data-app", apps[i]);
                var devname=$(document.createElement("div")).html(app["developer"]["name"]).addClass("appDeveloper");
                var stars=self.DrawStars(app["popularity"]["sum"], app["popularity"]["count"]);

                var buttonrow=$(document.createElement("div")).addClass("ButtonRow");


                var icon=$(document.createElement("i")).addClass("fa  fa-arrow-circle-down rotate45");
                var icondownload=$(document.createElement("i")).addClass("fa  fa-arrow-circle-down");

                // Download Button
                var text=$(document.createElement("span")).addClass("BtnMini").html(I18n.gettext("app.download"));
                var downloadButton=$(document.createElement("button")).addClass("btn btn-primary btn-xs BtnDownload");
                $(downloadButton).append([icondownload,text]);

                // Launch Button
                var launch_button=$(document.createElement("button")).addClass("btn btn-primary btn-xs BtnDownload");
                var textload=$(document.createElement("span")).addClass("BtnMini").html(I18n.gettext("app.launch"));
                $(launch_button).append([icon,textload]);


                // web és per als recursos que són online,caldrà vore si un jclic es pot llançar directament,
                // o un recurs flash, etc...
                // o siga, mirar llançadors per a cada tipus de recurs

                //if (app["source"]["type"]==="web" || app["source"]["type"]==="jclic") $(buttonrow).append([launch_button, downloadButton]);
                if (app["type"]==="web" || app["type"]==="jclic") $(buttonrow).append([launch_button, downloadButton]);
                else $(buttonrow).append(downloadButton);


                // dos spans amb flexeta cap avall


                $(item).append([img, rscname, devname, stars, buttonrow]);
                //$(item).addClass("col-sm-4").addClass("AppContainer");
                $("#appsDiv").append(item);


                // Event Handlers
                $(item).bind("click", function(event){
                        self.showAppInfo($(event.currentTarget).attr("data-app"));
                        //alert($(event.currentTarget).attr("rsc"));

                        })

                $(downloadButton).bind("click", function(event){
                        event.stopPropagation();
                        //alert("Downloading: "+$(event.currentTarget).parent().attr("rsc"));
                        self.downloadResource($(event.currentTarget).parent().parent().attr("rsc"), {"launch":false});
                        })

                $(launch_button).bind("click", function(event){
                        event.stopPropagation();
                        self.downloadResource($(event.currentTarget).parent().parent().attr("rsc"), {"launch":true});
                        })

        }





}

llxRscMarkt.prototype.downloadResource=function downloadResource(file, options){
        // if launch is true, we are launching resource. If it's false, we'll donload it

        // utilitzat en lloc de launch un json com a paràmetre...->options
        // WIP: Posem un tercer paràmetre que indique el tipus, i segons el tipus carreguem d'una o altra manera...
        // $(event.currentTarget).parent().parent().attr("data.app") -> i dins de data app -> type

        var self=this;

        var launch=options.launch;

        var params = {"action" : "downloadResource", "filename": file+".manifest"};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                success:  function (response) {
                        //var filename = window.location.href+response;
                        var filename = response;
                        //window.location = filename; // Carrega en la mateixa pestanya
                        //window.location.href = filename; // Carrega en nova pestanys

                        if (launch) window.location.href = filename; // Carrega en nova pestanys
                        else window.location.href = "download.php?f="+filename; // Descarrega

                }
        });

}


llxRscMarkt.prototype.showAppInfo=function showAppInfo(data_app){
        var self=this;
        app=JSON.parse(data_app);

        // Check for empty icon
        if(app["icon"]==="") {
                if (app["type"]==="flash" || app["type"]==="html" || app["type"]==="jclic")
                        app["icon"]="apps.icons/"+app["type"]+".png";
                else app["icon"]="apps.icons/generic.png";}

        $("#imgApp").attr("src", app["icon"]);
        $("#appDescDev").empty().html(app["developer"]["name"]);
        $("#appDescDevUrl").empty().html(app["developer"]["url"]);
        stars=self.DrawStars(app["popularity"]["sum"], app["popularity"]["count"]);
        $("#appDescStars").empty().append(stars);
        $("#appDescName").empty().html(app["name"]);
        $("#RscType").empty().html(app["type"]);

        //$("#BtDownloadResource").attr("data-launch-file",app["launch_file"]);
        $("#BtDownloadResource").attr("data-location",app["source"]["location"]);
        $("#BtDownloadResource").attr("data-id",app["id"]);

        if (app["source"]["type"]=="web") {
                $("#BtLaunchResource").attr("data-location",app["source"]["location"]);
                $("#BtLaunchResource").attr("data-id",app["id"]);

        } else $("#BtLaunchResource").hide();
        //$("#BtDownloadResource").attr("data-launch-url",app["source"]["location"]); -> inclos dalt

        // Levels translation
        if (app["level"].length>0){
                app["level"].forEach(function(item, index) {
                        app["level"][index]=I18n.gettext("level."+item);
                });

                $("#RscLevel").empty().html(app["level"].join(", "));
        } else $("#RscLevel").empty();

        // Subjects translation
        if (app["subjects"].length>0){
                app["subjects"].forEach(function(item, index) {
                        app["subjects"][index]=I18n.gettext("subject."+item);
                });

                $("#RscSubjects").empty().html(app["subjects"].join(", "));
        } else $("#RscSubjects").empty();


        $("#RscTags").empty().html(app["tags"].join(", "));
        $("#appDescDesc").empty().html(app["description"]);

        /*   TODO
        - Fer la funcionalitat de descàrrega: DONE...

        - Els recursos flash no es descarreguen.. ojete amb dora..
          - podem donar la possibilitat de llançar-los directament, descarregar el descriptor (això hauria de ser desde el server de aula?)
        - Podriem provar a llançar els jclic online també...

        - Posar fletxeta amb el nombr de descarregues

        */


        //if (typeof(app["launch_file"])==="undefined" && typeof(app["launch_url"])==="undefined"){

        if (typeof(app["source"]["location"])==="undefined"){
                $("#BtDownloadResource").hide();
                $("#BtLaunchResource").hide();
        } else {
                $("#BtDownloadResource").unbind("click");
                $("#BtLaunchResource").unbind("click");

                $("#BtDownloadResource").bind("click", function(event){
                                event.preventDefault();
                                id=$(event.currentTarget).attr("data-id");
                                self.downloadResource(id, {"launch":false});
                        })

                $("#BtLaunchResource").bind("click", function(event){
                                event.preventDefault();
                                id=$(event.currentTarget).attr("data-id");
                                self.downloadResource(id, {"launch": true});
                        })

        }

        /*if (typeof(app["source"]["location"])==="undefined"){
                $("#BtDownloadResource").hide();
        } else {
                $("#BtDownloadResource").unbind("click");
                if (app["source"]["type"]==="file") {
                        $("#BtDownloadResource").empty().html(I18n.gettext("app.download"));
                        $("#BtDownloadResource").bind("click", function(event){
                                event.preventDefault();
                                id=$(event.currentTarget).attr("data-id");
                                self.downloadResource(id);
                        })
                    }
                else{
                        $("#BtDownloadResource").empty().html(I18n.gettext("app.launch"));
                        $("#BtDownloadResource").bind("click", function(event){
                                var url=$(event.currentTarget).attr("data-location");
                                var name=$("#appDescName").html();
                                window.open(url);
                                $("#ModalBack").fadeOut(150);

                        })
                }
        }*/

        // Setting Modal Back to "show"
        $("#ModalBack").attr("action", "show");
        $("#ModalBack").fadeIn(150);
}


llxRscMarkt.prototype.fillMenuEntries=function fillMenuEntries(data){
        //console.log(response);
        //$("#appsDiv").html(response);

        var mydata=JSON.parse(data);
        for (i in mydata["types"].sort()) {
                var optionmenu=$(document.createElement("a")).attr("id", mydata["types"][i]);
                $(optionmenu).addClass("list-group-item").addClass("childEntry");
                var optionlabel=$(document.createElement("span")).addClass("itemLabel").html(I18n.gettext("type."+mydata["types"][i]));
                var optioncheck=$(document.createElement("input")).attr("type", "checkbox");
                $(optioncheck).addClass("entryCB");
                $(optionmenu).append([optionlabel, optioncheck]);
                $("#rscTypeMenu").append(optionmenu);
        }

        for (i in mydata["subjects"].sort()) {
                var optionmenu=$(document.createElement("a")).attr("id", mydata["subjects"][i]);
                $(optionmenu).addClass("list-group-item").addClass("childEntry");
                var optionlabel=$(document.createElement("span")).addClass("itemLabel").html(I18n.gettext("subject."+mydata["subjects"][i]));
                var optioncheck=$(document.createElement("input")).attr("type", "checkbox");
                $(optioncheck).addClass("entryCB");
                $(optionmenu).append([optionlabel, optioncheck]);
                $("#rscSubjectMenu").append(optionmenu);
        }


}


llxRscMarkt.prototype.getAndPaintSelectedApps = function getAndPaintSelectedApps(rsctype, rscsubject, rsctags){
        // Creates a new Ajax call to getSelectedApps php function on server
        // The JSON list is painted in GUI
        var self=this;

        var params = {"action" : "getSelectedApps",
                      "rsctype": rsctype,
                      "rscsubject": rscsubject,
                      "rsctags": rsctags};
        console.log("****"+params);

        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        $("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                     self.Draw(response);
                }
        });
}




function preloadFunc() {
    var userLang = navigator.language || navigator.userLanguage;
    var lang=(userLang.split("@"))[0];  // Getting language code
    I18n=new I18n(lang);
}

window.onpaint = preloadFunc();

$(document).ready(function() {
    markt=new llxRscMarkt();
    markt.getAndPaintAllApps();

        $('#tags').tagsInput({
                 'height':'100%',
                'width':'100%',
                'intreractive':true,
                'delimiter': [',',';'],
                'removeWithBackspace' : true,
                'defaultText': I18n.gettext("rsc.addtag"),
                'placeholderColor' : '#666666'

        });

        // Some Event events
        $("#CloseBt").bind("click", function(){
                if (($("#img_selector").css("display"))!=="block")
                        $("#ModalBack").fadeOut(250);
        });

        $("#ModalBack").bind("click", function(){
                // Only hide it if we are not editing
                var action=$("#ModalBack").attr("action");
                if (action!=="edit") {
                        $("#ModalBack").fadeOut(250);
                }

            });
        $("#AppDescription").bind("click", function(event){
                 event.stopPropagation();
                });
        $("#menuConnect").bind("click", function(e){
                e.stopPropagation();
                });


        $("#BtSearch").bind("click", function(){
          //alert("Searching");

          // Getting data

          // Gestionem dos llistes
          // Una amb els atributs a checked i altra amb tots
          // Si la llista amb atributs a checked és buida, s'utilitaza l'altra (no es vol filtrar per eixe camps)

          /*  Getting search resource types */

          var resourceTypeArray=[];
          var resourceTypeArrayChecked=[];

          $("#rscTypeMenu").find("a").each(function(index){
            var name=$(this).attr("id");
            var checked=$(this).find(".entryCB").prop('checked');
            resourceTypeArray.push(name);
            if (checked) resourceTypeArrayChecked.push(name);
          });

          // We got in resourceTypeArrayChecked the list of resource types
          //if (resourceTypeArrayChecked.length===0) resourceTypeArrayChecked=resourceTypeArray;

          /* Getting Search subjects */

          var resourceSubjectArray=[];
          var resourceSubjectArrayChecked=[];

          $("#rscSubjectMenu").find("a").each(function(index){
            var name=$(this).attr("id");
            var checked=$(this).find(".entryCB").prop('checked');
            resourceSubjectArray.push(name);
            if (checked) resourceSubjectArrayChecked.push(name);
          });

          // We got in resourceTypeArrayChecked the list of resource types
          //if (resourceSubjectArrayChecked.length===0) resourceSubjectArrayChecked=resourceSubjectArray;

          // Getting tags input
          var tmp_tagsarray=$("#tags").val().replace(/;/g , "").split(",");
          var tagsArray=[];
          for (i in tmp_tagsarray){
            if (tmp_tagsarray[i]!=="") tagsArray.push(tmp_tagsarray[i]);
          }

          console.log(resourceTypeArrayChecked);
          console.log(resourceSubjectArrayChecked);
          console.log(tagsArray);
          markt.getAndPaintSelectedApps(resourceTypeArrayChecked,  resourceSubjectArrayChecked, tagsArray);


        });

});
