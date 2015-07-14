<?php 

$files_to_add = array();

/*$rsc=$_POST["rsc"];
$manifestpath=$_POST["manifestpath"];*/
$rsc=$_GET["rsc"];
$manifestpath=$_GET["manifestpath"];

// Read Manifest
$json_data = file_get_contents($manifestpath.$rsc);
$json=json_decode($json_data, true);
        
// Add files from resource (it thay are needed)
/*if (gettype($json['launch_file'])!='NULL'){
array_push($files_to_add, $json['launch_file']);
}*/
        
// Add resource manifest
array_push($files_to_add, $_SERVER['DOCUMENT_ROOT'].'/repoo/apps.manifest/'.$rsc);
        
//$zipname=$json['id'].'.llxrsc';
//$tmp_path=$_SERVER['DOCUMENT_ROOT'].'/repoo/tmp/';

        
   
# create new zip opbject
$zip = new ZipArchive();
# create a temp file & open it
$tmp_file = tempnam('.','');
$zip->open($tmp_file, ZipArchive::CREATE);
# loop through each file
//foreach($files as $file){
foreach($files_to_add as $file){
# download file
$download_file = file_get_contents($file);

#add it to the zip
$zip->addFromString(basename($file),$download_file);

}
# close zip
$zip->close();

       
       
    // http headers for zip downloads
header("Pragma: public");
header("Expires: 0");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: public");
header("Content-Description: File Transfer");
header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"tralari.zip\"");
header("Content-Transfer-Encoding: binary");
header("Content-Length: ".filesize($tmp_file));
ob_end_flush();
@readfile($tmp_file);
?>