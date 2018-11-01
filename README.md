# Estimate Your CO2

This plugin is developed by following the guide line of [Thunderbird Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Thunderbird/Thunderbird_extensions/).

This plugin is only working on the version of thundebird between 45.0 and 57.*. You can download thunderbird on [this website](https://archive.mozilla.org/pub/thunderbird/releases/).

You can edit the default value inside the folder `/defaults/preferences/sendbutton.js`.

## Packaging

When you are satisfied with how your extension works, package it for deployment and installation.

Zip the contents of your extension's folder (not the extension folder itself), and rename the zip file to have a .xpi extension. In Windows 7, you can do this by selecting all the files and subfolders in your extension folder, right click and choose "Send To -> Compressed (Zipped) Folder". A .zip file will be created for you. Just rename it and you're done!

On Mac OS X, you can right-click on the contents of the extension's folder and choose "Create Archive of..." to make the zip file. However, since Mac OS X adds hidden files to folders in order to track file metadata, you should instead use the Terminal, delete the hidden files (whose names begin with a period), and then use the zip command on the command line to create the zip file. The files are typically of the name .DS_Store.

On Linux, you would likewise use the command-line Zip tool.

```
cd ~/extensions/my_extensions
zip -r ../sample.xpi 
 ```

When placed in the (user's profile)/extension directory, Thunderbird will open the xpi, check the id in the install.rdf and create that directory for your package. It will then cd to that directory and unzip the files, thereby creating a mirror of your ~/extensions/my_extension directory structure and files.


## Distributing

### Using addons.mozilla.orgSection
The addons.mozilla.org site is a distribution site where you can host your extension for free. Your extension will be hosted on Mozilla's mirror network. Mozilla's site also provides users with easier installation and will automatically make new versions available to users of your existing versions when you upload them. In addition Mozilla Update allows users to comment and provide feedback on your extension. It is highly recommended that you use AMO to distribute your extensions.

Visit http://addons.mozilla.org/developers/ to create an account and begin distributing your extensions. Note that your extension will be approved more quickly and downloaded more frequently if you have a good description and screenshots of the extension in action.

### Installing from a web pageSection
There are a variety of ways you can install extensions from web pages, including direct linking to the XPI files and using the InstallTrigger object. Extension and web authors are encouraged to use the [InstallTrigger method](https://developer.mozilla.org/en-US/en/Installing_Extensions_and_Themes_From_Web_Pages) to install XPIs, as it provides the best experience to users.

#### Registering Extensions in the Windows RegistrySection
On Windows, information about extensions can be added to the registry, and the extensions will automatically be picked up the next time the applications starts. This allows application installers to easily add integration hooks as extensions. See [Adding Extensions using the Windows Registry](https://developer.mozilla.org/en-US/en/Adding_Extensions_using_the_Windows_Registry) for more information.