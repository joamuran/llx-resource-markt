<?php
session_start();
class sessionManager{
    var $cfgfile="cfg/admin.json";

      function login(){
        $user=$_POST["user"];
        $passwd=md5($_POST["passwd"]);
    
    
        $json_data = file_get_contents($this->cfgfile);
        $json=json_decode($json_data, true);
    
        if(($json["username"]==$user) && ($json["pass"]==$passwd)) {
            $_SESSION["username"]=$user;
            return true;
        }

    } // end login function

    function logout(){
            unset($_SESSION["username"]);
            return true;
        }

    
} // End Class



$mySessionManager=new sessionManager();

switch ($_POST["action"]){
case "login":
        echo ($mySessionManager->login());
        break;
    
case "logout":
        echo ($mySessionManager->logout());
        break;
}

    
    

    
    
    
    /*
    
    
    function getAllApps(){
        /*
        Returns all the apps registered into apps.manifest
        * /
        $resources = array();

        $dir = opendir($this->manifestpath);
        
        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }
            
            $json = file_get_contents($this->manifestpath.$file);
            array_push ( $resources,  $json);
            
        }

        return (json_encode($resources));
    } // End getAllApps
    
    function getMenus(){
        $apps=json_decode($this->getAllApps());
                
        // Get Type of resources
        
        $types=array();
        $subjects=array();
        //array_push($type, $apps);
        foreach ($apps as $app)
        {
            $item=json_decode($app);
            $type=$item->type;
            $subject=$item->subjects;
            if (!in_array($type, $types)) array_push($types, $type);
            
            // Parse subjects array
            foreach($subject as $subj){
                if (!in_array($subj, $subjects)) array_push($subjects, $subj);
            }
            
        }
        
        $ret=null;
        $ret["types"]=$types;
        $ret["subjects"]=$subjects;
        return json_encode($ret);
    }
    
    
    static function createRscManifest($files,$archive_file_name){
        /*
        * $files: array of files to download
        * /
   
       # create new zip opbject
       $zip = new ZipArchive();
       # create a temp file & open it
       
       $tmp_file = "./../tmp/$archive_file_name";
       
       $zip->open($tmp_file, ZipArchive::CREATE);
       # loop through each file
       foreach($files as $file){
           # download file
           $download_file = file_get_contents($file);
   
           #add it to the zip
           $zip->addFromString(basename($file),$download_file);

       }
       # close zip
       $zip->close();
       echo ("/tmp/$archive_file_name");
       
    }
    
    function getResource($rsc, $onlyresource){
        /*
        Reads manifest for resource and creates a .llxrsc manifest zipped file with resource and manifest
        */
        
        // Prepare array files
        $files_to_add = array();
    
    
        /*
         *
         * TO - DO:
         *
         * Adaptar el manifest per a la descàrrega, cal generar-ne un de nou, i aci incloure estadístiques (popularity...)
         * O bé mantenir informació sobre la popularity, el manifest personalitzat ja el crearà l'aplicació, o l'adaptarà d'aquest...
         *
         * Incloure informació sobre la imatge...
        * /
    
        // Read Manifest
        $json_data = file_get_contents($this->manifestpath.$rsc);
        $json=json_decode($json_data, true);
        
        
        // if only downloading resource...
        if($onlyresource){
            // Only downloading resource (clic, flash...)
            echo ($json['launch_file']);
            
        } else {
            // If we are downloading lliurex resource...
        
            // Add files from resource
            if (gettype($json['launch_file'])!='NULL'){
            array_push($files_to_add, $_SERVER['DOCUMENT_ROOT'].'/repoo/'.$json['launch_file']);
            }
            
            // Add resource manifest
            array_push($files_to_add, $_SERVER['DOCUMENT_ROOT'].'/repoo/apps.manifest/'.$rsc);
            //return json_encode($files_to_add);
            
            $zipname=$json['id'].'.llxrsc';
            $tmp_path=$_SERVER['DOCUMENT_ROOT'].'/repoo/tmp/';
            
            //return (gettype($json['launch_file']));
        
            // I a partir d'aci crea el zip...
            
            self::createRscManifest($files_to_add,$zipname);
        } // else
        
        
    } // Function getresource
    
    


    function downloadResource($rsc){
        /*
        Reads manifest for resource and creates a .llxrsc manifest zipped file with resource and manifest
        * /
        
        // Prepare array files
        $files_to_add = array();
    
    
        /*
         *
         * TO - DO:
         *
         * Adaptar el manifest per a la descàrrega, cal generar-ne un de nou, i aci incloure estadístiques (popularity...)
         * O bé mantenir informació sobre la popularity, el manifest personalitzat ja el crearà l'aplicació, o l'adaptarà d'aquest...
         *
         * Incloure informació sobre la imatge...
        * /
    
        // Read Manifest
        $json_data = file_get_contents($this->manifestpath.$rsc);
        $json=json_decode($json_data, true);
        
        echo ($json['launch_file']);      
           
    } // Function download
    
    

}


*
$myappManager=new appManager();

// Main controller...

switch ($_POST["action"]){
case "getMenus":
        echo ($myappManager->getMenus());
    break;

    case "getAllApps":
        echo($myappManager->getAllApps());
    break;

    case "downloadResource":
        $myappManager->downloadResource($_POST["filename"]);
    break;
    
    case "getResource":
        $myappManager->getResource($_POST["filename"], false);
    break;


    case "getOnlyResource":
        $myappManager->getResource($_POST["filename"], true);
    break;
}

/*if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
else if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
//if ($_POST["action"]=="getAllApps") return ("cosa");
else return ("pajarito");*/


?>