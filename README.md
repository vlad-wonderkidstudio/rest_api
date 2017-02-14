inventoryoptix-back
===================

The back-end code for InventoryOptix


========================
Installation
========================

1. npm install
2. Edit Gruntfile.js if needed to setup the correcr DB credentials
3. grunt build:dev or grunt build:prod

========================
Note 
========================

Grunt creates a default user: 
Email:system@inventoryoptix.com2
Password: "system" 
HashedPassword: "27bc2b305a5dae25d413cfb5dff52f75"

Remember, that if you want to use objects other then Login, 
you shound pass not Email:Password, but Email:HashedPasword