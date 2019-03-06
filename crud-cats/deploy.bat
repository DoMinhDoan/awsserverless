@echo off

set AWS_ACCESS_KEY_ID=%1
set AWS_SECRET_ACCESS_KEY=%2

REM npm install -g serverless
call npm install
call sls deploy
