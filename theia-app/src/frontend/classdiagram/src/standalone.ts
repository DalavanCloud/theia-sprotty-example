/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TYPES, overrideViewerOptions } from "sprotty/lib/base"
import { SGraphSchema } from "sprotty/lib/graph"
import createContainer from "./di.config"
import { LocalModelSource } from "sprotty/lib/local"

export default function runClassDiagram(containerId: string) {
    const container = createContainer(false)

    // Initialize model
    const node0 = {
        id: 'node0',
        type: 'node:class',
        position: {
            x: 100,
            y: 100
        },
        layout: 'vbox',
        children: [
            {
                id: 'node0_classname',
                type: 'label:heading',
                text: 'Foo'
            },
            {
                id: 'node0_attrs',
                type: 'comp:comp',
                layout: 'vbox',
                children: [
                    {
                        id: 'node0_op2',
                        type: 'label:text',
                        text: 'name: string'
                    }
                ],
            },
            {
                id: 'node0_ops',
                type: 'comp:comp',
                layout: 'vbox',
                children: [
                    {
                        id: 'node0_op0',
                        type: 'label:text',
                        text: '+ foo(): integer'
                    }, {
                        id: 'node0_op1',
                        type: 'label:text',
                        text: '# bar(x: string): void'
                    }
                ],
            }
        ]
    }
    const graph: SGraphSchema = { id: 'graph' + containerId, type: 'graph', children: [node0] }

    // Run
    const modelSource = container.get<LocalModelSource>(TYPES.ModelSource)
    overrideViewerOptions(container, {
        baseDiv: containerId
    })
    modelSource.popupModelProvider = (elementId) => {
        if (elementId === 'node0') {
            return {
                type: 'html',
                id: 'popup',
                children: [
                    {
                        type: 'pre-rendered',
                        id: 'popup-title',
                        code: '<div class="popup-title">Class Foo</div>'
                    },
                    {
                        type: 'pre-rendered',
                        id: 'popup-body',
                        code: '<div class="popup-body"><p>name: string</p><p>+ foo(): integer</p><p># bar(x: string): void</p></div>'
                    }
                ]
            }
        }
        return undefined
    }
    modelSource.setModel(graph)

    return container
}
