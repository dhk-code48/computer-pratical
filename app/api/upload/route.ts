import { NextRequest, NextResponse } from "next/server";
import fs, { writeFile } from "fs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const pdffile = data.get("file");
    const name = data.get("name")?.toString();
    const chapterId = data.get("chapterId")?.toString();
    const teacherId = data.get("teacherId")?.toString();
    const sectionId = data.get("sectionId")?.toString();
    const published = data.get("published")?.toString();

    if (
      !pdffile ||
      !name ||
      !chapterId ||
      !teacherId ||
      !sectionId ||
      !published
    ) {
      return new Response(JSON.stringify({ message: "Incomplete data" }), {
        status: 400,
      });
    }

    const worksheet = await db.workSheet.create({
      data: {
        name,
        teacherId,
        chapterId,
        published: published === "true" ? true : false,
      },
    });

    const byteData = await new Response(pdffile as Blob).arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/pdf/${worksheet.id}.pdf`;

    writeFile(path, buffer, (err) => {
      console.log("ERROR => ", err);
    });

    const studentsInSection = await db.user.findMany({
      where: {
        sections: {
          some: { id: sectionId },
        },
        role: "STUDENT",
      },
    });

    const studentProgressData = studentsInSection.map((student) => ({
      userId: student.id,
      worksheetId: worksheet.id,
      grading: "N", // You can set an initial grade here
    }));

    await db.studentProgress.createMany({
      data: studentProgressData,
    });

    return new Response(
      JSON.stringify({
        worksheet: { ...worksheet },
        message: "Worksheet Created",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR => ", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.formData();
    const pdffile = data.get("file");
    const name = data.get("name")?.toString();
    const chapterId = data.get("chapterId")?.toString();
    const sectionId = data.get("sectionId")?.toString();
    const teacherId = data.get("teacherId")?.toString();
    const worksheetId = data.get("worksheetId")?.toString();
    const published = data.get("published")?.toString();

    if (
      !sectionId ||
      !name ||
      !chapterId ||
      !teacherId ||
      !worksheetId ||
      !published
    ) {
      return new Response(JSON.stringify({ error: "Incomplete data" }), {
        status: 400,
      });
    }
    console.log("Section Id => ", sectionId);

    if (published === "false") {
      await db.studentProgress.deleteMany({
        where: {
          worksheetId: worksheetId,
        },
      });
    } else if (published === "true") {
      console.log("UMM");
      const studentsInSection = await db.user.findMany({
        where: {
          sections: {
            some: { id: sectionId },
          },
          role: "STUDENT",
        },
      });

      const studentProgressData = studentsInSection.map((student) => ({
        userId: student.id,
        worksheetId,
        grading: "N", // You can set an initial grade here
      }));

      await db.studentProgress.createMany({
        data: studentProgressData,
      });
    }

    const worksheet = await db.workSheet.update({
      where: {
        id: worksheetId,
      },
      data: {
        name,
        teacherId,
        published: published === "true" ? true : false,
        chapterId,
      },
    });

    if (pdffile) {
      const byteData = await new Response(pdffile as Blob).arrayBuffer();
      const buffer = Buffer.from(byteData);
      const path = `./public/pdf/${worksheet.id}.pdf`;

      writeFile(path, buffer, (err) => {
        console.log("ERROR => ", err);
      });
    }

    return new Response(
      JSON.stringify({
        worksheet: { ...worksheet },
        message: "Worksheet Created",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR => ", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
