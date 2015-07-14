var TypelistClass = function TypelistClass() {
    this.typelist_lang=[];
    this.typelist;
    
    this.typelist_lang["ca-ES"]=[{"type":"flash", "Desc":"Recurs Flash", "dir":"flash"}, // Better in file!
                        {"type":"jclic", "Desc":"Activitat Jclic", "dir":"jclic"},
                        {"type":"web", "Desc":"Recurs HTML","dir":"web"},
                        {"type":"video", "Desc":"Vídeo","dir":"video"}
                        ];

    this.typelist_lang["es-ES"]=[{"type":"flash", "Desc":"Recurso Flash", "dir":"flash"}, // Better in file!
                        {"type":"jclic", "Desc":"Actividad Jclic", "dir":"jclic"},
                        {"type":"web", "Desc":"Recurs HTML","dir":"web"},
                        {"type":"video", "Desc":"Vídeo","dir":"video"}
                        ];

    this.typelist_lang["en"]=[{"type":"flash", "Desc":"Flash resource", "dir":"flash"}, // Better in file!
                        {"type":"jclic", "Desc":"Jclic Activity", "dir":"jclic"},
                        {"type":"web", "Desc":"HTML resource","dir":"web"},
                        {"type":"video", "Desc":"Vídeo","dir":"video"}
                        ];
}


TypelistClass.prototype.getConfig = function getConfig(lang){
    var self=this;
    
    if ( lang === "ca-ES" || lang === "es-ES" ) return self.typelist_lang[lang];
    
    else return self.typelist_lang["en"];
   
}