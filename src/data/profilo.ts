/*
 * Dati del profilo (pannello del letto)
 * Solo contenuti: i componenti in components/interfaccia/profilo li
 * mostrano. Per cambiare un testo si modifica solo questo file.
 *
 * - chiSono: paragrafi della presentazione
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
  ruolo: "Sviluppatore full-stack · ex fashion designer",

  chiSono: [
    "Sono cresciuto tra stoffe e cartamodelli, per il lavoro dei miei genitori. La passione per la tecnologia è arrivata con i videogiochi ed è cresciuta con il 3D.",
    "Per anni ho disegnato capi e collezioni, tra Milano e la Cina, dove ho anche insegnato fashion design. Poi ho scelto lo sviluppo web, per portare un progetto dall’idea al risultato finale con le mie mani.",
    "Mi piace costruire siti chiari e semplici da usare, e credo che il confronto con il team sia la parte più importante della progettazione.",
    "Ho cambiato gli strumenti di lavoro, non il metodo.",
  ],

  percorso: [
    {
      periodo: "Feb – Set 2026",
      ruolo: "Master Full-Stack Development",
      luogo: "Epicode",
      descrizione:
        "Front-end con React e TypeScript, back-end con Java e Spring Boot.",
    },
    {
      periodo: "2023 – 2025",
      ruolo: "Docente di Fashion Design",
      luogo: "Wenzhou Polytechnic, Cina",
    },
    {
      periodo: "2021 – 2023",
      ruolo: "Fashion Designer",
      luogo: "Family First, Milano",
      descrizione: "Progettazione di capi e collezioni.",
    },
    {
      periodo: "DA CONFERMARE",
      ruolo: "Fashion Designer freelance",
      luogo: "Moda, fotografia e tessile",
    },
    {
      periodo: "2015 – 2018",
      ruolo: "Fashion Design",
      luogo: "Istituto Marangoni, Milano",
    },
  ] satisfies TappaPercorso[],

  competenze: [
    {
      titolo: "Sviluppo",
      voci: [
        "TypeScript",
        "JavaScript",
        "React",
        "Redux Toolkit",
        "Three.js / React Three Fiber",
        "HTML e CSS",
        "Java",
        "Spring Boot",
        "JPA / Hibernate",
        "Git",
      ],
    },
    {
      titolo: "3D e design",
      voci: ["Blender", "CLO3D", "Photoshop", "Illustrator", "InDesign"],
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
    }, // DA CONFERMARE: è quella da pubblicare?
    {
      etichetta: "LinkedIn",
      valore: "DA CONFERMARE",
      href: "https://www.linkedin.com/in/DA-CONFERMARE",
    },
    {
      etichetta: "GitHub",
      valore: "DA CONFERMARE",
      href: "https://github.com/DA-CONFERMARE",
    },
  ] satisfies Contatto[],

  cv: {
    etichetta: "Scarica il CV (PDF)",
    href: "/documenti/CV_Roberto_Cafagna.pdf", // DA CONFERMARE: metti il file in public/documenti/
  },
}
