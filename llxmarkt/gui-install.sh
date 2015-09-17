#!/bin/bash


#echo "********************************************"
#echo "*                                          *"
#echo "*   LliureX Resource Markt Configuration   *"
#echo "*                                          *"
#echo "*   Let's ask some questions to finish     *"
#echo "*   configuration for LliureX Resource     *"
#echo "*   Market.                                *"
#echo "*                                          *"
#echo "*   Caution:                               *"
#echo "*                                          *"
#echo "*    This script should be run as sudo!    *"
#echo "*                                          *"
#echo "********************************************"

username=`zenity --entry --title "LliureX Resource Markt" --text="Enter Administrator Username:" `
[ $? == 0 ] || exit
pass1=`zenity --entry --title "LliureX Resource Markt" --text="Enter Password for $username:" `
[ $? == 0 ] || exit
pass2=`zenity --entry --title "LliureX Resource Markt" --text="Please Repeat Password for $username: " `
[ $? == 0 ] || exit

until [[ $pass1 == $pass2  ]]
do
	zenity --error --text "Passwords entered does not match, repeat it, please."
	pass1=`zenity --entry --title "LliureX Resource Markt" --text="Enter Password for $username:" `
	[ $? == 0 ] || exit
	pass2=`zenity --entry --title "LliureX Resource Markt" --text="Please Repeat Password for $username: " `
	[ $? == 0 ] || exit
done

#echo
#echo "Generate models/cfg/admin.json...."

# Create needed dirs if they are not created
[ -d models/cfg/ ] || mkdir -p models/cfg
[ -d apps.manifest ] || mkdir -p apps.manifest
[ -d apps.icons ] || mkdir -p apps.icons
[ -d recursos ] || mkdir -p recursos

for rsctype in `cat typelist`; do
    #echo "Creating recursos/$rsctype..."
    [ -d recursos/$rsctype ] || mkdir -p recursos/$rsctype
done

userpass=`echo -n $pass1 | md5sum | cut -f 1 -d " "`

echo "{" > models/cfg/admin.json
echo "\"username\": \"$username\"," >> models/cfg/admin.json
echo "\"pass\": \"$userpass\"" >> models/cfg/admin.json
echo "}" >> models/cfg/admin.json

chmod +r models/cfg/admin.json

echo "Adding permissions to apps.manifest...."
chgrp -R www-data apps.manifest
chmod -R 775 apps.manifest
echo "Adding permissions to apps.icons...."
chgrp -R www-data apps.icons
chmod -R 775 apps.icons
echo "Adding permissions to recursos...."
chgrp -R www-data recursos
chmod -R 775 recursos
