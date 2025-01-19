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

const GRIDITEMHEIGHT = 80;
export const TimelineGrid = () => {
  const { gridSize, gridRef } = useGridIncrement();

  const items = useStore((state) => state.items);
  const groupedItems = groupBy(items, "worker");
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
      return clamp(val, 1, 24 - xOffset);
    });
  }

  function handleDragEnd({ active, delta, ...rest }) {
    const {
      id,
      action,
      resizeSide,
      previousLength,
      previousXOffset,
      previousYOffset,
    } = active.data.current;
    const item = getItem(id);

    //要修正　リファクタ
    if (action === "resize") {
      if (resizeSide === "right") {
        const length = calculateLength(delta.x, previousLength, item.xOffset);
        updateItem(item.id, item.worker, item.xOffset, length);
        return;
      }

      if (resizeSide === "left") {
        const newXOffset = calculateXOffset(delta.x, previousXOffset);
        const length = previousLength - (newXOffset - previousXOffset);
        updateItem(item.id, item.worker, newXOffset, Math.max(length, 1));
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
          style={{ height: `calc(--worker-height * ${WorkerIds.length})` }}
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
                gridItemHeight={GRIDITEMHEIGHT}
                calculateXOffset={calculateXOffset}
                transformYPosition={transformYPosition}
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

  //要修正　リファクタ
  const newXOffset = calculateXOffset(transform?.x, xOffset);
  const newYOffset = transformYPosition(transform?.y, gridItemHeight);
  const newLength = calculateLength(rightResizeTransform?.x, length, xOffset);

  const anewXOffset = calculateXOffset(leftResizeTransform?.x, xOffset);
  const anewLength = Math.max(length - (anewXOffset - xOffset), 1);
  function handleTransformStyles() {
    let moveStyles = undefined;
    let resizeStyles = undefined;
    //移動中のcssを計算
    if (transform) {
      moveStyles = {
        "--hour-offset": newXOffset,
        "background-color": "#D0F3F5",
        transform: `translateY(${newYOffset}px)`,
      };
    }
    if (leftResizeTransform) {
      resizeStyles = {
        "--hour-length": anewLength,
        "--hour-offset": anewXOffset,
      };
    }

    if (rightResizeTransform) {
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
