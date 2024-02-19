import { User } from "@prisma/client";
import React, { FC } from "react";
import { Row } from "read-excel-file";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentTabel: FC<{
  datas: Row[];
}> = ({ datas }) => {
  return (
    <div className=" overflow-scroll">
      <Table>
        <TableCaption>Preview Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Reg No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datas.map(
            (data, i) =>
              i !== 0 && (
                <TableRow key={"student-table " + i}>
                  <TableCell>{data[0].toString()}</TableCell>
                  <TableCell>{data[1].toString()}</TableCell>
                  <TableCell>{data[2].toString()}</TableCell>
                  <TableCell>{data[3].toString()}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTabel;
