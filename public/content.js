window.location.href.includes("youtube.com")&&setTimeout((()=>{const e=(document.body.innerText||"").includes("Genius");console.log("String detected:",e),e&&function(){let e=document.getElementById("popup-root");e||(e=document.createElement("div"),e.id="popup-root",document.body.appendChild(e),e.style.position="fixed",e.style.top="0",e.style.right="0",e.style.zIndex="9999",e.style.backgroundColor="rgba(255, 255, 255, 0.8)"),chrome.runtime.sendMessage({action:"injectPopup"})}()}),5e3);