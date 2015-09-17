var typelist;
var levellist;
var subject;

function adminRscMarkt() {
    this.appList=null;
    this.unsortedApps=null;
    this.currentRemoteServer="127.0.0.0.1"; // Sets the remote server where we are connected
    this.ordersort={"name":true, "type":true};
}

adminRscMarkt.prototype.PaintAdminApps = function PaintAdminApps(){
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
                        self.appList=response;
                        //console.log(self.appList);
                        self.drawApps();
                }
        });
}


adminRscMarkt.prototype.PaintUnregisteredApps = function PaintUnregisteredApps(){
    var self=this;
    var params = {"action" : "getUnregisteredApps"};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        //$("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                        self.unsortedApps=response;
                        //console.log(self.unsortedApps);
                        //alert(response);
                        self.drawUnsortedApps();
                }
        });
}


adminRscMarkt.prototype.drawUnsortedApps = function drawUnsortedApps(){
    var self=this;
    var data=self.unsortedApps;

    $("#unregisteredContent").empty();

    var apps=JSON.parse(data);
    for (i in apps){
            //app=JSON.parse(apps[i]);
            //var row=self.writeRow(app);
            var newid=apps[i].replace(/\./g, "-");
            //var newid=apps[i].replace(/\./g, "\.");

	//	alert("*"+newid+"*");

            filerow=$(document.createElement("div")).addClass("unregisteredItem").attr("id", newid).attr("filename", apps[i]).html("<span>"+apps[i]+"</span>");

            // Edit Resource Icon
            editicon=$(document.createElement("div")).addClass("editbt").attr("rscid", apps[i]);

            // Delete Resource Icon
            deleteicon=$(document.createElement("div")).addClass("deleteicon").attr("rscid", apps[i]);
            //$(filerow).after(deleteicon);
            $(filerow).append(deleteicon, editicon);
            $("#unregisteredContent").append(filerow);
            //$("#unregisteredContent").append(filerow, editicon, deleteicon);


            $(editicon).unbind("click");
            $(editicon).bind("click",function(event){
                event.stopPropagation();
                //alert($(event.currentTarget).parent().attr("id"));
                //alert($(event.currentTarget).parent().attr("filename"));
                self.ShowEditDialogforNewRsc($(event.currentTarget).parent().attr("id"),$(event.currentTarget).parent().attr("filename"));
            })

            $(deleteicon).unbind("click");
            $(deleteicon).bind("click",function(event){
                console.log($(event.currentTarget));
                event.stopPropagation();
                BootstrapDialog.show({
                        animation: false,
                        title: I18n.gettext("confirm.delete"),
                        message: I18n.gettext("delete.file")+$(event.currentTarget).attr("rscid")+" ?",
                        buttons: [{
                            cssClass: 'btn-danger',
                            label: I18n.gettext("bt.cancel"),
                            action: function(dialogRef) {
                                dialogRef.close();
                             }
                            },
                           {
                            cssClass: 'btn-success',
                            label: I18n.gettext("bt.delete"),
                            action: function(dialogRef) {
                                self.DeleteResource(event.currentTarget);
                                dialogRef.close();
                            }}
                            ]
                    });

                //self.ShowEditDialogforNewRsc($(event.currentTarget).attr("id"),$(event.currentTarget).attr("filename"));
            })


    }

}


adminRscMarkt.prototype.ShowEditDialogforNewRsc = function ShowEditDialogforNewRsc(id, filename){
    // Gets event data and shows it in a dialog
    var self=this;
    var data={"id": id,
            "source": {"type": "file",
                        "location":"recursos/incoming/"+filename},
            "tags": [],
            "name":"",
            "developer":{"name":"",
                        "url":""},
            "description":"",
            "icon":"apps.icons/generic.png"
            };

    /*data["id"]=id;
    data["source"]["type"]="file";
    data["source"]["location"]="";
    data["tags"]=[]; // Store taglist

    data["name"]="";
    data["developer"]["name"]="";
    data["developer"]["url"]="";
    data["description"]="";
    data["icon"]="";*/
    //alert(data);
    this.ShowEditDialog(data);
}


adminRscMarkt.prototype.drawApps = function drawApps(order){
    order = (order || 'name');

    var self=this;
    var data=self.appList;

        $("#registeredContent").empty();
        var apps=JSON.parse(data);
        apps=apps.sort(function(a, b){
            acomp=JSON.parse(a)[order];
            bcomp=JSON.parse(b)[order];

            if (self.ordersort[order]) return (acomp > bcomp)
                else return (acomp < bcomp);
        });

        console.log(apps);
        console.log(typeof(apps));

        for (i in apps){
                app=JSON.parse(apps[i]);
                var row=self.writeRow(app);

                $("#registeredContent").append(row);

                var editbt=$(row).find(".editbt");

                $(editbt).unbind("click");
                $(editbt).bind("click", function(event){
                        event.stopPropagation();
                        console.log(event.currentTarget);
                        // Setting up form
                        self.ShowEditDialogforModify(event);
                        })

                var rmbt=$(row).find(".deleteicon");

                $(rmbt).bind("click", function (event){
                 self.askForDeleteRsc(event);
               })
        }
}

