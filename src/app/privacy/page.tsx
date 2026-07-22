import { LegalLayout } from "@/components/legal/LegalLayout";

const en = {
  title: "Privacy Policy",
  subtitle: "How we collect, use and protect your personal data.",
  lastUpdated: "Last updated: July 2026",
  sections: [
    {
      heading: "Who We Are",
      content: [
        "Global Horse Auction is an online auction platform specialising in the sale of verified sport horses. We operate from the Netherlands and serve buyers and sellers across more than 60 countries.",
        "Global Horse Auction is the data controller responsible for your personal data. You can reach us at info@globalhorseauction.com or by phone at +31 20 123 4567.",
      ],
    },
    {
      heading: "What Data We Collect",
      content: [
        "We collect personal data that you provide directly to us when you register an account, place a bid, submit a horse, or contact us. This includes:",
        {
          list: [
            "Identity data: full name, date of birth",
            "Contact data: email address, phone number, country of residence",
            "Account data: username, password (hashed), account preferences",
            "Transaction data: bids placed, horses purchased, payment records",
            "Horse submission data: horse details, health documents, images, video",
            "Communication data: messages sent through our contact forms or support channels",
          ],
        },
        "We also collect certain technical data automatically when you visit our platform, including your IP address, browser type, device type, pages visited, and time spent on the platform.",
      ],
    },
    {
      heading: "How We Use Your Data",
      content: [
        "We use your personal data for the following purposes:",
        {
          list: [
            "To create and manage your account",
            "To process bids and facilitate auction transactions",
            "To review and approve horse submissions",
            "To send you bid confirmations, auction updates, and account notifications",
            "To comply with legal and regulatory obligations",
            "To detect and prevent fraud or misuse of the platform",
            "To improve the platform based on usage patterns",
          ],
        },
        "We do not use your data for automated decision-making or profiling that produces legal or similarly significant effects.",
      ],
    },
    {
      heading: "Legal Basis for Processing",
      content: [
        "We process your personal data on the following legal grounds under GDPR:",
        {
          list: [
            "Contract: processing necessary to fulfil our agreement with you when you register or place a bid",
            "Legal obligation: processing required to comply with applicable laws",
            "Legitimate interests: improving the platform, preventing fraud, ensuring platform security",
            "Consent: where we ask for your explicit permission, such as for marketing communications",
          ],
        },
      ],
    },
    {
      heading: "Who We Share Your Data With",
      content: [
        "We do not sell your personal data. We share data only in the following limited circumstances:",
        {
          list: [
            "With sellers, when a bid is accepted, to facilitate the transaction",
            "With payment processors, to handle auction payments securely",
            "With veterinary or certification bodies, where required for horse verification",
            "With our hosting and infrastructure providers (Supabase, Vercel) who process data on our behalf under strict data processing agreements",
            "With legal authorities, if required by law or court order",
          ],
        },
      ],
    },
    {
      heading: "International Data Transfers",
      content: [
        "Our platform infrastructure is hosted within the European Economic Area. Where data is transferred outside the EEA, we ensure adequate safeguards are in place including Standard Contractual Clauses approved by the European Commission.",
      ],
    },
    {
      heading: "How Long We Keep Your Data",
      content: [
        "We retain your personal data only as long as necessary for the purposes described in this policy:",
        {
          list: [
            "Account data: for the lifetime of your account, plus 2 years after closure",
            "Transaction records: 7 years, to comply with financial record-keeping obligations",
            "Horse submission data: 3 years after the submission is resolved",
            "Technical logs: 90 days",
          ],
        },
      ],
    },
    {
      heading: "Your Rights",
      content: [
        "Under GDPR, you have the following rights regarding your personal data:",
        {
          list: [
            "Right of access: request a copy of the data we hold about you",
            "Right to rectification: ask us to correct inaccurate or incomplete data",
            "Right to erasure: request deletion of your data where there is no overriding legal basis to retain it",
            "Right to restriction: ask us to pause processing of your data in certain circumstances",
            "Right to data portability: receive your data in a structured, machine-readable format",
            "Right to object: object to processing based on legitimate interests",
            "Right to withdraw consent: at any time, for processing based on consent",
          ],
        },
        "To exercise any of these rights, contact us at info@globalhorseauction.com. We will respond within 30 days. You also have the right to lodge a complaint with your national data protection authority.",
      ],
    },
    {
      heading: "Data Security",
      content: [
        "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include encrypted data transmission (TLS), hashed password storage, role-based access controls, and regular security reviews.",
        "No method of transmission over the internet is 100% secure. If you become aware of any security concern related to your account, please notify us immediately.",
      ],
    },
    {
      heading: "Cookies",
      content: [
        "We use cookies and similar technologies to operate the platform and improve your experience. For detailed information about which cookies we use and how to control them, please see our Cookie Policy.",
      ],
    },
    {
      heading: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page and, where the changes are significant, notify you by email or via an in-platform notice.",
      ],
    },
  ],
};

