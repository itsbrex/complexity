import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { ThreadMessageApiResponse } from "@/services/pplx-api/pplx-api.types";
import { jsonUtils } from "@/utils/utils";

type ThreadAnswer = {
  answer: string;
  web_results: WebResult[];
};

type WebResult = {
  name: string;
  url: string;
  snippet: string;
};

export class ThreadExport {
  private static extractQuery(message: ThreadMessageApiResponse) {
    return message.query_str;
  }

  private static extractAnswer(message: ThreadMessageApiResponse) {
    const text = jsonUtils.safeParse(message.text);

    return (
      (text.answer as string) ||
      (
        jsonUtils.safeParse(
          text[text.length - 1].content.answer,
        ) as ThreadAnswer
      ).answer
    );
  }

  private static extractWebResults(
    message: ThreadMessageApiResponse,
  ): WebResult[] {
    const text = jsonUtils.safeParse(message.text);

    const webResults = text.web_results as WebResult[] | undefined;

    if (webResults != null) {
      return webResults;
    }

    return (
      jsonUtils.safeParse(text[text.length - 1].content.answer) as ThreadAnswer
    ).web_results;
  }

  private static getModelName(displayModel: string): string {
    return (
      languageModels.find((model) => model.code === displayModel)?.label ||
      displayModel
    );
  }

  private static formatWebResults(webResults: WebResult[]) {
    return webResults
      .map(
        (webResult, index) =>
          `[${index + 1}] [${webResult.name}](${webResult.url})`,
      )
      .join("  \n");
  }

  private static formatAnswerWithCitations(params: {
    query: string;
    answer: string;
    modelName: string;
    formattedWebResults: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, modelName, formattedWebResults, includeQuery } =
      params;

    return [
      `# ${query}`,
      "",
      `# Answer (${modelName}):`,
      answer,
      "",
      "# Citations:",
      formattedWebResults,
    ]
      .slice(-(includeQuery ? 0 : 4))
      .join("  \n");
  }

  private static trimReferences(answer: string, webResults: WebResult[]) {
    webResults.forEach((_, index) => {
      const findText = `\\[${index + 1}\\]`;
      answer = answer.replace(new RegExp(findText, "g"), "");
    });

    return answer;
  }

  private static formatAnswerWithoutCitations(params: {
    query: string;
    answer: string;
    modelName: string;
    includeQuery: boolean;
  }): string {
    const { query, answer, modelName, includeQuery } = params;

    return [`# ${query}`, "", `# Answer (${modelName}):`, answer]
      .slice(-(includeQuery ? 0 : 1))
      .join("  \n");
  }

  private static exportMessage({
    message,
    includeCitations,
    includeQuery,
  }: {
    message: ThreadMessageApiResponse;
    includeCitations: boolean;
    includeQuery?: boolean;
  }) {
    const query = ThreadExport.extractQuery(message);
    const rawAnswer = ThreadExport.extractAnswer(message);
    const webResults = ThreadExport.extractWebResults(message);
    const formattedWebResults = ThreadExport.formatWebResults(webResults);
    const modelName = ThreadExport.getModelName(message.display_model);

    if (includeCitations) {
      return ThreadExport.formatAnswerWithCitations({
        query,
        answer: rawAnswer,
        modelName,
        formattedWebResults,
        includeQuery: includeQuery ?? true,
      });
    }

    const answerWithoutCitations = ThreadExport.trimReferences(
      rawAnswer,
      webResults,
    );

    return ThreadExport.formatAnswerWithoutCitations({
      query,
      answer: answerWithoutCitations,
      modelName,
      includeQuery: includeQuery ?? true,
    });
  }

  static exportThread({
    threadJSON,
    includeCitations,
    messageIndex,
  }: {
    threadJSON: ThreadMessageApiResponse[];
    includeCitations: boolean;
    messageIndex?: number;
  }) {
    if (messageIndex != null) {
      return ThreadExport.exportMessage({
        message: threadJSON[messageIndex],
        includeCitations,
        includeQuery: false,
      });
    }

    return threadJSON
      .map((message) =>
        ThreadExport.exportMessage({
          message,
          includeCitations,
        }),
      )
      .join("  \n---  \n\n\n");
  }
}
