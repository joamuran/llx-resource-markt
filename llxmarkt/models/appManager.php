<?php

class appManager{
    var $manifestpath="./../apps.manifest/";
    var $incomingpath="./../recursos/incoming/";
    var $rscapps="./../";
    var $appicons="./apps.icons/";

    function getAllApps(){
        /*
        Returns all the apps registered into apps.manifest
        */

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
        */

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
        */

        // Read Manifest
        $json_data = file_get_contents($this->manifestpath.$rsc);
        $json=json_decode($json_data, true);


        // if only downloading resource...
        if($onlyresource){
            // Only downloading resource (clic, flash...)
            //echo ($json['launch_file']);
            echo ($json['source']['location']);

        } else {
            // If we are downloading lliurex resource...

            // Add files from resource
            //if (gettype($json['launch_file'])!='NULL'){
            if (gettype($json['source']['location'])!='NULL'){
                array_push($files_to_add, $_SERVER['DOCUMENT_ROOT'].'/repoo/'.$json['source']['location']);
            //array_push($files_to_add, $_SERVER['DOCUMENT_ROOT'].'/repoo/'.$json['launch_file']);
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
        */

        // Read Manifest
        $json_data = file_get_contents($this->manifestpath.$rsc);
        $json=json_decode($json_data, true);

        //echo ($json['launch_file']);
        echo ($json['source']['location']);

    } // Function download


    function saveResource($rsc){
        /*
        Creates resource manifest file from $rsc
        Filename will be $rsc["id"] + ".namifest"

        [id] => letras.zip \n
        [name] => Letras \n
        [description] => \n
        [source] => Array\n
            (\n
            [type] => file\n
            [location] => \n )\n\n
        [icon] => \n
        [developer] => Array\n
            (\n[name] => \n
            [url] => \n )\n\n
        [type] => flash\n
        [level] => \n
        [subjects] => \n
        [tags] => Array\n
            (\n
            [0] => \n        )\n\n)\n,

        */
        // WIP!!!!!!!
        // --->> MIRAR QUE ES EL QUE ESTEM ENVIANT QUAN GUARDEM UN NOU RECURS!
        //error_log("111111111111111111");

        error_log( print_r( $rsc, true ) );
        // error_log("222222222222222222");

        $json_original=null;

        // Check if manifest exists
        if (file_exists($this->manifestpath.$rsc["id"].".manifest")){
            // If exists getting its content
            $json_original_data = file_get_contents($this->manifestpath.$rsc["id"].".manifest");
            $json_original=json_decode($json_original_data, true);
        } else {
            // else, create an empty file
            $popularity=array('sum' => 0, 'count' => 0);
            $json_original=array('popularity'=>$popularity);

            // Building new location
            $json_original['source']['location']=$rsc['source']['location'];
            $json_original["type"]="new";  // Set to new to force copy from incoming to properly location


        }

        // Create new rsc structure
        $rsc["popularity"]=$json_original["popularity"];

        if(($rsc["source"]["type"]=="file")&&$rsc["type"]!=$json_original["type"])
            {
                $array_path=split("/",$json_original["source"]["location"]);
                $newpath="recursos/".$rsc["type"]."/".$array_path[count($array_path)-1];

                if(stripslashes($rsc["source"]["location"]) != $newpath){
                    // Location has changed, moving resource
                    error_log("RENAME***: "." ".$rsc["source"]["location"]." TO ".$newpath);
                    rename("./../".$rsc["source"]["location"], "./../".$newpath);

                    // AMB ESTES COSES DETECTEM SI HA CANVIAT DE TIPUS
                    // SI HA CANVIAT, CALDRÀ FER CÒPIA AL LLOC QUE TOQUE
                    // EN TEORIA DESPRÉS DETECTAR QUAN EXISTIX EL FITXER PER SABER SI ES NOU I FER-HO EN ELS RECURSOS NO CATALOGATS DE INCOMING
                    $rsc["source"]["location"]=$newpath;

                    //$rsc["type"]="changed: ".stripslashes($rsc["source"]["location"])."--".$newpath;
                }
                //else
                  //  $rsc["type"]="the same";



            //$rsc["type"]=$rsc["type"]."Modified";
            }

        $json_new_data = json_encode($rsc);
        file_put_contents($this->manifestpath.$rsc["id"].".manifest", $json_new_data);

        // Prepare array files
        //$json_data = json_encode($rsc);
        //file_put_contents($this->manifestpath.$rsc["id"].".manifesto", $json_data);
        //echo ($json['launch_file']);


    } // Function download



    /*
     Unregistered Apps
    */



    function getUnregisteredApps(){
        /*
        Returns all the apps registered into apps.manifest
        */
        $resources = array();

        $dir = opendir($this->incomingpath);

        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }
            //$json = file_get_contents($this->manifestpath.$file);
            //error_log($file);
            array_push ( $resources,  $file);
        }

        return (json_encode($resources));
    } // End getAllApps

