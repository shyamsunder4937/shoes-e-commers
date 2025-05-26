# 3D Shoe Customizer

An interactive 3D shoe customization web application built with React, Three.js, and Material-UI.

## Features

- Interactive 3D shoe model viewing
- Real-time color customization
- Automatic and manual rotation controls
- Responsive design for mobile and desktop
- Modern, intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git LFS (for handling large 3D model files)

## Installation

1. Install Git LFS:
```bash
# For Windows (using Chocolatey)
choco install git-lfs

# For macOS (using Homebrew)
brew install git-lfs

# For Ubuntu/Debian
sudo apt install git-lfs

# Initialize Git LFS
git lfs install
```

2. Clone the repository:
```bash
git clone <repository-url>
cd shoe-customizer

# Pull LFS files
git lfs pull
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

## Required Dependencies

Add these dependencies to your project:
```bash
npm install @react-three/fiber @react-three/drei three @mui/material @mui/icons-material @emotion/react @emotion/styled
# or
yarn add @react-three/fiber @react-three/drei three @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
shoe/
├── src/
│   ├── components/
│   │   ├── Home.tsx           # Main application component
│   │   ├── ColorCom.tsx      # Color selector component
│   │   ├── Appbar.tsx        # Application header
│   │   └── three/
│   │       └── ShowRoom.tsx  # 3D scene component
│   ├── shoes.scss            # Styles
│   └── main.tsx             # Entry point
├── public/
│   └── models/              # 3D model files (handled by Git LFS)
└── package.json             # Project dependencies
```

## Usage

1. Launch the application
2. Use the color palette to select different colors
3. Click on any part of the shoe to apply the selected color
4. Use the rotation controls to view the shoe from different angles:
   - Auto-rotate button for continuous rotation
   - Manual left/right rotation buttons
   - Mouse/touch drag for free rotation
5. Additional features:
   - Help panel for usage instructions
   - Screenshot functionality
   - Share and reset options

## Working with 3D Models

The project uses Git LFS to handle large 3D model files. When adding new models:
1. Make sure Git LFS is installed and initialized
2. Place model files in the `public/models` directory
3. Files with extensions `.glb`, `.gltf`, `.fbx`, `.obj`, and `.bin` are automatically handled by Git LFS
4. Commit and push as usual - Git LFS will handle the large files

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Large File Issues
If you encounter issues with large files when pushing to GitHub:
1. Make sure Git LFS is installed: `git lfs install`
2. Track large files: `git lfs track "*.glb"`
3. Migrate existing files to LFS: `git lfs migrate import --include="*.glb"`
4. Push changes: `git push origin main`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 