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

function SimpleColorpicker(options = {}) {
  //Make context of this function visible in all code
  let _this = this;
  let _options = {};
  let _arrowSize = 10;
  const _allPostions = [
    "top",
    "right",
    "bottom",
    "left",
    "bottom-right",
    "bottom-left",
  ];

  //Set options
  setOptions(options);

  //Set options or the default ones
  function setOptions(options) {
    _options = {
      //Size of the picker icon
      iconSize: options.iconSize,
      //Size of the colors in the picker
      colorItemSize: options.colorItemSize,
      //Number of cols in the picker
      gridCols: options.gridCols,
      //Prefered position of the picker
      position: options.position || "top",
      //Label for the picker
      label: options.label,
      //Array of colors which will be in the picker
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
  }

  /**
   * Init simple color picker on the specific element or on all with specific class
   *
   * @param {object} el input element
   */
  this.colorpicker = (el = null) => {
    //Elements to bind colorpickers
    let elements = [];

    //Toggle call on element or call for all classes
    if (el) {
      if (isIterable(el)) {
        elements = [...el];
      } else {
        elements.push(el);
      }
    } else {
      elements = document.querySelectorAll(".simple-colorpicker");
    }

    //Bind pickers to the elements
    elements.forEach((inputElement) => {
      //Remove picker if allready binded
      if (inputElement.classList.contains("sc-binded")) {
        removePicker(inputElement);
      }
      //Hide input
      inputElement.style.display = "none";
      inputElement.classList.add("sc-binded");

      //Create picker wrapper
      const pickerWrapper = document.createElement("div");
      pickerWrapper.classList.add("sc-wrapper");

      //Create picker icon
      const pickerIcon = document.createElement("div");
      pickerIcon.classList.add("sc-color-icon");
      const pickerIconInner = document.createElement("div");
      pickerIconInner.classList.add("sc-color-icon-inner");
      pickerIcon.appendChild(pickerIconInner);

      //Style picker icon
      if (_options.iconSize) {
        pickerIcon.style.width = _options.iconSize;
        pickerIcon.style.height = _options.iconSize;
        pickerIcon.style.borderRadius = _options.iconSize;
      }

      //Set init color
      pickerIconInner.style.backgroundColor =
        inputElement.value || _options.colors[0];

      //Insert picker wrapper to the dom
      inputElement.parentNode.insertBefore(
        pickerWrapper,
        inputElement.nextSibling
      );

      //Insert input and icon to the wrapper
      pickerWrapper.appendChild(inputElement);
      pickerWrapper.appendChild(pickerIcon);

      //Create picker
      createPicker(pickerIcon, inputElement);
    });
  };

  /**
   * Remove picker and bindings
   * @param {object} inputElement 
   */
  function removePicker(inputElement) {
    //Show original input
    inputElement.style.display = "block";
    inputElement.classList.remove("sc-binded");
    //Find wrapper
    const wrapper = inputElement.closest(".sc-wrapper");

    //Remove input element from the wrapper
    wrapper.parentNode.insertBefore(inputElement, wrapper.nextSibling);
    //Remove wrapper with picker
    wrapper.remove();
  }

  /**
   * Create a picker element
   *
   * @param {object} pickerIcon picker icon element
   * @param {object} inputElement picker input element
   */
  function createPicker(pickerIcon, inputElement) {
    //Create picker
    const picker = document.createElement("div");
    picker.classList.add("sc-color-picker");
    picker.style.display = "none";

    //Create picker label
    if (_options.label) {
      const label = document.createElement("div");
      label.classList.add("sc-color-picker-label");
      label.innerText = _options.label;
      picker.appendChild(label);
    }

    //Create colors block
    const pickerColors = document.createElement("div");
    pickerColors.classList.add("sc-color-picker-colors");
    if (_options.gridCols) {
      pickerColors.style.gridTemplateColumns = `repeat(${_options.gridCols}, 1fr)`;
    }
    picker.appendChild(pickerColors);

    //Create and add colors to the picker
    _options.colors.forEach((color) => {
      const colorItem = createColorItem(color);

      pickerColors.appendChild(colorItem);

      //Bind selecting event
      colorItem.addEventListener("click", (el) => {
        selectColor(el.target, inputElement, picker, pickerIcon);
      });
    });

    pickerIcon.parentNode.insertBefore(picker, pickerIcon.nextSibling);

    //Bind hiding if click outside
    document.addEventListener("mouseup", function (e) {
      if (!picker.contains(e.target) && !pickerIcon.contains(e.target)) {
        hidePicker(picker);
      }
    });

    //Bind showing
    pickerIcon.addEventListener("click", () => {
      togglePicker(picker, pickerIcon);
    });
  }

  /**
   * Crate color item for the picker
   *
   * @param {string} color hex color with leading hashmark
   * @returns color item element
   */
  function createColorItem(color) {
    const colorItem = document.createElement("div");
    colorItem.classList.add("sc-color-item");
    colorItem.dataset.color = color;
    colorItem.style.backgroundColor = color;

    if (_options.colorItemSize) {
      colorItem.style.width = _options.colorItemSize;
      colorItem.style.height = _options.colorItemSize;
    }

    return colorItem;
  }

  /**
   * Show and hide picker
   *
   * @param {object} picker picker element
   * @param {object} pickerIcon picker icon element
   */
  function togglePicker(picker, pickerIcon) {
    if (picker.classList.contains("active")) {
      hidePicker(picker);
    } else {
      openPicker(picker);
      placePicker(picker, pickerIcon, _options.position);
    }
  }

  /**
   * Open picker window
   *
   * @param {object} picker picker element
   */
  function openPicker(picker) {
    picker.classList.add("active");
    picker.style.display = "block";
  }

  /**
   * Hide picker element
   *
   * @param {object} picker picker element
   */
  function hidePicker(picker) {
    picker.classList.remove("active");
    picker.style.display = "none";
    removeArrowFromPicker(picker);
  }

  /**
   * Select color from the picker, close picker and set selected color to the icon
   *
   * @param {object} colorItem selected color item
   * @param {object} inputElement picker input element
   * @param {object} picker picker element
   * @param {object} pickerIcon picker icon element
   */
  function selectColor(colorItem, inputElement, picker, pickerIcon) {
    //Set selected value to the input
    inputElement.value = colorItem.dataset.color;
    //Hide picker
    togglePicker(picker);
    //Set icon new color
    pickerIcon.querySelector(".sc-color-icon-inner").style.backgroundColor =
      colorItem.dataset.color;
  }

  /**
   * Place picker to the specified position if there is
   * a place or select position where is space for picker
   *
   * @param {object} picker picker element
   * @param {object} pickerIcon icker icon element
   * @param {string} position prefered position to place
   */
  function placePicker(picker, pickerIcon, position) {
    //Get picker and icon boudaries
    const pickerBound = picker.getBoundingClientRect();
    const iconBound = pickerIcon.getBoundingClientRect();

    //Calculate prefered position
    let coords = calculateCoords(pickerBound, iconBound, position);

    //If does not fit check other position
    if (!coords.doesFit) {
      for (let i = 0; i < _allPostions.length; i++) {
        coords = calculateCoords(pickerBound, iconBound, _allPostions[i]);
        if (coords.doesFit) break;
      }
    }

    //Add arrow to the picker
    placeArrowToPicker(coords, picker);

    //Set position to the picker
    picker.style.top = `${coords.top}px`;
    picker.style.left = `${coords.left}px`;
  }

  /**
   * Calculates position coords of the picker based on the specified position
   *
   * @param {object} pickerBound object of picker boundary
   * @param {object} iconBound object of icon boundary
   * @param {string} position position to place a picker
   * @returns
   */
  function calculateCoords(pickerBound, iconBound, position) {
    let top, left;
    switch (position) {
      case "top":
        left = iconBound.left + iconBound.width / 2 - pickerBound.width / 2;
        top = iconBound.top - pickerBound.height - _arrowSize;
        break;
      case "right":
        left = iconBound.left + iconBound.width + _arrowSize;
        top = iconBound.top + iconBound.height / 2 - pickerBound.height / 2;
        break;
      case "bottom":
        left = iconBound.left + iconBound.width / 2 - pickerBound.width / 2;
        top = iconBound.top + iconBound.height + _arrowSize;
        break;
      case "left":
        left = iconBound.left - pickerBound.width - _arrowSize;
        top = iconBound.top + iconBound.height / 2 - pickerBound.height / 2;
        break;
      case "bottom-right":
        left = iconBound.left + iconBound.width + _arrowSize;
        top = iconBound.top + iconBound.height;
        break;
      case "bottom-left":
        left = iconBound.left - pickerBound.width - _arrowSize;
        top = iconBound.top + iconBound.height;
        break;
    }

    //Check enought place
    const doesFit = checkPositionPlace(
      pickerBound.width,
      pickerBound.height,
      {
        left,
        top,
      },
      position
    );

    return {
      left: left,
      top: top,
      width: pickerBound.width,
      height: pickerBound.height,
      doesFit: doesFit,
      position: position,
    };
  }

  /**
   * Check if the picker with specific size and coords can be placed to the specific position
   *
   * @param {number} width width of the picker
   * @param {number} height height of the picker
   * @param {object} coords left and top position of the picker
   * @param {string} position position to place a picker
   * @returns
   */
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
          coords.top + height + _arrowSize > window.innerHeight
        )
          fit = false;
        break;
      case "bottom":
        if (
          coords.top + height + _arrowSize > window.innerHeight ||
          coords.left < 0 ||
          coords.left + width > window.innerWidth
        )
          fit = false;
        break;
      case "left":
        if (
          coords.left < 0 ||
          coords.top < 0 ||
          coords.top + height + _arrowSize > window.innerHeight
        )
          fit = false;
        break;
      case "bottom-left":
        if (
          coords.left < 0 ||
          coords.top + height + _arrowSize > window.innerHeight
        )
          fit = false;
        break;
      case "bottom-right":
        if (
          coords.left + width > window.innerWidth ||
          coords.top + height + _arrowSize > window.innerHeight
        )
          fit = false;
        break;
    }
    return fit;
  }

  /**
   * Place arrow pointing from the picker to the picker icon
   *
   * @param {object} pickerCoords picker element coords
   * @param {object} picker picker element
   */
  function placeArrowToPicker(pickerCoords, picker) {
    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.classList.add(`arrow-${pickerCoords.position}`);
    picker.appendChild(arrow);

    arrowBound = arrow.getBoundingClientRect();
    let top, left;

    switch (pickerCoords.position) {
      case "top":
        top = pickerCoords.height;
        left = pickerCoords.width / 2 - arrowBound.width / 2;
        break;
      case "right":
        top = pickerCoords.height / 2 - arrowBound.height / 2;
        left = -arrowBound.width;
        break;
      case "bottom":
        top = -arrowBound.height;
        left = pickerCoords.width / 2 - arrowBound.width / 2;
        break;
      case "left":
        top = pickerCoords.height / 2 - arrowBound.height / 2;
        left = pickerCoords.width;
        break;
      case "bottom-left":
        console.log(arrowBound);
        top = 0;
        left = pickerCoords.width - arrowBound.width / 3;
        break;
      case "bottom-right":
        top = 0;
        left = 0;
        break;
    }
    //Set position to the arrow
    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
  }

  function removeArrowFromPicker(picker) {
    const arrow = picker.querySelector(".arrow");
    if (arrow) arrow.remove();
  }

  function isIterable(obj) {
    // Checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === "function";
  }
}

//Init all inputs with simple-colorpicker class
let simpleColorpicker = new SimpleColorpicker();
simpleColorpicker.colorpicker();
