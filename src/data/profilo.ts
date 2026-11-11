/*
 * Dati del profilo (pannello del letto)
 * Solo contenuti: i componenti in components/interfaccia/profilo li
 * mostrano. Per cambiare un testo si modifica solo questo file.
 *
 * - chiSono: paragrafi della presentazione (l'ultimo è la chiusa)
 * - percorso: dal più recente al più vecchio
 * - competenze: gruppi di voci (mostrati come etichette)
 * - contatti: href = link completo (mailto:, https://)
 * - cv: file in public/documenti/
 */
export type TappaPercorso = {
  periodo: string
  ruolo: string
  luogo: string
  descrizione?: string
}

export type GruppoCompetenze = {
  titolo: string
  voci: string[]
}

export type Contatto = {
  etichetta: string
  valore: string
  href: string
}

export const PROFILO = {
  nome: "Roberto Cafagna",
  ruolo: "Sviluppatore full-stack · 3D e UI · ex fashion designer",

  chiSono: [
    "Sono cresciuto tra stoffe e cartamodelli. La passione per la tecnologia è arrivata con i videogiochi ed è cresciuta con il 3D.",
    "Per anni ho disegnato capi e collezioni, tra Milano e la Cina, dove ho anche insegnato fashion design. Poi ho scelto lo sviluppo web, per portare un progetto dall'idea al prodotto finito con le mie mani: dal design in Figma e Blender fino al codice e alla pubblicazione.",
    "Mi piace costruire siti chiari e semplici da usare. Lavoro per piccoli passi, con revisioni frequenti, e credo che il confronto con il team sia la parte più importante della progettazione.",
    "Oggi cerco il mio primo ruolo da sviluppatore, front-end o full-stack, in un team con cui crescere.",
    "Ho cambiato gli strumenti di lavoro, non il metodo.",
  ],

  percorso: [
    {
      periodo: "2026 – oggi",
      ruolo: "Sviluppatore web freelance",
      luogo: "Progetti per attività locali",
      descrizione:
        "Preventivi e siti per ristoranti e negozi in collaborazione con Zebra Studio (Barletta); manutenzione di un e-commerce WooCommerce.",
    },
    {
      periodo: "Feb – Set 2026",
      ruolo: "Master Full-Stack Development",
      luogo: "Epicode",
      descrizione:
        "Front-end con React e TypeScript, back-end con Java, Spring Boot e JPA. Progetti in team, tra cui il gioco The Worst Date.",
    },
    {
      periodo: "Set 2023 – Dic 2025",
      ruolo: "Docente di Fashion Design",
      luogo: "Wenzhou Polytechnic, Cina",
      descrizione:
        "Corsi di progettazione di collezioni e prototipazione dei capi, anche in 3D.",
    },
    {
      periodo: "Giu 2021 – Giu 2023",
      ruolo: "Fashion Designer",
      luogo: "Family First, Milano",
      descrizione:
        "Progettazione di capi e collezioni, dallo schizzo al prototipo.",
    },
    {
      periodo: "2018 – 2021",
      ruolo: "Fashion Designer freelance",
      luogo: "Moda, fotografia e tessile",
      descrizione:
        "Capi, servizi fotografici e progetti tessili. In questi anni nasce NOIA, il mio progetto personale.",
    },
    {
      periodo: "2015 – 2018",
      ruolo: "Fashion Design",
      luogo: "Istituto Marangoni, Milano",
    },
  ] satisfies TappaPercorso[],

  competenze: [
    {
      titolo: "Front-end",
      voci: [
        "TypeScript",
        "JavaScript",
        "React",
        "Redux Toolkit",
        "Three.js / React Three Fiber",
        "HTML e CSS",
        "CSS Modules",
        "Web Audio API",
        "Responsive e accessibilità",
      ],
    },
    {
      titolo: "Back-end",
      voci: ["Java", "Spring Boot", "JPA / Hibernate", "REST API", "SQL"],
    },
    {
      titolo: "Strumenti",
      voci: [
        "Git e GitHub",
        "GitHub Actions",
        "Vite",
        "VS Code",
        "WordPress / WooCommerce",
      ],
    },
    {
      titolo: "3D e design",
      voci: [
        "Blender",
        "CLO3D",
        "Figma",
        "Photoshop",
        "Illustrator",
        "InDesign",
      ],
    },
    {
      titolo: "Lingue",
      voci: ["Italiano · madrelingua", "Inglese · buono", "Cinese · base"],
    },
  ] satisfies GruppoCompetenze[],

  contatti: [
    {
      etichetta: "Email",
      valore: "cafagna.rob@gmail.com",
      href: "mailto:cafagna.rob@gmail.com",
    },
    {
      etichetta: "LinkedIn",
      valore: "roberto-cafagna",
      href: "https://www.linkedin.com/in/roberto-cafagna/",
    },
    {
      etichetta: "GitHub",
      valore: "cafagnarob",
      href: "https://github.com/cafagnarob",
    },
  ] satisfies Contatto[],

  cv: {
    etichetta: "Scarica il CV (PDF)",
    href: "/documenti/CV_Roberto_Cafagna.pdf",
  },
}
