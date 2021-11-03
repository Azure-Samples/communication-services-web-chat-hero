---
page_type: sample
languages:
- javascript
- nodejs
- csharp
products:
- azure
- azure-communication-services
---

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcommunication-services-web-chat-hero%2Fmain%2Fdeploy%2Fazuredeploy.json)

# Group Chat Sample

This is a sample application to show how the Chat Web SDK can be used to build a single threaded chat experience.
The client-side application is a React based user interface which uses Redux for handling complex state while leveraging Microsoft Fluent UI.
Powering this front-end is a C# web application powered by ASP.NET Core to connect this application with Azure Communication Services.

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/en-us/azure/communication-services/samples/chat-hero-sample).

![Homepage](./Media/homepage-sample-chat.png)

## ❤️ Feedback
We appreciate your feedback and energy helping us improve our services. [Please let us know if you are satisfied with ACS through this survey](https://microsoft.qualtrics.com/jfe/form/SV_5dtYL81xwHnUVue). 

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- [Visual Studio (2017 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this quickstart.

## Code structure

- ./Chat/ClientApp: frontend client
  - ./Chat/ClientApp/src
    - ./Chat/ClientApp/src/Components : React components to help build the client app chat experience
    - ./Chat/ClientApp/src/Containers : Connects the redux functionality to the React components
    - ./Chat/ClientApp/src/Core : Containers a redux wrapper around the Chat SDK
    - ./Chat/ClientApp/src/index.js : Entry point for the client app
- ./Chat/Controllers : Server app core logic for client app to get a token to use with the Azure Communication Services Web Chat SDK
- ./Chat/Program.cs : Server app program logic
- ./Chat/Startup.cs: Server app startup logic

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure-Samples/communication-services-web-chat-hero.git`
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource)
4. Once you get the `Connection String`, Add the connection string to the **Chat/appsettings.json** file found under the Chat folder. Input your connection string in the variable: `ResourceConnectionString`.

## Local run

1. Go to the Chat folder and open the `Chat.csproj` solution in Visual Studio
2. Run the project. The browser will open at localhost:5000.
3. Click on "Add People" -> "Add person from Teams"
![Add Teams User](./Media/add-teams-user-sample-chat.png)
4. Insert the Teams user's id, which is in Guid format. You can obtain the user id from the Admin Portal, via Remote Powershell or via the [Graph APIs](https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http)
![Add Teams ID](./Media/add-teams-id-sample-chat.png)

### Troubleshooting

1. Solution doesn\'t build, it throws errors during NPM installation/build

    Clean/rebuild the C# solution

## Publish to Azure

1. Right click the `Chat` project and select Publish
2. Create a new publish profile and select your app name, Azure subscription, resource group and etc.
3. Before publish, add your connection string with `Edit App Service Settings`, and fill in `ResourceConnectionString` as key and connection string (copy from appsettings.json) as value

## Known Limitations

This application sample is meant to be built off of. In it's current form, it has some limitations:

- The ACS user that creates the thread is a 'Super User'. It's presence is hidden within the Hero app, but it will be part of the thread roster. As such, the user will be visible in the Teams client as a regular ACS user.
- The Display Name of the Teams participants is based off of the user's id, and is not the real name from Active Directory. The real user name of the Teams user can be retrieved from AD via the [Graph APIs](https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http) and set as part of the roster update operation.
- 'Edit Message' and 'Delete Message' buttons are not provided by this application's interface

## Building off of the sample

If you would like to build off of this sample to add chat capabilities to your own awesome application, keep a few things in mind:

- The sample serves a Single Page Application. This has a few implications.
  - By default, the served app cannot be embedded in another frame (e.g. as a web widget). See ./Chat/Startup.cs for details on how to enable embedding.
  - By default, the backend disables Cross-Origin Resource Sharing (CORS). If you'd like to serve the backend APIs from a different domain than the static content, you must enable (restricted) CORS. This can be done by configuring a middleware in the backend in ./Chat/Startup.cs, or by configuring your server framework to modify HTTP response headers.

## Additional Reading

- [Azure Communication Chat SDK](https://docs.microsoft.com/en-us/azure/communication-services/concepts/chat/sdk-features) - To learn more about the chat web sdk
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1) - Framework for building web applications
