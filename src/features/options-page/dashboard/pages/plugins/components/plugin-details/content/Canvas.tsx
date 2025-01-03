import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InlineCode } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CanvasPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="tw-flex tw-max-w-screen-lg tw-flex-col tw-gap-4 tw-overflow-auto">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:canvas"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) => (draft.plugins["thread:canvas"].enabled = checked),
          )
        }
      />

      {settings?.plugins["thread:canvas"].enabled && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <p className="tw-text-muted-foreground">
            For the AI to acknowledge the ability to use Canvas, you need to use
            this{" "}
            <a
              href="https://cdn.cplx.app/prompts/canvas-instruction-claude.md"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-text-primary hover:tw-underline"
            >
              pre-prompt
            </a>
            , either use Space&apos;s Instruction or directly place it before
            the query. Feel free to modify it as you see fit, however make sure
            to follow the specified syntaxes.
          </p>
          <p className="tw-text-muted-foreground">
            <span className="tw-text-foreground tw-underline">Otherwise</span>,
            Complexity will show a &quot;Render in Canvas&quot; button on the
            header of applicable code blocks.
          </p>
          <div className="tw-mt-6">
            <table className="tw-w-full tw-border-collapse tw-rounded-lg tw-border tw-border-border">
              <thead>
                <tr className="tw-bg-secondary tw-text-secondary-foreground">
                  <th className="tw-border tw-border-border tw-p-2"></th>
                  <th className="tw-border tw-border-border tw-p-2 tw-font-semibold">
                    NOT use pre-prompt
                  </th>
                  <th className="tw-border tw-border-border tw-p-2 tw-font-semibold">
                    Use pre-prompt
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tw-border tw-border-border tw-bg-secondary tw-p-2 tw-text-secondary-foreground">
                    AI awareness
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    ❌
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="tw-border tw-border-border tw-bg-secondary tw-p-2 tw-text-secondary-foreground">
                    Render condition
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    Manual activation
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    Automatically render by the AI
                  </td>
                </tr>
                <tr>
                  <td className="tw-border tw-border-border tw-bg-secondary tw-p-2 tw-text-secondary-foreground">
                    Supported languages
                  </td>
                  <td className="tw-border tw-border-border tw-p-2">
                    <div className="tw-mx-auto tw-flex tw-w-max tw-flex-col tw-items-center tw-gap-1">
                      <InlineCode className="tw-w-max">✅ markdown</InlineCode>
                      <InlineCode className="tw-w-max">✅ mermaid</InlineCode>
                      <InlineCode className="tw-w-max">✅ plantuml</InlineCode>
                      <InlineCode className="tw-w-max">✅ html</InlineCode>
                      <InlineCode className="tw-w-max">❌ react</InlineCode>
                    </div>
                  </td>
                  <td className="tw-border tw-border-border tw-p-2">
                    <div className="tw-mx-auto tw-flex tw-w-max tw-flex-col tw-items-center tw-gap-1">
                      <InlineCode className="tw-w-max">✅ markdown</InlineCode>
                      <InlineCode className="tw-w-max">✅ mermaid</InlineCode>
                      <InlineCode className="tw-w-max">✅ plantuml</InlineCode>
                      <InlineCode className="tw-w-max">✅ html</InlineCode>
                      <InlineCode className="tw-w-max">✅ react</InlineCode>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="tw-border tw-border-border tw-bg-secondary tw-p-2 tw-text-secondary-foreground">
                    Ease of use
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center tw-text-muted-foreground">
                    No setup required
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    Requires pre-prompt
                  </td>
                </tr>
                <tr>
                  <td className="tw-border tw-border-border tw-bg-secondary tw-p-2 tw-text-secondary-foreground">
                    Action
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center tw-text-muted-foreground">
                    No action required
                  </td>
                  <td className="tw-border tw-border-border tw-p-2 tw-text-center">
                    <Button
                      onClick={() => {
                        window.open(
                          "https://perplexity.ai/#/cplx/canvas/install-pre-prompt-as-space",
                          "_blank",
                        );
                      }}
                    >
                      Install Canvas pre-prompt as a Space
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
