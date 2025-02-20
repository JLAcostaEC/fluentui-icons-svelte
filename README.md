# Fluent UI Icons for Svelte

This repository provides a curated set of **Microsoft’s Fluent UI Icons**, converted into **Svelte 5** components with the help of the [svgtosvelte](https://github.com/JLAcostaEC/svgtosvelte) CLI.

> [!NOTE]
> This repository is not affiliated with or connected to Microsoft in any way. It is merely an open-source package that provides their icons to use with Svelte 5 applications.

## Features

- **Microsoft Fluent UI Icons** – Taken from the official [Microsoft Open-Source Figma File](https://www.figma.com/community/file/836835755999342788).
- **Icons exported by Colton Griffith** – You can visit his repository [here.](https://github.com/coltongriffith/fluenticons) Thank You.
- **Some Colored Icons** – Available some color icons extracted from [Ofiicial Package](https://github.com/microsoft/fluentui-system-icons/tree/main/packages/svg-icons).
- **Easy to Integrate** – Simply import the icon components you need and place them directly into your Svelte Apps.
- **Customization Supported** – Pass props (e.g., `size`, `color`) to easily adjust icon appearance.

## Installation

You can install the library using your preferred package manager:

```
npm install -D fluentui-icons-svelte
```

```
pnpm add -D fluentui-icons-svelte
```

```
yarn add -D fluentui-icons-svelte
```

## Usage

### Base import:

```svelte
<script>
	import { AddCircleFilled } from 'fluentui-icons-svelte';
</script>

<AddCircleFilled />
```

### Direct import (recommended):

Import the icon directly for faster compiling during development.

```svelte
<script>
	import AddCircleFilled from 'fluentui-icons-svelte/AddCircleFilled.svelte';
</script>

<AddCircleFilled />
```

Customize by passing props like size or color:

```svelte
<AddCircleFilled size="32" color="#0078D4" />
```

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for:

- New icons.
- Bug fixes.
- Feature suggestions.
- Documentation improvements.

## License

This project is licensed under the MIT License. The icons are derived from Microsoft’s Fluent UI Iconography with the license: CC BY 4.0. Microsoft’s Colored Icons from official package are under MIT license.

**Thank you for using the Fluent UI Icons for Svelte library!** If you have any questions or feedback, please don’t hesitate to open an issue or reach out.
