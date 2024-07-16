
browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  };

  const today = new Date().toLocaleDateString('en-CA');

  // Export Hosts
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyHosts));
  let hExport = document.getElementById('hosts-export');
  hExport.setAttribute("href",     dataStr     );
  hExport.setAttribute("download", "WormholeProxy-hosts-"+today+".json");

  // Export Servers
  let dataStr1 = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyServers));
  let hExport1 = document.getElementById('servers-export');
  hExport1.setAttribute("href",     dataStr1    );
  hExport1.setAttribute("download", "WormholeProxy-servers-"+today+".json");
});

// Import Hosts
document.getElementById('hosts-import').addEventListener('click', () => {
  const fileInput = document.getElementById('hosts-file');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      
        const proxyHosts = JSON.parse(event.target.result);
        saveProxyHosts(proxyHosts);
         
    };
    reader.readAsText(file);
  }
});

// Import Servers
document.getElementById('servers-import').addEventListener('click', () => {
  const fileInput = document.getElementById('servers-file');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      
        const proxyServers = JSON.parse(event.target.result);
        saveProxyServers(proxyServers);
         
    };
    reader.readAsText(file);
  }
});