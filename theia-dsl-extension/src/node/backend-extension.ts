/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, ContainerModule } from "inversify";
import { LanguageContribution, IConnection, createServerProcess, forward } from "theia-core/lib/languages/node";


export default new ContainerModule(bind => {
    bind<LanguageContribution>(LanguageContribution).to(DSLContribution);
});

const EXECUTABLE = './node_modules/theia-dsl-extension/build/example-server/bin/example-server'

@injectable()
class DSLContribution implements LanguageContribution {

    readonly description = {
        id: 'dsl',
        name: 'DSL',
        documentSelector: ['dsl'],
        fileEvents: [
            '**/*.dsl'
        ]
    }

    listen(clientConnection: IConnection): void {
        const args: string[] = [];
        try {
            const serverConnection = createServerProcess(this.description.name, EXECUTABLE, args);
            forward(clientConnection, serverConnection);
        } catch (err) {
            console.error(err)
            console.error("Error starting python language server.")
            console.error("Please make sure it is installed on your system.")
            console.error("Use the following command: 'pip install https://github.com/palantir/python-language-server/archive/master.zip'")
        }
    }

}



