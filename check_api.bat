@echo off
chcp 65001 > nul
echo Gemini API 接続確認ツールを起動中...
python api_check.py
pause