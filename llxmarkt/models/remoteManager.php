<?php
header("Access-Control-Allow-Origin: *");

class remoteManager{
    var $manifestpath="/apps.manifest";
    //var $remotemanifestpath="apps.manifest/";
    //var $incomingpath="./../recursos/incoming/";
    var $rscapps="./..";
    var $appicons="/apps.icons";

    function ImportRemoteResource($server, $filename, $manifest, $icon){
      //error_log("*"-$server.$filename."*");
      //error_log("!".$server."/apps.manifest/".$manifest.".manifest"."!");
      //error_log("$".$server.$icon."$");
      error_log("filename:".$filename);
      error_log("manifest:".$manifest);

      // prepare icon files
      $iconfilename=basename(rtrim(str_replace(["\n","\r"],"",$icon), " "));
      $desticon=$this->rscapps.$this->appicons."/".$iconfilename;


      // prepare manifest
      $manifestorigin=$server.$this->manifestpath."/".$manifest.".manifest";
      $destmanifest=$this->rscapps.$this->manifestpath."/".$manifest.".manifest";

      // prepareg resource
      $rscorigin="$server/$filename";
      $rscdest="$this->rscapps/$filename";

    /* Copying files ***************/

    try{
      $error=false;
      $ret="";
     // icon
      error_log("copy icon from $server/$icon to $desticon");
      // We only will copy icon if it not exists already
      if (!file_exists($desticon)) copy($server."/".str_replace(" ", "%20",$icon), $desticon);

      // manifest
      error_log("Copy $manifestorigin to $destmanifest");
      if (file_exists($destmanifest)) {
        $error=true;
        $ret='{"error":"manifestexists", "file":"'.$destmanifest.'"}';
      } else copy(str_replace(" ", "%20",$manifestorigin), $destmanifest);

      // resource
      error_log("Copy $rscorigin to $rscdest");
      if (!$error && file_exists($rscdest)) {
        error_log("************* $rscdest exists!");
        $error=true;
        $ret='{"error":"rscexists", "file":"'.$rscdest.'"}';
      } else copy(str_replace(" ", "%20",$rscorigin),$rscdest);

      $json_data = file_get_contents(str_replace(" ", "%20",$manifestorigin));
      if (!$error) return($json_data);
      else return $ret;

    } catch (Exception $e) {
        error_log("'Caught exception: ',  $e->getMessage()");
        return('{"error":"exception", "msg":"'.$e->getMessage().'"}');
    }



    /* End Copying files ***************/


    }


}

$myRemoteManager=new remoteManager();
// Main controller...



switch ($_POST["action"]){

    // remoteManager Controllers for remote calls
    case "checkStatus":
        echo ("true");
    break;

    // RemoteManager Controllers for local calls
    case "ImportRemoteResource":
        $server=$_POST['server'];
        $filename=$_POST['filename'];
        $manifest=$_POST['manifest'];
        $icon=$_POST['icon'];

        echo($myRemoteManager->ImportRemoteResource($server, $filename, $manifest, $icon));

    break;

}

/*if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
else if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
//if ($_POST["action"]=="getAllApps") return ("cosa");
else return ("pajarito");*/


?>
