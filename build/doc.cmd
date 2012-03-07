@echo off
set PROJECT_DIR="%~dp0.."
set JSDOC_DIR="%~dp0jsdoc-toolkit"
java -Djsdoc.dir=%JSDOC_DIR% -jar %JSDOC_DIR%\jsrun.jar %JSDOC_DIR%\app\run.js -a -t=%JSDOC_DIR%\templates\jsdoc -r=4 -d=%PROJECT_DIR%/doc/api %PROJECT_DIR%/js/src > %PROJECT_DIR%\logs\doc.log
type %PROJECT_DIR%\logs\doc.log