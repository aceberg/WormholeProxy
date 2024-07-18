
browser.storage.sync.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  };
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  };

  const today = new Date().toLocaleDateString('en-CA');

  // Export Hosts
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyHosts));
  const hExport = document.getElementById('hosts-export');
  hExport.setAttribute("href",     dataStr     );
  hExport.setAttribute("download", "WormholeProxy-hosts-"+today+".json");

  // Export Servers
  const dataStr1 = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proxyServers));
  const hExport1 = document.getElementById('servers-export');
  hExport1.setAttribute("href",     dataStr1    );
  hExport1.setAttribute("download", "WormholeProxy-servers-"+today+".json");

  // Export Ignore
  const dataStr2 = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ignoreHosts));
  const hExport2 = document.getElementById('ignore-export');
  hExport2.setAttribute("href",     dataStr2    );
  hExport2.setAttribute("download", "WormholeProxy-ignore-"+today+".json");
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

// Import Ignore
document.getElementById('ignore-import').addEventListener('click', () => {
  const fileInput = document.getElementById('ignore-file');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      
        const ignoreHosts = JSON.parse(event.target.result);
        saveIgnoreHosts(ignoreHosts);
         
    };
    reader.readAsText(file);
  }
});