adminRscMarkt.prototype.askForDeleteRsc = function askForDeleteRsc(event){
      event.stopPropagation();
      var self=this;

      var rscid=$(event.currentTarget).parent().attr("id");
      // Delete item

      BootstrapDialog.show({
        animation: false,
        title: I18n.gettext("confirm.delete"),
        message: I18n.gettext("delete.rsc")+rscid+".manifest ?",
        buttons: [{
            cssClass: 'btn-danger',
            label: I18n.gettext("bt.cancel"),
            action: function(dialogRef) {
                dialogRef.close();
             }
            },
           {
            cssClass: 'btn-success',
            label: I18n.gettext("bt.delete"),
            action: function(dialogRef) {
                self.DeleteResourceManifest(rscid);
                dialogRef.close();
            }}
            ]
      });

}



adminRscMarkt.prototype.writeRow = function writeRow(app){
    var self=this;
    var rscname=$(document.createElement("div")).html(app["name"]).addClass("rscname  rscitem");

                var fullpath=app["source"]["location"];
                if (typeof(fullpath)==="undefined") filename ="";
                else{
                    fullpathcomponents=fullpath.split("/");
                    filename=fullpathcomponents[fullpathcomponents.length-1];
                }
                var item=$(document.createElement("div")).addClass("rscfile  rscitem").html(filename);
                var type=$(document.createElement("div")).addClass("rscclass rscitem").html(app["type"]);
                var editbt=$(document.createElement("div")).addClass("editbt rscitem");
                var rmbt=$(document.createElement("div")).addClass("deleteicon rscitem");
                //$(editbt).html($(document.createElement("i")).addClass("fa fa-pencil-square-o"));
                var row=$(document.createElement("div")).addClass("rscRow").data("data-rsc", app).attr("id", app["id"]);

                $(row).append([rscname, type, item, rmbt, editbt]);

    return  row;
}

adminRscMarkt.prototype.ShowEditDialogforModify = function ShowEditDialogforModify(event){
    // Gets event data and shows it in a dialog
    var self=this;
    var data=$(event.currentTarget).parent().data("data-rsc");
    this.ShowEditDialog(data);
}