const nl = {
  title: "Privacybeleid",
  subtitle: "Hoe wij uw persoonsgegevens verzamelen, gebruiken en beschermen.",
  lastUpdated: "Laatst bijgewerkt: juli 2026",
  sections: [
    {
      heading: "Wie Wij Zijn",
      content: [
        "Global Horse Auction is een online veilingplatform gespecialiseerd in de verkoop van geverifieerde sportpaarden. Wij zijn gevestigd in Nederland en bedienen kopers en verkopers in meer dan 60 landen.",
        "Global Horse Auction is de verwerkingsverantwoordelijke voor uw persoonsgegevens. U kunt ons bereiken via info@globalhorseauction.com of telefonisch op +31 20 123 4567.",
      ],
    },
    {
      heading: "Welke Gegevens Wij Verzamelen",
      content: [
        "Wij verzamelen persoonsgegevens die u ons rechtstreeks verstrekt bij het aanmaken van een account, het plaatsen van een bod, het indienen van een paard of het contact met ons opnemen. Dit omvat:",
        {
          list: [
            "Identiteitsgegevens: volledige naam, geboortedatum",
            "Contactgegevens: e-mailadres, telefoonnummer, woonland",
            "Accountgegevens: gebruikersnaam, wachtwoord (versleuteld), accountinstellingen",
            "Transactiegegevens: geplaatste biedingen, aangekochte paarden, betalingsgegevens",
            "Paard-aanvraaggegevens: paardendetails, gezondheidsdocumenten, foto's, video",
            "Communicatiegegevens: berichten via onze contactformulieren of ondersteuningskanalen",
          ],
        },
        "Wij verzamelen ook bepaalde technische gegevens automatisch wanneer u ons platform bezoekt, waaronder uw IP-adres, browsertype, apparaattype, bezochte pagina's en de tijd die u op het platform doorbrengt.",
      ],
    },
    {
      heading: "Hoe Wij Uw Gegevens Gebruiken",
      content: [
        "Wij gebruiken uw persoonsgegevens voor de volgende doeleinden:",
        {
          list: [
            "Aanmaken en beheren van uw account",
            "Verwerken van biedingen en afhandelen van veiltransacties",
            "Beoordelen en goedkeuren van paard-aanvragen",
            "Verzenden van biedbevestigingen, veilingupdates en accountmeldingen",
            "Voldoen aan wettelijke en regelgevende verplichtingen",
            "Opsporen en voorkomen van fraude of misbruik van het platform",
            "Verbeteren van het platform op basis van gebruikspatronen",
          ],
        },
        "Wij gebruiken uw gegevens niet voor geautomatiseerde besluitvorming of profilering die juridisch of anderszins significante gevolgen heeft.",
      ],
    },
    {
      heading: "Rechtsgrondslag voor Verwerking",
      content: [
        "Wij verwerken uw persoonsgegevens op basis van de volgende grondslagen onder de AVG:",
        {
          list: [
            "Overeenkomst: verwerking noodzakelijk voor de uitvoering van onze overeenkomst met u bij registratie of het plaatsen van een bod",
            "Wettelijke verplichting: verwerking vereist om te voldoen aan toepasselijke wetgeving",
            "Gerechtvaardigd belang: verbetering van het platform, fraudepreventie, platformbeveiliging",
            "Toestemming: waar wij uw expliciete toestemming vragen, zoals voor marketingcommunicatie",
          ],
        },
      ],
    },
    {
      heading: "Met Wie Wij Gegevens Delen",
      content: [
        "Wij verkopen uw persoonsgegevens niet. Wij delen gegevens uitsluitend in de volgende beperkte omstandigheden:",
        {
          list: [
            "Met verkopers, wanneer een bod wordt geaccepteerd, ter afhandeling van de transactie",
            "Met betalingsverwerkers, voor veilige afhandeling van veilingbetalingen",
            "Met dierenartsen of certificeringsinstanties, waar vereist voor paardenverificatie",
            "Met onze hosting- en infrastructuurproviders (Supabase, Vercel) die gegevens namens ons verwerken onder strikte verwerkersovereenkomsten",
            "Met wettelijke autoriteiten, indien vereist door wet of rechterlijk bevel",
          ],
        },
      ],
    },
    {
      heading: "Internationale Doorgifte van Gegevens",
      content: [
        "Onze platforminfrastructuur is gehost binnen de Europese Economische Ruimte. Waar gegevens buiten de EER worden doorgegeven, zorgen wij voor passende waarborgen, waaronder door de Europese Commissie goedgekeurde Standaard Contractuele Clausules.",
      ],
    },
    {
      heading: "Hoe Lang Wij Uw Gegevens Bewaren",
      content: [
        "Wij bewaren uw persoonsgegevens alleen zolang als noodzakelijk voor de in dit beleid beschreven doeleinden:",
        {
          list: [
            "Accountgegevens: gedurende de looptijd van uw account, plus 2 jaar na sluiting",
            "Transactiegegevens: 7 jaar, ter naleving van financiële bewaarverplichtingen",
            "Paard-aanvraaggegevens: 3 jaar nadat de aanvraag is afgehandeld",
            "Technische logs: 90 dagen",
          ],
        },
      ],
    },
    {
      heading: "Uw Rechten",
      content: [
        "Op grond van de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens:",
        {
          list: [
            "Recht op inzage: verzoek om een kopie van de gegevens die wij over u bewaren",
            "Recht op rectificatie: verzoek om correctie van onjuiste of onvolledige gegevens",
            "Recht op verwijdering: verzoek om verwijdering van uw gegevens waar geen dwingende wettelijke grondslag bestaat om ze te bewaren",
            "Recht op beperking: verzoek om opschorting van de verwerking van uw gegevens in bepaalde omstandigheden",
            "Recht op gegevensoverdraagbaarheid: ontvang uw gegevens in een gestructureerd, machineleesbaar formaat",
            "Recht om bezwaar te maken: bezwaar maken tegen verwerking op basis van gerechtvaardigd belang",
            "Recht om toestemming in te trekken: op elk moment, voor verwerking op basis van toestemming",
          ],
        },
        "Om een van deze rechten uit te oefenen, neem contact met ons op via info@globalhorseauction.com. Wij reageren binnen 30 dagen. U heeft ook het recht om een klacht in te dienen bij uw nationale gegevensbeschermingsautoriteit (in Nederland: de Autoriteit Persoonsgegevens).",
      ],
    },
    {
      heading: "Gegevensbeveiliging",
      content: [
        "Wij treffen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen ongeoorloofde toegang, verlies of openbaarmaking. Deze omvatten versleutelde gegevensoverdracht (TLS), versleutelde wachtwoordopslag, rolgebaseerde toegangscontroles en regelmatige beveiligingsbeoordelingen.",
        "Geen enkele methode van overdracht via internet is 100% veilig. Als u een beveiligingsprobleem met betrekking tot uw account ontdekt, informeer ons dan onmiddellijk.",
      ],
    },
    {
      heading: "Cookies",
      content: [
        "Wij gebruiken cookies en soortgelijke technologieën om het platform te laten functioneren en uw ervaring te verbeteren. Raadpleeg ons Cookiebeleid voor gedetailleerde informatie over welke cookies wij gebruiken en hoe u deze kunt beheren.",
      ],
    },
    {
      heading: "Wijzigingen in Dit Beleid",
      content: [
        "Wij kunnen dit Privacybeleid van tijd tot tijd bijwerken. Wanneer wij dit doen, zullen wij de datum bovenaan deze pagina bijwerken en, indien de wijzigingen significant zijn, u per e-mail of via een platformmelding informeren.",
      ],
    },
  ],
};

export default function PrivacyPage() {
  return <LegalLayout en={en} nl={nl} />;
}
