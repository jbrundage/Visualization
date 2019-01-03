import { IInput } from "@hpcc-js/api";
import { CodeMirror } from "@hpcc-js/codemirror-shim";
import { HTMLWidget } from "@hpcc-js/common";

import "../src/Editor.css";

export class Editor extends HTMLWidget {
    private _codemirror: CodeMirror.EditorFromTextArea;
    protected _initialText: string = "";

    options(): any {
        return {
            lineNumbers: true,
            tabSize: 2
        };
    }

    hasFocus(): boolean {
        return this._codemirror.hasFocus();
    }

    text(): string;
    text(_: string): this;
    text(_?: string): string | this {
        if (this._codemirror) {
            const doc = this._codemirror.getDoc();
            if (!arguments.length) return doc.getValue();
            doc.setValue(_);
            return this;
        }
        if (!arguments.length) return this._initialText;
        this._initialText = _;
        return this;
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        this._codemirror = CodeMirror.fromTextArea(element.append("textarea").node(), this.options());
        this._codemirror.on("changes", (cm: CodeMirror, changes: object[]) => {
            this.changes(changes);
        });
        this._codemirror.on("keyup", (cm: CodeMirror) => {
            this.change(this, true);
        });
        this.text(this._initialText);
    }

    update(domNode, Element) {
        super.update(domNode, Element);
        this._codemirror.setSize(this.width() - 2, this.height() - 2);
        this._codemirror.refresh();
    }

    //  Events  ---
    changes(changes: object[]) {
    }

    value(): object;
    value(_: object): this;
    value(_?: object): object | this {
        return this.text.apply(this, arguments);
    }

    //  IInput  ---
    name: { (): string; (_: string): Editor };
    name_exists: () => boolean;
    label: { (): string; (_: string): Editor };
    label_exists: () => boolean;
    value_exists: () => boolean;
    validate: { (): string; (_: string): Editor };
    validate_exists: () => boolean;

    //  IInput Events ---
    blur: (w: Editor) => void;
    click: (w: Editor) => void;
    dblclick: (w: Editor) => void;
    change: (w: Editor, complete: boolean) => void;
}
Editor.prototype._class += " codemirror_Editor";
Editor.prototype.implements(IInput.prototype);
