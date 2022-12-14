import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const getAllMoodsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(403).send("Unauthorized request: you must be logged in");
  }

  if (req.method === "GET") {
    const moods = await prisma.mood.findMany({
      where: {
        userId: {
          equals: req.query.userId as unknown as string,
        },
      },
    });
    return res.status(200).json(moods);
  } else {
    return res.status(405).send("Method not allowed");
  }
};

export default getAllMoodsHandler;
