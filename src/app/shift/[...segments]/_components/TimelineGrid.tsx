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
  const gridRef = useRef(null);
  useEffect(() => {
    if (gridRef.current) {
      const bbox = gridRef.current.getBoundingClientRect();
      const gridSize = bbox.width;
      setGridSize(gridSize);
    }
  }, [gridRef]);

  return { gridSize, gridRef };
};

export const TimelineGrid = () => {
  const { gridSize, gridRef } = useGridIncrement();

  const items = useStore((state) => state.items);
  const groupedItems = groupBy(items, "worker");
  const updateItem = useStore((state) => state.updateItem);
  const getItem = useStore((state) => state.getItem);

  const snapToGridModifier = createSnapModifier(gridSize / 4);
  const transformPosition = (dx, lastX, clampFn) => {
    const offsetDelta = positionToOffset(dx, gridSize);
    const newXOffset = lastX + offsetDelta;

    const clampedOffset = clampFn(newXOffset);
    return clampedOffset;
  };
  const calculateXOffset = (pos, lastX) =>
    transformPosition(pos, lastX, (val) => clamp(val, 0, 23));

  // const calculateYOffset = (pos, lastX) =>
  //   transformPosition(pos, lastX, (val) => clamp(val, 0, 23));

  const calculateLength = (pos, lastX, xOffset) =>
    transformPosition(pos, lastX, (val) => clamp(val, 1, 24 - xOffset));

  const handleDragEnd = ({ active, delta, ...rest }) => {
    const item = getItem(active.data.current.id);
    if (active.data.current.action === "resize") {
      const length = calculateLength(
        delta.x,
        active.data.current.previousLength,
        item.xOffset
      );
      updateItem(item.id, item.worker, item.xOffset, length);
    }

    if (active.data.current.action === "move") {
      //シフトitemが横に動いた時
      if (delta.x !== 0) {
        const newXOffset = calculateXOffset(
          delta.x,
          active.data.current.previousXOffset
        );
        updateItem(
          item.id,
          active.data.current.yOffset,
          newXOffset,
          Math.min(item.length, 24 - newXOffset)
        );
      }
      //itemが縦で動いた時
      if (delta.y !== 0) {
        //下記のadjustedYと処理を共通化する
        const newYOffset = delta?.y ? Math.round(delta.y / 80) * 80 : 0;
        // const newYOffset = calculateYOffset(delta?.y)

        const worker = newYOffset / 80 + item.worker;
        updateItem(
          item.id,
          worker,
          active.data.current.previousXOffset,
          Math.min(item.length, 24 - active.data.current.previousXOffset)
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
                xOffset={item.xOffset}
                yOffset={item.worker}
                previousYOffset={item.worker}
                length={item.length}
                calculateXOffset={calculateXOffset}
                calculateLength={calculateLength}
              >
                <p>
                  {item.worker}@{replaceFraction(item.xOffset)} -
                  {replaceFraction(item.xOffset + item.length)}
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
  previousYOffset,
  length,
  calculateXOffset,
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
      previousXOffset: xOffset,
      yOffset: yOffset,
      previousYOffset: previousYOffset,
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

  const newXOffset = calculateXOffset(transform?.x, xOffset);
  const newLength = calculateLength(resizeTransform?.x, length, xOffset);
  const handleTransformStyles = () => {
    let moveStyles = undefined;
    let resizeStyles = undefined;
    //移動中のcssを計算
    if (transform) {
      const newYOffset = transform?.y ? Math.round(transform.y / 80) * 80 : 0;
      moveStyles = {
        "--hour-offset": newXOffset,
        "background-color": "#D0F3F5",
        transform: `translateY(${newYOffset}px)`,
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
      xOffset={xOffset}
      yOffset={yOffset}
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
