import React, { useEffect, useState } from "react";
import ReactDragListView from "react-drag-listview";
import "./style.scss";

export interface DraggedMovement {
  fromId: string;
  toId: string;
}
interface DraggableList {
  list: any[];
  labelTitle: string;
  labelSubtitle: string;
  componentParentId?: string;
  onChangeOrder(data: any[], draggedMovement: DraggedMovement[]): void; 
}
export default function DraggableList({
  list = [],
  labelTitle,
  labelSubtitle,
  componentParentId,
  onChangeOrder = () => {}
}: Readonly<DraggableList>) {
  const [listedData, setListedData] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>({});
  const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
  const [draggedMove, setDraggedMove] = useState<DraggedMovement[]>([]);
  const [touchMove, setTouchMove] = useState<number>(0);

  useEffect(() => {
    setListedData(list);
  }, [list]);


  const historyMovement = (fromIndex: number, toIndex: number) => {
    const toId = listedData[toIndex].id;
    const fromId = listedData[fromIndex].id;
    const isRevertMovement = draggedMove.findIndex(movement => movement.fromId == toId && movement.toId == fromId);
    const isRepeatedMovement = draggedMove.findIndex(movement => movement.fromId == fromId && movement.toId == toId);

    if (isRevertMovement >= 0) {
      draggedMove.splice(isRevertMovement, 1);
    } else 
    if (isRepeatedMovement <= 0) {
      draggedMove.push({ fromId, toId });
    }

    setDraggedMove([...draggedMove]);
  };

  const onDragStart = (e, index) => {
    setDraggedItem(listedData[index]);
    setDraggedItemIndex(index);
  };

  const onTouchEnd = () => {

    if (draggedMove.length) {
      onDragEnd(0,0);
    }
  }
  const onTouchMove = (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      const touch = e.changedTouches[0];
      const movement = touch.clientY;
      const componentParent = document.getElementById(componentParentId || "");
      
      const scroll = (y) => {
        if (componentParent) {
          componentParent.scrollTo(y, y);
        }
      } 
      const moveToNext = (_index) => {
        if (0 <= _index && listedData.length > _index) {
          onDragOver(_index);
          setTimeout(() => {
            setDraggedItemIndex(_index);
          }, 3000);
        }
      }

      if (touchMove > (movement + 5)) {
        const index = draggedItemIndex - 1;
        scroll(movement + 5);
        moveToNext(index);
      } else
      if (touchMove < (movement - 5)) {
        const index = draggedItemIndex + 1;
        scroll(movement - 5);
        moveToNext(index);
      }

      if (!touchMove) {
        setTouchMove(movement);
      }
    }
  }

  const onDragOver = (toIndex) => {
    const draggedOverItem = listedData[toIndex];

    // if the item is dragged over itself, ignore
    if (draggedItem.id === draggedOverItem.id) {
      return;
    }

    // filter out the currently dragged item
    const fromIndex = listedData.findIndex(item => item.id === draggedItem.id);
    const orderedDataList = listedData.filter(item => item.id !== draggedItem.id);

    // add the dragged item after the dragged over item
    orderedDataList.splice(toIndex, 0, draggedItem);

    historyMovement(fromIndex, toIndex);

    return setListedData(orderedDataList);
  };

  const onDragEnd = (fromIndex, toIndex) => {
    /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
    if (toIndex < 0) return;

    /* REORDER PARENT OR SUBLIST, ELSE THROW ERROR */
    const movements: any = [];
    draggedMove.forEach((m) => {
      if (!movements.find(movement => movement.fromId == m.fromId && movement.toId == m.toId)) {
        movements.push(m);  
      }
    });
    onChangeOrder(listedData, movements);
    setDraggedMove([]);
  };
  
  return (
    <ReactDragListView
      nodeSelector=".draggable"
      handleSelector="i"
      lineClassName="dragLine"
      onDragEnd={(fromIndex, toIndex) =>
        onDragEnd(fromIndex, toIndex)
      }
    >
      {listedData.map((data, index) => (
        <div
          className="draggable"
          key={index + "drag"}
          onDragStart={e => onDragStart(e, index)}
          onTouchStart={e => onDragStart(e, index)}
          onDragOver={() => onDragOver(index)}
          onTouchMove={(e) => onTouchMove(e)}
          onTouchEnd={() => onTouchEnd()}>
          <div className="card-listagem mt-4">
            <div className="row">
              <div className="col-1 drag-icon grabbable">
                <i className="bi bi-grip-vertical"></i>
              </div>
              <div className="col-11">
                <div className="card-listagem-text">
                  <p>{data[labelTitle]}</p>
                  <p>{data[labelSubtitle]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ReactDragListView>
  );
};
