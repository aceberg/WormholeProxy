const proxyHostsTextArea = document.querySelector("#proxy-hosts");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  let proxyHosts = proxyHostsTextArea.value.split("\n");
  browser.storage.local.set({
    proxyHosts
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  proxyHostsTextArea.value = restoredSettings.proxyHosts.join("\n");
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
proxyHostsTextArea.addEventListener("change", storeSettings);
