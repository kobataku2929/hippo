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
  const groupedItems = groupBy(items, "day");
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

      updateItem(item.id, item.offset, length);
    }

    if (active.data.current.action === "move") {
      const newOffset = calculateOffset(
        delta.x,
        active.data.current.previousOffset
      );

      updateItem(item.id, newOffset, Math.min(item.length, 24 - newOffset));
    }
  };

  return (
    <div className={styles.timelineGrid}>
      <DndContext
        modifiers={[
          restrictToHorizontalAxis,
          restrictToParentElement,
          snapToGridModifier,
        ]}
        onDragEnd={handleDragEnd}
      >
        <div ref={gridRef} className={styles.timelineWidthRef} />
        {Object.entries(groupedItems).map(([day, items]) => (
          <Weekday id={day} key={day}>
            {items.map((item) => (
              <DraggableItem
                id={item.id}
                key={item.id}
                offset={item.offset}
                length={item.length}
                calculateOffset={calculateOffset}
                calculateLength={calculateLength}
              >
                <p>
                  {item.comfortRange[0]} - {item.comfortRange[1]}
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
  ({ offset, length, style, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={styles.timelineItem}
      style={{
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
    if (transform) {
      moveStyles = {
        "--hour-offset": newOffset,
        transform: "translateY(-5px)",
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
