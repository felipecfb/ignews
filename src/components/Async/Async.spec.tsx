import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

test("It renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello world")).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText("Button"));
});
