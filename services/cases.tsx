export async function getCases(date?: string) {
  try {
    const INITIAL_BULLETIN_NUMBER = 721;
    const INITIAL_DATE = new Date("03/05/2022");
    const CURRENT_DATE = date ? new Date(date) : new Date();

    if (!date) {
      CURRENT_DATE.setTime(CURRENT_DATE.getTime() + 1_000 * 60 * 60 * 8);
    }

    const DAY_DIFF = Math.floor(
      (CURRENT_DATE.getTime() - INITIAL_DATE.getTime()) / (1_000 * 60 * 60 * 24),
    );
    const FOUND_DATE = CURRENT_DATE;

    let data = await fetch(
      `https://doh.gov.ph/covid19casebulletin${INITIAL_BULLETIN_NUMBER + DAY_DIFF}`,
    ).then((res) => res.text());

    if (data.match(/<title>.*?(Page not found).*?<\/title>/)) {
      data = await fetch(
        `https://doh.gov.ph/covid19casebulletin${INITIAL_BULLETIN_NUMBER + DAY_DIFF - 1}`,
      ).then((res) => res.text());
      FOUND_DATE.setDate(FOUND_DATE.getDate() - 1);
    }

    const newCases = parseInt(
      data.match(/ng ([0-9,]*) na karagdagang kaso/)?.[1]?.replace(/,/g, "") ?? "",
      10,
    );
    if (newCases) {
      const activeCases = parseInt(
        data.match(/\(([^\)]*)\) ang aktibong kaso/)?.[1]?.replace(/,/g, "") ?? "",
        10,
      );
      const recovered = parseInt(
        data.match(/\(([^\)]*)\) na ang gumaling/)?.[1]?.replace(/,/g, "") ?? "",
        10,
      );
      const died = parseInt(
        data.match(/\(([^\)]*)\) ang namatay/)?.[1]?.replace(/,/g, "") ?? "",
        10,
      );
      const newRecovered = parseInt(
        data.match(/naitalang ([0-9,]*) na gumaling at/)?.[1]?.replace(/,/g, "") ?? "",
        10,
      );
      const newDied = parseInt(
        data.match(/at ([0-9,]*) na pumanaw/)?.[1]?.replace(/,/g, "") ?? "",
        10,
      );
      const totalCases = activeCases + recovered + died;

      return {
        activeCases,
        recovered,
        died,
        totalCases,
        newCases,
        newRecovered,
        newDied,
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
