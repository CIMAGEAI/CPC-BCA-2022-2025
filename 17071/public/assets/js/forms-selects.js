/**
 * Selects & Tags
 */

"use strict";

$(function () {
    const selectPicker = $(".selectpicker"),
        select2 = $(".select2"),
        select2Icons = $(".select2-icons");

    // Bootstrap Select
    // --------------------------------------------------------------------
    if (selectPicker.length) {
        selectPicker.selectpicker();
    }

    // Select2
    // --------------------------------------------------------------------
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // Default
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            $this.wrap('<div class="position-relative"></div>').select2({
                placeholder:
                    "Select " + capitalizeFirstLetter($this.attr("label")),
                dropdownParent: $this.parent(),
            });
        });
    }

    // Select2 Icons
    if (select2Icons.length) {
        // custom template to render icons
        function renderIcons(option) {
            if (!option.id) {
                return option.text;
            }
            var $icon =
                "<i class='" +
                $(option.element).data("icon") +
                " me-2'></i>" +
                option.text;

            return $icon;
        }
        select2Focus(select2Icons);
        select2Icons.wrap('<div class="position-relative"></div>').select2({
            templateResult: renderIcons,
            templateSelection: renderIcons,
            escapeMarkup: function (es) {
                return es;
            },
        });
    }
});
