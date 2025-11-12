# 🎓 Proje ve Öğrenci Yönetim Sistemi (ASP.NET API + React)

Bu proje, ASP.NET Web API (Backend) ve React (Frontend) kullanılarak geliştirilmiş bir Proje ve Öğrenci Yönetim Sistemi'dir. Sistem, öğrencilerin projelere başvurmasını ve yöneticilerin bu başvuruları, öğrencileri ve projeleri yönetmesini sağlar.

Proje, backend tarafında **Katmanlı Mimari (N-Tier)** prensiplerine uygun olarak geliştirilmiş olup, **Repository Pattern** ve **Service Katmanı** kullanılarak iş mantığı ve veri erişimi birbirinden ayrılmıştır.

**GitHub Deposu:** `https://github.com/enes1517/Yonetim-Sistemi-Asp.net.api-react`

## 🚀 Kullanılan Teknolojiler ve Mimari

### Backend
* **ASP.NET Web API .NET 8.0 **
* **Entity Framework Core:** ORM ve veritabanı işlemleri için.
* **C#**

### Frontend
* **React:** Kullanıcı arayüzü için.
* **Axios:** API istekleri için.
* **React Router:** Sayfa yönlendirmeleri için.

### Mimari ve Desenler (Design Patterns)
* **Katmanlı Mimari (N-Tier):** Proje; Entities, Repositories, Service  ve  Controllers gibi katmanlara ayrılmıştır.
* **Repository :** Veri erişim operasyonlarını soyutlamak için kullanılmıştır.
* **Service :** İş mantığını (business logic) yönetmek için kullanılmıştır.
* * **Entity :** Veri tabanı nesneleri ve Dto'ları yönetmek için kullanılmıştır.

---

## ⚙️ Temel Özellikler

Sistemde "Admin" ve "Öğrenci" olmak üzere iki ana rol bulunmaktadır.

### 1. Admin Rolü (Yönetici Paneli)

Admin, sistemin tam kontrolüne sahip olan kullanıcıdır.

* **Öğrenci Yönetimi:**
    * Sisteme kayıtlı tüm öğrencileri listeleme (Ad, soyad, okul no, email, teknolojiler vb.).
    * Öğrencilerin hesap durumunu (Beklemede / Onaylı / Reddedilmiş) görme.
    * Yeni öğrenci kayıtlarını **onaylama** veya **reddetme**.
    * Öğrenciler arasında isim, okul numarası, teknoloji veya duruma göre arama ve filtreleme yapma.

* **Proje Yönetimi:**
    * Yeni proje oluşturma (Proje adı, açıklama, bitirme süresi).
    * Mevcut projeleri düzenleme ve silme.
    * Bir projeye başvuran öğrencileri liste halinde görme.
    * Projeler arasında arama ve filtreleme yapma.

### 2. Öğrenci Rolü (Öğrenci Paneli)

Öğrenci, sisteme kayıt olup projelere başvuru yapabilen kullanıcıdır.

* **Kayıt Olma:**
    * Ad-soyad, okul numarası, email, şifre ve bildiği teknolojiler ile sisteme kayıt olma.
    * Kayıt sonrası hesabın **Admin onayına** düşmesi.

* **Giriş Yapma:**
    * Sadece Admin tarafından onaylanmış hesapların sisteme giriş yapabilmesi.

* **Proje İşlemleri:**
    * Sistemdeki tüm aktif projeleri listeleme.
    * Projeler arasında teknoloji, süre veya proje ismine göre filtreleme ve arama yapma.
    * İlgilendiği projelere başvurma (Aynı anda **en fazla 3 projeye** başvuru hakkı).

* **Profil Sayfası:**
    * Kendi profil bilgilerini görüntüleme.
    * Başvurduğu ve/veya katıldığı projeleri görme.

---

## 🔄 Uygulama Akışı (Senaryo)

1.  **Öğrenci Kaydı:** Ali, kayıt formunu (ad, soyad, okul no, teknolojiler vb.) doldurur. Hesabı "Beklemede" olarak admin onayına düşer.
2.  **Admin Onayı:** Admin panele giriş yapar, Ali'nin kaydını görür, bilgilerini inceler ve hesabını "Onaylı" duruma getirir.
3.  **Öğrenci Girişi:** Ali, hesabı onaylandığı için sisteme giriş yapabilir.
4.  **Proje Listeleme:** Ali, ana sayfada tüm projeleri görür ve filtreleme özelliğini kullanarak kendine uygun projeleri arar.
5.  **Proje Seçimi:** Ali, ilgisini çeken 2 adet projeye "Başvur" butonuna tıklar. (Maksimum 3 hakkı vardır).
6.  **Admin Kontrolü:** Admin, proje yönetimi sayfasından hangi projeye hangi öğrencilerin başvurduğunu anlık olarak takip edebilir.

---

## 🛠️ Kurulum ve Çalıştırma

Projenin yerel makinede çalıştırılması için backend ve frontend'in ayrı ayrı başlatılması gerekir.

### Backend (ASP.NET Web API)

1.  Projenin ana klasörünü klonlayın.
2.  Backend (API) projesinin olduğu klasöre gidin.
3.  `appsettings.json` dosyasındaki **ConnectionString** (veritabanı bağlantı dizesi) alanını kendi yerel veritabanınıza göre güncelleyin.
4.  Gerekli paketleri yükleyin:
    ```bash
    dotnet restore
    ```
5.  Veritabanını oluşturmak için Entity Framework Core migration'larını çalıştırın:
    ```bash
    dotnet ef database update
    ```
6.  API'yi başlatın:
    ```bash
    dotnet run
    ```
7.  API, `https://localhost:<PORT>` veya `http://localhost:<PORT>` üzerinde çalışmaya başlayacaktır.

### Frontend (React)

1.  Frontend (React) projesinin olduğu klasöre gidin.
2.  Gerekli npm paketlerini yükleyin:
    ```bash
    npm install
    ```
3.  (Varsa) `.env` dosyasındaki veya `src` altındaki API adresini (baseURL) backend adresinize göre güncelleyin.
4.  Uygulamayı başlatın:
    ```bash
    npm start
    ```
5.  React uygulaması varsayılan olarak `http://localhost:3000` üzerinde açılacaktır.
