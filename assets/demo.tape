# team-foundry demo — rendered with vhs (https://github.com/charmbracelet/vhs)
# Reproduce: run `vhs assets/demo.tape` from an empty scratch directory,
# then move demo.gif into assets/. Keep the npx cache warm first so the
# recording shows the tool, not the download.

Output demo.gif

Set FontSize 15
Set Width 1000
Set Height 620
Set Padding 12
Set TypingSpeed 40ms
Set Theme "Catppuccin Mocha"

Type "npx -y create-team-foundry playground"
Enter
Sleep 8s

Type "cd team-foundry-playground && npx -y create-team-foundry doctor"
Enter
Sleep 7s

Sleep 4s
