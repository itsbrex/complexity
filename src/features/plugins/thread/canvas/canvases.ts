import { ComponentType, SVGProps } from "react";
import { BiLogoReact } from "react-icons/bi";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { LuCodeXml } from "react-icons/lu";
import { PiArticleDuotone } from "react-icons/pi";

import {
  CanvasLanguage,
  CanvasState,
} from "@/features/plugins/thread/canvas/canvas.types";
import MermaidCanvasActionButtonsWrapper from "@/features/plugins/thread/canvas/components/action-buttons/Mermaid/Wrapper";
import PlantUmlCanvasActionButtonsWrapper from "@/features/plugins/thread/canvas/components/action-buttons/PlantUml/Wrapper";
import SandpackCanvasActionButtonsWrapper from "@/features/plugins/thread/canvas/components/action-buttons/Sandpack/Wrapper";
import HtmlRenderer from "@/features/plugins/thread/canvas/components/renderer/Html";
import MarkdownRenderer from "@/features/plugins/thread/canvas/components/renderer/Markdown";
import MermaidRenderer from "@/features/plugins/thread/canvas/components/renderer/Mermaid";
import PlantUmlRenderer from "@/features/plugins/thread/canvas/components/renderer/PlantUml";
import ReactRenderer from "@/features/plugins/thread/canvas/components/renderer/React";
import { csLoaderRegistry } from "@/services/cs-loader-registry";

export const CANVAS_LANGUAGES = {
  markdown: "markdown",
  mermaid: "mermaid",
  html: "html",
  react: "react",
  plantuml: "plantuml",
} as const satisfies Partial<Record<string, string>>;

export const CANVAS_INTERPRETED_LANGUAGES: Record<string, CanvasLanguage> = {
  svg: "html",
  md: "markdown",
  mmd: "mermaid",
  plantuml: "plantuml",
};

export const CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT: Record<
  CanvasLanguage,
  string
> = {
  markdown: t("plugin-canvas:canvas.toggle.preview"),
  mermaid: t("plugin-canvas:canvas.toggle.preview"),
  html: t("plugin-canvas:canvas.toggle.preview"),
  react: t("plugin-canvas:canvas.toggle.preview"),
  plantuml: t("plugin-canvas:canvas.toggle.preview"),
};

export const CANVAS_LANGUAGE_RAW_TOGGLE_TEXT: Record<CanvasLanguage, string> = {
  markdown: t("plugin-canvas:canvas.toggle.markdown.raw"),
  mermaid: t("plugin-canvas:canvas.toggle.code"),
  html: t("plugin-canvas:canvas.toggle.code"),
  react: t("plugin-canvas:canvas.toggle.code"),
  plantuml: t("plugin-canvas:canvas.toggle.code"),
};

export const CANVAS_INITIAL_STATE: Record<CanvasLanguage, CanvasState> = {
  markdown: "preview",
  mermaid: "code",
  html: "code",
  react: "code",
  plantuml: "code",
};

type CanvasPlaceholders = Record<
  CanvasLanguage,
  {
    icon: ComponentType<SVGProps<SVGElement>>;
    defaultTitle: string;
    description: string;
  }
>;

export let CANVAS_PLACEHOLDERS: CanvasPlaceholders = {} as CanvasPlaceholders;

csLoaderRegistry.register({
  id: "plugin:thread:canvas:codeBlockPlaceholdersData",
  dependencies: ["lib:i18next"],
  loader: () => {
    CANVAS_PLACEHOLDERS = {
      markdown: {
        icon: PiArticleDuotone,
        defaultTitle: "Markdown",
        description: t("plugin-canvas:canvas.placeholder.markdown.description"),
      },
      mermaid: {
        icon: LiaProjectDiagramSolid,
        defaultTitle: "Mermaid",
        description: t("plugin-canvas:canvas.placeholder.mermaid.description"),
      },
      html: {
        icon: LuCodeXml,
        defaultTitle: "HTML",
        description: t("plugin-canvas:canvas.placeholder.html.description"),
      },
      react: {
        icon: BiLogoReact,
        defaultTitle: "React",
        description: t("plugin-canvas:canvas.placeholder.react.description"),
      },
      plantuml: {
        icon: LiaProjectDiagramSolid,
        defaultTitle: "PlantUML",
        description: t("plugin-canvas:canvas.placeholder.mermaid.description"),
      },
    };
  },
});

export const CANVAS_RENDERER: Record<CanvasLanguage, ComponentType> = {
  mermaid: MermaidRenderer,
  markdown: MarkdownRenderer,
  html: HtmlRenderer,
  react: ReactRenderer,
  plantuml: PlantUmlRenderer,
};

export const CANVAS_LANGUAGE_ACTION_BUTTONS: Record<
  CanvasLanguage,
  ComponentType | null
> = {
  mermaid: MermaidCanvasActionButtonsWrapper,
  html: null,
  react: null,
  markdown: null,
  plantuml: PlantUmlCanvasActionButtonsWrapper,
};
