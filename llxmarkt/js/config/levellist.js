var LevellistClass = function LevellistClass() {
    this.levellist_lang=[];
    this.levellist;
    
    this.levellist_lang["ca-ES"]=[{"level":"primary", "Desc":"Primària"}, // Better in file!
                        {"level":"secondary", "Desc":"Secundària"},
                        {"level":"nursery", "Desc":"Infantil"}
                    ];


    this.levellist_lang["es-ES"]=[{"level":"primary", "Desc":"Primaria"}, // Better in file!
                        {"level":"secondary", "Desc":"Secundaria"},
                        {"level":"nursery", "Desc":"Infantil"}
                    ];


    this.levellist_lang["en"]=[{"level":"primary", "Desc":"Primary"}, // Better in file!
                        {"level":"secondary", "Desc":"Secondary"},
                        {"level":"nursery", "Desc":"Nursery"}
                    ];

}


LevellistClass.prototype.getConfig = function getConfig(lang){
    var self=this;
    
    if ( lang === "ca-ES" || lang === "es-ES" ) return self.levellist_lang[lang];
    
    else return self.levellist_lang["en"];
   
}