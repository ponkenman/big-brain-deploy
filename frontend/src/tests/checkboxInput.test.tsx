import { fireEvent, render } from "@testing-library/react";
import CheckboxInput from "../components/forms/checkboxInput";

let number = 0

const [defaultProps]: Parameters<typeof CheckboxInput> = [{
    labelName: "Checkbox",
    id: "checkbox",
    onChange: () => number++
}];

describe("CheckboxInput", () => {
    it("renders", () => {
        render(<CheckboxInput {...defaultProps} />);
    })

    it("Fires onChange function when ticked and unticked", () => {
        const elem = render(<CheckboxInput {...defaultProps} />);
        const checkbox = elem.container.querySelector("#checkbox");
        fireEvent.click(checkbox);
        expect(checkbox.checked);
        fireEvent.click(checkbox);
        expect(!checkbox.checked);
        expect(number).to.be.eq(2);
    });

    it("Initialises as checked if passed in props", () => {
        const elem = render(<CheckboxInput {...{...defaultProps, checked: true }} />);
        const checkbox = elem.container.querySelector("#checkbox");
        expect(checkbox.checked);
    });
});