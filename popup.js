document.addEventListener("DOMContentLoaded", () => {
  // Seçilen metni yükle
  chrome.storage.local.get("selectedText", (data) => {
    const text = data.selectedText || "(no text)";
    document.getElementById("originalText").textContent = "Orijinal Metin: " + text;
    adjustPopupSize(text.length);
  });

  // Çevir butonuna sol tıklama (doğrudan çevir)
  document.getElementById("translateBtn").addEventListener("click", async () => {
    const originalText = document.getElementById("originalText").textContent.replace("Orijinal Metin: ", "");
    const fromLang = document.getElementById("fromLang").value;
    const toLang = document.getElementById("toLang").value;

    if (originalText === "(no text)" || originalText.trim() === "") {
      alert("Lütfen çevrilecek metin seçin.");
      return;
    }

    // UTF-8 uyumlu gerçek çeviri
    const translatedText = await translateText(originalText, fromLang, toLang);
    document.getElementById("translatedText").value = translatedText;
    adjustPopupSize(translatedText.length);
  });

  // Çevir butonuna sağ tıklama (bağlam menüsü)
  const contextMenu = document.getElementById("contextMenu");
  document.getElementById("translateBtn").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    contextMenu.style.display = "block";
    contextMenu.style.left = `${rect.left + window.scrollX}px`; // Sayfanın kaydırma pozisyonunu ekle
    contextMenu.style.top = `${rect.bottom + scrollY}px`; // Butonun altına yerleştir

    // Menü içeriğini temizle ve yeniden oluştur
    contextMenu.innerHTML = "";
    const originalText = document.getElementById("originalText").textContent.replace("Orijinal Metin: ", "");
    if (originalText !== "(no text)" && originalText.trim() !== "") {
      const menuItem = document.createElement("div");
      menuItem.className = "context-menu-item";
      menuItem.textContent = "Google Translate’e Yönlendir";
      menuItem.addEventListener("click", () => {
        const fromLang = document.getElementById("fromLang").value;
        const toLang = document.getElementById("toLang").value;
        const url = `https://translate.google.com/?sl=${fromLang}&tl=${toLang}&text=${encodeURIComponent(originalText)}&op=translate`;
        console.log("Yönlendirme URL:", url);
        chrome.tabs.create({ url: url, active: true }, (tab) => {
          if (chrome.runtime.lastError) {
            console.error("Tab oluşturma hatası:", chrome.runtime.lastError);
          } else {
            console.log("Sekme başarıyla açıldı:", tab);
          }
          contextMenu.style.display = "none"; // Menüyü kapat
        });
      });
      contextMenu.appendChild(menuItem);
    } else {
      const menuItem = document.createElement("div");
      menuItem.className = "context-menu-item";
      menuItem.textContent = "Metin Seçilmedi";
      menuItem.style.cursor = "default";
      menuItem.style.color = "#888";
      contextMenu.appendChild(menuItem);
    }

    // Menü dışına tıklayınca kapanma
    document.addEventListener("click", () => {
      contextMenu.style.display = "none";
    }, { once: true });
  });

  // Sayfa yüklendiğinde menüyü gizle
  contextMenu.style.display = "none";
});

// Dinamik boyut ayarı
function adjustPopupSize(textLength) {
  const minWidth = 350; // Minimum genişlik
  const maxWidth = 600;
  const minHeight = 300; // Minimum yükseklik
  const maxHeight = 800;
  const baseWidth = minWidth + Math.min(250, textLength * 0.5); // Maksimum 250px ekleme
  const baseHeight = minHeight + Math.min(100, textLength * 0.3); // Maksimum 100px ekleme
  const width = Math.min(maxWidth, baseWidth);
  const height = Math.min(maxHeight, baseHeight);
  document.body.style.width = `${width}px`;
  document.body.style.height = `${height}px`;
}

// UTF-8 uyumlu gerçek çeviri (MyMemory Translated API)
async function translateText(text, fromLang, toLang) {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
    if (!response.ok) {
      throw new Error(`API yanıtı başarısız: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    } else {
      throw new Error("Çeviri metni alınamadı.");
    }
  } catch (error) {
    console.error("Çeviri hatası:", error.message);
    return `Çeviri yapılamadı. ${error.message}. Alternatif olarak 'Çevir' butonuna sağ tıklayarak 'Google Translate’e Yönlendir' seçeneğini kullanabilirsiniz.`;
  }
}