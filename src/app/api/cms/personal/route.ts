import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// Personal information keys for public API
const PERSONAL_KEYS = [
  "name",
  "greeting",
  "profession",
  "short_description",
  "bio",
  "location",
  "timezone",
  "profile_photo",
  "resume_url",
  "years_experience",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const personalSettings = await prisma.settings.findMany({
      where: {
        key: {
          in: PERSONAL_KEYS,
        },
      },
      orderBy: { key: "asc" },
    });

    // If admin format is requested, require authentication and return admin format
    if (admin) {
      if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Convert to key-value object for admin usage (includes type info)
      const personalInfo = personalSettings.reduce(
        (acc, setting) => {
          let value: number | string | boolean = setting.value;

          // Parse values based on type
          switch (setting.type) {
            case "number":
              value = Number(setting.value);
              break;
            case "boolean":
              value = setting.value === "true";
              break;
            case "json":
              try {
                value = JSON.parse(setting.value);
              } catch (e) {
                console.log(e);

                value = setting.value;
              }
              break;
          }

          acc[setting.key] = {
            value,
            type: setting.type,
          };
          return acc;
        },
        {} as Record<
          string,
          {
            value: number | string | boolean;
            type: string;
          }
        >
      );

      return NextResponse.json(personalInfo);
    }

    // Public format - flat object with defaults
    const defaultValues = {
      name: "Anis Fajar",
      greeting: "Hi, I'm",
      profession: "Versatile Full-Stack Developer",
      short_description:
        "Senior Full-Stack Developer with **3+ years** of hands-on experience building enterprise-level applications. Currently leading technical architecture for healthcare systems serving **400K+ monthly users**.",
      bio: "",
      location: "Indonesia",
      timezone: "UTC+7 (WIB)",
      profile_photo: "/profile.png",
      resume_url: "/resume",
      years_experience: 3,
    };

    // Convert database settings to key-value object
    const databaseInfo = personalSettings.reduce((acc, setting) => {
      let value: number | string | boolean = setting.value;

      // Parse values based on type
      switch (setting.type) {
        case "number":
          value = Number(setting.value);
          break;
        case "boolean":
          value = setting.value === "true";
          break;
        case "json":
          try {
            value = JSON.parse(setting.value);
          } catch (e) {
            console.log(e);

            value = setting.value;
          }
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, number | string | boolean>);

    // Merge defaults with database values (database values override defaults)
    const personalInfo = { ...defaultValues, ...databaseInfo };

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error fetching personal information:", error);
    return NextResponse.json(
      { error: "Failed to fetch personal information" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const personalData = await request.json();

    // Update each personal information field
    const updatePromises = Object.entries<{
      value: number | string | boolean;
      type: string;
    }>(personalData).map(async ([key, data]) => {
      if (!PERSONAL_KEYS.includes(key)) {
        return null; // Skip invalid keys
      }

      const { value, type } = data;

      // Convert value to string based on type
      let stringValue: string;
      switch (type) {
        case "json":
          stringValue = JSON.stringify(value);
          break;
        case "boolean":
          stringValue = String(Boolean(value));
          break;
        case "number":
          stringValue = String(Number(value));
          break;
        default:
          stringValue = String(value || "");
      }

      return prisma.settings.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type },
      });
    });

    // Filter out null promises and execute
    const validPromises = updatePromises.filter((p) => p !== null);
    await Promise.all(validPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating personal information:", error);
    return NextResponse.json(
      { error: "Failed to update personal information" },
      { status: 500 }
    );
  }
}
