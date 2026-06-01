const dialogName = document.getElementById("dialogName");
const dialogText = document.getElementById("dialogText");

function startDialogCutscene() {
  const dialogs = appState.config.dialog;
  let index = 0;

  function showDialog() {
    const item = dialogs[index];
    dialogName.textContent = item.name;
    dialogText.textContent = item.text;
    index++;

    if (index < dialogs.length) {
      const delay = index === 1 ? 4200 : 2300;
      setTimeout(showDialog, delay);
    }
  }

  setTimeout(showDialog, 900);
}
