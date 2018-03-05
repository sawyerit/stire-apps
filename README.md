# Stride API Reference Readme

The Stride reference application, client and docs are intended to provide you with a walk-through of functionality and core features of 
the Stride API. To work with a smaller app, checkout out the hello app.  

### Project Directory Structure 

```
stride-apps-reference
|----apps  
|      |
|------reference           
|      |     |--package.json
|      |     |--app.js
|      |     |--ref-descriptor.json
|      |     |--.env
|      |     |--public
|------hello-|   
|      |     |--package.json
|      |     |--app.js
|      |     |--hello-descriptor.json
|      |     |--.env
|      |     |--public
|    src-----|                
|      |--package.json
|      |--api
|      |--lib
|      |--index.js
     
```

### Clone the repository

```
git clone git@bitbucket.org:atlassian/stride-apps-reference.git
cd stride-apps-reference
```
 
### Install dependencies
 
Run the install script.  This installs the packages for the docs, reference and the stride client.  
 
```
./install.sh
```

### Create an app

Next, [create a Stride app](https://developer.atlassian.com/apps/create) in developer.atlassian.com 

* Give your new app a name in the App name field.
* If desired, add a short description in the Description field.
* Click **Create**; you’ll be directed to your app’s dashboard page.
* Click **Enable API** for the **Stride API**.
* Click **Add** for the **Manage conversation** scope
* Click **Enable API** for the **User API**
* In the **Enabled APIs** tab, make a note of the client ID and the client secret.

 
### Update .env

In the apps/reference directory, rename the **.env_example** file to **.env**. 
In your .env file, carry over the client id and client secret from your app dashboard in the previous step.

```
// working directory: stride-apps-reference/apps/reference/.env
  
CLIENT_ID=0MIiq3bSeeWa4yeqcdlxd1YouFb2XdTWzofTN
CLIENT_SECRET=pMU6ideX8MxirSpurspxpFvXlvnsbX38_vM0aci7PwBYpt9m4N-Str4w
NODE_ENV=production
PORT=8080
```

### Start ngrok

Install [Ngrok](https://ngrok.com/) if you don't already have it.

```
//new tab start ngrok and leave running
ngrok http 8080
```

Copy the URL provided by ngrok {ngrokURL}. It should look similar to https://740a1ad5.ngrok.io.

### Start the app

```
// working directory: stride-apps-reference/apps/reference
cd apps/reference
node app.js
```

To verify if your app works correctly, load the following URL in your browser:

```
http://localhost:8080/lifecycle/descriptor // descriptor.json should load in browser 
```

### Update the descriptor in Stride 

* Navigate to your [My Apps](https://developer.atlassian.com/apps) page.
* Click to open the app and then click the **Install** tab.
* Enter your app descriptor URL, {ngrokURL}/descriptor, in the **Descriptor URL** field. The URL you enter should look similar to https://740a1ad5.ngrok.io/descriptor.
* Click **Refresh**. When the app descriptor is installed you will see a **The descriptor has been updated successfully!** message displayed.

### Install the app in Stride 

Your app is created and configured, and your app descriptor is linked. Now, you can add the app to a conversation:

* In your app dashboard, in the **Install** tab, click **Copy** for the Installation URL.
* Open Stride.
* Open the conversation in which you’d like to install the app.
* Click the **Apps** icon to open the Apps sidebar, and then click the + button to open the Atlassian Marketplace in Stride.
* Click **Connect your app** in the **Connect your own app** box, and then select the **Installation URL** tab.
* Paste in the **Installation URL** and click **Add to room**.
* In a few seconds, a new card for your installed app and bot should appear in the sidebar and the app should send a message to the conversation.


### Contributions 

Contributions to docs, reference app and client are welcomed.  Please open a branch and submit a PR for approval.
