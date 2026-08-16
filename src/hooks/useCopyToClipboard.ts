import { useState } from 'react';

/**
 * Shared copy-to-clipboard behavior for every generator mode.
 *
 * Two paths, because the two outputs have different requirements:
 *
 * - copyRichText copies a live DOM node as formatted HTML, which is what the
 *   chart note needs so bullets and font survive a paste into charting
 *   software. contentEditable is stripped from the clone first, otherwise the
 *   pasted note is editable in the destination application.
 * - copyPlainText copies a string, which is what an email needs. It uses the
 *   async Clipboard API and falls back to the legacy path if that is
 *   unavailable. Both localhost and the deployed HTTPS site are secure
 *   contexts, so the modern API is available in development and production.
 */
export const useCopyToClipboard = (resetAfterMs: number = 2000) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const flagSuccess = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), resetAfterMs);
  };

  const copyRichText = (node: HTMLElement) => {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.removeAttribute('contenteditable');
    clone
      .querySelectorAll('[contenteditable]')
      .forEach((el) => el.removeAttribute('contenteditable'));

    const temp = document.createElement('div');
    // Applied inline so the styles are carried into the clipboard payload
    temp.style.fontFamily = 'Arial';
    temp.style.fontSize = '10pt';
    temp.innerHTML = clone.innerHTML;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);

    const range = document.createRange();
    range.selectNodeContents(temp);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');

    document.body.removeChild(temp);
    window.getSelection()?.removeAllRanges();

    flagSuccess();
  };

  const copyPlainText = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        flagSuccess();
        return;
      }
    } catch {
      // Fall through to the legacy path below
    }

    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);

    flagSuccess();
  };

  return { copySuccess, copyRichText, copyPlainText };
};
