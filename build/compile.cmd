@echo off
java -jar "%~dp0closure-compiler\compiler.jar" ^
	--js "%~dp0..\js\src\blessed\blessed.js" ^
	--compilation_level ADVANCED_OPTIMIZATIONS ^
	--js_output_file "%~dp0..\js\compiled\blessed.js" ^
	--language_in ECMASCRIPT5_STRICT ^
	2> "%~dp0..\logs\compile.log"
set RETURNCODE=%ERRORLEVEL%
type "%~dp0..\logs\compile.log"
exit /B %RETURNCODE%