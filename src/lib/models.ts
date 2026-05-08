import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";
import { demoDresses, type DressListItem } from "@/lib/dresses";

export type ModelFilters = {
  search?: string;
  size?: string;
};

export type ModelListItem = {
  id: string;
  name: string;
  photoUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  instagramHandle: string | null;
  folderProvider: "OUTLOOK_ONEDRIVE" | "SHAREPOINT" | "GOOGLE_DRIVE" | "OTHER" | null;
  folderUrl: string | null;
  instagramPostUrl: string | null;
  hourlyRate: number | null;
  perDressRate: number | null;
  availability: string | null;
  sizes: string[];
};

export type ModelCatalogData = {
  databaseReady: boolean;
  models: ModelListItem[];
  totalCount: number;
  sizes: string[];
  averagePerDressRate: number;
};

export type ModelDetailData = {
  databaseReady: boolean;
  model: ModelListItem & {
    notes: string | null;
    assignments: Array<{
      id: string;
      assignmentStatus: "SUGGESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
      scheduledDate: Date | null;
      costAgreed: number | null;
      notes: string | null;
      dress: {
        id: string;
        name: string;
        internalCode: string;
        size: string;
      } | null;
    }>;
  };
};

export type AssignmentSuggestion = {
  dressId: string;
  dressName: string;
  internalCode: string;
  dressSize: string;
  brand: string | null;
  workflowStatus: string;
  previewPhotoUrl: string | null;
  suggestedModels: Array<{
    id: string;
    name: string;
    instagramHandle: string | null;
    perDressRate: number | null;
    hourlyRate: number | null;
    sizes: string[];
  }>;
};

export const demoModels: ModelListItem[] = [
  {
    id: "model-1",
    name: "Sofía Ramírez",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    contactPhone: "55 1200 8891",
    contactEmail: "sofia@demo.com",
    instagramHandle: "@sofia.morfo",
    folderProvider: "OUTLOOK_ONEDRIVE",
    folderUrl: "https://outlook.office.com/demo/modelos/sofia",
    instagramPostUrl: "https://instagram.com/p/demo-sofia",
    hourlyRate: 450,
    perDressRate: 180,
    availability: "Lunes y miércoles",
    sizes: ["6", "8"],
  },
  {
    id: "model-2",
    name: "Valentina Cruz",
    photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    contactPhone: "55 7654 2281",
    contactEmail: "valentina@demo.com",
    instagramHandle: "@vale.bridal",
    folderProvider: "SHAREPOINT",
    folderUrl: "https://sharepoint.com/demo/modelos/valentina",
    instagramPostUrl: "https://instagram.com/p/demo-vale",
    hourlyRate: 500,
    perDressRate: 220,
    availability: "Martes y jueves",
    sizes: ["8", "10"],
  },
  {
    id: "model-3",
    name: "Camila Torres",
    photoUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    contactPhone: "55 9918 7782",
    contactEmail: "camila@demo.com",
    instagramHandle: "@camitorres",
    folderProvider: null,
    folderUrl: null,
    instagramPostUrl: null,
    hourlyRate: 420,
    perDressRate: 170,
    availability: "Viernes",
    sizes: ["4", "6"],
  },
  {
    id: "model-4",
    name: "Renata León",
    photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
    contactPhone: "55 3412 5519",
    contactEmail: "renata@demo.com",
    instagramHandle: "@renata.leon",
    folderProvider: "GOOGLE_DRIVE",
    folderUrl: "https://drive.google.com/demo/modelos/renata",
    instagramPostUrl: null,
    hourlyRate: 540,
    perDressRate: 260,
    availability: "Fin de semana",
    sizes: ["10", "12"],
  },
];

export const demoDressAssignments: Record<
  string,
  Array<{
    id: string;
    assignmentStatus: "SUGGESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    scheduledDate: Date | null;
    costAgreed: number | null;
    notes: string | null;
    model: ModelListItem | null;
  }>
> = {
  "demo-14": [
    {
      id: "assignment-1",
      assignmentStatus: "CONFIRMED",
      scheduledDate: new Date("2026-05-02"),
      costAgreed: 180,
      notes: "Reservada para prueba de fitting.",
      model: demoModels[0],
    },
  ],
  "demo-79": [
    {
      id: "assignment-2",
      assignmentStatus: "SUGGESTED",
      scheduledDate: null,
      costAgreed: null,
      notes: "Pendiente de confirmar agenda.",
      model: demoModels[3],
    },
  ],
};

