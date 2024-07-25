let enableBackup = 0;
let lastBackupDate;

let proxyServers = [];

// Listen for changes in sync storage
browser.storage.sync.onChanged.addListener(changeData => {
  if (changeData.proxyHosts) {
    proxyHosts = changeData.proxyHosts.newValue;
  }
  if (changeData.ignoreHosts) {
    ignoreHosts = changeData.ignoreHosts.newValue;
  }
  if (changeData.proxyServers) {
    proxyServers = changeData.proxyServers.newValue;
  }

  browser.storage.local.get(data1 => {
    if (data1.enableBackup) {
      enableBackup = data1.enableBackup;
    };
    if (data1.lastBackupDate) {
      lastBackupDate = data1.lastBackupDate;
    };
    // console.log("LAST BKP", lastBackupDate);

    if (enableBackup > 0 && enoughTimePassed(lastBackupDate, enableBackup)) {

      lastBackupDate = new Date();
      browser.storage.local.set({
        lastBackupDate: lastBackupDate
      });

      const all = {hosts: proxyHosts, servers: proxyServers, ignore: ignoreHosts};
      generateBackup(all);
    }
  });
});

function enoughTimePassed(lastDate, interval) {
  if (lastDate == undefined) {
    return true;
  } else {
    const days = (new Date() - lastDate)/ (1000 * 60 * 60 * 24);
    // console.log("DAYS", days);
    
    if (days > interval) {
      return true;
    }
  }

  return false;
}

function generateBackup(all) {

  const blob = new Blob([JSON.stringify(all)], { type: "application/json" });
  const jsonObjectUrl = URL.createObjectURL(blob);

  downloadAll(jsonObjectUrl);        
};

function downloadAll(link) {

  const today = new Date().toLocaleDateString('en-CA');
  const fname = "WormholeProxy-all-"+today+".json";

  console.log("Downloading backup file: ", fname);

  browser.downloads.download({
    url: link,
    filename: fname,
    conflictAction: "uniquify",
  });
};