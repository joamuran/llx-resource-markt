function I18n(language){
	
	this.current_lang="";
	switch (language) {
		case "ca-ES":
			this.current_lang=ca_ES;	// Defined as global in ca_ES.js
			break;
		case "es-ES":
			this.current_lang=es_ES;	// Defined as global in es_ES.js
			break;
		default:
			this.current_lang=en;	// Defined as global in en.js
	}
	
	console.log(this.current_lang);
}


I18n.prototype.writetext = function(key){
	// Wrapper of gettext for html pages
	document.write(this.gettext(key));
	};

I18n.prototype.gettext = function(key,substitution){
	substitution = typeof substitution !== 'undefined' ? substitution : null;
	if (! (key in this.current_lang)){
		return "<span style='text-decoration:line-through;color:red; font-weight:bolder;'>"+key+"</span>";
	}
	if (substitution === null){
		return this.current_lang[key]['message'];
	}
	if( Object.prototype.toString.call( substitution ) === '[object Array]' ) {
		return this.current_lang[key]['message'].replace(/(\$[a-zA-Z]+\$)/g, function(v){
			var result = substitution.shift();
			return typeof result !== 'undefined' ? result : "<span style='text-decoration:line-through;color:pink; font-weight:bolder;'>"+v+"</span>"; ;
		});
	}
	return this.current_lang[key]['message'].replace(/(\$[a-zA-Z]+\$)/g,function(v){
		var result = substitution[v.substr(1,v.length -2)];
		return typeof result !== 'undefined' ? result : "<span style='text-decoration:line-through;color:pink; font-weight:bolder;'>"+v+"</span>"; ;
	});
}


$(document).ready(function() {
	$("[i18n=true]").each(function( index ) {
		text=$( this ).text();
		$(this).replaceWith(I18n.gettext(text));
		});
	
	$("input[placeholder]").each(function(index){
		text=$( this ).attr("placeholder");
		$( this ).attr("placeholder", I18n.gettext(text));
		
		});
})

//TODO REMOVE
function gettext(x){
	return x;
}