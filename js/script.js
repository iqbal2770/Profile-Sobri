const apiUrl = "/api/articles";

// ======================
// LOGIN CMS
// ======================

const loginForm = document.getElementById("login-form");
const loginPage = document.getElementById("login-page");
const cmsPage = document.getElementById("cms-page");
// ======================
// MAP LOCATION
// ======================

let myMap = null;

function initMap(){

    if(myMap) return;

    const mapElement = document.getElementById("map");

    if(!mapElement) return;

    navigator.geolocation.getCurrentPosition(

        function(position){

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            myMap = L.map("map").setView([lat, lng], 13);

            L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                    "&copy; OpenStreetMap Contributors"
                }
            ).addTo(myMap);

            L.marker([lat, lng])
                .addTo(myMap)
                .bindPopup("Lokasi Saya")
                .openPopup();

            setTimeout(() => {
                myMap.invalidateSize();
            }, 500);

        },

        function(error){

            console.log(error);

            alert(
                "Izinkan akses lokasi agar peta dapat ditampilkan."
            );

        }

    );

}
loginForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();

        if(response.ok && result.success){
            alert("Login berhasil!");
            loginPage.style.display = "none";
            cmsPage.style.display = "block";
            initMap();
        } else {
            alert(result.message || "Username atau password salah!");
        }
    } catch(err) {
        console.error("Login error:", err);
        alert("Terjadi kesalahan saat menghubungi server.");
    }

});

// ======================
// LOGOUT
// ======================

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function(){

    cmsPage.style.display = "none";
    loginPage.style.display = "flex";

});

// ======================
// CRUD ARTIKEL
// ======================

const articleForm = document.getElementById("article-form");
const articleList = document.getElementById("article-list");

let editId = null;

// LOAD DATA DARI DATABASE

async function loadArticles(){

    const response = await fetch(apiUrl);

    const articles = await response.json();

    let html = "";

    articles.forEach(article => {

        html += `
            <div class="article-card">

                <h3>${article.title}</h3>

                <p>${article.content}</p>

                <div class="article-actions">

                    <button onclick="editArticle(${article.id}, \`${article.title}\`, \`${article.content}\`)">
                        Edit
                    </button>

                    <button onclick="deleteArticle(${article.id})">
                        Hapus
                    </button>

                </div>

            </div>
        `;

    });

    articleList.innerHTML = html;

}

// CREATE + UPDATE

articleForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const title = document.getElementById("article-title").value;

    const content = document.getElementById("article-content").value;

    if(title === "" || content === ""){

        alert("Isi artikel terlebih dahulu!");

        return;
    }

    if(editId){

        await fetch(`${apiUrl}/${editId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                content
            })

        });

        alert("Artikel berhasil diupdate!");

        editId = null;

    } else {

        await fetch(apiUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                content
            })

        });

        alert("Artikel berhasil dipublish!");

    }

    articleForm.reset();

    loadArticles();

});

// DELETE

async function deleteArticle(id){

    const konfirmasi =
        confirm("Yakin ingin menghapus artikel ini?");

    if(!konfirmasi) return;

    await fetch(`${apiUrl}/${id}`, {

        method: "DELETE"

    });

    alert("Artikel berhasil dihapus!");

    loadArticles();

}

// EDIT

function editArticle(id, title, content){

    document.getElementById("article-title").value =
        title;

    document.getElementById("article-content").value =
        content;

    editId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// LOAD AWAL

loadArticles();

// ======================
// FORM CONTACT
// ======================

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", function(event){

    event.preventDefault();

    const name = this.querySelector('input[type="text"]').value;

    const email = this.querySelector('input[type="email"]').value;

    const message = this.querySelector('textarea').value;

    if(name === "" || email === "" || message === ""){

        alert("Isi nama, email, dan pertanyaan!");

    } else {

        alert(`Halo ${name}, pesan Anda berhasil dikirim!`);

        this.reset();

    }

});

// ======================
// EFFECT TITLE
// ======================

const mainTitle = document.getElementById("main-title");

mainTitle.addEventListener("mouseover", () => {

    mainTitle.style.color = "#38bdf8";
    mainTitle.style.transition = "0.3s";
    mainTitle.style.cursor = "pointer";

});

mainTitle.addEventListener("mouseout", () => {

    mainTitle.style.color = "white";

});


// ======================
// SERVICE WORKER
// ======================

// ======================
// SERVICE WORKER
// ======================

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {

                console.log(
                    "Service Worker berhasil didaftarkan"
                );

            })
            .catch(error => {

                console.log(
                    "Service Worker gagal:",
                    error
                );

            });

    });

}

// ======================
// PUSH NOTIFICATION
// ======================

// ======================
// PUSH NOTIFICATION
// ======================

async function showNotification(){

    if(!("Notification" in window)) return;

    const permission =
        await Notification.requestPermission();

    if(permission === "granted"){

        new Notification(
            "CMS Website Aktif",
            {
                body:
                "Selamat datang di CMS Sobri Iqbal Sutiyono",
                icon:"images/iqbal.jpeg"
            }
        );

    }

}

window.addEventListener(
    "load",
    showNotification
);

// ======================
// PWA INSTALLATION
// ======================

let deferredPrompt;
const installBtn = document.getElementById("pwa-install-btn");
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// Tampilkan tombol instalasi secara default jika dibuka di browser biasa (bukan mode standalone PWA)
if (installBtn) {
    if (!isStandalone) {
        installBtn.style.display = "block";
    } else {
        installBtn.style.display = "none";
    }
}

window.addEventListener("beforeinstallprompt", (e) => {
    // Cegah mini-infobar default muncul di mobile
    e.preventDefault();
    deferredPrompt = e;
    // Pastikan tombol tampil
    if (installBtn) {
        installBtn.style.display = "block";
    }
});

if (installBtn) {
    installBtn.addEventListener("click", async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice PWA: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = "none";
        } else {
            // Tampilkan panduan cara instal manual jika beforeinstallprompt belum terpicu (misal di iOS, Incognito, dll)
            alert(
                "Untuk memasang aplikasi ini ke Desktop/Layar Utama secara cepat:\n\n" +
                "1. Di Laptop/PC: Klik ikon 'Instal' (gambar monitor dengan panah ke bawah) di bagian kanan kolom URL (Address Bar) browser Chrome/Edge Anda.\n\n" +
                "2. Di HP Android (Chrome): Klik tombol menu (titik tiga) di pojok kanan atas browser, lalu pilih 'Instal Aplikasi' atau 'Tambahkan ke Layar Utama'.\n\n" +
                "3. Di iPhone/iOS (Safari): Klik tombol 'Share' (ikon persegi dengan panah ke atas) di bagian bawah browser Safari, lalu pilih 'Add to Home Screen'."
            );
        }
    });
}

window.addEventListener("appinstalled", () => {
    console.log("PWA berhasil dipasang di layar utama!");
    if (installBtn) {
        installBtn.style.display = "none";
    }
});