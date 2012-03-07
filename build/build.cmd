@echo off
echo Documenting...
call "%~dp0doc.cmd"
if %ERRORLEVEL% NEQ 0 exit /B %ERRORLEVEL%
echo.
echo Compiling...
call "%~dp0compile.cmd"
if %ERRORLEVEL% NEQ 0 exit /B %ERRORLEVEL%
echo.
echo Testing...
call "%~dp0test.cmd"
if %ERRORLEVEL% NEQ 0 exit /B %ERRORLEVEL%