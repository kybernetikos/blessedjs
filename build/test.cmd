@echo off
set CHROMEPATH="%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe"

java -jar "%~dp0jstestdriver\JsTestDriver-1.3.4.b.jar" --port 42443 --browser %CHROMEPATH% --config "%~dp0..\jsTestDriver.conf" --testOutput "%~dp0..\doc\testresults" --tests all
set RETURNCODE=%ERRORLEVEL%
echo %RETURNCODE%
exit /B %RETURNCODE%