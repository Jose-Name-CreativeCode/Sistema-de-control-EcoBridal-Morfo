import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";

export const workflowStatusOptions = [
  "DRAFT",
  "PENDING_PHOTOS",
  "MODEL_ASSIGNED",
  "IN_SESSION",
  "PHOTOGRAPHED",
  "EDITED",
  "READY_TO_POST",
  "PUBLISHED",
] as const;

export const instagramStatusOptions = [
  "NOT_PUBLISHED",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type WorkflowStatus = (typeof workflowStatusOptions)[number];
export type InstagramStatus = (typeof instagramStatusOptions)[number];

export type DressFilters = {
  search?: string;
  brand?: string;
  size?: string;
  workflowStatus?: WorkflowStatus | "";
  instagramStatus?: InstagramStatus | "";
  novelty?: "all" | "new" | "existing";
};

export type DressListItem = {
  id: string;
  internalCode: string;
  name: string;
  brand: string | null;
  size: string;
  color: string | null;
  isNew: boolean;
  workflowStatus: WorkflowStatus;
  instagramStatus: InstagramStatus;
  receivedAt: Date | null;
};

export type DressCatalogData = {
  databaseReady: boolean;
  dresses: DressListItem[];
  totalCount: number;
  pendingPhotoCount: number;
  publishedCount: number;
  newCount: number;
  brands: string[];
  sizes: string[];
};

export type DressPhotoFolderItem = {
  id: string;
  provider: "OUTLOOK_ONEDRIVE" | "SHAREPOINT" | "GOOGLE_DRIVE" | "OTHER";
  folderUrl: string;
  versionLabel: string | null;
  notes: string | null;
  createdAt: Date;
};

export type DressInstagramPostItem = {
  id: string;
  postType: "POST" | "REEL" | "STORY" | "CAROUSEL";
  instagramUrl: string;
  instagramShortcode: string | null;
  accountName: string | null;
  publishedAt: Date | null;
  captionNotes: string | null;
};

export type DressDetailData = {
  databaseReady: boolean;
  dress: DressListItem & {
    condition: "USED" | "NEW" | "SAMPLE";
    price: number | null;
    notes: string | null;
    photoFolders: DressPhotoFolderItem[];
    instagramPosts: DressInstagramPostItem[];
    photoCount: number;
  };
};

export const demoDresses: DressListItem[] = [
  {
    id: "demo-1",
    internalCode: "ECO-001",
    name: "Ariadna",
    brand: "Pronovias",
    size: "8",
    color: "Ivory",
    isNew: false,
    workflowStatus: "PHOTOGRAPHED",
    instagramStatus: "PUBLISHED",
    receivedAt: new Date("2026-04-05"),
  },
  {
    id: "demo-2",
    internalCode: "ECO-002",
    name: "Bianca",
    brand: "Mori Lee",
    size: "6",
    color: "Off White",
    isNew: true,
    workflowStatus: "PENDING_PHOTOS",
    instagramStatus: "NOT_PUBLISHED",
    receivedAt: new Date("2026-04-20"),
  },
  {
    id: "demo-3",
    internalCode: "ECO-003",
    name: "Celeste",
    brand: "Allure",
    size: "10",
    color: "Ivory",
    isNew: false,
    workflowStatus: "EDITED",
    instagramStatus: "SCHEDULED",
    receivedAt: new Date("2026-03-29"),
  },
  {
    id: "demo-4",
    internalCode: "ECO-004",
    name: "Dafne",
    brand: "Rosa Clara",
    size: "8",
    color: "Champagne",
    isNew: true,
    workflowStatus: "MODEL_ASSIGNED",
    instagramStatus: "NOT_PUBLISHED",
    receivedAt: new Date("2026-04-24"),
  },
  {
    id: "demo-5",
    internalCode: "ECO-005",
    name: "Elena",
    brand: "Pronovias",
    size: "4",
    color: "Ivory",
    isNew: false,
    workflowStatus: "READY_TO_POST",
    instagramStatus: "SCHEDULED",
    receivedAt: new Date("2026-02-18"),
  },
  {
    id: "demo-6",
    internalCode: "ECO-006",
    name: "Florencia",
    brand: "Sottero",
    size: "12",
    color: "White",
    isNew: false,
    workflowStatus: "IN_SESSION",
    instagramStatus: "NOT_PUBLISHED",
    receivedAt: new Date("2026-04-11"),
  },
];

const pendingWorkflowStatuses: WorkflowStatus[] = [
  "PENDING_PHOTOS",
  "MODEL_ASSIGNED",
  "IN_SESSION",
];

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  DRAFT: "Borrador",
  PENDING_PHOTOS: "Pendiente de foto",
  MODEL_ASSIGNED: "Modelo asignada",
  IN_SESSION: "En sesión",
  PHOTOGRAPHED: "Fotografiado",
  EDITED: "Editado",
  READY_TO_POST: "Listo para publicar",
  PUBLISHED: "Publicado",
};

