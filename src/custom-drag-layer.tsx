import type { CSSProperties, FC } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDragLayer } from 'react-dnd'
import Tile, { TileType } from './tile'

const layerStyles: CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
}

export const CustomDragLayer = () => {
    const { itemType, isDragging, item, initialOffset, currentOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        }))

         function snapToGrid(x: number, y: number): [number, number] {
            const snappedX = Math.round(x / 32) * 32
            const snappedY = Math.round(y / 32) * 32
            return [snappedX, snappedY]
          }

    function getItemStyles(
        initialOffset: XYCoord | null,
        currentOffset: XYCoord | null,
        
    ) {
        if (!initialOffset || !currentOffset) {
            return {
                display: 'block',
            }
        }

        

        let { x, y } = currentOffset

        //Center mouse on dragged tile component  
        x += initialOffset.x - (96/2)
        y += initialOffset.y - 96

        //console.log(`Manual diff ${currentOffset.x - initialOffset.x},${currentOffset.y - initialOffset.y} `)
        //console.log(`Auto diff ${diff?.x},${diff?.y} `)

        const transform = `translate(${x}px, ${y}px)`
        return {
            transform,
            WebkitTransform: transform,
        }
    }

    function renderItem() {
        switch (itemType) {
            case TileType.FILLED:
                return (
                    <Tile
                        title={item.title}
                        color={item.color}
                        type={itemType}
                        id={item.id}
                    />
                )
            default:
                return null
        }
    }

    if (!isDragging) {
        return null
    }
    return (
        <div style={layerStyles}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {renderItem()}
            </div>
        </div>
    )
}
