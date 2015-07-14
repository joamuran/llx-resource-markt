<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script src="lib/jquery/jquery-2.1.1.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.js"></script>
    <script src="lib/chosen/chosen.jquery.min.js"></script>
    <script src="lib/jquery.tagsinput/jquery.tagsinput.min.js"></script>
    <script src="lib/jquery-ui.js"></script>
    <script src=" lib/bootstrap3-dialog/js/bootstrap-dialog.js"></script>
    <script src="lib/image-picker/image-picker.js"></script>
    <script src="lib/dropzone/dropzone.min.js"></script>

    <!-- LOCALES: i18n -->
    <script src="locales/ca_ES.js"></script>
    <script src="locales/en.js"></script>
    <script src="locales/es_ES.js"></script>
    <script src="lib/i18n.js"></script>

    <!-- Config  -->
    <script src="js/config/typelist.js"></script>
    <script src="js/config/levellist.js"></script>
    <script src="js/config/subjectlist.js"></script>

    <!-- Main -->
    <script src="js/index.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/login.js"></script>

    <!-- Styles -->
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="lib/jquery.tagsinput/jquery.tagsinput.min.css">
    <link rel="stylesheet" href="lib/chosen/chosen.min.css">
    <link rel="stylesheet" href="lib/font-awesome-4.3.0/css/font-awesome.css">
    <link rel="stylesheet" href="lib/bootstrap3-dialog/css/bootstrap-dialog.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="lib/image-picker/image-picker.css">
    <link rel="stylesheet" href="lib/dropzone/dropzone.min.css">
    <link rel="stylesheet" href="lib/dropzone/basic.min.css">


    <title>Bazaar Manager</title>
</head>

<body>
<div id="topHdr"></div>
<?php
session_start();
require_once("loginheader.php");
if(!isset($_SESSION["username"])){
    echo ("<h2>unauthorized</h2>");
} else{
    ?>


 <ul class="nav nav-tabs">
  <li role="presentation" class="active"><a data-toggle="tab" href="#registered" ><span i18n="true">Registered.Apps</span></a></li>
  <li role="presentation"><a data-toggle="tab" href="#unregistered" ><span i18n="true">Unregistered.Apps</span></a></li>
   <li role="presentation"><a data-toggle="tab" href="#uploadApps" ><span i18n="true">Upload.Apps</span></a></li>
</ul>


 <div class="tab-content">

<!-- FIRST TAB: REGISTERED APPS -->
 <div id="registered" class="tab-pane fade in active">
 <div class="rscRow" id="registeredHeader">
    <div class="rscname rscheader" id="NameHeader"><span i18n="true">rsc.name</span></div>
    <div class="rscclass rscheader" id="TypeHeader"><span i18n="true">rsc.type</span></div>
    <div class="rscfile rscheader" id="FileHeader"><span i18n="true">rsc.file</span></div>
 </div>
 <div id="registeredContent"></div> <!-- end results table -->
 </div>


<!-- SECOND TAB: UNREGISTERED APPS -->

<div id="unregistered" class="tab-pane fade">
    <div class="rscRow" id="unregisteredHeader">
    <div class="rscname rscheader" id="NameHeader"><span i18n="true">rsc.file</span></div>
    <!--div class="rscclass rscheader" id="TypeHeader"><span i18n="true">rsc.type</span></div>
    <div class="rscfile rscheader" id="FileHeader"><span i18n="true">rsc.file</span></div-->
 </div>
 <div id="unregisteredContent"></div> <!-- end results table -->
 </div>


<!-- THIRD TAB: UPLOAD NEW APPS -->
<div id="uploadApps" class="tab-pane fade">
    <div class="upload_label"><span i18n="true">Upload.rsc</span></div>
     <form action="upload_rsc.php"
      class="dropzone dz-clickable dz-started appupload"
      id="my-awesome-dropzone">
        <!--input type="file" name="file" /-->
     </form>
</div> <!-- end upload new -->

</div> <!-- end registered -->

<div id="ModalBack">
    <div id="AppDescription">
        <div id="CloseBt"><i class="fa fa-times-circle-o fa-2x"></i></div>
        <div id="topApp">
            <img id="imgApp" src="" />
            <div class="AppDescDevContainer">
                <input type="text" class="form-control" id="EditAppDescName" placeholder="App.name"></input>
                <input type="text" id="EditAppDescDev" class="form-control" placeholder="App.developer"></input>
                <input type="text" id="EditAppDescDevUrl" class="form-control" placeholder="App.dev.url"></input>
            </div>
            <!--span id="appDescStars">******</span-->
        </div>


    <div id="leftDesc">
        <div class="DescLabel" id="RscTypeLabel"><span i18n="true">label.type</span></div>
        <select class="chosen-select" id="EditRscType">
            <!-- Fillable dynamic -->
        </select>

        <div class="DescLabel" i18n="true">label.level</div>
        <select multiple id="EditRscLevel" class="chosen-select" data-placeholder="...">
            <option>Infantil</option>
            <option>Primària</option>
            <option>Secundària</option>
            <option>Batxillerat</option>
            <option>Educació Especial</option>
        </select>
        <!--div class="DescContent" id="RscLevel"></div-->

        <div class="DescLabel"  i18n="true">label.subjects</div>
        <!--div class="DescContent" id="RscSubjects"></div-->
        <select multiple class="chosen-select" id="EditRscSubjects" data-placeholder="...">
            <option>Maths</option>
            <option>Language</option>
            <option>Music</option>
            <option>Coneixement del medi</option>
        </select>


        <div class="DescLabel"  i18n="true">label.tags</div>
        <div class="tags" id="EditRscTagsContainer">
        <input name="tags" value="" id="EditRscTags" data-content=""></input>
        </div>


        <!--div class="DescContent" id="RscTags"></div-->
    </div>

    <div id="appDescDesc">
        <textarea class="form-control" id="EditRscFullDescription" rows="13" placeholder="App.description"></textarea>
    </div>

    <div id="BtCancelEditRsc" class="btn btn-danger BtnCancelEditRsc"><span i18n="true">Btn.Cancel</span></div>
    <div id="BtSaveEditRsc" class="btn btn-success BtnSaveEditRsc"><span i18n="true">Btn.Save</span></div>
    </div>
</div>  <!-- modalback -->


</div> <!-- tab-content -->

 <div class="notification_area" id="notification">
    <div id="notification_title">Title</div>
    <div id="notification_body">Descriptiopn</div>
 </div>


<?php
}
?>

<!-- Template for Dropzone items -->
    <!--div id="template" class="dz-message">Arrossega més imatges aci</div-->
	<div id="template" class="dz-preview dz-file-preview">
	  <div class="dz-details">
		<div class="dz-filename"><span data-dz-name></span></div>

		<img data-dz-thumbnail />
	  </div>
	  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
	  <div class="dz-success-mark"><span>✔</span></div>
	  <div class="dz-error-mark"><span>✘</span></div>
	  <div class="dz-error-message"><span data-dz-errormessage></span></div>
	</div>

	<!-- End for template -->

</body>
</html>
