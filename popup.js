// document.getElementById("summarize").addEventListener("click", ()=>{
//     const resultDiv =document.getElementById("result");

//     // result.textContent = "Extracting text..."

//     //last
//     const summaryType = document.getElementById("summary-type").value;
//     resultDiv.innerHTML = `<div class="loader"></div>`;

//     //Get the user's API Key

//     chrome.storage.sync.get(['geminiApiKey'], ({geminiApiKey})=>{
//         if(!geminiApiKey){
//             resultDiv.textContent = "No API key is set.Click the gear icon to add one";
//             return
//         }
//     })

//     //Ask content.js for the page text

//     chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//     chrome.tabs.sendMessage(
//         tab.id,
//         { type: "GET_ARTICLE_TEXT" },
//         async({text}) => {
//             if(!text){
//                 resultDiv.textContent = "Couldn't extract text from this page.";
//                 return;
//             }
//             //Send text to Gemini

//             try {
//                 const summary =await getGeminiSummary(text,summaryType,geminiApiKey);
//                 resultDiv.textContent = summary;

//             } catch (error) {
//                 resultDiv.textContent = "Gemini Error : "+ error.message;
//             }
//         }
//     );
// });


// async function getGeminiSummary(Rawtext,summaryType,geminiApiKey){
//     const max = 20000;
//     const text = Rawtext.lenght> max ? Rawtext.slice(0,max)+"..." : Rawtext ;


//     const promptMap = {
//         brief: `Summarize in 2-3 sentences : \n\n${text}`,
//         detailed: `Give a detailed summary: \n\n${text}`,
//         bullets: `Summarize in 5-7 bullet points (start each line with "- "): \n\n${text}` 
//     }


//     const prompt = promptMap[summaryType] || promptMap.brief;

//     const res = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,{
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body:JSON.stringify({
//                 contents: [{parts: [{text:prompt}]}],
//                 generationConfig: {temperature: 0.2},
//             }),
//         }
//     );

//     if(!res.ok){
//         const {error} = await res.json();
//         throw new Error(error?.message || "Request failed");
//     }

//     const data = await res.json();
//     return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary";
// }



        //help to know the active tab
    // chrome.tabs.query({active:true, currentWindow: true}, ([tab])=>{
    //     chrome.tabs.sendMessage(
    //         tab.id,
    //         {type:"GET_ARTICLE_TEXT"},
    //         ({text})=>{
    //             result.textContent = text ? text.slice(0,300) + "..." : "No Article text Found"
    //         }
    //     )
    // })

// });


document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");

    const summaryType = document.getElementById("summary-type").value;
    resultDiv.innerHTML = `<div class="loader"></div>`;

    // Get the user's API Key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            resultDiv.textContent = "No API key is set. Click the gear icon to add one.";
            return;
        }

        // Ask content.js for the page text
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(
                tab.id,
                { type: "GET_ARTICLE_TEXT" },
                async ({ text }) => {
                    if (!text) {
                        resultDiv.textContent = "Couldn't extract text from this page.";
                        return;
                    }
                    // Send text to Gemini
                    try {
                        const summary = await getGeminiSummary(text, summaryType, geminiApiKey);
                        resultDiv.textContent = summary;
                    } catch (error) {
                        resultDiv.textContent = "Gemini Error: " + error.message;
                    }
                }
            );
        });
    });
});

async function getGeminiSummary(Rawtext, summaryType, geminiApiKey) {
    const max = 20000;
    const text = Rawtext.length > max ? Rawtext.slice(0, max) + "..." : Rawtext;

    const promptMap = {
        brief: `Summarize in 2-3 sentences : \n\n${text}`,
        detailed: `Give a detailed summary: \n\n${text}`,
        bullets: `Summarize in 5-7 bullet points (start each line with "- "): \n\n${text}`
    };

    const prompt = promptMap[summaryType] || promptMap.brief;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 },
            }),
        }
    );

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error?.message || "Request failed");
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary";
}




document.getElementById("copy-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;

  if (summaryText && summaryText.trim() !== "") {
    navigator.clipboard
      .writeText(summaryText)
      .then(() => {
        const copyBtn = document.getElementById("copy-btn");
        const originalText = copyBtn.innerText;

        copyBtn.innerText = "Copied!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
});
