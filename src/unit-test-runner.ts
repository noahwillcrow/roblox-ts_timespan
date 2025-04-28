/// <reference types="@rbxts/testez/globals" />

import TestEZ from "@rbxts/testez";

const results = TestEZ.TestBootstrap.run([script.Parent!]);
if (results.errors.size() > 0 || results.failureCount > 0) {
	error("Tests failed!");
}
