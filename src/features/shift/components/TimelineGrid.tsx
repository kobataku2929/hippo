"use client";

import styles from "./styles.module.css";

import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { createSnapModifier } from "@dnd-kit/modifiers";
import { forwardRef, useEffect, useState, useRef } from "react";
import {
  clamp,
  mergeRefs,
  createUserYOffsetMaps,
} from "@/features/shift/utils/dragAndDropUtils";
import { initializeStore } from "@/features/shift/hooks/UseStore";
import { updateDailyShift } from "@/utils/supabase/updateQueries";
import { addHyphensToDate } from "@/features/shift/libs/format";
import { shifts, profiles } from "../../../../database.types";
type TimelineGridProps = {
  dailyShifts: shifts;
  shiftStatus: string;
  workers: profiles;
};

function positionToOffset(position, gridSize) {
  const result = Math.min(position / gridSize);
  return result;
}

function useGridIncrement() {
  const [gridSize, setGridSize] = useState(0);
  const gridRef = useRef(null);
  useEffect(() => {
    if (gridRef.current) {
      const bbox = gridRef.current.getBoundingClientRect();
      const gridSize = bbox.width;
      setGridSize(gridSize);
    }
  }, [gridRef]);

  return { gridSize, gridRef };
}

const GRIDITEMHEIGHT = 80;

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  dailyShifts,
  shiftStatus,
  workers,
}) => {
  const { gridSize, gridRef } = useGridIncrement();
  const { yOffsetToUserMap } = createUserYOffsetMaps(workers);

  const useStore = initializeStore(dailyShifts, workers);
  const items = useStore((state) => state.items);
  const updateItem = useStore((state) => state.updateItem);
  const getItem = useStore((state) => state.getItem);

  const snapToGridModifier = createSnapModifier(gridSize / 4);

  function transformXPosition(dx, lastX, clampFn) {
    const offsetDelta = positionToOffset(dx, gridSize);
    const newXOffset = lastX + offsetDelta;
    const clampedOffset = clampFn(newXOffset);
    return clampedOffset;
  }

  function calculateXOffset(pos, lastX) {
    return transformXPosition(pos, lastX, function (val) {
      return clamp(val, 0, 23);
    });
  }

  function transformYPosition(dx, gridItemHeight) {
    return Math.round(dx / gridItemHeight) * gridItemHeight;
  }

  function calculateYOffset(pos, lastY) {
    const newYOffset = transformYPosition(pos, GRIDITEMHEIGHT);
    return newYOffset / GRIDITEMHEIGHT + lastY;
  }

  function calculateLength(pos, lastX, xOffset) {
    return transformXPosition(pos, lastX, function (val) {
      return clamp(val, 0.25, 24 - xOffset);
    });
  }

  async function handleDragEnd({ active, delta, ...rest }) {
    const {
      id,
      action,
      resizeSide,
      previousLength,
      previousXOffset,
      previousYOffset,
    } = active.data.current;
    const item = getItem(id);

    if (action === "resize") {
      if (resizeSide === "right") {
        const length = calculateLength(delta.x, previousLength, item.xOffset);
        updateItem(item.id, item.yOffset, item.xOffset, length);
        return;
      }

      if (resizeSide === "left") {
        const newXOffset = calculateXOffset(delta.x, previousXOffset);
        const length = clamp(
          previousLength - (newXOffset - previousXOffset),
          0.25,
          24 - previousXOffset
        );
        updateItem(item.id, item.yOffset, newXOffset, length);
        return;
      }
    }

    if (action === "move") {
      const newXOffset =
        delta.x == 0
          ? previousXOffset
          : calculateXOffset(delta.x, previousXOffset);

      const newYOffset =
        delta.y == 0
          ? previousYOffset
          : calculateYOffset(delta.y, previousYOffset);

      const adjustedLength = Math.min(item.length, 24 - newXOffset);
      updateItem(item.id, newYOffset, newXOffset, adjustedLength);

      const today = addHyphensToDate(shiftStatus);

      const fromTime = replaceToDate(today, replaceFraction(newXOffset));
      const toTime = replaceToDate(
        today,
        replaceFraction(newXOffset + adjustedLength)
      );

      await updateDailyShift(
        yOffsetToUserMap[newYOffset],
        fromTime,
        toTime,
        id
      );
    }
  }

  // 小数点以下を時刻ように置換する
  function replaceFraction(value: number) {
    const strValue = value.toFixed(2);
    return strValue
      .replace(".25", ".15")
      .replace(".50", ".30")
      .replace(".75", ".45");
  }

  function replaceToDate(today: string, figureStr: string) {
    // 15.15 を "15:15" に変換
    const hourMinute = figureStr.padStart(5, "0").replace(".", ":");
    // today の "T" の後ろを置換
    return today + "T" + hourMinute + ":00 ";
  }

  return (
    <div className={styles.timelineGrid}>
      <DndContext modifiers={[snapToGridModifier]} onDragEnd={handleDragEnd}>
        <div
          ref={gridRef}
          className={styles.timelineWidthRef}
          style={{ height: `calc(--worker-height * ${workers?.length})` }}
        />
        {workers?.map((worker, index) => {
          const workerShifhts = items.filter((item) => item.user === worker.id);
          return (
            <Worker id={worker.id} key={worker.id}>
              {workerShifhts.map((item) => (
                <DraggableItem
                  id={item.id}
                  key={item.id}
                  xOffset={item.xOffset}
                  yOffset={index}
                  length={item.length}
                  gridItemHeight={GRIDITEMHEIGHT}
                  calculateXOffset={calculateXOffset}
                  transformYPosition={transformYPosition}
                  calculateLength={calculateLength}
                >
                  <p>
                    {item.workerName}@{replaceFraction(item.xOffset)} -{" "}
                    {replaceFraction(item.xOffset + item.length)}
                  </p>
                </DraggableItem>
              ))}
            </Worker>
          );
        })}
      </DndContext>
    </div>
  );
};

