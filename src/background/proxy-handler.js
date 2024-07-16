
let proxyHosts = [];
let mainServer = {};
let workMode = 0;

browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.mainServer) {
    mainServer = data.mainServer;
  };
  if (data.workMode) {
    workMode = data.workMode;
  };
});

// Listen for changes in local storage
browser.storage.onChanged.addListener(changeData => {
  if (changeData.proxyHosts) {
    proxyHosts = changeData.proxyHosts.newValue;
  }
  if (changeData.mainServer) {
    mainServer = changeData.mainServer.newValue;
  }
  if (changeData.workMode) {
    workMode = changeData.workMode.newValue;
  }
});

// Listen for any URL request
browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});

function handleProxyRequest(requestInfo) {

  const url = new URL(requestInfo.url);

  if (((proxyHosts.indexOf(url.hostname) != -1) && (workMode != -1)) || (workMode == 1)) {

    browser.browserAction.setBadgeBackgroundColor({ color: mainServer.color });
    browser.browserAction.setBadgeText({text: mainServer.name});

    console.log(`Proxying: ${url.hostname} through ${mainServer.name}`);
    return {type: mainServer.type, host: mainServer.host, port: mainServer.port}; // proxy.ProxyInfo
  } else {
    browser.browserAction.setBadgeText({text: ""});
  }

  return {type: "direct"};
}

browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});



