<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script src="lib/jquery/jquery-2.1.1.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.js"></script>
    <script src="lib/jquery.tagsinput/jquery.tagsinput.min.js"></script>
    <!--script src="lib/tagsinput/bootstrap-tagsinput.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap-switch.min.js"></script-->
    <!--script src="lib/bootstrap/js/bootstrap-tooltip.js"></script-->
    <!--script type="text/javascript" src="lib/bootbox.min.js"></script-->

    <!-- LOCALES: i18n -->
    <script src="locales/ca_ES.js"></script>
    <script src="locales/en.js"></script>
    <script src="locales/es_ES.js"></script>
    <script src="lib/i18n.js"></script>

    <script src="js/index.js"></script>
    <script src="js/login.js"></script>

    <!--script src="js/ui.js"></script-->
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="lib/jquery.tagsinput/jquery.tagsinput.min.css">
    <!--link rel="stylesheet" href="lib/bootstrap/css/bootstrap-switch.css">
    <link rel="stylesheet" href="lib/tagsinput/bootstrap-tagsinput.css"-->
    <link rel="stylesheet" href="lib/font-awesome-4.3.0/css/font-awesome.css">
    <link rel="stylesheet" href="css/index.css">
    <title>LliureX Resource Bazaar</title>
</head>

<body>


<!-- Header -->

<div id="topHdr"></div>
<!-- connect button -->
<div>
<?php
session_start();
require_once("loginheader.php");
?>
</div> <!-- header -->


<!-- Main Content -->
<div id="mainContainer" class="row">


<div id="sideMenu" class=".container-fluid col-md-3">
    <!-- TODO
        IMPLEMENTAR LA FUNCIONALITAT DE CERCA
    -->
    <div class="menuContainer">
        <a href="#rscTypeMenu" class="list-group-item rootEntry" data-toggle="collapse"><span i18n="true">rsc.type</span></a>
        <div class="collapse" id="rscTypeMenu"></div>
    </div>

    <div class="menuContainer">
        <a href="#rscSubjectMenu" class="list-group-item rootEntry" data-toggle="collapse"><span i18n="true">rsc.subject</span></a>
        <div class="collapse" id="rscSubjectMenu"></div>
    </div>

    <div class="menuContainer">
        <div class="sectionMenu"><span i18n="true">rsc.tags</span></div>
        <div class="tags">
            <input name="tags" id="tags" value="" />
        </div>
    </div>

    <div class="BtContainer">
        <button type="button" class="btn btn-primary btn-sm" id="BtSearch"><span i18n="true">rsc.search</span></button>
    </div>

</div>


<div id="appsDiv" class=".container-fluid col-md-9">
    <div id="appsContainer" class="row"></div>
</div>

<div id="ModalBack">
    <div id="AppDescription">
        <div id="CloseBt"><i class="fa fa-times-circle-o fa-2x"></i></div>
        <div id="topApp">
            <img id="imgApp" src="" />
            <span id="appDescName">App Name</span>
            <span id="appDescDev">Developers</span>
            <span id="appDescDevUrl">Developers URL</span>
            <span id="appDescStars">******</span>
        </div>


    <div id="leftDesc">

        <div class="DescLabel" i18n="true">label.type</div>
        <div class="DescContent" id="RscType"></div>
        <div class="DescLabel" i18n="true">label.level</div>
        <div class="DescContent" id="RscLevel"></div>
        <div class="DescLabel"  i18n="true">label.subjects</div>
        <div class="DescContent" id="RscSubjects"></div>
        <div class="DescLabel"  i18n="true">label.tags</div>
        <div class="DescContent" id="RscTags"></div>
    </div>

    <div id="appDescDesc"></div>

    <div class="BottomButtons">
        <div id="BtDownloadResource" class="btn btn-primary BtnDownloadBig"><span i18n="true">app.download</span></div>
        <div id="BtLaunchResource" class="btn btn-primary BtnDownloadBig"><span i18n="true">app.launch</span></div>
    </div>

    </div>
</div>


</div>

</body>
</html>
