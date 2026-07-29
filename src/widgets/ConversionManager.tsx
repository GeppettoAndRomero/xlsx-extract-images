import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { MAX_FILE_SIZE, sanitizeFileName, validateFile } from '@/utils/fileValidation';
import {
  extractWorkbookImages,
  type ExtractionProgress,
} from '@/utils/xlsxImageExtractEngine';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface ExtractionViewResult {
  sourceName: string;
  downloadName: string;
  imageCount: number;
  totalSize: number;
  blob: Blob | null;
}

interface InteractiveCopy {
  uploadHeading: string;
  uploadSubtitle: string;
  dropClick: string;
  dropOr: string;
  dropSupported: string;
  working: string;
  progress: string;
  resultOne: string;
  resultMany: string;
  resultNone: string;
  downloadAgain: string;
  notificationsAria: string;
  errUnsupported: string;
  errLegacyXls: string;
  errUnsupportedMime: string;
  errFileTooLarge: string;
  errOneFileOnly: string;
  errBusy: string;
  errCannotOpenWorkbook: string;
  errConversionFailed: string;
  errDownloadFailed: string;
}

const copy: Record<string, InteractiveCopy> = {
  en: {
    uploadHeading: 'Extract images from an Excel workbook',
    uploadSubtitle: 'Choose one .xlsx or .xlsm file. The file-size limit is 100 MB.',
    dropClick: 'Choose an Excel file',
    dropOr: 'or drop one file anywhere on the page',
    dropSupported: 'Supported: .xlsx and .xlsm',
    working: 'Opening the workbook…',
    progress: 'Extracting image {completed} of {total}…',
    resultOne: 'Extracted 1 image ({size} total). The ZIP download has started.',
    resultMany: 'Extracted {count} images ({size} total). The ZIP download has started.',
    resultNone: 'No embedded images were found. No download was created.',
    downloadAgain: 'Download ZIP again',
    notificationsAria: 'Notifications',
    errUnsupported: '{name} is not supported. Choose an .xlsx or .xlsm file.',
    errLegacyXls: 'The older .xls format is not supported. Choose an .xlsx or .xlsm file.',
    errUnsupportedMime: 'The browser reported an unsupported file type for {name}.',
    errFileTooLarge: '{name} exceeds the 100 MB file-size limit.',
    errOneFileOnly: 'Choose one .xlsx or .xlsm file at a time.',
    errBusy: 'Another workbook is being processed. Wait for it to finish before choosing another file.',
    errCannotOpenWorkbook:
      'This file could not be opened. It may be password-protected or not a valid Excel workbook.',
    errConversionFailed: 'The images could not be extracted.',
    errDownloadFailed: 'The ZIP file could not be downloaded.',
  },
  ja: {
    uploadHeading: 'Excel ブックから画像を抽出',
    uploadSubtitle: '.xlsx または .xlsm ファイルを 1 件選んでください。上限は 100 MB です。',
    dropClick: 'Excel ファイルを選ぶ',
    dropOr: 'またはページ上に 1 件ドロップ',
    dropSupported: '対応形式: .xlsx、.xlsm',
    working: 'ブックを開いています…',
    progress: '画像を抽出中: {completed}/{total}',
    resultOne: '画像を 1 点抽出しました（合計 {size}）。ZIP のダウンロードを開始しました。',
    resultMany: '画像を {count} 点抽出しました（合計 {size}）。ZIP のダウンロードを開始しました。',
    resultNone: '埋め込み画像が見つかりませんでした。ダウンロードは作成していません。',
    downloadAgain: 'ZIP をもう一度ダウンロード',
    notificationsAria: '通知',
    errUnsupported: '{name} は対応していません。.xlsx または .xlsm ファイルを選んでください。',
    errLegacyXls: '旧形式の .xls には対応していません。.xlsx または .xlsm ファイルを選んでください。',
    errUnsupportedMime: '{name} は、ブラウザから対応外のファイル形式として報告されました。',
    errFileTooLarge: '{name} はファイルサイズの上限 100 MB を超えています。',
    errOneFileOnly: '.xlsx または .xlsm ファイルを 1 件ずつ選んでください。',
    errBusy: '別のブックを処理中です。処理が終わってから次のファイルを選んでください。',
    errCannotOpenWorkbook:
      'このファイルは開けませんでした。パスワード保護されているか、有効な Excel ファイルではない可能性があります。',
    errConversionFailed: '画像を抽出できませんでした。',
    errDownloadFailed: 'ZIP ファイルをダウンロードできませんでした。',
  },
  zh: {
    uploadHeading: '从 Excel 工作簿中提取图片',
    uploadSubtitle: '请选择一个 .xlsx 或 .xlsm 文件，文件大小上限为 100 MB。',
    dropClick: '选择 Excel 文件',
    dropOr: '或将一个文件拖放到页面任意位置',
    dropSupported: '支持格式：.xlsx、.xlsm',
    working: '正在打开工作簿…',
    progress: '正在提取第 {completed}/{total} 张图片…',
    resultOne: '已提取 1 张图片（共 {size}），ZIP 文件已开始下载。',
    resultMany: '已提取 {count} 张图片（共 {size}），ZIP 文件已开始下载。',
    resultNone: '未找到嵌入的图片，因此没有生成下载文件。',
    downloadAgain: '再次下载 ZIP',
    notificationsAria: '通知',
    errUnsupported: '不支持 {name}。请选择 .xlsx 或 .xlsm 文件。',
    errLegacyXls: '不支持旧版 .xls 格式。请选择 .xlsx 或 .xlsm 文件。',
    errUnsupportedMime: '浏览器将 {name} 识别为不受支持的文件类型。',
    errFileTooLarge: '{name} 超过了 100 MB 的文件大小上限。',
    errOneFileOnly: '每次请选择一个 .xlsx 或 .xlsm 文件。',
    errBusy: '另一个工作簿仍在处理中，请等待处理结束后再选择文件。',
    errCannotOpenWorkbook: '无法打开此文件。文件可能受密码保护，或不是有效的 Excel 工作簿。',
    errConversionFailed: '无法提取图片。',
    errDownloadFailed: '无法下载 ZIP 文件。',
  },
  de: {
    uploadHeading: 'Bilder aus einer Excel-Arbeitsmappe extrahieren',
    uploadSubtitle: 'Wähle eine .xlsx- oder .xlsm-Datei aus. Die Dateigröße ist auf 100 MB begrenzt.',
    dropClick: 'Excel-Datei auswählen',
    dropOr: 'oder eine Datei auf der Seite ablegen',
    dropSupported: 'Unterstützt: .xlsx und .xlsm',
    working: 'Arbeitsmappe wird geöffnet…',
    progress: 'Bild {completed} von {total} wird extrahiert…',
    resultOne: '1 Bild extrahiert ({size} insgesamt). Der ZIP-Download wurde gestartet.',
    resultMany: '{count} Bilder extrahiert ({size} insgesamt). Der ZIP-Download wurde gestartet.',
    resultNone: 'Keine eingebetteten Bilder gefunden. Es wurde kein Download erstellt.',
    downloadAgain: 'ZIP erneut herunterladen',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported: '{name} wird nicht unterstützt. Wähle eine .xlsx- oder .xlsm-Datei aus.',
    errLegacyXls: 'Das ältere .xls-Format wird nicht unterstützt. Wähle eine .xlsx- oder .xlsm-Datei aus.',
    errUnsupportedMime: 'Der Browser hat für {name} einen nicht unterstützten Dateityp gemeldet.',
    errFileTooLarge: '{name} überschreitet die Dateigrößenbegrenzung von 100 MB.',
    errOneFileOnly: 'Wähle jeweils eine .xlsx- oder .xlsm-Datei aus.',
    errBusy: 'Eine andere Arbeitsmappe wird noch verarbeitet. Warte, bevor du eine weitere Datei auswählst.',
    errCannotOpenWorkbook:
      'Diese Datei konnte nicht geöffnet werden. Sie ist möglicherweise passwortgeschützt oder keine gültige Excel-Arbeitsmappe.',
    errConversionFailed: 'Die Bilder konnten nicht extrahiert werden.',
    errDownloadFailed: 'Die ZIP-Datei konnte nicht heruntergeladen werden.',
  },
  es: {
    uploadHeading: 'Extraer imágenes de un libro de Excel',
    uploadSubtitle: 'Elige un archivo .xlsx o .xlsm. El límite de tamaño es de 100 MB.',
    dropClick: 'Elegir un archivo de Excel',
    dropOr: 'o suelta un archivo en cualquier parte de la página',
    dropSupported: 'Formatos admitidos: .xlsx y .xlsm',
    working: 'Abriendo el libro…',
    progress: 'Extrayendo la imagen {completed} de {total}…',
    resultOne: 'Se ha extraído 1 imagen ({size} en total). La descarga del ZIP ha comenzado.',
    resultMany: 'Se han extraído {count} imágenes ({size} en total). La descarga del ZIP ha comenzado.',
    resultNone: 'No se encontraron imágenes incrustadas. No se ha creado ninguna descarga.',
    downloadAgain: 'Descargar el ZIP de nuevo',
    notificationsAria: 'Notificaciones',
    errUnsupported: '{name} no es compatible. Elige un archivo .xlsx o .xlsm.',
    errLegacyXls: 'El formato antiguo .xls no es compatible. Elige un archivo .xlsx o .xlsm.',
    errUnsupportedMime: 'El navegador ha identificado {name} como un tipo de archivo no compatible.',
    errFileTooLarge: '{name} supera el límite de tamaño de 100 MB.',
    errOneFileOnly: 'Elige un solo archivo .xlsx o .xlsm cada vez.',
    errBusy: 'Se está procesando otro libro. Espera a que termine antes de elegir otro archivo.',
    errCannotOpenWorkbook:
      'No se pudo abrir este archivo. Puede estar protegido con contraseña o no ser un libro de Excel válido.',
    errConversionFailed: 'No se pudieron extraer las imágenes.',
    errDownloadFailed: 'No se pudo descargar el archivo ZIP.',
  },
};

