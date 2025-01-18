import styles from "./styles.module.css";

import {
  DndContext,
  useDroppable,
  useDraggable,
  // DragOverlay
} from "@dnd-kit/core";
import {
  createSnapModifier,
  restrictToParentElement,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";
import { forwardRef, useEffect, useState, useRef } from "react";
import { clamp, mergeRefs, groupBy } from "@/libs/dragAndDrop/utils";

import { useStore } from "@/libs/dragAndDrop/UseStore";

const positionToOffset = (position, gridSize) => {
  const result = Math.min(position / gridSize);
  return result;
};

const useGridIncrement = () => {
  const [gridSize, setGridSize] = useState(0);
  const [gridHeightSize, setGridHeightSize] = useState(0);
  const gridRef = useRef(null);
  useEffect(() => {
    if (gridRef.current) {
      const bbox = gridRef.current.getBoundingClientRect();
      const gridSize = bbox.width;
      const gridHeightSize = bbox.height;
      setGridSize(gridSize);
      setGridHeightSize(gridHeightSize);
    }
  }, [gridRef]);

  return { gridSize, gridHeightSize, gridRef };
};

export const TimelineGrid = () => {
  const { gridSize, gridHeightSize, gridRef } = useGridIncrement();

  const items = useStore((state) => state.items);
  const groupedItems = groupBy(items, "worker");
  const updateItem = useStore((state) => state.updateItem);
  const getItem = useStore((state) => state.getItem);

  const snapToGridModifier = createSnapModifier(gridSize / 4);
  const transformPosition = (dx, lastX, clampFn) => {
    const offsetDelta = positionToOffset(dx, gridSize);
    const newOffset = lastX + offsetDelta;

    const clampedOffset = clampFn(newOffset);
    return clampedOffset;
  };
  const calculateOffset = (pos, lastX) =>
    transformPosition(pos, lastX, (val) => clamp(val, 0, 23));

  const calculateLength = (pos, lastX, offset) =>
    transformPosition(pos, lastX, (val) => clamp(val, 1, 24 - offset));

  const handleDragEnd = ({ active, delta, ...rest }) => {
    const item = getItem(active.data.current.id);
    if (active.data.current.action === "resize") {
      const length = calculateLength(
        delta.x,
        active.data.current.previousLength,
        item.offset
      );
      updateItem(item.id, item.worker, item.offset, length);
    }

    if (active.data.current.action === "move") {
      //itemが縦で動いた時
      if (delta.y !== 0) {
        //下記のadjustedYと処理を共通化する
        const adjustedY = delta?.y ? Math.round(delta.y / 80) * 80 : 0;

        const worker = adjustedY / 80 + item.worker;
        console.log(adjustedY, worker, item.worker);
        updateItem(
          item.id,
          worker,
          active.data.current.previousOffset,
          Math.min(item.length, 24 - active.data.current.previousOffset)
        );
      }
      //シフトitemが横に動いた時
      if (delta.x !== 0) {
        const newOffset = calculateOffset(
          delta.x,
          active.data.current.previousOffset
        );
        updateItem(
          item.id,
          active.data.current.verticalOffset,
          newOffset,
          Math.min(item.length, 24 - newOffset)
        );
      }
    }
  };

  // 小数点以下を時刻ように置換する
  const replaceFraction = (value) => {
    const strValue = value.toFixed(2);
    return strValue
      .replace(".25", ".15")
      .replace(".50", ".30")
      .replace(".75", ".45");
  };

  const WorkerIds = Array.from(new Set(Object.keys(groupedItems)));
  console.log(groupedItems);
  return (
    <div className={styles.timelineGrid}>
      <DndContext
        modifiers={[
          // restrictToHxorizontalAxis,
          // restrictToParentElement,
          snapToGridModifier,
        ]}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={gridRef}
          className={styles.timelineWidthRef}
          style={{ height: `calc(80px * ${WorkerIds.length})` }}
        />
        {Object.entries(groupedItems).map(([worker, items]) => (
          <Weekday id={worker} key={worker}>
            {items.map((item) => (
              <DraggableItem
                id={item.id}
                key={item.id}
                offset={item.offset}
                verticalOffset={item.worker}
                previousVerticalOffset={item.worker}
                length={item.length}
                calculateOffset={calculateOffset}
                calculateLength={calculateLength}
              >
                <p>
                  {item.worker}@{replaceFraction(item.offset)} -
                  {replaceFraction(item.offset + item.length)}
                </p>
              </DraggableItem>
            ))}
          </Weekday>
        ))}
      </DndContext>
    </div>
  );
};

const Weekday = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
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
  ({ offset, verticalOffset, length, style, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={styles.timelineItem}
      style={{
        "--worker-offset": verticalOffset,
        "--hour-offset": offset,
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
  offset,
  verticalOffset,
  previousVerticalOffset,
  length,
  calculateOffset,
  calculateLength,
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
      previousOffset: offset,
      verticalOffset: verticalOffset,
      previousVerticalOffset: previousVerticalOffset,
    },
  });

  const {
    setNodeRef: resizeSetNodeRef,
    listeners: resizeListeners,
    transform: resizeTransform,
    attributes: resizeAttributes,
    setActivatorNodeRef: setResizeActivatorNodeRef,
  } = useDraggable({
    id: `${id}-resize`,
    data: {
      id,
      action: "resize",
      previousLength: length,
    },
  });

  const newOffset = calculateOffset(transform?.x, offset);
  const newLength = calculateLength(resizeTransform?.x, length, offset);
  const handleTransformStyles = () => {
    let moveStyles = undefined;
    let resizeStyles = undefined;
    //移動中のcssを計算
    if (transform) {
      const adjustedY = transform?.y ? Math.round(transform.y / 80) * 80 : 0;
      moveStyles = {
        "--hour-offset": newOffset,
        "background-color": "#D0F3F5",
        transform: `translateY(${adjustedY}px)`,
      };
    }

    if (resizeTransform) {
      resizeStyles = {
        "--hour-length": newLength,
      };
    }

    return {
      ...moveStyles,
      ...resizeStyles,
    };
  };
  const style = handleTransformStyles();

  return (
    <GridItem
      ref={mergeRefs(parentRef, setNodeRef, resizeSetNodeRef)}
      offset={offset}
      verticalOffset={verticalOffset}
      length={length}
      style={style}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{children}</div>
        <div>
          <button ref={setActivatorNodeRef} {...listeners} {...attributes}>
            ::
          </button>
          <button
            ref={setResizeActivatorNodeRef}
            {...resizeListeners}
            {...resizeAttributes}
          >
            {`<>`}
          </button>
        </div>
      </div>
      <div
        className={`timelineTimes ${isDragging ? "timelineTimes--show" : ""}`}
      ></div>
    </GridItem>
  );
};
