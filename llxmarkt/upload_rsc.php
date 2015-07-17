<?php
       
try{
    $target_dir = "recursos/incoming/";
    $idrsc=basename($_FILES["file"]["name"]);
    $target_file = $target_dir . $idrsc;	
    $type = $_FILES["file"]["type"];
    $uploadOk = 1;
      
    /*$accepted_types = array('image/png',
                            'image/jpg',
							'image/jpeg',
                            'image/gif');
    	*/
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    // Check file type
    /*$check = false;
    foreach($accepted_types as $mime_type) {
		if($mime_type == $type) {
			$check = true;
			break;
		} }*/
        
    //if($check !== false) {
		
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
    /*} else {
        echo "File is not a valid image resource.";
        $uploadOk = 0;
    } */   
    
} catch(Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
 }
?> 
