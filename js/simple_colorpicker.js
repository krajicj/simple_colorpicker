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
  let _arrowHeight = 10;

  //Set options or the default ones
  this.setOptions = (options) => {
    _options = {
      iconSize: options.iconSize,
      gridCols: options.gridCols,
      position: options.position || "left",
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

  //Function that init the colorpicker
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
      togglePicker(picker, pickerIcon);
    });
  }

  //Show and hide picker
  function togglePicker(picker, pickerIcon) {
    if (picker.classList.contains("active")) {
      picker.classList.remove("active");
      picker.style.display = "none";
    } else {
      picker.classList.add("active");
      picker.style.display = "block";
      placePicker(picker, pickerIcon, _options.position);
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

  //Place picker to the specified position if there is a place
  function placePicker(picker, pickerIcon, position) {
    const pickerBound = picker.getBoundingClientRect();
    const iconBound = pickerIcon.getBoundingClientRect();

    const allPostions = ["top", "right", "bottom", "left"];

    let coords = calculateCoords(pickerBound, iconBound, position);
    //If does not fit check other position
    if (!coords.doesFit) {
      for(let i = 0; i < allPostions.length; i++){
        coords = calculateCoords(pickerBound, iconBound, allPostions[i]);
        console.log(position);
        console.log(coords);

        if (coords.doesFit) break;
      }
    }
    console.log(coords);

    picker.style.top = `${coords.top}px`;
    picker.style.left = `${coords.left}px`;
  }

  function calculateCoords(pickerBound, iconBound, position) {
    let top, left;
    switch (position) {
      case "top":
        left = iconBound.left + iconBound.width / 2 - pickerBound.width / 2;
        top = iconBound.top - pickerBound.height - _arrowHeight;
        break;
      case "right":
        left = iconBound.left + iconBound.width + _arrowHeight;
        top = iconBound.top + iconBound.height / 2 - pickerBound.height / 2;
        break;
      case "bottom":
        left = iconBound.left + iconBound.width / 2 - pickerBound.width / 2;
        top = iconBound.top + iconBound.height + _arrowHeight;
        break;
      case "left":
        left = iconBound.left - pickerBound.width - _arrowHeight;
        top = iconBound.top + iconBound.height / 2 - pickerBound.height / 2;
        break;
    }

    //Check enought place
    const doesFit = checkPositionPlace(pickerBound.width, pickerBound.height, {
      left,
      top,
    }, position);

    return { left, top, doesFit };
  }

  function checkPositionPlace(width, height, coords, position) {
    let fit = true;
    switch (position) {
      case "top":
        if (
          coords.top < 0 ||
          coords.left < 0 ||
          coords.left + width > window.innerWidth
        )
          fit = false;
        break;
      case "right":
        if (
          coords.left + width > window.innerWidth ||
          coords.top < 0 ||
          coords.top + height + _arrowHeight > window.innerHeight
        )
          fit = false;
        break;
      case "bottom":
        if (
          coords.top + height + _arrowHeight > window.innerHeight ||
          coords.left < 0 ||
          coords.left + width > window.innerWidth
        )
          fit = false;
        break;
      case "left":
        if (
          coords.left < 0 ||
          coords.top < 0 ||
          coords.top + height + _arrowHeight > window.innerHeight
        )
          fit = false;
        break;
    }
    return fit;
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
