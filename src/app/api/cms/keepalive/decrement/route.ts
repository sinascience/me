import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Find the dont_remove_this setting
    const setting = await prisma.settings.findUnique({
      where: { key: "dont_remove_this" }
    });

    if (!setting) {
      return NextResponse.json(
        { error: "Keep-alive setting not found" },
        { status: 404 }
      );
    }

    const currentValue = parseInt(setting.value) || 0;
    const newValue = Math.max(0, currentValue - 1); // Prevent negative values

    // Update the setting value
    await prisma.settings.update({
      where: { key: "dont_remove_this" },
      data: { value: newValue.toString() }
    });

    return NextResponse.json({
      success: true,
      message: "Keep-alive counter decremented",
      previousValue: currentValue,
      newValue: newValue,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Keep-alive decrement error:", error);
    return NextResponse.json(
      { error: "Failed to decrement keep-alive counter" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}