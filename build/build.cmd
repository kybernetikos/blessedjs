@echo off
set newline=^


set MODULE_LIST=blessed functional
set CHROMEPATH="%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe"
set PROJECT_DIR=%~dp0..

call :main
exit /B %ERRORLEVEL%

:files-in-module dir
	set RETURN=
	if "%1"=="" (
		exit /B 1
	)
	setlocal ENABLEDELAYEDEXPANSION 
	echo   Module %1
	for /F %%J in ('dir %PROJECT_DIR%\js\src\%1 /A:-D /B') do (set RETURN=!RETURN! "%PROJECT_DIR%\js\src\%1\%%J")
	endlocal & set RETURN=%RETURN%
exit /B 0

:compile files
	set files=%*
	java -jar "%PROJECT_DIR%\build\closure-compiler\compiler.jar" ^
		--js %files: = --js % ^
		--compilation_level ADVANCED_OPTIMIZATIONS ^
		--js_output_file "%PROJECT_DIR%\js\compiled\blessed.js" ^
		--language_in ECMASCRIPT5_STRICT ^
		2> "%~dp0..\logs\compile.log"
	set RETURNCODE=%ERRORLEVEL%
	type "%~dp0..\logs\compile.log"
exit /B %RETURNCODE%

:compile-modules
	set modules=%*
	echo Compiling modules %modules%...
	setlocal ENABLEDELAYEDEXPANSION 
	set files=
	for /F %%k in ("%modules: =!newline!%") do (
		call :files-in-module %%k
		set files=!files! !RETURN!
	)
	call :write-test-config %modules%
	call :compile %files:  = %
	endlocal & set RETURNCODE=%ERRORLEVEL%
exit /B %RETURNCODE%

:doc
	echo Doc...
	set JSDOC_DIR="%PROJECT_DIR%\build\jsdoc-toolkit"
	java -Djsdoc.dir=%JSDOC_DIR% -jar %JSDOC_DIR%\jsrun.jar %JSDOC_DIR%\app\run.js -a -t=%JSDOC_DIR%\templates\jsdoc -r=4 -d=%PROJECT_DIR%/doc/api %PROJECT_DIR%/js/src > %PROJECT_DIR%\logs\doc.log
	type %PROJECT_DIR%\logs\doc.log
exit /B 0

:write-test-config
	set modules=%*
	setlocal ENABLEDELAYEDEXPANSION
	echo server: http://localhost:42443!newline!!newline!load:!newline!  - jasmine-1.1.0/jasmine.js!newline!  - jasmine-1.1.0/JasmineAdapter.js!newline!  - ../js/compiled/blessed.js > %PROJECT_DIR%\build\jsTestDriver.conf
	for /F %%m in ("%modules: =!newline!%") do (
		echo   - ../js/test/%%m/*.js >> %PROJECT_DIR%\build\jsTestDriver.conf
	)
	endlocal
exit /B 0

:test
	echo Test...
	java -jar "%PROJECT_DIR%\build\jstestdriver\JsTestDriver-1.3.4.b.jar" --port 42443 --browser %CHROMEPATH% --config "%PROJECT_DIR%\build\jsTestDriver.conf" --testOutput "%PROJECT_DIR%\doc\testresults" --tests all
	set RETURNCODE=%ERRORLEVEL%
exit /B %RETURNCODE%

:main
	call :doc
	call :compile-modules %MODULE_LIST%
	if not ERRORLEVEL 1	call :test
exit /B %ERRORLEVEL%