export type DressCompatibleModel = {
  id: string;
  name: string;
  photoUrl: string | null;
  instagramHandle: string | null;
  hourlyRate: number | null;
  perDressRate: number | null;
  availability: string | null;
  sizes: string[];
};

export type DressAssignmentEntry = {
  id: string;
  assignmentStatus: "SUGGESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledDate: Date | null;
  costAgreed: number | null;
  notes: string | null;
  model: DressCompatibleModel | null;
};

export async function getModelCatalogData(
  filters: ModelFilters = {},
): Promise<ModelCatalogData> {
  if (!isDatabaseConfigured()) {
    return buildDemoModelCatalogData(filters);
  }

  try {
    const models = await prisma.modelProfile.findMany({
      where: buildModelWhere(filters),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sizes: {
          orderBy: {
            size: "asc",
          },
        },
      },
    });

    const allModels = await prisma.modelProfile.findMany({
      include: {
        sizes: true,
      },
    });

    const rates = allModels
      .map((model) => model.perDressRate)
      .filter((value): value is NonNullable<typeof value> => value !== null)
      .map((value) => Number(value));

    return {
      databaseReady: true,
      models: models.map((model) => ({
        id: model.id,
        name: model.name,
        photoUrl: model.photoUrl,
        contactPhone: model.contactPhone,
        contactEmail: model.contactEmail,
        instagramHandle: model.instagramHandle,
        folderProvider: model.folderProvider,
        folderUrl: model.folderUrl,
        instagramPostUrl: model.instagramPostUrl,
        hourlyRate: model.hourlyRate ? Number(model.hourlyRate) : null,
        perDressRate: model.perDressRate ? Number(model.perDressRate) : null,
        availability: model.availability,
        sizes: model.sizes.map((item) => item.size),
      })),
      totalCount: allModels.length,
      sizes: Array.from(
        new Set(allModels.flatMap((model) => model.sizes.map((size) => size.size))),
      ).sort(),
      averagePerDressRate:
        rates.length > 0 ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length) : 0,
    };
  } catch {
    return buildDemoModelCatalogData(filters);
  }
}

function buildDemoModelCatalogData(filters: ModelFilters): ModelCatalogData {
  const models = applyModelFilters(demoModels, filters);
  const rates = demoModels.map((model) => model.perDressRate).filter(isNumber);

  return {
    databaseReady: false,
    models,
    totalCount: demoModels.length,
    sizes: Array.from(new Set(demoModels.flatMap((model) => model.sizes))).sort(),
    averagePerDressRate:
      rates.length > 0 ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length) : 0,
  };
}