const Worker = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${id}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <div className={styles.timelineGridRow} ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const GridItem = forwardRef(
  ({ xOffset, yOffset, length, style, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={styles.timelineItem}
      style={{
        "--worker-offset": yOffset,
        "--hour-offset": xOffset,
        "--hour-length": length,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);

GridItem.displayName = "GridItem";

const DraggableItem = ({
  id,
  xOffset,
  yOffset,
  length,
  gridItemHeight,
  calculateXOffset,
  calculateLength,
  transformYPosition,
  children,
}) => {
  const parentRef = useRef(null);
  const {
    setNodeRef,
    listeners,
    transform,
    attributes,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: `${id}-move`,
    data: {
      id,
      action: "move",
      previousXOffset: xOffset,
      previousYOffset: yOffset,
    },
  });

  const {
    setNodeRef: leftResizeSetNodeRef,
    listeners: leftResizeListeners,
    transform: leftResizeTransform,
    attributes: leftResizeAttributes,
    setActivatorNodeRef: setLeftResizeActivatorNodeRef,
  } = useDraggable({
    id: `${id}-resize-left`,
    data: {
      id,
      action: "resize",
      resizeSide: "left",
      previousLength: length,
      previousXOffset: xOffset,
    },
  });

  const {
    setNodeRef: rightResizeSetNodeRef,
    listeners: rightResizeListeners,
    transform: rightResizeTransform,
    attributes: rightResizeAttributes,
    setActivatorNodeRef: setRightResizeActivatorNodeRef,
  } = useDraggable({
    id: `${id}-resize-right`,
    data: {
      id,
      action: "resize",
      resizeSide: "right",
      previousLength: length,
      previousXOffset: xOffset,
    },
  });

  const newXOffset = calculateXOffset(transform?.x, xOffset);
  const newYOffset = transformYPosition(transform?.y, gridItemHeight);
  const newLengthRight = calculateLength(
    rightResizeTransform?.x,
    length,
    xOffset
  );
  const newXOffsetLeft = calculateXOffset(leftResizeTransform?.x, xOffset);
  const newLengthLeft = clamp(
    length - (newXOffsetLeft - xOffset),
    0.25,
    24 - xOffset
  );

  function handleTransformStyles() {
    let moveStyles = undefined;
    let resizeStyles = undefined;
    //移動中のcssを計算
    if (transform) {
      moveStyles = {
        "--hour-offset": newXOffset,
        backgroundColor: "#D0F3F5",
        transform: `translateY(${newYOffset}px)`,
      };
    }
    if (leftResizeTransform) {
      resizeStyles = {
        "--hour-length": newLengthLeft,
        "--hour-offset": newXOffsetLeft,
      };
      //dragItemの右側を固定
      if (newXOffsetLeft >= length + xOffset) {
        resizeStyles["--hour-offset"] = length + xOffset - 0.25;
      }
    }

    if (rightResizeTransform) {
      resizeStyles = {
        "--hour-length": newLengthRight,
      };
    }

    return {
      ...moveStyles,
      ...resizeStyles,
    };
  }

  const style = handleTransformStyles();

  return (
    <GridItem
      ref={mergeRefs(
        parentRef,
        setNodeRef,
        leftResizeSetNodeRef,
        rightResizeSetNodeRef
      )}
      xOffset={xOffset}
      yOffset={yOffset}
      length={length}
      style={style}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          ref={setLeftResizeActivatorNodeRef}
          {...leftResizeListeners}
          {...leftResizeAttributes}
        >
          {`<`}
        </button>
        <div>{children}</div>
        <div>
          <button ref={setActivatorNodeRef} {...listeners} {...attributes}>
            ::
          </button>

          <button
            ref={setRightResizeActivatorNodeRef}
            {...rightResizeListeners}
            {...rightResizeAttributes}
          >
            {`>`}
          </button>
        </div>
      </div>
      <div
        className={`timelineTimes ${isDragging ? "timelineTimes--show" : ""}`}
      ></div>
    </GridItem>
  );
};
