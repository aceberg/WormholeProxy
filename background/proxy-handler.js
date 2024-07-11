
let proxyHosts = ["example.com", "example.org", "2ip.ru"];
let pServer = {id: 1, type:"socks", host: "127.0.0.1", port: 1084};
let workMode = 0;


browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    proxyHosts: proxyHosts
  });
});


browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  }
});

browser.storage.local.get(data => {
  if (data.workMode) {
    workMode = data.workMode;
  }
});

browser.storage.onChanged.addListener(changeData => {
  proxyHosts = changeData.proxyHosts.newValue;
});


browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});



function handleProxyRequest(requestInfo) {

  const url = new URL(requestInfo.url);

  if (((proxyHosts.indexOf(url.hostname) != -1) && (workMode != -1)) || (workMode == 1)) {

    console.log(`Proxying: ${url.hostname}`);
    return {type: pServer.type, host: pServer.host, port: pServer.port}; // proxy.ProxyInfo
  }

  return {type: "direct"};
}

browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function handleMessage(request) {
  // console.log(`A content script sent a message: ${request.workMode}`);
  workMode = request.workMode;
}

browser.runtime.onMessage.addListener(handleMessage);



