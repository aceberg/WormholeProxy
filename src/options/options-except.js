let exHosts = [];


// Get local exHosts
browser.storage.sync.get(data => {
  if (data.exHosts) {
    exHosts = data.exHosts;
  }

  // Show on options page
  displayExHosts(exHosts);

  // Listen to click on delete button
  const buttons = document.querySelectorAll(".ex-del-btn");
  for (let b of buttons) {
    b.addEventListener("click", async (event) => {
      const i = b.getAttribute("name");
      
      // Remove item
      exHosts.splice(i-1, 1);
      saveExHosts(exHosts);
    });
  }
});

// Listen to click on sort button
const sortExBtn = document.getElementById("sortExBtn");
sortExBtn.addEventListener("click", async (event) => {
  
  exHosts.sort((a, b) => a.name.localeCompare(b.name));

  saveExHosts(exHosts);
});

// Add host to exHosts
const formEx = document.getElementById("newHostEx");
formEx.addEventListener("submit", async (event) => {
  const formData = new FormData(formEx);
  let hostname = formData.get('host');
  let proxy = formData.get('proxy');
  const hostURL = URL.parse(hostname);

  if (hostURL != null) {
    hostname = hostURL.hostname;
  }
  
  if (hostname != '') {
    hostname = hostname.replace('www.','');
    exHosts.push({name: hostname, proxy: proxy,});
    saveExHosts(exHosts);
  }
});

function saveExHosts(exHosts) {
  browser.storage.sync.set({
    exHosts: exHosts
  });

  // Update page
  location.reload();
};

function displayExHosts(exHosts) {
  const tbody = document.getElementById('exList');
  const template = document.querySelector("#exTemplate");
  
  let clone, td, a, b;

  let i = 0;
  for (let host of exHosts){
      i = i + 1;
  
      clone = template.content.cloneNode(true);
      td = clone.querySelectorAll("td");

      td[0].textContent = i+'.';
      a = td[1].querySelectorAll("a")[0];
      a.href = `http://${host.name}`;
      a.textContent = host.name;
      td[2].textContent = host.proxy;
      b = td[3].querySelectorAll("button")[0];
      b.name = i;

      tbody.appendChild(clone);
  }
};