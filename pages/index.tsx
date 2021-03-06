import type { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import dayjs from "dayjs";
import { getCases } from "../services/cases";
import dynamic from "next/dynamic";
const DarkModeToggle = dynamic(() => import("../components/DarkModeToggle"), { ssr: false });

function numberWithCommas(x: number) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  activeCases,
  recovered,
  died,
  date,
  newCases,
  lastUpdated,
}) => {
  const _todaysDate = new Date();
  const todaysDate = dayjs(_todaysDate).format("MMMM DD, YYYY");
  const _foundDataDate = date ? new Date(date) : null;
  const foundDataDate = _foundDataDate ? dayjs(_foundDataDate).format("MMMM DD, YYYY") : null;
  const dayDifference = _foundDataDate ? _todaysDate.getDate() - _foundDataDate.getDate() : null;
  let appendedText: string | null = "";
  if (dayDifference === 1) {
    appendedText = "kahapon";
  } else if (dayDifference === 0) {
    appendedText = null;
  } else {
    appendedText = `noong ${foundDataDate}`;
  }
  const fromNotToday = todaysDate !== foundDataDate;
  const lastUpdatedDate = dayjs(new Date(lastUpdated)).format("MMMM D, YYYY h:mm A");

  return (
    <>
      <main className="text-center font-inter dark:bg-gray-900 dark:text-white text-[#000000] p-4 flex flex-col items-center justify-between min-h-screen w-screen">
        <div className="w-full flex justify-end">
          <DarkModeToggle />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-[4rem] font-bold mt-10 leading-[3.5rem] tracking-[-0.20rem]">
            Ilan ang may COVID ngayon?
          </h1>
          {fromNotToday ? (
            <h2 className="text-[1.6rem] leading-8 font-[400] tracking-[-0.12rem] my-4">
              Wala pang datos 😔. Alamin ang bilang ng kaso ng COVID-19 sa Pilipinas 🇵🇭{" "}
              {appendedText} <br />
              {appendedText === "kahapon" && `(${foundDataDate})`}
            </h2>
          ) : (
            <h2 className="text-[1.6rem] leading-8 font-[400] tracking-[-0.12rem] my-4">
              Alamin ang bilang ng kaso ng COVID-19 sa Pilipinas 🇵🇭 ngayong <br />
              {foundDataDate}
            </h2>
          )}
          <p className="italic text-[0.8rem] font-[300]">Last Updated: {lastUpdatedDate}</p>
          <div className="p-6 border-2 rounded-2xl border-yellow-200 dark:border-yellow-600 my-2">
            <p className="font-[600] text-[4.5rem]">
              {newCases ? numberWithCommas(newCases) : null}
            </p>
            <p className="uppercase text-[2rem]">bagong kaso {appendedText}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 w-[min(100%,1200px)] py-2">
            <div className="rounded-2xl p-6 bg-yellow-200 dark:bg-yellow-600">
              <p className="font-[600] text-[2.8rem] opacity-90">
                {activeCases ? numberWithCommas(activeCases) : null}
              </p>
              <p className="uppercase opacity-80 font-[200]">aktibong kaso</p>
            </div>
            <div className="rounded-2xl p-6 bg-green-400 dark:bg-green-800">
              <p className="font-[600] text-[2.8rem] opacity-90">
                {recovered ? numberWithCommas(recovered) : null}
              </p>
              <p className="uppercase opacity-80 font-[200]">gumaling</p>
            </div>
            <div className="rounded-2xl p-6 bg-red-300 dark:bg-red-700">
              <p className="font-[600] text-[2.8rem] opacity-90">
                {died ? numberWithCommas(died) : null}
              </p>
              <p className="uppercase opacity-80 font-[200]">namatay</p>
            </div>
          </div>
          <p className="italic text-[0.8rem] font-[300]">Data Source: Department of Health</p>
        </div>
        <div>
          <p className="text-[0.7rem]">© Ilan Ang May Covid Ngayon?</p>
        </div>
      </main>
    </>
  );
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  return {
    props: {
      ...(await getCases()),
      lastUpdated: new Date().getTime(),
    },
    revalidate: 60,
  };
}

export default Home;
