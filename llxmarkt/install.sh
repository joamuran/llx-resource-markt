#!/bin/bash


echo "********************************************"
echo "*                                          *"
echo "*   LliureX Resource Markt Configuration   *"
echo "*                                          *"
echo "*   Let's ask some questions to finish     *"
echo "*   configuration for LliureX Resource     *"
echo "*   Market.                                *"
echo "*                                          *"
echo "********************************************"

echo
echo -n "Enter Administrator Username:"
read username

echo -n "Enter Password for $username: "
read -s pass1
echo 
echo -n "Please Repeat Password for $username: "
read -s pass2

until [[ $pass1 == $pass2  ]]
do
	echo 
	echo "Passwords entered does not match, repeat it, please."
	echo -n "Enter Password for $username: "
	read -s pass1
	echo
	echo -n "Please Repeat Password for $username: "
	read -s pass2
	echo
done


echo 
echo "Generate models/cfg/admin.json...."

[ -d models/cfg/ ] || mkdir -p models/cfg

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


