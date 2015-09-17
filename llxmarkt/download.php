<?php

function download_file($filename){

if (file_exists($filename)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.str_replace(" ", "%20",basename($filename)));
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filename));
    error_log("AAAAAAAAAAAAAA:".$filename);
    readfile($filename);
    exit;
    }
}

$file=$_REQUEST['f'];
error_log($file);
if (file_exists($file)) download_file($file);
else try{
    error_log("NOT EXISTS");
    $download=file_get_contents($file);
    $filepath=split("/", $file);
    $filename=$filepath[count($filepath)-1];
    file_put_contents("/tmp/".$filename,$download);
    download_file("/tmp/".$filename);
    } catch(Exception $err){
        echo "Error: "+$err;
  }

?>
