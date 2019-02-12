/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");
let audit = require("../shared/audit");

let errorTemplate = require("./error-template.handlebars");
let altTextErrorTemplate = require("./alt-text-error-template.handlebars");
let aboutTemplate = require("./about.handlebars");

class FormsPlugin extends Plugin {
    getName() {
        return "forms";
    }

    getTitle() {
        return "Forms";
    }

    getDescription() {
        return "Identifies inputs with missing labels";
    }

    getAnnotate() {
        return annotate;
    }

    errorMessage($el) {
        return errorTemplate({
            placeholder: $el.attr("placeholder"),
            id: $el.attr("id"),
            tagName: $el.prop("tagName").toLowerCase()
        });
    }

    altTextErrorMessage($el) {
        return altTextErrorTemplate({
            id: $el.attr("id"),
            tagName: $el.prop("tagName").toLowerCase(),
            type: $el.attr("type"),
        });
    }

    run() {
        // audit doesn't return elements that are decorational
        // or hidden
        let {result, elements} = audit("controlsWithoutLabel");

        if (result === "FAIL") {
            elements.forEach((element) => {
                let $el = $(element);
                let title = "Input is missing a label";

                let tagName = $el.prop("tagName").toLowerCase();

                if (tagName === "video") {
                    return;
                }

                let button = (tagName === "button")
                        || ((tagName === "input")
                            && ["button", "submit", "reset"].some(
                                t => t === $el.attr("type")));

                // Place an error label on the element and register it as an
                // error in the info panel
                let entry;
                if (button) {
                    title = "Button has no text";

                    entry = this.error(
                            title,
                            $(this.altTextErrorMessage($el)),
                            $el);
                } else {
                    entry = this.error(title, $(this.errorMessage($el)), $el);
                }
                annotate.errorLabel($el, "", title, entry);
            });
        }

        $("progress, meter").each((i, el) => {
            let $el = $(el);

            if ($el.attr("role") === "presentation") {
                // ignore presentational elements
                return;
            }

            // filter in the same way as the audit, ignoring elements "which
            // have negative tabindex and an ancestor with a widget role,
            // since they can be accessed neither with tab nor with
            // a screen reader"
            // https://github.com/GoogleChrome/accessibility-developer-tools/blob/3d7c96bf34b3146f40aeb2720e0927f221ad8725/src/audits/ControlsWithoutLabel.js#L38
            if (el.tabindex < 0) {
                return;
            }
            for (let parent = axs.dom.parentElement(el);
                    parent != null;
                    parent = axs.dom.parentElement(parent)) {
                if (axs.utils.elementIsAriaWidget(parent)) {
                    return;
                }
            }

            let text = $el.text().trim();

            if (!axs.utils.hasLabel(el)) {
                let title = "Widget is missing a label";
                let entry = this.error(title, $(this.errorMessage($el)), $el);
                annotate.errorLabel($el, "", title, entry);
            }

            let textAlternatives = {};
            axs.properties.findTextAlternatives(el, textAlternatives);
            let noTextAlternatives = Object.keys(textAlternatives).length === 0;

            if (noTextAlternatives) {
                let title = "Widget has no text";
                let entry = this.error(
                        title,
                        $(this.altTextErrorMessage($el)),
                        $el);
                annotate.errorLabel($el, "", title, entry);
            }
        });

        this.about($(aboutTemplate()));
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = FormsPlugin;
