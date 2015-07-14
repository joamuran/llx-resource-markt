<?php
       
function getNameFromZip($dir, $resource){
	$rsc_name="";
	try{
		$zip = zip_open("$dir/$resource");                
		if ($zip)
		{
		  while ($zip_entry = zip_read($zip))
			{
			if(substr(zip_entry_name($zip_entry),-6)==".jclic"){
				
				if (zip_entry_open($zip, $zip_entry, "r")) {
					 
					 $data = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
					 $zip_entry_xml=new SimpleXMLElement($data);
					 $rsc_name=$zip_entry_xml->settings->title;                            
				}
				zip_entry_close($zip_entry);                            
			}
		}
		
		zip_close($zip);
		}
		return $rsc_name;
	} // try
	catch(Exception $e) {
		echo 'Caught exception: ',  $e->getMessage(), "\n";
		return $dir;
	}
}


try{
    $target_dir = "apps.icons/";
    $idrsc=basename($_FILES["file"]["name"]);
    $target_file = $target_dir . $idrsc;	
    $type = $_FILES["file"]["type"];
    $uploadOk = 1;
      
    $accepted_types = array('image/png',
                            'image/jpg',
							'image/jpeg',
                            'image/gif',
);
    	
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    // Check file type
    $check = false;
    foreach($accepted_types as $mime_type) {
		if($mime_type == $type) {
			$check = true;
			break;
		} }
        
    if($check !== false) {
		
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_file)){
            // All right, nothing to do
            $uploadOk = 1;
			echo $target_file;
			//$zipname=getNameFromZip($target_dir, basename($_FILES["file"]["name"]));
			//$id=str_replace(".", "_", $idrsc);
			//echo('<div class="click_banner" id="'.$id.'" onclick="carga(&quot;'.$target_file.'&quot;)"><div class="rsc_name">'.$zipname.'</div></div>');
			} else {
                $uploadOk = 0;
            }
    } else {
        echo "File is not a valid image resource.";
        $uploadOk = 0;
    }    
    
} catch(Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
 }
?> 