export async function getAssignmentSuggestions(): Promise<{
  databaseReady: boolean;
  suggestions: AssignmentSuggestion[];
}> {
  if (!isDatabaseConfigured()) {
    return buildDemoAssignmentSuggestions();
  }

  try {
    const [dresses, models] = await Promise.all([
      prisma.dress.findMany({
        where: {
          workflowStatus: {
            in: ["PENDING_PHOTOS", "MODEL_ASSIGNED", "IN_SESSION"],
          },
        },
        orderBy: [{ isNew: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          internalCode: true,
          name: true,
          brand: true,
          size: true,
          workflowStatus: true,
          photos: {
            where: {
              photoType: {
                in: ["COVER", "WORN_BY_MODEL", "FRONT"],
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              imageUrl: true,
              photoType: true,
            },
          },
        },
      }),
      prisma.modelProfile.findMany({
        include: {
          sizes: {
            orderBy: {
              size: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    const normalizedDresses: DressListItem[] = dresses.map((dress) => ({
      id: dress.id,
      internalCode: dress.internalCode,
      name: dress.name,
      brand: dress.brand,
      size: dress.size,
      color: null,
      isNew: false,
      workflowStatus: dress.workflowStatus,
      instagramStatus: "NOT_PUBLISHED",
      receivedAt: null,
      previewPhotoUrl: dress.photos[0]?.imageUrl ?? null,
      previewPhotoType: dress.photos[0]?.photoType ?? null,
    }));

    const normalizedModels: ModelListItem[] = models.map((model) => ({
      id: model.id,
      name: model.name,
      photoUrl: model.photoUrl,
      contactPhone: model.contactPhone,
      contactEmail: model.contactEmail,
      instagramHandle: model.instagramHandle,
      folderProvider: model.folderProvider,
      folderUrl: model.folderUrl,
      instagramPostUrl: model.instagramPostUrl,
      hourlyRate: model.hourlyRate ? Number(model.hourlyRate) : null,
      perDressRate: model.perDressRate ? Number(model.perDressRate) : null,
      availability: model.availability,
      sizes: model.sizes.map((item) => item.size),
    }));

    return {
      databaseReady: true,
      suggestions: buildAssignmentSuggestions(normalizedDresses, normalizedModels),
    };
  } catch {
    return buildDemoAssignmentSuggestions();
  }
}

export async function getModelDetailData(modelId: string): Promise<ModelDetailData | null> {
  if (!isDatabaseConfigured()) {
    const model = demoModels.find((item) => item.id === modelId);

    if (!model) {
      return null;
    }

    const assignments = Object.entries(demoDressAssignments).flatMap(([dressId, entries]) =>
      entries
        .filter((entry) => entry.model?.id === modelId)
        .map((entry) => {
          const dress = demoDresses.find((item) => item.id === dressId);

          return {
            id: entry.id,
            assignmentStatus: entry.assignmentStatus,
            scheduledDate: entry.scheduledDate,
            costAgreed: entry.costAgreed,
            notes: entry.notes,
            dress: dress
              ? {
                  id: dress.id,
                  name: dress.name,
                  internalCode: dress.internalCode,
                  size: dress.size,
                }
              : null,
          };
        }),
    );

    return {
      databaseReady: false,
      model: {
        ...model,
        notes:
          modelId === "model-1"
            ? "Estudia por las tardes; considerar sesiones por la manana."
            : "Sin notas registradas",
        assignments,
      },
    };
  }

  try {
    const model = await prisma.modelProfile.findUnique({
      where: { id: modelId },
      include: {
        sizes: {
          orderBy: {
            size: "asc",
          },
        },
        assignments: {
          include: {
            dress: {
              select: {
                id: true,
                name: true,
                internalCode: true,
                size: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!model) {
      return null;
    }

    return {
      databaseReady: true,
      model: {
        id: model.id,
        name: model.name,
        photoUrl: model.photoUrl,
        contactPhone: model.contactPhone,
        contactEmail: model.contactEmail,
        instagramHandle: model.instagramHandle,
        folderProvider: model.folderProvider,
        folderUrl: model.folderUrl,
        instagramPostUrl: model.instagramPostUrl,
        hourlyRate: model.hourlyRate ? Number(model.hourlyRate) : null,
        perDressRate: model.perDressRate ? Number(model.perDressRate) : null,
        availability: model.availability,
        sizes: model.sizes.map((item) => item.size),
        notes: model.notes,
        assignments: model.assignments.map((assignment) => ({
          id: assignment.id,
          assignmentStatus: assignment.assignmentStatus,
          scheduledDate: assignment.scheduledDate,
          costAgreed: assignment.costAgreed ? Number(assignment.costAgreed) : null,
          notes: assignment.notes,
          dress: assignment.dress,
        })),
      },
    };
  } catch {
    return null;
  }
}

export async function getDressModelOptions(dressId: string, dressSize: string): Promise<{
  databaseReady: boolean;
  compatibleModels: DressCompatibleModel[];
  assignments: DressAssignmentEntry[];
}> {
  if (!isDatabaseConfigured()) {
    return buildDemoDressModelOptions(dressId, dressSize);
  }

  try {
    const [models, assignments] = await Promise.all([
      prisma.modelProfile.findMany({
        where: {
          sizes: {
            some: {
              size: dressSize,
            },
          },
        },
        include: {
          sizes: {
            orderBy: {
              size: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.dressAssignment.findMany({
        where: {
          dressId,
        },
        include: {
          model: {
            include: {
              sizes: {
                orderBy: {
                  size: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      databaseReady: true,
    compatibleModels: models.map((model) => ({
      id: model.id,
      name: model.name,
      photoUrl: model.photoUrl,
      instagramHandle: model.instagramHandle,
        hourlyRate: model.hourlyRate ? Number(model.hourlyRate) : null,
        perDressRate: model.perDressRate ? Number(model.perDressRate) : null,
        availability: model.availability,
        sizes: model.sizes.map((size) => size.size),
      })),
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        assignmentStatus: assignment.assignmentStatus,
        scheduledDate: assignment.scheduledDate,
        costAgreed: assignment.costAgreed ? Number(assignment.costAgreed) : null,
        notes: assignment.notes,
        model: assignment.model
          ? {
              id: assignment.model.id,
              name: assignment.model.name,
              photoUrl: assignment.model.photoUrl,
              instagramHandle: assignment.model.instagramHandle,
              hourlyRate: assignment.model.hourlyRate
                ? Number(assignment.model.hourlyRate)
                : null,
              perDressRate: assignment.model.perDressRate
                ? Number(assignment.model.perDressRate)
                : null,
              availability: assignment.model.availability,
              sizes: assignment.model.sizes.map((size) => size.size),
            }
          : null,
      })),
    };
  } catch {
    return buildDemoDressModelOptions(dressId, dressSize);
  }
}

function buildDemoAssignmentSuggestions() {
  return {
    databaseReady: false,
    suggestions: buildAssignmentSuggestions(demoDresses, demoModels),
  };
}

function buildDemoDressModelOptions(dressId: string, dressSize: string) {
  return {
    databaseReady: false,
    compatibleModels: demoModels
      .filter((model) => model.sizes.includes(dressSize))
      .map((model) => ({
        id: model.id,
        name: model.name,
        photoUrl: model.photoUrl,
        instagramHandle: model.instagramHandle,
        hourlyRate: model.hourlyRate,
        perDressRate: model.perDressRate,
        availability: model.availability,
        sizes: model.sizes,
      })),
    assignments: (demoDressAssignments[dressId] ?? []).map((assignment) => ({
      id: assignment.id,
      assignmentStatus: assignment.assignmentStatus,
      scheduledDate: assignment.scheduledDate,
      costAgreed: assignment.costAgreed,
      notes: assignment.notes,
      model: assignment.model
        ? {
            id: assignment.model.id,
            name: assignment.model.name,
            photoUrl: assignment.model.photoUrl,
            instagramHandle: assignment.model.instagramHandle,
            hourlyRate: assignment.model.hourlyRate,
            perDressRate: assignment.model.perDressRate,
            availability: assignment.model.availability,
            sizes: assignment.model.sizes,
          }
        : null,
    })),
  };
}

function buildModelWhere(filters: ModelFilters) {
  const where: {
    OR?: Array<Record<string, unknown>>;
    sizes?: {
      some: {
        size: string;
      };
    };
  } = {};

  if (filters.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        instagramHandle: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        contactPhone: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (filters.size) {
    where.sizes = {
      some: {
        size: filters.size,
      },
    };
  }

  return where;
}

function applyModelFilters(models: ModelListItem[], filters: ModelFilters) {
  return models.filter((model) => {
    const searchValue = filters.search?.trim().toLowerCase();

    if (searchValue) {
      const haystack = [model.name, model.instagramHandle ?? "", model.contactPhone ?? ""]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(searchValue)) {
        return false;
      }
    }

    if (filters.size && !model.sizes.includes(filters.size)) {
      return false;
    }

    return true;
  });
}

function buildAssignmentSuggestions(dresses: DressListItem[], models: ModelListItem[]) {
  return dresses
    .filter((dress) =>
      ["PENDING_PHOTOS", "MODEL_ASSIGNED", "IN_SESSION"].includes(dress.workflowStatus),
    )
    .map((dress) => ({
      dressId: dress.id,
      dressName: dress.name,
      internalCode: dress.internalCode,
      dressSize: dress.size,
      brand: dress.brand,
      workflowStatus: dress.workflowStatus,
      previewPhotoUrl: dress.previewPhotoUrl,
      suggestedModels: models
        .filter((model) => model.sizes.includes(dress.size))
        .map((model) => ({
          id: model.id,
          name: model.name,
          instagramHandle: model.instagramHandle,
          perDressRate: model.perDressRate,
          hourlyRate: model.hourlyRate,
          sizes: model.sizes,
        })),
    }))
    .sort((a, b) => b.suggestedModels.length - a.suggestedModels.length);
}

function isNumber(value: number | null): value is number {
  return value !== null;
}
