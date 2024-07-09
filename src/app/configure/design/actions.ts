"use server";

import { db } from "@/db";
import { BulletinModel } from "@prisma/client";

export type SaveConfigArgs = {
  model: BulletinModel;
  configId: string;
};

export async function saveConfig({ model, configId }: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: { model },
  });
}
