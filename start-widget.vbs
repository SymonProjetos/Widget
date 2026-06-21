Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "d:\GitHub\Projetos\Widget"
WshShell.Run "cmd /c npm start", 0, False
