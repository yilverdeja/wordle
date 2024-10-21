import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { worker } from "./msw/worker";

afterEach(() => {
	cleanup();
});

// Start worker before all tests
beforeAll(() => {
	worker.listen();
});

//  Close worker after all tests
afterAll(() => {
	worker.close();
});

// Reset handlers after each test `important for test isolation`
afterEach(() => {
	worker.resetHandlers();
});
