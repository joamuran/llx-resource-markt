var typelist;
var levellist;
var subject;

function adminRscMarkt() {
    this.appList=null;
    this.unsortedApps=null;

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
                    $("#"+newdata["id"]).remove();

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
                    $("#"+rscid).hide();
                    //alert("done");
                }
        });
}


/*
 *
 *
 *   TO-DO: Que es puguen eliminar també recursos ja catalogats (botonet d'esborrar al costat del d'editar i que esborre el
fitxer i el descriptor.

*/


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





});
