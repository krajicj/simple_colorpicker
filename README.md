# Simple colorpicker

Small fancy color picker without dependencies and easy to use.

![alt text](https://github.com/[krajicj]/[simple_colorpicker]/examples/[main]/screenshot.png?raw=true)

## Description

You can use this colorpicker for specified colors picking

## Getting Started

### Dependencies

- no dependencies

### Installing

- Link the simple_colorpicker.js to the end of the body
- Link the simple_colorpicker.css file in the head of your app

### Usage

- Just add input with class simple-colorpicker

```
<input class="simple-colorpicker">
```

## Settings

You can customize colorpicker by calling

```
 const simpleColorpicker = new SimpleColorpicker({
    iconSize: '1rem',
    colorItemSize: '1rem',
    gridCols: 5,
    position: 'top',
    label: ''
    colors: ["#3F51B5","#2196F3", ...]
});

simpleColorpicker.colorpicker(document.querySelectorAll('.my-simple-colorpicker'));
```

## Authors

Contributors names and contact info

ex. Jan Krajíc
ex. [@krajicj](https://twitter.com/krajicj)

## License

This project is licensed under the [MIT] License
