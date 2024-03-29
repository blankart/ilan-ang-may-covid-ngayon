import { load } from "cheerio";
import dayjs from "dayjs";

const URL =
  "https://public.tableau.com/views/COVID-19CasesandDeathsinthePhilippines_15866705872710/Home?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Fpublic.tableau.com%2F&:embed_code_version=3&:tabs=no&:toolbar=yes&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&publish=yes&:loadOrderID=0";

export async function getCases(date?: string) {
  try {
    const site = await fetch(URL);
    let text = await site.text();
    const $ = load(text);
    const tsConfigJson = JSON.parse($("#tsConfigContainer").text());

    const body = new URLSearchParams();
    body.append("sheet_id", tsConfigJson.sheetId);

    const tableauData = await fetch(
      `https://public.tableau.com${tsConfigJson.vizql_root}/bootstrapSession/sessions/${tsConfigJson.sessionid}`,
      {
        method: "POST",
        body,
      },
    );
    text = await tableauData.text();
    const jsonRegex = /\d+;({.*})\d+;({.*})/g;
    const match = jsonRegex.exec(text);
    if (match) {
      const _data = JSON.parse(match[2]);
      const inputs: number[] =
        _data.secondaryInfo.presModelMap.dataDictionary.presModelHolder.genDataDictionaryPresModel
          .dataSegments["0"].dataColumns[0].dataValues;
      const FOUND_DATE = dayjs(
        _data.secondaryInfo.presModelMap.dataDictionary.presModelHolder.genDataDictionaryPresModel
          .dataSegments["0"].dataColumns[4].dataValues[
          _data.secondaryInfo.presModelMap.dataDictionary.presModelHolder.genDataDictionaryPresModel
            .dataSegments["0"].dataColumns[4].dataValues.length - 1
        ],
      ).toDate();

      const [ACTIVE_CASE_IDX, RECOVERED_IDX, DIED_IDX] =
        _data.secondaryInfo.presModelMap.vizData.presModelHolder.genPresModelMapPresModel
          .presModelMap.Epi_BreakdownBar.presModelHolder.genVizDataPresModel.paneColumnsData
          .paneColumnsList[0].vizPaneColumns[2].aliasIndices;

      const [NEW_CASE_IDX] =
        _data.secondaryInfo.presModelMap.vizData.presModelHolder.genPresModelMapPresModel
          .presModelMap["Epi_TotalCases#"].presModelHolder.genVizDataPresModel.paneColumnsData
          .paneColumnsList[0].vizPaneColumns[2].aliasIndices;

      const newCases = inputs[NEW_CASE_IDX];
      const activeCases = inputs[ACTIVE_CASE_IDX];
      const recovered = inputs[RECOVERED_IDX];
      const died = inputs[DIED_IDX];
      const totalCases = activeCases + recovered + died;
      return {
        activeCases: activeCases ?? null,
        recovered: recovered ?? null,
        died: died ?? null,
        totalCases: totalCases ?? null,
        newCases: newCases ?? null,
        date: FOUND_DATE.getTime(),
      };
    }

    return {
      activeCases: null,
      recovered: null,
      died: null,
      newCases: null,
      date: null,
      newRecovered: null,
      newDied: null,
    };
  } catch {
    return {
      activeCases: null,
      recovered: null,
      died: null,
      newCases: null,
      date: null,
      newRecovered: null,
      newDied: null,
    };
  }
}
