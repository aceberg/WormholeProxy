// let proxyHosts = ["example.com", "example.org", "2ip.ru"];
let proxyHosts = [];


// Get local proxyHosts
browser.storage.sync.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  }

  // Show on options page
  displayProxyHosts(proxyHosts);

  // Listen to click on delete button
  const buttons = document.querySelectorAll(".del-btn");
  for (let b of buttons) {
    b.addEventListener("click", async (event) => {
      const i = b.getAttribute("name");
      
      // Remove item
      proxyHosts.splice(i-1, 1);
      saveProxyHosts(proxyHosts);
    });
  }
});

// Listen to click on sort button
const sortBtn = document.getElementById("sortBtn");
sortBtn.addEventListener("click", async (event) => {
  
  proxyHosts.sort();

  saveProxyHosts(proxyHosts);
});

// Add host to proxyHosts
const form = document.getElementById("newHost");
form.addEventListener("submit", async (event) => {
  const formData = new FormData(form);
  let host = formData.get('host');
  const hostURL = URL.parse(host);

  if (hostURL != null) {
    host = hostURL.hostname;
  }
  
  if (host != '') {
    host = host.replace('www.','');
    proxyHosts.push(host);
    saveProxyHosts(proxyHosts);
  }
});

function saveProxyHosts(proxyHosts) {
  browser.storage.sync.set({
    proxyHosts: proxyHosts
  });

  // Update page
  location.reload();
};

function displayProxyHosts(proxyHosts) {
  const tbody = document.getElementById('proxyList');
  const template = document.querySelector("#hostTemplate");
  
  let clone, td, a, b;

  let i = 0;
  for (let host of proxyHosts){
      i = i + 1;
  
      clone = template.content.cloneNode(true);
      td = clone.querySelectorAll("td");

      td[0].textContent = i+'.';
      a = td[1].querySelectorAll("a")[0];
      a.href = `http://${host}`;
      a.textContent = host;
      b = td[2].querySelectorAll("button")[0];
      b.name = i;

      tbody.appendChild(clone);
  }
};