adminRscMarkt.prototype.ShowEditDialog = function ShowEditDialog(data){
    // Shows edit resource initialized with data.
	var app=data;
        var self=this;

        // Setting up form

        var rsc_id=data["id"];
        var rsc_type=data["source"]["type"];
        var rsc_location=data["source"]["location"];
        console.log(data);


        var taglistarray=data["tags"]; // Store taglist
        //alert(data["tags"].length);

        $("#EditAppDescName").empty().val(data["name"]);
        $("#EditAppDescDev").empty().val(data["developer"]["name"]);
        $("#EditAppDescDevUrl").empty().val(data["developer"]["url"]);
        $("#EditRscFullDescription").empty().html(data["description"]);


        // Check for empty icon for app (image)
        if(app["icon"]==="") {
            if (app["type"]==="flash" || app["type"]==="html" || app["type"]==="jclic")
                app["icon"]="apps.icons/"+app["type"]+".png";
            else app["icon"]="apps.icons/generic.png";
        }

        $("#imgApp").attr("src", data["icon"]);

        // Cleaning left Panel
        $("#leftDesc").empty();
        // Building left panel

        // Resource Type
        $("#leftDesc").append($(document.createElement("div")).addClass("DescLabel").attr("id", "RscTypeLabel").html(I18n.gettext("label.type")));

        var EditRscType=$(document.createElement("select")).addClass("chosen-select").attr("id", "EditRscType");
        for (i in typelist){
            var option=$(document.createElement("option")).val(typelist[i]["type"]).html(typelist[i]["Desc"]);
            //if (typelist[i]["type"]==="type."+data["type"]) {
            if (typelist[i]["type"]===data["type"]) {
                $(option).attr("selected", "selected");
            }
            $(EditRscType).append(option);
        }

        $("#leftDesc").append(EditRscType);
        $(EditRscType).chosen({width: "100%"}).change(function (event){ console.log(event.currentTarget);});

        // 2. Building location

        if (data["source"]["type"]==="web") {
            var icon=$(document.createElement("i")).addClass("fa fa-globe url_icon").attr("data-url", data["source"]["location"]);
            var content=I18n.gettext("label.source");

            $("#leftDesc").append($(document.createElement("div")).addClass("DescLabel").css("margin-top", "1.1em").attr("id", "RscUrlLabel").append(content).append(icon));

            $(icon).unbind("click");
            $(icon).bind("click", function(event){
                //alert($(event.currentTarget).attr("data-url"));
                  BootstrapDialog.show({
                        animation: false,
                        title: I18n.gettext("edit.url"),
                        message: 'URL: <input type="text" id="source_location" class="form-control" value="'+$(event.currentTarget).attr("data-url")+'">',
                        /*onhide: function(dialogRef){
                            var url= dialogRef.getModalBody().find('input').val();
                            return url;
                        },*/
                        buttons: [{
                            cssClass: 'btn-danger',
                            label: I18n.gettext("bt.close"),
                            action: function(dialogRef) {
                                dialogRef.close();
                             }
                            },
                           {
                            cssClass: 'btn-success',
                            label: I18n.gettext("bt.save"),
                            action: function(dialogRef) {
                                rsc_location=$("#source_location").val();
                                dialogRef.close();
                            }}
                            ]
                    });
                });
        }

        // 3. Building Level

        $("#leftDesc").append($(document.createElement("div")).addClass("DescLabel").attr("id", "RscTypeLabel").css("margin-top", "1.1em").html(I18n.gettext("label.level")));



        // Nota: se poden afegir traduccions en lloc de ...
        var EditRscLevel=$(document.createElement("select")).attr("multiple", "multiple").addClass("chosen-select").attr("id", "EditRscLevel").attr("data-placeholder", "...");

        for (i in levellist){
            var option=$(document.createElement("option")).val(levellist[i]["level"]).html(levellist[i]["Desc"]);
            //alert("*"+levellist[i]["level"]+"*\n*"+data["level"]+"*");

            if ($.inArray(levellist[i]["level"], data["level"])>=0) {
                $(option).attr("selected", "selected");
            }
            $(EditRscLevel).append(option);
        }

        $("#leftDesc").append(EditRscLevel);
        $(EditRscLevel).chosen({width: "100%"});

        // 4. Building Subjects

        $("#leftDesc").append($(document.createElement("div")).addClass("DescLabel").attr("id", "RscSubjectLabel").css("margin-top", "1.1em").html(I18n.gettext("label.subjects")));

        // Nota: se poden afegir traduccions en lloc de ...
        var EditRscSubject=$(document.createElement("select")).attr("multiple", "multiple").addClass("chosen-select").attr("id", "EditRscSubject").attr("data-placeholder", "...");

        for (i in subjectlist){
            var option=$(document.createElement("option")).val(subjectlist[i]["subject"]).html(subjectlist[i]["Desc"]);
            //alert("*"+levellist[i]["level"]+"*\n*"+data["level"]+"*");

            if ($.inArray(subjectlist[i]["subject"], data["subjects"])>=0) {
                $(option).attr("selected", "selected");
            }
            $(EditRscSubject).append(option);
        }

        $("#leftDesc").append(EditRscSubject);
        $(EditRscSubject).chosen({width: "100%"});

        // 5. Building Tags

        $("#leftDesc").append($(document.createElement("div")).addClass("DescLabel").attr("id", "DescLabel").css("margin-top", "1.1em").html(I18n.gettext("label.tags")));
        EditRscTagsContainer=$(document.createElement("div")).addClass("tags").attr("id","EditRscTagsContainer");
        EditRscTags=$(document.createElement("input")).addClass("tags").attr("id", "EditRscTags");
        EditRscTagsContainer.append(EditRscTags);

        $("#leftDesc").append(EditRscTagsContainer);

        $(EditRscTagsContainer).tagsInput({
            'width':'100%',
            'intreractive':true,
            'delimiter': [',',';'],
            'removeWithBackspace' : true,
            'defaultText': I18n.gettext("rsc.addtag"),
            'placeholderColor' : '#666666',
            'onAddTag': function(item){
                pos=taglistarray.indexOf(item);
                if (pos==-1) taglistarray.push(item);

                /*$(content).append(item);
                $("#EditRscTags").attr("data-content", content);
                console.log($("#EditRscTags").attr("data-content"));*/
                },
            'onRemoveTag': function(item){
                pos=taglistarray.indexOf(item);
                if (pos>-1) taglistarray.splice(pos, 1);
                //taglistarray.remove(item)
                },
             });

        for (i in data["tags"])
            $(EditRscTagsContainer).addTag(data["tags"][i]);

        $("#BtCancelEditRsc").unbind("click");
        $("#BtCancelEditRsc").bind("click", function(event){
            event.stopPropagation();
            if (($("#img_selector").css("display"))!=="block") $("#ModalBack").hide(300);
        });

        $("#BtSaveEditRsc").unbind("click");

        $("#BtSaveEditRsc").bind("click", function(event){
           if (($("#img_selector").css("display"))==="block") return -1;
           event.stopPropagation();

           if (taglistarray.length===0) {
                //  Patch: Si no te etiquetes inicialitzem el vector amb un element buit
                // (si no, no guardava tags)
               taglistarray=[""];
           }

           newdata={"id": rsc_id,
                    "name": $("#EditAppDescName").val(),
                    "description": $("#EditRscFullDescription").val(),
                    "source": {  // CAL SABER D'ON VE!
                        "type":rsc_type,
                        "location": rsc_location
                        },
                    "icon": $("#imgApp").attr("src"),
                    "developer":{
                        "name": $("#EditAppDescDev").val(),
                        "url": $("#EditAppDescDevUrl").val()
                    },
                    "type": $("#EditRscType").val(),
                    "level": $("#EditRscLevel").val(),
                    "subjects": $("#EditRscSubject").val(),
                    "tags": taglistarray
                } // End JSON
            //alert(JSON.stringify(newdata));
            self.SaveResource(newdata);
           //alert(JSON.stringify(newdata));
        });


        $("#imgApp").unbind("click");
        $("#imgApp").bind("click", function(event){
            event.stopPropagation();
            self.ShowImageSelector(event);
          }); // Bind Click


        $("#ModalBack").attr("action", "edit");
        $("#ModalBack").fadeIn(300);


}


