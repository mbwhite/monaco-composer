# monaco-composer
Test bed for integrating the monaco, and language server for fabric composer

See https://github.com/fabric-composer/fabric-composer/issues/207 

# Plan 

- [ ] Get the monaco editor up in a web page
- [ ] Check syntax highlighting works with standard langugae etc JS
- [ ] Intergated the JSON language per MS sample code (https://github.com/Microsoft/vscode-json-languageservice)
- [ ] Get the FabricComposer modelling language VSCode server (from MGK and in vscode repo)
- [ ] Can that be integrated


 - Language Server Protocol https://github.com/Microsoft/language-server-protocol

MS don't use the language server protocol for the Monoco examples - instead pull the actual core 'smarts' out of the module and 
put them into the Monaco plugin

----

API reference.
https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html

https://github.com/Microsoft/monaco-json
 
----
The go sample is not sufficiently mature or well documented to know how this is supposed to work
Sounds like exactly what we would like to do. 

https://typefox.io/how-to-embed-a-monaco-editor-in-a-browser-as-a-part-of-my-first-task-at-typefox
http://52.29.251.2/calcmonaco/

Adding a new language
https://github.com/Microsoft/monaco-languages
