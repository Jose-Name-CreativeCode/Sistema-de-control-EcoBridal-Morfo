import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";
import {
  demoDresses,
  demoDressFolders,
  demoInstagramPosts,
  workflowStatusLabels,
} from "@/lib/dresses";
import {
  assignmentStatusLabels,
  demoDressAssignments,
  demoModels,
} from "@/lib/models";

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
  id: string;
  dressId: string;
  dressName: string;
  modelName: string;
  assignmentStatus: keyof typeof assignmentStatusLabels;
  scheduledDate: Date | null;
  notes: string | null;
  href: string;
};

type DashboardExcelLink = {
  key: string;
  label: string;
  url: string;
};

type DashboardOperationalItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

type DashboardOperationalQueues = {
  needsModel: DashboardOperationalItem[];
  needsDate: DashboardOperationalItem[];
  needsPhotos: DashboardOperationalItem[];
  needsFolder: DashboardOperationalItem[];
  needsPublication: DashboardOperationalItem[];
};

const pendingPhotoWorkflowStatuses = [
  "PENDING_PHOTOS",
  "MODEL_ASSIGNED",
  "IN_SESSION",
] as const;

const completedPhotoWorkflowStatuses = [
  "PHOTOGRAPHED",
  "EDITED",
  "READY_TO_POST",
  "PUBLISHED",
] as const;

export type DashboardData = {
  databaseReady: boolean;
  metrics: DashboardMetric[];
  urgentTasks: DashboardTask[];
  missingAssets: DashboardTask[];
  upcomingAssignments: DashboardAssignment[];
  todayAssignments: DashboardAssignment[];
  weekAssignments: DashboardAssignment[];
  readyToEdit: DashboardOperationalItem[];
  readyToPublish: DashboardOperationalItem[];
  operationalQueues: DashboardOperationalQueues;
  publicationQueue: DashboardTask[];
  excelLinks: DashboardExcelLink[];
};

const defaultDashboardLinks: DashboardExcelLink[] = [
  {
    key: "excel_1",
    label: "Excel nuestro ecobridal morfo",
    url: "",
  },
  {
    key: "excel_2",
    label: "Excel de ecobridal Xime",
    url: "",
  },
];

function buildDashboardExcelLinks(
  records: Array<{ key: string; label: string; url: string | null }> = [],
) {
  const recordMap = new Map(records.map((record) => [record.key, record]));

  return defaultDashboardLinks.map((item) => {
    const record = recordMap.get(item.key);

    return {
      key: item.key,
      label: item.label,
      url: record?.url ?? "",
    };
  });
}

function isPendingPhotoWorkflow(status: string) {
  return pendingPhotoWorkflowStatuses.includes(
    status as (typeof pendingPhotoWorkflowStatuses)[number],
  );
}

