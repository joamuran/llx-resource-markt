#!/bin/bash


cd "$(dirname "$0")"
echo "********************************************"
echo "*                                          *"
echo "*   LliureX Resource Markt Configuration   *"
echo "*                                          *"
echo "*   Let's ask some questions to finish     *"
echo "*   configuration for LliureX Resource     *"
echo "*   Market.                                *"
echo "*                                          *"
echo "*   Caution:                               *"
echo "*                                          *"
echo "*    This script should be run as sudo!    *"
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

userpass=`echo -n $pass1 | md5sum | cut -f 1 -d " "`

echo "{" > models/cfg/admin.json
echo "\"username\": \"$username\"," >> models/cfg/admin.json
echo "\"pass\": \"$userpass\"" >> models/cfg/admin.json
echo "}" >> models/cfg/admin.json

chmod +r models/cfg/admin.json


