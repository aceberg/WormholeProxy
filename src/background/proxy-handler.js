
let proxyHosts = [];
let ignoreHosts = [];
let mainServer = {};
let workMode = 0;

browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.ignoreHosts) {
    ignoreHosts = data.ignoreHosts;
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
  if (changeData.ignoreHosts) {
    ignoreHosts = changeData.ignoreHosts.newValue;
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
  const hostname = url.hostname;

  if ((inProxyList(hostname) && (workMode != -1)) || (workMode == 1 && !inIgnoreList(hostname))) {

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

function inProxyList(hostname) {

  for (let host of proxyHosts) {
    if (hostname == host || hostname.includes('.'+host)) {
      // console.log(hostname, true);
      return true
    }
  }
  // console.log(hostname, false);
  return false
};

function inIgnoreList(hostname) {

  for (let host of ignoreHosts) {
    if (hostname == host || hostname.includes('.'+host)) {
      // console.log(hostname, true);
      return true
    }
  }
  // console.log(hostname, false);
  return false
};