function isCompletedPhotoWorkflow(status: string) {
  return completedPhotoWorkflowStatuses.includes(
    status as (typeof completedPhotoWorkflowStatuses)[number],
  );
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function getWeekRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + offsetToMonday);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!isDatabaseConfigured()) {
    return buildDemoDashboardData();
  }

  try {
    const { start: todayStart, end: todayEnd } = getTodayRange();
    const { start: weekStart, end: weekEnd } = getWeekRange();
    const [
      dresses,
      modelsCount,
      assignments,
      photoFolders,
      instagramPosts,
      dashboardLinks,
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
              id: true,
              name: true,
              internalCode: true,
              workflowStatus: true,
              instagramStatus: true,
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
      prisma.dashboardLink.findMany({
        select: {
          key: true,
          label: true,
          url: true,
        },
        orderBy: {
          label: "asc",
        },
      }),
    ]);

    const folderDressIds = new Set(photoFolders.map((item) => item.dressId));
    const instagramDressIds = new Set(
      instagramPosts.map((item) => item.dressId),
    );

    const pendingPhoto = dresses.filter((dress) =>
      isPendingPhotoWorkflow(dress.workflowStatus),
    );
    const readyForFolder = dresses.filter((dress) =>
      isCompletedPhotoWorkflow(dress.workflowStatus),
    );
    const activeAssignments = assignments.filter(
      (assignment) =>
        assignment.assignmentStatus === "SUGGESTED" ||
        assignment.assignmentStatus === "CONFIRMED",
    );
    const activeAssignmentDressIds = new Set(
      activeAssignments.map((assignment) => assignment.dressId),
    );
    const activeAssignmentsWithoutDate = activeAssignments.filter(
      (assignment) => !assignment.scheduledDate,
    );
    const activeAssignmentsWithDate = activeAssignments.filter((assignment) =>
      Boolean(assignment.scheduledDate),
    );
    const todayAssignments = activeAssignmentsWithDate.filter((assignment) => {
      if (!assignment.scheduledDate) return false;

      return (
        assignment.scheduledDate >= todayStart &&
        assignment.scheduledDate < todayEnd
      );
    });
    const weekAssignments = activeAssignmentsWithDate.filter((assignment) => {
      if (!assignment.scheduledDate) return false;

      return (
        assignment.scheduledDate >= weekStart &&
        assignment.scheduledDate < weekEnd
      );
    });
    const readyToEdit = dresses.filter(
      (dress) => dress.workflowStatus === "PHOTOGRAPHED",
    );
    const readyForInstagram = dresses.filter(
      (dress) =>
        (dress.workflowStatus === "EDITED" ||
          dress.workflowStatus === "READY_TO_POST") &&
        dress.instagramStatus !== "PUBLISHED",
    );
    const dressesNeedingPublication = dresses.filter(
      (dress) => dress.instagramStatus !== "PUBLISHED",
    );
    const dressesNeedingModel = dresses.filter(
      (dress) => !activeAssignmentDressIds.has(dress.id),
    );

    function mapAssignment(
      assignment: (typeof assignments)[number],
    ): DashboardAssignment {
      return {
        id: assignment.id,
        dressId: assignment.dressId,
        dressName: assignment.dress.name,
        modelName: assignment.model?.name ?? "Modelo pendiente",
        assignmentStatus: assignment.assignmentStatus,
        scheduledDate: assignment.scheduledDate,
        notes: assignment.notes,
        href: `/vestidos/${assignment.dressId}`,
      };
    }

    function buildOperationalItem(
      dress: {
        id: string;
        name: string;
        internalCode: string;
      },
      subtitle: string,
    ): DashboardOperationalItem {
      return {
        id: dress.id,
        title: dress.name,
        subtitle: `${dress.internalCode} · ${subtitle}`,
        href: `/vestidos/${dress.id}?edit=1`,
      };
    }

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
      upcomingAssignments: activeAssignmentsWithDate
        .slice(0, 5)
        .map(mapAssignment),
      todayAssignments: todayAssignments.map(mapAssignment),
      weekAssignments: weekAssignments.slice(0, 8).map(mapAssignment),
      readyToEdit: readyToEdit.map((dress) =>
        buildOperationalItem(dress, "Listo para registrar edición o carpeta"),
      ),
      readyToPublish: readyForInstagram
        .filter((dress) => !instagramDressIds.has(dress.id))
        .map((dress) =>
          buildOperationalItem(dress, "Listo para registrar publicación"),
        ),
      operationalQueues: {
        needsModel: dressesNeedingModel
          .slice(0, 8)
          .map((dress) => buildOperationalItem(dress, "Falta asignar modelo")),
        needsDate: activeAssignmentsWithoutDate.slice(0, 8).map((assignment) =>
          buildOperationalItem(
            assignment.dress,
            "Hay modelo asignada pero falta fecha",
          ),
        ),
        needsPhotos: pendingPhoto.slice(0, 8).map((dress) =>
          buildOperationalItem(
            dress,
            workflowStatusLabels[dress.workflowStatus],
          ),
        ),
        needsFolder: readyForFolder
          .filter((dress) => !folderDressIds.has(dress.id))
          .slice(0, 8)
          .map((dress) =>
            buildOperationalItem(dress, "Falta carpeta o entrega editada"),
          ),
        needsPublication: dressesNeedingPublication
          .filter((dress) => !instagramDressIds.has(dress.id))
          .slice(0, 8)
          .map((dress) =>
            buildOperationalItem(dress, "Falta registrar publicación"),
          ),
      },
      publicationQueue: readyForInstagram
        .filter((dress) => !instagramDressIds.has(dress.id))
        .map((dress) => ({
          title: `${dress.name} pendiente de Instagram`,
          subtitle: `${dress.internalCode} ya está listo para registrar su publicación.`,
          href: `/vestidos/${dress.id}`,
        })),
      excelLinks: buildDashboardExcelLinks(dashboardLinks),
    };
  } catch {
    return buildDemoDashboardData();
  }
}