export const instagramStatusLabels: Record<InstagramStatus, string> = {
  NOT_PUBLISHED: "No publicado",
  SCHEDULED: "Programado",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export const folderProviderLabels = {
  OUTLOOK_ONEDRIVE: "Outlook / OneDrive",
  SHAREPOINT: "SharePoint",
  GOOGLE_DRIVE: "Google Drive",
  OTHER: "Otro",
} as const;

export const instagramPostTypeLabels = {
  POST: "Post",
  REEL: "Reel",
  STORY: "Story",
  CAROUSEL: "Carrusel",
} as const;

const demoDressFolders: Record<string, DressPhotoFolderItem[]> = {
  "demo-1": [
    {
      id: "folder-1",
      provider: "OUTLOOK_ONEDRIVE",
      folderUrl: "https://outlook.office.com/demo/ariadna-editadas",
      versionLabel: "Edición final abril",
      notes: "Incluye portada, frente, espalda y close-ups.",
      createdAt: new Date("2026-04-08"),
    },
  ],
  "demo-3": [
    {
      id: "folder-2",
      provider: "SHAREPOINT",
      folderUrl: "https://sharepoint.com/demo/celeste",
      versionLabel: "Selección aprobada",
      notes: "Lista para programar reel.",
      createdAt: new Date("2026-04-01"),
    },
  ],
};

const demoInstagramPosts: Record<string, DressInstagramPostItem[]> = {
  "demo-1": [
    {
      id: "ig-1",
      postType: "POST",
      instagramUrl: "https://instagram.com/p/demo-ariadna",
      instagramShortcode: "demo-ariadna",
      accountName: "@ecobridalmorfo",
      publishedAt: new Date("2026-04-10"),
      captionNotes: "Post principal del vestido Ariadna.",
    },
  ],
  "demo-3": [
    {
      id: "ig-2",
      postType: "REEL",
      instagramUrl: "https://instagram.com/reel/demo-celeste",
      instagramShortcode: "demo-celeste",
      accountName: "@ecobridalmorfo",
      publishedAt: new Date("2026-04-03"),
      captionNotes: "Video con transición de frente a espalda.",
    },
  ],
};

const demoPhotoCounts: Record<string, number> = {
  "demo-1": 5,
  "demo-2": 0,
  "demo-3": 4,
  "demo-4": 1,
  "demo-5": 3,
  "demo-6": 2,
};

export function getWorkflowStatusBadgeClasses(status: WorkflowStatus) {
  if (status === "PENDING_PHOTOS") return "bg-amber-100 text-amber-900";
  if (status === "MODEL_ASSIGNED") return "bg-orange-100 text-orange-900";
  if (status === "IN_SESSION") return "bg-rose-100 text-rose-900";
  if (status === "PUBLISHED") return "bg-emerald-100 text-emerald-900";
  return "bg-stone-200 text-stone-800";
}

export function getInstagramStatusBadgeClasses(status: InstagramStatus) {
  if (status === "PUBLISHED") return "bg-emerald-100 text-emerald-900";
  if (status === "SCHEDULED") return "bg-sky-100 text-sky-900";
  if (status === "ARCHIVED") return "bg-stone-300 text-stone-900";
  return "bg-stone-200 text-stone-800";
}

export async function getDressCatalogData(
  filters: DressFilters = {},
): Promise<DressCatalogData> {
  if (!isDatabaseConfigured()) {
    return buildDemoDressCatalogData(filters);
  }

  try {
    const where = buildDressWhere(filters);

    const [
      dresses,
      totalCount,
      pendingPhotoCount,
      publishedCount,
      newCount,
      brands,
      sizes,
    ] = await Promise.all([
      prisma.dress.findMany({
        where,
        orderBy: [{ isNew: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          internalCode: true,
          name: true,
          brand: true,
          size: true,
          color: true,
          isNew: true,
          workflowStatus: true,
          instagramStatus: true,
          receivedAt: true,
        },
      }),
      prisma.dress.count(),
      prisma.dress.count({
        where: {
          workflowStatus: {
            in: pendingWorkflowStatuses,
          },
        },
      }),
      prisma.dress.count({
        where: {
          instagramStatus: "PUBLISHED",
        },
      }),
      prisma.dress.count({
        where: {
          isNew: true,
        },
      }),
      prisma.dress.findMany({
        where: {
          brand: {
            not: null,
          },
        },
        distinct: ["brand"],
        select: {
          brand: true,
        },
        orderBy: {
          brand: "asc",
        },
      }),
      prisma.dress.findMany({
        distinct: ["size"],
        select: {
          size: true,
        },
        orderBy: {
          size: "asc",
        },
      }),
    ]);

    return {
      databaseReady: true,
      dresses,
      totalCount,
      pendingPhotoCount,
      publishedCount,
      newCount,
      brands: brands.map((item) => item.brand).filter(Boolean) as string[],
      sizes: sizes.map((item) => item.size),
    };
  } catch {
    return buildDemoDressCatalogData(filters);
  }
}

export async function getDressDetailData(id: string): Promise<DressDetailData | null> {
  if (!isDatabaseConfigured()) {
    return buildDemoDressDetail(id);
  }

  try {
    const dress = await prisma.dress.findUnique({
      where: { id },
      include: {
        photoFolders: {
          orderBy: {
            createdAt: "desc",
          },
        },
        instagramPosts: {
          orderBy: {
            publishedAt: "desc",
          },
        },
        photos: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!dress) {
      return null;
    }

    return {
      databaseReady: true,
      dress: {
        id: dress.id,
        internalCode: dress.internalCode,
        name: dress.name,
        brand: dress.brand,
        size: dress.size,
        color: dress.color,
        isNew: dress.isNew,
        workflowStatus: dress.workflowStatus,
        instagramStatus: dress.instagramStatus,
        receivedAt: dress.receivedAt,
        condition: dress.condition,
        price: dress.price ? Number(dress.price) : null,
        notes: dress.notes,
        photoFolders: dress.photoFolders.map((folder) => ({
          id: folder.id,
          provider: folder.provider,
          folderUrl: folder.folderUrl,
          versionLabel: folder.versionLabel,
          notes: folder.notes,
          createdAt: folder.createdAt,
        })),
        instagramPosts: dress.instagramPosts.map((post) => ({
          id: post.id,
          postType: post.postType,
          instagramUrl: post.instagramUrl,
          instagramShortcode: post.instagramShortcode,
          accountName: post.accountName,
          publishedAt: post.publishedAt,
          captionNotes: post.captionNotes,
        })),
        photoCount: dress.photos.length,
      },
    };
  } catch {
    return buildDemoDressDetail(id);
  }
}

function buildDemoDressCatalogData(filters: DressFilters): DressCatalogData {
  const dresses = applyDemoFilters(demoDresses, filters);

  return {
    databaseReady: false,
    dresses,
    totalCount: demoDresses.length,
    pendingPhotoCount: demoDresses.filter((dress) =>
      pendingWorkflowStatuses.includes(dress.workflowStatus),
    ).length,
    publishedCount: demoDresses.filter(
      (dress) => dress.instagramStatus === "PUBLISHED",
    ).length,
    newCount: demoDresses.filter((dress) => dress.isNew).length,
    brands: Array.from(
      new Set(demoDresses.map((dress) => dress.brand).filter(Boolean)),
    ) as string[],
    sizes: Array.from(new Set(demoDresses.map((dress) => dress.size))).sort(),
  };
}

function buildDemoDressDetail(id: string): DressDetailData | null {
  const dress = demoDresses.find((item) => item.id === id);

  if (!dress) {
    return null;
  }

  return {
    databaseReady: false,
    dress: {
      ...dress,
      condition: dress.isNew ? "NEW" : "USED",
      price: {
        "demo-1": 18900,
        "demo-2": 15400,
        "demo-3": 17100,
        "demo-4": 16600,
        "demo-5": 14900,
        "demo-6": 17800,
      }[dress.id] ?? null,
      notes: {
        "demo-1": "Vestido editorial fuerte para feed principal y portada.",
        "demo-2": "Recién llegado. Falta sesión completa y selección de modelo.",
        "demo-3": "Ya tiene material listo para publicar en video.",
        "demo-4": "Esperando confirmación final de modelo talla 8.",
        "demo-5": "Contenido aprobado para próxima semana.",
        "demo-6": "Sesión en curso con cambios de styling.",
      }[dress.id] ?? null,
      photoFolders: demoDressFolders[dress.id] ?? [],
      instagramPosts: demoInstagramPosts[dress.id] ?? [],
      photoCount: demoPhotoCounts[dress.id] ?? 0,
    },
  };
}

function buildDressWhere(filters: DressFilters): Prisma.DressWhereInput {
  const where: Prisma.DressWhereInput = {};

  if (filters.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        internalCode: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (filters.brand) {
    where.brand = filters.brand;
  }

  if (filters.size) {
    where.size = filters.size;
  }

  if (filters.workflowStatus) {
    where.workflowStatus = filters.workflowStatus;
  }

  if (filters.instagramStatus) {
    where.instagramStatus = filters.instagramStatus;
  }

  if (filters.novelty === "new") {
    where.isNew = true;
  }

  if (filters.novelty === "existing") {
    where.isNew = false;
  }

  return where;
}

function applyDemoFilters(dresses: DressListItem[], filters: DressFilters) {
  return dresses.filter((dress) => {
    const searchValue = filters.search?.trim().toLowerCase();

    if (searchValue) {
      const haystack = [dress.internalCode, dress.name, dress.brand ?? ""]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(searchValue)) {
        return false;
      }
    }

    if (filters.brand && dress.brand !== filters.brand) {
      return false;
    }

    if (filters.size && dress.size !== filters.size) {
      return false;
    }

    if (filters.workflowStatus && dress.workflowStatus !== filters.workflowStatus) {
      return false;
    }

    if (filters.instagramStatus && dress.instagramStatus !== filters.instagramStatus) {
      return false;
    }

    if (filters.novelty === "new" && !dress.isNew) {
      return false;
    }

    if (filters.novelty === "existing" && dress.isNew) {
      return false;
    }

    return true;
  });
}
