import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";


function SortableItem({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#C9E5D9" : "white",
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b cursor-grab">
      <td className="py-3 px-4 flex items-center gap-2 text-[#165C6D]">
        <GripVertical size={18} {...attributes} {...listeners} className="text-gray-400" />
        <b>{item.label}</b>
      </td>

      <td className="px-4 text-gray-600">{item.value}</td>

      <td className="px-4 text-gray-800 font-semibold">{item.sortOrder}</td>

      <td className="px-4 text-right">
        {item.actions}
      </td>
    </tr>
  );
}


export default function SortableList({ items, onSortEnd }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(items, oldIndex, newIndex);

    onSortEnd(newOrder); // skickas tillbaka till LookupManager
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
