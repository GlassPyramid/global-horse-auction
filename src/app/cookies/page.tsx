import { LegalLayout } from "@/components/legal/LegalLayout";

const en = {
  title: "Cookie Policy",
  subtitle: "What cookies we use, why, and how to control them.",
  lastUpdated: "Last updated: July 2026",
  sections: [
    {
      heading: "What Are Cookies",
      content: [
        "Cookies are small text files placed on your device when you visit a website. They allow the site to remember information about your visit — such as your language preference or login status — so you don't have to re-enter it every time.",
        "We also use similar technologies such as local storage to store your language preference on your device.",
      ],
    },
    {
      heading: "Cookies We Use",
      content: [
        "We use a small number of cookies, all of which serve a specific purpose:",
        {
          list: [
            "Authentication cookie (sb-auth-token): set by Supabase when you log in. Keeps you signed in during your session. Essential — the platform cannot function without it. Expires when you sign out or after 7 days of inactivity.",
            "Language preference (lang): stores your choice of English or Dutch. Set when you use the language switcher. Expires after 1 year.",
            "Session cookie: a temporary cookie that expires when you close your browser, used to maintain your browsing session.",
          ],
        },
      ],
    },
    {
      heading: "What We Do Not Use",
      content: [
        "We do not use tracking cookies, advertising cookies, or third-party analytics cookies. We do not share cookie data with advertising networks. We do not use fingerprinting or cross-site tracking.",
        "If we ever introduce analytics or marketing tools in the future, we will update this policy and ask for your consent before setting any non-essential cookies.",
      ],
    },
    {
      heading: "Third-Party Services",
      content: [
        "Our platform is built on Supabase (database and authentication) and hosted on Vercel. These services may set their own technical cookies as part of operating the infrastructure. These cookies are strictly necessary for the platform to function and are covered by each provider's own privacy policy.",
        "If you embed or view a video linked from YouTube or Vimeo on a horse listing, those platforms may set their own cookies when the video is loaded. We recommend reviewing their cookie policies if this concerns you.",
      ],
    },
    {
      heading: "How to Control Cookies",
      content: [
        "You can control cookies through your browser settings. Most browsers allow you to view, block, or delete cookies. Note that blocking essential cookies will prevent the platform from functioning correctly — you will not be able to log in or place bids.",
        {
          list: [
            "Chrome: Settings → Privacy and security → Cookies and other site data",
            "Firefox: Settings → Privacy & Security → Cookies and Site Data",
            "Safari: Preferences → Privacy → Manage Website Data",
            "Edge: Settings → Cookies and site permissions",
          ],
        },
        "You can delete all cookies stored by our site at any time through your browser. Your language preference will reset to English if you do so.",
      ],
    },
    {
      heading: "Changes to This Policy",
      content: [
        "We will update this Cookie Policy if we introduce new cookies or change the way we use existing ones. The date at the top of this page will always reflect when it was last revised.",
      ],
    },
  ],
};

const nl = {
  title: "Cookiebeleid",
  subtitle: "Welke cookies wij gebruiken, waarom, en hoe u ze kunt beheren.",
  lastUpdated: "Laatst bijgewerkt: juli 2026",
  sections: [
    {
      heading: "Wat Zijn Cookies",
      content: [
        "Cookies zijn kleine tekstbestanden die op uw apparaat worden geplaatst wanneer u een website bezoekt. Ze stellen de site in staat om informatie over uw bezoek te onthouden — zoals uw taalvoorkeur of inlogstatus — zodat u dit niet elke keer opnieuw hoeft in te voeren.",
        "Wij gebruiken ook soortgelijke technologieën zoals lokale opslag om uw taalvoorkeur op uw apparaat op te slaan.",
      ],
    },
    {
      heading: "Cookies Die Wij Gebruiken",
      content: [
        "Wij gebruiken een klein aantal cookies, elk met een specifiek doel:",
        {
          list: [
            "Authenticatiecookie (sb-auth-token): ingesteld door Supabase wanneer u inlogt. Houdt u ingelogd tijdens uw sessie. Essentieel — het platform kan niet functioneren zonder. Verloopt bij uitloggen of na 7 dagen inactiviteit.",
            "Taalvoorkeur (lang): slaat uw keuze voor Engels of Nederlands op. Ingesteld wanneer u de taalwisselaar gebruikt. Verloopt na 1 jaar.",
            "Sessiecookie: een tijdelijke cookie die verloopt wanneer u uw browser sluit, gebruikt om uw browsersessie te onderhouden.",
          ],
        },
      ],
    },
    {
      heading: "Wat Wij Niet Gebruiken",
      content: [
        "Wij gebruiken geen tracking cookies, advertentiecookies of cookies van derden voor analyses. Wij delen geen cookiegegevens met advertentienetwerken. Wij gebruiken geen fingerprinting of cross-site tracking.",
        "Als wij in de toekomst analyse- of marketingtools introduceren, zullen wij dit beleid bijwerken en om uw toestemming vragen voordat wij niet-essentiële cookies plaatsen.",
      ],
    },
    {
      heading: "Diensten van Derden",
      content: [
        "Ons platform is gebouwd op Supabase (database en authenticatie) en gehost op Vercel. Deze diensten kunnen eigen technische cookies plaatsen als onderdeel van de infrastructuur. Deze cookies zijn strikt noodzakelijk voor het functioneren van het platform en vallen onder het eigen privacybeleid van elke provider.",
        "Als u een video bekijkt die is gelinkt vanaf YouTube of Vimeo op een paardenpagina, kunnen die platforms eigen cookies plaatsen wanneer de video wordt geladen. Wij raden u aan hun cookiebeleid te raadplegen als dit u zorgen baart.",
      ],
    },
    {
      heading: "Hoe U Cookies Kunt Beheren",
      content: [
        "U kunt cookies beheren via uw browserinstellingen. De meeste browsers stellen u in staat om cookies te bekijken, blokkeren of verwijderen. Let op: het blokkeren van essentiële cookies verhindert het correct functioneren van het platform — u kunt dan niet inloggen of biedingen plaatsen.",
        {
          list: [
            "Chrome: Instellingen → Privacy en beveiliging → Cookies en andere sitegegevens",
            "Firefox: Instellingen → Privacy & beveiliging → Cookies en sitegegevens",
            "Safari: Voorkeuren → Privacy → Websitegegevens beheren",
            "Edge: Instellingen → Cookies en sitemachtigingen",
          ],
        },
        "U kunt alle cookies die door onze site zijn opgeslagen op elk moment via uw browser verwijderen. Uw taalvoorkeur wordt dan teruggezet naar Engels.",
      ],
    },
    {
      heading: "Wijzigingen in Dit Beleid",
      content: [
        "Wij zullen dit Cookiebeleid bijwerken als wij nieuwe cookies introduceren of de manier waarop wij bestaande cookies gebruiken wijzigen. De datum bovenaan deze pagina geeft altijd weer wanneer het voor het laatst is herzien.",
      ],
    },
  ],
};

export default function CookiesPage() {
  return <LegalLayout en={en} nl={nl} />;
}
