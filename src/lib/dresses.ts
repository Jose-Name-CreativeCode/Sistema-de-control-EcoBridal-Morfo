import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";
import importedDressNames from "@/data/initial-dresses.json";

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
export type DressCondition = "USED" | "NEW" | "SAMPLE";
export type DressSortOption = "name-asc" | "name-desc" | "code-asc" | "code-desc";

export const dressSortOptions = [
  "name-asc",
  "name-desc",
  "code-asc",
  "code-desc",
] as const;

export type DressFilters = {
  search?: string;
  brand?: string;
  size?: string;
  workflowStatus?: WorkflowStatus | "";
  instagramStatus?: InstagramStatus | "";
  novelty?: "all" | "new" | "existing";
  sort?: DressSortOption;
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
  previewPhotoUrl: string | null;
  previewPhotoType: "COVER" | "FRONT" | "BACK" | "DETAIL" | "WORN_BY_MODEL" | "VIDEO" | null;
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

export type DressPhotoItem = {
  id: string;
  photoType: "COVER" | "FRONT" | "BACK" | "DETAIL" | "WORN_BY_MODEL" | "VIDEO";
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
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
    condition: DressCondition;
    price: number | null;
    notes: string | null;
    photos: DressPhotoItem[];
    photoFolders: DressPhotoFolderItem[];
    instagramPosts: DressInstagramPostItem[];
    photoCount: number;
  };
};

export type DressQuickEditRow = DressListItem & {
  condition: DressCondition;
  price: number | null;
  notes: string | null;
};

const demoDressStateMap: Record<
  string,
  {
    workflowStatus: WorkflowStatus;
    instagramStatus: InstagramStatus;
    isNew?: boolean;
    receivedAt?: string;
  }
> = {
  ADRIANA: {
    workflowStatus: "PHOTOGRAPHED",
    instagramStatus: "PUBLISHED",
    receivedAt: "2026-04-05",
  },
  ARIADNA: {
    workflowStatus: "MODEL_ASSIGNED",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-24",
  },
  ELENA: {
    workflowStatus: "READY_TO_POST",
    instagramStatus: "SCHEDULED",
    receivedAt: "2026-02-18",
  },
  DALIA: {
    workflowStatus: "PENDING_PHOTOS",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-26",
  },
  FRANCIA: {
    workflowStatus: "EDITED",
    instagramStatus: "SCHEDULED",
    receivedAt: "2026-04-27",
  },
  MARCIA: {
    workflowStatus: "IN_SESSION",
    instagramStatus: "NOT_PUBLISHED",
    receivedAt: "2026-04-12",
  },
  SOFIA: {
    workflowStatus: "PUBLISHED",
    instagramStatus: "PUBLISHED",
    receivedAt: "2026-04-06",
  },
  YOLANDA: {
    workflowStatus: "PENDING_PHOTOS",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-28",
  },
};

export const demoDresses: DressListItem[] = importedDressNames.map((name, index) => {
  const state = demoDressStateMap[name];

  return {
    id: `demo-${index + 1}`,
    internalCode: `ECO-${String(index + 1).padStart(3, "0")}`,
    name,
    brand: null,
    size: "Por definir",
    color: null,
    isNew: state?.isNew ?? false,
    workflowStatus: state?.workflowStatus ?? "PENDING_PHOTOS",
    instagramStatus: state?.instagramStatus ?? "NOT_PUBLISHED",
    receivedAt: state?.receivedAt ? new Date(state.receivedAt) : new Date("2026-03-06"),
    previewPhotoUrl: null,
    previewPhotoType: null,
  };
});

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

export const dressConditionLabels: Record<DressCondition, string> = {
  USED: "Usado",
  NEW: "Nuevo",
  SAMPLE: "Propio de EcoBridal",
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

export const photoTypeLabels = {
  COVER: "Principal",
  FRONT: "Medio cuerpo",
  BACK: "Espalda",
  DETAIL: "Detalle",
  WORN_BY_MODEL: "Modelo usando vestido",
  VIDEO: "Video",
} as const;

export const photoTypeOptions = Object.keys(photoTypeLabels) as Array<keyof typeof photoTypeLabels>;

export const demoDressPhotos: Record<string, DressPhotoItem[]> = {
  "demo-1": [
    {
      id: "photo-1",
      photoType: "COVER",
      imageUrl: "https://example.com/demo/adriana-cover.jpg",
      altText: "Portada del vestido Adriana",
      sortOrder: 1,
    },
    {
      id: "photo-2",
      photoType: "FRONT",
      imageUrl: "https://example.com/demo/adriana-front.jpg",
      altText: "Frente del vestido Adriana",
      sortOrder: 2,
    },
    {
      id: "photo-3",
      photoType: "BACK",
      imageUrl: "https://example.com/demo/adriana-back.jpg",
      altText: "Espalda del vestido Adriana",
      sortOrder: 3,
    },
  ],
  "demo-34": [
    {
      id: "photo-4",
      photoType: "COVER",
      imageUrl: "https://example.com/demo/elena-cover.jpg",
      altText: "Portada del vestido Elena",
      sortOrder: 1,
    },
    {
      id: "photo-5",
      photoType: "WORN_BY_MODEL",
      imageUrl: "https://example.com/demo/elena-model.jpg",
      altText: "Modelo usando el vestido Elena",
      sortOrder: 2,
    },
  ],
  "demo-95": [
    {
      id: "photo-6",
      photoType: "VIDEO",
      imageUrl: "https://example.com/demo/sofia-reel.mp4",
      altText: "Video del vestido Sofía",
      sortOrder: 1,
    },
  ],
};

export const demoDressFolders: Record<string, DressPhotoFolderItem[]> = {
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
  "demo-34": [
    {
      id: "folder-2",
      provider: "SHAREPOINT",
      folderUrl: "https://sharepoint.com/demo/elena",
      versionLabel: "Selección aprobada",
      notes: "Lista para programar reel.",
      createdAt: new Date("2026-04-01"),
    },
  ],
};

export const demoInstagramPosts: Record<string, DressInstagramPostItem[]> = {
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
  "demo-95": [
    {
      id: "ig-2",
      postType: "REEL",
      instagramUrl: "https://instagram.com/reel/demo-sofia",
      instagramShortcode: "demo-sofia",
      accountName: "@ecobridalmorfo",
      publishedAt: new Date("2026-04-03"),
      captionNotes: "Video con transición de frente a espalda.",
    },
  ],
};

export const demoPhotoCounts: Record<string, number> = {
  "demo-1": 5,
  "demo-14": 1,
  "demo-28": 0,
  "demo-34": 4,
  "demo-49": 3,
  "demo-79": 2,
  "demo-95": 5,
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
        orderBy: buildDressOrderBy(filters.sort),
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
          photos: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              imageUrl: true,
              photoType: true,
            },
          },
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
      dresses: dresses.map((dress) => ({
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
        previewPhotoUrl: dress.photos[0]?.imageUrl ?? null,
        previewPhotoType: dress.photos[0]?.photoType ?? null,
      })),
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
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            photoType: true,
            imageUrl: true,
            altText: true,
            sortOrder: true,
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
        previewPhotoUrl: dress.photos[0]?.imageUrl ?? null,
        previewPhotoType: dress.photos[0]?.photoType ?? null,
        condition: dress.condition,
        price: dress.price ? Number(dress.price) : null,
        notes: dress.notes,
        photos: dress.photos.map((photo) => ({
          id: photo.id,
          photoType: photo.photoType,
          imageUrl: photo.imageUrl,
          altText: photo.altText,
          sortOrder: photo.sortOrder,
        })),
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

