import { load } from "cheerio";
import dayjs from "dayjs";

const NEW_CASE_IDX = 213 as const;
const ACTIVE_CASE_IDX = 257 as const;
const RECOVERED_IDX = 566 as const;
const DIED_IDX = 567 as const;

export async function getCases(date?: string) {
  try {
    const url =
      "https://public.tableau.com/views/COVID-19CasesandDeathsinthePhilippines_15866705872710/Home?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Fpublic.tableau.com%2F&:embed_code_version=3&:tabs=no&:toolbar=yes&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&publish=yes&:loadOrderID=0";
    const site = await fetch(url);
    var text = await site.text();
    const $ = load(text);
    const tsConfigJson = JSON.parse($("#tsConfigContainer").text());

    const body = new URLSearchParams();
    body.append("sheet_id", tsConfigJson.sheetId);

    const tableauData = await fetch(
      `https://public.tableau.com${tsConfigJson.vizql_root}/bootstrapSession/sessions/${tsConfigJson.sessionid}`,
      {
        method: "POST",
        body: body,
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
          .dataSegments["0"].dataColumns[2].dataValues[2],
      ).toDate();

      const newCases = inputs[NEW_CASE_IDX];
      const activeCases = inputs[ACTIVE_CASE_IDX];
      const recovered = inputs[RECOVERED_IDX];
      const died = inputs[DIED_IDX];
      const totalCases = activeCases + recovered + died;
      return {
        activeCases,
        recovered,
        died,
        totalCases,
        newCases,
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
