/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { VNode } from "snabbdom/vnode"
import { RenderingContext } from "sprotty/lib/base"
import { SEdge } from "sprotty/lib/graph/model/sgraph"
import { PolylineEdgeView } from "sprotty/lib/graph/view/views"
import { CircularNodeView, RectangularNodeView } from "sprotty/lib/lib"
import { angle, Point, toDegrees } from "sprotty/lib/utils/geometry"
import * as snabbdom from "snabbdom-jsx"
import { BarrierNode, TaskNode } from "./flowmodel"
import { KernelColor } from "./kernel-color"

const JSX = {createElement: snabbdom.svg}

export class TaskNodeView extends CircularNodeView {
    render(node: TaskNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node)
        const fillColor = KernelColor.getSVG(node.kernelNr)
        return <g>
                <circle class-node={true}
                    class-task={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    class-running={node.status === 'running'}
                    class-finished={node.status === 'finished'}
                    fill={fillColor}
                    r={radius} cx={radius} cy={radius}>
                </circle>
                <text x={radius} y={radius + 5} class-text={true}>{node.name}</text>
            </g>
    }

    protected getRadius(node: TaskNode) {
        return 20
    }
}

export class BarrierNodeView extends RectangularNodeView {
    render(node: BarrierNode, context: RenderingContext): VNode {
        return <g>
                <rect class-node={true} class-barrier={true} class-mouseover={node.hoverFeedback} class-selected={node.selected}
                      x="0" y="0" width={node.bounds.width} height={node.bounds.height}></rect>
                <text x={node.bounds.width / 2} y={node.bounds.height / 2 + 5} class-text={true}>{node.name}</text>
            </g>
    }
}

export class FlowEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2]
        const p2 = segments[segments.length - 1]
        return [
            <path class-edge={true} class-arrow={true} d="M 0,0 L 10,-4 L 10,4 Z"
                transform={`rotate(${toDegrees(angle(p2, p1))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ]
    }
}


