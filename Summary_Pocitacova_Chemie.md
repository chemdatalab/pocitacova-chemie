# PROJEKT: Počítačová chemie (PřF UP Olomouc)

Webová platforma, interaktivní učebnice s online simulátory a prezentační systém pro nový bakalářský studijní program **Počítačová chemie** na Katedře fyzikální chemie Přírodovědecké fakulty Univerzity Palackého v Olomouci. Slouží k propagaci oboru, výuce na středních i vysokých školách a pro zvané přednášky (např. *Chemie v praxi* – prof. Karel Berka).

---

## HOTOVO:

### 1. Interaktivní webová učebnice (`ucebnice.html`, `assets/js/exercises.js`):
Kompletní sada 9 interaktivních cvičení s reálnou fyzikou, kvantovou mechanikou a chemoinformatikou:
* **Cvičení 1 (Trojúhelník kompromisů):** Interaktivní přepínání metod výpočetní chemie (QM, MM, CG) na základě velikosti a přesnosti.
* **Cvičení 2 (PES & Morseův potenciál $H_2$):** Hledání rovnovážné vazebné délky a disociační energie.
* **Cvičení 3 (MD simulátor vody & fázový diagram):**
  * Realistická orientace vodíkových můstků ($O-H\cdots O$ torque).
  * Fázová koexistence při 0 °C (50 % led + 50 % kapalina) a 100 °C (50 % kapalina + 50 % pára).
  * Gravitace a hustotní anomálie: kapalina a led padají ke dnu, **led plave na hladině kapalné vody díky vztlaku**.
  * Mechanický píst: **při zvyšování tlaku klesá dolů a stlačuje komoru**. Předvolby Everest (85 °C / 0.33 atm) a Tlakový hrnec (110 °C / 2 atm).
* **Cvičení 4 (Mesoscale modely):** Mol* 3D visualizer pro viry a buněčné membrány.
* **Cvičení 5 (Chemoinformatická laboratoř s JSME editorem):**
  * Integrovaný offline 2D editor JSME (všechny balíčky `deferredjs/` a palety lokálně v `assets/js/jsme/` bez pádů).
  * Živý výpočet molekulárních deskriptorů (MW, LogP, TPSA, HBD, HBA, RotBonds) ve 3 sloupcích s vysvětlujícími bublinami.
* **Cvičení 6 (Molekulární dokování & afinita):**
  * Termodynamický odhad disociační konstanty $K_d$ ($\text{mM}, \mu\text{M}, \text{nM}, \text{pM}$) podle vztahu $\Delta G = RT \ln K_d$.
  * Elektrostatické clash penalty při špatné orientaci ligandu s blesky $\text{⚡}$.
* **Cvičení 7 (AlphaFold & Mol* 3D vizualizace):**
  * Barevná škála spolehlivosti pLDDT (GFP, Crambin, SARS-CoV-2 Spike/ACE2 komplex, Hemoglobin se čtyřmi hemy).
* **Cvičení 8 (Reakční koordináta & katalýza):**
  * Hladký PES profil, kde **přechodový stav TS ($\ddagger$) leží striktně na globálním maximu bariéry $E_a$ při $\xi = 50\,\%$**.
  * Správně naformátovaná Arrheniova rovnice $k = A \cdot e^{-E_a / RT}$, 2 reakční systémy (hydrolýza esteru a hydrogenace ethenu na Pt).
* **Cvičení 9 (Kvantový návrh solárního článku & fotonika):**
  * Absorpce fotonů $E_{\text{fot}} = \frac{hc}{\lambda} \approx \frac{1240}{\lambda}\,\text{eV}$.
  * Shockley-Queisserův limit účinnosti ($\eta_{\text{max}} \approx 33.7\,\%$ při $E_g \approx 1.34 - 1.45\,\text{eV}$).
  * Dvojité plátno: Spektrum AM 1.5G s termalizačními ztrátami + Kvantová pásová struktura s animovaným laserem a excitací elektronů.

