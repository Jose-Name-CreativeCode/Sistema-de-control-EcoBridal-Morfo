import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";
import {
  demoDresses,
  demoDressFolders,
  demoInstagramPosts,
  workflowStatusLabels,
} from "@/lib/dresses";
import { demoDressAssignments, demoModels } from "@/lib/models";

type DashboardMetric = {
  label: string;
  value: string;
  note: string;
};

type DashboardTask = {
  title: string;
  subtitle: string;
  href: string;
};

type DashboardAssignment = {
  dressId: string;
  dressName: string;
  modelName: string;
  scheduledDate: Date | null;
  href: string;
};

export type DashboardData = {
  databaseReady: boolean;
  metrics: DashboardMetric[];
  urgentTasks: DashboardTask[];
  missingAssets: DashboardTask[];
  upcomingAssignments: DashboardAssignment[];
  publicationQueue: DashboardTask[];
};

export async function getDashboardData(): Promise<DashboardData> {
  if (!isDatabaseConfigured()) {
    return buildDemoDashboardData();
  }

  try {
    const [
      dresses,
      modelsCount,
      assignments,
      photoFolders,
      instagramPosts,
    ] = await Promise.all([
      prisma.dress.findMany({
        select: {
          id: true,
          name: true,
          internalCode: true,
          workflowStatus: true,
          instagramStatus: true,
          isNew: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.modelProfile.count(),
      prisma.dressAssignment.findMany({
        where: {
          assignmentStatus: {
            in: ["SUGGESTED", "CONFIRMED", "COMPLETED"],
          },
          scheduledDate: {
            not: null,
          },
        },
        include: {
          dress: {
            select: {
              name: true,
            },
          },
          model: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          scheduledDate: "asc",
        },
        take: 5,
      }),
      prisma.dressPhotoFolder.findMany({
        select: {
          dressId: true,
        },
      }),
      prisma.dressInstagramPost.findMany({
        select: {
          dressId: true,
        },
      }),
    ]);

    const folderDressIds = new Set(photoFolders.map((item) => item.dressId));
    const instagramDressIds = new Set(instagramPosts.map((item) => item.dressId));

    const pendingPhoto = dresses.filter((dress) =>
      ["PENDING_PHOTOS", "MODEL_ASSIGNED", "IN_SESSION"].includes(dress.workflowStatus),
    );
    const readyForFolder = dresses.filter((dress) =>
      ["PHOTOGRAPHED", "EDITED", "READY_TO_POST", "PUBLISHED"].includes(dress.workflowStatus),
    );
    const readyForInstagram = dresses.filter(
      (dress) => dress.instagramStatus !== "PUBLISHED",
    );

    return {
      databaseReady: true,
      metrics: [
        {
          label: "Vestidos totales",
          value: String(dresses.length),
          note: "Catálogo activo",
        },
        {
          label: "Pendientes de foto",
          value: String(pendingPhoto.length),
          note: "Requieren sesión o avance",
        },
        {
          label: "Modelos registradas",
          value: String(modelsCount),
          note: "Base de casting disponible",
        },
        {
          label: "Vestidos nuevos",
          value: String(dresses.filter((dress) => dress.isNew).length),
          note: "Ingresos recientes",
        },
      ],
      urgentTasks: pendingPhoto.slice(0, 4).map((dress) => ({
        title: `${dress.name} · ${workflowStatusLabels[dress.workflowStatus]}`,
        subtitle: `${dress.internalCode} necesita seguimiento de producción.`,
        href: `/vestidos/${dress.id}`,
      })),
      missingAssets: readyForFolder
        .filter((dress) => !folderDressIds.has(dress.id))
        .slice(0, 4)
        .map((dress) => ({
          title: `${dress.name} sin carpeta editada`,
          subtitle: `${dress.internalCode} ya avanzó en foto pero falta link de carpeta.`,
          href: `/vestidos/${dress.id}`,
        })),
      upcomingAssignments: assignments.map((assignment) => ({
        dressId: assignment.dressId,
        dressName: assignment.dress.name,
        modelName: assignment.model?.name ?? "Modelo pendiente",
        scheduledDate: assignment.scheduledDate,
        href: `/vestidos/${assignment.dressId}`,
      })),
      publicationQueue: readyForInstagram
        .filter((dress) => !instagramDressIds.has(dress.id))
        .slice(0, 4)
        .map((dress) => ({
          title: `${dress.name} pendiente de Instagram`,
          subtitle: `${dress.internalCode} ya está listo para registrar su publicación.`,
          href: `/vestidos/${dress.id}`,
        })),
    };
  } catch {
    return buildDemoDashboardData();
  }
}

function buildDemoDashboardData(): DashboardData {
  const assignments = Object.entries(demoDressAssignments).flatMap(([dressId, items]) =>
    items
      .filter((item) => item.scheduledDate)
      .map((item) => {
      const dress = demoDresses.find((entry) => entry.id === dressId);

      return {
        dressId,
        dressName: dress?.name ?? "Vestido",
        modelName: item.model?.name ?? "Modelo pendiente",
        scheduledDate: item.scheduledDate,
        href: dress ? `/vestidos/${dress.id}` : "/vestidos",
      };
      }),
  );

  const pendingPhoto = demoDresses.filter((dress) =>
    ["PENDING_PHOTOS", "MODEL_ASSIGNED", "IN_SESSION"].includes(dress.workflowStatus),
  );
  const readyForFolder = demoDresses.filter((dress) =>
    ["PHOTOGRAPHED", "EDITED", "READY_TO_POST", "PUBLISHED"].includes(dress.workflowStatus),
  );
  const readyForInstagram = demoDresses.filter(
    (dress) => dress.instagramStatus !== "PUBLISHED",
  );

  return {
    databaseReady: false,
    metrics: [
      {
        label: "Vestidos totales",
        value: String(demoDresses.length),
        note: "Catálogo demo",
      },
      {
        label: "Pendientes de foto",
        value: String(pendingPhoto.length),
        note: "Listos para programar",
      },
      {
        label: "Modelos registradas",
        value: String(demoModels.length),
        note: "Casting disponible",
      },
      {
        label: "Vestidos nuevos",
        value: String(demoDresses.filter((dress) => dress.isNew).length),
        note: "Ingresos recientes",
      },
    ],
    urgentTasks: pendingPhoto.slice(0, 4).map((dress) => ({
      title: `${dress.name} · ${workflowStatusLabels[dress.workflowStatus]}`,
      subtitle: `${dress.internalCode} requiere seguimiento de producción.`,
      href: `/vestidos/${dress.id}`,
    })),
    missingAssets: readyForFolder
      .filter((dress) => !(demoDressFolders[dress.id]?.length))
      .slice(0, 4)
      .map((dress) => ({
        title: `${dress.name} sin carpeta editada`,
        subtitle: `${dress.internalCode} ya necesita link de fotos finales.`,
        href: `/vestidos/${dress.id}`,
      })),
    upcomingAssignments: assignments.slice(0, 5),
    publicationQueue: readyForInstagram
      .filter((dress) => !(demoInstagramPosts[dress.id]?.length))
      .slice(0, 4)
      .map((dress) => ({
        title: `${dress.name} pendiente de Instagram`,
        subtitle: `${dress.internalCode} ya está listo para registrar su publicación.`,
        href: `/vestidos/${dress.id}`,
      })),
  };
}
