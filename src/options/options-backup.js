let enableBackup = 0;

browser.storage.local.get(data => {
    if (data.enableBackup) {
      enableBackup = data.enableBackup;
    };

    const bkpDays = document.getElementById("bkp-days");

    // Set current value
    bkpDays.value = enableBackup;

    // Listen to change
    bkpDays.addEventListener("change", () => {

        enableBackup = bkpDays.value;

        console.log("Changed backup interval to "+enableBackup+" days");

        browser.storage.local.set({
            enableBackup: enableBackup
        });
    });
});