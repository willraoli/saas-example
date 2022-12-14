import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const addMoodHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(403).send("Unauthorized request: you must be logged in");
  }

  try {
    const { userId, text } = req.body;
    const mood = await prisma.mood.create({
      data: {
        text,
        userId,
        createdAt: new Date(),
      },
    });
    res.status(201).json(mood);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default addMoodHandler;
