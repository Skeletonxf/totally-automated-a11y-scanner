/**
 * Allows users to see what screen readers would see.
 */

let $ = require("jquery");
let Plugin = require("../base");

let aboutTemplate = require("./about.handlebars");

require("./style.less");

class A11yTextWand extends Plugin {
    getName() {
        return "a11y-text-wand";
    }

    getTitle() {
        return "Screen Reader Wand";
    }

    getDescription() {
        return "Hover over elements to view them as a screen reader would";
    }

    run() {
        // We provide a temporary about to force the info panel to
        // render.
        this.about($(aboutTemplate()));
        this.panel.render();

        let panel = this.panel;
        $(document).on("mousemove.wand", function(e) {
            let element = document.elementFromPoint(e.clientX, e.clientY);

            let textAlternative = axs.properties.findTextAlternatives(
                element, {});

            $(".tota11y-outlined").removeClass("tota11y-outlined");
            $(element).addClass("tota11y-outlined");

            if (!textAlternative) {
                panel.directRender(
                    <i className="tota11y-nothingness">
                        No text visible to a screen reader
                    </i>
                );
            } else {
                panel.directRender(textAlternative);
            }
        });
    }

    cleanup() {
        $(".tota11y-outlined").removeClass("tota11y-outlined");
        $(document).off("mousemove.wand");
    }
}

module.exports = A11yTextWand;
