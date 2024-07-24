let enableBackup = 0;
let counter = 1;

const oneDay = 1000 * 60 * 60 * 24;
// const oneDay = 1000 * 60; // One minute

setInterval(mainLoop, oneDay);

function mainLoop() {

  // console.log("BKP LOOP, enableBkp =", enableBackup, "counter =", counter);

  browser.storage.local.get(data1 => {
    if (data1.enableBackup) {
      enableBackup = data1.enableBackup;
    };

    if (enableBackup > 0) {
      if (counter < enableBackup) {
        counter = counter + 1;
      } else {
        counter = 1;
        console.log("Generating backup once in "+enableBackup+" days");
        generateBackup();
      }
    }
  });
};

function generateBackup() {
    browser.storage.sync.get(data => {
      if (data.proxyHosts) {
        proxyHosts = data.proxyHosts;
      };
      if (data.proxyServers) {
        proxyServers = data.proxyServers;
      };
      if (data.ignoreHosts) {
        ignoreHosts = data.ignoreHosts;
      };
      
      const all = {hosts: proxyHosts, servers: proxyServers, ignore: ignoreHosts};
    
      const blob = new Blob([JSON.stringify(all)], { type: "application/json" });
      const jsonObjectUrl = URL.createObjectURL(blob);

      downloadAll(jsonObjectUrl);        
    });
};

function downloadAll(link) {

  const today = new Date().toLocaleDateString('en-CA');

  browser.downloads.download({
    url: link,
    filename: "WormholeProxy-all-"+today+".json",
    conflictAction: "uniquify",
  });
};