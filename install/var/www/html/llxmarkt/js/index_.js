
function RepooManager(){}

// Methods


RepooManager.prototype.Draw= function Draw(AppListString){
        /*
        Gets an string with all the App Description and converts to JSON to Draw it
        */
        
        var self=this;
        AppList=JSON.parse(AppListString);
        
        for (i in AppList){
                //alert(AppList[i]);
                
                var AppDiv=$(document.createElement("div")).addClass("appDiv");
                var TopAppDiv=$(document.createElement("div")).addClass("topAppDiv");
                var BottomAppDiv=$(document.createElement("div")).addClass("bottomAppDiv");
                                
                var AppIcon=$(document.createElement("img")).addClass("appIcon");
                var AppIconContainer=$(document.createElement("div")).addClass("appIconContainer");
                var AppTextContainer=$(document.createElement("div")).addClass("appTextContainer");
                var AppButtonContainer=$(document.createElement("div")).addClass("appButtonsContainer");
                var AppTitle=$(document.createElement("div")).addClass("appTitle");
                
                var DevelInfo=$(document.createElement("div")).addClass("AppInfo");
                
                var PopulaityInfo=$(document.createElement("div")).addClass("AppInfo");
                
                var MoreBt=$(document.createElement("div")).addClass("MoreBt").attr("data", AppList[i]);
                
                $(AppTitle).html(JSON.parse(AppList[i]).name);
                $(AppIcon).attr("src",JSON.parse(AppList[i]).icon);
                devel=JSON.parse(AppList[i]).developer.name+" <strong>url:</strong>"+JSON.parse(AppList[i]).developer.url;
                $(DevelInfo).html(devel);
                popularity=JSON.parse(AppList[i]).popularity.sum/JSON.parse(AppList[i]).popularity.count;
                $(PopulaityInfo).html(popularity);
                
                $(AppIconContainer).append(AppIcon);
                $(AppTextContainer).append(AppTitle);
                $(AppTextContainer).append(PopulaityInfo);
                $(AppTextContainer).append(DevelInfo);
                
                
                $(MoreBt).bind("click", function (e){
                        // Item contains any data from manifest file
                        var item=JSON.parse($(e.target).attr("data"));
                        
                        // Icon
                        var AppIcon=$(document.createElement("img")).addClass("appIcon");
                        var AppIconContainer=$(document.createElement("div")).addClass("appIconContainer");
                        var MessageDiv=$(document.createElement("div")).addClass("MessageDiv");
                        
                        $(AppIcon).attr("src",item.icon);
                        $(AppIconContainer).append(AppIcon);
                        $(MessageDiv).append(AppIconContainer);
                        
                        // App info
                        
                        var ScrollExtraInfo=$(document.createElement("div")).addClass("ScrollExtraInfo ScrollDown").attr("status", "top");                
                        var ExtraInfo=$(document.createElement("div")).addClass("extraInfo");
                        var AppInfo=$(document.createElement("div")).addClass("AppInfo");
                        var DevelInfo=$(document.createElement("div")).addClass("AppInfo");
                        
                        var type="<strong>Type:</strong>"+item.type;
                        var subjects="<br/><strong>subjects:</strong>"+item.subjects;
                        var tags="<br/><strong>Tags:</strong>"+item.tags;
                        $(AppInfo).html(type+subjects+tags);
                        var devel="<strong>Origin:</strong>"+item.developer.name+"("+item.developer.url+")";
                        $(DevelInfo).html(devel);
                        
                        $(ExtraInfo).append(ScrollExtraInfo);                
                        $(ExtraInfo).append(AppInfo);
                        $(ExtraInfo).append(DevelInfo);
                        $(MessageDiv).append(ExtraInfo);
                        
                        
                        // Description
                        var description=$(document.createElement("div")).html(item.description);
                        $(MessageDiv).append(description);
                        
                        bootbox.dialog({
                                message: $(MessageDiv),
                                title: item.name,
                                buttons: {
                                        success: {
                                        label: "D'acord"
                                        }
                                }
                        });
                        
                        
                });
                
                
                //$(TopAppDiv).append(AppIconContainer);
                //$(TopAppDiv).append(AppTextContainer);
                //$(BottomAppDiv).append(ExtraInfo);
                
                $(AppDiv).append(AppIconContainer);
                $(AppDiv).append(AppTextContainer);
                $(AppDiv).append(MoreBt);
                
                
                
                $("#result").append(AppDiv);
                
        }
}


RepooManager.prototype.setBottom = function setBottom(){
        alert("hola");
        
}

RepooManager.prototype.getResource = function getResource(filename){
        // Creates a new Ajax call to getResource php function on server
        // The server responses with a file to download
        
        var self=this;
        
        var params = {"action" : "getResource", "filename": filename};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        //$("#result").html("Processant...");
                },
                 success: function(response, status, xhr) {
                        // download filename
                        var filename = window.location.href+response;
                        window.location = filename;
                    },
                    
                     error: function( jqXhr, textStatus, errorThrown ){
                                console.log( errorThrown );
                        }
                
        });
}


RepooManager.prototype.getOnlyResource = function getOnlyResource(filename){
        // Creates a new Ajax call to getResource php function on server
        // The server responses with a file to download
        
        var self=this;
        
        var params = {"action" : "getOnlyResource", "filename": filename};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        //$("#result").html("Processant...");
                },
                 success: function(response, status, xhr) {
                        // download filename
                        var filename = window.location.href+response;
                        window.location = filename;
                    },
                    
                     error: function( jqXhr, textStatus, errorThrown ){
                                console.log( errorThrown );
                        }
                
        });
}


RepooManager.prototype.getAndPaintAllApps = function getAndPaintAllApps(){
        
        // Creates a new Ajax call to getAllApps php function on server
        // The JSON list is painted in GUI
        
        var self=this;
        
        var params = {"action" : "getAllApps"};
        $.ajax({
                data:  params,
                url:   'models/appManager.php',
                type:  'post',
                beforeSend: function () {
                        $("#result").html("Processant...");
                },
                success:  function (response) {
                        $("#result").empty();
                        self.Draw(response);
                }
        });
}


$(document).ready(function() {    
    rpm=new RepooManager();
    rpm.getAndPaintAllApps();
    
    
    
});
    