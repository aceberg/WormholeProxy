
var reply_click = function()
{
    console.log("Button clicked, id "+this.id+", text"+this.innerHTML);

    switch (this.id) {
      case "Default":
        console.log("Default mode");
        enableProxy();
        break;
      case "All":
        console.log("Proxy All mode");
        allProxy();
        break;
      case "Disable":
        console.log("Disable mode");
        disableProxy();
        break;
      case "Options":
        console.log("Options page");
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

function disableProxy() {
  browser.browserAction.setIcon({
    path: {
      32: "../icons/wormhole3.png",
    },
  });
  
  browser.runtime.sendMessage({
    workMode: -1,
  });
}

function enableProxy() {
  browser.browserAction.setIcon({
    path: {
      32: "../icons/wormhole.png",
    },
  });

  browser.runtime.sendMessage({
    workMode: 0,
  });
}

function allProxy() {
  browser.browserAction.setIcon({
    path: {
      32: "../icons/wormhole1.png",
    },
  });

  browser.runtime.sendMessage({
    workMode: 1,
  });
}