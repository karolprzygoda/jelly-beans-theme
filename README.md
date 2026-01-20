# Jellybeans Low Contrast – VS Code Theme

A low-contrast port of the classic **jellybeans.vim** color scheme for VS Code, featuring consistent syntax highlighting, subtle borders, and a cohesive dark aesthetic.

> **Disclaimer**: This theme was created for personal use and may contain edge cases or incomplete coverage for certain language features or VS Code UI elements. Use at your own discretion.

## Features

- **Low-contrast workbench** – Most UI elements use a background color very close to `editor.background` (`#151515`)
- **Subtle borders instead of high-contrast backgrounds** for panels, sidebars, and lists
- **Consistent semantic coloring** – Functions (including calls like `setIsOpen`) use the same color throughout, as do types and properties
- **Git decorations** styled with Jellybeans palette colors
- **Bracket pair colorization** matching the theme's color scheme

## Screenshots

![TypeScript Example](screenshots/typescript.png)
![React/JSX Example](screenshots/react.png)
![Python Example](screenshots/python.png)
![HTML/CSS Example](screenshots/html-css.png)


## Installation

### Local Development

1. Open this folder in VS Code (`File -> Open Folder...`)
2. Press `F5` to launch the "Extension Development Host"
3. In the new VS Code window, go to `Preferences -> Color Theme` and select **Jellybeans Low Contrast**

### Build Package

To create a `.vsix` package for distribution:

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the generated `.vsix` file via `Extensions -> ... -> Install from VSIX`

## Color Palette

Based on the original Jellybeans.vim palette:

- **Foreground**: `#e8e8d3`
- **Background**: `#151515`
- **Functions**: `#fad07a` (Goldenrod)
- **Types**: `#cf6a4c` (Raw Sienna)
- **Strings**: `#99ad6a` (Green Smoke)
- **Keywords**: `#8197BF` (Ship Cove)
- **Numbers**: `#cf6a4c` (Raw Sienna)

## Examples

See the `examples/` directory for code samples in various languages demonstrating the theme's syntax highlighting.

## Credits

- Original Jellybeans theme: [nanotech/jellybeans.vim](https://github.com/nanotech/jellybeans.vim)
- Ported and adapted for VS Code with low-contrast workbench styling

## License

MIT License - see [LICENSE](LICENSE) file for details.
