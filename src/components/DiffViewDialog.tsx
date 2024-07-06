import { useCallback, useEffect, useState } from 'react';

import $ from 'jquery';
import Prism from 'prismjs';

import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useToggle } from '@uidotdev/usehooks';

import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import prismJs from '@/utils/prism';

type MyDiffMethod = 'lines' | 'words' | 'chars';

const mapDiffMethod = (diffMethod: MyDiffMethod) => {
  switch (diffMethod) {
    case 'lines':
      return DiffMethod.LINES;
    case 'words':
      return DiffMethod.WORDS;
    case 'chars':
      return DiffMethod.CHARS;
  }
};

type DiffViewDialog = {
  oldText: string;
  newText: string;
  open: boolean;
  toggleOpen: (open?: boolean) => void;
  lang: string;
};

export default function DiffViewDialog({
  open,
  toggleOpen,
  oldText,
  newText,
  lang,
}: DiffViewDialog) {
  const [diffMethod, setDiffMethod] = useState<MyDiffMethod>('lines');
  const [unifiedView, toggleUnifiedView] = useToggle(false);

  const isDiff = oldText !== newText;

  const highlightSyntax = useCallback(
    (str: string) => {
      if (!prismJs.isSupportedLang(lang)) return <span>{str}</span>;

      return !str ? (
        <span />
      ) : (
        <span
          style={{ display: 'inline' }}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(str, Prism.languages[lang], lang),
          }}
        />
      );
    },
    [lang]
  );

  useEffect(() => {
    setDiffMethod('lines');
    toggleUnifiedView(!lang);
  }, [open, setDiffMethod, toggleUnifiedView, lang]);

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="!tw-max-w-[90vw] tw-max-h-[90vh] tw-font-sans">
        <DialogHeader className="tw-text-3xl">{`Diff Viewer (${lang || 'plain-text'})`}</DialogHeader>
        <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-auto">
          {isDiff && (
            <div className="tw-ml-auto tw-flex tw-flex-col tw-gap-2 tw-p-2">
              <div className="tw-flex tw-gap-2 tw-items-center tw-ml-auto">
                <Label>Unified view</Label>
                <Checkbox
                  checked={unifiedView}
                  onCheckedChange={(checked) => toggleUnifiedView(!!checked)}
                />
              </div>
              <RadioGroup
                value={diffMethod}
                className="tw-grid-flow-col tw-w-max"
                onValueChange={(value) => setDiffMethod(value as MyDiffMethod)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lines" id="r1" />
                  <Label htmlFor="r1">Lines</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="words" id="r2" />
                  <Label htmlFor="r2">Words</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chars" id="r3" />
                  <Label htmlFor="r3">Chars</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {!isDiff && (
            <div className="tw-text-lg tw-text-foreground">
              No changes were detected
            </div>
          )}
          <div className="tw-overflow-auto tw-max-h-[600px]">
            <div className="tw-border tw-border-border tw-font-mono">
              <ReactDiffViewer
                oldValue={oldText}
                newValue={newText}
                splitView={!unifiedView}
                compareMethod={mapDiffMethod(diffMethod)}
                useDarkTheme={$('html').hasClass('dark')}
                styles={{
                  variables: {
                    dark: {
                      diffViewerBackground: 'var(--secondary)',
                      gutterBackground: 'var(--secondary)',
                      diffViewerTitleBackground: 'var(--secondary)',
                      addedBackground: '#12261f',
                      addedGutterBackground: '#12261f',
                      wordAddedBackground: '#1d5730',
                    },
                  },
                }}
                renderContent={highlightSyntax}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
