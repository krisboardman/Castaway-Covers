# TailwindCSS Styling Skill

You are a TailwindCSS expert specializing in the Castaway Covers e-commerce application design system.

## Project Context

- **Framework**: TailwindCSS 3.4.0
- **Config**: `tailwind.config.js`
- **Global Styles**: `src/app/globals.css`
- **PostCSS**: Configured for Tailwind processing

## Brand Design System

### Brand Colors

```javascript
// Primary Brand Colors
'brand-teal': '#2C8B80'         // Main brand teal
'brand-teal-light': '#3BA599'   // Lighter shade for hover states
'brand-teal-dark': '#1F6259'    // Darker shade for emphasis
'brand-sand': '#F5E6D3'         // Accent sand/beige color

// System Colors
'background': '#ffffff' (light) / '#0a0a0a' (dark)
'foreground': '#171717' (light) / '#ededed' (dark)
```

### Typography

**Font Families**:
- `font-poppins` - Primary font (body text, headings)
- `font-playfair` - Decorative serif (special headings)

**Font Weights**:
- 400 - Regular (body text)
- 600 - Semi-bold (h2, h3)
- 700 - Bold (h1, emphasis)

**Pre-styled Elements** (in globals.css):
```css
h1 - 2.25rem (36px), font-weight: 700, Poppins
h2 - 1.875rem (30px), font-weight: 600, Poppins
h3 - 1.25rem (20px), font-weight: 600, Poppins
p, li - Regular weight, 1.75 line-height
```

## Common Patterns

### 1. Container Layout
```tsx
<div className="container mx-auto px-4 py-8">
  {/* Content */}
</div>
```

### 2. Hero Sections
```tsx
<section className="relative h-screen flex items-center justify-center bg-brand-sand">
  <div className="text-center">
    <h1 className="text-4xl md:text-6xl font-bold text-brand-teal mb-4">
      Hero Title
    </h1>
    <p className="text-lg md:text-xl text-gray-700">
      Subtitle text
    </p>
  </div>
</section>
```

### 3. Cards
```tsx
<div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-semibold text-brand-teal mb-2">
    Card Title
  </h3>
  <p className="text-gray-600">
    Card content
  </p>
</div>
```

### 4. Buttons

**Primary Button**:
```tsx
<button className="bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
  Primary Action
</button>
```

**Secondary Button**:
```tsx
<button className="border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200">
  Secondary Action
</button>
```

**Outline Button**:
```tsx
<button className="border border-gray-300 text-gray-700 hover:border-brand-teal hover:text-brand-teal font-medium px-4 py-2 rounded transition-colors">
  Outline Button
</button>
```

### 5. Form Inputs
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
  placeholder="Enter text"
/>

<select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white">
  <option>Select option</option>
</select>

<textarea
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
  rows={4}
  placeholder="Enter message"
/>
```

### 6. Navigation
```tsx
<nav className="bg-white shadow-md">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <a href="/" className="text-brand-teal font-bold text-xl">
        Logo
      </a>
      <div className="flex space-x-6">
        <a href="/products" className="text-gray-700 hover:text-brand-teal transition-colors">
          Products
        </a>
        <a href="/about" className="text-gray-700 hover:text-brand-teal transition-colors">
          About
        </a>
      </div>
    </div>
  </div>
</nav>
```

### 7. Grid Layouts

**Product Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Product cards */}
</div>
```

**Two Column Layout**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div>{/* Content */}</div>
  <div>{/* Image */}</div>
</div>
```

### 8. Responsive Design

**Breakpoints**:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

**Common Responsive Patterns**:
```tsx
// Text sizing
<h1 className="text-2xl md:text-4xl lg:text-5xl">

// Spacing
<div className="px-4 md:px-8 lg:px-12">

// Display
<div className="hidden md:block">

// Flex direction
<div className="flex flex-col md:flex-row">
```

## Custom Utilities (from globals.css)

```css
/* Already available as utility classes */
.text-brand-teal      /* color: #2C8B80 */
.bg-brand-teal        /* background: #2C8B80 */
.hover:bg-brand-teal-dark:hover  /* hover background */
```

## Best Practices

### 1. Spacing Consistency
Use Tailwind's spacing scale (4px increments):
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

### 2. Color Usage
- **Primary actions**: `bg-brand-teal`
- **Hover states**: `hover:bg-brand-teal-dark`
- **Accents/backgrounds**: `bg-brand-sand`
- **Text on teal**: Always use `text-white`
- **Body text**: `text-gray-700` or `text-gray-600`

### 3. Transitions
Always add smooth transitions to interactive elements:
```tsx
className="transition-colors duration-200"
className="transition-all duration-300"
className="transition-transform hover:scale-105"
```

### 4. Focus States
Always include focus states for accessibility:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-brand-teal"
```

### 5. Shadow Usage
- Cards: `shadow-lg`
- Hover effect: `hover:shadow-xl`
- Navigation: `shadow-md`

### 6. Border Radius
- Buttons/inputs: `rounded-lg` (8px)
- Cards: `rounded-lg`
- Pills: `rounded-full`

## Component Examples

### Product Card
```tsx
<div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
  <div className="relative h-64">
    <Image
      src="/images/product.jpg"
      alt="Product"
      fill
      className="object-cover"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-brand-teal mb-2">
      Product Name
    </h3>
    <p className="text-gray-600 mb-4">
      Product description
    </p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-brand-teal">
        $99.99
      </span>
      <button className="bg-brand-teal hover:bg-brand-teal-dark text-white px-6 py-2 rounded-lg transition-colors">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

### Section Header
```tsx
<div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4">
    Section Title
  </h2>
  <div className="w-24 h-1 bg-brand-teal mx-auto mb-4"></div>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    Section description goes here
  </p>
</div>
```

### Call-to-Action Banner
```tsx
<section className="bg-brand-teal py-16">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
      Ready to Get Started?
    </h2>
    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
      Join thousands of satisfied customers
    </p>
    <button className="bg-white text-brand-teal hover:bg-brand-sand font-semibold px-8 py-3 rounded-lg transition-colors">
      Shop Now
    </button>
  </div>
</section>
```

## Debugging Tips

### 1. Check Tailwind Config
```bash
# Verify config is loaded
npx tailwindcss -i src/app/globals.css -o - --watch
```

### 2. Purge Issues
Ensure class names are not dynamically constructed:
```tsx
// ❌ Bad - may get purged
const color = 'teal'
<div className={`bg-brand-${color}`}>

// ✅ Good - complete class names
<div className="bg-brand-teal">
```

### 3. Custom Classes Not Working
- Check `tailwind.config.js` content paths include your files
- Ensure `globals.css` imports Tailwind directives
- Restart dev server after config changes

## Performance Tips

1. **Use Tailwind utilities** instead of custom CSS when possible
2. **Avoid @apply** in favor of component extraction
3. **Use JIT mode** (enabled by default in v3+)
4. **Group related utilities** for readability

## Accessibility

Always include:
- Focus states: `focus:ring-2 focus:ring-brand-teal`
- Color contrast: Ensure text meets WCAG standards
- Screen reader text: Use `sr-only` for hidden labels
- ARIA attributes for interactive elements

## When to Use This Skill

- Styling new components or pages
- Implementing responsive designs
- Creating consistent UI patterns
- Debugging styling issues
- Optimizing CSS performance
- Ensuring brand consistency
- Improving accessibility
