import styles from "./styles.module.css";

import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import {
  createSnapModifier,
  restrictToParentElement,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";
import { forwardRef, useEffect, useState, useRef } from "react";
import { clamp, mergeRefs, groupBy } from "@/libs/dragAndDrop/utils";

import { useStore } from "@/libs/dragAndDrop/UseStore";

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

export const TimelineGrid = () => {
  const { gridSize, gridRef } = useGridIncrement();

  const items = useStore((state) => state.items);
  const groupedItems = groupBy(items, "worker");
  const updateItem = useStore((state) => state.updateItem);
  const getItem = useStore((state) => state.getItem);

  const snapToGridModifier = createSnapModifier(gridSize / 4);

  function transformPosition(dx, lastX, clampFn) {
    const offsetDelta = positionToOffset(dx, gridSize);
    const newXOffset = lastX + offsetDelta;
    const clampedOffset = clampFn(newXOffset);
    return clampedOffset;
  }

  function calculateXOffset(pos, lastX) {
    return transformPosition(pos, lastX, function (val) {
      return clamp(val, 0, 23);
    });
  }

  function calculateYOffset(pos, lastX) {
    const gridItemHeight = 80;
    const temporaryNewYOffset =
      Math.round(pos / gridItemHeight) * gridItemHeight;
    return temporaryNewYOffset / gridItemHeight + lastX;
  }

  function calculateLength(pos, lastX, xOffset) {
    return transformPosition(pos, lastX, function (val) {
      return clamp(val, 1, 24 - xOffset);
    });
  }

  function handleDragEnd({ active, delta, ...rest }) {
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
      const newXOffset =
        delta.x == 0
          ? active.data.current.previousXOffset
          : calculateXOffset(delta.x, active.data.current.previousXOffset);

      const newYOffset =
        delta.y == 0
          ? active.data.current.previousYOffset
          : calculateYOffset(delta.y, active.data.current.previousYOffset);

      const adjustedLength = Math.min(item.length, 24 - newXOffset);

      updateItem(item.id, newYOffset, newXOffset, adjustedLength);
    }
  }

  // 小数点以下を時刻ように置換する
  function replaceFraction(value) {
    const strValue = value.toFixed(2);
    return strValue
      .replace(".25", ".15")
      .replace(".50", ".30")
      .replace(".75", ".45");
  }

  const WorkerIds = Array.from(new Set(Object.keys(groupedItems)));

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
      previousYOffset: yOffset,
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

  function handleTransformStyles() {
    let moveStyles = undefined;
    let resizeStyles = undefined;
    //移動中のcssを計算
    if (transform) {
      const temporaryNewYOffset = Math.round(transform.y / 80) * 80;

      moveStyles = {
        "--hour-offset": newXOffset,
        "background-color": "#D0F3F5",
        transform: `translateY(${temporaryNewYOffset}px)`,
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
  }

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
