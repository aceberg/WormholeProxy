// let proxyHosts = [];

browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  };

  console.log("PH EXPORT", proxyHosts);
  console.log("PS EXPORT", proxyServers);

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyHosts));
  let hExport = document.getElementById('hosts-export');
  hExport.setAttribute("href",     dataStr     );
  hExport.setAttribute("download", "WormholeProxy-hosts.json");


  let dataStr1 = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyServers));
  let hExport1 = document.getElementById('servers-export');
  hExport1.setAttribute("href",     dataStr1    );
  hExport1.setAttribute("download", "WormholeProxy-servers.json");
});