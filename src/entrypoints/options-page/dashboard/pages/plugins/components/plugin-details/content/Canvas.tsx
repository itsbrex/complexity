import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InlineCode } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CanvasPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="x-flex x-max-w-screen-lg x-flex-col x-gap-4">
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
        <div className="x-flex x-flex-col x-gap-2">
          <p className="x-text-muted-foreground">
            For the AI to acknowledge the ability to use Canvas, you need to use
            this{" "}
            <a
              href="https://cdn.cplx.app/prompts/canvas-instruction-claude.md"
              target="_blank"
              rel="noopener noreferrer"
              className="x-text-primary hover:x-underline"
            >
              pre-prompt
            </a>
            , either use Space&apos;s Instruction or directly place it before
            the query. Feel free to modify it as you see fit, however make sure
            to follow the specified syntaxes.
          </p>
          <p className="x-text-muted-foreground">
            <span className="x-text-foreground x-underline">Otherwise</span>,
            Complexity will show a &quot;Render in Canvas&quot; button on the
            header of applicable code blocks.
          </p>
          <div className="x-mt-6">
            <table className="x-w-full x-border-collapse x-rounded-lg x-border x-border-border">
              <thead>
                <tr className="x-bg-secondary x-text-secondary-foreground">
                  <th className="x-border x-border-border x-p-2"></th>
                  <th className="x-border x-border-border x-p-2 x-font-semibold">
                    Without pre-prompt
                  </th>
                  <th className="x-border x-border-border x-p-2 x-font-semibold">
                    With pre-prompt
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    AI awareness
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    ❌
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    Render condition
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    Manual activation
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    Automatic rendering by the AI
                  </td>
                </tr>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    Supported languages
                  </td>
                  <td className="x-border x-border-border x-p-2">
                    <div className="x-mx-auto x-flex x-w-max x-flex-col x-items-center x-gap-1">
                      <InlineCode className="x-w-max">✅ markdown</InlineCode>
                      <InlineCode className="x-w-max">✅ mermaid</InlineCode>
                      <InlineCode className="x-w-max">✅ markmap</InlineCode>
                      <InlineCode className="x-w-max">✅ plantuml</InlineCode>
                      <InlineCode className="x-w-max">✅ html</InlineCode>
                      <InlineCode className="x-w-max">❌ react</InlineCode>
                    </div>
                  </td>
                  <td className="x-border x-border-border x-p-2">
                    <div className="x-mx-auto x-flex x-w-max x-flex-col x-items-center x-gap-1">
                      <InlineCode className="x-w-max">✅ markdown</InlineCode>
                      <InlineCode className="x-w-max">✅ mermaid</InlineCode>
                      <InlineCode className="x-w-max">✅ markmap</InlineCode>
                      <InlineCode className="x-w-max">✅ plantuml</InlineCode>
                      <InlineCode className="x-w-max">✅ html</InlineCode>
                      <InlineCode className="x-w-max">✅ react</InlineCode>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    Supported language models
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center x-text-muted-foreground">
                    any
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    Works best with DeepSeek-R1, o1, and Claude 3.5 Sonnet
                  </td>
                </tr>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    Ease of use
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center x-text-muted-foreground">
                    No setup required
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
                    Requires pre-prompt
                  </td>
                </tr>
                <tr>
                  <td className="x-border x-border-border x-bg-secondary x-p-2 x-text-secondary-foreground">
                    Action
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center x-text-muted-foreground">
                    No action required
                  </td>
                  <td className="x-border x-border-border x-p-2 x-text-center">
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
