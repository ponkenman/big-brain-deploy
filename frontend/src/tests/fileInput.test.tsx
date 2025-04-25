import { fireEvent, render, screen } from "@testing-library/react";
import FileSelect from "../components/forms/fileInput";

let number = 0
const [defaultProps]: Parameters<typeof FileSelect> = [{
    labelName: "FileInput",
    id: "fileinput",
    accept: ".png",
    onChange: () => number++
}];

describe("FileInput", () => {
    it("renders", () => {
        render(<FileSelect {...defaultProps} />);
    })

    it("Fires onChange function when selecting a file", () => {
        render(<FileSelect {...defaultProps} />);
        const fileInput = screen.getByLabelText("FileInput") as HTMLInputElement;
        
        const file = new File(["Test content"], "test.png", { type: "image/png" });
        fireEvent.change(fileInput, 
            {target: { files: [file] },
        });
    
        expect(fileInput.files?.[0]).to.be.eq(file);
        expect(number).to.be.eq(1);
    });
});