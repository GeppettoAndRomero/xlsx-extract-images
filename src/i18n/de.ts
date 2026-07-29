import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Bilder aus Excel extrahieren (.xlsx/.xlsm), ohne Upload | runlocally',
    description:
      'Eingebettete Bilder aus einer Excel-Datei im Format .xlsx oder .xlsm extrahieren und als ZIP herunterladen. Die Datei bleibt im Browser.',
    ogTitle: 'Bilder aus Excel-Dateien im Browser extrahieren',
    ogDescription:
      'In .xlsx- und .xlsm-Arbeitsmappen gespeicherte Bilder als ZIP herunterladen, ohne die Excel-Datei hochzuladen.',
  },

  hero: {
    h1: 'Bilder aus Excel extrahieren',
    tagline:
      'Bilder aus einer .xlsx- oder .xlsm-Arbeitsmappe sammeln und als ZIP herunterladen. Es wird nichts hochgeladen.',
  },

  intro: {
    h2: 'Gespeicherte Bilder aus einer Excel-Arbeitsmappe herunterladen',
    paras: [
      'Excel-Arbeitsmappen im Format .xlsx und .xlsm sind OOXML-Pakete aus mehreren Dateien. Eingebettete Bilder liegen normalerweise unter xl/media/. Dieses Tool liest diesen Ordner und legt die enthaltenen Dateien in einem eigenen ZIP-Archiv ab.',
      'Die Bilddaten werden unverändert kopiert. Das Tool ändert weder Größe noch Format und komprimiert die Bilder nicht neu. Zellinhalte werden nicht gelesen und die Arbeitsmappe wird nicht bearbeitet.',
    ],
  },

  privacy: {
    h2: 'Warum die Arbeitsmappe auf deinem Gerät bleibt',
    lead:
      'Die Arbeitsmappe wird durch Code im Browser geöffnet. Für die Extraktion gibt es keine Serverkomponente:',
    points: [
      'Das Eingabepaket wird im Arbeitsspeicher des Browsers gelesen.',
      'Nur Dateien unter xl/media/ werden in das Ausgabe-ZIP kopiert.',
      'Keine Netzwerkanfrage enthält die Arbeitsmappe oder die extrahierten Bilder.',
      'Der Quellcode ist unter der MIT-Lizenz verfügbar.',
    ],
    note:
      'Im Netzwerk-Panel des Browsers kannst du während der Extraktion prüfen, dass die Arbeitsmappendaten nicht versendet werden.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So extrahierst du Bilder aus einer Arbeitsmappe',
    steps: [
      {
        h3: 'Eine Arbeitsmappe auswählen',
        p: 'Wähle eine .xlsx- oder .xlsm-Datei aus oder lege sie auf der Seite ab. Dateien über 100 MB werden nicht angenommen.',
      },
      {
        h3: 'Das Paket im Browser lesen lassen',
        p: 'Das Tool sucht nach Dateien unter xl/media/. Makros in .xlsm-Arbeitsmappen werden nicht ausgeführt.',
      },
      {
        h3: 'ZIP herunterladen',
        p: 'Sind Bilder vorhanden, wird ein nach der Arbeitsmappe benanntes ZIP heruntergeladen. Ohne Bilder zeigt die Seite das Ergebnis an und erstellt keinen Download.',
      },
    ],
  },

  faqHeading: 'Fragen zur Bildextraktion aus Excel',
  faq: [
    {
      q: 'Wird meine Excel-Datei hochgeladen?',
      a: 'Nein. Die Arbeitsmappe wird im Browser gelesen und nicht an einen Server gesendet. Auch das Ausgabe-ZIP entsteht im Browser.',
    },
    {
      q: 'Welche Excel-Formate werden unterstützt?',
      a: 'Unterstützt werden .xlsx- und .xlsm-Dateien bis 100 MB. Das ältere Binärformat .xls wird nicht unterstützt.',
    },
    {
      q: 'Kann das Tool eine passwortgeschützte Arbeitsmappe öffnen?',
      a: 'Nein. Passwortgeschützte Excel-Dateien lassen sich nicht als reguläres OOXML-ZIP öffnen. In diesem Fall meldet die Seite, dass die Datei nicht geöffnet werden konnte.',
    },
    {
      q: 'Verändert die Extraktion die Bildqualität?',
      a: 'Nein. Jede Bilddatei wird Byte für Byte aus dem Paket kopiert. Ihr Format und der intern von Excel vergebene Dateiname bleiben erhalten.',
    },
    {
      q: 'Werden verknüpfte Bilder, Diagramme und Formen mitgenommen?',
      a: 'Enthalten sind nur Dateien, die tatsächlich unter xl/media/ gespeichert sind. Extern verknüpfte Bilder gehören nicht zum Paket. Diagramme und Formen werden nur erfasst, wenn Excel dafür dort eine eigene Bilddatei abgelegt hat.',
    },
    {
      q: 'Was passiert, wenn keine eingebetteten Bilder vorhanden sind?',
      a: 'Die Seite meldet, dass keine eingebetteten Bilder gefunden wurden, und startet keinen Download. Das gilt als reguläres Ergebnis, nicht als Fehler.',
    },
    {
      q: 'Liest das Tool Zellen oder führt es Makros aus?',
      a: 'Nein. Es liest nur die ZIP-Struktur und kopiert Mediendateien. Zellinhalte werden nicht extrahiert, Tabellenblätter nicht geändert und VBA-Makros aus .xlsm-Dateien nicht ausgeführt.',
    },
    {
      q: 'Funktioniert die Extraktion offline?',
      a: 'Ja. Nachdem der Service Worker die Website-Dateien zwischengespeichert hat, kann der Extraktionscode ohne Netzwerkverbindung ausgeführt werden.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Teile des Codes entstehen mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
