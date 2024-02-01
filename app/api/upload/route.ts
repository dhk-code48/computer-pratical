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

    if (!pdffile || !name || !chapterId || !teacherId || !sectionId || !published) {
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

    const byteData = await pdffile.arrayBuffer();
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

    if (!sectionId || !name || !chapterId || !teacherId || !worksheetId || !published) {
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
      const byteData = await pdffile.arrayBuffer();
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

// export async function PUT(request: NextRequest) {
//   try {
//     const requestBody = await request.json();

//     const { updatedData, userId, worksheetId } = requestBody;

//     if (!updatedData || !userId || !worksheetId) {
//       return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
//     }

//     await connectMongoDb();

//     const adminUser = await UserSchema.findById(userId);

//     if (!adminUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 403 });
//     }

//     if (adminUser.role === "teacher" || adminUser.role === "superadmin") {
//       const worksheet = await WorkSheetModel.findByIdAndUpdate(
//         worksheetId,
//         {
//           title: updatedData.title,
//           state: updatedData.state,
//           chapterId: updatedData.chapterId,
//           description: updatedData.description,
//           gradeId: updatedData.gradeId,
//           sectionId: updatedData.sectionId,
//           pdfLink: updatedData.pdfLink,
//         },
//         { new: true }
//       );

//       if (!worksheet) {
//         return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
//       }

//       return NextResponse.json({ worksheet, message: "Worksheet Created" }, { status: 201 });
//     } else {
//       return NextResponse.json({ error: "Permission Denied !!" }, { status: 500 });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest) {
//   const sectionId = request.nextUrl.searchParams.get("sectionId");
//   const chapterId = request.nextUrl.searchParams.get("chapterId");
//   const worksheetId = request.nextUrl.searchParams.get("worksheetId");

//   await connectMongoDb();
//   if (sectionId) {
//     try {
//       const worksheets: Worksheet[] = await WorkSheetModel.find({
//         sectionId: sectionId,
//       });

//       if (worksheets.length > 0) {
//         return NextResponse.json({ worksheets }, { status: 200 });
//       } else {
//         return NextResponse.json({ error: "No worksheets found" }, { status: 404 });
//       }
//     } catch (error) {
//       console.error("Error in GET request:", error);
//       return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//     }
//   }
//   if (chapterId) {
//     try {
//       const worksheets = await WorkSheetModel.find({
//         chapterId: chapterId,
//       }).lean();
//       if (worksheets) {
//         return NextResponse.json({ worksheets }, { status: 200 });
//       } else {
//         return NextResponse.json({ error: "No worksheets found" }, { status: 404 });
//       }
//     } catch {
//       return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//     }
//   }
//   if (worksheetId) {
//     try {
//       const worksheet = await WorkSheetModel.findById(worksheetId).lean();
//       return NextResponse.json({ ...worksheet }, { status: 200 });
//     } catch {
//       return NextResponse.json({ error: "An Error Occured" }, { status: 500 });
//     }
//   }
// }
