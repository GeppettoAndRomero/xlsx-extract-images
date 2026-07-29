import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Extract Images from Excel (.xlsx/.xlsm), No Upload | runlocally',
    description:
      'Extract embedded images from an Excel .xlsx or .xlsm workbook and download them in a ZIP. Processing stays in your browser; files are not uploaded.',
    ogTitle: 'Extract Images from Excel Workbooks in Your Browser',
    ogDescription:
      'Collect images stored in an .xlsx or .xlsm workbook into a ZIP without uploading the workbook.',
  },

  hero: {
    h1: 'Extract Images from Excel',
    tagline:
      'Collect images stored in an .xlsx or .xlsm workbook and download them as a ZIP. Nothing is uploaded.',
  },

  intro: {
    h2: 'Download the images packaged inside an Excel workbook',
    paras: [
      'Excel workbooks in the .xlsx and .xlsm formats are OOXML packages. Images embedded in these files are normally stored under xl/media/. This tool reads that folder and places its files in a separate ZIP.',
      'The image bytes are copied as stored. The tool does not resize, convert, or recompress them, and it does not read cell values or edit the workbook.',
    ],
  },

  privacy: {
    h2: 'Why the workbook stays on your device',
    lead:
      'The workbook is opened by code running in your browser. The extraction process has no server component:',
    points: [
      'The input package is read in browser memory.',
      'Only files under xl/media/ are copied into the output ZIP.',
      'No request is made with the workbook or its extracted images.',
      'The source code is available under the MIT License.',
    ],
    note:
      'You can inspect the browser Network panel while extracting: the workbook data is not sent in a request.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to extract workbook images',
    steps: [
      {
        h3: 'Choose one workbook',
        p: 'Select or drop one .xlsx or .xlsm file. Files larger than 100 MB are not accepted.',
      },
      {
        h3: 'Let the browser read the package',
        p: 'The tool looks for packaged files under xl/media/. It does not run workbook macros.',
      },
      {
        h3: 'Download the ZIP',
        p: 'When images are present, a ZIP named after the workbook downloads. If none are found, the page reports that result without creating a download.',
      },
    ],
  },

  faqHeading: 'Questions about extracting Excel images',
  faq: [
    {
      q: 'Is my Excel file uploaded?',
      a: 'No. The workbook is read in your browser and is not sent to a server. The output ZIP is also created in the browser.',
    },
    {
      q: 'Which Excel formats are supported?',
      a: 'The tool accepts .xlsx and .xlsm files up to 100 MB. The older binary .xls format is not supported.',
    },
    {
      q: 'Can it open a password-protected workbook?',
      a: 'No. Password-protected Excel files cannot be opened as a regular OOXML ZIP package, so the tool reports that the file could not be opened.',
    },
    {
      q: 'Does extraction change image quality?',
      a: 'No. Each image file is copied byte for byte from the workbook package. Its format and the filename assigned inside the workbook are retained.',
    },
    {
      q: 'Are linked images, charts, and shapes included?',
      a: 'Only files physically stored under xl/media/ are included. Externally linked images are not part of the workbook package. Charts and shapes are not extracted unless Excel stored a separate image file for them there.',
    },
    {
      q: 'What happens if the workbook has no embedded images?',
      a: 'The page reports that no embedded images were found and does not start a download. This is treated as a normal result, not an error.',
    },
    {
      q: 'Does the tool read cells or run macros?',
      a: 'No. It only reads the workbook ZIP structure and copies packaged media files. Cell contents are not extracted, sheets are not modified, and VBA macros in .xlsm files are not executed.',
    },
    {
      q: 'Can I use it offline?',
      a: 'Yes. After the site assets have been cached by the installed service worker, the extraction code can run without a network connection.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },
};
