import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const featured = searchParams.get("featured") === "true";

    // If published filter is requested, use the CMS helper (public use)
    if (published !== null || featured) {
      const projects = await getProjects({
        published: published === "true" || undefined,
        featured: featured || undefined,
      });
      return NextResponse.json(projects);
    }

    // Otherwise return all projects for admin use (requires auth)
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      include: {
        techStack: {
          orderBy: { order: "asc" },
        },
        metrics: {
          orderBy: { order: "asc" },
        },
        features: {
          orderBy: { order: "asc" },
        },
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { techStack, metrics, features, images, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        techStack: {
          create: techStack.map((tech: { name: string }, index: number) => ({
            name: tech.name,
            order: index,
          })),
        },
        metrics: {
          create: metrics.map(
            (
              metric: {
                [key: string]: string;
              },
              index: number
            ) => ({
              label: metric.label,
              value: metric.value,
              icon: metric.icon,
              color: metric.color,
              order: index,
            })
          ),
        },
        features: {
          create: features.map(
            (
              feature: { title: string; description: string; impact: string },
              index: number
            ) => ({
              title: feature.title,
              description: feature.description,
              impact: feature.impact || "",
              order: index,
            })
          ),
        },
        images: {
          create:
            images?.map((imageUrl: string, index: number) => ({
              url: imageUrl,
              order: index,
            })) || [],
        },
      },
      include: {
        techStack: true,
        metrics: true,
        features: true,
        images: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
