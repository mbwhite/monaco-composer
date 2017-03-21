# monaco-composer
Test bed for integrating the monaco, and language server for fabric composer; based from See https://github.com/fabric-composer/fabric-composer/issues/207 

# Plan 

- [x] Get the monaco editor up in a web page
- [x] Check syntax highlighting works with standard langugae etc JS
- [x] Intergated the JSON language per MS sample code (https://github.com/Microsoft/vscode-json-languageservice)
- [ ] Get the FabricComposer modelling language VSCode server (from MGK and in vscode repo)
- [ ] Can that be integrated

Language Server Protocol https://github.com/Microsoft/language-server-protocol

MS don't use the language server protocol for the Monoco examples - instead pull the actual core 'smarts' out of the module and 
put them into the Monaco plugin. 

API reference for the monaco editor languages: https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html
As an example of how MS produce a new language for Monaco: https://github.com/Microsoft/monaco-json

A VSCode plugin is split into the two parts, client and server. The client section does the colour syntax highlighting and the server part does the parsing of the code.

Adding a new language
https://github.com/Microsoft/monaco-languages

Notes on how the editor is structured
https://github.com/Microsoft/monaco-editor/issues/190


The go sample is not sufficiently mature or well documented to know how this is supposed to work - it is a derative of the MS CSS plugin and is not easy to follow. 

An alterantive project was documented: but the code to this is promised as being an open source project but has not yet been released.
https://typefox.io/how-to-embed-a-monaco-editor-in-a-browser-as-a-part-of-my-first-task-at-typefox  http://52.29.251.2/calcmonaco/


Take the CSS or JSON MS sample and produce a Composer variant of that - it will need to have it's own parsing logic for the syntax highlighting. The smarts of the VSCode plugin are currently really around the area of validation of the parsing is correct. 

Grammar parsing will be the tricky one as this takes place 'client' side and not server side.