adminRscMarkt.prototype.ShowImageSelector = function ShowImageSelector(event){
    var self=this;
    var params = {"action" : "getAppsIcons"};

    $.ajax({
        data:  params,
        url:   'models/appManager.php',
        type:  'post',
        success:  function (response) {
            var icons=(JSON.parse(response));
            console.log(icons);

            divimgcontainer=$(document.createElement("div")).attr("id", "img_container").addClass("divImgContainer");

            diviimgselector=$(document.createElement("div")).attr("id", "img_selector").addClass("divImgSelector");
            diviimguploadImage=$(document.createElement("div")).attr("id", "img_upload").addClass("diviimguploadImage");
            divImgBottom=$(document.createElement("div")).attr("id", "img_bottom").addClass("divImgBottom");

            // Setting up dropzone
            divdropzone=$(document.createElement("div")).addClass("dropzone upload").attr("id", "files_upload");
            dzmessage=$(document.createElement("div")).addClass("dz-message").html("Arrossega la imatge aci");
            $(divdropzone).append(dzmessage);
            $(diviimguploadImage).append(divdropzone);

            var previewTemplate=$("#template").prop('outerHTML');
            $("#template").remove();
            Dropzone.autoDiscover = false;

            // Apply Dropzone

            $(divdropzone).dropzone({
               paramName: "file",
               previewTemplate: previewTemplate,
               thumbnail: function(file, dataUrl) {
                //alert(file);
                      /* do something else with the dataUrl */
              },
              url: "upload_img.php",
              acceptedFiles: ".jpg, .png, .gif",
              addRemoveLinks: true,
               success: function(file, response) {
                    $("#template").css("display", "block");
                    $(".dz-preview.dz-processing").hide(500, function(){
                    //$(".dz-message").css("opacity", "50");
                    // we got filename in response
                    var filename=response;
                    option=$(document.createElement("option")).attr("data-img-src", window.location.href+"./../"+filename).val(filename);
                    $("#imgselector").append(option);
                    $("#imgselector").imagepicker();

                    var showMessage=function(){ // Dirty but runs...
                        $(".dz-message").css("display", "block");
                        $("#template").css("display", "none");
                    }
                    setTimeout(showMessage, 300);
                    $(divdropzone).dropzone();



                    //$(".dz-preview.dz-processing").show();//m --->>> Ajustar el comtingut del dz-preview...

                  });

                }

              });


            // Preparing image selector:
            myselect=$(document.createElement("select")).attr("id", "imgselector");

            for (i in icons){
                option=$(document.createElement("option")).attr("data-img-src", window.location.href+"./../"+icons[i]).val(icons[i]);
                $(myselect).append(option);
            }
            diviimgselector.append(myselect);

            $(diviimgselector).css("display", "none");

            divimgcontainer.append(diviimgselector);
            divimgcontainer.append(diviimguploadImage);
            divimgcontainer.append(divImgBottom);
            $("body").append(divimgcontainer);
            $(diviimgselector).show(300);

            $("#imgselector").imagepicker();

            btcancel=$(document.createElement("div")).attr("id", "ImgCancel").addClass("btn btn-danger BtnCancelEditRsc").html(I18n.gettext("Btn.Cancel"));
            btselect=$(document.createElement("div")).attr("id", "ImgSelect").addClass("btn btn-success BtnSaveEditRsc").html(I18n.gettext("Btn.Select"));
            $("#img_bottom").append(btcancel);
            $("#img_bottom").append(btselect);

            $(btcancel).bind("click", function(){$("#img_container").hide(300, function(){$("#img_container").remove()});  });

            $(btselect).bind("click", function(){
               // alert($("#imgselector").val());
               $("#imgApp").attr("src",$("#imgselector").val());
               $("#img_container").hide(300, function(){$("#img_container").remove()});

            });




    }
  }); // Ajax request





}

