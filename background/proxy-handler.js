
let proxyHosts = ["example.com", "example.org", "2ip.ru"];
let proxyServer = {id: 1, type:"socks", host: "127.0.0.1", port: 1084};
let workMode = 0;

browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.workMode) {
    workMode = data.workMode;
  };
});

browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});

function handleProxyRequest(requestInfo) {

  const url = new URL(requestInfo.url);

  if (((proxyHosts.indexOf(url.hostname) != -1) && (workMode != -1)) || (workMode == 1)) {

    browser.browserAction.setBadgeBackgroundColor({ color: "#4ce63e" });
    browser.browserAction.setBadgeText({text: "Proxy"});

    console.log(`Proxying: ${url.hostname}`);
    return {type: proxyServer.type, host: proxyServer.host, port: proxyServer.port}; // proxy.ProxyInfo
  } else {
    browser.browserAction.setBadgeText({text: ""});
  }

  return {type: "direct"};
}

browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function handleMessage(request) {
  workMode = request.workMode;
}

browser.runtime.onMessage.addListener(handleMessage);



