<p align="center">
  <img src="https://res.cloudinary.com/dyetf2h9n/image/upload/v1762950787/logo_qu3hmh.png" alt="CappyUI Logo" width="80" height="80" />
</p>

<h1 align="center">CappyUI</h1>

<p align="center">
  <strong>Beautiful, animated React components you can copy and paste into your apps.</strong>
</p>

<p align="center">
  Built with React, Tailwind CSS, and Framer Motion.
</p>

<p align="center">
  <a href="https://ui.cappychat.com">Documentation</a> ·
  <a href="https://github.com/VrandaaGarg/cappyui">GitHub</a> ·
  <a href="https://ui.cappychat.com/docs">Components</a>
</p>

---

## About

CappyUI is a modern, open-source UI component library designed for Next.js applications. Each component is carefully crafted with smooth animations, responsive design, and full TypeScript support. Simply copy and paste the components you need into your project.

## Features

- **Copy & Paste** - No npm install needed. Just copy the code and use it.
- **Modern Design** - Clean, contemporary components that look great out of the box
- **Smooth Animations** - Powered by Framer Motion for fluid, performant animations
- **Fully Customizable** - Built with Tailwind CSS for easy theming and styling
- **Responsive** - Mobile-first design that works beautifully on all devices
- **TypeScript Ready** - Full TypeScript support with comprehensive type definitions
- **Dark Mode** - All components support light and dark themes
- **Accessible** - Built with accessibility best practices

## Tech Stack

| Technology | Description |
|------------|-------------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | Animation library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Fumadocs](https://fumadocs.dev/) | Documentation framework |
| [Lucide React](https://lucide.dev/) | Icon library |

## Components

CappyUI includes 18+ beautifully designed components:

| Component | Description |
|-----------|-------------|
| AI Chat | Interactive AI chat interface |
| Biometric Security | Fingerprint/face authentication UI |
| Book Appointment | Date and time booking component |
| Calendar Current | Single date calendar picker |
| Calendar Range | Date range selection calendar |
| Chat Input Box | Rich chat input with attachments |
| Image Puzzle | Interactive image puzzle game |
| Multi-Factor Auth | 2FA/MFA verification UI |
| Pin Chat | Pinned messages interface |
| Puzzle | Sliding puzzle game component |
| Real-Time Editor | Collaborative text editor |
| Resume Builder | Interactive resume creation UI |
| Secure App | Security verification screen |
| Secure Vault | Password vault interface |
| Spam Notifications | Notification management UI |
| Team Card | Team member display cards |
| Tool Grid | App/tool launcher grid |
| Wave Effect Card | Card with wave hover effect |

## Quick Start

### Prerequisites

Make sure you have a Next.js project with Tailwind CSS set up.

### Install Dependencies

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### Add Components via CLI

```bash
npx shadcn@latest add https://uiregistry.cappychat.com/registry/calendar-current.json
```

### Or Copy Manually

Visit [ui.cappychat.com/docs](https://ui.cappychat.com/docs), browse components, and copy the code directly into your project.

## Development

```bash
# Clone the repository
git clone https://github.com/VrandaaGarg/cappyui.git
cd cappyui

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

## Project Structure

```
cappyui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/            # Landing page
│   │   ├── docs/              # Documentation pages
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── AIapplicationsComponents/  # AI-related components
│   │   ├── components/        # Main UI components
│   │   └── ui/                # Base UI primitives
│   └── lib/                   # Utilities
├── content/docs/              # MDX documentation files
├── registry/                  # Component registry JSON files
└── public/prompts/            # AI prompt templates
```

## Contributing

Contributions are welcome! If you have ideas for new components or improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-component`)
3. Commit your changes (`git commit -m 'Add amazing component'`)
4. Push to the branch (`git push origin feature/amazing-component`)
5. Open a Pull Request

## Author

**Vranda Garg**

- GitHub: [@VrandaaGarg](https://github.com/VrandaaGarg)
- Website: [ui.cappychat.com](https://ui.cappychat.com)

## License

MIT License - feel free to use these components in your projects, both personal and commercial.

---

<p align="center">
  <sub>Built with love for the developer community</sub>
</p>
