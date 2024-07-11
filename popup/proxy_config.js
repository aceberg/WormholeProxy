
var reply_click = function()
{
    console.log("Button clicked, id "+this.id+", text"+this.innerHTML);

    switch (this.id) {
      case "Default":
        console.log("Default func");
        break;
      case "All":
        console.log("All func");
        break;
      case "Disable":
        console.log("Disable func");
        break;
      case "Options":
        console.log("Options func");
        openOptionsPage();
    }
}

document.getElementById('Default').onclick = reply_click;
document.getElementById('All').onclick = reply_click;
document.getElementById('Disable').onclick = reply_click;
document.getElementById('Options').onclick = reply_click;

function openOptionsPage() {
  let createData = {
    url: "../options/options.html"
  };
  browser.tabs.create(createData);
}