export async function getDressQuickEditRows(): Promise<{
  databaseReady: boolean;
  dresses: DressQuickEditRow[];
}> {
  if (!isDatabaseConfigured()) {
    return {
      databaseReady: false,
      dresses: demoDresses.map((dress) => buildDemoQuickEditRow(dress)),
    };
  }

  try {
    const dresses = await prisma.dress.findMany({
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
        condition: true,
        price: true,
        notes: true,
      },
    });

    return {
      databaseReady: true,
      dresses: dresses.map((dress) => ({
        ...dress,
        price: dress.price ? Number(dress.price) : null,
        previewPhotoUrl: null,
        previewPhotoType: null,
      })),
    };
  } catch {
    return {
      databaseReady: false,
      dresses: demoDresses.map((dress) => buildDemoQuickEditRow(dress)),
    };
  }
}

function buildDemoDressCatalogData(filters: DressFilters): DressCatalogData {
  const dresses = applyDemoSort(applyDemoFilters(demoDresses, filters), filters.sort);

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
      ...buildDemoQuickEditRow(dress),
      photos: demoDressPhotos[dress.id] ?? [],
      photoFolders: demoDressFolders[dress.id] ?? [],
      instagramPosts: demoInstagramPosts[dress.id] ?? [],
      photoCount: demoPhotoCounts[dress.id] ?? 0,
    },
  };
}

function buildDemoQuickEditRow(dress: DressListItem): DressQuickEditRow {
  const preview = (demoDressPhotos[dress.id] ?? []).find((photo) => photo.photoType !== "VIDEO");

  return {
    ...dress,
    previewPhotoUrl: preview?.imageUrl ?? null,
    previewPhotoType: preview?.photoType ?? null,
    condition: dress.isNew ? "NEW" : "USED",
    price: {
      "demo-1": 18900,
      "demo-14": 16600,
      "demo-28": 15400,
      "demo-34": 14900,
      "demo-49": 17100,
      "demo-79": 17800,
      "demo-95": 18200,
    }[dress.id] ?? null,
    notes: {
      "demo-1": "Vestido editorial fuerte para feed principal y portada.",
      "demo-14": "Esperando confirmación final de modelo y detalles de prueba.",
      "demo-28": "Recién llegado. Falta sesión completa y selección de modelo.",
      "demo-34": "Contenido casi listo para publicar.",
      "demo-49": "Material avanzado para programación en Instagram.",
      "demo-79": "Sesión en curso con cambios de styling.",
      "demo-95": "Publicación ya validada y enlazada.",
    }[dress.id] ?? null,
  };
}

function buildDressOrderBy(sort: DressSortOption | undefined): Prisma.DressOrderByWithRelationInput[] {
  switch (sort) {
    case "name-desc":
      return [{ name: "desc" }];
    case "code-asc":
      return [{ internalCode: "asc" }];
    case "code-desc":
      return [{ internalCode: "desc" }];
    case "name-asc":
    default:
      return [{ name: "asc" }];
  }
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

function applyDemoSort(dresses: DressListItem[], sort: DressSortOption | undefined) {
  const items = dresses.map((dress) => {
    const preview = (demoDressPhotos[dress.id] ?? []).find((photo) => photo.photoType !== "VIDEO");
    return {
      ...dress,
      previewPhotoUrl: preview?.imageUrl ?? null,
      previewPhotoType: preview?.photoType ?? null,
    };
  });

  items.sort((left, right) => {
    if (sort === "name-desc") {
      return right.name.localeCompare(left.name, "es");
    }

    if (sort === "code-asc") {
      return left.internalCode.localeCompare(right.internalCode, "es");
    }

    if (sort === "code-desc") {
      return right.internalCode.localeCompare(left.internalCode, "es");
    }

    return left.name.localeCompare(right.name, "es");
  });

  return items;
}