function buildDemoDashboardData(): DashboardData {
  const { start: todayStart, end: todayEnd } = getTodayRange();
  const { start: weekStart, end: weekEnd } = getWeekRange();
  const allAssignments = Object.entries(demoDressAssignments).flatMap(
    ([dressId, items]) =>
      items.map((item) => {
        const dress = demoDresses.find((entry) => entry.id === dressId);

        return {
          id: item.id,
          dressId,
          dressName: dress?.name ?? "Vestido",
          dressCode: dress?.internalCode ?? "ECO",
          modelName: item.model?.name ?? "Modelo pendiente",
          assignmentStatus: item.assignmentStatus,
          scheduledDate: item.scheduledDate,
          notes: item.notes,
          href: dress ? `/vestidos/${dress.id}` : "/vestidos",
        };
      }),
  );

  const pendingPhoto = demoDresses.filter((dress) =>
    isPendingPhotoWorkflow(dress.workflowStatus),
  );
  const readyForFolder = demoDresses.filter((dress) =>
    isCompletedPhotoWorkflow(dress.workflowStatus),
  );
  const activeAssignments = allAssignments.filter(
    (assignment) =>
      assignment.assignmentStatus === "SUGGESTED" ||
      assignment.assignmentStatus === "CONFIRMED",
  );
  const activeAssignmentDressIds = new Set(
    activeAssignments.map((assignment) => assignment.dressId),
  );
  const assignments = activeAssignments
    .filter((assignment) => Boolean(assignment.scheduledDate))
    .sort(
      (left, right) =>
        (left.scheduledDate?.getTime() ?? 0) - (right.scheduledDate?.getTime() ?? 0),
    );
  const todayAssignments = assignments.filter((assignment) => {
    if (!assignment.scheduledDate) return false;

    return (
      assignment.scheduledDate >= todayStart &&
      assignment.scheduledDate < todayEnd
    );
  });
  const weekAssignments = assignments.filter((assignment) => {
    if (!assignment.scheduledDate) return false;

    return (
      assignment.scheduledDate >= weekStart &&
      assignment.scheduledDate < weekEnd
    );
  });
  const readyToEdit = demoDresses.filter(
    (dress) => dress.workflowStatus === "PHOTOGRAPHED",
  );
  const readyForInstagram = demoDresses.filter(
    (dress) =>
      (dress.workflowStatus === "EDITED" ||
        dress.workflowStatus === "READY_TO_POST") &&
      dress.instagramStatus !== "PUBLISHED",
  );
  const dressesNeedingPublication = demoDresses.filter(
    (dress) => dress.instagramStatus !== "PUBLISHED",
  );

  function buildOperationalItem(
    dress: {
      id: string;
      name: string;
      internalCode: string;
    },
    subtitle: string,
  ): DashboardOperationalItem {
    return {
      id: dress.id,
      title: dress.name,
      subtitle: `${dress.internalCode} · ${subtitle}`,
      href: `/vestidos/${dress.id}?edit=1`,
    };
  }

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
      .filter((dress) => !demoDressFolders[dress.id]?.length)
      .slice(0, 4)
      .map((dress) => ({
        title: `${dress.name} sin carpeta editada`,
        subtitle: `${dress.internalCode} ya necesita link de fotos finales.`,
        href: `/vestidos/${dress.id}`,
      })),
    upcomingAssignments: assignments.slice(0, 5),
    todayAssignments: todayAssignments,
    weekAssignments: weekAssignments.slice(0, 8),
    readyToEdit: readyToEdit.map((dress) =>
      buildOperationalItem(dress, "Listo para registrar edición o carpeta"),
    ),
    readyToPublish: readyForInstagram
      .filter((dress) => !demoInstagramPosts[dress.id]?.length)
      .map((dress) =>
        buildOperationalItem(dress, "Listo para registrar publicación"),
      ),
    operationalQueues: {
      needsModel: demoDresses
        .filter((dress) => !activeAssignmentDressIds.has(dress.id))
        .slice(0, 8)
        .map((dress) => buildOperationalItem(dress, "Falta asignar modelo")),
      needsDate: activeAssignments
        .filter((assignment) => !assignment.scheduledDate)
        .slice(0, 8)
        .map((assignment) =>
          buildOperationalItem(
            {
              id: assignment.dressId,
              name: assignment.dressName,
              internalCode: assignment.dressCode,
            },
            "Hay modelo asignada pero falta fecha",
          ),
        ),
      needsPhotos: pendingPhoto.slice(0, 8).map((dress) =>
        buildOperationalItem(
          dress,
          workflowStatusLabels[dress.workflowStatus],
        ),
      ),
      needsFolder: readyForFolder
        .filter((dress) => !demoDressFolders[dress.id]?.length)
        .slice(0, 8)
        .map((dress) =>
          buildOperationalItem(dress, "Falta carpeta o entrega editada"),
        ),
      needsPublication: dressesNeedingPublication
        .filter((dress) => !demoInstagramPosts[dress.id]?.length)
        .slice(0, 8)
        .map((dress) =>
          buildOperationalItem(dress, "Falta registrar publicación"),
        ),
    },
    publicationQueue: readyForInstagram
      .filter((dress) => !demoInstagramPosts[dress.id]?.length)
      .map((dress) => ({
        title: `${dress.name} pendiente de Instagram`,
        subtitle: `${dress.internalCode} ya está listo para registrar su publicación.`,
        href: `/vestidos/${dress.id}`,
      })),
    excelLinks: buildDashboardExcelLinks(),
  };
}
