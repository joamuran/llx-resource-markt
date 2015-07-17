# llx-resource-markt

Llx-resource-markt is a web application for managing educational resources. The application is a front-end for resources pools, to allow users for search and download resources in the repository and administratots add and classify new resources.

## Installation

1. Download source and install llxmark forlder into your web server root (for example /var/www/html for Ubuntu 14.04 / LliureX 15.06).
2. Execute install.sh script to configure access for admin user and properly file permissions.

Resource market will be available under http://localhost/llxmarkt. You can configure Apache site as you want to point this location.

## Main Window

When you access to Lliurex Resource Market, you'll be on the main window, when you can to search and download resources. For some resources that are in the Internet, you'll be able lo launch it directly.

On the right menu, you'll be able to search resources by level, tags or subjects.

## Manage Markt

On the top-right corner of the main window, there is a button to access Manager tab. You need to have run install.sh to configure administrator access. 

Te manage window has three tabs: Manage Installed Resources, Manage unsorted resources and upload resources.

### Manage Installed Resources

From this tab you'll be able to edit resources information as it will be shown in the Main Window.

### Manage Unsorted Apps

From this tab you'll be able to edit unsorted resources information.

### Resource Upload

Fron this tab you can upload resources to server by drag and drop them. Resources will be shown into Unsorted Apps tab, waiting that you insert information about it.
Consider that every new resource added, will be unsorted until you insert information about it, and it will not be shown in main window until you do it.


## Technical details

Uploaded resources will be copied into /recursos/incoming folder. When you classify it, they will be moved to a folder into resources according to its class.
Data about any resource classified will be stored in apps.manifest folder, as a json file.
The admin user name and password is stored in /models/cfg/admin.json. You can edit it if you want to modify it (note that password is stored in md5). You can too run install.sh script to modity it too.
