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

cd "$(dirname "$0")"

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

userpass=`echo -n $pass1 | md5sum | cut -f 1 -d " "`

echo "{" > models/cfg/admin.json
echo "\"username\": \"$username\"," >> models/cfg/admin.json
echo "\"pass\": \"$userpass\"" >> models/cfg/admin.json
echo "}" >> models/cfg/admin.json

chmod +r models/cfg/admin.json

