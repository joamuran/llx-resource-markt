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

# Create needed dirs if they are not created
[ -d models/cfg/ ] || mkdir -p models/cfg
[ -d apps.manifest ] || mkdir -p apps.manifest
[ -d apps.icons ] || mkdir -p apps.icons
[ -d recursos ] || mkdir -p recursos

for rsctype in `cat typelist`; do
    #echo "Creating recursos/$rsctype..."
    [ -d recursos/$rsctype ] || mkdir -p recursos/$rsctype
done

echo "Adding permissions to apps.manifest...."
chgrp -R www-data apps.manifest
chmod -R 775 apps.manifest
echo "Adding permissions to apps.icons...."
chgrp -R www-data apps.icons
chmod -R 775 apps.icons
echo "Adding permissions to recursos...."
chgrp -R www-data recursos
chmod -R 775 recursos
