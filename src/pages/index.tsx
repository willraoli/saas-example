import { type NextPage } from "next";
import { type Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [text, setText] = useState<string>("");

  const submitMood = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/mood`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userId: session?.user?.id,
        }),
      });
      setText("");
      alert("Mood added with success!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMood = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <>
      <Head>
        <title>mood🤔tracker</title>
        <meta name="description" content="Mood journaling website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#302b63] to-[#24243e]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Greeting session={session} />
          <form onSubmit={submitMood} className="flex gap-2">
            <MoodInput onChange={handleMood} value={text} />
            <SaveMoodButton />
          </form>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {!session && (
              <>
                <LoginButton />
                <AboutButton />
              </>
            )}
            {session && (
              <>
                <MyMoodsButton userId={session?.user?.id} />
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

type MoodInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const MoodInput = (props: MoodInputProps) => {
  return (
    <input
      type="text"
      className="rounded-xl p-4 text-center text-lg font-semibold focus:ring-blue-500"
      placeholder="What's on your mind?"
      onChange={props.onChange}
      value={props.value}
    />
  );
};

type GreetingProps = {
  session: Session | null;
};

const Greeting = (props: GreetingProps) => {
  return (
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
      How are you feeling
      {props.session && ", " + props.session?.user?.name?.split(" ")[0]}?
    </h1>
  );
};

const LogoutButton = () => {
  return (
    <button
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
      onClick={() => signOut()}
    >
      <h3 className="text-2xl font-bold">Sign out →</h3>
      <div className="text-lg">Come back tomorrow. 😉</div>
    </button>
  );
};

const AboutButton = () => {
  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
      <h3 className="text-2xl font-bold">About this website →</h3>
      <div className="text-lg">
        <span className="underline">mood🤔tracker</span> was developed using T3
        stack minus tRPC and is hosted @ Vercel.
      </div>
    </div>
  );
};

const SaveMoodButton = () => {
  return (
    <button
      className="max-w-xs rounded-xl bg-white/30 p-4 text-white hover:bg-white/20"
      type="submit"
    >
      <h3 className="text-xl font-semibold uppercase">+ mood</h3>
    </button>
  );
};

type MyMoodsButtonProps = {
  userId: string | undefined;
};

const MyMoodsButton = (props: MyMoodsButtonProps) => {
  return (
    <Link
      href={`/moods/${props.userId}`}
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
    >
      <h3 className="text-2xl font-bold">My mood swings →</h3>
      <div className="text-lg">Keep tabs on yourself!</div>
    </Link>
  );
};

const LoginButton = () => {
  return (
    <button
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
      onClick={() => signIn("google")}
    >
      <h3 className="text-2xl font-bold">Login with Google →</h3>
      <div className="text-lg">Begin your mood journaling today. 😊</div>
    </button>
  );
};

export default Home;
