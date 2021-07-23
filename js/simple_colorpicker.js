/*
 * Simple colorpicker
 * Copyright 2021
 * Author: Jan Krajic
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Project: https://github.com/krajicj/simple_colorpicker
 */

function SimpleColorpicker() {
  //Make context of this function visible in all code
  let _this = this;
  let _options = {};

  //Set options or the default ones
  this.setOptions = (options) => {
    _options = {
      iconSize: options.iconSize,
      gridCols: options.gridCols,
      colors: options.colors || [
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00ACC1",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722",
        "#F44336",
        "#E91E63",
        "#673AB7",
        "#9C27B0",
        "#9E9E9E",
        "#607D8B",
        "#795548",
        "#474747",
      ],
    };
  };

  this.colorpicker = (el = null) => {
    //Elements to bind colorpickers
    let elements = [];

    //Toggle call on element or call for all classes
    if (el) {
      elements = [...el];
    } else {
      elements = document.querySelectorAll(".simple-colorpicker");
    }

    //Bind pickers to the elements
    elements.forEach((inputElement) => {
      inputElement.style.display = "none";
      //Create picker icon
      const pickerIcon = document.createElement("div");
      pickerIcon.classList.add("sc-color-icon");

      //Style picker icon
      if (_options.iconSize) {
        pickerIcon.style.width = _options.iconSize;
        pickerIcon.style.height = _options.iconSize;
        pickerIcon.style.borderRadius = _options.iconSize;
      }

      //Set init color
      pickerIcon.style.backgroundColor =
        inputElement.value || _options.colors[0];

      inputElement.parentNode.insertBefore(
        pickerIcon,
        inputElement.nextSibling
      );

      //Create picker
      createPicker(pickerIcon, inputElement, pickerIcon);
    });
  };

  function createPicker(pickerIcon, inputElement, pickerIcon) {
    //Create picker
    const picker = document.createElement("div");
    picker.classList.add("sc-color-picker");
    picker.style.display = "none";

    //TODO create picker label

    //Create colors block
    const pickerColors = document.createElement("div");
    pickerColors.classList.add("sc-color-picker-colors");
    if (_options.gridCols) {
      pickerColors.style.gridTemplateColumns = `repeat(${_options.gridCols}, 1fr)`;
    }
    picker.appendChild(pickerColors);

    //Create and add colors to the picker
    _options.colors.forEach((color) => {
      const colorItem = document.createElement("div");
      colorItem.classList.add("sc-color-item");
      colorItem.dataset.color = color;
      colorItem.style.backgroundColor = color;
      pickerColors.appendChild(colorItem);

      //Bind selecting event
      colorItem.addEventListener("click", (el) => {
        selectColor(el.target, inputElement, picker, pickerIcon);
      });
    });

    pickerIcon.parentNode.insertBefore(picker, pickerIcon.nextSibling);

    //Bind showing
    pickerIcon.addEventListener("click", () => {
      togglePicker(picker);
    });
  }

  //Show and hide picker
  function togglePicker(picker) {
    if (picker.classList.contains("active")) {
      picker.classList.remove("active");
      picker.style.display = "none";
    } else {
      picker.classList.add("active");
      picker.style.display = "block";
    }
  }

  //Select color from the picker
  function selectColor(colorItem, inputElement, picker, pickerIcon) {
    //Set selected value to the input
    inputElement.value = colorItem.dataset.color;
    //Hide picker
    togglePicker(picker);
    //Set icon new color
    pickerIcon.style.backgroundColor = colorItem.dataset.color;
  }
}

//Init all inputs with simple-colorpicker class
let simpleColorpicker = new SimpleColorpicker();
simpleColorpicker.setOptions({});
simpleColorpicker.colorpicker();

//Add prototype function to html elements
HTMLElement.prototype.colorpicker = (options, el) => {
  simpleColorpicker.setOptions(options);
  simpleColorpicker.colorpicker(el);
  return simpleColorpicker;
};
