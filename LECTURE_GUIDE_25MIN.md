# Speaker Guide & Full Script: 25-Minute Interactive Lecture

## **"Computational Chemistry – What We Can And Cannot Calculate/Simulate"**

**Occasion:** Chemie v praxi (Chemistry in Practice)  
**Target Audience:** Students, high school science finalists, chemistry practitioners, and academic researchers.  
**Affiliation:** Department of Physical Chemistry (KFC), Faculty of Science, Palacký University Olomouc  
**Estimated Time:** 25:00 minutes (20–22 min presentation + interactive demonstrations, 3–5 min Q&A).  
**Interactive Deck:** [`lecture.html`](file:///c:/Users/krapn/Dropbox/Antigravity/Pocitacova-chemie/lecture.html)

---

## ⏱️ Master Timing Roadmap

| Slide # | Title / Topic | Method / Focus | Time Stamp | Duration |
| :---: | :--- | :--- | :---: | :---: |
| **01** | Title: What We Can & Cannot Simulate | Mission statement & framing | 00:00 – 01:30 | 1.5 min |
| **02** | Why Calculate When We Can Synthesize? | Resolution, Support, Exploration | 01:30 – 03:30 | 2.0 min |
| **03** | The Multiverse of Chemical Scales | Attoseconds to seconds ($10^{24}$ span) | 03:30 – 05:30 | 2.0 min |
| **04** | Scale Explorer: Matching Method to Reality | **Interactive Demo 1 (4 Tiers)** | 05:30 – 08:00 | 2.5 min |
| **05** | The Iron Triangle of Compromise | **Interactive Demo 2 (Triangle)** | 08:00 – 10:00 | 2.0 min |
| **06** | The Electronic Realm: Schrödinger & DFT | Quantum Chemistry & Scaling Walls | 10:00 – 12:00 | 2.0 min |
| **07** | Why Classical MD Cannot Break Bonds | **Interactive Demo 3 (Harmonic Slider)** | 12:00 – 14:00 | 2.0 min |
| **08** | Atoms as Balls & Springs: Newtonian MD | Integration, $2\text{ fs}$ timestep | 14:00 – 16:00 | 2.0 min |
| **09** | Membranes, Transporters & Cytochromes | UPOL research: CYP450, Coumarin | 16:00 – 17:30 | 1.5 min |
| **10** | Molecular Docking & QM/MM Hybridization | 2013 Nobel, Virtual Screening | 17:30 – 19:00 | 1.5 min |
| **11** | The Chemical Ocean: $10^{60}$ Molecules | Big data, SMILES, QSAR | 19:00 – 20:30 | 1.5 min |
| **12** | AlphaFold & The Applicability Domain Hazard | 2024 Nobel, AI hallucination limit | 20:30 – 22:00 | 1.5 min |
| **13** | Audience Challenge: Can We Simulate It? | **Interactive Demo 4 (5 Scenarios)** | 22:00 – 23:30 | 1.5 min |
| **14** | The Engine Room: Supercomputing at UPOL | Hardware: 3100 CPUs, 100+ GPUs | 23:30 – 24:15 | 0.75 min |
| **15** | The Definitive "Can vs. Cannot" Matrix | Executive take-home summary | 24:15 – 24:45 | 0.5 min |
| **16** | The Next Frontier: Study at UPOL & Q&A | Career paths, Bachelor program | 24:45 – 25:00 | 0.25 min |

---

## 🎙️ Slide-by-Slide Presenter Script & Stage Directions

### **SLIDE 1: Title & Framing (00:00 – 01:30)**
- **Visual:** Clean presentation layout with UPOL KFC logo, 'Chemie v praxi 2026' badge, and the Iron Triangle preview.
- **Stage Direction:** Stand centered. Speak with warmth, curiosity, and authority.
- **Spoken Script:**
  > *"Good morning, everyone, and welcome to 'Chemie v praxi'! If I ask you to close your eyes and picture 'chemistry', what comes to mind? Almost certainly white lab coats, colored liquids bubbling in Erlenmeyer flasks, and the smell of solvents.*
  > 
  > *Today, we step into a complementary and equally powerful world: **in silico chemistry**—chemistry inside the silicon processors of supercomputers. Over the past few decades, computation has evolved from an academic curiosity into an indispensable pillar of real chemical practice.*
  > 
  > *However, popular media often paints a misleading picture: feed a molecule to a computer or an AI, press 'Enter', and the computer magically solves all synthesis problems. That is a myth.*
  > 
  > *Today’s talk has one explicit mission: to provide practical chemists and students with an honest, rigorous mental map of **what we can calculate**, **what we cannot calculate**, and why the laws of mathematics and physics draw those boundaries. Let’s dive in."*

---

### **SLIDE 2: Proč počítat, když můžeme experimentovat? (01:30 – 03:30)**
- **Visual:** Motto Alberta Einsteina, karta *„Co vidíš, to lépe pochopíš“*, tři pilíře počítačové chemie a **živý 3D Mol* Viewer** zobrazující **bakteriální bičíkový motor a háček (Motor-Hook Complex)**.
- **Stage Direction:** **[UKÁZKA V MOL* VIEWERU]** Myší přímo na slidu otočte a přibližte bakteriální bičíkový motor. Ukažte publiku dynamiku obřího molekulárního stroje a vysvětlete, že prof. Karel Berka je spoluautorem nástroje Mol* (celosvětový standard na RCSB PDB a AlphaFold DB).
- **Spoken Script:**
  > *„Začněme provokativním mottem z úvodu přednášky od Alberta Einsteina: ‚Teorii nevěří nikdo kromě toho, kdo ji vytvořil. Experimentu věří každý kromě toho, kdo jej provedl.‘*
  > 
  > *Pokud je experiment v laboratoři tou nejvyšší pravdou, proč trávíme miliony výpočetních hodin simulacemi na superpočítačích?*
  > 
  > *Především: **Co vidíš, to lépe pochopíš!** Podívejte se vpravo na náš živý 3D prohlížeč Mol*. Vidíte **bakteriální bičíkový motor a kloub (motor-hook komplex)** sestavený ze stovek proteinových podjednotek. Molekuly jsou pouhým lidským okem neviditelné. Když pracujete v laboratoři, měřicí přístroje vám dávají jen nepřímé signály: pík v NMR spektru, retenční čas na HPLC koloně nebo hmotnostní poměr m/z. Ani jedno z toho vám neukáže, jak molekula v prostoru skutečně vypadá a jak se hýbe. Počítačová chemie převádí abstraktní data na reálný prostorový zrak.*
  > 
  > *Druhý důvod: **Atomové a časové rozlišení**. V jediné baňce s $18\text{ mL}$ vody máte $1\text{ mol} = 6{,}022 \times 10^{23}$ molekul vody. Avogadrovo číslo! Experimentální měření vidí makroskopický průměr přes triliony částic. Simulace nám dovoluje sledovat jedinou vybranou molekulu, její konformační tanec a přeskoky jednotlivých protonů.*
  > 
  > *Třetí důvod: **Mechanistický vhled**. Jak s oblibou říkáme: ‚Přechodový stav do baňky nedáš!‘ Tranzitní stavy a reakční bariéry existují pouhé femtosekundy ($10^{-15}\text{ s}$) při štěpení a vzniku vazeb. Počítačová simulace je naší jedinou ultrarychlou kamerou schopnou tento okamžik zachytit.*
  > 
  > *A čtvrtý důvod: **Presyntetický design v praxi**. Syntetizovat, vyčistit a otestovat stovky nových látek v laboratoři trvá měsíce a spotřebuje litry drahých rozpouštědel. V počítači dokážeme otestovat miliony virtuálních molekul během dní, vyřadit nefunkční a toxické sloučeniny a do laboratoře poslat jen ty nejnadějnější kandidáty.“*

---

### **SLIDE 3: Multivesmír chemických škál (03:30 – 05:30)**
- **Visual:** Diagram ve vysokém rozlišení: **„Škála chemických dějů“** (Počet atomů / rozměry vs. Čas), s interaktivním tlačítkem na **„Metody výpočtů“**.
- **Stage Direction:** Ukažte na 2D osy diagramu: začněte vlevo dole (jediný atom vodíku, attosekundový pohyb elektronů) a pokračujte po diagonále vpravo nahoru (1 mol, 18 ml vody, sekundy). Přepněte na tlačítko *„Metody výpočtů“* a demonstrujte pokrytí metod QM, MD a CG.
- **Spoken Script:**
  > *„Proč nemáme jeden univerzální chemický simulátor, který by spočítal úplně všechno? Podívejte se na tento klíčový diagram: **Škála chemických dějů** — komplexní mapu rozměrů a časů v chemii.
  > 
  > *Všimněte si, že chemie operuje napříč neuvěřitelnými **24 řády v čase i počtu částic**!
  > 
  > *Na svislé ose stoupáme od jediného atomu vodíku ($0{,}1\text{ nm}$), přes malé molekuly (benzen, lipidy), inzulín, enzymy jako HIV proteáza ($10^4$ atomů), ribozom a virové částice ($15-100\text{ nm}$), lidský genom, až po makroskopický svět — $1\text{ mol}$, což je pouhých $18\text{ mL}$ vody v baňce obsahující $6{,}022 \times 10^{23}$ atomů!
  > 
  > *Na vodorovné ose máme čas: od statických struktur a **attosekund** ($10^{-18}\text{ s}$ — pohyb elektronů), přes **femtosekundy** ($10^{-15}\text{ s}$ — kmity vazeb, Nobelova cena pro Ahmeda Zewaila 1999), **pikosekundy** ($10^{-12}\text{ s}$ — reakční bariéry), **mikrosekundy** ($10^{-6}\text{ s}$ — difúze lipidů a konformační změny proteinů), až po **sekundy** ($1\text{ s+}$), což je škála lidského vnímání.
  > 
  > *[Klikněte na tlačítko 'Metody výpočtů']*  
  > *Když na tuto mapu naneseme naše výpočetní metody, okamžitě vidíte základní dilema: Kvantová mechanika (QM) je uvězněna vlevo dole. Molekulová dynamika (MD) pokrývá střed. Hrubozrnné modely (CG) dosahují k mikrosekundám. Žádná jediná metoda nedokáže spočítat všechny škály najednou bez aproximací!“*

---

### **SLIDE 4: Trojúhelník kompromisů – Princip neurčitosti (05:30 – 07:30)**
- **Visual:** Interaktivní HTML5 Canvas s Trojúhelníkem kompromisů, živým tažením kurzoru, barycentrickými čarami a skokovými tlačítky (Bod B, C, A, D).
- **Stage Direction:** **[TÁHNĚTE KURZOREM UVNITŘ TROJÚHELNÍKU]** Ukažte, jak pohyb ke kterémukoliv rohu mění kompromis. Poté klikněte na tlačítka a předveďte: Bod B (QM), Bod C (MM), Bod A (CG) a Bod D (Svatý grál / AI).
- **Spoken Script:**
  > *„Každý počítačový chemik se řídí pravidlem tohoto trojúhelníku: říkáme mu **Výpočetní princip neurčitosti** (trojúhelník kompromisů).
  > 
  > *Stejně jako Heisenbergův princip neurčitosti v kvantové fyzice stanovuje nepřekročitelnou mez — nemůžete současně přesně znát polohu i hybnost částice —, ve výpočetní chemii máme neúprosný kompromis mezi třemi veličinami: **Přesnost**, **Velikost systému ($N$)** a **Rychlost výpočtu**.
  > 
  > *Můžete si vybrat **vždy jen 2 ze 3**!
  > 
  > *[Klik nebo posun k Bodu B – vlevo dole]*  
  > *Bod B je **Vysoká přesnost a rozumný čas**. Chcete-li exaktní vlnové funkce elektronů (QM / DFT), výpočet stihnete v rozumném čase pouze tehdy, když udržíte systém velmi malý ($N < 100\text{–}500\text{ atomů}$).
  > 
  > *[Klik nebo posun k Bodu C – vpravo dole]*  
  > *Bod C je **Rozsáhlý systém a vysoká rychlost**. Potřebujete-li simulovat statisíce atomů proteinu v kádince vody po stovky nanosekund, musíte nahradit elektrony kuličkami na pružinkách (klasická MD / silová pole). Rychlé, ale neumí štěpit vazby.
  > 
  > *[Klik nebo posun k Bodu A – nahoře]*  
  > *Bod A jsou **Hrubozrnné modely (CG)**. Sdružením atomů do zrn dosáhnete na celé buněčné membrány a mikrosekundy, ale ztratíte jemné chemické detaily.
  > 
  > *[Klik na Bod D – uprostřed]*  
  > *A uprostřed leží **Bod D — Svatý grál**. Lze dosáhnout kvantové přesnosti na obřích biomolekulách za zlomek času? To je největší výzva moderní výpočetní chemie, řešená víceškálovým propojením **QM/MM** (Nobelova cena 2013) a neuronovými sítěmi (strojové učení v chemii)!“*

---

### **SLIDE 5: Průzkumník škál: Metody vs. Realita (07:30 – 10:00)**
- **Visual:** Interaktivní navigátor škál se 4 záložkami (QM, MD, CG, AI), přehledem rovnic, kapacit, limitů a **dynamickým ilustračním obrázkem** pro každou úroveň.
- **Stage Direction:** **[KLIKNĚTE NA ZÁLOŽKU 1 (QM)]**, poukažte na obrázek elektronové hustoty na grafenu; poté **[KLIKNĚTE NA ZÁLOŽKU 2 (MD)]**, ukažte trajektorii panáčka; poté **[KLIKNĚTE NA ZÁLOŽKU 3 (CG)]**, ukažte enzymové tunely v membráně; nakonec **[KLIKNĚTE NA ZÁLOŽKU 4 (AI)]**, ukažte chemický graf a reprezentaci molekul.
- **Spoken Script:**
  > *„Pojďme si to vyzkoušet přímo v našem interaktivním průzkumníku škál.*
  > 
  > *[Klik na Záložku 1: Kvantová (QM)]*  
  > *Na elektronové úrovni vládne **Kvantová mechanika**. Řídicím zákonem je Schrödingerova rovnice $\hat{H}\Psi = E\Psi$. Podívejte se na obrázek vpravo: vidíte elektronovou hustotu a adsorpci molekul plynů na 2D grafenu přímo z výzkumu na naší katedře. Co QM dokáže? Dokáže štěpit vazby, počítat přesná UV-Vis spektra i aktivační bariéry reakcí. Její tvrdý limit je však velikost: rutinně zvládá jen stovky atomů.*
  > 
  > *[Klik na Záložku 2: Celoatomová MD]*  
  > *Postoupíme-li výše, dostáváme se k **Celoatomové molekulové dynamice**. Zde opouštíme explicitní elektrony a atomy modelujeme jako kuličky na pružinkách podle Newtonova $F = ma$. Na obrázku vidíte molekulární trajektorii panáčka. Nyní už dokážeme simulovat miliony atomů — celé proteiny v kapce slané vody. Ale limit? Standardní MD neumí rozbít kovalentní vazbu ani popsat excitaci elektronů.*
  > 
  > *[Klik na Záložku 3: Hrubozrnná (CG)]*  
  > *Ještě dále sahají **Hrubozrnné modely**, například slavné silové pole MARTINI. Zde spojujeme 3 až 4 těžké atomy do jediné interakční kuličky. Ztrácíme jemný detail vodíkových můstků, ale na obrázku vpravo vidíte, co získáváme: schopnost studovat rozsáhlé enzymové tunely v buněčné membráně (Cytochrom P450), pučení membrán a oligomerizaci po celé mikrosekundy.*
  > 
  > *[Klik na Záložku 4: Chemoinformatika & AI]*  
  > *A na nejvyšším patře stojí **Chemoinformatika a Strojové učení**. Úplně opouštíme fyzikální diferenciální rovnice. Využíváme chemické grafy, molekulární deskriptory a neuronové sítě k predikci 3D struktur proteinů či biologické aktivity během milisekund. Jak si ale za chvíli ukážeme, AI má jednu velkou slabinu: zcela selhává mimo doménu své trénovací množiny.“*

---

### **SLIDE 6: Říše elektronů: Schrödinger & DFT (10:00 – 12:00)**
- **Visual:** Interaktivní **3D Simulátor atomových orbitalů** s volbou předvoleb ($1s$, $2s$, $2p_z$, $3p_x$, $3d_{z^2}$, $3d_{xy}$), generátorem poloh elektronů (+100 $e^-$, +1 000 $e^-$, auto vzorkování) a přepínačem na Grafenový senzor (KFC UPOL).
- **Stage Direction:** **[VYBERTE ORBITAL 2p_z NEBO 3d_z2 A KLIKNĚTE NA '+1 000 e⁻']** Ukažte, jak se Monte Carlo vzorkováním hustoty pravděpodobnosti $|\Psi|^2$ tvoří elektronový oblak. Předveďte otáčení oblaku myší v 3D. Poté přepněte na grafenový senzor a zdůrazněte škálovací zeď ($O(N^3)$ u DFT a $O(N^7)$ u CCSD(T)).
- **Spoken Script:**
  > *„Pojďme se podívat do nitra Kvantové chemie. Přímo vlevo vidíte náš interaktivní **3D simulátor atomových orbitalů** inspirovaný simulátorem prof. Karla Berky (karelberka.io).
  > 
  > *Protože elektrony jsou tak neuvěřitelně lehké částice ($m_e \approx 9{,}1 \times 10^{-31}\text{ kg}$), vládne jim Heisenbergův princip neurčitosti: nemůžeme nakreslit klasickou oběžnou dráhu jako u planet. Místo toho počítáme vlnové funkce $\Psi_{n,l,m}$ — 3D hustoty pravděpodobnosti, kde se elektron nachází.
  > 
  > *[Předveďte přepnutí orbitalu na $2p_z$ a klikněte na '+1 000 e⁻' nebo '⚡ Auto vzorkování']*  
  > *Vidíte, jak se pomocí Monte Carlo vzorkování postupně objevují jednotlivé polohy elektronu v prostoru. Oranžová barva představuje kladnou fázi vlnové funkce, tyrkysová barva zápornou fázi. Mezi nimi leží uzlová rovina s nulovou pravděpodobností výskytu. Můžete myší oblak libovolně otáčet v 3D!
  > 
  > *[Volitelně: Přepněte na 'Grafenový senzor (KFC)']*  
  > *U nás na Přírodovědecké fakultě UPOL v Olomouci využíváme kvantové výpočty DFT například pro návrh elektrochemických biosenzorů — počítáme přesné adsorpční energie plynů a těkavých látek na funkcionalizovaném grafenu.
  > 
  > *V čem kvantová chemie exceluje?*  
  > *1. **Spektroskopie:** Přesně předpovídá elektronové přechody, UV-Vis absorpční spektra a barvu látek.*  
  > *2. **Tranzitní stavy reakcí:** Počítá výšku aktivační bariéry a reakční mechanismy enzymů.*  
  > *3. **Štěpení vazeb:** Popisuje vznik radikálů a fotochemické reakce.*
  > 
  > *Proč tedy nepočítáme kvantově všechno? Podívejte se na pravou kartu: **Matematická škálovací zeď**.*  
  > *Běžná teorie funkcionálu hustoty (DFT) škáluje přibližně jako $O(N^3)$, kde $N$ je počet elektronů. A zlatý kvantový standard CCSD(T) škáluje dokonce jako **$O(N^7)$**!*  
  > 
  > *Uvědomte si, co znamená $O(N^7)$: Pokud zdvojnásobíte počet elektronů v molekule z 10 na 20, výpočet nebude trvat dvakrát déle. Bude trvat $2^7 = 128\text{krát déle}$! Zvýšení systému desetinásobně znamená $10^7 = 10\,000\,000\text{krát delší výpočet}$. Tato exponenciální zeď je absolutním limitem kvantové chemie.“*

---

### **SLIDE 7: Why Classical MD Cannot Break a Chemical Bond (12:00 – 14:00)**
- **Visual:** Interactive Bond Breaking Simulator: Two atoms (Atom A and Atom B) connected by a mechanical spring (Classical MM) vs. a covalent electron density cloud (Quantum QM). `⚡ Try to Break the Bond!` button with live spring oscillation and real-time restoring force ($F$) and potential energy ($E_{\text{pot}}$) gauges.
- **Stage Direction:** **[CLICK '⚡ Try to Break the Bond!']** Watch the spring turn glowing red, restoring force spike past 2,500 pN, and when released, the atom oscillates violently back to equilibrium. Then switch to `🟢 Quantum QM` and show that past the dissociation threshold ($r > 2.3\text{ \AA}$), the covalent bond cleaves into two independent free radicals ($\text{A}^\bullet + \text{B}^\bullet$) and the restoring force drops to zero.
- **Spoken Script:**
  > *"Now let's examine one of the most common misconceptions among biologists, pharmacists, and chemistry students: 'Can we simulate an enzymatic reaction, drug covalent inhibition, or molecule dissociation with classical molecular dynamics?'
  > 
  > *Let's test it live in our interactive experiment!
  > 
  > *[Click '⚡ Try to Break the Bond!']*  
  > *Look at the canvas: in classical Molecular Mechanics, atoms are modeled as balls connected by springs. The bond is defined by Hooke's Law: $E = \frac{1}{2} k (r - r_0)^2$. The further we stretch the atom, the harder it pulls back: $F = -k \Delta r$. The restoring force spikes past 2,500 pN, potential energy rockets into hundreds of kcal/mol, and when released, the spring snaps violently back. **In classical MD, a bond can NEVER break!** The harmonic spring is eternal and indestructible.
  > 
  > *[Switch to '🟢 Quantum QM' and drag slider past 2.3 \AA]*  
  > *Now observe quantum reality: electrons rearrange according to the Schrödinger equation. As atoms pull apart, electron wavefunction overlap vanishes, the bond cleaves into two independent free radicals ($\text{A}^\bullet + \text{B}^\bullet$), and restoring force drops to clean zero!
  > 
  > *The iron rule: **Classical MD cannot break or form covalent bonds.** To simulate chemical reactions, we must employ Quantum Chemistry (QM or hybrid QM/MM)."*

---

### **SLIDE 8: Atoms as Balls & Springs: Newtonian MD (14:00 – 16:00)**
- **Visual:** Original video from presentation: **"Stickman MD Trajectory"** (`media3.mp4`), with interactive switcher to **"Energy Minimization"** (`media2.mp4`) and the live **"Live Water Solvation"** canvas.
- **Stage Direction:** **[LET VIDEO PLAY]** Point out the molecular stickman tumbling and vibrating under Newton's equations ($F = ma$, $\Delta t = 2\text{ fs}$). Use the toggle buttons to show Energy Minimization vs. Molecular Dynamics, or switch to the water solution simulation to demonstrate solvent dynamics.
- **Spoken Script:**
  > *"So if classical MD cannot break bonds, what does it calculate? Look at the video playing on the left: this is the iconic original animation from Prof. Berka's keynote—**the Molecular Dynamics trajectory of the molecular stickman** (*molekulární panáček*)!
  > 
  > *In classical Molecular Dynamics, every atom is treated as a sphere on a spring. By integrating Newton's second law ($F = ma$) with a **2-femtosecond timestep** ($\Delta t = 2\text{ fs}$), we compute the atomic trajectory step by step: positions, velocities, and accelerations. You can see thermal kinetic energy in action: bonds vibrating, angles bending, and limbs flexing!
  > 
  > *[Click 'Energy Minimization (Video)']*  
  > *Compare this with static Molecular Mechanics: energy minimization simply rolls the atoms downhill to find the closest local potential energy minimum, freezing thermal motion completely.
  > 
  > *[Click '💧 Live Water Solvation']*  
  > *Now look at a solvent in action: liquid water molecules tumbling and forming transient hydrogen-bond networks. Classical MD is magnificent for calculating diffusion constants, membrane partitioning, and conformational fluctuations over millions of atoms.
  > 
  > *[Point to the red box on the right]*  
  > *But always remember the hard boundary: Because springs are fixed, classical MD cannot break bonds or transfer protons (autoprotolysis $2\text{ H}_2\text{O} \to \text{H}_3\text{O}^+ + \text{OH}^-$). To model chemical reactions, you must couple MD with quantum mechanics!"*

---

### **SLIDE 9: Applications in Olomouc: Membranes, Tunnels & Cytochromes (16:00 – 17:30)**
- **Visual:** Cytochrome P450 channels (PPTX slide 15), coumarin membrane permeation profiles (slide 16), direct web links to **MOLEonline.cz**, **ChannelsDB**, and **molmedb.upol.cz**.
- **Stage Direction:** Point with pride to the published work and software tools created at Palacký University. Emphasize that anyone in the audience can open and use these tools for free online.
- **Spoken Script:**
  > *"How do we apply these simulations here in Olomouc at Palacký University?*
  > 
  > *Let's look at **Cytochrome P450**—the superfamily of enzymes responsible for metabolizing more than 70% of all clinically prescribed drugs in your liver. Cytochromes are partially embedded in cell membranes.*
  > 
  > *Using all-atom MD, our research team discovered that lipophilic drugs don't enter the enzyme from bulk water. Instead, they dissolve into the lipid bilayer and enter the catalytic core through specialized hydrophobic membrane tunnels! Once the drug is oxidized into a more soluble metabolite, it exits through a different hydrophilic tunnel.*
  > 
  > *To detect and characterize these internal tunnels in any protein, our team at UPOL co-developed **[MOLEonline.cz](https://moleonline.cz)**—a web tool used by structural biologists worldwide—as well as **[ChannelsDB](https://channelsdb2.biodata.ceitec.cz)**, which annotates channels across the entire Protein Data Bank.*
  > 
  > *We also use enhanced sampling techniques (Umbrella Sampling) to compute the exact free energy barrier for molecules traversing lipid membranes. Our team compiled these profiles into **[MolMeDB](https://molmedb.upol.cz)** (Molecules on Membranes Database) at **molmedb.upol.cz**—the world’s leading open database for compound-membrane interactions, developed right here in Olomouc."*

---

### **SLIDE 10: AlphaFold, Co-Folding & Molecular Docking (17:30 – 19:00)**
- **Visual:** Publication-grade methodology diagrams:
  1. **AlphaFold 3 Architecture (`alphafold3_methodology.jpg`):** Biomolecular Inputs (proteins, DNA/RNA, ligand SMILES) $\to$ Pairformer attention $\to$ Generative Diffusion coordinate denoising $\to$ Quaternary co-folded complex with pLDDT confidence scale.
  2. **Molecular Docking Virtual Screening Pipeline (`molecular_docking_methodology.jpg`):** 1. Receptor Pocket Grid $\to$ 2. Conformational Sampling (translation, rotation, torsions) $\to$ 3. Empirical Scoring Function ($\Delta G \approx \Delta G_{vdW} + \Delta G_{hbond} + \Delta G_{elec} + \Delta G_{desolv} + \Delta G_{tors}$) $\to$ 4. Library Hit Ranking ($10^6 - 10^9$ cpds).
  3. Interactive 2-mode switcher (`AlphaFold 3 Pipeline`, `Docking Screening`) + full-screen click-to-zoom Lightbox modal.
- **Stage Direction:** **[CLICK TABS & ZOOM]** Start on the *AlphaFold 3 Pipeline* tab. Walk the audience through the Pairformer and diffusion coordinate denoising architecture. Then click the *Docking Screening* tab to switch to the 4-step molecular docking funnel. Emphasize that clicking either image opens a full-screen lightbox modal for fine-detail inspection.
- **Spoken Script:**
  > *"Here we unite structural AI and virtual screening! In **2024, the Nobel Prize in Chemistry** was awarded to Demis Hassabis and John Jumper of Google DeepMind for AlphaFold, and David Baker for computational protein design.
  > 
  > *Look at our visual methodology diagrams on the left:
  > 
  > *At the top is the revolutionary **AlphaFold 3 Generative Diffusion Architecture**:
  > *1. **Heterogeneous Inputs:** Unlike earlier versions limited to proteins, AF3 simultaneously accepts protein sequences, nucleic acids (DNA/RNA chains), and small-molecule drug ligands represented as SMILES strings.
  > *2. **Pairformer Module:** Replaces heavy multiple sequence alignment transformers; it attends directly to spatial atom-atom pair representations and evolutionary co-variation constraints.
  > *3. **Generative 3D Diffusion:** It discards rigid structural frames! Instead, an all-atom diffusion head directly denoises 3D atomic coordinates from a random Gaussian noise cloud into physical space.
  > *4. **Quaternary Co-Folded Complex:** Delivers sub-Ångström all-atom complexes with per-residue confidence scores ($pLDDT > 90$ indicates high accuracy) and predicted aligned error (PAE) for binding interfaces.
  > 
  > *Once 3D structures are predicted, how do we find prospective drug candidates? Look at the second diagram: **Molecular Docking Virtual Screening Pipeline**:
  > *1. **Receptor Pocket & Grid:** We pre-compute 3D affinity and electrostatic energy grids across the binding cavity.
  > *2. **Conformational Sampling:** Genetic algorithms sample ligand translation, 3D rotation, and rotatable dihedral bonds.
  > *3. **Empirical Scoring Function:** We estimate binding free energy by summing van der Waals contacts, hydrogen bonds, electrostatics, and desolvation penalties.
  > *4. **Library Hit Ranking:** We screen $10^6$ to $10^9$ candidate compounds in hours on supercomputers, prioritizing top nanomolar leads for experimental wet-lab synthesis.
  > 
  > *What is the cardinal rule on the right? **Structure prediction and docking predict GEOMETRY (how things fit), not AFFINITY (how tightly they bind; $\Delta G$)!** Docking is a high-throughput structural filter—not a physical calorimeter. To compute true thermodynamic free energies and drug residence times, physical molecular dynamics and free energy perturbation (FEP) remain mandatory."*

---

### **SLIDE 11: QSAR: From Molecular Structure to Biological Activity (19:00 – 20:30)**
- **Visual:** Interactive JSME 2D Molecular Editor with drug presets (Aspirin, Caffeine, Ibuprofen, Paracetamol, Morphine, Glucose), real-time QSAR descriptor grid (MW, logP, logS, HBD, HBA, TPSA), and live Lipinski Rule of 5 evaluation card.
- **Stage Direction:** **[CLICK PRESETS OR DRAW]** Switch between Aspirin, Caffeine, and Morphine. Point out how drawing an extra hydroxyl (-OH) or halogen immediately updates the SMILES string and live physicochemical descriptors. Show how the Lipinski Rule of 5 validates oral bioavailability.
- **Spoken Script:**
  > *"Now let's step into Chemoinformatics: How do we turn chemical drawings into predictive models without spending weeks on quantum calculations?
  > 
  > *Look at the interactive laboratory on your screen: we have a live 2D molecular editor directly in the slide!
  > 
  > *[Click 'Caffeine' or 'Morphine']*  
  > *Notice what happens: every time we draw or select a molecule, the algorithm instantly parses its chemical graph and encodes it into a vector of numerical descriptors ($E(\text{Structure})$):
  > *- **Molecular Weight ($M_w$):** Must be $\le 500\text{ g/mol}$ to diffuse through cell membranes.
  > *- **Lipophilicity ($\log P$):** How well does the compound dissolve in fats vs. water? Ideal is 0 to 3.
  > *- **H-Bond Donors & Acceptors (HBD/HBA):** Key determinants of binding selectivity and permeation.
  > *- **Solubility ($\log S$) & Polar Surface Area (TPSA):** Predicting intestinal absorption and blood-brain barrier passage.
  > 
  > *This is the foundation of **Lipinski's Rule of 5** for drug-likeness.
  > 
  > *In **QSAR modeling** (Quantitative Structure-Activity Relationships), we write:
  > $$\text{Activity} = M(E(\text{Structure}))$$
  > *Instead of solving Schrödinger's equation, Machine Learning ($M$) learns patterns directly from these descriptor fingerprints ($E$). That is how pharmaceutical companies navigate the astronomical ocean of **$10^{60}$ theoretically possible drug molecules**!"*

---

### **SLIDE 12: QSAR Modeling: Descriptors, ML & The Applicability Domain (20:30 – 22:00)**
- **Visual:** Hierarchical breakdown of 1D, 2D (Morgan/ECFP4, MACCS), and 3D descriptors ($E(\text{Structure})$); supervised ML algorithms ($M(E)$: Random Forest, XGBoost, SVM, GNN Chemprop); prominent enlarged Applicability Domain (AD) showcase featuring the famous xkcd comic *"My Hobby: Extrapolating"* (`image66.png`).
- **Stage Direction:** Connect Slide 11's interactive drawing directly to the mathematical machinery of QSAR. Then pivot forcefully to the right column: point to the enlarged xkcd comic to highlight the danger of extrapolation.
- **Spoken Script:**
  > *"Following our live molecular drawing on Slide 11, how do we systematically build and train predictive QSAR models: $\text{Activity} = M(E(\text{Structure}))$?
  > 
  > *1. **Descriptor Engineering ($E(\text{Structure})$):**  
  > *Computers cannot digest chemical sketches directly; molecules must be vectorized:
  > *- **1D (Constitutional):** Molecular weight, atom counts (C, N, O, halogens), element ratios—simple, bulk filters.
  > *- **2D (Topological & Fingerprints):** *Morgan / ECFP4 circular fingerprints* hash atom neighborhoods into 1024-bit vectors, capturing pharmacophoric motifs. MACCS keys check for 166 predefined structural fragments.
  > *- **3D (Spatial & Fields):** Solvent-accessible surface area, electrostatic and steric CoMFA fields.
  > 
  > *2. **Supervised Machine Learning ($M(E)$):**  
  > *We train algorithms to map descriptor vectors to bioassay activities:
  > *- **Tree Ensembles (Random Forest, XGBoost):** The gold standard for tabular chemoinformatics; robust to noise and non-linear interactions.
  > *- **Support Vector Machines (SVM):** Separate active from inactive molecules via high-dimensional RBF kernels.
  > *- **Graph Neural Networks (GNN):** Operate directly on molecular graphs via message passing without hand-crafted descriptors.
  > *- **Validation Protocols:** Every valid QSAR model requires $k$-fold cross-validation ($Q^2 > 0.6$) and $Y$-scrambling (permuting labels to rule out chance correlation).
  > 
  > *3. **The Applicability Domain (AD) Hazard:**  
  > *[Point to the enlarged xkcd comic on the right: 'My Hobby: Extrapolating']*  
  > *As the famous xkcd comic illustrates: Machine learning does not learn universal physical laws—it learns statistical patterns within its training set!
  > *Inside the training envelope (convex hull), interpolation is highly reliable. But when you test an exotic molecule outside the Applicability Domain, the model does NOT say 'I don't know'—it hallucinates with 99% confidence!
  > *Measuring the Applicability Domain via distance-to-model metrics ($T_c < 0.6$, leverage thresholds) is mandatory to protect against fatal extrapolation errors in predictive drug design."*

---

### **SLIDE 13: Interactive Reality Check: Can We Simulate It? (22:00 – 23:30)**
- **Visual:** 5 clickable audience challenge rows.
- **Stage Direction:** Ask the audience to raise hands for each question before clicking!
- **Spoken Script:**
  > *"Now it's time for our interactive reality check! I have five real-world questions. Let's see your intuition:*
  > 
  > *[Ask Audience: Question 1]*  
  > *'Can we predict the 3D folded structure of an unknown 300-residue protein from sequence?' Hands up for YES? Hands up for NO?*  
  > *[Click Row 1]* -> **YES!** Thanks to AlphaFold2 and ESMFold, this is now a routine 60-second calculation on a single GPU.*
  > 
  > *[Ask Audience: Question 2]*  
  > *'Can we simulate 1 minute of enzyme catalysis in all-atom quantum mechanics?'*  
  > *[Click Row 2]* -> **IMPOSSIBLE!** With a QM timestep under 0.5 femtoseconds, 1 second requires quadrillions of steps. Even the world’s fastest exascale supercomputer would need millions of years.*
  > 
  > *[Ask Audience: Question 3]*  
  > *'Can we watch a drug molecule cross a cell membrane in atomistic detail?'*  
  > *[Click Row 3]* -> **YES!** Routine at UPOL using MD combined with Umbrella Sampling or Metadynamics.*
  > 
  > *[Ask Audience: Question 4]*  
  > *'Can we compute exact binding affinities within 1 kcal/mol for 1,000 compounds in an afternoon?'*  
  > *[Click Row 4]* -> **HYBRID / EXPENSIVE!** Fast docking is too inaccurate ($\pm 3\text{ kcal/mol}$). Rigorous Free Energy Perturbation (FEP) achieves chemical accuracy, but costs hundreds of GPU hours per molecule.*
  > 
  > *[Ask Audience: Question 5]*  
  > *'Can we calculate the visual color and UV-Vis absorption spectrum of a fluorescent dye?'*  
  > *[Click Row 5]* -> **YES!** Time-Dependent DFT (TD-DFT) does this routinely on standard workstations for dozens of atoms."*

---

### **SLIDE 14: The Engine Room: Supercomputing at UPOL & National MetaCentrum (23:30 – 24:15)**
- **Visual:** Photos of server racks at UPOL (Bobik, Sam, Melian, Ingwe clusters) alongside MetaCentrum National Grid Infrastructure (`metacentrum.cz`).
- **Stage Direction:** Contrast the local departmental cluster with the national academic grid MetaCentrum (CESNET / e-INFRA CZ). Emphasize that computational services are available for free to everyone in Czech academia.
- **Spoken Script:**
  > *"What does it take to power all this computational research? We operate on two complementary levels:
  > 
  > *1. **Local Department Clusters (KFC UPOL):**  
  > *Right here in Olomouc at the Department of Physical Chemistry, we run our own dedicated clusters: **~3,100 CPU cores**, **7.3 Terabytes of RAM**, and 80 Terabytes of storage (servers and nodes named *Bobik, Sam, Melian, Ingwe, Olwe*). MD nodes prioritize clock speed; Quantum nodes prioritize massive RAM per core for electron density integrals.
  > 
  > *2. **National Grid Infrastructure: MetaCentrum (CESNET / e-INFRA CZ):**  
  > *For massive screening and resource-heavy calculations, Czech computational chemists rely on **MetaCentrum**. MetaCentrum provides **free supercomputing and storage services for the entire Czech academic community**!
  > *- **Over 60,000 CPU cores** (AMD EPYC, Intel Xeon)  
  > *- **Hundreds of high-performance GPUs** (NVIDIA A100 / H100) for AI and MD  
  > *- **Tens of Petabytes of hierarchical storage**  
  > 
  > *Any student or researcher at a Czech university can access these resources through **eduID.cz** using PBS batch queues (`qsub`), Cloud OpenStack, or Kubernetes containers!"*

---

### **SLIDE 15: The Definitive "Can vs. Cannot" Matrix (24:15 – 24:45)**
- **Visual:** Executive side-by-side green vs. red summary grid.
- **Stage Direction:** Rapid, authoritative delivery. This is the takeaway mental map.
- **Spoken Script:**
  > *"To summarize our 25-minute journey, here is your definitive matrix:*
  > 
  > *We **CAN** reliably calculate: electronic ground and excited states of small molecules; activation barriers and transition states in QM; microsecond dynamics of proteins and bilayers in MD; virtual screens of millions of drug leads; and static 3D protein folds with AI.*
  > 
  > *We **CANNOT** directly compute: chemical bond breaking with classical force fields; macroscopic timescales in all-atom detail; exact free energies in seconds; or trustworthy AI predictions outside the Applicability Domain.*
  > 
  > *Knowing where these boundaries lie is what separates a true computational scientist from someone who simply presses 'Run' and hopes for magic."*

---

### **SLIDE 16: The Next Frontier: Study at UPOL (24:15 – 24:45)**
- **Visual:** Dedicated educational slide detailing the new bachelor study program **"Počítačová chemie"** (in accreditation process), 4 curriculum pillars, and career pathways.
- **Stage Direction:** Enthusiastic presentation of the study program. Connect the lecture's methodologies (QM, MD, QSAR, AI) directly to the courses taught at UPOL.
- **Spoken Script:**
  > *"Now let's look to the future: how do we educate the next generation of in silico scientists?
  > 
  > *In chemical practice, computational chemistry is no longer an optional add-on—it is the driving engine of modern pharmaceutical development, green energy materials, and enzyme design.
  > 
  > *To prepare students for this revolution, Palacký University Olomouc has prepared the brand new bachelor study program **Počítačová chemie**, currently in the accreditation process!
  > 
  > *The curriculum stands on 4 interconnected pillars:
  > *1. **Quantum Chemistry:** Orbitals, reaction mechanisms, and UV-Vis spectroscopy.
  > *2. **Molecular Dynamics:** Protein folding, membrane transport, and drug channels.
  > *3. **Chemoinformatics & Drug Design:** SMILES, molecular graphs, and QSAR modeling.
  > *4. **Python, AI & High-Performance Computing:** Neural networks and scientific cluster programming.
  > 
  > *Students gain hands-on research experience from Year 1, working directly on our supercomputers and participating in global open-science projects like MolMeDB and MOLEonline!"*

---

### **SLIDE 17: Thank You For Your Attention! • Q&A & Discussion (24:45 – 25:00)**
- **Visual:** Hero closing card with speaker contact (Prof. Karel Berka, `karel.berka@upol.cz`, `karelberka.io`), logos, public funding acknowledgements (EU, GA ČR, MŠMT, Olomoucký kraj, ELIXIR CZ, MetaCentrum), and links to UPOL tools (`molmedb.upol.cz`, `moleonline.cz`).
- **Stage Direction:** Open, welcoming posture. Acknowledge sponsors and collaborators, thank the audience warmly, and open the floor for questions.
- **Spoken Script:**
  > *"Thank you very much for your attention throughout this 25-minute journey across the scales of computational chemistry at Chemie v praxi!
  > 
  > *I would like to express our gratitude to our public funding bodies—the European Union, the Czech Science Foundation (GA ČR), MŠMT, Olomoucký kraj, ELIXIR CZ, and CESNET MetaCentrum—as well as our wonderful domestic and international collaborators from Cambridge, Oxford, CEITEC, and industry partners.
  > 
  > *You can explore all our tools and databases online at **kfc.upol.cz**, **molmedb.upol.cz**, and **moleonline.cz**.
  > 
  > *I now warmly invite you to the discussion—thank you, and I look forward to all your questions!"*

---

## 🛡️ Q&A Defense Sheet: Common Audience Questions & Model Answers

### Q1: *"Will Quantum Computers solve the $O(N^7)$ scaling problem and make classical computers obsolete in chemistry?"*
**Answer:**
> *"Quantum computing is indeed very promising for quantum chemistry because quantum systems are naturally suited to simulate quantum mechanics (as Richard Feynman originally envisioned). In particular, the Quantum Phase Estimation (QPE) algorithm can, in theory, achieve polynomial scaling for strong electron correlation problems where classical CCSD(T) fails.*
> 
> *However, fault-tolerant quantum computers with thousands of logical, error-corrected qubits are still years away. For the foreseeable future (the next 10–20 years), classical supercomputers augmented by GPU accelerators and AI-driven interatomic potentials will remain the workhorses of everyday chemical research."*

### Q2: *"Why can't we just use a 10 fs or 50 fs timestep in Molecular Dynamics to make it run 5 to 25 times faster?"*
**Answer:**
> *"Because of numerical integration resonance. In any molecule, C-H bond stretching vibrates with a period of about $10\text{ femtoseconds}$. In numerical differential equation solvers (like the Verlet or Leap-frog algorithm), you must sample a periodic motion at least 5 to 10 times per oscillation (the Nyquist-Shannon sampling principle) to accurately calculate forces.*
> 
> *If you set $\Delta t = 10\text{ fs}$, an atom might move past its equilibrium point into the core of an adjacent atom in a single step. The Lennard-Jones $r^{-12}$ repulsive force will calculate an astronomical value, and your entire molecular simulation will literally 'explode'—the atoms will shoot off with infinite velocities. Even with SHAKE/LINCS algorithms constraining hydrogen bonds, $2\text{ fs}$ to $4\text{ fs}$ is the physical ceiling for all-atom simulations."*

### Q3: *"Since AlphaFold can predict protein structures so well, does this mean experimental X-ray crystallography and Cryo-EM are no longer needed?"*
**Answer:**
> *"Not at all! First, AlphaFold was trained on the Protein Data Bank (PDB)—which exists solely because of 50 years of tireless experimental X-ray crystallography, NMR, and Cryo-EM. Without experimental data, AI cannot learn.*
> 
> *Second, AlphaFold produces static models. When an experimentalist solves a Cryo-EM structure of a ribosome or GPCR receptor, they often observe multiple distinct conformational states, bound cofactors, post-translational modifications (glycosylation, phosphorylation), and bound drug molecules. AlphaFold is a tremendous accelerator, but wet-lab structural biology remains the final ground truth."*

### Q4: *"Can we use reactive force fields like ReaxFF to break bonds without full Quantum Mechanics?"*
**Answer:**
> *"Yes, excellent question! ReaxFF is a specialized semi-classical approach that uses bond-order calculations to allow bond breaking and formation within a classical molecular dynamics framework.*
> 
> *However, ReaxFF requires extensive, delicate parameterization for every specific combination of elements and reaction types. It also requires a very small timestep (often $0.1$ to $0.25\text{ fs}$) because bond-order calculations are stiff, making it $50\times$ slower than standard non-reactive MD. It is fantastic for combustion, shockwaves, or catalysis on metal surfaces, but still cannot model electronic excited states or photochemistry."*

### Q5: *"How do you know if an in silico prediction is correct if no experiment has ever been performed yet?"*
**Answer:**
> *"That is the essence of true predictive science! We rely on rigorous validation protocols:*
> *1. **Benchmarking:** We test our method on 20 or 50 structurally similar compounds that DO have experimental data, confirming that our error is within acceptable limits (e.g., $< 1\text{ kcal/mol}$).*
> *2. **Cross-validation and Applicability Domain:** We ensure the query compound lies well within the parameter space of the force field or AI model.*
> *3. **Sensitivity Analysis:** We run multiple independent simulation replicas with different starting velocities to ensure statistical convergence.*
> 
> *Ultimately, the gold standard of science remains: computation generates a bold, testable hypothesis, and an experimental colleague synthesizes the molecule to prove or disprove it."*