adminRscMarkt.prototype.SaveResource = function SaveResource(newdata){
    // TODO:
    //  FALTARIA PODER MODIFICAR LA IMATGE DEL RECURS!

    var self=this;
    var params = {"action" : "saveResource",
                  "data":newdata
                };
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        //$("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                    $("#notification_title").html(I18n.gettext("label.done"));
                    $("#notification_body").html(I18n.gettext("save.done"));
                    $("#ModalBack").hide(300);
                    $("#notification").show(500).delay(3000).hide(500);

                    // Create row modified and replace it
                    var row=self.writeRow(newdata);
                    //alert("#"+newdata["id"]);
                    $("[id='"+newdata["id"]+"']").hide();
                    //$("#"+newdata["id"]).remove();

                    $("#registeredContent").append(row);

                    /*$(row).delay(1000, function () {
                        $(row).css("background","#ffff00");}).delay(10000, function() {
                        $(row).css("background","#ffffff")

                        });*/


                    var editbt=$(row).find(".editbt");
                    $(editbt).bind("click", function(event){
                        event.stopPropagation();
                        console.log(event.currentTarget);
                        // Setting up form
                        self.ShowEditDialogforModify(event);
                       })

                    var rmbt=$(row).find(".deleteicon");

                    $(rmbt).bind("click", function (event){
                      // Ask for delete resource
                      self.askForDeleteRsc(event);
                    })


                }
        });
}

adminRscMarkt.prototype.DeleteResource = function DeleteResource(target){
    // El target conté l'element DOM amb la informació del recurs a eliminar
      var self=this;

    id=$(target).attr("rscid");

    var params = {"action" : "deleteFile",
                  "filename": id
                };
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                success:  function (response) {
                  $(target).hide();
                  $("[filename='"+id+"']").hide();
                    //alert("done");
                }
        });
}

adminRscMarkt.prototype.DeleteResourceManifest = function DeleteResourceManifest(rscid){
    // El target conté l'id del recurs a eliminar
    var self=this;

    //$("#"+rscid).hide();

    var params = {"action" : "deleteResource",
                  "filename": rscid
                };
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                success:  function (response) {

                    $("[id='"+rscid+"']").hide();
                    //$( "#"+rscid).hide();
                    //alert("done");
                }
        });
}

adminRscMarkt.prototype.fillMenuEntries=function fillMenuEntries(data){
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
                $("#RemoteRscTypeMenu").append(optionmenu);
        }

        for (i in mydata["subjects"].sort()) {
                var optionmenu=$(document.createElement("a")).attr("id", mydata["subjects"][i]);
                $(optionmenu).addClass("list-group-item").addClass("childEntry");
                var optionlabel=$(document.createElement("span")).addClass("itemLabel").html(I18n.gettext("subject."+mydata["subjects"][i]));
                var optioncheck=$(document.createElement("input")).attr("type", "checkbox");
                $(optioncheck).addClass("entryCB");
                $(optionmenu).append([optionlabel, optioncheck]);
                $("#RemoteRscSubjectMenu").append(optionmenu);
        }


}

