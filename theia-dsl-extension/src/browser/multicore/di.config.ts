/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { SCompartmentView, SLabelView } from 'sprotty/lib/graph';
import { Container, ContainerModule } from "inversify"
import { defaultModule, TYPES, ViewRegistry, overrideViewerOptions } from "sprotty/lib/base"
import { ChipModelFactory } from "./chipmodel-factory"
import { ConsoleLogger, LogLevel } from "sprotty/lib/utils"
import { WebSocketDiagramServer } from "sprotty/lib/remote"
import { boundsModule, selectModule, viewportModule, moveModule, fadeModule, hoverModule } from "sprotty/lib/features"
import { ProcessorView, CoreView, CrossbarView, ChannelView, SimpleCoreView } from "./views"
import { LocalModelSource } from "sprotty/lib/local/local-model-source"
import { HtmlRootView, PreRenderedView } from "sprotty/lib/lib"

const multicoreModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.log)
    rebind(TYPES.IModelFactory).to(ChipModelFactory).inSingletonScope()
})

export default (useWebsocket: boolean) => {
    const container = new Container()
    container.load(defaultModule, boundsModule, selectModule, moveModule, viewportModule, fadeModule, multicoreModule, hoverModule)
    if (useWebsocket)
        container.bind(TYPES.ModelSource).to(WebSocketDiagramServer).inSingletonScope()
    else
        container.bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope()
    overrideViewerOptions(container, {
        baseDiv: 'sprotty-cores',
        popupDiv: 'sprotty-popup-cores',
        boundsComputation: 'fixed'
    })

    // Register views
    const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry)
    viewRegistry.register('processor', ProcessorView)
    viewRegistry.register('core', CoreView)
    viewRegistry.register('simplecore', SimpleCoreView)
    viewRegistry.register('crossbar', CrossbarView)
    viewRegistry.register('channel', ChannelView)
    viewRegistry.register('label:heading', SLabelView)
    viewRegistry.register('label:info', SLabelView)
    viewRegistry.register('comp', SCompartmentView)
    viewRegistry.register('html', HtmlRootView)
    viewRegistry.register('pre-rendered', PreRenderedView)
    
    return container
}
