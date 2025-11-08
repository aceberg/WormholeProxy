let proxyServers = [];
let proxyHosts = [];
let ignoreHosts = [];
let exHosts = [];
let mainServer = {};
let workMode = 0;

browser.storage.sync.get(data => {
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  };
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.ignoreHosts) {
    ignoreHosts = data.ignoreHosts;
  };
  if (data.exHosts) {
    exHosts = data.exHosts;
  };
});

browser.storage.local.get(data => {
  if (data.workMode) {
    workMode = data.workMode;
  };
  if (data.mainServer) {
    mainServer = data.mainServer;
  };
});

// Listen for changes in local storage
browser.storage.local.onChanged.addListener(changeData => {
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

  if (workMode == -1) {
    return {type: "direct"};
  }

  const host = inExList(hostname);
  if (host !== null) {
    const serv = getProxyByName(host.proxy);
    if (serv !== null) {
      browser.browserAction.setBadgeBackgroundColor({ color: serv.color });
      browser.browserAction.setBadgeText({text: serv.name});

      console.log(`Proxying: ${url.hostname} through ${serv.name}`);
      return {type: serv.type, host: serv.host, port: serv.port, proxyDNS: serv.proxyDNS, username: serv.username, password: serv.password};
    }
  }

  if (mainServer.host != undefined) {
    if (inProxyList(hostname) || (workMode == 1 && !inIgnoreList(hostname))) {

      browser.browserAction.setBadgeBackgroundColor({ color: mainServer.color });
      browser.browserAction.setBadgeText({text: mainServer.name});

      console.log(`Proxying: ${url.hostname} through ${mainServer.name}`);
      return {type: mainServer.type, host: mainServer.host, port: mainServer.port, proxyDNS: mainServer.proxyDNS, username: mainServer.username, password: mainServer.password}; // proxy.ProxyInfo
    } else {
      browser.browserAction.setBadgeText({text: ""});
    }
  };

  return {type: "direct"};
}

browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function inProxyList(hostname) {

  for (let host of proxyHosts) {
    if (hostname == host || hostname.includes('.'+host)) {
      return true
    }
  }
  return false
};

function inIgnoreList(hostname) {

  for (let host of ignoreHosts) {
    if (hostname == host || hostname.includes('.'+host)) {
      return true
    }
  }
  return false
};

function inExList(hostname) {

  for (let host of exHosts) {
    if (hostname == host.name || hostname.includes('.'+host.name)) {
      return host;
    }
  }
  return null;
};

function getProxyByName(name) {

  for (let s of proxyServers) {
    if (s.name === name) {
      return s;
    }
  }

  return null;
}