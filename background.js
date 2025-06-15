chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["gemini_apiKey"],(result)=>{
        if(!result.gemini_apiKey){
            chrome.tabs.create({url: "options.html"});
        }
    })
})