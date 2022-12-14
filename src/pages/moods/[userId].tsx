import { type Mood } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

// placeholder config
const MOOD_LIMIT = 6;

const MyMoods = ({
  moods,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>mood🤔tracker</title>
        <meta name="description" content="Mood journaling website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#302b63] to-[#24243e]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Link href="/">
            <h1 className="text-5xl font-extrabold tracking-tight text-white hover:text-white/70 sm:text-[5rem]">
              These are your latest moods:
            </h1>
          </Link>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {moods.map((mood) => (
              <div
                className="rounded-xl bg-white/20 p-4 text-white"
                key={mood.id}
              >
                <span className="font-semibold italic">
                  &quot;{mood.text}&quot;
                </span>
                <span></span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default MyMoods;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  const moods: Mood[] | undefined = await prisma.mood.findMany({
    where: {
      userId: {
        equals: session?.user?.id,
      },
    },
    take: MOOD_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      moods: JSON.parse(JSON.stringify(moods)) as Mood[],
    },
  };
};