interface ConversionManagerProps {
  locale?: string;
}

function fill(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template
  );
}

function formatBytes(bytes: number, locale: string): string {
  if (bytes < 1024) return `${bytes} B`;

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${units[unitIndex]}`;
}

function createDownloadName(fileName: string): string {
  const baseName = sanitizeFileName(fileName.replace(/\.(xlsx|xlsm)$/i, '')) || 'workbook';
  return `${baseName}-images.zip`;
}

function startDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = copy[locale] ?? copy.en;
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  const [result, setResult] = useState<ExtractionViewResult | null>(null);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((previous) => [...previous, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (busyRef.current) {
        showErrorToast(t.errBusy);
        return;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        showErrorToast(
          resolveErrorMessage(
            new AppError(validation.error ?? 'errConversionFailed', {
              name: file.name,
              maxMB: MAX_FILE_SIZE / (1024 * 1024),
            }),
            t as unknown as Record<string, string>
          )
        );
        return;
      }

      busyRef.current = true;
      setBusy(true);
      setProgress(null);
      setResult(null);

      try {
        const extracted = await extractWorkbookImages(file, setProgress);
        const downloadName = createDownloadName(file.name);
        const nextResult: ExtractionViewResult = {
          sourceName: file.name,
          downloadName,
          imageCount: extracted.imageCount,
          totalSize: extracted.totalSize,
          blob: extracted.blob,
        };
        setResult(nextResult);

        if (extracted.blob) {
          startDownload(extracted.blob, downloadName);
        }
      } catch (error) {
        showErrorToast(
          `${file.name}: ${resolveErrorMessage(error, t as unknown as Record<string, string>)}`
        );
      } finally {
        busyRef.current = false;
        setBusy(false);
        setProgress(null);
      }
    },
    [showErrorToast, t]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      try {
        if (files.length !== 1) {
          if (files.length > 0) showErrorToast(t.errOneFileOnly);
          return;
        }
        await processFile(files[0]);
      } finally {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
      }
    },
    [processFile, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      void handleFiles((event as CustomEvent<File[]>).detail);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const downloadAgain = useCallback(() => {
    if (!result?.blob) return;
    try {
      startDownload(result.blob, result.downloadName);
    } catch {
      showErrorToast(t.errDownloadFailed);
    }
  }, [result, showErrorToast, t]);

  const resultMessage =
    result?.imageCount === 0
      ? t.resultNone
      : result?.imageCount === 1
        ? fill(t.resultOne, { size: formatBytes(result.totalSize, locale) })
        : result
          ? fill(t.resultMany, {
              count: result.imageCount,
              size: formatBytes(result.totalSize, locale),
            })
          : '';

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => document.getElementById('file-input')?.click()}
          style={{
            width: '100%',
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: busy ? 'wait' : 'pointer',
          }}
        >
          <span style="display: block; font-size: 3rem; margin-bottom: var(--space-2);" aria-hidden="true">
            🖼️
          </span>
          <span style="display: block; font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle);">
            {t.dropOr}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </span>
        </button>

        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
          onChange={(event) => {
            void handleFiles(Array.from(event.currentTarget.files || []));
            event.currentTarget.value = '';
          }}
          style="display: none;"
        />

        {busy && (
          <div role="status" aria-live="polite" style="color: var(--color-subtle);">
            {progress && progress.total > 0
              ? fill(t.progress, { completed: progress.completed, total: progress.total })
              : t.working}
          </div>
        )}

        {result && (
          <div
            data-testid="extract-result"
            data-image-count={result.imageCount}
            role="status"
            style="padding: var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm);"
          >
            <strong>{result.sourceName}</strong>
            <p style="margin: var(--space-2) 0 0 0; font-size: var(--fs-2); color: var(--color-subtle);">
              {resultMessage}
            </p>
            {result.blob && (
              <div style="margin-top: var(--space-3);">
                <AppButton variant="secondary" onClick={downloadAgain}>
                  {t.downloadAgain}
                </AppButton>
              </div>
            )}
          </div>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
