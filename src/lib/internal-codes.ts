import { prisma } from "@/lib/prisma";

export function extractInternalCodeNumber(code: string) {
  const match = code.match(/(\d+)\s*$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function formatInternalCode(value: number) {
  return `ECO-${String(value).padStart(3, "0")}`;
}

export async function getNextInternalCode() {
  try {
    const dresses = await prisma.dress.findMany({
      select: {
        internalCode: true,
      },
    });

    const maxNumber = dresses.reduce((currentMax, dress) => {
      const parsed = extractInternalCodeNumber(dress.internalCode);
      if (parsed === null || Number.isNaN(parsed)) {
        return currentMax;
      }

      return Math.max(currentMax, parsed);
    }, 0);

    return formatInternalCode(maxNumber + 1);
  } catch {
    return formatInternalCode(1);
  }
}
