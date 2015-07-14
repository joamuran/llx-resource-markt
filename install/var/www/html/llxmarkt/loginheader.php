<?php
session_start();
/*if ($_POST["action"]=="logout"){
    unset($_SESSION["username"]); }*/

if (!(isset($_SESSION["username"]))) {
    ?>
        <button type="button" class="btn btn-link dropdown-toggle" id="btConnect" data-toggle="dropdown">
        <span i18n="true">label.admin</span><span class="caret"/></button>
    <?php } else  { ?>
        <button type="button" class="btn btn" id="btDisconnect">
        <span i18n="true">login.logout</span><?php echo ("(".$_SESSION['username'].")"); ?></button>
<?php } ?>

<div id="menuConnect" class="siteloginbar_poppedup dropdown-menu pull-right modal-sm">

<!--form name="loginbox" class="form" id="loginbox-1" action="models/sessionManager.php" method="post"-->

    <div class="form-group loginLabel">
    <label for="user" i18n="true"><span class="loginLabel">label.user</span></label>
    <input type="text" class="form-control" name="user"></input>
    </div>

    <div class="form-group loginLabel">
    <label for="passwd" i18n="true" class="loginLabel">label.password</label>
    <input type="text" class="form-control" name="passwd"></input>
    </div>

    <button class="btn btn-primary button submit" name="login" id="btLogin"><span i18n="true">login.connect</span></button>

</div>
