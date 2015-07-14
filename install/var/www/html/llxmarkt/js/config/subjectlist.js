var SubjectlistClass = function SubjectlistClass() {
    
    this.subjectlist_lang=[];
    this.subjectlist;
    
    this.subjectlist_lang["ca-ES"]=[{"subject":"maths", "Desc":"Matemàtiques"}, // Better in file!
                        {"subject":"history", "Desc":"Història"},
                        {"subject":"valencian", "Desc":"Valencià"},
                        {"subject":"castilian", "Desc":"Castellà"},
                        {"subject":"nature", "Desc":"Coneixement del medi:Ciències Naturals"},
                        {"subject":"music", "Desc":"Música"},
                        {"subject":"society", "Desc":"Coneixement del medi: Ciències Socials"},
                        {"subject":"physics", "Desc":"Física"},
                        {"subject":"chemist", "Desc":"Química"},
                        {"subject":"it", "Desc":"Informàtica"},
                        {"subject":"tecnology", "Desc":"Tecnologia"},
                        {"subject":"draw", "Desc":"Dibuix/Plàstica"}
                    ];
    
    this.subjectlist_lang["es-ES"]=[{"subject":"maths", "Desc":"Matemáticas"}, // Better in file!
                        {"subject":"history", "Desc":"Historia"},
                        {"subject":"valencian", "Desc":"Valenciano"},
                        {"subject":"castilian", "Desc":"Castellano"},
                        {"subject":"nature", "Desc":"Conocimiento del medio: Ciencias Naturales"},
                        {"subject":"music", "Desc":"Música"},
                        {"subject":"society", "Desc":"Conocimiento del medio: Ciencias Sociales"},
                        {"subject":"physics", "Desc":"Física"},
                        {"subject":"chemist", "Desc":"Química"},
                        {"subject":"it", "Desc":"Informática"},
                        {"subject":"tecnology", "Desc":"Tecnologia"},
                        {"subject":"draw", "Desc":"Dibuijo/Plástica"}
                    ];

    this.subjectlist_lang["en"]=[{"subject":"maths", "Desc":"Maths"}, // Better in file!
                        {"subject":"history", "Desc":"History"},
                        {"subject":"valencian", "Desc":"Valencian"},
                        {"subject":"castilian", "Desc":"Castilian"},
                        {"subject":"nature", "Desc":"Natural Science"},
                        {"subject":"music", "Desc":"Music"},
                        {"subject":"society", "Desc":"Social Science"},
                        {"subject":"physics", "Desc":"Physics"},
                        {"subject":"chemist", "Desc":"Chemistry"},
                        {"subject":"it", "Desc":"Computer Science"},
                        {"subject":"tecnology", "Desc":"Technology"},
                        {"subject":"draw", "Desc":"Drawing"}
                    ];

}


SubjectlistClass.prototype.getConfig = function getConfig(lang){
    var self=this;
    
    if ( lang === "ca-ES" || lang === "es-ES" ) return self.subjectlist_lang[lang];
    
    else return self.subjectlist_lang["en"];
   
}