### 2. Interaktivní přednáška (`lecture.html`, `LECTURE_GUIDE_25MIN.md`):
* 17 interaktivních slidů v pevném projekčním poměru 16:9 se **zero-scrollbar auditem** (žádné nechtěné posuvníky při 1920×1080).
* Integrovaný 2D editor Ketcher, interaktivní kvízy Reality vs. Hype s odkrýváním odpovědí, vizualizace superpočítačů a univerzitních serverů (Bobik, Sam).
* Kompletní časovaný scénář přednášky pro prof. Karla Berku (25 minut).

### 3. Hlavní propagační web (`index.html`):
* Moderní landing page se 3 pilíři oboru, profilem absolventa, uplatněním a přihláškou ke studiu.

---

## SOUBORY:

* `ucebnice.html` – Interaktivní webová učebnice (10 kapitol, 9 interaktivních cvičení).
* `assets/js/exercises.js` – Kvantové a fyzikální simulační jádro (všechna interaktivní cvičení 1–9).
* `assets/js/jsme/` – Lokální offline distribuce chemického editoru JSME.
* `assets/css/style.css` – Globální responzivní design, typografie a tmavý vědecký motiv.
* `lecture.html` – Interaktivní 17-slidová prezentace pro projektor.
* `LECTURE_GUIDE_25MIN.md` – 25minutový průvodce a scénář pro přednášejícího.
* `index.html` – Hlavní landing page studijního programu.
* `assets/img/` – Loga PřF UPOL, Katedry fyzikální chemie, Olomouckého kraje a infografiky.

---

## AKTUÁLNÍ ÚKOL:

* Všechny nahlášené opravy simulací (píst a vztlak ledu ve cvičení 3, JSME editor v cvičení 5, $K_d$ ve cvičení 6, popis hemoglobinu v cvičení 7, Arrheniova rovnice a maximum PES v cvičení 8, implementace solárního článku v cvičení 9) jsou **dokončeny, otestovány a nasazeny na produkční GitHub Pages**.
* **Možné další kroky pro navázání:**
  1. Uživatelské testování a případné doladění dalších kapitol učebnice.
  2. Doplnění kapitoly 10 (kariérní rozcestník výpočetního chemika).
  3. Export a tiskové styly pro případný tisk do PDF.

---

## KONTEXT:

* **Produkční web (GitHub Pages):** `https://chemdatalab.github.io/pocitacova-chemie/`
* **Náhled učebnice:** `https://chemdatalab.github.io/pocitacova-chemie/ucebnice.html?preview=kfc2026`
* **Náhled přednášky:** `https://chemdatalab.github.io/pocitacova-chemie/lecture.html`
* **GitHub repozitář:** `https://github.com/chemdatalab/pocitacova-chemie` (větev `main`)
* **Lokální vývoj:** Spuštění např. přes `python -m http.server 8000` na adrese `http://localhost:8000/`.
* **Cache-busting pravidlo:** Při úpravách JavaScriptu v `exercises.js` vždy zvyšte verzi v `ucebnice.html` (`<script src="assets/js/exercises.js?v=YYYYMMDD_HHMM"></script>`), aby prohlížeče nepoužívaly starou mezipaměť.

---

## 🧭 PŘESNÉ KROKY JAK NAVÁZAT V NOVÉ KONVERZACI:

1. **Otevřete novou konverzaci** a vložte soubor `Summary_Pocitacova_Chemie.md` (nebo odkažte na repozitář `chemdatalab/pocitacova-chemie`).
2. **Zadejte konkrétní požadavek**, například:
   * *„Chci upravit text a simulaci v Kapitole X v ucebnice.html.“*
   * *„Zkontroluj chování na mobilních zařízeních a uprav layout.“*
   * *„Přidej novou funkcionalitu do přednášky lecture.html.“*
3. Agent má k dispozici veškerý výše uvedený kontext a může okamžitě pokračovat v práci bez nutnosti znovu analyzovat celý projekt.