    function getAppsIcons(){
        /*
        Returns all the images into apps.icons
        */
        $resources = array();

        $dir = opendir("./../".$this->appicons);

        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }
            //$json = file_get_contents($this->manifestpath.$file);
            //error_log($file);
            array_push ( $resources,  $this->appicons.$file);
        }

        return (json_encode($resources));
    } // End getAllApps


    function deleteFile($filename){
        error_log($filename);
        if (file_exists($this->incomingpath.$filename)){
            unlink($this->incomingpath.$filename);
            return true;
        }
        return false;
    }

//** TO DO


// cal revistar les rutes dels recursos a revisar i que els fitxers existisquen!!


    function deleteResource($filename){
        error_log($filename);
        if (file_exists($this->manifestpath.$filename.".manifest")){
          //
          $json_data = file_get_contents($this->manifestpath.$filename.".manifest");
          $json=json_decode($json_data, true);
          error_log($json['source']['location']);

            unlink($this->manifestpath.$filename.".manifest");
            unlink($this->rscapps.$json['source']['location']);

            return true;
        }
        return false;
    }

    function getSelectedApps($rsctype, $rscsubject, $rsctags){
        /*
        Returns selected apps registered into apps.manifest
        */
        error_log("11111111111:".count($rsctype));
        error_log("22222222222:".count($rscsubject));
        error_log("33333333333:".count($rsctags));

        $resources = array();
        $dir = opendir($this->manifestpath);

        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }

            $json_data = file_get_contents($this->manifestpath.$file);
            $json=json_decode($json_data, true);

            // Convert $rsctype to array if it isn't
            $rsctype_array=array();
            if(is_array($rsctype)) $rsctype_array=$rsctype;
            else $rsctype_array[0]=$rsctype;

            // Fisrt check: Matching type?
            if (in_array($json["type"], $rsctype_array, true) || count($rsctype)==0){ // This is a candidate

              // Prepare array subjects
              $subjects_candidate=array();
              if(is_array($json["subjects"])) $subjects_candidate=$json["subjects"];
              else $subjects_candidate[0]=$json["subjects"];

              // Convert $rsctype to array if it isn't
              $rscsubject_array=array();
              if(is_array($rscsubject)) $rscsubject_array=$rscsubject;
              else $rscsubject_array[0]=$rscsubject;

              if ( (count(array_intersect($subjects_candidate,$rscsubject_array))>0) || count($rscsubject)==0 ){

              // Convert $rsctags to array if it isn't
              $rsctags_array=array();
              if(is_array($rsctags)) $rsctags_array=$rsctags;
              else $rsctags_array[0]=$rsctags;

              error_log("RSC TAGS ARRAY IS :".count($rsctags_array)." - ".$json["id"]);

              if(count($rsctags_array)>0){ // If there is any tag...
                if ( count(array_intersect($json["tags"],$rsctags_array))>0 || count($rsctags)==0){ // Check tags
                  array_push ( $resources,  $json_data);
                   }
                } else array_push ( $resources,  $json_data);
              }
            }
        }
        error_log(json_encode($resources));
        return (json_encode($resources));
    } // End getSelectedApps


}


$myappManager=new appManager();

// Main controller...

switch ($_POST["action"]){
case "getMenus":
        echo ($myappManager->getMenus());
    break;

    case "getAllApps":
        echo($myappManager->getAllApps());
    break;

    case "getSelectedApps":
        $rsctags=array();
        if (isset($_POST['rsctags'])) $rsctags=$_POST["rsctags"];
        echo($myappManager->getSelectedApps($_POST["rsctype"], $_POST["rscsubject"], $rsctags));
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

    case "saveResource":
        $myappManager->saveResource($_POST["data"], true);
    break;

    case "deleteFile":
        $myappManager->deleteFile($_POST["filename"]);
    break;

    case "deleteResource":
        $myappManager->deleteResource($_POST["filename"]);
    break;

    case "getUnregisteredApps":
        echo($myappManager->getUnregisteredApps());
    break;

    case "getAppsIcons":
        echo($myappManager->getAppsIcons());
    break;
}

/*if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
else if ($_POST["action"]=="getAllApps") echo($myappManager->getAllApps());
//if ($_POST["action"]=="getAllApps") return ("cosa");
else return ("pajarito");*/


?>
