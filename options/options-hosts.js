// let proxyHosts = ["example.com", "example.org", "2ip.ru"];
let proxyHosts = [];


// Get local proxyHosts
browser.storage.local.get(data => {
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

  proxyHosts.push(host);

  saveProxyHosts(proxyHosts);
});

function saveProxyHosts(proxyHosts) {
  browser.storage.local.set({
    proxyHosts: proxyHosts
  });

  // Update page
  location.reload();
};

function displayProxyHosts(proxyHosts) {
  const pList = document.getElementById('proxyList');
  const html = pList.innerHTML;
  let finalOutput = '';

  // console.log("PH:", proxyHosts);

  let i = 0;
  for (let host of proxyHosts){
      i = i + 1;
      
      finalOutput = finalOutput + html.replaceAll('hostTemplate', host).replaceAll('iTemplate', i);
  }

  pList.innerHTML = finalOutput;
};