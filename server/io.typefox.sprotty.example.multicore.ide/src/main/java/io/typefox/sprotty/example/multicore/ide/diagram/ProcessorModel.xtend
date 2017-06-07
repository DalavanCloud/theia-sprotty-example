/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.typefox.sprotty.example.multicore.ide.diagram

import io.typefox.sprotty.api.SModelElement
import io.typefox.sprotty.api.SModelRoot
import java.util.function.Consumer
import org.eclipse.xtend.lib.annotations.Accessors
import org.eclipse.xtend.lib.annotations.ToString

@Accessors@ToString
class Processor extends SModelRoot {
	int rows
	int columns
}

@Accessors@ToString
class Core extends SModelElement {
	int row
	int column
	int kernelNr
	String layout
	Boolean resizeContainer
	Boolean selected
	 
	new() {}
	new(Consumer<Core> initializer) {
		initializer.accept(this)
	}
	
}

@Accessors@ToString
class Crossbar extends SModelElement {
	CoreDirection direction
}

@Accessors@ToString
class Channel extends SModelElement {
	int row
	int column
	CoreDirection direction
}

enum CoreDirection { left, right, up, down }
