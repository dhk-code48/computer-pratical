"use client";
import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Batch } from "@prisma/client";
import { useBatchStore } from "@/lib/batch-store";

const SelectActiveBatch: FC<{ batchs: Batch[]; activeBatch: Batch | null }> = ({
  batchs,
  activeBatch,
}) => {
  const batchId = useBatchStore((state) => state.batchId);
  const updateBatchId = useBatchStore((state) => state.updateBatchId);
  updateBatchId(activeBatch ? activeBatch.id : batchId);
  return (
    <div>
      <form>
        <div className="relative">
          <Select
            defaultValue={batchId}
            onValueChange={(batchId) => updateBatchId(batchId)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Batch</SelectLabel>
                {batchs.map((batch) => (
                  <SelectItem key={"batch-form " + batch.id} value={batch.id}>
                    Batch : {batch.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
};

export default SelectActiveBatch;
