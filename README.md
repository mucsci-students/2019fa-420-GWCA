# GWCA
Group Without a Cool Acronym


Prereqs:

	You to install Node.js to be able to install Angular's CLI
	Install link https://nodejs.org/

Installing the Angular CLI:

	Now you need to open a console (Windows: Command Prompt, Linux/Mac: Terminal)
	Note: VS Code has a built-in console that allows for most of these commands

	Type in the commands into the console:

	1) npm install -g @angular/cli

	To create a new application use the command:

	2) ng new (name) 

	This can be anything we will just be working with uploading specific components and files to the GitHub. The new command will just create a directory for you to work under.

	Then you need to change the current directory to the project's directory

	3) cd (name)

	Then you can run your project locally with the command:

	4) ng serve (Note: to see this in your browser you have to open localhost:4200)

	This will compile your app on save.
  
Add-ins:
  
  The add-ins can change throughout the process, but for now:
  
  Angular Materials:
  
    Use the command in the console: 
    
    1) npm install --save @angular/material @angular/cdk @angular/animations
    
    Note: This is for front end parts to make the html easier and more standardized
    
  Firebase (for deployment):
  
    We only need one person uploading the project at a time, so just contact bxbanker (Brandon) to add a gmail account you want associated with the project
    
    2) npm install -g firebase-tools
    
    3) firebase login
    
    This will link an account (Google account) to your project
    
    4) firebase init
    
    This will setup the hosting options (if we need to later) for the project
    
    Then you need to build your project in Angular
    
    5) ng build --prod
    
    This will store a directory inside a dist folder with the same name as your project
    
    Inside the firebase.json file there will a "hosting" section with a sub-section "public" with the directory given in the firebase init setup. Usually it will just be dist, but now Angular builds with the sub-directory inside dist, change the dist to dist/(project name).
    
    Then you can deploy the project
    
    6) firebase deploy
    
    Finally, to see the project you can find it at project-name.firebaseapp.com.