adminRscMarkt.prototype.loadRemoteRsc = function loadRemoteRsc(server){
  // Asks for remote markt (server) for resources list
  var self=this;
  var params = {"action" : "getAllApps"};
  $.ajax({
          data:  params,
          url:   server+'/models/appManager.php',
          type:  'post',
          beforeSend: function () {
                  $("#appsDiv").html("Processant...");
          },
          success:  function (response) {
                  self.DrawRemoteRsc(response, server);
          }
  });

  // Step 2: Getting categories and subjects
   var params = {"action" : "getMenus"};
   $.ajax({
           data:  params,
           url:   server+'/models/appManager.php',
           type:  'post',
           success:  function (response) {
                self.fillMenuEntries(response);
           }
   });



}
adminRscMarkt.prototype.DrawStars=function DrawStars(popularity, count){
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


adminRscMarkt.prototype.downloadSelected=function downloadSelected(){
  var self=this;
  $(".SelectActivated").each(function(index, value){
      //alert(index+" - "+ $(this).attr('id'));
      var app=JSON.parse($(this).parent().parent().attr("data-app"));
      //console.log(app);
      var icon=app["icon"];
      var filename=app["source"]["location"];
      var manifest=app["id"];
      //alert(app["id"]);
      self.importResource(server,filename, manifest, icon);

  });
}


adminRscMarkt.prototype.DrawRemoteRsc = function DrawRemoteRsc(data, server){
//$("#remoteAppsContainer").append(response);
      var self=this;

        $("#remoteAppsDiv").empty();
        var apps=JSON.parse(data);

        for (i in apps){
                app=JSON.parse(apps[i]);
                // Check for empty icon
                if(app["icon"]==="") {
                        if (app["type"]==="flash" || app["type"]==="html" || app["type"]==="jclic")
                                app["icon"]="apps.icons/"+app["type"]+".png";
                        else app["icon"]="apps.icons/generic.png";
                } else app["icon"]=server+"/"+app["icon"];

                var img=$(document.createElement("img")).addClass("appIcon").attr("src", app["icon"]);
                var rscname=$(document.createElement("div")).html(app["name"]).addClass("appName");

                var item=$(document.createElement("div")).addClass("AppContainer").attr("rsc", app["id"]).attr("data-app", apps[i]);
                var devname=$(document.createElement("div")).html(app["developer"]["name"]).addClass("appDeveloper");
                var stars=self.DrawStars(app["popularity"]["sum"], app["popularity"]["count"]);

                var buttonrow=$(document.createElement("div")).addClass("ButtonRow");


                var icon=$(document.createElement("i")).addClass("fa  fa-arrow-circle-down rotate45");
                var icondownload=$(document.createElement("i")).addClass("fa  fa-arrow-circle-down");

                // Download Button
                var text=$(document.createElement("span")).addClass("BtnMini").html(I18n.gettext("app.copy.local"));
                var downloadButton=$(document.createElement("button")).addClass("btn btn-primary btn-xs BtnDownload");
                $(downloadButton).append([icondownload,text]);

                // Launch Button
                var launch_button=$(document.createElement("button")).addClass("btn btn-primary btn-xs BtnDownload");
                var textload=$(document.createElement("span")).addClass("BtnMini").html(I18n.gettext("app.launch"));
                $(launch_button).append([icon,textload]);

                // Select multiple resources
                var multiselect=$(document.createElement("div")).addClass("BtnSelectMultiple SelectDeactivated");

                if (app["source"]["type"]==="web") $(buttonrow).append([launch_button, downloadButton,multiselect]);
                else $(buttonrow).append([downloadButton,multiselect]);


                // dos spans amb flexeta cap avall


                $(item).append([img, rscname, devname, stars, buttonrow]);
                //$(item).addClass("col-sm-4").addClass("AppContainer");
                $("#remoteAppsDiv").append(item);


                // Event Handlers
                $(item).bind("click", function(event){
                      self.showAppInfo($(event.currentTarget).attr("data-app"), server);
                    })

                $(downloadButton).bind("click", function(event){
                        event.stopPropagation();

                        var app=JSON.parse($(event.currentTarget).parent().parent().attr("data-app"));
                        var icon=app["icon"];
                        var filename=app["source"]["location"];
                        var manifest=app["id"];

                        //var filename=app["id"];
                        //var manifest=app["source"]["location"];
                        self.importResource(server,filename, manifest, icon);
                      })

                $(multiselect).bind("click", function(event){
                  // Allows to select multiple resources for download
                        event.stopPropagation();
                        var target=$(event.currentTarget);
                        //alert($(target).hasClass("SelectDeactivated"));
                        if($(target).hasClass("SelectDeactivated")) {
                          $(target).removeClass("SelectDeactivated");
                          $(target).addClass("SelectActivated");
                          var numselected=$(".SelectActivated").length;

                          if(numselected>1){
                            var AllowMultipleDownload=$(document.createElement("div")).attr("id", "AllowMultipleDownload").html(I18n.gettext("multiple_select"));
                            $("#AllowMultipleDownload").remove();
                            $("#remoteAppsDiv").prepend(AllowMultipleDownload);
                            $(AllowMultipleDownload).unbind("click");
                            $(AllowMultipleDownload).bind("click", function(event){
                              self.downloadSelected();



                            });
                          }
                        } else{
                          $(target).removeClass("SelectActivated");
                          $(target).addClass("SelectDeactivated");
                          var numselected=$(".SelectActivated").length;
                          if(numselected<2) $("#AllowMultipleDownload").remove();
                        }
                      });



        }




}


adminRscMarkt.prototype.CheckServerStatus = function CheckServerStatus(){
  /* Checks for remote server status. If remote server is alive, we can import resources */
    var self=this;

    //$("#"+rscid).hide();
    server=$("#srv_address").val();

    if(server.substring(0,7)!="http://" && server.substring(0,8)!="https://") server="http://"+server;

    // Setting currentRemoteServer
    self.currentRemoteServer=server;

    var params = {"action" : "checkStatus"};

    $.ajax({
                data:  params,
                url:   server+'/models/remoteManager.php',
                type:  'post',
                beforeSend: function () {
                    $("#check_ip_img").addClass("rotate");
                },
                success:  function (response) {
                  console.log(response);
                   $("#check_ip_img").removeClass("rotate");
                   $("#check_ip").removeClass("check_ip_refresh");
                   $("#check_ip_img").removeClass("check_ip_img_refresh");
                   $("#check_ip_img").addClass("check_ip_img_true");
                   $("#check_ip").addClass("check_ip_true");
                   $(".check_srv").remove();
                   $("#RemoteResourcesDiv").css("display", "block");
                   self.loadRemoteRsc(server);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                  $("#check_ip").removeClass("check_ip_refresh");
                  $("#check_ip_img").removeClass("check_ip_img_refresh");
                  $("#check_ip_img").removeClass("rotate");
                  $("#check_ip_img").addClass("check_ip_img_false");
                  $("#check_ip").addClass("check_ip_false");
                  $(".check_srv").remove();
                }
            });
          }


/*
 *
 *
 *   TO-DO: Que es puguen eliminar també recursos ja catalogats (botonet d'esborrar al costat del d'editar i que esborre el
fitxer i el descriptor.

*/



adminRscMarkt.prototype.showAppInfo=function showAppInfo(data_app, server){
        var self=this;
        app=JSON.parse(data_app);
        var icon_location=app["icon"];
        app["icon"]=server+"/"+app["icon"];
        $("#RemoteimgApp").attr("src", app["icon"]);
        $("#RemoteappDescDev").empty().html(app["developer"]["name"]);
        $("#RemoteappDescDevUrl").empty().html(app["developer"]["url"]);
        stars=self.DrawStars(app["popularity"]["sum"], app["popularity"]["count"]);
        $("#RemoteappDescStars").empty().append(stars);
        $("#RemoteappDescName").empty().html(app["name"]);
        $("#RemoteRscType").empty().html(app["type"]);

        //alert(app["source"]["location"]);
        $("#RemoteImportResource").attr("data-location",app["source"]["location"]);
        $("#RemoteImportResource").attr("data-icon",icon_location);
        $("#RemoteImportResource").attr("data-id",app["id"]);

        // Levels translation
        if (app["level"].length>0){
                app["level"].forEach(function(item, index) {
                        app["level"][index]=I18n.gettext("level."+item);
                });

                $("#RemoteRscLevel").empty().html(app["level"].join(", "));
        } else $("#RemoteRscLevel").empty();

        // Subjects translation
        if (app["subjects"].length>0){
                app["subjects"].forEach(function(item, index) {
                        app["subjects"][index]=I18n.gettext("subject."+item);
                });

                $("Remote#RscSubjects").empty().html(app["subjects"].join(", "));
        } else $("#RemoteRscSubjects").empty();


        $("#RemoteRscTags").empty().html(app["tags"].join(", "));
        $("#RemoteappDescDesc").empty().html(app["description"]);

        $("#RemoteImportResource").unbind("click");
        $("#RemoteImportResource").bind("click", function(e){
          var filename=$("#RemoteImportResource").attr("data-location");
          var manifest=$("#RemoteImportResource").attr("data-id");
          var icon=$("#RemoteImportResource").attr("data-icon");
          self.importResource(server,filename, manifest, icon);
        });

        /*if (typeof(app["source"]["location"])==="undefined"){
                $("#RemoteBtDownloadResource").hide();
                $("#RemoteBtLaunchResource").hide();
        } else {
                $("#RemoteBtDownloadResource").unbind("click");
                $("#RemoteBtLaunchResource").unbind("click");

                $("#RemoteBtDownloadResource").bind("click", function(event){
                                event.preventDefault();
                                id=$(event.currentTarget).attr("data-id");
                                self.downloadResource(id,false);
                        })

                $("#RemoteBtLaunchResource").bind("click", function(event){
                                event.preventDefault();
                                id=$(event.currentTarget).attr("data-id");
                                self.downloadResource(id,true);
                        })

        }*/


        // Setting Modal Back to "show"
        $("#RemoteModalBack").attr("action", "show");
        $("#RemoteModalBack").fadeIn(150);
}


adminRscMarkt.prototype.importResource=function importResource(server, filename, manifest, icon){
  /*
     Imoports a resource from Server. It includes manifest file and resource file.
     to perform this, we connect to local server and gives it the remote server files.
  */

  var self=this;

  var params = {"action" : "ImportRemoteResource",
                "server": server,
                 "filename":filename,
                 "manifest":manifest,
                 "icon":icon
               };

      $.ajax({
              data:  params,
              url:   'models/remoteManager.php',
              type:  'post',
              beforeSend: function () {
                      //$("#appsDiv").html("Processant...");
              },
              success:  function (response) {

                var resp=JSON.parse(response);
                var errortext="";
                if (resp['error']==="manifestexists") {
                    errortext=I18n.gettext("copyerror.manifestexists")+" ("+resp['file']+")";
                } else if (resp['error']==="rscexists") {
                    errortext=I18n.gettext("copyerror.rscexists")+" ("+resp['file']+")";
                }
                if (errortext!="") bootbox.alert(errortext);
                else self.SaveResource(resp);
                /*self.unsortedApps=response;
                self.drawUnsortedApps();*/
              }
      });
}


adminRscMarkt.prototype.getAndPaintSelectedApps = function getAndPaintSelectedApps(rsctype, rscsubject, rsctags){
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
                url:   self.currentRemoteServer+'/models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        $("#appsDiv").html("Processant...");
                },
                success:  function (response) {
                     self.DrawRemoteRsc(response, self.currentRemoteServer);
                }
        });
}


