let proxyHosts = ["example.com", "example.org", "2ip.ru"];
// let proxyHosts = [];

browser.storage.local.get(data => {
  if (data.proxyHosts) {
    proxyHosts = data.proxyHosts;
  }

  displayProxyHosts(proxyHosts);
});

const form = document.getElementById("newHost");
form.addEventListener("submit", async (event) => {
  const formData = new FormData(form);
  let host = formData.get('host');

  proxyHosts.push(host);

  // console.log("HOST:", proxyHosts);

  browser.storage.local.set({
    proxyHosts: proxyHosts
  });
});

function createHTML(host, i) {
    
  let html = `
    <tr>
      <td style="opacity: 45%;">${i}.</td>
      <td>${host}</td>
      <td>
      <div class="del-btn">
        <img value="${host}" class="icon-button" src="../icons/x-square.svg"></img>
      </div>
      </td>
    </tr>`;
  
  return html;
};

function displayProxyHosts(proxyHosts) {
  document.getElementById('proxyList').innerHTML = "";

  console.log("PH:", proxyHosts);

  let i = 0;
  for (let host of proxyHosts){
      i = i + 1;
      html = createHTML(host, i);
      document.getElementById('proxyList').insertAdjacentHTML('beforeend', html);
  }
};