$(document).ready(function() {

    var userLang = navigator.language || navigator.userLanguage;
    var lang=(userLang.split("@"))[0];  // Getting language code


    /* Registered Apps  */

    var tlist=new TypelistClass(lang);
    typelist=tlist.getConfig(lang);

    var llist=new LevellistClass();
    levellist=llist.getConfig();

    var slist=new SubjectlistClass(lang);
    subjectlist=slist.getConfig(lang);


    markt=new llxRscMarkt();
    admin=new adminRscMarkt();
    admin.PaintAdminApps();

    $("#NameHeader").bind("click", function(){
        admin.drawApps("name", admin.ordersortname);
        admin.ordersort["name"]=!admin.ordersort["name"];
    })

    $("#TypeHeader").bind("click", function(){
        admin.drawApps("type", admin.ordersortname);
        admin.ordersort["type"]=!admin.ordersort["type"];
    })


    $('#EditRscTags').tagsInput({
                'height':'100%',
                'width':'100%',
                'intreractive':true,
                'delimiter': [',',';'],
                'removeWithBackspace' : true,
                'defaultText': I18n.gettext("rsc.addtag"),
                'placeholderColor' : '#666666'

        });

    $("#my-awesome-dropzone").dropzone({
            success:  function (response) {
                admin.PaintUnregisteredApps();}
        });


    /* UNegistered Apps  */

    admin.PaintUnregisteredApps();



    /* Import from server  */

    $("#check_ip").unbind("click");
    $("#check_ip").bind("click", function() {

      $("#check_ip_img").removeClass("check_ip_img_true");
      $("#check_ip").removeClass("check_ip_true");
      $("#check_ip_img").removeClass("check_ip_img_false");
      $("#check_ip").removeClass("check_ip_false");
      $("#check_ip_img").addClass("check_ip_img_refresh");
      $("#check_ip").addClass("check_ip_refresh");
      admin.CheckServerStatus();

      });


      // Tags
      $('#RemoteTags').tagsInput({
          'height':'200px',
          'width':'100%',
          'intreractive':true,
          'delimiter': [',',';'],
          'removeWithBackspace' : true,
          'defaultText': I18n.gettext("rsc.addtag"),
          'placeholderColor' : '#666666'

        });

      /* Events Listeners for  Modal Back */

      $("#RemoteCloseBt").bind("click", function(){
              $("#RemoteModalBack").fadeOut(250);
      });

      $("#RemoteModalBack").bind("click", function(){
              $("#RemoteModalBack").fadeOut(250);
          });
      $("#RemoteAppDescription").bind("click", function(event){
               event.stopPropagation();
            });

      $("#RemotemenuConnect").bind("click", function(e){
              e.stopPropagation();
              });


    // Button to select default remote servers
    $("#srv_address_button").bind("click", function(e){
            e.stopPropagation();
            // TO-DO
            // Mostrar una llista de servidors coneguts (el servidor de recursos de lliurex, per exemple)
            $("#srv_address").attr("value", "192.168.56.101/llxmarkt");
        });

    // Remote Resources Search
            $("#RemoteBtSearch").bind("click", function(){
          //alert("Searching");

          // Getting data

          // Gestionem dos llistes
          // Una amb els atributs a checked i altra amb tots
          // Si la llista amb atributs a checked és buida, s'utilitaza l'altra (no es vol filtrar per eixe camps)

          /*  Getting search resource types */

          var resourceTypeArray=[];
          var resourceTypeArrayChecked=[];
          $("#RemoteRscTypeMenu").find("a").each(function(index){
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
          $("#RemoteRscSubjectMenu").find("a").each(function(index){
            var name=$(this).attr("id");
            var checked=$(this).find(".entryCB").prop('checked');
            resourceSubjectArray.push(name);
            if (checked) resourceSubjectArrayChecked.push(name);
          });
          // We got in resourceTypeArrayChecked the list of resource types
          //if (resourceSubjectArrayChecked.length===0) resourceSubjectArrayChecked=resourceSubjectArray;

          // Getting tags input
          var tmp_tagsarray=$("#RemoteTags").val().replace(/;/g , "").split(",");
          var tagsArray=[];
          for (i in tmp_tagsarray){
            if (tmp_tagsarray[i]!=="") tagsArray.push(tmp_tagsarray[i]);
          }
          console.log(resourceTypeArrayChecked);
          console.log(resourceSubjectArrayChecked);
          console.log(tagsArray);
          admin.getAndPaintSelectedApps(resourceTypeArrayChecked,  resourceSubjectArrayChecked, tagsArray);


        });


});
